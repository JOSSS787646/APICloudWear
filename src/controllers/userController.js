const User = require('../models/User');
const mongoose = require('mongoose');



/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios en CloudWear
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario con configuración inicial
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - fechaNacimiento
 *               - sexo
 *               - edad
 *               - datosLaborales
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Jose Antonio
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *                 example: 2000-05-15
 *               sexo:
 *                 type: string
 *                 example: Masculino
 *               edad:
 *                 type: integer
 *                 example: 24
 *               datosMedicos:
 *                 type: object
 *                 properties:
 *                   enfermedadCronica:
 *                     type: boolean
 *                     example: true
 *                   descripcion:
 *                     type: string
 *                     example: Diabetes
 *                   recomendacion:
 *                     type: string
 *                     example: Evitar comidas con azúcar
 *               datosLaborales:
 *                 type: object
 *                 required:
 *                   - turnoAsignado
 *                   - horaComida
 *                   - puesto
 *                   - area
 *                 properties:
 *                   turnoAsignado:
 *                     type: string
 *                     example: Turno A
 *                   horaComida:
 *                     type: string
 *                     example: "13:00"
 *                   puesto:
 *                     type: string
 *                     example: Supervisor
 *                   area:
 *                     type: string
 *                     example: Producción
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 eventosCollection:
 *                   type: string
 *                   example: eventos_jose_antonio
 *       409:
 *         description: El usuario ya existe
 *       500:
 *         description: Error interno del servidor
 */

exports.createUserWithSetup = async (req, res) => {
  try {
    const {
      nombre,
      fechaNacimiento,
      sexo,
      edad,
      datosMedicos,
      datosLaborales
    } = req.body;

    // Evitar duplicados por nombre + fechaNacimiento
    const existingUser = await User.findOne({ nombre, fechaNacimiento });
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    const newUser = new User({
      nombre,
      fechaNacimiento,
      sexo,
      edad,
      datosMedicos,
      datosLaborales,
      configuracionInicialCompleta: true
    });

    const savedUser = await newUser.save();

    // 🛠️ Crear colección personalizada para eventos del usuario
    const sanitizedName = nombre.toLowerCase().replace(/ /g, '_');
    const userCollectionName = `eventos_${sanitizedName}`;

    // Verificar si ya existe esa colección
    const existingCollections = await mongoose.connection.db
      .listCollections({ name: userCollectionName })
      .toArray();

    if (existingCollections.length === 0) {
      await mongoose.connection.db.createCollection(userCollectionName);
    }

    res.status(201).json({
      message: 'Usuario creado correctamente',
      user: savedUser,
      eventosCollection: userCollectionName
    });

  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar usuario completamente (PUT)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - fechaNacimiento
 *               - sexo
 *               - edad
 *               - datosLaborales
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Jose Antonio
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *                 example: 2000-05-15
 *               sexo:
 *                 type: string
 *                 example: Masculino
 *               edad:
 *                 type: integer
 *                 example: 24
 *               datosMedicos:
 *                 type: object
 *                 properties:
 *                   enfermedadCronica:
 *                     type: boolean
 *                     example: true
 *                   descripcion:
 *                     type: string
 *                     example: Diabetes
 *                   recomendacion:
 *                     type: string
 *                     example: Evitar comidas con azúcar
 *               datosLaborales:
 *                 type: object
 *                 required:
 *                   - turnoAsignado
 *                   - horaComida
 *                   - puesto
 *                   - area
 *                 properties:
 *                   turnoAsignado:
 *                     type: string
 *                     example: Turno A
 *                   horaComida:
 *                     type: string
 *                     example: "13:00"
 *                   puesto:
 *                     type: string
 *                     example: Supervisor
 *                   area:
 *                     type: string
 *                     example: Producción
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Faltan campos obligatorios para actualización completa
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

exports.updateUserComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      fechaNacimiento,
      sexo,
      edad,
      datosMedicos,
      datosLaborales
    } = req.body;

    // Validar campos obligatorios para PUT (actualización completa)
    if (!nombre || !fechaNacimiento || !sexo || edad === undefined || !datosLaborales) {
      return res.status(400).json({ message: 'Faltan campos obligatorios para actualización completa' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        nombre,
        fechaNacimiento,
        sexo,
        edad,
        datosMedicos: datosMedicos || {},
        datosLaborales
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error en actualización completa:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Actualizar usuario parcialmente (PATCH)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Campos a actualizar (uno o varios)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               nombre: Juan
 *               datosMedicos:
 *                 enfermedadCronica: false
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

exports.updateUserPartial = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Opcional: validaciones específicas por campos aquí

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error en actualización parcial:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f385f4f1bfc23a9d1a9b31
 *         nombre:
 *           type: string
 *           example: Jose Antonio
 *         fechaNacimiento:
 *           type: string
 *           format: date
 *           example: 2000-05-15
 *         sexo:
 *           type: string
 *           example: Masculino
 *         edad:
 *           type: integer
 *           example: 24
 *         datosMedicos:
 *           type: object
 *           properties:
 *             enfermedadCronica:
 *               type: boolean
 *               example: true
 *             descripcion:
 *               type: string
 *               example: Diabetes
 *             recomendacion:
 *               type: string
 *               example: Evitar comidas con azúcar
 *         datosLaborales:
 *           type: object
 *           properties:
 *             turnoAsignado:
 *               type: string
 *               example: Turno A
 *             horaComida:
 *               type: string
 *               example: "13:00"
 *             puesto:
 *               type: string
 *               example: Supervisor
 *             area:
 *               type: string
 *               example: Producción
 *         configuracionInicialCompleta:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-07-02T19:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-07-02T19:00:00Z
 */
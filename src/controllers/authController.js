const UserAuth = require('../models/UserAuth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un usuario nuevo
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Faltan datos obligatorios
 *       409:
 *         description: Usuario ya existe
 */
exports.register = async (req, res) => {
  try {
    const { nombre, password } = req.body;

    if (!nombre || !password) {
      return res.status(400).json({ message: 'Nombre y contraseña son obligatorios' });
    }

    const existingUser = await UserAuth.findOne({ nombre });
    if (existingUser) {
      return res.status(409).json({ message: 'El nombre ya está registrado' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new UserAuth({ nombre, passwordHash });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso y retorna token JWT
 *       400:
 *         description: Faltan datos obligatorios
 *       401:
 *         description: Credenciales incorrectas
 */
exports.login = async (req, res) => {
  try {
    const { nombre, password } = req.body;

    if (!nombre || !password) {
      return res.status(400).json({ message: 'Nombre y contraseña son obligatorios' });
    }

    const user = await UserAuth.findOne({ nombre });
    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrect) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: user._id, nombre: user.nombre }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      token, 
      nombre: user.nombre, 
      id: user._id // Aquí devuelves el ID
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};




/**
 * @swagger
 * /auth/register-full:
 *   post:
 *     summary: Registro completo del usuario (autenticación + datos personales)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - password
 *               - apellidoPaterno
 *               - apellidoMaterno
 *               - fechaNacimiento
 *               - edad
 *               - sexo
 *               - email
 *               - telefono
 *               - datosLaborales
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: joseantonio
 *               password:
 *                 type: string
 *                 example: Secreta123
 *               apellidoPaterno:
 *                 type: string
 *                 example: Martinez
 *               apellidoMaterno:
 *                 type: string
 *                 example: Lopez
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *                 example: 2000-05-15
 *               edad:
 *                 type: integer
 *                 example: 24
 *               sexo:
 *                 type: string
 *                 example: Masculino
 *               email:
 *                 type: string
 *                 example: jose@example.com
 *               telefono:
 *                 type: string
 *                 example: 5512345678
 *               datosLaborales:
 *                 type: object
 *                 required:
 *                   - numEmpleado
 *                   - turnoAsignado
 *                   - horaEntrada
 *                   - horaComida
 *                   - puesto
 *                   - area
 *                   - tipoContrato
 *                 properties:
 *                   numEmpleado:
 *                     type: string
 *                     example: EMP001
 *                   turnoAsignado:
 *                     type: string
 *                     example: Turno A
 *                   horaEntrada:
 *                     type: string
 *                     example: "08:00"
 *                   horaComida:
 *                     type: string
 *                     example: "13:00"
 *                   puesto:
 *                     type: string
 *                     example: Supervisor
 *                   area:
 *                     type: string
 *                     example: Producción
 *                   tipoContrato:
 *                     type: string
 *                     example: Indeterminado
 *               datosMedicos:
 *                 type: object
 *                 properties:
 *                   tipoSangre:
 *                     type: string
 *                     example: O+
 *                   enfermedadCronica:
 *                     type: boolean
 *                     example: false
 *                   nombreEnfermedad:
 *                     type: string
 *                     example: Diabetes
 *                   recomendaciones:
 *                     type: string
 *                     example: Evitar azúcar
 *                   alergias:
 *                     type: string
 *                     example: Penicilina
 *                   medicamentos:
 *                     type: string
 *                     example: Metformina
 *                   contactoEmergencia:
 *                     type: string
 *                     example: Juan Perez
 *                   telefonoEmergencia:
 *                     type: string
 *                     example: 5511122233
 *     responses:
 *       201:
 *         description: Registro completo exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registro completo exitoso
 *                 userAuth:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                 userProfile:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Faltan datos obligatorios
 *       409:
 *         description: El nombre ya está registrado
 *       500:
 *         description: Error interno del servidor
 */



exports.registerFull = async (req, res) => {
  try {
    const {
      nombre, password,
      apellidoPaterno, apellidoMaterno,
      fechaNacimiento, edad, sexo, email, telefono,
      datosLaborales, datosMedicos
    } = req.body;

    // Validaciones mínimas
    if (!nombre || !password || !fechaNacimiento || !edad || !sexo || !email || !telefono || !datosLaborales) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const existingUser = await UserAuth.findOne({ nombre });
    if (existingUser) {
      return res.status(409).json({ message: 'El nombre ya está registrado' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 1️⃣ Crear usuario de autenticación
    const authUser = new UserAuth({ nombre, passwordHash });
    await authUser.save();

    // 2️⃣ Crear datos extendidos y asociar authUserId
    const userData = new User({
      authUserId: authUser._id,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      fechaNacimiento,
      edad,
      sexo,
      email,
      telefono,
      datosLaborales,
      datosMedicos,
      configuracionInicialCompleta: true
    });

    const savedUser = await userData.save();

    res.status(201).json({
      message: 'Registro completo exitoso',
      userAuth: authUser,
      userProfile: savedUser
    });
  } catch (error) {
    console.error('❌ Error en registro completo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};




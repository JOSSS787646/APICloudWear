// controllers/datosBiometricosController.js
const { getRegistroModel } = require('../utils/registroHelper');
/**
 * @swagger
 * /biometricos:
 *   post:
 *     summary: Carga masiva de datos biométricos por usuario y día
 *     tags: [Datos Biometricos]
 *     description: >
 *       Este endpoint permite realizar una carga masiva de datos biométricos (ritmo cardíaco, acelerómetro y ubicación)
 *       para un usuario específico, agrupando los datos en una colección dinámica según el ID del usuario y la fecha actual (yyyyMMdd).
 *       Ideal para sincronizar datos recolectados localmente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 64f385f4f1bfc23a9d1a9b31
 *               datosCardiacos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: number
 *                       example: 1752041760000
 *                     frecuencia:
 *                       type: number
 *                       example: 72
 *               datosAcelerometro:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: number
 *                       example: 1752041760000
 *                     x:
 *                       type: number
 *                       example: -2.45
 *                     y:
 *                       type: number
 *                       example: 0.85
 *                     z:
 *                       type: number
 *                       example: 9.81
 *               datosUbicacion:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: number
 *                       example: 1752041760000
 *                     latitud:
 *                       type: number
 *                       example: 19.4326
 *                     longitud:
 *                       type: number
 *                       example: -99.1332
 *     responses:
 *       200:
 *         description: Datos guardados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Datos guardados correctamente
 *       400:
 *         description: userId requerido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: userId requerido
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */

exports.guardarDatosBiometricos = async (req, res) => {
  try {
    const { userId, datosCardiacos, datosAcelerometro, datosUbicacion } = req.body;

    if (!userId) return res.status(400).json({ message: 'userId requerido' });

    // Obtener fecha actual en formato yyyyMMdd
    const fechaActual = new Date();
    const fechaStr = fechaActual.toISOString().split('T')[0].replace(/-/g, ''); // yyyyMMdd

    // Obtener modelo de colección dinámica
    const Registro = getRegistroModel(userId, fechaStr);

    // Buscar documento del día, o crearlo
    let registro = await Registro.findOne({ userId, fecha: fechaStr });
    if (!registro) {
      registro = new Registro({ userId, fecha: fechaStr, datosCardiacos: [], datosAcelerometro: [], datosUbicacion: [] });
    }

    // Agregar nuevos datos (pueden venir en arreglo o individual)
    if (datosCardiacos) registro.datosCardiacos.push(...datosCardiacos);
    if (datosAcelerometro) registro.datosAcelerometro.push(...datosAcelerometro);
    if (datosUbicacion) registro.datosUbicacion.push(...datosUbicacion);

    await registro.save();

    res.status(200).json({ message: 'Datos guardados correctamente' });
  } catch (error) {
    console.error('❌ Error al guardar datos biométricos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

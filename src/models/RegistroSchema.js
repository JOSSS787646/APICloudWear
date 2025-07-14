// models/RegistroSchema.js
const mongoose = require('mongoose');

const datosCardiacosSchema = new mongoose.Schema({
  timestamp: { type: Number, required: true },
  frecuencia: { type: Number, required: true }
}, { _id: false });

const datosAcelerometroSchema = new mongoose.Schema({
  timestamp: { type: Number, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  z: { type: Number, required: true }
}, { _id: false });

const datosUbicacionSchema = new mongoose.Schema({
  timestamp: { type: Number, required: true },
  latitud: { type: Number, required: true },
  longitud: { type: Number, required: true }
}, { _id: false });

const registroSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  fecha: { type: String, required: true }, // formato: yyyyMMdd
  datosCardiacos: [datosCardiacosSchema],
  datosAcelerometro: [datosAcelerometroSchema],
  datosUbicacion: [datosUbicacionSchema]
}, { timestamps: true });

module.exports = registroSchema;

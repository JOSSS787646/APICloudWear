const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  authUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAuth',
    required: true,
    unique: true
  },

  // DATOS PERSONALES
  nombre: { type: String, required: true },
  apellidoPaterno: { type: String, required: true },
  apellidoMaterno: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  edad: { type: Number, required: true },
  sexo: {
  type: String,
  enum: ['Masculino', 'Femenino', 'Otro'],
  required: true
},
  email: { type: String, required: true },
  telefono: { type: String, required: true },

  // DATOS LABORALES
  datosLaborales: {
    numEmpleado: { type: String, required: true },
    turnoAsignado: { type: String, required: true },
    horaEntrada: { type: String, required: true },
    horaComida: { type: String, required: true },
    puesto: { type: String, required: true },
    area: { type: String, required: true },
    tipoContrato: { type: String, required: true }
  },

  // DATOS MÉDICOS
  datosMedicos: {
    tipoSangre: { type: String, default: null },
    enfermedadCronica: { type: Boolean, default: false },
    nombreEnfermedad: { type: String, default: null },
    recomendaciones: { type: String, default: null },
    alergias: { type: String, default: null },
    medicamentos: { type: String, default: null },
    contactoEmergencia: { type: String, default: null },
    telefonoEmergencia: { type: String, default: null }
  },

  // CONTROL DEL SISTEMA
  configuracionInicialCompleta: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🟢 Conectado a MongoDB correctamente');
  } catch (error) {
    console.error('🔴 Error al conectar a MongoDB:', error.message);
    process.exit(1); // Detiene la app si no hay conexión
  }
};

module.exports = connectDB;

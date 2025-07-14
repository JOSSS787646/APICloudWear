const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const datosBiometricosController = require('../controllers/datosBiometricosController');
const authController = require('../controllers/authController');

// Ruta home
router.get('/', homeController.index);

// Rutas Auth
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/register-full', authController.registerFull);

// Ruta para carga de datos biométricos
router.post('/biometricos', datosBiometricosController.guardarDatosBiometricos);

module.exports = router;

const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CloudWear API',
      version: '1.0.0',
      description: 'Documentación de la API CloudWear',
    },
    servers: [
      {
        url: '/',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Archivos donde pondrás anotaciones
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

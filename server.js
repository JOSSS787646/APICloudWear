const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/config/swagger');
const connectDB = require('./src/config/db');
const routes = require('./src/routes');

const app = express();
const port = 3005;

// Middlewares para parsear JSON y urlencoded con límite alto
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Middleware para logs de rutas
app.use((req, res, next) => {
  console.log(`👉 Ruta solicitada: ${req.method} ${req.url}`);
  next();
});

connectDB()
  .then(() => {
    // Montar rutas
    app.use('/', routes);

    // Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.listen(port, () => {
      console.log(`✅ CloudWear API escuchando en el puerto ${port}`);
      console.log(`📚 Swagger disponible en: http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar a la base de datos:', err);
  });

module.exports = app;

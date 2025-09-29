const path = require('path');
const rateLimit = require("express-rate-limit");

// Carga dotenv solo si no estamos en producción
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config({ path: path.resolve(__dirname, '../BACKEND/.env') });
}

// Importa los demás módulos
const express = require('express');
const songsRoutes = require('./ROUTES/songsRoutes');
const usersRoutes = require('./ROUTES/usersRoutes');
const errorMiddleware = require('./MIDDLEWARES/ErrorMiddleware');
const connectDB = require('./CONFIG/DB');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('PUBLIC'));

// Conectar a la base de datos
connectDB();

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Demasiadas peticiones. Intenta más tarde."
});
app.use(generalLimiter);

// Rutas
app.use('/songs', songsRoutes);
app.use('/users', usersRoutes);

// Middleware de errores
app.use(errorMiddleware);

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Server listen at http://localhost:${PORT} 🌐`);
});

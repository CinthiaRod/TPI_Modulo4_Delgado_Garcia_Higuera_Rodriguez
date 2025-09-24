
// Carga las variables de entorno
const path = require('path')
const rateLimit = require("express-rate-limit")
// Importa 'dotenv' y configura la ruta del archivo .env
const dotenvResult = require('dotenv').config({ path: path.resolve(__dirname, '../BACKEND/.env') }); 
if (dotenvResult.error) {
    console.error("Error loading .env file:", dotenvResult.error);
    process.exit(1); // Salir si no se puede cargar el archivo .env
};

// Importa los demás módulos
const express = require('express');
const songsRoutes = require('./ROUTES/songsRoutes');
const usersRoutes = require ('./ROUTES/usersRoutes')
const errorMiddleware = require('./MIDDLEWARES/ErrorMiddleware');

const connectDB = require('./CONFIG/DB'); // Función para conectar a la base de datos

// Crear app con express
const app = express();
const PORT = process.env.PORT || 3000; 

app.use(express.json()); 
app.use(express.static('PUBLIC'));

// Conectar a la base de datos
connectDB();

// Rate Limiting
const generalLimiter = rateLimit({
    windowMS: 15 * 60 * 1000, // 15 minutos
    max: 50,
    message: "Demasiadas peticiones. Intenta más tarde."
})

app.use(generalLimiter)

// Rutas de la API
app.use('/songs', songsRoutes); 
app.use('/users', usersRoutes); 

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server listen at http://localhost:${PORT} 🌐`);
});
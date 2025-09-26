// Carga las variables de entorno
const path = require('path')
// Limitador de peticiones
const rateLimit = require("express-rate-limit")
// Importa 'dotenv' y configura la ruta del archivo .env
const dotenvResult = require('dotenv').config({ path: path.resolve(__dirname, '../BACKEND/.env') }); 
//Si falla la carga del .env, detén la app
if (dotenvResult.error) {
    console.error("Error loading .env file:", dotenvResult.error);
    process.exit(1); // Salir si no se puede cargar el archivo .env
};

// Importa los demás módulos
const express = require('express');
const songsRoutes = require('./ROUTES/songsRoutes'); // Rutas de canciones
const usersRoutes = require ('./ROUTES/usersRoutes') // Rutas de usuarios
const errorMiddleware = require('./MIDDLEWARES/ErrorMiddleware'); // Middleware global de errores

const connectDB = require('./CONFIG/DB'); // Función para conectar a MongoDB

// Crear app con express
const app = express();
//Puerto desde .env o 3000 por defecto
const PORT = process.env.PORT || 3000; 

//Middleware para parsear JSON en requests
app.use(express.json()); 
//Servir archivos estáticos desde la carpeta PUBLIC
app.use(express.static('PUBLIC'));

// Conectar a la base de datos
connectDB();

// Rate Limiting global (protege toda la API)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Ventana de 15 minutos
    max: 50,  // Máximo 50 solicitudes por IP en la ventana
    message: "Demasiadas peticiones. Intenta más tarde."
})

//Aplica el limitador de manera global
app.use(generalLimiter)

// Rutas de la API
app.use('/songs', songsRoutes); 
app.use('/users', usersRoutes); 

//Middleware de manejo de errores
app.use(errorMiddleware);

//Arrancar el servidor HTTP
app.listen(PORT, () => {
    console.log(`Server listen at http://localhost:${PORT} 🌐`);
});
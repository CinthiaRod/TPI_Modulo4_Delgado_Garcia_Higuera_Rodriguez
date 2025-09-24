const express = require('express'); // Importa el módulo 'express' para crear el enrutador
const router = express.Router(); // Crea un nuevo enrutador de Express
const rateLimit = require("express-rate-limit")
const userController = require('../CONTROLLERS/usersController'); // Importa el controlador de usuarios
const authMiddleware = require('../MIDDLEWARES/authMiddleware'); // Importa el middleware de autenticación
// Este middleware se utiliza para verificar si el usuario está autenticado antes de permitir el acceso a
// las rutas protegidas.

// Rate Limiting
const limiter = rateLimit({
    windowMS: 15 * 60 * 1000, // 15 minutos
    max: 5,
    message: "Demasiadas peticiones. Intenta más tarde."
})

// Rutas de autenticación 
router.get('/', authMiddleware.verifyAdmin, userController.getUsers) // GET /users
// Ruta para obtener todos los usuarios, protegida por autenticación de administrador
// Solo los administradores pueden acceder a esta ruta.
router.post('/register', limiter, userController.register); // POST /users/register
// Ruta para registrar un nuevo usuario
// Esta ruta no requiere autenticación, ya que es para registrar nuevos usuarios.
router.post('/login', limiter, userController.login);       // // POST /users/login
// Ruta para iniciar sesión de un usuario

module.exports = router; // Exporta el enrutador para que pueda ser utilizado en otros módulos

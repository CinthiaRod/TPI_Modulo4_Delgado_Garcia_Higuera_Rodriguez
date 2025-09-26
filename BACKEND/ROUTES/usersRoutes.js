// Importa el módulo 'express' para crear el enrutador
const express = require('express');
// Crea una instancia de enrutador de Express para definir endpoints de la API
const router = express.Router(); 
// Importamos el modulo rate limit
const rateLimit = require("express-rate-limit")
const userController = require('../CONTROLLERS/usersController'); // Importa el controlador de usuarios
const authMiddleware = require('../MIDDLEWARES/authMiddleware'); // Importa el middleware de autenticación
// Este middleware se utiliza para verificar si el usuario está autenticado antes de permitir el acceso a
// las rutas protegidas.

// Limitador estricto para autenticación (login/register) para mitigar brute-force
const limiter = rateLimit({
    windowMS: 15 * 60 * 1000, // 15 minutos
    max: 5,                   // máximo 5 intentos por IP en 15 min
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

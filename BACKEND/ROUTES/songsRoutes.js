const express = require('express'); // Importa el módulo 'express' para crear el enrutador
// Este módulo permite manejar las rutas y solicitudes HTTP en la aplicación.
const router = express.Router(); // Crea un nuevo enrutador de Express
// El enrutador se utiliza para definir las rutas de la API y asociarlas con los controladores correspondientes.
const songsController = require('../CONTROLLERS/songsController'); // Importa el controlador de canciones
// Este controlador contiene la lógica para manejar las solicitudes relacionadas con las canciones.
const authMiddleware = require('../MIDDLEWARES/authMiddleware');  // Importa el middleware de autenticación
// Este middleware se utiliza para verificar si el usuario está autenticado antes de permitir el acceso a ciertas rutas.
const userController = require('../CONTROLLERS/usersController'); // Importa el controlador de usuarios
// Este controlador contiene la lógica para manejar las solicitudes relacionadas con los usuarios.


router.get('/', songsController.getAllsongs); // Ruta para obtener todos las canciones
router.get('/:id', songsController.getSongById); // Ruta para obtener una canción por su ID


router.post('/', authMiddleware.verifyToken, songsController.createSong);  // Ruta para crear una nueva canción, protegida por autenticación
// Solo los usuarios autenticados pueden crear una una nueva canción.
router.put('/:id', authMiddleware.verifyToken, songsController.updateSong); // Ruta para actualizar una canción por su ID, protegida por autenticación
// Solo los usuarios autenticados pueden actualizar una canción.
router.delete('/:id', authMiddleware.verifyToken, songsController.deleteSong); // Ruta para eliminar una canción por su ID, protegida por autenticación
// Solo los usuarios autenticados pueden eliminar una canción.


module.exports = router; // Exporta el enrutador para que pueda ser utilizado en otros módulos

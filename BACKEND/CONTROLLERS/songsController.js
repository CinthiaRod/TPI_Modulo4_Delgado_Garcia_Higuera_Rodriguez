//Importamos modulos
const songsService = require('../SERVICES/songsService');

// Definición de un controlador orientado a las rutas de Express
class songsController {
    // Funcion para obtener todos las canciones
    async getAllsongs(req, res, next) {
        try {
            // Trae el listado completo
            const songs = await songsService.getAllSongs();
            // Responde 200 OK con el JSON de canciones
            res.status(200).json(songs);
        } catch (error) { 
            next(error); // Pasa el error al middleware de manejo de errores
        }
    }

    //Funcion para obtener canciones segun su ID
    async getSongById(req, res, next) {
        try {
            //Obtener ID segun la informacion provista por el usuario
            const { id } = req.params;
            //Buscar la canción con su ID utilizando la funcion desarrollada en "songsService"
            const song = await songsService.getSongsById(id);
            // Si no existe, devolvemos 404 not found
            if (!song) {
                return res.status(404).json({ message: 'Song not found' });
            }
            //Si la solicitud fue exitosa, mostrar la informacion de la canción
            res.status(200).json(song);
        } catch (error) {//Si existe un error, mostrar el error
            next(error);
        }
    }

    // Funcion para crear una nueva canción
    async createSong(req, res, next) {
        try {
            //Obtener informacion de la canción provista por el usuario
            const newSong = req.body;
            //Crear nueva canción con base en funcion de "songsService"
            const createdSong = await songsService.addSong(newSong);
            //Si la solicitud es exitosa, se manda informacion de la canción creada
            res.status(201).json(createdSong);
        } catch (error) {//En caso de error, se muestra
            next(error);
        }
    }

    //Funcion para actualizar informacion de una canción existente
    async updateSong(req, res, next) {
        try {
            // Tomamos el ID y los datos a actualizar en el request
            const { id } = req.params;
            const updatedData = req.body;
            // Se solicita servicio en la actualización
            const updatedSong = await songsService.updateSong(id, updatedData);

            // Si no se encontró la canción, 404 Not Found
            if (!updatedSong) {
                return res.status(404).json({ message: 'Update failed: song not found' });
            }
            // Si se actualizó, devolvemos 200 OK con el recurso actualizado
            res.status(200).json(updatedSong);

        } catch (error) {//En caso de error, mostrarlo
            next(error);
        }
    }

    //Funcion para borrar canción
    async deleteSong(req, res, next) {
        try {
            // Obtener ID del usuario
            const { id } = req.params;
            // Eliminarlo con base en la funcion "songsService"
            const deleted = await songsService.deleteSong(id);

            // Si no existía, 404 Not Found
            if (!deleted) {
                //Mandar mensaje del problema
                return res.status(404).json({ message: 'Delete failed: song not found' });
            }
            // Si se eliminó, 200 OK con un mensaje
            return res.status(200).json({ message: "Song deleted successfully."}); 

        } catch (error) {//En caso de algun otro error, mostrarlo
            next(error);
        }
    }
}


//Exportar modulo
module.exports = new songsController();
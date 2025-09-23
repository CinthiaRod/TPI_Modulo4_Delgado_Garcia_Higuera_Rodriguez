//Importamos modulos
const songsService = require('../SERVICES/songsService');

//Creamos clase
class songsController {
    //Funcion para obtener todos las canciones
    async getAllsongs(req, res, next) {
        try {
            const songs = await songsService.getAllSongs();
            res.status(200).json(songs);
        } catch (error) { //Si sucede un error...
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
            //Si no se encuentra la canción...
            if (!song) {
                //Enviar mensaje de estado al usuario de que la canción no fue encontrada
                return res.status(404).json({ message: 'Song not found' });
            }
            //Si la solicitud fue exitosa, mostrar la informacion de la canción
            res.status(200).json(song);
        } catch (error) {//Si existe un error, mostrar el error
            next(error);
        }
    }

    //Funcion para crear una nueva canción
    async createSong(req, res, next) {
        try {
            //Obtener informacion de la canción provista por el usuario
            const newSong = req.body;
            //Crear nueva canción con base en funcion de "songsService"
            const createdSong = await songsService.addSong(newSong);
            //Si la solicitud es exitosa, mandar informacion de la canción creada
            res.status(201).json(createdSong);
        } catch (error) {//En caso de error, mostrarlo
            next(error);
        }
    }

    //Funcion para actualizar informacion de una canción
    async updateSong(req, res, next) {
        try {
            //Obtener informacion por parte del usuario
            const { id } = req.params;
            const updatedData = req.body;
            //Actualizar canción con funcion de "songsService"
            const updatedSong = await songsService.updateSong(id, updatedData);

            //Si no se encuentra la canción a actualizar
            if (!updatedSong) {
                //Mandar aviso de que no pudo ser actualiado
                return res.status(404).json({ message: 'Update failed: song not found' });
            }
            //Si la solicitu es exitosa, mostrar la información actualizada
            res.status(200).json(updatedSong);

        } catch (error) {//En caso de error, mostrarlo
            next(error);
        }
    }

    //Funcion para borrar canción
    async deleteSong(req, res, next) {
        try {
            //Obtener ID del usuario
            const { id } = req.params;
            //Eliminarlo con base en la funcion "songsService"
            const deleted = await songsService.deleteSong(id);

            //Si la canción a eliminar no fue encontrada
            if (!deleted) {
                //Mandar mensaje del problema
                return res.status(404).json({ message: 'Delete failed: song not found' });
            }
            //Si la solicitud fue exitosa, mostrar mensaje de ello
            return res.status(200).json({ message: "Song deleted successfully."}); 

        } catch (error) {//En caso de algun otro error, mostrarlo
            next(error);
        }
    }
}


//Exportar modulo
module.exports = new songsController();
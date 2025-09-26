// Importación del modelo de Mongoose para la colección de 'songs'
const Song = require('../MODELS/songsModel');

// Servicio de canciones, encapsula la lógica de acceso a datos (CRUD) usando Mongoose
class SongsService { 
    // Obtener todas las canciones
    async getAllSongs() {
        // Devuelve un arreglo con todos los documentos de la colección
        return await Song.find();
    }

    // Obtener una canción por su ID
    async getSongsById(id) {
        // Devuelve el documento si existe
        return await Song.findById(id);
    }

    // Crear una nueva canción con los datos proporcionados
    async addSong(songData) {
        // Inicializar con un nuevo documento del modelo 'songs'
        const newSongs = new Song (songData);
        // Retornar el documento creado
        return await newSongs.save();
    }

    // Actualizar una canción por ID con los campos proporcionados en 'songData'
    async updateSong(id, songData) { 
        // Hace retornar el documento actualizado
        return await Song.findByIdAndUpdate(id, songData, { new: true });
    }
    // Eliminar la canción por ID
    async deleteSong(id) { 
         //Retorna el documento eliminad
        return await Song.findByIdAndDelete(id);
    }
}

// Exporta el modulo
module.exports = new SongsService();
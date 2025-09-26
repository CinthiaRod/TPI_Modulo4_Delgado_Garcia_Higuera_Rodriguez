// Importamos el módulo de Mongoose
const mongoose = require('mongoose');

// Define el esquema la canción (Mongoose maneja validación y tipos)
const songSchema = new mongoose.Schema({
    // Titulo de la canción: texto obligatorio, se elimina espacio en blanco al inicio/final
    title: {
        type: String,
        required: true,
        trim: true
    },
    //Nombre del artista: texto obligatorio, se elimina espacio en blanco al inicio/fin
    artist: {
        type: String,
        required: true,
        trim: true
    },
    //Año de lanzamiento: número obligatorio
    year: {
        type: Number,
        required: true
    }
});

// Crear el modelo 'Song' basado en el esquema definido
const Song = mongoose.model('Song', songSchema);

// Exporta el modulo
module.exports = Song;
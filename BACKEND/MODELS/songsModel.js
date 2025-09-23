const mongoose = require('mongoose');

// Define el esquema la canción. Mongoose se encarga de la validación y tipado.
const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    artist: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true
    }
});

// Crea el modelo canción basado en el esquema
const Song = mongoose.model('Song', songSchema);

// Exporta el modelo para usarlo en el servicio
module.exports = Song;
const mongoose = require('mongoose');

// Define el esquema del usuario.
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

// Crea el modelo User a partir del esquema
const User = mongoose.model('User', userSchema);

// Exporta el modelo para usarlo en el servicio
module.exports = User;
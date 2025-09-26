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

// índice único parcial para admin para no permitir más de 1 cuenta de administrador
userSchema.index(
  { role: 1 },
  { unique: true, partialFilterExpression: { role: "admin" } }
);

// Crea el modelo User a partir del esquema
const User = mongoose.model('User', userSchema);

// Exporta el modelo para usarlo en el servicio
module.exports = User;
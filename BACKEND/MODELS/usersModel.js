// Importamos el módulo de Mongoose
const mongoose = require('mongoose');

// Define el esquema del usuario.
const userSchema = new mongoose.Schema({
    username: {
        //Nombre de usuario: texto obligatorio, único y sin espacios al inicio/fin
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    //Contraseña: texto obligatorio
    password: {
        type: String,
        required: true
    },
     //Rol del usuario: solo puede ser 'user' o 'admin'; por defecto 'user'
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

// Exportar el modelo para utilizarlo en servicios/controladores
module.exports = User;
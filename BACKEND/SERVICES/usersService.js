// Importamos módulos
const User = require('../MODELS/usersModel'); // Importa el modelo de usuarios Mongoose
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

class UserService { 
    async registerUser(username, password, role) {
        // 1. Verifica si el nombre de usuario ya existe
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            const error = new Error('El nombre de usuario ya existe');
            error.statusCode = 409; 
            throw error;
        }

        // 2. Valida el rol
        if (role !== 'admin' && role !== 'user') {
            const error = new Error('Rol de usuario no válido. Debe ser "admin" o "user".');
            error.statusCode = 400; 
            throw error;
        }

        // 3. Hashea la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Crea y guarda el nuevo usuario en MongoDB
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        
        return newUser;
    }

    async loginUser(username, password) {
        // 1. Encuentra al usuario por nombre de usuario
        const user = await User.findOne({ username });
        if (!user) {
            const error = new Error('Credenciales inválidas');
            error.statusCode = 401; 
            throw error;
        }

        // 2. Compara la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error('Credenciales inválidas');
            error.statusCode = 401; 
            throw error;
        }

        // 3. Genera un token de autenticación JWT
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );
        
        return { token, user: { id: user._id, username: user.username, role: user.role } };
    }

    async getUsers() {
        return await User.find();
    }
}

module.exports = new UserService();
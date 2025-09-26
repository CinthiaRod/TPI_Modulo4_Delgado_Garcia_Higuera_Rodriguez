// Importamos módulos
const User = require('../MODELS/usersModel'); // Importa el modelo de usuarios Mongoose
// Hasheo de contraseñas
const bcrypt = require('bcryptjs');
// Generación/verificación de JWT
const jwt = require('jsonwebtoken'); 

// Parametros de seguridad
const saltRounds = 12;
const PEPPER = process.env.PEPPER_SECRET; // Pimienta adicional a la contraseña

class UserService { 
    // Registrar nuevo usuario
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
            error.statusCode = 400; // 400 Bad request
            throw error;
        }

        // 3. Hashea la contraseña antes de guardarla (salt+pimienta)
        const pepperPassword = password + PEPPER; // Concatenar Pepper antes de hashear
        const sal = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(pepperPassword, sal);

        // 4. Crea y guarda el nuevo usuario en MongoDB
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        
        // Devolver el usuario creado
        return newUser;
    }
    //Iniciar sesión de un usuario existente
    async loginUser(username, password) {
    // 1. Busca el usuario por su nombre
    const user = await User.findOne({ username });
    if (!user) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401; // 401 Unauthorized
        throw error;
    }

    // 2. Comparar contraseña provista vs hash almacenado (agregando PEPPER)
    const pepperPassword = password + PEPPER;
    const isMatch = await bcrypt.compare(pepperPassword, user.password);
    if (!isMatch) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401; 
        throw error;
    }

    // 3.  Generar token JWT con info mínima necesaria
    const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role }, // payload
        process.env.JWT_SECRET, // clave secreta
        { expiresIn: '1h' } // expiración del token
    );
    
    //Devolver token y datos públicos del usuario
    return { token, user: { id: user._id, username: user.username, role: user.role } };
}

//Obtener listado de usuarios
    async getUsers() {
        //Devuelve todos los usuarios (idealmente sin el campo password)
        return await User.find();
    }
}

// Exportar modulo
module.exports = new UserService();
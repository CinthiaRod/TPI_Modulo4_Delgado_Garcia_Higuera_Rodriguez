//Importamos modulos
const userService = require('../SERVICES/usersService');

//Crear clase para el controlador de usuarios
class UserController {
    //Funcion para registrar a un nuevo usuario
    async register(req, res, next) {
        try {
            //Obtener informacion del usuario
            const { username, password} = req.body;
            let def_role = "user" // Rol por defecto

            //Si el nuevo usuario no provee un nombre de usuario o una contraseña
            if (!username || !password) {
                //Mandar mensaje de error, solicitando esa informacion
                return res.status(400).json({ message: 'Missing registration data: username and password required.' });
            }

            // Llamamos al servicio para crear el usuario
            const newUser = await userService.registerUser(username, password, def_role);
            // Respuesta 201 Created con datos básicos (evitar incluir password)
            res.status(201).json({ message: 'User registered successfully.', user: { id: newUser.id, username: newUser.username, role: newUser.role } });
        } catch (error) {
            next(error); // Pasa el error al middleware de manejo de errores
        }
    }

    // Funcion para login de un usuario existente
    async login(req, res, next) {
        try {
            //Obtener la informacion del usuario
            const { username, password } = req.body;
            //En caso de que no provea nombre de usuario o contraseña
            if (!username || !password) {
                // Devolvemos 200 OK con el token y el usuario (sin datos sensibles)
                return res.status(400).json({ message: 'Missing credentials: please provide username and password.' });
            }
            
            //En caso de que si se provea la información necesaria...
            const { token, user } = await userService.loginUser(username, password);
            //La solitud es exitosa y devolverá un token para acceder a otras funcionalidades
            res.status(200).json({ message: 'Login successful.', token, user }); 

        } catch (error) {//En caso de error, mostrarlo
            next(error);
        }
    }

    // Listado de usuarios registrados
    async getUsers(req, res, next){
        try {
            //Utilizar funcion dentro de "userService" para obtener todos los usuarios
            const users = await userService.getUsers();
            //Mostrar mensaje de solicitud exitosa y todos los usuarios registrados
            return res.status(200).json(users);
    
        } catch (error) {//Mostrar errores
            next(error);
        }
    }
}

//Exportar modulo
module.exports = new UserController();
//Importamos modulos
const userService = require('../SERVICES/usersService');

//Crear clase para el controlador de usuarios
class UserController {
    //Funcion para registrar a un nuevo usuario
    async register(req, res, next) {
        try {
            //Obtener informacion del usuario
            const { username, password, role } = req.body;
            let def_role = role
            //Si el rol del nuevo usuario no fue definido
            if (!role){
                //Colocarle rol de "ususario" (ya que tambien existe el de admin)
                def_role = "user"
            }
            //Si el nuevo usuario no provee un nombre de usuario o una contraseña
            if (!username || !password) {
                //Mandar mensaje de error, solicitando esa informacion
                return res.status(400).json({ message: 'Missing registration data: username and password required.' });
            }

            //En caso de que si la provea, registrarlo con base en la funcion de "userService"
            const newUser = await userService.registerUser(username, password, def_role);
            //Mandar mensaje de solicitu exitosa
            res.status(201).json({ message: 'User registered successfully.', user: { id: newUser.id, username: newUser.username, role: newUser.role } });
        } catch (error) {//En caso de otro error...
            next(error); // Pasa el error al middleware de manejo de errores
        }
    }

    //Funcion para ingresar a cuenta de un usuario
    async login(req, res, next) {
        try {
            //Obtener la informacion del usuario
            const { username, password } = req.body;
            //En caso de que no provea nombre de usuario o contraseña
            if (!username || !password) {
                //Se enviará un mensaje de error, solicitando la información requerida
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

    //Funcion para conocer los usuarios registrados en la base de datos
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
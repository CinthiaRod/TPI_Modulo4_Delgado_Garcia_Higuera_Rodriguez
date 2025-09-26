//Importar modulos
const jwt = require('jsonwebtoken');

//Cargar variables de entorno
require('dotenv').config(); 

//Funcion para verificar token
const verifyToken = (req, res, next) => {
    //Obtener token por parte del usuario mediante la seccion de "headers"
    const token = req.headers['authorization'];

    //Si falta el token, envía 403 no autenticada
    if (!token) {
        //Acceso denegado debido a que el token no fue enviado
        return res.status(403).json({ message: 'Unauthorized: no authentication token provided.' });
    }

    //En caso de que si se envíe el token, separar sus partes con base a espacios
    const tokenParts = token.split(' ');
    //Si las partes del token son diferentes a 2 o el inicio no es con 'Bearer'
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        // No se autoriza el acceso
        return res.status(401).json({ message: 'Authentication failed: token format is invalid.' });
    }

    //En caso de que si, utilizar la parte 2 del token
    const actualToken = tokenParts[1];

    try {
        // Verificamos firma/expiración usando la clave secreta
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET); 
        // Guardamos el payload decodificado en req.user para uso posterior
        req.user = decoded; 
        next();

    } catch (error) {//En caso de error...
        //Mostrar motivos del error (invalidez o expiracion)
        return res.status(401).json({ message: 'Token authentication failed: token is invalid or expired.', error: error.message });
    }
};

// Middleware: requiere token válido y además rol 'admin'
const verifyAdmin = (req, res, next) => {
    //Obtener token desde la seccion de headers
    const token = req.headers['authorization'];

    //En caso de que falte el token
    if (!token) {
        //Mostrar mensaje de acceso denegado
        return res.status(403).json({ message: 'Unauthorized: no authentication token provided.' });
    }

    //En caso de que si se envíe el token, separar sus partes con base a espacios
    const tokenParts = token.split(' ');
    //Si las partes del token son diferentes a 2 o el inicio no es con 'Bearer'
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        //No se autoriza el acceso
        return res.status(401).json({ message: 'Invalid token format: expected Bearer token in Authorization header.' });
    }

    //En caso de que si, utilizar la parte 2 del token
    const actualToken = tokenParts[1];

    try {
        //Decodificar token con metodo JWT
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET); 
        //Obtener informacion del usuario con base en la decodificacion
        req.user = decoded;

        //Si el role del usuario NO es de admin
        if (decoded.role !== 'admin') {
            //Acceso denegado
            return res.status(403).json({ message: 'Unauthorized: this action is allowed for administrators only.' });
        } 
        next();
    } catch (error) {//En caso de error...
        //Mostrar motivos del error (invalidez o expiracion)
        return res.status(401).json({ message: 'Token authentication failed: token is invalid or expired.', error: error.message });
    }
};

//Exportar modulo
module.exports = { verifyToken, verifyAdmin };
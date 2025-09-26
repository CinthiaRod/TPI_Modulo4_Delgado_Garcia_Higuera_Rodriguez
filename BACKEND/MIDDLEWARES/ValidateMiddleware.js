//Helper para validar cadenas no vacías
const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

//Función para validar datos de registro de usuario
const validateRegister = (req, res, next) => {
  //Obtener información del cuerpo de la solicitud
  const { username, password } = req.body ?? {};
  //Inicializar arreglo de errores de validación
  const errors = [];

  //En caso de que falte el nombre de usuario o no sea texto no vacío
  if (!isNonEmptyString(username)) {
    errors.push("'username' is required (non-empty string).");
  }

  //En caso de que falte la contraseña o no sea texto no vacío
  if (!isNonEmptyString(password)) {
    errors.push("'password' is required (non-empty string).");
  }

  //Si existen errores de validación, responder con código 400 y detallar problemas
  if (errors.length) {
    return res.status(400).json({ error: 'Invalid registration data', details: errors });
  }

  //Si la validación es correcta, continuar con el siguiente middleware/controlador
  next();
};

//Función para validar datos de inicio de sesión
const validateLogin = (req, res, next) => {
  //Obtener credenciales del cuerpo de la solicitud
  const { username, password } = req.body ?? {};
  //Inicializar arreglo de errores de validación
  const errors = [];

  //En caso de que falte el nombre de usuario o no sea texto no vacío
  if (!isNonEmptyString(username)) {
    errors.push("'username' is required (non-empty string).");
  }

  //En caso de que falte la contraseña o no sea texto no vacío
  if (!isNonEmptyString(password)) {
    errors.push("'password' is required (non-empty string).");
  }

  //Si existen errores de validación, responder con código 400 y detallar problemas
  if (errors.length) {
    return res.status(400).json({ error: 'Invalid credentials format', details: errors });
  }

  //Si la validación es correcta, continuar con el siguiente middleware/controlador
  next();
};

//Exportar módulo
module.exports = { validateRegister, validateLogin };


// //Funcion para validar libro
// const validateSong = (req, res, next) => {
//     //Obtener informacion de la canción por parte del usuario
//     const { title, author, year } = req.body;

//     //En caso de que falte el nombre del libro o esta información no sea de tipo 'caracter'
//     if (!title || typeof title !== 'string') {
//         //Mostrar codigo de estado y su mensaje de error sobre la información faltante o incorrecta
//         res.status(400).json({ error: "Validation error: 'title' is required and must be of type string." });
//         return;
//     }

//     //En caso de que falte el nombre del autor del libro o esta información no sea de tipo 'caracter'
//     if (!author || typeof author !== 'string') {
//         //Mostrar codigo de estado y su mensaje de error sobre la información faltante o incorrecta
//         res.status(400).json({ error: "Validation error: 'author' is required and must be of type string." });
//         return;
//     }
    
//     //En caso de que falte el nombre del autor del libro o esta información no sea de tipo 'numero'
//     if (!year || typeof year !== 'number') {
//         //Mostrar codigo de estado y su mensaje de error sobre la información faltante o incorrecta
//         res.status(400).json({ error: "Validation error: 'year' is required and must be of type number." });
//         return;
//     }

//     next();
// };

// //Exportamos modulo
// module.exports = validateBook;
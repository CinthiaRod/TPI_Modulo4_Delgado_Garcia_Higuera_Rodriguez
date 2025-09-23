//Funcion para manejar errores
const errorMiddleware = (err, req, res, next) => {
    console.error('Error: ', err.message); // Muestra el mensaje de error en la consola del servidor
    res.status(500).json({ error: err.message }); // Envía una respuesta de error al cliente
};

//Exportar modulo
module.exports = errorMiddleware;
// Importamos modulos
const mongoose = require('mongoose');

// Función asíncrona que establece la conexión a la base de datos
const connectDB = async () => {
    try {
        // Se conecta usando la URL definida en variables de entorno
        await mongoose.connect(process.env.MONGODB_URI);
        // Se informa si la conexión es exitosa
        console.log('MongoDB Atlas: Conexión establecida con éxito. ✅');
    } catch (error) {
        // Si ocurre un error, lo registra con un mensaje breve
        console.error('Error al conectar a MongoDB Atlas:', error.message);
        process.exit(1); // Sale de la aplicación si la conexión falla
    }
};
// Exportar modulo
module.exports = connectDB;
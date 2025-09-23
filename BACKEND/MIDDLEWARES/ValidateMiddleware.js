//Funcion para validar libro
const validateBook = (req, res, next) => {
    //Obtener informacion del libro por parte del usuario
    const { title, author, year } = req.body;

    //En caso de que falte el nombre del libro o esta información no sea de tipo 'caracter'
    if (!title || typeof title !== 'string') {
        //Mostrar codigo de estado y su mensaje de error sobre la información faltante o incorrecta
        res.status(400).json({ error: "Validation error: 'title' is required and must be of type string." });
        return;
    }

    //En caso de que falte el nombre del autor del libro o esta información no sea de tipo 'caracter'
    if (!author || typeof author !== 'string') {
        //Mostrar codigo de estado y su mensaje de error sobre la información faltante o incorrecta
        res.status(400).json({ error: "Validation error: 'author' is required and must be of type string." });
        return;
    }
    
    //En caso de que falte el nombre del autor del libro o esta información no sea de tipo 'numero'
    if (!year || typeof year !== 'number') {
        //Mostrar codigo de estado y su mensaje de error sobre la información faltante o incorrecta
        res.status(400).json({ error: "Validation error: 'year' is required and must be of type number." });
        return;
    }

    next();
};

//Exportamos modulo
module.exports = validateBook;
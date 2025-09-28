/// Proyecto: Biblioteca de música personal ///

//--------  Objetivo del Proyecto  -------------
Desarrollar una API RESTful completa para la gestión de una biblioteca musical personal, implementando bases de datos MongoDB con relaciones entre artistas y canciones, junto con un sistema de autenticación de usuarios.

Este sistema sigue el patrón de diseño MVC (Modelo-Vista-Controlador) para organizar y estructurar el código de manera modular y escalable. 

//-----  Estructura del proyecto ------------

📂 TPL_Modulo4_Delgado_Garcia_Higuera_Rodriguez
├── 📂 BACKEND/              ➡️ Lógica de la API
│   ├── 📂 CONFIG/           ➡️ Configuración de la base de datos
│   │   └── 📃 DB.js
│   ├── 📂 CONTROLLERS/      ➡️ Lógica de controladores (MVC)
│   │   ├── 📃 songsController.js
│   │   └── 📃 usersController.js
│   ├── 📂 MIDDLEWARES/      ➡️ Middlewares de autenticación y validación
│   │   ├── 📃 authMiddleware.js
        ├── 📃 ValidateMiddleware.js
│   │   └── 📃 errorMiddleware.js
│   ├── 📂 MODELS/           ➡️ Modelos de datos MongoDB
│   │   ├── 📃 songsModel.js
│   │   └── 📃 usersModel.js
│   ├── 📂 ROUTES/           ➡️ Definición de rutas API
│   │   ├── 📃 songsRoutes.js
│   │   └── 📃 usersRoutes.js
│   ├── 📂 SERVICES/         ➡️ Lógica de negocio y acceso a datos
│   │   ├── 📃 songsService.js
│   │   └── 📃 usersService.js
        └── 📃 index.js 
│           
├── 📂 PUBLIC/               ➡️ Sección visual de la API
    ├── ​​index.html
    ├── ​​script.js
    ├── ​​style.css

├──.gitignore
├── ​​package-lock.json ​➡️​ Dependencias del proyecto
├── ​​package.json ​➡️​ Dependencias del proyecto
└── ​​README.md ➡️​ Documentación del proyecto

//-------------Modelos de Datos Implementados---------------
Usuarios
username: Identificador único del usuario
password: Contraseña hasheada
role: Rol del usuario (user/admin)
Canciones
title: titulo de la canción
artist: artista que la interpreta
year: año de lanzamiento

//---------- ​Manejo de datos​​​ ----------------
✅​controllers/: Contiene los controladores que gestionan las acciones del cliente 
​​​✅​models/: Contiene la lógica para gestionar los datos de usuarios y canciones
​​​✅​config/: Se encuentra la conexion a la db en mondodb

//------------  Endpoints de la API ---------------
Autenticación (/users)
POST /users/register - Registrar nuevo usuario
POST /users/login - Iniciar sesión
GET /users - Listar usuarios (solo admin)
Canciones (/songs)
GET /songs - Listar todas las canciones
GET /songs/:id - Obtener canción específica
POST /songs - Crear canción (autenticado)
PUT /songs/:id - Actualizar canción (autenticado)
DELETE /songs/:id - Eliminar canción (autenticado)

//---------Instrucciones para Ejecutar el Proyecto----------------
Prerrequisitos
Node.js (v14 o superior)
MongoDB Atlas o MongoDB local
Git
Visual Studio Code (recomendado)

Instrucciones para ejecutar el proyecto​​​
1. Disponer en tu equipo de los software Visual Studio Code(VSC) y Git bash, previamente instalados, lo anterior para poder correr el proyecto.
2. Abrir la capeta 📂 TPI_Modulo4_Delgado_Garcia_Higuera_Rodriguez/BACKEND en VSC.
3. Ejecutar comando "npm start" y abrir el enlace web para interactuar con la API (http://localhost:3000)
** La funcionalidad completa de la API (agregar, modificar y eliminar canciones) solo está permitida para el administrador. 


//-------------Uso del servidor TCP (server.js)----------------

El servidor está implementado usando el módulo net de Node.js y escucha en el puerto 3000. El servidor maneja las conexiones de múltiples clientes, recibe comandos y responde con los resultados de las acciones solicitadas

//--------------Uso del cliente--------------------------

El cliente está diseñado para interactuar con el servidor a través de comandos enviados en formato JSON.

Al ejecutar el cliente, aparecerá el siguiente menú principal:

SECCIÓN SUPERIOR: AUTENTICACIÓN DE USUARIOS Formulario de Registro:
Campo: "Nombre de usuario" Campo: "Contraseña" Botón: "Registrar"

Formulario de Login: Campo: "Nombre de usuario" Campo: "Contraseña" Botón: "Iniciar sesión"

1. SECCIÓN SUPERIOR: AUTENTICACIÓN DE USUARIOS
Formulario de Registro:

Campo: "Nombre de usuario"
Campo: "Contraseña"
Botón: "Registrar"

Formulario de Login:
Campo: "Nombre de usuario"
Campo: "Contraseña"
Botón: "Iniciar sesión"

2. SECCIÓN INFERIOR: GESTIÓN DE CANCIONES 
Subsección 1: Obtener Todas las Canciones
Botón: "Obtener todas las canciones"
Área de visualización: Donde se muestra la lista completa de canciones

Subsección 2: Buscar Canción Específica
Título: "Obtener una canción"
Campo: "ID de la canción"
Botón: "Obtener por ID"

Área de visualización: Detalles de la canción encontrada

Subsección 3: Agregar Nueva Canción
Título: "Añadir una nueva canción"

Campo: "Título" (requerido)
Campo: "Artista" (requerido)
Campo: "Año" (requerido)
Botón: "Añadir"

Subsección 4: Modificar Canción Existente
Título: "Modificar una canción"
Campo: "ID de la canción" (requerido)
Campo: "Título" (opcional)
Campo: "Artista" (opcional)
Campo: "Año" (opcional)
Botón: "Modificar"

Subsección 5: Eliminar Canción
Título: "Eliminar una canción"
Campo: "ID de la canción" (requerido)
Botón: "Eliminar"

// ---------Características Técnicas-----------
Base de datos: MongoDB con Mongoose ODM
Autenticación: JWT (JSON Web Tokens)
Seguridad: Bcrypt para hashing de contraseñas
Validación: Mongoose schema validation
Estructura: Arquitectura modular MVC

Relaciones: Referencias entre modelos (Artista → Álbum → Canción)

// ----------Flujo de datos --------------
Flujo de Solicitud (Request)
CLIENTE (Frontend Web) 
    ↓ Eventos HTML / Fetch API
 SOLICITUD HTTP (GET/POST/PUT/DELETE)
    ↓ Enrutamiento Express
RUTAS (Routes: artists.js, songs.js, albums.js, users.js)
    ↓ Middleware de Seguridad
MIDDLEWARE (Auth: verifyToken, verifyAdmin)
    ↓ Lógica de Aplicación
 CONTROLADOR (Controller: artistsController.js, songsController.js, etc.)
    ↓ Lógica de Negocio
SERVICIO (Service: artistsService.js, songsService.js, etc.)
    ↓ Acceso a Datos
MODELO (Model: Mongoose Schemas)
    ↓ Operaciones Database
MONGODB (Base de Datos)

Flujo de Respuesta (Response)
MONGODB (Resultados de Consulta)
    ↑ Datos Persistentes
MODELO (Mongoose Documents)
    ↑ Formato Estructurado
 SERVICIO (Procesamiento Business Logic)
    ↑ Datos Procesados
 CONTROLADOR (JSON Response Preparation)
    ↑ Respuesta HTTP Formateada
RESPUESTA HTTP (Status + JSON Data)
    ↑ Recepción Frontend
 CLIENTE (Fetch Response + DOM Manipulation)
    ↑ Interfaz de Usuario
USUARIO (Visualización Resultados)


//----------- ​Manejo de Errores --------------//
Para el correcto funcionamiento y comunicación entre el cliente y el servidor, se utilizaron diversas herramientas dentro del código para poder llevar los mensajes apropiados según sea necesario para trasmitir la información en cuanto a los posibles errores durante el uso de la API.
// URL base de la API
const apiUrl = 'http://localhost:3000';
let token = localStorage.getItem('token') || null;

// --- FUNCIONES DE UTILIDAD (UI) ---

/**
 * Muestra u oculta los botones de login/registro y el botón de logout
 * basándose en la existencia del token.
 */
function updateAuthUI() {
    // Usamos los IDs específicos de los botones del encabezado
    const registerBtn = document.getElementById('registrar-usuario-btn');
    const loginBtn = document.getElementById('iniciar-sesion-btn');
    const logoutContainer = document.getElementById('logout-container');
    const isLoggedIn = token !== null;

    if (isLoggedIn) {
        // Ocultar botones de Login/Registro
        if(registerBtn) registerBtn.style.display = 'none';
        if(loginBtn) loginBtn.style.display = 'none';
        // Mostrar contenedor de Cerrar Sesión
        if(logoutContainer) logoutContainer.style.display = 'block';
    } else {
        // Mostrar botones de Login/Registro
        if(registerBtn) registerBtn.style.display = 'inline-block';
        if(loginBtn) loginBtn.style.display = 'inline-block';
        // Ocultar contenedor de Cerrar Sesión
        if(logoutContainer) logoutContainer.style.display = 'none';
    }
}

/**
 * Abre un modal específico.
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

/**
 * Cierra un modal específico y limpia los campos de entrada/salida.
 */
function closeModal(modalElement) {
    if (!modalElement) return;
    
    modalElement.style.display = 'none';
    // Limpiar inputs
    modalElement.querySelectorAll('input').forEach(input => input.value = '');
    // Limpiar áreas de resultados (listas de canciones o detalles)
    modalElement.querySelectorAll('.song-list-display, .song-detail-display').forEach(div => div.innerHTML = '');
}

/**
 * Configura los Event Listeners para el menú desplegable y la apertura/cierre de modales.
 */
function setupDropdownAndModals() {
    const menuButton = document.getElementById('songs-menu-button');
    const menuContent = document.getElementById('songs-dropdown-content');
    const allModals = document.querySelectorAll('.modal-dialog');
    const closeButtons = document.querySelectorAll('.close-button');

    // 1. LÓGICA DEL MENÚ DESPLEGABLE
    if (menuButton && menuContent) {
        menuButton.addEventListener('click', () => {
            menuContent.classList.toggle('show');
            menuButton.classList.toggle('active');
        });
    }

    // 2. CIERRE GLOBAL DEL MENÚ (al hacer clic fuera)
    document.addEventListener('click', (event) => {
        if (menuButton && menuContent && !menuButton.contains(event.target) && !menuContent.contains(event.target)) {
            menuContent.classList.remove('show');
            menuButton.classList.remove('active');
        }
    });

    // 3. APERTURA DE MODALES (desde encabezado y menú)
    document.querySelectorAll('[data-modal]').forEach(element => {
        element.addEventListener('click', () => {
            const modalId = element.getAttribute('data-modal');
            if (menuContent && menuContent.classList.contains('show')) {
                menuContent.classList.remove('show');
                menuButton.classList.remove('active');
            }
            openModal(modalId);
        });
    });
    
    // 4. CIERRE DE MODALES (Botón X)
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Encuentra el ancestro '.modal-dialog'
            closeModal(e.target.closest('.modal-dialog'));
        });
    });

    // 5. CIERRE DE MODALES (al hacer clic fuera del contenido)
    window.addEventListener('click', (event) => {
        allModals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
}


function setupPasswordToggle() {
    const toggle = document.getElementById('toggle-password-login');
    const passwordInput = document.getElementById('password-login');
    
    if(toggle && passwordInput) {
        toggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? '👁️' : '🔒'; 
        });
    }
}

function setupForgotPasswordListener() {
    const link = document.getElementById('forgot-password-link');
    if (link) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('🔔Para recuperar su contraseña favor de manar un correo a Help@topsongs.com🔔');
        });
    }
}


// ----------------------------------------------------------------------
// FUNCIONES DE AUTENTICACIÓN (CRUD de Usuarios)
// ----------------------------------------------------------------------

async function registrarUsuario(username, password) {
    try {
        
        const role = 'user'; 
        
        const respuesta = await fetch(`${apiUrl}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });
        const data = await respuesta.json();
        
        const modal = document.getElementById('modal-registro');

        if (respuesta.ok) {
            console.log('Usuario registrado con éxito:', data);
            alert('Usuario registrado con éxito! Ahora puedes iniciar sesión.');
            closeModal(modal); // CIERRA MODAL
        } else {
            console.error('Error al registrar usuario:', data.message || 'Error desconocido');
            alert(`Error al registrar usuario: ${data.message || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error('Error de red al registrar usuario:', error);
        alert('Error de red al registrar usuario. Inténtalo de nuevo más tarde.');
    }
}

async function iniciarSesion(username, password) {
    try {
        const respuesta = await fetch(`${apiUrl}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await respuesta.json();
        
        const modal = document.getElementById('modal-login');

        if (respuesta.ok && data.token) {
            localStorage.setItem('token', data.token);
            token = data.token;
            alert('Sesión iniciada con éxito!');
            updateAuthUI(); 
            closeModal(modal); // CIERRA MODAL
        } else {
            console.error('Error al iniciar sesión:', data.message || 'Error desconocido');
            alert(`Error al iniciar sesión: ${data.message || 'Credenciales inválidas'}`);
        }
    } catch (error) {
        console.error('Error de red al iniciar sesión:', error);
        alert('Error de red al iniciar sesión. Inténtalo de nuevo más tarde.');
    }
}

function cerrarSesion() {
    localStorage.removeItem('token');
    token = null;
    alert('Sesión cerrada con éxito.');
    updateAuthUI();
}

// ----------------------------------------------------------------------
// FUNCIONES DE CRUD (Canciones)
// ----------------------------------------------------------------------

async function obtenerCanciones() {
    const listaDiv = document.getElementById('canciones-lista');
    if (!listaDiv) return;
    
    listaDiv.innerHTML = 'Cargando...';
    try {
        const respuesta = await fetch(`${apiUrl}/songs`);
        const canciones = await respuesta.json();
        
        listaDiv.innerHTML = '';
        if (respuesta.ok && Array.isArray(canciones) && canciones.length > 0) {
            canciones.forEach(song => {
                listaDiv.innerHTML += `
                    <div class="song-item">
                        <h3>${song.title}</h3>
                        <p><strong>Artista:</strong> ${song.artist}</p>
                        <p><strong>Año:</strong> ${song.year}</p>
                        <p style="font-size: 0.7em;">ID: ${song._id}</p>
                    </div>
                `;
            });
        } else {
            listaDiv.innerHTML = `<p>No se encontraron canciones. ${canciones.message || ''}</p>`;
        }
    } catch (error) {
        listaDiv.innerHTML = '<p>Error de red al obtener canciones.</p>';
        console.error('Error al obtener canciones:', error);
    }
}

async function obtenerCancionPorId() {
    const idInput = document.getElementById('id-cancion');
    const detalleDiv = document.getElementById('cancion-detalle');

    if (!idInput || !detalleDiv) return;

    const id = idInput.value;
    
    if (!id) {
        detalleDiv.innerHTML = '<p>Por favor, ingrese un ID de canción.</p>';
        return;
    }
    
    detalleDiv.innerHTML = 'Buscando...';
    
    try {
        const respuesta = await fetch(`${apiUrl}/songs/${id}`);
        const song = await respuesta.json();

        if (respuesta.ok && !song.message && !song.error) {
            detalleDiv.innerHTML = `
                <div class="song-item">
                    <h3>${song.title}</h3>
                    <p><strong>Artista:</strong> ${song.artist}</p>
                    <p><strong>Año:</strong> ${song.year}</p>
                    <p style="font-size: 0.7em;">ID: ${song._id}</p>
                </div>
            `;
        } else {
            detalleDiv.innerHTML = `<p>Error: ${song.message || song.error || 'Canción no encontrada'}</p>`;
        }
    } catch(error) {
        detalleDiv.innerHTML = '<p>Error de red al buscar la canción.</p>';
        console.error('Error al obtener canción por ID:', error);
    }
}

async function agregarCancion() {
    if (!token) {
        alert("Necesitas iniciar sesión para añadir canciones.");
        return;
    }
    const title = document.getElementById('nueva-cancion-titulo').value;
    const artist = document.getElementById('nueva-cancion-artista').value;
    const year = Number(document.getElementById('nueva-cancion-anio').value);
    
    if (!title || !artist || !year) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    try {
        const respuesta = await fetch(`${apiUrl}/songs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ title, artist, year })
        });
        const data = await respuesta.json();
        
        const modal = document.getElementById('modal-agregar');

        if (respuesta.ok) {
            alert(`Canción añadida: ${data.title}`);
            closeModal(modal); // CIERRA MODAL
        } else {
            alert(`Error al añadir canción: ${data.message || 'Token Inválido/Expirado'}`);
        }
    } catch (error) {
        alert('Error de red al añadir canción.');
        console.error('Error de red:', error);
    }
}

async function modificarCancion() {
    if (!token) {
        alert("Necesitas iniciar sesión para modificar canciones.");
        return;
    }
    const id = document.getElementById('id-cancion-modificar').value;
    const title = document.getElementById('titulo-modificar').value;
    const artist = document.getElementById('artista-modificar').value;
    const year = document.getElementById('anio-modificar').value;
    
    if (!id) {
        alert("El ID de la canción es obligatorio para modificar.");
        return;
    }

    const updatedData = {};
    if (title) updatedData.title = title;
    if (artist) updatedData.artist = artist;
    if (year) updatedData.year = Number(year);
    
    if (Object.keys(updatedData).length === 0) {
        alert("Proporciona al menos un campo para modificar.");
        return;
    }

    try {
        const respuesta = await fetch(`${apiUrl}/songs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(updatedData)
        });
        const data = await respuesta.json();
        
        const modal = document.getElementById('modal-modificar');

        if (respuesta.ok) {
            alert(`Canción modificada con éxito.`);
            closeModal(modal); // CIERRA MODAL
        } else {
            alert(`Error al modificar: ${data.message || 'ID o Token Inválido'}`);
        }
    } catch (error) {
        alert('Error de red al modificar canción.');
        console.error('Error de red:', error);
    }
}

async function eliminarCancion() {
    if (!token) {
        alert("Necesitas iniciar sesión para eliminar canciones.");
        return;
    }
    const id = document.getElementById('id-cancion-eliminar').value;
    if (!id) {
        alert("El ID de la canción es obligatorio para eliminar.");
        return;
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar la canción con ID: ${id}?`)) {
        return;
    }

    try {
        const respuesta = await fetch(`${apiUrl}/songs/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        const data = await respuesta.json();
        
        const modal = document.getElementById('modal-eliminar');

        if (respuesta.ok) {
            alert(`Eliminación exitosa: ${data.message}`);
            closeModal(modal); // CIERRA MODAL
        } else {
            alert(`Error al eliminar: ${data.message || 'ID o Token Inválido'}`);
        }
    } catch (error) {
        alert('Error de red al eliminar canción.');
        console.error('Error de red:', error);
    }
}


// ----------------------------------------------------------------------
// ASIGNACIÓN DE EVENT LISTENERS
// ----------------------------------------------------------------------

function setupActionListeners() {
    // Event Listeners de Autenticación
    // Los botones del encabezado (registrar-usuario-btn e iniciar-sesion-btn) usan el data-modal
    // Se agregan listeners a los botones dentro de los modales de autenticación.
    document.getElementById('registrar-usuario').addEventListener('click', () => {
        const username = document.getElementById('username-registro').value;
        const password = document.getElementById('password-registro').value;
        registrarUsuario(username, password);
    });

    document.getElementById('iniciar-sesion').addEventListener('click', () => {
        const username = document.getElementById('username-login').value;
        const password = document.getElementById('password-login').value;
        iniciarSesion(username, password);
    });

    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', () => {
            cerrarSesion();
        });
    }

    // Event Listeners de CRUD (dentro de los modales)
    document.getElementById('obtener-canciones-modal').addEventListener('click', obtenerCanciones); 
    document.getElementById('obtener-cancion-por-id').addEventListener('click', obtenerCancionPorId);
    document.getElementById('agregar-cancion').addEventListener('click', agregarCancion);
    document.getElementById('modificar-cancion').addEventListener('click', modificarCancion);
    document.getElementById('eliminar-cancion').addEventListener('click', eliminarCancion);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI(); // Configura los botones del encabezado
    setupDropdownAndModals(); // Configura el menú desplegable y la apertura/cierre de modales
    setupPasswordToggle(); // Configura el ojo de la contraseña
    setupForgotPasswordListener(); // Configura el enlace de olvidó contraseña
    setupActionListeners(); // Asigna listeners a los botones de acción dentro de los modales
});
// URL base de la API
const apiUrl = 'http://localhost:3000';
let token = localStorage.getItem('token') || null;
let userRole = localStorage.getItem('userRole') || null;

// ---------------------------
// UTILIDADES DE UI
// ---------------------------
function updateAuthUI() {
    const registerBtn = document.getElementById('registrar-usuario-btn');
    const loginBtn = document.getElementById('iniciar-sesion-btn');
    const logoutContainer = document.getElementById('logout-container');
    const isLoggedIn = token !== null;

    if (isLoggedIn) {
        if(registerBtn) registerBtn.style.display = 'none';
        if(loginBtn) loginBtn.style.display = 'none';
        if(logoutContainer) logoutContainer.style.display = 'block';
    } else {
        if(registerBtn) registerBtn.style.display = 'inline-block';
        if(loginBtn) loginBtn.style.display = 'inline-block';
        if(logoutContainer) logoutContainer.style.display = 'none';
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

function closeModal(modalElement) {
    if (!modalElement) return;
    modalElement.style.display = 'none';
    modalElement.querySelectorAll('input').forEach(input => input.value = '');
    modalElement.querySelectorAll('.song-list-display, .song-detail-display').forEach(div => div.innerHTML = '');
}

function closeModalById(modalId) {
    const modal = document.getElementById(modalId);
    closeModal(modal);
}

function setupDropdownAndModals() {
    const menuButton = document.getElementById('songs-menu-button');
    const menuContent = document.getElementById('songs-dropdown-content');
    const allModals = document.querySelectorAll('.modal-dialog');
    const closeButtons = document.querySelectorAll('.close-button');

    if (menuButton && menuContent) {
        menuButton.addEventListener('click', () => {
            menuContent.classList.toggle('show');
            menuButton.classList.toggle('active');
        });
    }

    document.addEventListener('click', (event) => {
        if (menuButton && menuContent && !menuButton.contains(event.target) && !menuContent.contains(event.target)) {
            menuContent.classList.remove('show');
            menuButton.classList.remove('active');
        }
    });

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

    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => closeModal(e.target.closest('.modal-dialog')));
    });

    window.addEventListener('click', (event) => {
        allModals.forEach(modal => { if (event.target === modal) closeModal(modal); });
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
            showNotification('🔔 Para recuperar su contraseña favor de enviar un correo a Help@topsongs.com 🔔');
        });
    }
}

// ---------------------------
// NOTIFICACIONES
// ---------------------------
function showNotification(message, duration = 3000) {
    const notifDiv = document.createElement('div');
    notifDiv.className = 'notification';
    notifDiv.textContent = message;
    notifDiv.style.position = 'fixed';
    notifDiv.style.top = '10px';
    notifDiv.style.right = '10px';
    notifDiv.style.backgroundColor = '#444';
    notifDiv.style.color = 'white';
    notifDiv.style.padding = '10px 20px';
    notifDiv.style.borderRadius = '5px';
    notifDiv.style.zIndex = '9999';
    document.body.appendChild(notifDiv);
    setTimeout(() => notifDiv.remove(), duration);
}

// ---------------------------
// FETCH GENÉRICO
// ---------------------------
async function fetchAPI(endpoint, method = 'GET', body = null, auth = false) {
    const headers = { 'Content-Type': 'application/json' };
    if(auth && token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${apiUrl}${endpoint}`, { method, headers, body: body ? JSON.stringify(body) : null });
    const data = await response.json();
    return { ok: response.ok, data };
}

function handleErrorResponse(data, defaultMsg = 'Ocurrió un error') {
    showNotification(data.message || data.error || defaultMsg);
}

// ---------------------------
// CONTROL DE ACCESO POR ROL
// ---------------------------
function checkAccess(action) {
    if(!token) {
        showNotification('Debes iniciar sesión para usar esta función.');
        return false;
    }
    if(userRole === 'user' && ['agregar','modificar','eliminar'].includes(action)) {
        showNotification('Solo el administrador puede realizar esta acción.');
        return false;
    }
    return true;
}

// ---------------------------
// AUTENTICACIÓN
// ---------------------------
async function registrarUsuario(username, password) {
    if(!username || !password) return showNotification('Usuario y contraseña requeridos');
    try {
        const { ok, data } = await fetchAPI('/users/register', 'POST', { username, password, role: 'user' });
        if(ok) {
            showNotification('Usuario registrado con éxito! Ahora puedes iniciar sesión.');
            closeModalById('modal-registro');
        } else handleErrorResponse(data, 'Error al registrar usuario');
    } catch(err) {
        console.error(err);
        showNotification('Error de red al registrar usuario');
    }
}

async function iniciarSesion(username, password) {
    if(!username || !password) return showNotification('Usuario y contraseña requeridos');
    try {
        const { ok, data } = await fetchAPI('/users/login', 'POST', { username, password });
        if(ok && data.token) {
            token = data.token;
            userRole = data.user.role;
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', userRole);
            updateAuthUI();
            showNotification('Sesión iniciada con éxito!');
            closeModalById('modal-login');
        } else handleErrorResponse(data, 'Credenciales inválidas');
    } catch(err) {
        console.error(err);
        showNotification('Error de red al iniciar sesión');
    }
}

function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    token = null;
    userRole = null;
    updateAuthUI();
    showNotification('Sesión cerrada con éxito.');
}

// ---------------------------
// CRUD CANCIONES
// ---------------------------
async function obtenerCanciones() {
    if(!token) {
        showNotification('Debes iniciar sesión para ver la lista de canciones.');
        return;
    }

    const listaDiv = document.getElementById('canciones-lista');
    if(!listaDiv) return;
    listaDiv.innerHTML = 'Cargando...';

    try {
        const { ok, data } = await fetchAPI('/songs', 'GET', null, true);
        listaDiv.innerHTML = '';
        if(ok && Array.isArray(data) && data.length) {
            const fragment = document.createDocumentFragment();
            data.forEach(song => {
                const div = document.createElement('div');
                div.className = 'song-item';
                div.innerHTML = `
                    <h3>${song.title}</h3>
                    <p><strong>Artista:</strong> ${song.artist}</p>
                    <p><strong>Año:</strong> ${song.year}</p>
                    <p style="font-size:0.7em;">ID: ${song._id}</p>
                `;
                fragment.appendChild(div);
            });
            listaDiv.appendChild(fragment);
        } else listaDiv.innerHTML = '<p>No se encontraron canciones.</p>';
    } catch(err) {
        console.error(err);
        listaDiv.innerHTML = '<p>Error de red al obtener canciones.</p>';
    }
}

async function obtenerCancionPorId() {
    if(!token) {
        showNotification('Debes iniciar sesión para buscar canciones por ID.');
        return;
    }

    const idInput = document.getElementById('id-cancion');
    const detalleDiv = document.getElementById('cancion-detalle');
    if(!idInput || !detalleDiv) return;

    const id = idInput.value.trim();
    if(!id) return detalleDiv.innerHTML = '<p>Por favor, ingrese un ID de canción.</p>';

    detalleDiv.innerHTML = 'Buscando...';
    try {
        const { ok, data } = await fetchAPI(`/songs/${id}`, 'GET', null, true);
        if(ok && !data.message && !data.error) {
            detalleDiv.innerHTML = `
                <div class="song-item">
                    <h3>${data.title}</h3>
                    <p><strong>Artista:</strong> ${data.artist}</p>
                    <p><strong>Año:</strong> ${data.year}</p>
                    <p style="font-size:0.7em;">ID: ${data._id}</p>
                </div>
            `;
        } else detalleDiv.innerHTML = `<p>Error: ${data.message || data.error || 'Canción no encontrada'}</p>`;
    } catch(err) {
        console.error(err);
        detalleDiv.innerHTML = '<p>Error de red al buscar la canción.</p>';
    }
}

async function agregarCancion() {
    if(!checkAccess('agregar')) return;
    const title = document.getElementById('nueva-cancion-titulo').value.trim();
    const artist = document.getElementById('nueva-cancion-artista').value.trim();
    const year = Number(document.getElementById('nueva-cancion-anio').value);
    if(!title || !artist || isNaN(year)) return showNotification('Todos los campos son obligatorios y el año debe ser un número.');

    try {
        const { ok, data } = await fetchAPI('/songs', 'POST', { title, artist, year }, true);
        if(ok) {
            showNotification(`Canción añadida: ${data.title}`);
            closeModalById('modal-agregar');
        } else handleErrorResponse(data, 'Error al añadir canción');
    } catch(err) {
        console.error(err);
        showNotification('Error de red al añadir canción.');
    }
}

async function modificarCancion() {
    if(!checkAccess('modificar')) return;
    const id = document.getElementById('id-cancion-modificar').value.trim();
    const title = document.getElementById('titulo-modificar').value.trim();
    const artist = document.getElementById('artista-modificar').value.trim();
    const yearVal = document.getElementById('anio-modificar').value.trim();
    const year = yearVal ? Number(yearVal) : undefined;

    if(!id) return showNotification('El ID de la canción es obligatorio.');
    if(!title && !artist && !year) return showNotification('Proporciona al menos un campo para modificar.');

    const updatedData = {};
    if(title) updatedData.title = title;
    if(artist) updatedData.artist = artist;
    if(year) updatedData.year = year;

    try {
        const { ok, data } = await fetchAPI(`/songs/${id}`, 'PUT', updatedData, true);
        if(ok) {
            showNotification('Canción modificada con éxito.');
            closeModalById('modal-modificar');
        } else handleErrorResponse(data, 'Error al modificar canción');
    } catch(err) {
        console.error(err);
        showNotification('Error de red al modificar canción.');
    }
}

async function eliminarCancion() {
    if(!checkAccess('eliminar')) return;
    const id = document.getElementById('id-cancion-eliminar').value.trim();
    if(!id) return showNotification('El ID de la canción es obligatorio.');
    if(!confirm(`¿Estás seguro de eliminar la canción con ID: ${id}?`)) return;

    try {
        const { ok, data } = await fetchAPI(`/songs/${id}`, 'DELETE', null, true);
        if(ok) {
            showNotification(`Eliminación exitosa: ${data.message}`);
            closeModalById('modal-eliminar');
        } else handleErrorResponse(data, 'Error al eliminar canción');
    } catch(err) {
        console.error(err);
        showNotification('Error de red al eliminar canción.');
    }
}

// ---------------------------
// EVENT LISTENERS
// ---------------------------
function setupActionListeners() {
    document.getElementById('registrar-usuario').addEventListener('click', () => {
        const username = document.getElementById('username-registro').value.trim();
        const password = document.getElementById('password-registro').value.trim();
        registrarUsuario(username, password);
    });

    document.getElementById('iniciar-sesion').addEventListener('click', () => {
        const username = document.getElementById('username-login').value.trim();
        const password = document.getElementById('password-login').value.trim();
        iniciarSesion(username, password);
    });

    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    if(cerrarSesionBtn) cerrarSesionBtn.addEventListener('click', cerrarSesion);

    document.getElementById('obtener-canciones-modal').addEventListener('click', obtenerCanciones);
    document.getElementById('obtener-cancion-por-id').addEventListener('click', obtenerCancionPorId);
    document.getElementById('agregar-cancion').addEventListener('click', agregarCancion);
    document.getElementById('modificar-cancion').addEventListener('click', modificarCancion);
    document.getElementById('eliminar-cancion').addEventListener('click', eliminarCancion);
}

// ---------------------------
// INICIALIZACIÓN
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    setupDropdownAndModals();
    setupPasswordToggle();
    setupForgotPasswordListener();
    setupActionListeners();
});
// Abrir canción al hacer click en el slide
document.querySelectorAll('.slide').forEach(slide => {
    slide.style.cursor = 'pointer'; // Mostrar que es clickeable
    slide.addEventListener('click', () => {
        const cancionUrl = slide.getAttribute('data-cancion');
        if(cancionUrl) window.open(cancionUrl, '_blank'); // Abrir en nueva pestaña
    });
});
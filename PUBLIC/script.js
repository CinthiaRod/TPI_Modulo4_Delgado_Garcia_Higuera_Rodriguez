// URL base de la API
const apiUrl = 'http://localhost:3000';
let token = localStorage.getItem('token') || null;

// Funciones de autenticación (ya están bien, no necesitan cambios)
async function registrarUsuario(username, password) {
  try {
    const respuesta = await fetch(`${apiUrl}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    const data = await respuesta.json();
    if (respuesta.ok) {
      console.log('Usuario registrado con éxito:', data);
      alert('Usuario registrado con éxito!');
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    const data = await respuesta.json();
    if (respuesta.ok && data.token) {
      localStorage.setItem('token', data.token);
      token = data.token;
      console.log('Sesión iniciada con éxito. Token:', token);
      alert('Sesión iniciada con éxito!');
    } else {
      console.error('Error al iniciar sesión:', data.message || 'Error desconocido');
      alert(`Error al iniciar sesión: ${data.message || 'Error desconocido'}`);
    }
  } catch (error) {
    console.error('Error de red al iniciar sesión:', error);
    alert('Error de red al iniciar sesión. Inténtalo de nuevo más tarde.');
  }
}

// Funciones para interactuar con las canciones
async function obtenerCanciones() {
    try {
        const respuesta = await fetch(`${apiUrl}/songs`);
        const data = await respuesta.json();

        if (respuesta.ok) {
            console.log('Canciones obtenidas:', data);
            const cancionesHtml = data.map(cancion => {
                return `
                    <div class="song-item">
                        <h3>${cancion.title}</h3>
                        <p><strong>Artista:</strong> ${cancion.artist}</p>
                        <p><strong>Año:</strong> ${cancion.year}</p>
                        <p><strong>ID:</strong> ${cancion._id}</p>
                    </div>
                `;
            }).join('');
            document.getElementById('canciones-lista').innerHTML = cancionesHtml;
        } else {
            console.error('Error al obtener canciones:', data.message || 'Error desconocido');
            alert(`Error al obtener canciones: ${data.message || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error('Error de red al obtener canciones:', error);
        alert('Error de red al obtener canciones. Inténtalo de nuevo más tarde.');
    }
}

async function obtenerCancionPorId(id) {
    try {
        const respuesta = await fetch(`${apiUrl}/songs/${id}`);
        const data = await respuesta.json();

        if (respuesta.ok) {
            console.log('Canción obtenida:', data);
            const cancionHtml = `
                <div class="song-item">
                    <h3>${data.title}</h3>
                    <p><strong>Artista:</strong> ${data.artist}</p>
                    <p><strong>Año:</strong> ${data.year}</p>
                    <p><strong>ID:</strong> ${data._id}</p>
                </div>
            `;
            document.getElementById('cancion-detalle').innerHTML = cancionHtml;
        } else {
            console.error('Error al obtener canción por ID:', data.message || 'Error desconocido');
            document.getElementById('cancion-detalle').innerHTML = `<p>Error: ${data.message || 'Canción no encontrada'}</p>`;
            alert(`Error al obtener canción: ${data.message || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error('Error de red al obtener canción por ID:', error);
        alert('Error de red al obtener canción. Inténtalo de nuevo más tarde.');
    }
}

async function agregarCancion(title, artist, year) {
    try {
        if (!token) {
            alert('Debes iniciar sesión para agregar una canción.');
            return;
        }

        const respuesta = await fetch(`${apiUrl}/songs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, artist, year })
        });
        const data = await respuesta.json();
        if (respuesta.ok) {
            console.log('Canción agregada con éxito:', data);
            alert('Canción agregada con éxito!');
        } else {
            console.error('Error al agregar canción:', data.message || 'Error desconocido');
            alert(`Error al agregar canción: ${data.message || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error('Error de red al agregar canción:', error);
        alert('Error de red al agregar canción. Inténtalo de nuevo más tarde.');
    }
}

async function modificarCancion(id, title, artist, year) {
    try {
        if (!token) {
            alert('Debes iniciar sesión para modificar una canción.');
            return;
        }

        const respuesta = await fetch(`${apiUrl}/songs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, artist, year })
        });
        const data = await respuesta.json();
        if (respuesta.ok) {
            console.log('Canción modificada con éxito:', data);
            alert('Canción modificada con éxito!');
        } else {
            console.error('Error al modificar canción:', data.message || 'Error desconocido');
            alert(`Error al modificar canción: ${data.message || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error('Error de red al modificar canción:', error);
        alert('Error de red al modificar canción. Inténtalo de nuevo más tarde.');
    }
}

async function eliminarCancion(id) {
    try {
        if (!token) {
            alert('Debes iniciar sesión para eliminar una canción.');
            return;
        }

        const respuesta = await fetch(`${apiUrl}/songs/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await respuesta.json();
        if (respuesta.ok) {
            console.log('Canción eliminada con éxito:', data);
            alert('Canción eliminada con éxito!');
        } else {
            console.error('Error al eliminar canción:', data.message || 'Error desconocido');
            alert(`Error al eliminar canción: ${data.message || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error('Error de red al eliminar canción:', error);
        alert('Error de red al eliminar canción. Inténtalo de nuevo más tarde.');
    }
}

// Event Listeners (ajustados para los nuevos nombres y IDs)
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

document.getElementById('obtener-canciones').addEventListener('click', () => {
    obtenerCanciones();
});

document.getElementById('obtener-cancion-por-id').addEventListener('click', () => {
    const id = document.getElementById('id-cancion').value;
    obtenerCancionPorId(id);
});

document.getElementById('agregar-cancion').addEventListener('click', () => {
    const title = document.getElementById('nueva-cancion-titulo').value;
    const artist = document.getElementById('nueva-cancion-artista').value;
    const year = parseInt(document.getElementById('nueva-cancion-anio').value);
    agregarCancion(title, artist, year);
});

document.getElementById('modificar-cancion').addEventListener('click', () => {
    const id = document.getElementById('id-cancion-modificar').value;
    const title = document.getElementById('titulo-modificar').value;
    const artist = document.getElementById('artista-modificar').value;
    const year = parseInt(document.getElementById('anio-modificar').value);
    modificarCancion(id, title, artist, year);
});

document.getElementById('eliminar-cancion').addEventListener('click', () => {
    const id = document.getElementById('id-cancion-eliminar').value;
    eliminarCancion(id);
});
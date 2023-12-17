var id;
var indice;
var ListaSemestres;

function obtenerParametrosDeURL() {
    // Obtiene la cadena de consulta (query string) de la URL actual
    var queryString = window.location.search;

    // Crea un objeto para almacenar los parámetros
    var parametros = {};

    // Divide la cadena de consulta en pares clave-valor
    var pares = queryString.substring(1).split('&');

    // Itera a través de los pares y los almacena en el objeto de parámetros
    for (var i = 0; i < pares.length; i++) {
        var par = pares[i].split('=');
        var clave = decodeURIComponent(par[0]);
        var valor = decodeURIComponent(par[1]);
        parametros[clave] = valor;
    }

    id = parametros.index;
    ListaSemestres = cargarSemestresDesdeAPI();
}

document.addEventListener('DOMContentLoaded', async function() {
    var contenedorHTML = document.getElementById("encabezado");
    var div = document.createElement("div");

    // Espera a que la promesa se resuelva completamente
    var ListaSemestres = await cargarSemestresDesdeAPI();
    indice = ListaSemestres.findIndex(elemento => elemento.id === id);

    if (ListaSemestres && ListaSemestres.length > 0) {
        div.innerHTML = `
            <div class="container vertical-center">
                <div class="text-center">
                    <h1>${ListaSemestres[indice].nombre}</h1>
                    <button type="button" class="btn btn-primary my-3" data-bs-toggle="modal" data-bs-target="#exampleModal">Detalles del Semestre</button>
                </div>
            </div>
        `;
        contenedorHTML.appendChild(div);

        var descripcionLabel = document.getElementById("descripcionLabel");
        descripcionLabel.textContent = ListaSemestres[indice].descripcion;
        var annoLabel = document.getElementById("anno");
        annoLabel.textContent = ListaSemestres[indice].anno;
        var inicioLabel = document.getElementById("inicio");
        inicioLabel.textContent = ListaSemestres[indice].inicio;
        var finalLabel = document.getElementById("final");
        finalLabel.textContent = ListaSemestres[indice].final;
    }
});

// Este código se ejecutará después de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa la conexión con Socket.IO
    const socket = io();

    // Escucha el evento 'archivoSubido' y muestra una alerta con el mensaje
    socket.on('archivoSubido', (mensaje) => {
    alert(mensaje);
    // Cerrar el modal después de mostrar la alerta
    var modal = bootstrap.Modal.getInstance(document.getElementById('AttachFileModal'));
    modal.hide();
    });

    // Ahora es seguro buscar elementos del DOM
    const form = document.getElementById('formArchivo');
    if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario

        const formData = new FormData(this); // Crea un FormData con los datos del formulario

        // Envía el archivo usando Fetch API
        fetch('/subir-archivo', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Aquí puedes manejar la respuesta del servidor
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    } else {
        console.error('Formulario no encontrado');
    }
});

async function cargarSemestresDesdeAPI() {
    try {
        const response = await fetch('https://tf7kj3-3000.csb.app/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query Query {
                        getAllSemestre {
                            id
                            nombre
                            descripcion
                            anno
                            inicio
                            final
                            color
                        }
                    }
                `,
            }),
        });

        const data = await response.json();

        if (data && data.data) {
            const semestresFromAPI = data.data.getAllSemestre;
            return semestresFromAPI.map(semestre => ({
                id: semestre.id,
                nombre: semestre.nombre,
                descripcion: semestre.descripcion,
                anno: semestre.anno,
                inicio: semestre.inicio,
                final: semestre.final,
                color: semestre.color
            }));
        } else {
            console.error('Error en la respuesta GraphQL:', data);
            return [];
        }
    } catch (error) {
        console.error('Error en la solicitud GraphQL:', error);
        return [];
    }
}


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}
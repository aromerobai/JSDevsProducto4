var ListaSemestres = [];

// Llama a la función cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    cargarSemestresDesdeAPI();  
});

document.getElementById("nuevoSemestreForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe normalmente
  
    // Obtiene los valores ingresados por el usuario
    var nombre = document.getElementById("nombre").value;
    var descripcion = document.getElementById("descripcion").value;
    var anno = document.getElementById("anno").value;
    var inicio = document.getElementById("inicio").value;
    var final = document.getElementById("final").value;
    var color = document.getElementById("color").value;
    //var asignaturas=[];
    
    //Creamos un semestre nuevo en el servidor.
    guardarSemestreEnServidor(nombre, descripcion, anno, inicio, final, color);
    
    // Limpia el formulario
    document.getElementById("nuevoSemestreForm").reset();
    
    // Oculta el modal
    $('#exampleModal').modal('hide')
    cargarSemestresDesdeAPI();
});

async function actualizarVista() {
    
    var contenedorHTML = document.getElementById("semestres");
    contenedorHTML.innerHTML = '';
    // Recorre el vector y genera HTML para cada objeto
    ListaSemestres.forEach(function (objeto, index) {
        // Genera elementos HTML
        var div = document.createElement("div");
        div.className = "col-sm-6 col-md-4 col-lg-4 my-3"; // Asigna las clases Bootstrap
        div.innerHTML = `
            <div class="card">
                <div class="card-body" style="background-color:${objeto.color};">
                    <h5 class="card-title">${objeto.nombre}</h5>
                    <p class="card-text">${objeto.descripcion}</p>
                    <div class="d-flex justify-content-end">
                        <a href="#" class="btn btn-primary btn-sm me-2" id="detalleBtn${index}">Detalle</a>
                        <a href="#" class="btn btn-danger btn-sm" id="eliminarBtn${index}">Eliminar</a>
                    </div>
                </div>
            </div>
        `;
        contenedorHTML.appendChild(div);

        // Agrega un evento al botón para eliminar el elemento
        document.getElementById(`eliminarBtn${index}`).addEventListener('click', function () {
            eliminarElemento(index);
        });
        // Agrega un evento al botón para ver el detalle del elemento
        document.getElementById(`detalleBtn${index}`).addEventListener('click', function () {
            var url = "../html/detalle.html?index=" + ListaSemestres[index].id;
            window.location.href = url;
        });

    });
}

function cargarSemestresDesdeAPI() {
    fetch('https://tf7kj3-3000.csb.app/api', {
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
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.data) {
            const semestresFromAPI = data.data.getAllSemestre;
            ListaSemestres = semestresFromAPI.map(semestre => ({
                id: semestre.id,
                nombre: semestre.nombre,
                descripcion: semestre.descripcion,
                anno: semestre.anno,
                inicio: semestre.inicio,
                final: semestre.final,
                color: semestre.color
            }));
            actualizarVista();
        } else {
            console.error('Error en la respuesta GraphQL:', data);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud GraphQL:', error);
    });
}

function guardarSemestreEnServidor(nombre, descripcion, anno, inicio, final, color) {
    
    fetch('https://tf7kj3-3000.csb.app/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
            mutation ($nombre: String, $descripcion: String, $anno: String, $inicio: String, $final: String, $color: String) {
                createSemestre(SemestreInput: {
                    nombre: $nombre,
                    descripcion: $descripcion,
                    anno: $anno,
                    inicio: $inicio,
                    final: $final,
                    color: $color
                }) {
                    nombre
                    descripcion
                    anno
                    inicio
                    final
                    color
                }
            }
            `,
            variables: {
                nombre: nombre,
                descripcion: descripcion,
                anno: anno,
                inicio: inicio,
                final: final,
                color: color
            }
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.errors) {
            console.error('Error en la respuesta GraphQL:', data.errors);
        } else {
            cargarSemestresDesdeAPI();
        }
    })
    .catch(error => {
        console.error('Error en la solicitud GraphQL:', error);
    });
}

function eliminarElemento(indice) {

    var alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-warning alert-dismissible fade show";
    alertDiv.innerHTML = `
        <strong>Confirmación:</strong> ¿Estás seguro de que deseas eliminar el semestre?
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        <div class="mt-3">
            <button type="button" class="btn btn-danger me-2" id="btnCancelar">Cancelar</button>
            <button type="button" class="btn btn-primary" id="btnAceptar">Aceptar</button>
        </div>
    `;
    // Agrega el elemento div al cuerpo del documento
    document.body.appendChild(alertDiv);

    // Agrega un evento al botón de cancelar
    document.getElementById("btnCancelar").addEventListener("click", function () {
        document.body.removeChild(alertDiv); // Cierra la alerta
    });
    // Agrega un evento al botón de aceptar
    document.getElementById("btnAceptar").addEventListener("click", function () {
        //Lo eleminamos del servidor
        fetch('https://tf7kj3-3000.csb.app/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                mutation DeleteSemestreByIndex($index: Int) {
                    deleteSemestreByIndex(index: $index)
                }    
            `,
            variables: {
                "index": indice,
            }
        }),
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.errors) {
                console.error('Error en la respuesta GraphQL:', data.errors);
            } else {
                cargarSemestresDesdeAPI();
            }
        })
        .catch(error => {
            console.error('Error en la solicitud GraphQL:', error);
        });
         
        document.body.removeChild(alertDiv);
    });
}

var socket = io.connect('https://tf7kj3-3000.csb.app/'); // Conectarse al servidor Socket.IO

socket.on('semestreCreado', function(data) {
    if (data.status === "ok") {
        console.log(data.message); // Muestra el mensaje de confirmación
        alert(data.message);
        cargarSemestresDesdeAPI(); // Actualizar la lista de semestres
    } else {
        console.error("Error al crear el semestre:", data.message);
    }
});

socket.on('semestreEliminado', function(data) {
    if (data.status === "ok") {
        console.log(data.message); // Muestra el mensaje de confirmación
        alert(data.message);
        cargarSemestresDesdeAPI(); // Actualizar la lista de semestres
    } else {
        console.error("Error al eliminar el semestre:", data.message);
    }
});
const asignaturas_pannel = document.getElementById("asignaturas-pannel");
const aprobado_pannel = document.getElementById("aprobada-pannel");
const suspendida_pannel = document.getElementById("suspendida-pannel");
const add_button = document.getElementById("add-card");
const upd_button = document.getElementById("update-card");

add_button.addEventListener("click", createCard);

const id_div = "drag";
var i = 0;

//Inicializo las asignaturas
(async () => {
  getAllSubjects()
    .then((subjects) => {
      subjects.forEach((subject) => {
        if (subject.idSemestre == id) {
          createCardConDatos(
            subject.id,
            subject.nombre,
            subject.descripcion,
            subject.dificultad,
            subject.estado
          );
        }
      });
    })
    .catch((error) => {
      console.error("Ocurrió un error al obtener las asignaturas:", error);
    });
})();

//Añado listeners a los paneles
asignaturas_pannel.addEventListener("drop", function (event) {
  handleDrop(event, asignaturas_pannel);
});

aprobado_pannel.addEventListener("drop", function (event) {
  handleDrop(event, aprobado_pannel);
});

suspendida_pannel.addEventListener("drop", function (event) {
  handleDrop(event, suspendida_pannel);
});

function handleDrop(event, panel) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const draggedElement = document.getElementById(data);

  // Llama a la función pasando el panel como argumento
  yourFunctionToHandleDrop(draggedElement, panel);
}

//Actualizo la asignatura al panel donde esta
function yourFunctionToHandleDrop(draggedElement, panel) {
  var id_asigntura = "";
  var estado_asignatura = "";

  const inputHidden = draggedElement.querySelector('input[type="hidden"]');
  if (inputHidden) {
    id_asigntura = inputHidden.value;
    console.log("Valor del input hidden:", id_asigntura);
  } else {
    console.log(
      "No se encontró el input hidden dentro del elemento arrastrado."
    );
  }

  const colTitle = panel.querySelector(".col-title");
  if (colTitle) {
    const h2Element = colTitle.querySelector("h2");
    if (h2Element) {
      estado_asignatura = h2Element.textContent;
      console.log("Contenido del h2 Primero:", estado_asignatura);
      estado_asignatura = estado_asignatura.replace(/\+/g, "").trim();
      console.log("Contenido del h2 Segundo:", estado_asignatura);
    } else {
      console.log("No se encontró el elemento h2 dentro de col-title.");
    }
  } else {
    console.log(
      "No se encontró el elemento con la clase col-title dentro del panel."
    );
  }

  updateSubjectStateMutation(id_asigntura, estado_asignatura)
    .then((updatedSubject) => {
      console.log("Asignatura actualizada:", updatedSubject);
      // Realiza las acciones necesarias con la asignatura actualizada
    })
    .catch((error) => {
      // Manejo de errores
      console.error(error.message);
    });
}

function createCardConDatos(id, nombre, descripcion, dificultad, estado) {
  /*Divs*/
  const card_div = document.createElement("div");
  var res = id_div.concat(String(i));
  card_div.setAttribute("id", res);

  console.log("Estado:", estado);

  card_div.classList.add("card");
  card_div.classList.add("mb-3");
  card_div.setAttribute("draggable", "true");
  card_div.setAttribute("ondragstart", "drag(event)");
  const row_div = document.createElement("div");
  row_div.classList.add("row");
  row_div.classList.add("g-0");
  const col_div = document.createElement("div");
  col_div.classList.add("col-md-12");
  const card_body = document.createElement("div");
  card_body.classList.add("card-body");

  /*Title*/
  const title_val = nombre;
  var nom = document.getElementById("title").value;
  const title_txt = document.createTextNode(title_val);
  const h5 = document.createElement("h5");
  h5.classList.add("card-title");
  h5.appendChild(title_txt);

  /*Description*/
  const desc_val = descripcion;
  var desc = document.getElementById("description").value;
  const desc_txt = document.createTextNode(desc_val);
  const p_desc = document.createElement("p");
  p_desc.classList.add("card-text");
  p_desc.classList.add("card-description");
  p_desc.appendChild(desc_txt);
  const br = document.createElement("br");
  p_desc.appendChild(br);

  /* Dificultad */
  const difficulty_val = dificultad;
  var difficulty_txt = document.createTextNode("Dificultad: " + difficulty_val);
  const p_difficulty = document.createElement("p");
  p_difficulty.classList.add("card-text");
  p_difficulty.classList.add("card-difficulty");
  p_difficulty.appendChild(difficulty_txt);

  /*ID de la asignatura Oculto*/
  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.name = "id"; // Puedes asignar un nombre al input hidden
  hiddenInput.value = id;

  /*Update Button
    const upd_button = document.createElement("btn");
    upd_button.setAttribute("id", "btn"+String(i));
    upd_button.setAttribute("type", "button");
    upd_button.classList.add("btn");
    upd_button.classList.add("btn-primary");
    upd_button.classList.add("btn-sm");
    upd_button.setAttribute("data-bs-toggle", "modal");
    upd_button.setAttribute("data-bs-target", "#AddUpdCard");
    upd_button.setAttribute("onclick", "modalUpdateCard(this)");
    const upd_button_txt = document.createTextNode("Modificar");
    upd_button.appendChild(upd_button_txt);*/

  /*Delete Button*/
  const del_button = document.createElement("btn");
  del_button.setAttribute("type", "button");
  del_button.classList.add("btn");
  del_button.classList.add("btn-danger");
  del_button.classList.add("btn-sm");
  del_button.classList.add("btn-delete");
  del_button.setAttribute("data-bs-toggle", "modal");
  del_button.setAttribute("data-bs-target", "#DeleteCard");
  del_button.setAttribute("onclick", "deleteCard(this)");

  const del_button_txt = document.createTextNode("Eliminar");
  del_button.appendChild(del_button_txt);

  //apalac botón fichero
  /* Adjuntar Fichero Button */
  //Ini apalac
  const attach_button = document.createElement("btn");
  attach_button.setAttribute("type", "button");
  attach_button.classList.add("btn");
  attach_button.classList.add("btn-primary");
  attach_button.classList.add("btn-sm");
  attach_button.classList.add("btn-attach");
  attach_button.setAttribute("data-bs-toggle", "modal");
  attach_button.setAttribute("data-bs-target", "#AttachFileModal");
  attach_button.setAttribute("onclick", "attachFile(this)");

  const attach_button_txt = document.createTextNode("Adjuntar Fichero");
  attach_button.appendChild(attach_button_txt);
  //Fin apalac

  card_body.appendChild(h5);
  card_body.appendChild(p_desc);
  card_body.appendChild(p_difficulty);
  card_body.appendChild(hiddenInput);
  //card_body.appendChild(upd_button);
  card_body.appendChild(del_button);

  //Ini apalac
  card_body.appendChild(attach_button);
  //End apalac

  col_div.appendChild(card_body);
  row_div.appendChild(col_div);
  card_div.appendChild(row_div);

  //asignaturas_pannel.appendChild(card_div);

  clearLabels();
  i += 1;

  if (estado == "Empezada") {
    asignaturas_pannel.appendChild(card_div);
  } else if (estado == "Aprobada") {
    aprobado_pannel.appendChild(card_div);
  } else if (estado == "Suspendida") {
    suspendida_pannel.appendChild(card_div);
  }
}

function createCard() {
  const title_val = document.getElementById("title").value;
  const desc_val = document.getElementById("description").value;
  const difficulty_val = document.getElementById("difficulty").value;
  var difficulty_txt = document.createTextNode("Dificultad: " + difficulty_val);

  const panelId = document.getElementById("panelIdField").value;
  const panel = document.getElementById(panelId);

  var id_asignatura_creada = "";

  var panelDondeSeCrea = "";

  if (panelId == "asignaturas-pannel") {
    panelDondeSeCrea = "Empezada";
  } else if (panelId == "aprobada-pannel") {
    panelDondeSeCrea = "Aprobada";
  } else if (panelId == "suspendida-pannel") {
    panelDondeSeCrea = "Suspendida";
  }

  guardarSubjectEnServidor(title_val, desc_val, difficulty_val, id, panelDondeSeCrea)
    .then((id_asignatura_creada) => {
      /*Divs*/
      const card_div = document.createElement("div");
      var res = id_div.concat(String(i));
      card_div.setAttribute("id", res);

      card_div.classList.add("card");
      card_div.classList.add("mb-3");
      card_div.setAttribute("draggable", "true");
      card_div.setAttribute("ondragstart", "drag(event)");
      const row_div = document.createElement("div");
      row_div.classList.add("row");
      row_div.classList.add("g-0");
      const col_div = document.createElement("div");
      col_div.classList.add("col-md-12");
      const card_body = document.createElement("div");
      card_body.classList.add("card-body");

      /*Title*/
      var nom = document.getElementById("title").value;
      const title_txt = document.createTextNode(title_val);
      const h5 = document.createElement("h5");
      h5.classList.add("card-title");
      h5.appendChild(title_txt);

      /*Description*/
      var desc = document.getElementById("description").value;
      const desc_txt = document.createTextNode(desc_val);
      const p_desc = document.createElement("p");
      p_desc.classList.add("card-text");
      p_desc.classList.add("card-description");
      p_desc.appendChild(desc_txt);
      const br = document.createElement("br");
      p_desc.appendChild(br);

      /* Dificultad */
      const p_difficulty = document.createElement("p");
      p_difficulty.classList.add("card-text");
      p_difficulty.classList.add("card-difficulty");
      p_difficulty.appendChild(difficulty_txt);

      /*ID de la asignatura Oculto*/
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "id"; // Puedes asignar un nombre al input hidden
      hiddenInput.value = id_asignatura_creada;

      /*Update Button
        const upd_button = document.createElement("btn");
        upd_button.setAttribute("id", "btn"+String(i));
        upd_button.setAttribute("type", "button");
        upd_button.classList.add("btn");
        upd_button.classList.add("btn-primary");
        upd_button.classList.add("btn-sm");
        upd_button.setAttribute("data-bs-toggle", "modal");
        upd_button.setAttribute("data-bs-target", "#AddUpdCard");
        upd_button.setAttribute("onclick", "modalUpdateCard(this)");
        const upd_button_txt = document.createTextNode("Modificar");
        upd_button.appendChild(upd_button_txt);*/

      /*Delete Button*/
      const del_button = document.createElement("btn");
      del_button.setAttribute("type", "button");
      del_button.classList.add("btn");
      del_button.classList.add("btn-danger");
      del_button.classList.add("btn-sm");
      del_button.classList.add("btn-delete");
      del_button.setAttribute("data-bs-toggle", "modal");
      del_button.setAttribute("data-bs-target", "#DeleteCard");
      del_button.setAttribute("onclick", "deleteCard(this)");
      const del_button_txt = document.createTextNode("Eliminar");
      del_button.appendChild(del_button_txt);

      const attach_button = document.createElement("btn");
      attach_button.setAttribute("type", "button");
      attach_button.classList.add("btn");
      attach_button.classList.add("btn-primary");
      attach_button.classList.add("btn-sm");
      attach_button.classList.add("btn-attach");
      attach_button.setAttribute("data-bs-toggle", "modal");
      attach_button.setAttribute("data-bs-target", "#AttachFileModal");
      attach_button.setAttribute("onclick", "attachFile(this)");
    
      const attach_button_txt = document.createTextNode("Adjuntar Fichero");
      attach_button.appendChild(attach_button_txt);

      card_body.appendChild(h5);
      card_body.appendChild(p_desc);
      card_body.appendChild(p_difficulty);
      card_body.appendChild(hiddenInput);
      card_body.appendChild(upd_button);
      card_body.appendChild(del_button);
      
      card_body.appendChild(attach_button);
      
      col_div.appendChild(card_body);
      row_div.appendChild(col_div);
      card_div.appendChild(row_div);

      //asignaturas_pannel.appendChild(card_div);
      panel.appendChild(card_div);

      clearLabels();
      i += 1;
    })
    .catch((error) => {
      console.error("Error al crear el objeto:", error);
    });
}

function clearLabels() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("difficulty").value = "";
}

const delete_btns = document.querySelectorAll(".btn-delete");

function modalAddCard(panelId) {
  clearLabels();
  changeModalTitle(document.getElementById("modalTitle"), "Agregar");
  add_button.style.display = "block";
  upd_button.style.display = "none";

  // Guarda el panelId en un campo oculto
  document.getElementById("panelIdField").value = panelId;
}

function modalUpdateCard(element) {
  changeModalTitle(document.getElementById("modalTitle"), "Modificar");
  const card_body = element.parentElement;
  const title = card_body.children[0];
  const description = card_body.children[1];
  const difficulty = card_body.children[2];

  /*Change add btn to update btn*/
  add_button.style.display = "none";
  upd_button.style.display = "block";
  upd_button.setAttribute(
    "onclick",
    "updateCard(document.getElementById('" + element.id + "'))"
  );

  /*Fill the form with the card values*/
  document.getElementById("title").value = getTextContent(title);
  document.getElementById("description").value = getTextContent(description);
  document.getElementById("difficulty").value = getTextContent(difficulty);
}

/*
function updateCard(element){    
    const card_body = element.parentElement;     
    const title = card_body.children[0];     
    const description = card_body.children[1]; 
    const difficulty = card_body.children[2]; 

    deleteChilds(title);
    deleteChilds(description);
    deleteChilds(difficulty);
    title.appendChild(document.createTextNode(document.getElementById("title").value));        
    description.appendChild(document.createTextNode(document.getElementById("description").value));  
    difficulty.appendChild(document.createTextNode("Dificultad: " + document.getElementById("difficulty").value));      
}*/

function changeModalTitle(element, action) {
  deleteChilds(element);
  element.appendChild(document.createTextNode(action + " asignatura"));
}

function deleteChilds(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}

function getTextContent(element) {
  return element.textContent;
}

function deleteCard(element) {
  document.getElementById("DeleteBtn").addEventListener("click", function () {
    const cardId = element.closest(".card").getAttribute("id");
    console.log("ID de la tarjeta:", cardId);

    const inputId = document.querySelector(`#${cardId} input[name="id"]`).value;
    console.log("ID de la asignatura:", inputId);

    eliminarAsignaturaEnServidor(inputId)
      .then(() => {
        console.log("Asignatura eliminada exitosamente");
        // Realiza acciones adicionales después de eliminar la asignatura si es necesario
      })
      .catch((error) => {
        console.error("Error al eliminar la asignatura:", error);
        // Manejo de errores
      });

    element.closest(".card").remove();
  });
}

function guardarSubjectEnServidor(
  nombre,
  descripcion,
  dificultad,
  idSemestre,
  estado
) {
  return new Promise((resolve, reject) => {
    fetch("https://tf7kj3-3000.csb.app/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation ($nombre: String, $descripcion: String, $dificultad: String, $idSemestre: String, $estado: String) {
            createSubject(SubjectInput: {
              nombre: $nombre,
              descripcion: $descripcion,
              dificultad: $dificultad,
              idSemestre: $idSemestre,
              estado: $estado,
            }) {
              id
              nombre
              descripcion
              dificultad
              idSemestre
              estado
            }
          }
        `,
        variables: {
          nombre: nombre,
          descripcion: descripcion,
          dificultad: dificultad,
          idSemestre: idSemestre,
          estado: estado,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.errors) {
          console.error("Error en la respuesta GraphQL:", data.errors);
          reject("Error en la respuesta GraphQL");
        } else {
          const createdSubject = data.data.createSubject;
          console.log("Asignatura creada:", createdSubject);
          resolve(createdSubject.id); // Resuelve la promesa con el ID del objeto creado
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud GraphQL:", error);
        reject("Error en la solicitud GraphQL");
      });
  });
}

async function getAllSubjects() {
  try {
    const response = await fetch("https://tf7kj3-3000.csb.app/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
                query Query {
                    getAllSubjects {
                        id
                        nombre
                        descripcion
                        dificultad
                        idSemestre
                        estado
                    }
                }
                `,
      }),
    });

    const data = await response.json();

    if (data && data.data) {
      const subjectFromAPI = data.data.getAllSubjects;
      return subjectFromAPI.map((Subject) => ({
        id: Subject.id,
        nombre: Subject.nombre,
        descripcion: Subject.descripcion,
        dificultad: Subject.dificultad,
        idSemestre: Subject.idSemestre,
        estado: Subject.estado,
      }));
    } else {
      console.error("Error en la respuesta GraphQL:", data);
      return []; // O un valor que indique un error
    }
  } catch (error) {
    console.error("Error en la solicitud GraphQL:", error);
    return []; // O un valor que indique un error
  }
}

const updateSubjectStateMutation = async (id, newState) => {
  const graphqlUrl = "https://tf7kj3-3000.csb.app/api"; // La URL de tu API GraphQL

  const requestBody = {
    query: `
        mutation UpdateSubjectState($id: ID!, $newState: String!) {
          updateSubjectState(id: $id, newState: $newState) {
            id
            nombre
            descripcion
            dificultad
            idSemestre
            estado
          }
        }
      `,
    variables: {
      id: id,
      newState: newState,
    },
  };

  try {
    const response = await fetch(graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return data.data.updateSubjectState;
  } catch (error) {
    console.error("Error al realizar la mutación:", error);
    throw new Error("Error al actualizar el estado de la asignatura");
  }
};

function eliminarAsignaturaEnServidor(id) {
  return new Promise((resolve, reject) => {
    fetch("https://tf7kj3-3000.csb.app/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
            mutation DeleteSubject($id: ID!) {
              deleteSubject(id: $id)
            }
          `,
        variables: {
          id: id,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.errors) {
          console.error("Error en la respuesta GraphQL:", data.errors);
          reject("Error en la respuesta GraphQL");
        } else {
          console.log("Asignatura eliminada");
          resolve(); // Resuelve la promesa si se elimina correctamente
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud GraphQL:", error);
        reject("Error en la solicitud GraphQL");
      });
  });
}

//Ini apalac
function uploadFile() {
  // Obtener el elemento de entrada de archivo
  const fileInput = document.getElementById('fileInput');

  // Verificar si se seleccionó un archivo
  if (fileInput.files.length > 0) {
      const file = fileInput.files[0];

     // Mostrar un mensaje de éxito
       showMessage('Archivo subido con éxito', 'success');

      // Crear un objeto FormData para enviar el archivo al servidor
      const formData = new FormData();
      formData.append('file', file);

      // Aquí puedes agregar lógica adicional según tus necesidades
      // Por ejemplo, podrías usar Fetch API para enviar el archivo al servidor
      // fetch('/ruta/del/servidor', {
      //     method: 'POST',
      //     body: formData
      // }).then(response => {
      //     // Manejar la respuesta del servidor
      //     console.log(response);
      // }).catch(error => {
      //     // Manejar errores
      //     console.error(error);
      // });

      // En este ejemplo, solo mostraremos información sobre el archivo seleccionado
      console.log('Nombre del archivo:', file.name);
      console.log('Tipo de archivo:', file.type);
      console.log('Tamaño del archivo:', file.size, 'bytes');
  } else {
      console.log('No se ha seleccionado ningún archivo.');
  }

  // Cerrar el modal después de realizar la acción
  const modal = new bootstrap.Modal(document.getElementById('AttachFileModal'));
  modal.hide();
}
function showMessage(message, messageType) {
  const messageContainer = document.getElementById('messageContainer');
  messageContainer.innerHTML = `<div class="alert alert-${messageType}" role="alert">${message}</div>`;
}

var socket = io.connect('https://tf7kj3-3000.csb.app/'); // Conectarse al servidor Socket.IO

socket.on('subjectCreada', function(data) {
  if (data.status === "ok") {
      // Configura el mensaje en el modal
      document.getElementById('customAlertMessage').textContent = data.message;

      // Muestra el modal
      var customAlertModal = new bootstrap.Modal(document.getElementById('customAlertModal'));
      customAlertModal.show();

      // Agrega un controlador de eventos al botón "OK"
      document.getElementById('customAlertOkButton').onclick = function() {
          customAlertModal.hide();
          window.location.reload();
      };
  } else {
      console.error("Error al crear el semestre:", data.message);
  }
});

socket.on('subjectEliminada', function(data) {
  if (data.status === "ok") {
      // Configura el mensaje en el modal
      document.getElementById('customAlertMessage').textContent = data.message;

      // Muestra el modal
      var customAlertModal = new bootstrap.Modal(document.getElementById('customAlertModal'));
      customAlertModal.show();

      // Agrega un controlador de eventos al botón "OK"
      document.getElementById('customAlertOkButton').onclick = function() {
          customAlertModal.hide();
          window.location.reload();
      };
  } else {
      console.error("Error al crear el semestre:", data.message);
  }
});
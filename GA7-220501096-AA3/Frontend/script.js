// script.js
const apiUrl = 'http://localhost:5000/api/tasks'

// insertar reloj y fecha
// Función para actualizar el reloj
function updateClock() {
    const now = new Date();
    
    // Formatear la fecha
    const date = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Formatear la hora
    const time = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Actualizar el elemento HTML
    const clockElement = document.getElementById('clock');
    clockElement.innerHTML = `${date}<br>${time}`;
}

// Actualizar el reloj cada segundo
updateClock();
setInterval(updateClock, 1000);
// Fin del reloj 

//Funcion para obtener Todas las Tareas
async function getTasks() {
    try {
        const response = await fetch(apiUrl);
        const tasks = await response.json();
        const tasksContainer = document.getElementById('tasks');
        tasksContainer.innerHTML = '';
        tasks.forEach(task => {
            console.log('ID de la tarea:', task._id);
            tasksContainer.innerHTML += `
                <div>
                    <h3>Usuario</h3>
                    <p>Cedula: ${task.cedula}</p>
                    <p>Nombre: ${task.nombre}</p>
                    <p>Teléfono: ${task.telefono}</p>
                    <p>Correo Electronico: ${task.correo}</p>
                    <p>Area de Trabajo: ${task.area}</p>
                    <p>${task.description}</p>
                    <button onclick="updateTask('${task._id}')">Editar</button>
                    <button onclick="deleteTask('${task._id}')">Borrar</button>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error:', error);
    }
} //Fin funcion obtener tareas

//Funcion para Agregar una Tarea
async function addTask() {
    const cedulaInput = document.getElementById('cedula');
    const nombreInput = document.getElementById('nombre');
    const telefonoInput = document.getElementById('telefono');
    const correoInput = document.getElementById('correo');
    const areaInput = document.getElementById('area');
    const descriptionInput = document.getElementById('description');
    
    // Validar solo los campos obligatorios
    if (!cedulaInput.value || !nombreInput.value || !telefonoInput.value || 
        !correoInput.value || !areaInput.value) {
        alert('Por favor, ingrese los campos obligatorios: Número de documento, Nombre de usuario, Teléfono, Correo Electrónico y Área de trabajo');
        return;
    }

    // Verificar si la cédula ya existe
    const existingTasks = await fetch(apiUrl);
    const tasks = await existingTasks.json();
    const cedulaExists = tasks.some(task => task.cedula === cedulaInput.value.trim());

    if (cedulaExists) {
        alert('La cédula ya está registrada.'); // Mensaje de alerta si la cédula ya existe
        return;
    }

    const datos = {
        title: nombreInput.value.trim(),
        cedula: cedulaInput.value.trim(),
        nombre: nombreInput.value.trim(),
        telefono: telefonoInput.value.trim(),
        correo: correoInput.value.trim(),
        area: areaInput.value.trim(),
        description: descriptionInput.value.trim() || ''
    };

    // Imprimir los datos que se están enviando para verificar errores
    console.log('Datos a enviar:', datos);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        // Obtener el texto de la respuesta
        const responseText = await response.text();
        console.log('Respuesta del servidor:', responseText);

        if (!response.ok) {
            let errorMessage;
            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.message || 'Error desconocido del servidor';
            } catch {
                errorMessage = responseText || 'Error desconocido del servidor';
            }
            throw new Error(errorMessage);
        }

        // Limpiar los campos solo si la operación fue exitosa
        cedulaInput.value = '';
        nombreInput.value = '';
        telefonoInput.value = '';
        correoInput.value = '';
        areaInput.value = '';
        descriptionInput.value = '';
        
        getTasks();
        alert('Tarea creada exitosamente');
    } catch (error) {
        console.error('Error completo:', error);
        alert(`Error al crear la tarea: ${error.message}`);
    }
} //Fin Funcion para Agregar una Tarea

//Funcion para Actualizar una tarea
async function updateTask(id) {
    const cedula = prompt('Ingresa el Número de cedula a Actualizar')
    const nombre = prompt('ingresa el nombre de Usuario a corregir')
    const telefono = prompt('ingresa el teléfono a Actualizar')
    const correo = prompt('ingresa el correo a Actualizar')
    const area = prompt('ingresa el área de trabajo')
    const description = prompt('ingresa una obsevacion')
    await fetch(`${apiUrl}/${id}`, {  
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},  
        body: JSON.stringify({cedula, nombre, telefono, correo, area, description})
    })
    getTasks()
} //Fin Funcion para Actualizar una tarea

//funcion para Eliminar una Tarea
async function deleteTask(id) {
    await fetch(`${apiUrl}/${id}`, {method: 'DELETE'})
    getTasks()
}// Fin funcion para Eliminar una Tarea

// Función para buscar una tarea por cédula
async function searchTask() {
    const cedulaInput = document.getElementById('searchCedula');
    const cedulaValue = cedulaInput.value.trim();
    
    if (!cedulaValue) {
        alert('Por favor, ingrese una cédula para buscar.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}?cedula=${cedulaValue}`);
        const tasks = await response.json();
        const tasksContainer = document.getElementById('tasks');
        tasksContainer.innerHTML = '';

        // Verificar si la cédula ingresada coincide exactamente con alguna tarea
        const foundTask = tasks.find(task => task.cedula === cedulaValue);

        if (!foundTask) {
            alert('Cédula no existe en la base de datos.'); // Mensaje de alerta si no se encuentra la tarea
            cedulaInput.value = ''; // Limpiar el campo de búsqueda
            return;
        }

        // Llenar los campos de gestión con los datos de la tarea encontrada
        document.getElementById('cedula').value = foundTask.cedula;
        document.getElementById('nombre').value = foundTask.nombre;
        document.getElementById('telefono').value = foundTask.telefono;
        document.getElementById('correo').value = foundTask.correo;
        document.getElementById('area').value = foundTask.area;
        document.getElementById('description').value = foundTask.description;

        // Mostrar la tarea en la lista 
        tasksContainer.innerHTML += `
            <div>
                <h3>Usuario</h3>
                <p>Cedula: ${foundTask.cedula}</p>
                <p>Nombre: ${foundTask.nombre}</p>
                <p>Teléfono: ${foundTask.telefono}</p>
                <p>Correo Electrónico: ${foundTask.correo}</p>
                <p>Área de Trabajo: ${foundTask.area}</p>
                <p>${foundTask.description}</p>
                <button onclick="updateTask('${foundTask._id}')">Editar</button>
                <button onclick="deleteTask('${foundTask._id}')">Eliminar</button>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
    }

    // Limpiar el campo de búsqueda al final
    cedulaInput.value = '';
} // Fin Función para buscar una tarea por cédula

// Funcion Limpiar
function clearFields() {
    document.getElementById('cedula').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('area').value = '';
    document.getElementById('description').value = '';
    
    // Actualizar la lista de tareas
    getTasks();
} // Fin Funcion Limpiar

//Inicializamos la funcion de getTasks
getTasks()

// Agregar un evento de entrada para validar el campo de cédula
const cedulaInput = document.getElementById('cedula');
cedulaInput.addEventListener('input', function() {
    const originalValue = this.value; // Guardar el valor original
    this.value = this.value.replace(/[^0-9]/g, ''); // Reemplaza cualquier carácter que no sea un número

    // Verificar si el valor ha cambiado
    if (this.value !== originalValue) {
        alert('El campo cédula solo acepta números.'); // Mensaje de alerta
    }
});

// Agregar un evento de entrada para validar el campo de telefono
const telefonoInput = document.getElementById('telefono');
telefonoInput.addEventListener('input', function() {
    const originalValue = this.value; // Guardar el valor original
    this.value = this.value.replace(/[^0-9-.]/g, ''); // Reemplaza cualquier carácter que no sea un número

    // Verificar si el valor ha cambiado
    if (this.value !== originalValue) {
        alert('El campo teléfono solo acepta números.'); // Mensaje de alerta
    }
});

// constantes necesarias para funcion validar
const formulario = document.getElementById('formulario');
const correoInput = document.querySelector('#formulario #correo');

const expresion = { 
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/ 
};

const validarCorreo = () => { 
    const correoValor = correoInput.value.trim(); // Obtener el valor del campo y eliminar espacios
    if (!expresion.correo.test(correoValor)) {
        alert('El campo correo no es un correo válido.'); // Mensaje de alerta
        correoInput.value = ''; // Limpiar el campo de correo
    }
};

// Agregar el evento blur para validar el campo de correo al hacer clic en otro campo
correoInput.addEventListener('blur', validarCorreo);
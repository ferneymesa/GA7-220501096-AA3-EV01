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
        !correoInput.value || !areaInput.value) // Esto evalúa si alguno de los campos de entrada está vacío o no tiene un valor válido. 
        {
        alert('Por favor, ingrese los campos obligatorios: Número de documento, Nombre de usuario, Teléfono, Correo Electrónico y Área de trabajo');
        return;
    }

    const datos = {
        title: nombreInput.value.trim(), //La función trim() se utiliza para asegurarse de que no haya espacios
        cedula: cedulaInput.value.trim(),
        nombre: nombreInput.value.trim(),
        telefono: telefonoInput.value.trim(),
        correo: correoInput.value.trim(),
        area: areaInput.value.trim(),
        description: descriptionInput.value.trim() || '' // Asignar string vacío si no hay valor
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
    const cedulaInput = document.getElementById('searchCedula').value.trim();
    if (!cedulaInput) {
        alert('Por favor, ingrese una cédula para buscar.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}?cedula=${cedulaInput}`);
        const tasks = await response.json();
        const tasksContainer = document.getElementById('tasks');
        tasksContainer.innerHTML = '';

        if (tasks.length === 0) {
            alert('No se encontraron tareas con esa cédula.');
            return;
        }

        // Asumiendo que solo se busca una tarea por cédula, tomamos la primera
        const task = tasks[0];

        // Llenar los campos de gestión con los datos de la tarea
        document.getElementById('cedula').value = task.cedula;
        document.getElementById('nombre').value = task.nombre;
        document.getElementById('telefono').value = task.telefono;
        document.getElementById('correo').value = task.correo;
        document.getElementById('area').value = task.area;
        document.getElementById('description').value = task.description;

        // Mostrar la tarea en la lista 
        tasksContainer.innerHTML += `
            <div>
                <h3>Usuario</h3>
                <p>Cedula: ${task.cedula}</p>
                <p>Nombre: ${task.nombre}</p>
                <p>Teléfono: ${task.telefono}</p>
                <p>Correo Electrónico: ${task.correo}</p>
                <p>Área de Trabajo: ${task.area}</p>
                <p>${task.description}</p>
                <button onclick="updateTask('${task._id}')">Editar</button>
                <button onclick="deleteTask('${task._id}')">Eliminar</button>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
    }
}// Fin Función para buscar una tarea por cédula

// Funcion Limpiar
function clearFields() {
    document.getElementById('cedula').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('area').value = '';
    document.getElementById('description').value = '';
} // Fin Funcion Limpiar

//Inicializamos la funcion de getTasks
getTasks()
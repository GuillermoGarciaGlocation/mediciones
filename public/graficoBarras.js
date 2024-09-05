document.addEventListener('DOMContentLoaded', () => {
    // Obtener el contexto del canvas
const ctx = document.getElementById('myChart').getContext('2d');

// Crear el gráfico inicialmente con datos vacíos
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Grafica de linea',
            data: [],
            fill: false,
            borderColor: 'green',
            tension: 0.1
        }],
    },
    options: {
        plugins:{
            annotation: {
                annotations: {
                    box1: {
                        type: 'box',
                        xMin: 7,
                        xMax: 10,
                        yMin: '7:00',
                        yMax: '10:00',
                        borderColor: 'rgba(0,0,0,0)', 
                        borderWidth: 0,
                        backgroundColor: 'rgb(187, 241, 183)',
                        drawTime: 'beforeDatasetsDraw'
                    },
                    box2: {
                        type: 'box',
                        xMin: 17,
                        xMax: 20,
                        yMin: '17:00',
                        yMax: '20:00',
                        borderColor: 'rgba(0,0,0,0)', 
                        borderWidth: 0,
                        backgroundColor: 'rgb(242, 182, 182)',
                        drawTime: 'beforeDatasetsDraw'
                    }
                }
              }
        }
    }
});

// Función para actualizar el gráfico con los datos obtenidos
function updateChart(data) {
    if (data.length > 0) {
        myChart.data.labels = data.map(d => d.hour); 
        myChart.data.datasets[0].data = data.map(d => d.TOTAL);
    } else {
        myChart.data.labels = [];
        myChart.data.datasets[0].data = [];
    }
    myChart.update();
}

// Función para llenar el menú de departamentos
async function loadDepartments() {
    try {
        const response = await fetch('https://us-central1-mintic-indicadores-calidad-dev.cloudfunctions.net/getDepartments');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const departments = await response.json();
        
        const departmentSelect = document.getElementById('txtDepartment');
        departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.codigo;
            option.textContent = department.departamento; 
            departmentSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching departments:', error);
    }
}

// Función para llenar el menú de municipios basados en el departamento seleccionado
async function loadMunicipalities(departmentCode) {
    try {
        const response = await fetch(`https://us-central1-mintic-indicadores-calidad-dev.cloudfunctions.net/getMunicipalities?codeDepartment=${departmentCode}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const municipalities = await response.json();
        
        const municipalitySelect = document.getElementById('txtMunicipality');
        municipalitySelect.innerHTML = '<option value="">Seleccione un municipio</option>'; // Limpiar las opciones anteriores
        municipalities.forEach(municipality => {
            const option = document.createElement('option');
            option.value = municipality.codigo;
            option.textContent = municipality.municipio; 
            municipalitySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching municipalities:', error);
    }
}


async function loadDepartments() {
    try {
        const response = await fetch('https://us-central1-mintic-indicadores-calidad-dev.cloudfunctions.net/getDepartments');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const departments = await response.json();
        
        const departmentSelect = document.getElementById('txtDepartment');
        departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.codigo;
            option.textContent = department.departamento; 
            departmentSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching departments:', error);
    }
}

loadDepartments();

async function loadISP() {
    try {
        const response = await fetch('https://us-central1-mintic-indicadores-calidad-dev.cloudfunctions.net/getISP');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const ispData = await response.json();
        
        const ispSelect = document.getElementById('txtIsp');
        ispData.forEach(data => {
            const option = document.createElement('option');
            option.value = data.ISP;
            option.textContent = data.ISP; 
            ispSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching ISP:', error);
    }
}

loadISP();

// Evento para actualizar el menú de municipios cuando se selecciona un departamento
document.getElementById('txtDepartment').addEventListener('change', (event) => {
    const selectedDepartment = event.target.value;
    if (selectedDepartment) {
        loadMunicipalities(selectedDepartment);
    } else {
        // Limpiar el menú de municipios si no se selecciona ningún departamento
        const municipalitySelect = document.getElementById('txtMunicipality');
        municipalitySelect.innerHTML = '<option value="">Seleccione un municipio</option>';
    }
});

// Evento click en el botón de buscar
document.getElementById('btnBuscar').addEventListener('click', async () => {
    const date = document.getElementById('txtDate').value; // Obtener fecha en formato YYYY-MM-DD
    const department = document.getElementById('txtDepartment').value;
    const municipality = document.getElementById('txtMunicipality').value;
    const isp = document.getElementById('txtIsp').value;

    if (!date) {
        alert('Por favor, ingrese una fecha en el formato YYYY-MM-DD.');
        return;
    }

    try {
        // Construir la URL con los parámetros
        const url = new URL('https://us-central1-mintic-indicadores-calidad-dev.cloudfunctions.net/getMeasurements');
        url.searchParams.append('date', date);
        if (department != 'Seleccione un departamento') url.searchParams.append('codeDepartment', department);
        if (municipality != 'Seleccione un municipio') url.searchParams.append('codeMunicipality', municipality);
        if (isp != 'Seleccione un ISP') url.searchParams.append('isp', isp);

        // Realizar la solicitud a la API
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();

        // Procesar los datos de la respuesta (asume que `result` es un array de objetos con 'hour' y 'TOTAL')
        updateChart(result);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('No se encontraron datos');
    }
});
});
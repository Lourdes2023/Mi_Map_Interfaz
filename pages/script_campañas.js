document.addEventListener('DOMContentLoaded', function() {
    const initialData = [
        { name: "Campaña 1", description: "Descripción 1", commerce: "Comercio 1", activity: "Carnicerías y granjas", startdate: "2023-01-01", enddate: "2023-06-01", type: "C1MB", status: "Activo" },
        { name: "Campaña 2", description: "Descripción 2", commerce: "Comercio 2", activity: "Almacenes y Autoservicios", startdate: "2023-03-01", enddate: "2023-08-01", type: "AC", status: "Inactivo" },
        { name: "Campaña 3", description: "Descripción 3", commerce: "Comercio 3", activity: "Ferreterias", startdate: "2023-05-01", enddate: "2023-10-01", type: "C1", status: "Activo" }
    ];

    let data = JSON.parse(localStorage.getItem('data')) || initialData;

    const searchInput = document.getElementById('search');
    const  statusFilter = document.getElementById('filter');
    const typeFilter = document.getElementById('filter-type');
    const rubroFilter = document.getElementById('filter-rubro');
    const buttonAlta = document.getElementById('button-alta');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');
    const dataForm = document.getElementById('data-form');
    const modalTitle = document.getElementById('modal-title');
    let editIndex = null;


    // Paso 2: Crear la función filterData
    function filterData() {
        const statusValue = statusFilter.value;
        const typeValue = typeFilter.value;
        const rubroValue = rubroFilter.value;

        const filteredData = data.filter(item => {
            const statusMatch = statusValue === 'todos' || item.status === statusValue;
            const typeMatch = typeValue === 'todos' || item.type === typeValue;
            const rubroMatch = rubroValue === 'todos' || item.activity === rubroValue; // Asumiendo que 'rubro' es una propiedad de los objetos en `data`
            return statusMatch && typeMatch && rubroMatch;
        });

        renderTable(filteredData);
    }

    // Paso 3: Llamar a filterData cuando cambie el valor de los filtros
    statusFilter.addEventListener('change', filterData);
    typeFilter.addEventListener('change', filterData);
    rubroFilter.addEventListener('change', filterData);

    // Asegúrate de llamar a filterData también después de la inicialización para aplicar cualquier filtro por defecto
    filterData();

    function renderTable(dataToRender = data) {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        dataToRender.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.commerce}</td>
                <td>${item.activity}</td>
                <td>${item.startdate}</td>
                <td>${item.enddate}</td>
                <td>${item.type}</td>
                <td>${item.status}</td>
                <td class="actions">
                 <i class="fas fa-edit" onclick="editItem(${index})"></i>
                 <i class="fas fa-trash-alt" onclick="deleteItem(${index})"></i>   
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function saveData() {
        localStorage.setItem('data', JSON.stringify(data));
        renderTable();
    }

    function addItem( name, commerce, description, activity,startdate, enddate,type, status) {
        data.push({  name, commerce, description, activity, startdate, enddate,type, status });
        saveData();
    }

    function editItem(index) {
        const item = data[index];
        document.getElementById('name').value = item.name;
        document.getElementById('type').value = item.type; 
        document.getElementById('commerce').value = item.commerce;
        document.getElementById('description').value = item.description;
        document.getElementById('campaign-end-date').value = item.enddate;
        document.getElementById('campaign-start-date').value  = item.startdate;
        document.getElementById('activity').value = item.activity;
        document.getElementById('location').value = item.location;
        document.getElementById('status').value = item.status;
        editIndex = index;
        modalTitle.textContent = 'Editar Campaña';
        modal.style.display = 'flex';
    }

    function updateItem(index,name, commerce, description, activity, startdate, enddate,type, status) {
        data[index] = { name, commerce, description, activity, startdate, enddate,type, status};
        saveData();
    }

    function deleteItem(index) {
        data.splice(index, 1);
        saveData();
    }

    buttonAlta.addEventListener('click', function() {
        dataForm.reset();
        modalTitle.textContent = 'Agregar Comercio/Industria';
        editIndex = null;
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    dataForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const type = document.getElementById('type').value;
        const commerce = document.getElementById('commerce').value;
        const description = document.getElementById('description').value;
        const enddate = document.getElementById('campaign-end-date').value;
        const startdate = document.getElementById('campaign-start-date').value;
        const location = document.getElementById('location').value;
        const activity = document.getElementById('activity').value;
        const status = document.getElementById('status').value;

        if (editIndex === null) {
            addItem(name, commerce, description, activity, startdate, enddate,type, status);
        } else {
            updateItem(editIndex,name, commerce, description, activity, startdate, enddate,type, status);
        }

        modal.style.display = 'none';
    });

    renderTable();

    window.editItem = editItem;
    window.deleteItem = deleteItem;
});
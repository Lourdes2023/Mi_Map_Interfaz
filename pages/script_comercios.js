document.addEventListener('DOMContentLoaded', function() {
    const initialData = [
        { name: "Autoservicio El Ciclón", type: "C1", location: "Martín Rodríguez 1573 ", activity: "Almacenes y Autoservicios", contact: "4458-5535/15-5591-4117", status: "Activo" },
        { name: "Granja Dos Cuñados", type: "C1MB", location: "Pte. Perón 6871", activity: "Carnicerías y granjas", contact: "4481-0992", status: "Activo" },
        { name: "Ferremanía", type: "C1", location: "Martín Fierro 4933", activity: "Ferreterias", contact: "4481-6120//4458-5316", status: "Inactivo" }
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
                <td>${item.type}</td>
                <td>${item.location}</td>
                <td>${item.activity}</td>
                <td>${item.contact}</td>
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

    function addItem(name, type, location, activity, contact, status) {
        data.push({ name, type, location, activity, contact, status });
        saveData();
    }

    function editItem(index) {
        const item = data[index];
        document.getElementById('name').value = item.name;
        document.getElementById('type').value = item.type;
        document.getElementById('location').value = item.location;
        document.getElementById('activity').value = item.activity;
        document.getElementById('contact').value = item.contact;
        document.getElementById('status').value = item.status;
        editIndex = index;
        modalTitle.textContent = 'Editar Comercio/Industria';
        modal.style.display = 'flex';
    }

    function updateItem(index, name, type, location, activity, contact, status) {
        data[index] = { name, type, location, activity, contact, status };
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
        const location = document.getElementById('location').value;
        const activity = document.getElementById('activity').value;
        const contact = document.getElementById('contact').value;
        const status = document.getElementById('status').value;

        if (editIndex === null) {
            addItem(name, type, location, activity, contact, status);
        } else {
            updateItem(editIndex, name, type, location, activity, contact, status);
        }

        modal.style.display = 'none';
    });

    renderTable();

    window.editItem = editItem;
    window.deleteItem = deleteItem;
});
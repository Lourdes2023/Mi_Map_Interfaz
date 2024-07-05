document.addEventListener('DOMContentLoaded', function() {
    const initialData = [
        { name: "Industria 1", type: "Alimentos y bebidas", location: "Dirección 1", activity: "Actividad 1", contact: "1111-1111", mail: "email1@industria.com" },
        { name: "Industria 2", type: "Metalúrgica", location: "Dirección 2", activity: "Actividad 2", contact: "2222-2222", mail: "email2@industria.com" },
        { name: "Industria 3", type: "Farmaceutica", location: "Dirección 3", activity: "Actividad 3", contact: "3333-3333", mail: "email3@industria.com" }
    ];

    let data = JSON.parse(localStorage.getItem('industriaData')) || initialData;

    const searchInput = document.getElementById('search');
    const filter = document.getElementById('filter');
    const buttonAlta = document.getElementById('button-alta');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');
    const dataForm = document.getElementById('data-form');
    const modalTitle = document.getElementById('modal-title');
    let editIndex = null;

    function renderTable() {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        const filteredData = data.filter(item => {
            const filterValue = filter.value === 'todos' || item.type === filter.value;
            const searchValue = searchInput.value.toLowerCase();
            const nameMatches = item.name.toLowerCase().includes(searchValue);
            const locationMatches = item.location.toLowerCase().includes(searchValue);
            const activityMatches = item.activity.toLowerCase().includes(searchValue);
            const contactMatches = item.contact.includes(searchValue);
            const mailMatches = item.mail.toLowerCase().includes(searchValue);
            return filterValue && (nameMatches || locationMatches || activityMatches || contactMatches || mailMatches);
        });
        filteredData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td>${item.location}</td>
                <td>${item.activity}</td>
                <td>${item.contact}</td>
                <td>${item.mail}</td>
                <td class="actions">
                     <i class="fas fa-edit" onclick="editItem(${index})"></i>
                     <i class="fas fa-trash-alt" onclick="deleteItem(${index})"></i>  
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function saveData() {
        localStorage.setItem('industriaData', JSON.stringify(data));
        renderTable();
    }

    function addItem(name, type, location, activity, contact, mail) {
        data.push({ name, type, location, activity, contact, mail });
        saveData();
    }

    function editItem(index) {
        const item = data[index];
        document.getElementById('industry-name').value = item.name;
        document.getElementById('industry-type').value = item.type;
        document.getElementById('industry-location').value = item.location;
        document.getElementById('industry-activity').value = item.activity;
        document.getElementById('industry-contact').value = item.contact;
        document.getElementById('industry-mail').value = item.mail;
        editIndex = index;
        modalTitle.textContent = 'Editar Industria';
        modal.style.display = 'flex';
    }

    function updateItem(index, name, type, location, activity, contact, mail) {
        data[index] = { name, type, location, activity, contact, mail };
        saveData();
    }

    function deleteItem(index) {
        data.splice(index, 1);
        saveData();
    }

    buttonAlta.addEventListener('click', function() {
        dataForm.reset();
        modalTitle.textContent = 'Agregar Industria';
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    dataForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('industry-name').value;
        const type = document.getElementById('industry-type').value;
        const location = document.getElementById('industry-location').value;
        const activity = document.getElementById('industry-activity').value;
        const contact = document.getElementById('industry-contact').value;
        const mail = document.getElementById('industry-mail').value;
        if (editIndex !== null) {
            updateItem(editIndex, name, type, location, activity, contact, mail);
            editIndex = null;
        } else {
            addItem(name, type, location, activity, contact, mail);
        }
        modal.style.display = 'none';
    });

    searchInput.addEventListener('input', renderTable);
    filter.addEventListener('change', renderTable);

    renderTable();

    window.editItem = editItem;

   
    window.deleteItem = deleteItem;

});

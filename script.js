// Sidebar Toggle
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");

const menuOverlay = document.querySelector(".menu-overlay");

sidebarBtn.addEventListener("click", ()=>{
  sidebar.classList.toggle("active");
  if(menuOverlay) menuOverlay.classList.toggle("active");
});

// Mobile Close Button Logic
const mobileCloseBtn = document.getElementById('mobileCloseBtn');
if(mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
        if(menuOverlay) menuOverlay.classList.remove("active");
    });
}

// Close when clicking overlay
if(menuOverlay) {
    menuOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        menuOverlay.classList.remove("active");
    });
}

// No need to change icon if it's just opening/closing drawer style
// function menuBtnChange() {
//  if(sidebar.classList.contains("active")){
//    sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right");
//  }else {
//    sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
//  }
// }

// FORMAT CURRENCY HELPER
function formatCurrency(value) {
    if (!value) return '';
    let numberVal = parseFloat(value.replace(/[^0-9.-]+/g,""));
    if (isNaN(numberVal)) return value;
    return "S/. " + numberVal.toFixed(2);
}

// SPA Navigation
const navLinks = document.querySelectorAll('.nav-link'); // Select all nav-links (including nested ones)
const sections = document.querySelectorAll('.content-section');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Only prevent default if it's a link meant for navigation within the page
        if(this.getAttribute('data-target')) {
            e.preventDefault();
            
            // Remove active from all
            navLinks.forEach(nav => nav.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            // If it's a sub-link, maybe ensure parent is active?
            // For now, simple behavior:
            
            const targetId = this.getAttribute('data-target');
            
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(targetId);
            if(targetSection) {
                targetSection.classList.add('active');
            }
        }
    });
});

// Modal & Product Logic
const modal = document.getElementById('addModal');
const btnAdd = document.getElementById('btnAddLunal');
const closeBtn = document.querySelector('.close-btn');
const addForm = document.getElementById('addForm');
const tableBody = document.querySelector('#lunasTable tbody');
let isEditing = false;
let currentEditRow = null;



// Open Modal (Lunas) - Updated to populate dropdown
if(btnAdd) {
    btnAdd.addEventListener('click', () => {
        isEditing = false;
        currentEditRow = null;
        addForm.reset();
        document.querySelector('#addModal h2').innerText = 'Agregar Nueva Luna';
        updateProviderDropdown();
        modal.style.display = 'block';
    });

}

// Function to populate Laboratory Dropdown
function updateProviderDropdown() {
    const select = document.getElementById('laboratorySelect');
    if(!select) return;
    
    // Clear existing options
    select.innerHTML = '';
    
    // Get Providers from Table
    const providerRows = document.querySelectorAll('#providersTable tbody tr');
    providerRows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        if(cells.length > 1) {
            const providerName = cells[1].innerText; // 2nd column is Name
            const option = document.createElement('option');
            option.value = providerName;
            option.text = providerName;
            select.appendChild(option);
        }
    });
}

// Close Modal
if(closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Close outside click
window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});

// Add New Product (Luna)
if(addForm) {
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get values
        const code = document.getElementById('code').value;
        const name = document.getElementById('name').value;
        const laboratory = document.getElementById('laboratorySelect').value;
        const measure = document.getElementById('measure').value;
        const buyPrice = document.getElementById('buyPrice').value;
        const sellPrice = document.getElementById('sellPrice').value;

        
        if (isEditing && currentEditRow) {
            // Update existing row
            currentEditRow.innerHTML = `
                <td>${code}</td>
                <td>${name}</td>
                <td>${laboratory}</td>
                <td>${measure}</td>
                <td>${formatCurrency(buyPrice)}</td>
                <td>${formatCurrency(sellPrice)}</td>
                <td class="actions-cell">
                    <button class="icon-btn edit-btn"><i class='bx bxs-edit-alt'></i></button>
                    <button class="icon-btn delete-btn"><i class='bx bxs-trash'></i></button>
                </td>
            `;
            isEditing = false;
            currentEditRow = null;
        } else {
            // Create Row
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${code}</td>
                <td>${name}</td>
                <td>${laboratory}</td>
                <td>${measure}</td>
                <td>${formatCurrency(buyPrice)}</td>
                <td>${formatCurrency(sellPrice)}</td>
                <td class="actions-cell">
                    <button class="icon-btn edit-btn"><i class='bx bxs-edit-alt'></i></button>
                    <button class="icon-btn delete-btn"><i class='bx bxs-trash'></i></button>
                </td>
            `;
            tableBody.appendChild(newRow);
        }
        
        // Clear & Close
        addForm.reset();
        modal.style.display = 'none';

    });
}

// Delete & Edit Logic (Event Delegation)
if(tableBody) {
    tableBody.addEventListener('click', (e) => {
        // Delete
        if(e.target.closest('.delete-btn')) {
            if(confirm('¿Estás seguro de eliminar este producto?')) {
                const row = e.target.closest('tr');
                row.remove();
            }
        }
        
        // Edit
        if(e.target.closest('.edit-btn')) {
            const row = e.target.closest('tr');
            const cells = row.getElementsByTagName('td');
            
            // Populate Form
            document.getElementById('code').value = cells[0].innerText;
            document.getElementById('name').value = cells[1].innerText;
            
            updateProviderDropdown(); // Ensure options are there before setting value
            document.getElementById('laboratorySelect').value = cells[2].innerText;
            
            document.getElementById('measure').value = cells[3].innerText;
            
            // Strip currency symbol for input
            document.getElementById('buyPrice').value = cells[4].innerText.replace('S/. ', '');
            document.getElementById('sellPrice').value = cells[5].innerText.replace('S/. ', '');

            
            // Set Edit Mode
            isEditing = true;
            currentEditRow = row;
            document.querySelector('#addModal h2').innerText = 'Editar Luna';
            modal.style.display = 'block';
        }

    });
}

// Search Logic
const searchInput = document.getElementById('searchInput');
if(searchInput) {
    searchInput.addEventListener('keyup', function() {
        const filter = this.value.toLowerCase();
        const rows = tableBody.getElementsByTagName('tr');
        
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            let match = false;
            // Check all cells
            for (let j = 0; j < cells.length - 1; j++) { // Exclude actions cell
                if (cells[j]) {
                    if (cells[j].innerText.toLowerCase().indexOf(filter) > -1) {
                        match = true;
                        break;
                    }
                }
            }
            if (match) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    });
}

// Dropdown Menu Link Logic
const iocnLinks = document.querySelectorAll(".iocn-link");
iocnLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        let arrowParent = link.parentElement; 
        arrowParent.classList.toggle("showMenu");
    });
});

// Logic for Monturas Section

const modalMontura = document.getElementById('addMonturaModal');
const btnAddMontura = document.getElementById('btnAddMontura');
const closeBtnMontura = document.querySelector('.montura-close');
const addFormMontura = document.getElementById('addMonturaForm');
const tableBodyMonturas = document.querySelector('#monturasTable tbody');
let isEditingMontura = false;
let currentEditRowMontura = null;


// Open Modal Montura
if(btnAddMontura) {
    btnAddMontura.addEventListener('click', () => {
        isEditingMontura = false;
        currentEditRowMontura = null;
        addFormMontura.reset();
        document.querySelector('#addMonturaModal h2').innerText = 'Agregar Nueva Montura';
        modalMontura.style.display = 'block';
    });

}

// Close Modal Montura
if(closeBtnMontura) {
    closeBtnMontura.addEventListener('click', () => {
        modalMontura.style.display = 'none';
    });
}

// Close outside click (Already covered by global listener, but specific check)
window.addEventListener('click', (e) => {
    if (e.target == modalMontura) {
        modalMontura.style.display = 'none';
    }
});

// Add New Montura
if(addFormMontura) {
    addFormMontura.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get values
        const code = document.getElementById('m_code').value;
        const name = document.getElementById('m_name').value;
        const stock = document.getElementById('m_stock').value;
        const buyPrice = document.getElementById('m_buyPrice').value;
        const sellPrice = document.getElementById('m_sellPrice').value;
        
        if (isEditingMontura && currentEditRowMontura) {
            // Update existing row
            currentEditRowMontura.innerHTML = `
                <td>${code}</td>
                <td>${name}</td>
                <td>${stock}</td>
                <td>${formatCurrency(buyPrice)}</td>
                <td>${formatCurrency(sellPrice)}</td>
                <td class="actions-cell">
                    <button class="icon-btn edit-btn"><i class='bx bxs-edit-alt'></i></button>
                    <button class="icon-btn delete-btn"><i class='bx bxs-trash'></i></button>
                </td>
            `;
            isEditingMontura = false;
            currentEditRowMontura = null;
        } else {
            // Create Row
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${code}</td>
                <td>${name}</td>
                <td>${stock}</td>
                <td>${formatCurrency(buyPrice)}</td>
                <td>${formatCurrency(sellPrice)}</td>
                <td class="actions-cell">
                    <button class="icon-btn edit-btn"><i class='bx bxs-edit-alt'></i></button>
                    <button class="icon-btn delete-btn"><i class='bx bxs-trash'></i></button>
                </td>
            `;
            if(tableBodyMonturas) tableBodyMonturas.appendChild(newRow);
        }
        
        // Clear & Close
        addFormMontura.reset();
        modalMontura.style.display = 'none';

    });
}

// Delete Logic for Monturas
if(tableBodyMonturas) {
    tableBodyMonturas.addEventListener('click', (e) => {
        if(e.target.closest('.delete-btn')) {
            if(confirm('¿Estás seguro de eliminar esta montura?')) {
                const row = e.target.closest('tr');
                row.remove();
            }
        }
        if(e.target.closest('.edit-btn')) {
            const row = e.target.closest('tr');
            const cells = row.getElementsByTagName('td');
            
            // Populate Form
            document.getElementById('m_code').value = cells[0].innerText;
            document.getElementById('m_name').value = cells[1].innerText;
            document.getElementById('m_stock').value = cells[2].innerText;
             
            // Strip currency symbol
            document.getElementById('m_buyPrice').value = cells[3].innerText.replace('S/. ', '');
            document.getElementById('m_sellPrice').value = cells[4].innerText.replace('S/. ', '');
            
            // Set Edit Mode
            isEditingMontura = true;
            currentEditRowMontura = row;
            document.querySelector('#addMonturaModal h2').innerText = 'Editar Montura';
            modalMontura.style.display = 'block';
        }

    });
}

// Search Logic for Monturas
const searchMonturasInput = document.getElementById('searchMonturasInput');
if(searchMonturasInput && tableBodyMonturas) {
    searchMonturasInput.addEventListener('keyup', function() {
        const filter = this.value.toLowerCase();
        const rows = tableBodyMonturas.getElementsByTagName('tr');
        
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            let match = false;
            for (let j = 0; j < cells.length - 1; j++) {
                if (cells[j]) {
                    if (cells[j].innerText.toLowerCase().indexOf(filter) > -1) {
                        match = true;
                        break;
                    }
                }
            }
            if (match) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    });
}

// Logic for PROVEEDOR (Laboratorios) Section

const modalProvider = document.getElementById('addProviderModal');
const btnAddProvider = document.getElementById('btnAddProvider');
const closeBtnProvider = document.querySelector('.provider-close');
const addFormProvider = document.getElementById('addProviderForm');
const tableBodyProviders = document.querySelector('#providersTable tbody');
let isEditingProvider = false;
let currentEditRowProvider = null;


// Open Modal Provider
if(btnAddProvider) {
    btnAddProvider.addEventListener('click', () => {
        isEditingProvider = false;
        currentEditRowProvider = null;
        addFormProvider.reset();
        document.querySelector('#addProviderModal h2').innerText = 'Agregar Nuevo Laboratorio';
        modalProvider.style.display = 'block';
    });

}

// Close Modal Provider
if(closeBtnProvider) {
    closeBtnProvider.addEventListener('click', () => {
        modalProvider.style.display = 'none';
    });
}

// Close outside click (Specific check)
window.addEventListener('click', (e) => {
    if (e.target == modalProvider) {
        modalProvider.style.display = 'none';
    }
});

// Add New Provider
if(addFormProvider) {
    addFormProvider.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get values
        const id = document.getElementById('p_id').value;
        const name = document.getElementById('p_name').value;
        const manager = document.getElementById('p_manager').value;
        const address = document.getElementById('p_address').value;
        const phone = document.getElementById('p_phone').value;
        
        if (isEditingProvider && currentEditRowProvider) {
            // Update existing row
            currentEditRowProvider.innerHTML = `
                <td>${id}</td>
                <td>${name}</td>
                <td>${manager}</td>
                <td>${address}</td>
                <td>${phone}</td>
                <td class="actions-cell">
                    <button class="icon-btn edit-btn"><i class='bx bxs-edit-alt'></i></button>
                    <button class="icon-btn delete-btn"><i class='bx bxs-trash'></i></button>
                </td>
            `;
            isEditingProvider = false;
            currentEditRowProvider = null;
        } else {
            // Create Row
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${id}</td>
                <td>${name}</td>
                <td>${manager}</td>
                <td>${address}</td>
                <td>${phone}</td>
                <td class="actions-cell">
                    <button class="icon-btn edit-btn"><i class='bx bxs-edit-alt'></i></button>
                    <button class="icon-btn delete-btn"><i class='bx bxs-trash'></i></button>
                </td>
            `;
            if(tableBodyProviders) tableBodyProviders.appendChild(newRow);
        }
        
        // Clear & Close
        addFormProvider.reset();
        modalProvider.style.display = 'none';
        
        // Update helper dropdown if needed
        updateProviderDropdown();

    });
}

// Delete Logic for Providers
if(tableBodyProviders) {
    tableBodyProviders.addEventListener('click', (e) => {
        if(e.target.closest('.delete-btn')) {
            if(confirm('¿Estás seguro de eliminar este laboratorio?')) {
                const row = e.target.closest('tr');
                row.remove();
            }
        }
        if(e.target.closest('.edit-btn')) {
            const row = e.target.closest('tr');
            const cells = row.getElementsByTagName('td');
            
            // Populate Form
            document.getElementById('p_id').value = cells[0].innerText;
            document.getElementById('p_name').value = cells[1].innerText;
            document.getElementById('p_manager').value = cells[2].innerText;
            document.getElementById('p_address').value = cells[3].innerText;
            document.getElementById('p_phone').value = cells[4].innerText;
            
            // Set Edit Mode
            isEditingProvider = true;
            currentEditRowProvider = row;
            document.querySelector('#addProviderModal h2').innerText = 'Editar Laboratorio';
            modalProvider.style.display = 'block';
        }

    });
}

// Search Logic for Providers
const searchProviderInput = document.getElementById('searchProviderInput');
if(searchProviderInput && tableBodyProviders) {
    searchProviderInput.addEventListener('keyup', function() {
        const filter = this.value.toLowerCase();
        const rows = tableBodyProviders.getElementsByTagName('tr');
        
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            let match = false;
            for (let j = 0; j < cells.length - 1; j++) {
                if (cells[j]) {
                    if (cells[j].innerText.toLowerCase().indexOf(filter) > -1) {
                        match = true;
                        break;
                    }
                }
            }
            if (match) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    });
}

// Logic for Dashboard (Home)
function updateDashboard() {
    // 1. Update KPI Cards
    const lunasTableBody = document.querySelector('#lunasTable tbody');
    const monturasTableBody = document.querySelector('#monturasTable tbody');
    const providersTableBody = document.querySelector('#providersTable tbody');

    // Helper to sum stock column (Index 5)
    function calculateTotalStock(tbody) {
        if (!tbody) return 0;
        let total = 0;
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.getElementsByTagName('td');
            
            // Determine Stock Index based on table (Heuristic or by ID if possible, but here we can just check length or specific tables)
            // LunasTable has 7 cells. MonturasTable now has 6 cells (Code, Name, Stock, Buy, Sell, Actions)
            // Stock is index 2 for Monturas.
            
            // However, this helper is generic. Let's make it specific or check ID.
            // Since we pass `tbody`, we can check the parent table ID if we had access, or just assume standard if we passed specific tbodies.
            
            // BETTER: modify arguments to accept stockIndex.
            
            // But to minimize code changes in this specific function let's look at how it is called.
            // It's called for monturasTableBody.
            
            // Let's refactor this function slightly or just hardcode for valid tables.
            
             if (cells.length > 2) {
                 // For Monturas (Length 6), Stock is 2
                 // For Lunas (Length 7), we don't sum stock (it's count).
                 
                 // If the table corresponds to Monturas, we use index 2.
                 // We can check if `tbody` is `monturasTableBody`.
                 if (tbody === monturasTableBody) {
                    const stockVal = parseInt(cells[2].innerText);
                     if (!isNaN(stockVal)) {
                        total += stockVal;
                    }
                 }
            }
        });
        return total;
    }

    const lunasCount = lunasTableBody ? lunasTableBody.querySelectorAll('tr').length : 0;
    const monturasStockTotal = calculateTotalStock(monturasTableBody);
    const providersCount = providersTableBody ? providersTableBody.querySelectorAll('tr').length : 0;

    const kpiLunas = document.getElementById('kpi-lunas');
    const kpiMonturas = document.getElementById('kpi-monturas');
    const kpiProviders = document.getElementById('kpi-providers');

    if(kpiLunas) { 
        kpiLunas.style.animation = 'none'; 
        kpiLunas.offsetHeight; /* trigger reflow */ 
        kpiLunas.style.animation = null; 
        kpiLunas.innerText = lunasCount; 
    }

    if(kpiMonturas) kpiMonturas.innerText = monturasStockTotal;
    if(kpiProviders) kpiProviders.innerText = providersCount;

    // 2. Update Low Stock Alerts
    const alertList = document.getElementById('stockAlerts');
    if(!alertList) return;
    
    alertList.innerHTML = ''; // Clear existing
    let lowStockFound = false;

    // Helper to check table for low stock
    function checkTableStock(tableId, type) {
        // Skip Lunas for stock alert
        if (type === 'Luna') return;

        const rows = document.querySelectorAll(`#${tableId} tbody tr`);

        rows.forEach(row => {
            const cells = row.getElementsByTagName('td');
            
            let stockIndex = 5; // Default (Old)
            if (type === 'Montura') stockIndex = 2; // New Index for Monturas

            if(cells.length > stockIndex) {
                const stockVal = parseInt(cells[stockIndex].innerText);
                const code = cells[0].innerText;
                const name = cells[1].innerText;
                
                if(!isNaN(stockVal) && stockVal < 5) {
                    lowStockFound = true;
                    const li = document.createElement('li');
                    li.innerHTML = `<span>${type}: ${name} (Cod: ${code})</span> <span>Stock: ${stockVal}</span>`;
                    alertList.appendChild(li);
                }
            }
        });
    }

    checkTableStock('lunasTable', 'Luna');
    checkTableStock('monturasTable', 'Montura');

    if(!lowStockFound) {
        alertList.innerHTML = '<li class="empty-alert">Todo el stock está en niveles óptimos.</li>';
    }
}

// Using MutationObserver to automatically update dashboard when tables change
const configObserver = { childList: true, subtree: true };
const callbackObserver = function(mutationsList, observer) {
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            updateDashboard();
        }
    }
};
const dashboardObserver = new MutationObserver(callbackObserver);
const lunasTbody = document.querySelector('#lunasTable tbody');
const monturasTbody = document.querySelector('#monturasTable tbody');
const providersTbody = document.querySelector('#providersTable tbody');

if(lunasTbody) dashboardObserver.observe(lunasTbody, configObserver);
if(monturasTbody) dashboardObserver.observe(monturasTbody, configObserver);
if(providersTbody) dashboardObserver.observe(providersTbody, configObserver);

// Login Logic
const loginContainer = document.getElementById('loginContainer');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Check Session on Load
function checkSession() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        showApp();
    } else {
        showLogin();
    }
}

function showApp() {
    if(loginContainer) loginContainer.style.display = 'none';
    if(mainApp) {
        mainApp.style.display = 'block';
        updateDashboard(); // Refresh dashboard on show
    }
}

function showLogin() {
    if(mainApp) mainApp.style.display = 'none';
    if(loginContainer) loginContainer.style.display = 'flex';
}

if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        // Hardcoded generic credentials for prototype
        if(user === 'admin' && pass === 'admin') {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('username', user);
            showApp();
            loginError.innerText = '';
        } else {
            loginError.innerText = 'Usuario o contraseña incorrectos';
            // Animation shake
            const box = document.querySelector('.login-box');
            box.style.animation = 'shake 0.5s';
            setTimeout(() => box.style.animation = 'none', 500);
        }
    });

    // Add shake animation style dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            50% { transform: translateX(10px); }
            75% { transform: translateX(-10px); }
            100% { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
}

if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if(confirm('¿Cerrar sesión?')) {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('username');
            showLogin();
            // Reset form
            if(loginForm) loginForm.reset();
        }
    });
}

// Initial Check
document.addEventListener('DOMContentLoaded', checkSession);

// User Management Logic
const btnAddUser = document.getElementById('btnAddUser');
if(btnAddUser) {
    btnAddUser.addEventListener('click', () => {
        alert('Funcionalidad de "Crear Nuevo Usuario" disponible en la versión completa con Base de Datos.');
    });
}

// ==========================================
// CLIENTS LOGIC
// ==========================================

const modalClient = document.getElementById('addClientModal');
const btnAddClient = document.getElementById('btnAddClient');
const closeBtnClient = document.querySelector('.client-close');
const addFormClient = document.getElementById('addClientForm');
const tableBodyClients = document.querySelector('#clientsTable tbody');
let isEditingClient = false;
let currentEditRowClient = null;

// Helper: Calculate Balance
function calculateBalance() {
    const total = parseFloat(document.getElementById('c_total').value) || 0;
    const advance = parseFloat(document.getElementById('c_advance').value) || 0;
    const balance = total - advance;
    document.getElementById('c_balance').value = formatCurrency(balance.toString());
}

// Event Listeners for Balance Calc
if(document.getElementById('c_total') && document.getElementById('c_advance')) {
    document.getElementById('c_total').addEventListener('input', calculateBalance);
    document.getElementById('c_advance').addEventListener('input', calculateBalance);
}

// Open Modal Client
if(btnAddClient) {
    btnAddClient.addEventListener('click', () => {
        isEditingClient = false;
        currentEditRowClient = null;
        addFormClient.reset();
        document.querySelector('#addClientModal h2').innerText = 'Agregar Nuevo Cliente';
        // Set default date to today
        document.getElementById('c_date').valueAsDate = new Date();
        document.getElementById('c_balance').value = 'S/. 0.00';
        
        // Reset and Populate Dropdowns
        updateClientProductDropdowns();
        
        modalClient.style.display = 'block';
    });
}

// ==========================================
// DYNAMIC PRODUCT SELECTION LOGIC
// ==========================================

const selLunaName = document.getElementById('sel_luna_name');
const selLunaMeasure = document.getElementById('sel_luna_measure');
const selMontura = document.getElementById('sel_montura');
const cDataInput = document.getElementById('c_data');
const chkConsulta = document.getElementById('chk_consulta'); // New Checkbox

let lunasData = {}; // Structure: { "LunaName": ["Measure1", "Measure2"] }
let monturasList = []; // Structure: ["MonturaName"]

function updateClientProductDropdowns() {
    // 1. Harvest Lunas Data
    lunasData = {};
    const lunasRows = document.querySelectorAll('#lunasTable tbody tr');
    lunasRows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        if(cells.length > 3) {
            const name = cells[1].innerText;
            const measure = cells[3].innerText;
            
            if (!lunasData[name]) {
                lunasData[name] = [];
            }
            // Avoid duplicates
            if (!lunasData[name].includes(measure)) {
                lunasData[name].push(measure);
            }
        }
    });

    // 2. Harvest Monturas Data
    monturasList = [];
    const monturasRows = document.querySelectorAll('#monturasTable tbody tr');
    monturasRows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        if(cells.length > 1) {
            const name = cells[1].innerText;
            if (!monturasList.includes(name)) {
                monturasList.push(name);
            }
        }
    });

    // 3. Populate Luna Names
    selLunaName.innerHTML = '<option value="">Tipo de Luna</option>';
    for (const name in lunasData) {
        const option = document.createElement('option');
        option.value = name;
        option.text = name;
        selLunaName.appendChild(option);
    }
    
    // Reset Measure
    selLunaMeasure.innerHTML = '<option value="">Medida</option>';
    selLunaMeasure.disabled = true;

    // 4. Populate Monturas
    selMontura.innerHTML = '<option value="">Modelo de Montura</option>';
    monturasList.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.text = name;
        selMontura.appendChild(option);
    });
    
    // Reset Result
    cDataInput.value = '';
    
    // Reset Checkbox
    if(chkConsulta) {
        chkConsulta.checked = false;
        toggleProductSelection(true); // Enable dropdowns
    }
}

// Helper to toggle dropdowns based on Checkbox
function toggleProductSelection(enable) {
    if(enable) {
        selLunaName.disabled = false;
        selMontura.disabled = false;
        // Measure depends on Name selection, so check that
        if(selLunaName.value) {
            selLunaMeasure.disabled = false;
        } else {
            selLunaMeasure.disabled = true;
        }
        updatePurchaseDataString(); // Recalculate based on current dropdowns
    } else {
        selLunaName.disabled = true;
        selLunaMeasure.disabled = true;
        selMontura.disabled = true;
        cDataInput.value = 'Consulta';
    }
}

// Checkbox Listener
if(chkConsulta) {
    chkConsulta.addEventListener('change', function() {
        toggleProductSelection(!this.checked);
    });
}

// Luna Name Change -> Populate Measures
if(selLunaName) {
    selLunaName.addEventListener('change', function() {
        const selectedName = this.value;
        selLunaMeasure.innerHTML = '<option value="">Medida</option>';
        
        if (selectedName && lunasData[selectedName]) {
            selLunaMeasure.disabled = false;
            lunasData[selectedName].forEach(measure => {
                const option = document.createElement('option');
                option.value = measure;
                option.text = measure;
                selLunaMeasure.appendChild(option);
            });
        } else {
            selLunaMeasure.disabled = true;
        }
        updatePurchaseDataString();
    });
}

// Listeners for other selects to update string
if(selLunaMeasure) selLunaMeasure.addEventListener('change', updatePurchaseDataString);
if(selMontura) selMontura.addEventListener('change', updatePurchaseDataString);

function updatePurchaseDataString() {
    // Safety check if checkbox is checked (redundant but safe)
    if(chkConsulta && chkConsulta.checked) {
        cDataInput.value = 'Consulta';
        return;
    }

    const luna = selLunaName.value;
    const measure = selLunaMeasure.value;
    const montura = selMontura.value;
    
    let parts = [];
    if(luna) parts.push(luna);
    if(measure) parts.push(measure);
    if(montura) parts.push(montura);
    
    cDataInput.value = parts.join(' , ');
}

// Edit Mode - Load existing data string back into dropdowns (Best Effort)
// Since the string is constructed, we can try to deconstruct it or just let user re-select.
// For now, let's keep it simple: If editing, we might just show the string.
// BUT, user asked for this flow.
// Strategy: When editing, try to match text. If not perfect match, just show string in readonly?
// Actually the request implies using this for CREATION.
// For editing, let's just clear dropdowns or try to match.


// Close Modal Client
if(closeBtnClient) {
    closeBtnClient.addEventListener('click', () => {
        modalClient.style.display = 'none';
    });
}

// Close outside click
window.addEventListener('click', (e) => {
    if (e.target == modalClient) {
        modalClient.style.display = 'none';
    }
});

// Helper: Get Status Badge HTML
function getStatusBadge(total, advance) {
    const balance = total - advance;
    if (balance <= 0) {
        return '<span class="status-badge status-paid">CANCELADO</span>';
    } else if (advance > 0) {
        return '<span class="status-badge status-advance">ADELANTO</span>';
    } else {
        return '<span class="status-badge status-pending">PENDIENTE</span>';
    }
}

// Add/Edit Client
if(addFormClient) {
    addFormClient.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get values
        const id = document.getElementById('c_id').value;
        const dni = document.getElementById('c_dni').value;
        const name = document.getElementById('c_name').value;
        const data = document.getElementById('c_data').value;
        const phone = document.getElementById('c_phone').value;
        const dateRaw = document.getElementById('c_date').value;
        // Format date to dd/mm/yyyy for display
        const dateObj = new Date(dateRaw);
        // Fix timezone issue by using UTC methods or simple string split if YYYY-MM-DD
        const dateParts = dateRaw.split('-');
        const dateDisplay = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // dd/mm/yyyy

        const total = parseFloat(document.getElementById('c_total').value) || 0;
        const advance = parseFloat(document.getElementById('c_advance').value) || 0;
        const balance = total - advance;
        const statusBadge = getStatusBadge(total, advance);

        if (isEditingClient && currentEditRowClient) {
            // Update existing row
            currentEditRowClient.innerHTML = `
                <td>${id}</td>
                <td>${name}</td>
                <td>${dni}</td>
                <td>${data}</td>
                <td>${phone}</td>
                <td>${dateDisplay}</td>
                <td>${statusBadge}</td>
                <td>${formatCurrency(balance.toString())}</td>
                <td>${formatCurrency(total.toString())}</td>
                <td class="actions-cell">
                    <button class="icon-btn edit-btn"><i class='bx bxs-edit-alt'></i></button>
                    <button class="icon-btn delete-btn"><i class='bx bxs-trash'></i></button>
                    <!-- Hidden data for logic -->
                    <input type="hidden" class="raw-date" value="${dateRaw}">
                    <input type="hidden" class="raw-total" value="${total}">
                    <input type="hidden" class="raw-advance" value="${advance}">
                </td>
            `;
            isEditingClient = false;
            currentEditRowClient = null;
        } else {
            // Create Row
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${id}</td>
                <td>${name}</td>
                <td>${dni}</td>
                <td>${data}</td>
                <td>${phone}</td>
                <td>${dateDisplay}</td>
                <td>${statusBadge}</td>
                <td>${formatCurrency(balance.toString())}</td>
                <td>${formatCurrency(total.toString())}</td>
                <td class="actions-cell">
                    <button class="icon-btn edit-btn"><i class='bx bxs-edit-alt'></i></button>
                    <button class="icon-btn delete-btn"><i class='bx bxs-trash'></i></button>
                    <!-- Hidden data for logic -->
                    <input type="hidden" class="raw-date" value="${dateRaw}">
                    <input type="hidden" class="raw-total" value="${total}">
                    <input type="hidden" class="raw-advance" value="${advance}">
                </td>
            `;
            if(tableBodyClients) tableBodyClients.appendChild(newRow);
        }
        
        // Clear & Close
        addFormClient.reset();
        modalClient.style.display = 'none';
    });
}

// Delete & Edit Logic for Clients
if(tableBodyClients) {
    tableBodyClients.addEventListener('click', (e) => {
        // Delete
        if(e.target.closest('.delete-btn')) {
            if(confirm('¿Estás seguro de eliminar este cliente?')) {
                const row = e.target.closest('tr');
                row.remove();
            }
        }
        
        // Edit
        if(e.target.closest('.edit-btn')) {
            const row = e.target.closest('tr');
            const cells = row.getElementsByTagName('td');
            
            // Populate Form
            document.getElementById('c_id').value = cells[0].innerText;
            document.getElementById('c_name').value = cells[1].innerText;
            document.getElementById('c_dni').value = cells[2].innerText;
            document.getElementById('c_data').value = cells[3].innerText;
            document.getElementById('c_phone').value = cells[4].innerText;
            
            // Retrieve hidden values if available, otherwise parse
            const rawDate = row.querySelector('.raw-date') ? row.querySelector('.raw-date').value : '';
            const rawTotal = row.querySelector('.raw-total') ? row.querySelector('.raw-total').value : '';
            const rawAdvance = row.querySelector('.raw-advance') ? row.querySelector('.raw-advance').value : '';
            
            // If hidden inputs exist (newly added rows), use them. 
            // For static rows (prototype), we might need parsing. 
            // Since I added static rows with same structure but maybe no hidden inputs initially? 
            // Let's assume user starts adding new data or I update static rows.
            
            if(rawDate) {
                document.getElementById('c_date').value = rawDate;
                document.getElementById('c_total').value = rawTotal;
                document.getElementById('c_advance').value = rawAdvance;
            } else {
                // Fallback parsing for static rows (if any)
                // For now, let's assume we use the new structure.
                // If I modify index.html static rows, I should add hidden inputs there too OR parse currency.
                
                // Let's parse currency for now as fallback
                const totalText = cells[8].innerText.replace('S/. ', '');
                const balanceText = cells[7].innerText.replace('S/. ', '');
                const totalVal = parseFloat(totalText);
                const balanceVal = parseFloat(balanceText);
                const advanceVal = totalVal - balanceVal;
                
                document.getElementById('c_total').value = totalVal;
                document.getElementById('c_advance').value = advanceVal;
                
                // Date parsing (dd/mm/yyyy -> yyyy-mm-dd)
                const dateParts = cells[5].innerText.split('/');
                if(dateParts.length === 3) {
                     document.getElementById('c_date').value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                }
            }
            
            calculateBalance(); // Update readonly field
            
            // Set Edit Mode
            isEditingClient = true;
            currentEditRowClient = row;
            document.querySelector('#addClientModal h2').innerText = 'Editar Cliente';
            modalClient.style.display = 'block';
        }
    });
}

// Search Logic for Clients
const searchClientInput = document.getElementById('searchClientInput');
if(searchClientInput && tableBodyClients) {
    searchClientInput.addEventListener('keyup', function() {
        const filter = this.value.toLowerCase();
        const rows = tableBodyClients.getElementsByTagName('tr');
        
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            let match = false;
            // Check ID (0), Name (1), DNI (2)
            if (cells[0] && cells[0].innerText.toLowerCase().indexOf(filter) > -1) match = true;
            if (cells[1] && cells[1].innerText.toLowerCase().indexOf(filter) > -1) match = true;
            if (cells[2] && cells[2].innerText.toLowerCase().indexOf(filter) > -1) match = true;
            
            if (match) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    });
}

// ==========================================
// PDF EXPORT LOGIC
// ==========================================

const modalExport = document.getElementById('exportModal');
const btnOpenExport = document.getElementById('btnOpenExportModal');
const closeBtnExport = document.querySelector('.export-close');
const btnGeneratePDF = document.getElementById('btnGeneratePDF');

// Open Modal
if(btnOpenExport) {
    btnOpenExport.addEventListener('click', () => {
        // Set default dates (First day of month to Today)
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        
        document.getElementById('exportStartDate').valueAsDate = firstDay;
        document.getElementById('exportEndDate').valueAsDate = today;
        
        modalExport.style.display = 'block';
    });
}

// Close Modal
if(closeBtnExport) {
    closeBtnExport.addEventListener('click', () => {
        modalExport.style.display = 'none';
    });
}

// Close outside click
window.addEventListener('click', (e) => {
    if (e.target == modalExport) {
        modalExport.style.display = 'none';
    }
});

// Generate PDF
if(btnGeneratePDF) {
    btnGeneratePDF.addEventListener('click', () => {
        const startDateVal = document.getElementById('exportStartDate').value;
        const endDateVal = document.getElementById('exportEndDate').value;
        
        if(!startDateVal || !endDateVal) {
            alert('Por favor selecciona ambas fechas.');
            return;
        }

        const startDate = new Date(startDateVal);
        const endDate = new Date(endDateVal);
        // Normalize time to compare only dates
        startDate.setHours(0,0,0,0);
        endDate.setHours(23,59,59,999);

        // Access jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(18);
        doc.text('Reporte de Clientes', 14, 20);
        
        doc.setFontSize(11);
        doc.text(`Desde: ${startDateVal}  Hasta: ${endDateVal}`, 14, 28);
        doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 34);

        // Collect Data
        let rowsData = [];
        let totalIncome = 0;
        
        const rows = tableBodyClients.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.getElementsByTagName('td');
            if(cells.length > 0) {
                // Date is in index 5 (dd/mm/yyyy)
                const dateText = cells[5].innerText; 
                const [day, month, year] = dateText.split('/');
                const rowDate = new Date(`${year}-${month}-${day}`);
                
                if (rowDate >= startDate && rowDate <= endDate) {
                    // Extract data for PDF
                    const id = cells[0].innerText;
                    const name = cells[1].innerText;
                    const dni = cells[2].innerText;
                    const purchaseData = cells[3].innerText; // "Consulta" or products
                    const phone = cells[4].innerText;
                    const status = cells[6].innerText; // Text inside span
                    const paidAmount = cells[8].innerText; // Total
                     // Wait, Logic for income:
                    // If PAID -> Income = Total
                    // If ADVANCE -> Income = Advance? Or just show Total amount involved?
                    // Let's show Total Amount column in PDF.
                    // If you want "Income" specifically, we might need to parse Advance input hidden?
                    // For now, let's list the transaction value.
                    
                    rowsData.push([
                        id, 
                        name, 
                        dni, 
                        purchaseData, 
                        dateText, 
                        status, 
                        paidAmount
                    ]);
                    
                    // Simple total sum of transaction values for footer
                    totalIncome += parseFloat(paidAmount.replace('S/. ', '')) || 0;
                }
            }
        });

        if(rowsData.length === 0) {
            alert('No se encontraron registros en el rango de fechas seleccionado.');
            return;
        }

        // Generate Table
        doc.autoTable({
            startY: 40,
            head: [['ID', 'Nombre', 'DNI', 'Detalle', 'Fecha', 'Estado', 'Total']],
            body: rowsData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
            styles: { fontSize: 8 },
            columnStyles: {
                2: { cellWidth: 20 }, // DNI
                3: { cellWidth: 40 }  // Detalle
            }
        });

        // Add Footer with Totals
        const finalY = doc.lastAutoTable.finalY || 40;
        doc.setFontSize(10);
        doc.text(`Total Valor Transacciones: S/. ${totalIncome.toFixed(2)}`, 14, finalY + 10);

        // Save
        doc.save(`Reporte_Clientes_${startDateVal}_${endDateVal}.pdf`);
        
        modalExport.style.display = 'none';
    });
}

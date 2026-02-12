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


// Open Modal (Lunas) - Updated to populate dropdown
if(btnAdd) {
    btnAdd.addEventListener('click', () => {
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
        const material = document.getElementById('material').value;
        const stock = document.getElementById('stock').value;
        const buyPrice = document.getElementById('buyPrice').value;
        const sellPrice = document.getElementById('sellPrice').value;
        
        // Create Row
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${code}</td>
            <td>${name}</td>
            <td>${laboratory}</td>
            <td>${measure}</td>
            <td>${material}</td>
            <td>${stock}</td>
            <td>${formatCurrency(buyPrice)}</td>
            <td>${formatCurrency(sellPrice)}</td>
            <td class="actions-cell">
                <button class="icon-btn edit-btn"><i class='bx bxs-edit-alt'></i></button>
                <button class="icon-btn delete-btn"><i class='bx bxs-trash'></i></button>
            </td>
        `;
        
        // Append
        tableBody.appendChild(newRow);
        
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
        
        // Edit (Placeholder)
        if(e.target.closest('.edit-btn')) {
            alert('Función de editar en construcción');
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

// Open Modal Montura
if(btnAddMontura) {
    btnAddMontura.addEventListener('click', () => {
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
        const material = document.getElementById('m_material').value;
        const type = document.getElementById('m_type').value;
        const design = document.getElementById('m_design').value;
        const stock = document.getElementById('m_stock').value;
        const buyPrice = document.getElementById('m_buyPrice').value;
        const sellPrice = document.getElementById('m_sellPrice').value;
        
        // Create Row
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${code}</td>
            <td>${name}</td>
            <td>${material}</td>
            <td>${type}</td>
            <td>${design}</td>
            <td>${stock}</td>
            <td>${formatCurrency(buyPrice)}</td>
            <td>${formatCurrency(sellPrice)}</td>
            <td class="actions-cell">
                <button class="icon-btn edit-btn"><i class='bx bxs-edit-alt'></i></button>
                <button class="icon-btn delete-btn"><i class='bx bxs-trash'></i></button>
            </td>
        `;
        
        // Append
        if(tableBodyMonturas) tableBodyMonturas.appendChild(newRow);
        
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
            alert('Función de editar montura en construcción');
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

// Open Modal Provider
if(btnAddProvider) {
    btnAddProvider.addEventListener('click', () => {
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
        
        // Append
        if(tableBodyProviders) tableBodyProviders.appendChild(newRow);
        
        // Clear & Close
        addFormProvider.reset();
        modalProvider.style.display = 'none';
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
            alert('Función de editar laboratorio en construcción');
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
            if (cells.length > 5) {
                const stockVal = parseInt(cells[5].innerText);
                if (!isNaN(stockVal)) {
                    total += stockVal;
                }
            }
        });
        return total;
    }

    const lunasStockTotal = calculateTotalStock(lunasTableBody);
    const monturasStockTotal = calculateTotalStock(monturasTableBody);
    const providersCount = providersTableBody ? providersTableBody.querySelectorAll('tr').length : 0;

    const kpiLunas = document.getElementById('kpi-lunas');
    const kpiMonturas = document.getElementById('kpi-monturas');
    const kpiProviders = document.getElementById('kpi-providers');

    if(kpiLunas) { 
        kpiLunas.style.animation = 'none'; 
        kpiLunas.offsetHeight; /* trigger reflow */ 
        kpiLunas.style.animation = null; 
        kpiLunas.innerText = lunasStockTotal; 
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
        const rows = document.querySelectorAll(`#${tableId} tbody tr`);
        rows.forEach(row => {
            const cells = row.getElementsByTagName('td');
            // Assuming Stock is the 6th column (index 5)
            if(cells.length > 5) {
                const stockVal = parseInt(cells[5].innerText);
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

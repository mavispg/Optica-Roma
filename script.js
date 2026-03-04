



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

// HELPER: Get local YYYY-MM-DD string
function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ==========================================
// HELPER: Format Purchase Data for Display
// ==========================================

function formatPurchaseDataForDisplay(dataString) {
    if (!dataString || dataString === 'Consulta') {
        return '<span class="purchase-data-item">Consulta</span>';
    }
    
    let parts = [];
    if (dataString.includes('|')) {
        // Structured format: Luna | Medida | Montura
        parts = dataString.split('|').map(p => p.trim());
    } else {
        // Legacy formatted string
        parts = dataString.split(' , ').map(p => p.trim());
    }
    
    let html = '<div class="purchase-data">';
    
    if (dataString.includes('|')) {
        if (parts[0]) html += `<span class="purchase-data-item"><span class="purchase-data-label">Luna:</span>${parts[0]}</span>`;
        if (parts[1]) html += `<span class="purchase-data-item"><span class="purchase-data-label">Medida:</span>${parts[1]}</span>`;
        if (parts[2]) html += `<span class="purchase-data-item"><span class="purchase-data-label">Montura:</span>${parts[2]}</span>`;
    } else {
        // Fallback for old records
        if (parts.length === 1) {
            html += `<span class="purchase-data-item">${parts[0]}</span>`;
        } else if (parts.length === 2) {
            html += `<span class="purchase-data-item"><span class="purchase-data-label">Luna:</span>${parts[0]}</span>`;
            html += `<span class="purchase-data-item"><span class="purchase-data-label">Medida:</span>${parts[1]}</span>`;
        } else if (parts.length >= 3) {
            html += `<span class="purchase-data-item"><span class="purchase-data-label">Luna:</span>${parts[0]}</span>`;
            html += `<span class="purchase-data-item"><span class="purchase-data-label">Medida:</span>${parts[1]}</span>`;
            html += `<span class="purchase-data-item"><span class="purchase-data-label">Montura:</span>${parts[2]}</span>`;
        }
    }
    
    html += '</div>';
    return html;
}

// ==========================================
// HELPER: Format Payment Method Badge
// ==========================================

function formatPaymentMethodBadge(method) {
    if (!method) return '';
    
    const methodLower = method.toLowerCase();
    let badgeClass = 'payment-badge';
    
    if (methodLower === 'efectivo') {
        badgeClass += ' payment-efectivo';
    } else if (methodLower === 'yape') {
        badgeClass += ' payment-yape';
    } else if (methodLower === 'visa') {
        badgeClass += ' payment-visa';
    }
    
    return `<span class="${badgeClass}">${method}</span>`;
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
        document.getElementById('l_date').value = getLocalDateString();
        document.querySelector('#addModal h2').innerText = 'Agregar Nueva Luna';
        updateProviderDropdown();
        modal.style.display = 'block';
    });
}

// LABORATORIES DATA MANAGEMENT
let laboratories = JSON.parse(localStorage.getItem('optica_laboratories')) || ['SHINGWA', 'CRISOL', 'EYES'];

function saveLaboratories() {
    localStorage.setItem('optica_laboratories', JSON.stringify(laboratories));
}

// Function to populate Laboratory Dropdown (datalist)
function updateProviderDropdown() {
    const datalist = document.getElementById('laboratoryOptions');
    if(!datalist) return;
    
    datalist.innerHTML = '';
    
    laboratories.forEach(lab => {
        const option = document.createElement('option');
        option.value = lab;
        datalist.appendChild(option);
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
        const laboratory = document.getElementById('laboratoryInput').value;
        const measure = document.getElementById('measure').value;
        const buyPrice = document.getElementById('buyPrice').value;
        const sellPrice = document.getElementById('sellPrice').value;
        const date = document.getElementById('l_date').value;

        // Auto-save laboratory if new
        if (laboratory && !laboratories.includes(laboratory)) {
            laboratories.push(laboratory);
            saveLaboratories();
            updateProviderDropdown();
        }

        
        if (isEditing && currentEditRow) {
            // Update existing row
            currentEditRow.innerHTML = `
                <td>${code}</td>
                <td>${name}</td>
                <td>${laboratory}</td>
                <td>${measure}</td>
                <td>${formatCurrency(buyPrice)}</td>
                <td>${formatCurrency(sellPrice)}</td>
                <td>${date}</td>
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
                <td>${date}</td>
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
            document.getElementById('laboratoryInput').value = cells[2].innerText;
            
            document.getElementById('measure').value = cells[3].innerText;
            
            // Strip currency symbol for input
            document.getElementById('buyPrice').value = cells[4].innerText.replace('S/. ', '');
            document.getElementById('sellPrice').value = cells[5].innerText.replace('S/. ', '');
            document.getElementById('l_date').value = cells[6].innerText;

            
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

// Helper: Get Next Montura Code
function getNextMonturaCode() {
    const rows = document.querySelectorAll('#monturasTable tbody tr');
    let maxId = 0;
    
    rows.forEach(row => {
        const codeText = row.cells[0].innerText;
        const codeNum = parseInt(codeText);
        if (!isNaN(codeNum) && codeNum > maxId) {
            maxId = codeNum;
        }
    });
    
    const nextId = maxId + 1;
    return nextId.toString().padStart(3, '0');
}


// Open Modal Montura
if(btnAddMontura) {
    btnAddMontura.addEventListener('click', () => {
        isEditingMontura = false;
        currentEditRowMontura = null;
        addFormMontura.reset();
        
        // Auto-generate Code
        document.getElementById('m_code').value = getNextMonturaCode();
        
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
        const sellPrice = document.getElementById('m_sell_price').value;
        
        if (isEditingMontura && currentEditRowMontura) {
            // Update existing row
            // We preserve 'Available' if possible or reset if stock changes
            const oldStockText = currentEditRowMontura.cells[2].innerText;
            const match = oldStockText.match(/(\d+)\((\d+)\)/);
            let available = stock; // default to reset
            
            if (match && match[1] === stock) {
                available = match[2]; // keep available if total didn't change
            }

            currentEditRowMontura.innerHTML = `
                <td>${code}</td>
                <td>${name}</td>
                <td>${stock}(${available})</td>
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
                <td>${stock}(${stock})</td>
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
            
            document.getElementById('m_code').value = cells[0].innerText;
            document.getElementById('m_name').value = cells[1].innerText;
            
            // Extract total from format "Total(Available)"
            const stockText = cells[2].innerText;
            const stockMatch = stockText.match(/(\d+)/);
            document.getElementById('m_stock').value = stockMatch ? stockMatch[1] : stockText;
            
            const priceText = cells[3].innerText.replace('S/. ', '').replace(',', '');
            document.getElementById('m_sell_price').value = priceText;
            
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


// Logic for Dashboard (Home)
function updateDashboard() {
    // 1. Update KPI Cards
    const lunasTableBody = document.querySelector('#lunasTable tbody');
    const monturasTableBody = document.querySelector('#monturasTable tbody');

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

    const monturasStockTotal = calculateTotalStock(monturasTableBody);

    const kpiMonturas = document.getElementById('kpi-monturas');

    if(kpiMonturas) kpiMonturas.innerText = monturasStockTotal;


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

if(lunasTbody) dashboardObserver.observe(lunasTbody, configObserver);
if(monturasTbody) dashboardObserver.observe(monturasTbody, configObserver);

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
        console.log('Login attempt:', user, pass);
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

// ==========================================
// EXPORT LUNAS & MONTURAS PDF LOGIC
// ==========================================

function setupExportLunas() {
    const btnOpen = document.getElementById('btnOpenExportLunas');
    const modal = document.getElementById('exportLunasModal');
    const closeBtn = document.querySelector('.export-lunas-close');
    const btnGenerate = document.getElementById('btnGenerateLunasPDF');

    if (btnOpen && modal) {
        btnOpen.addEventListener('click', () => {
            document.getElementById('exportLunasStartDate').value = getLocalDateString();
            document.getElementById('exportLunasEndDate').value = getLocalDateString();
            modal.style.display = 'block';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (btnGenerate) {
        btnGenerate.addEventListener('click', () => {
            const start = document.getElementById('exportLunasStartDate').value;
            const end = document.getElementById('exportLunasEndDate').value;
            generateLunasPDF(start, end);
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == modal) modal.style.display = 'none';
    });
}

function generateLunasPDF(startDate, endDate) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l'); // Landscape for more columns

    doc.setFontSize(18);
    doc.text('Reporte de Lunas - OPTICA ROMA', 14, 20);
    doc.setFontSize(11);
    doc.text(`Rango: ${startDate} al ${endDate}`, 14, 30);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 37);

    const rows = [];
    const tableRows = document.querySelectorAll('#lunasTable tbody tr');

    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 7) {
            const date = cells[6].innerText;
            if (date >= startDate && date <= endDate) {
                rows.push([
                    cells[0].innerText, // Code
                    cells[1].innerText, // Name
                    cells[2].innerText, // Lab
                    cells[3].innerText, // Measure
                    cells[4].innerText, // Buy Price
                    cells[5].innerText, // Sell Price
                    date               // Date
                ]);
            }
        }
    });

    if (rows.length > 0) {
        doc.autoTable({
            startY: 45,
            head: [['Código', 'Nombre', 'Laboratorio', 'Medida', 'P. Compra', 'P. Venta', 'Fecha']],
            body: rows,
            theme: 'grid',
            headStyles: { fillColor: [0, 153, 0] }
        });
        doc.save(`Reporte_Lunas_${startDate}_${endDate}.pdf`);
    } else {
        alert('No se encontraron lunas en el rango de fechas seleccionado.');
    }
}

function setupExportMonturas() {
    const btnOpen = document.getElementById('btnOpenExportMonturas');
    const modal = document.getElementById('exportMonturasModal');
    const closeBtn = document.querySelector('.export-monturas-close');
    const btnGenerate = document.getElementById('btnGenerateMonturasPDF');

    if (btnOpen && modal) {
        btnOpen.addEventListener('click', () => {
            document.getElementById('exportMonturasStartDate').value = getLocalDateString();
            document.getElementById('exportMonturasEndDate').value = getLocalDateString();
            modal.style.display = 'block';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (btnGenerate) {
        btnGenerate.addEventListener('click', () => {
            const start = document.getElementById('exportMonturasStartDate').value;
            const end = document.getElementById('exportMonturasEndDate').value;
            generateMonturasPDF(start, end);
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == modal) modal.style.display = 'none';
    });
}

function generateMonturasPDF(startDate, endDate) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Reporte de Monturas - OPTICA ROMA', 14, 20);
    doc.setFontSize(11);
    doc.text(`Rango: ${startDate} al ${endDate}`, 14, 30);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 37);

    const rows = [];
    const tableRows = document.querySelectorAll('#monturasTable tbody tr');

    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
            const date = cells[4].innerText;
            if (date >= startDate && date <= endDate) {
                rows.push([
                    cells[0].innerText, // Code
                    cells[1].innerText, // Name
                    cells[2].innerText, // Stock
                    cells[3].innerText, // Sell Price
                    date               // Date
                ]);
            }
        }
    });

    if (rows.length > 0) {
        doc.autoTable({
            startY: 45,
            head: [['Código', 'Nombre', 'Stock', 'Precio Venta', 'Fecha']],
            body: rows,
            theme: 'grid',
            headStyles: { fillColor: [0, 153, 0] }
        });
        doc.save(`Reporte_Monturas_${startDate}_${endDate}.pdf`);
    } else {
        alert('No se encontraron monturas en el rango de fechas seleccionado.');
    }
}

// Initial Check & UX Improvements
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    setupAutoSelectOnFocus();
    setupExportLunas();
    setupExportMonturas();
});

// HELPER: Auto-select numeric inputs on focus for better UX
function setupAutoSelectOnFocus() {
    const fields = [
        'buyPrice', 'sellPrice', 
        'm_sellPrice', 'm_stock',
        'c_total', 'c_advance',
        'e_amount'
    ];
    
    fields.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('focus', function() {
                // Use a slight timeout to ensure selection works on some browsers
                setTimeout(() => this.select(), 10);
            });
        }
    });
}

// User Management Logic
const btnAddUser = document.getElementById('btnAddUser');
if(btnAddUser) {
    btnAddUser.addEventListener('click', () => {
        alert('Funcionalidad de "Crear Nuevo Usuario" disponible en la versión completa con Base de Datos.');
    });
}

// ==========================================
// HELPER: Decrement Montura Stock
// ==========================================

function decrementMonturaStock(monturaName, transactionDate) {
    if (!monturaName) return true; // No montura selected, proceed normally
    
    const monturasRows = document.querySelectorAll('#monturasTable tbody tr');
    
    for (let row of monturasRows) {
        const cells = row.getElementsByTagName('td');
        if (cells.length > 2) {
            const name = cells[1].innerText; // Column 1 is Name
            
            if (name === monturaName) {
                const stockCell = cells[2]; // Column 2 is Stock
                const stockText = stockCell.innerText;
                
                // Parse format "Total(Available)"
                const match = stockText.match(/(\d+)\((\d+)\)/);
                
                if (match) {
                    const total = parseInt(match[1]);
                    let available = parseInt(match[2]);
                    
                    if (available <= 0) {
                        alert(`No hay stock disponible para la montura "${monturaName}".`);
                        return false;
                    }
                    
                    // Decrement available
                    available--;
                    stockCell.innerText = `${total}(${available})`;
                    return true;
                } else {
                    // Fallback for old format
                    const currentStock = parseInt(stockText);
                    if (isNaN(currentStock) || currentStock <= 0) {
                        alert(`No hay stock disponible.`);
                        return false;
                    }
                    stockCell.innerText = `${currentStock}(${currentStock - 1})`;
                    return true;
                }
            }
        }
    }
    
    // Montura not found in table
    alert(`No se encontró la montura "${monturaName}" en el inventario.`);
    return false;
}

// ==========================================
// HELPER: Increment Montura Stock
// ==========================================

function incrementMonturaStock(monturaName) {
    if (!monturaName) return; // No montura to increment
    
    const monturasRows = document.querySelectorAll('#monturasTable tbody tr');
    
    for (let row of monturasRows) {
        const cells = row.getElementsByTagName('td');
        if (cells.length > 2) {
            const name = cells[1].innerText; // Column 1 is Name
            
            if (name === monturaName) {
                const stockCell = cells[2]; // Column 2 is Stock
                const stockText = stockCell.innerText;
                const match = stockText.match(/(\d+)\((\d+)\)/);
                
                if (match) {
                    const total = match[1];
                    let available = parseInt(match[2]);
                    available++;
                    stockCell.innerText = `${total}(${available})`;
                } else {
                    // Fallback
                    const currentStock = parseInt(stockText);
                    if (!isNaN(currentStock)) {
                        stockCell.innerText = `${currentStock}(${currentStock + 1})`;
                    }
                }
                
                return;
            }
        }
    }
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
let originalMonturaName = null; // Track original montura when editing

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
        
        // Código is now manual, default date
        document.getElementById('c_id').value = '';
        document.getElementById('c_date').value = getLocalDateString();
        document.getElementById('c_balance').value = 'S/. 0.00';
        
        // Reset and Populate Dropdowns
        updateClientProductDropdowns();
        
        modalClient.style.display = 'block';
    });
}

// ==========================================
// DYNAMIC PRODUCT SELECTION LOGIC
// ==========================================

const cLunaName = document.getElementById('c_luna_name');
const cLunaMeasure = document.getElementById('c_luna_measure');
const selMontura = document.getElementById('sel_montura');
const cDataInput = document.getElementById('c_data');
const chkConsulta = document.getElementById('chk_consulta');

let lunasData = {}; // Structure: { "LunaName": ["Measure1", "Measure2"] }
let monturasList = []; // Structure: ["MonturaName"]

function updateClientProductDropdowns() {
    // 2. Harvest Monturas Data (Lunas harvest removed as we use manual entry now)

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

    // 3. Reset Luna Inputs
    if(cLunaName) cLunaName.value = '';
    if(cLunaMeasure) cLunaMeasure.value = '';

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
        if(cLunaName) cLunaName.disabled = false;
        if(cLunaMeasure) cLunaMeasure.disabled = false;
        if(selMontura) selMontura.disabled = false;
        updatePurchaseDataString();
    } else {
        if(cLunaName) cLunaName.disabled = true;
        if(cLunaMeasure) cLunaMeasure.disabled = true;
        if(selMontura) selMontura.disabled = true;
        cDataInput.value = 'Consulta';
    }
}

// Checkbox Listener
if(chkConsulta) {
    chkConsulta.addEventListener('change', function() {
        toggleProductSelection(!this.checked);
    });
}

// Listeners for Luna inputs
const cIdInput = document.getElementById('c_id');
if(cIdInput) cIdInput.addEventListener('input', updatePurchaseDataString);
if(cLunaName) cLunaName.addEventListener('input', updatePurchaseDataString);
if(cLunaMeasure) cLunaMeasure.addEventListener('input', updatePurchaseDataString);
if(selMontura) selMontura.addEventListener('change', updatePurchaseDataString);

function updatePurchaseDataString() {
    if(chkConsulta && chkConsulta.checked) {
        cDataInput.value = 'Consulta';
        return;
    }

    const lunaName = cLunaName ? cLunaName.value : '';
    const measure = cLunaMeasure ? cLunaMeasure.value : '';
    const montura = selMontura ? selMontura.value : '';
    
    // Use structured format Luna|Measure|Montura to prevent shifting
    cDataInput.value = `${lunaName}|${measure}|${montura}`;
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
        const paymentMethod = document.getElementById('c_payment_method').value;

        // ==========================================
        // STOCK & LUNA AUTOMATION LOGIC
        // ==========================================
        const lunaCodeValue = id; // Use main ID as Lens Code
        const lunaNameValue = cLunaName ? cLunaName.value : '';
        const lunaMeasureValue = cLunaMeasure ? cLunaMeasure.value : '';

        // Function to ensure Luna product exists or creates it
        function ensureLunaProduct(code, name, measure, date) {
            if (!code) return;
            const lunasRows = document.querySelectorAll('#lunasTable tbody tr');
            let exists = false;
            for (let row of lunasRows) {
                const cells = row.getElementsByTagName('td');
                if (cells[0] && cells[0].innerText === code) {
                    exists = true;
                    // Update date even if exists (sync from transaction)
                    if (date && cells[6]) cells[6].innerText = date;
                    break;
                }
            }
            if (!exists) {
                const tableBodyLunas = document.querySelector('#lunasTable tbody');
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${code}</td>
                    <td>${name}</td>
                    <td></td> <!-- Laboratory empty for manual edit -->
                    <td>${measure}</td>
                    <td>S/.0.00</td>
                    <td>S/.0.00</td>
                    <td>${date || getLocalDateString()}</td>
                    <td class="actions-cell">
                        <button class="icon-btn edit-btn"><i class='bx bxs-edit-alt'></i></button>
                        <button class="icon-btn delete-btn"><i class='bx bxs-trash'></i></button>
                    </td>
                `;
                if(tableBodyLunas) tableBodyLunas.appendChild(newRow);
            }
        }

        if (!isEditingClient) {
            // NEW CLIENT: Check Luna Creation & decrement stock
            if (lunaCodeValue && !chkConsulta.checked) {
                ensureLunaProduct(lunaCodeValue, lunaNameValue, lunaMeasureValue, dateRaw);
            }

            const selectedMontura = selMontura ? selMontura.value : '';
            if (selectedMontura && !chkConsulta.checked) {
                const stockDecremented = decrementMonturaStock(selectedMontura, dateRaw);
                if (!stockDecremented) return;
            }
        } else {
            // EDITING CLIENT: Check Luna Creation & handle montura change
            if (lunaCodeValue && !chkConsulta.checked) {
                ensureLunaProduct(lunaCodeValue, lunaNameValue, lunaMeasureValue, dateRaw);
            }

            const selectedMontura = selMontura ? selMontura.value : '';
            if (originalMonturaName !== selectedMontura) {
                if (originalMonturaName && originalMonturaName !== '') {
                    incrementMonturaStock(originalMonturaName);
                }
                if (selectedMontura && selectedMontura !== '' && !chkConsulta.checked) {
                    const stockDecremented = decrementMonturaStock(selectedMontura, dateRaw);
                    if (!stockDecremented) {
                        if (originalMonturaName && originalMonturaName !== '') {
                            decrementMonturaStock(originalMonturaName);
                        }
                        return;
                    }
                }
            } else if (selectedMontura && selectedMontura !== '') {
                // Same montura, but maybe date changed? Sync date.
                decrementMonturaStock(selectedMontura, dateRaw);
            }
        }
        // ==========================================


        if (isEditingClient && currentEditRowClient) {
            // Update existing row
            const formattedData = formatPurchaseDataForDisplay(data);
            const formattedPayment = formatPaymentMethodBadge(paymentMethod);
            
            currentEditRowClient.innerHTML = `
                <td>${id}</td>
                <td>${name}</td>
                <td class="compact-cell">${formattedData}</td>
                <td>${phone}</td>
                <td>${dateDisplay}</td>
                <td>${statusBadge}</td>
                <td>${formatCurrency(balance.toString())}</td>
                <td>${formatCurrency(total.toString())}</td>
                <td>${formattedPayment}</td>
                <td class="actions-cell">
                    <button class="icon-btn edit-btn"><i class='bx bxs-edit-alt'></i></button>
                    <button class="icon-btn delete-btn"><i class='bx bxs-trash'></i></button>
                    <!-- Hidden data for logic -->
                    <input type="hidden" class="raw-date" value="${dateRaw}">
                    <input type="hidden" class="raw-total" value="${total}">
                    <input type="hidden" class="raw-advance" value="${advance}">
                    <input type="hidden" class="raw-montura" value="${selMontura ? selMontura.value : ''}">
                    <input type="hidden" class="raw-payment-method" value="${paymentMethod}">
                    <input type="hidden" class="raw-data" value="${data}">
                </td>
            `;
            isEditingClient = false;
            currentEditRowClient = null;
        } else {
            // Create Row
            const formattedData = formatPurchaseDataForDisplay(data);
            const formattedPayment = formatPaymentMethodBadge(paymentMethod);
            
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${id}</td>
                <td>${name}</td>
                <td class="compact-cell">${formattedData}</td>
                <td>${phone}</td>
                <td>${dateDisplay}</td>
                <td>${statusBadge}</td>
                <td>${formatCurrency(balance.toString())}</td>
                <td>${formatCurrency(total.toString())}</td>
                <td>${formattedPayment}</td>
                <td class="actions-cell">
                    <button class="icon-btn edit-btn"><i class='bx bxs-edit-alt'></i></button>
                    <button class="icon-btn delete-btn"><i class='bx bxs-trash'></i></button>
                    <!-- Hidden data for logic -->
                    <input type="hidden" class="raw-date" value="${dateRaw}">
                    <input type="hidden" class="raw-total" value="${total}">
                    <input type="hidden" class="raw-advance" value="${advance}">
                    <input type="hidden" class="raw-payment-method" value="${paymentMethod}">
                    <input type="hidden" class="raw-data" value="${data}">
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
            
            // Get raw data from hidden field (not from the formatted cell)
            const rawDataField = row.querySelector('.raw-data');
            const rawDataValue = rawDataField ? rawDataField.value : cells[2].innerText;
            document.getElementById('c_data').value = rawDataValue;
            
            document.getElementById('c_phone').value = cells[3].innerText;
            
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
                const balanceText = cells[6].innerText.replace('S/. ', '');
                const totalVal = parseFloat(totalText);
                const balanceVal = parseFloat(balanceText);
                const advanceVal = totalVal - balanceVal;
                
                document.getElementById('c_total').value = totalVal;
                document.getElementById('c_advance').value = advanceVal;
                
                // Date parsing (dd/mm/yyyy -> yyyy-mm-dd)
                const dateParts = cells[4].innerText.split('/');
                if(dateParts.length === 3) {
                     document.getElementById('c_date').value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                }
            }
            
            calculateBalance(); // Update readonly field
            
            // ==========================================
            // Extract original montura from hidden field or "Datos de Compra"
            // ==========================================
            originalMonturaName = null; // Reset
            
            // Try to get from hidden field first (for newly created rows)
            const rawMontura = row.querySelector('.raw-montura') ? row.querySelector('.raw-montura').value : '';
            
            if (rawMontura && rawMontura !== '') {
                originalMonturaName = rawMontura;
            } else {
                // Fallback: Parse from "Datos de Compra" column (for old/static rows)
                 const datosCompra = cells[2].innerText;
                
                if (datosCompra && datosCompra !== 'Consulta') {
                    // Try new format first, then fallback
                    let parts = [];
                    if (datosCompra.includes('|')) {
                        parts = datosCompra.split('|').map(p => p.trim());
                        originalMonturaName = parts[2] || null;
                    } else {
                        parts = datosCompra.split(' , ').map(p => p.trim());
                        // Check if any part matches a montura name from the monturas list
                        for (let i = parts.length - 1; i >= 0; i--) {
                            if (monturasList.includes(parts[i])) {
                                originalMonturaName = parts[i];
                                break;
                            }
                        }
                    }
                }
            }
            // ==========================================
            
            // Load payment method
            const rawPaymentMethod = row.querySelector('.raw-payment-method') ? row.querySelector('.raw-payment-method').value : '';
            if(rawPaymentMethod) {
                document.getElementById('c_payment_method').value = rawPaymentMethod;
            }
            
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
             // Check ID (0), Name (1), Purchase Data (2), Date (4), Status (5)
            if (cells[0] && cells[0].innerText.toLowerCase().indexOf(filter) > -1) match = true;
            if (cells[1] && cells[1].innerText.toLowerCase().indexOf(filter) > -1) match = true;
            if (cells[2] && cells[2].innerText.toLowerCase().indexOf(filter) > -1) match = true;
            if (cells[4] && cells[4].innerText.toLowerCase().indexOf(filter) > -1) match = true;
            if (cells[5] && cells[5].innerText.toLowerCase().indexOf(filter) > -1) match = true;
            
            if (match) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    });
}

// ==========================================
// DASHBOARD NAVIGATION
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
        const todayStr = getLocalDateString(today);
        const firstDayStr = getLocalDateString(firstDay);
        
        document.getElementById('exportStartDate').value = firstDayStr;
        document.getElementById('exportEndDate').value = todayStr;
        
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
                 // Date is in index 4 (dd/mm/yyyy)
                const dateText = cells[4].innerText; 
                const [day, month, year] = dateText.split('/');
                const rowDate = new Date(`${year}-${month}-${day}`);
                
                if (rowDate >= startDate && rowDate <= endDate) {
                    // Extract data for PDF
                    const id = cells[0].innerText;
                    const name = cells[1].innerText;
                    const purchaseData = cells[2].innerText; // "Consulta" or products
                    const phone = cells[3].innerText;
                    const status = cells[5].innerText; // Text inside span
                    const paidAmount = cells[7].innerText; // Total
                     // Wait, Logic for income:
                    // If PAID -> Income = Total
                    // If ADVANCE -> Income = Advance? Or just show Total amount involved?
                    // Let's show Total Amount column in PDF.
                    // If you want "Income" specifically, we might need to parse Advance input hidden?
                    // For now, let's list the transaction value.
                    
                    rowsData.push([
                        id, 
                        name, 
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
             head: [['ID', 'Nombre', 'Detalle', 'Fecha', 'Estado', 'Total']],
            body: rowsData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
            styles: { fontSize: 8 },
            columnStyles: {
                 2: { cellWidth: 40 }, // Detalle
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

// ==========================================
// Expenses (Egresos) Logic
// ==========================================
const modalExpense = document.getElementById('addExpenseModal');
const btnAddExpense = document.getElementById('btnAddExpense');
const closeBtnExpense = document.querySelector('.expense-close');
const addFormExpense = document.getElementById('addExpenseForm');
const tableBodyExpenses = document.querySelector('#expensesTable tbody');
const searchExpenseInput = document.getElementById('searchExpenseInput');
let isEditingExpense = false;
let currentEditRowExpense = null;

// Helper to generate next Expense ID (E-001, E-002, etc.)
function getNextExpenseID() {
    if (!tableBodyExpenses) return "E-001";
    const rows = tableBodyExpenses.querySelectorAll('tr');
    let maxNum = 0;
    
    rows.forEach(row => {
        const idText = row.getElementsByTagName('td')[0].innerText;
        if (idText.startsWith('E-')) {
            const num = parseInt(idText.split('-')[1]);
            if (!isNaN(num) && num > maxNum) maxNum = num;
        }
    });
    
    const nextNum = maxNum + 1;
    return `E-${nextNum.toString().padStart(3, '0')}`;
}

// Open Modal Expense
if(btnAddExpense) {
    btnAddExpense.addEventListener('click', () => {
        isEditingExpense = false;
        currentEditRowExpense = null;
        addFormExpense.reset();
        document.getElementById('expenseModalTitle').innerText = 'Agregar Nuevo Egreso';
        
        // Auto-set ID and date
        document.getElementById('e_id').value = getNextExpenseID();
        document.getElementById('e_date').value = getLocalDateString();
        
        modalExpense.style.display = 'block';
        
        // Reset description requirement
        const descInput = document.getElementById('e_description');
        if(descInput) {
            descInput.required = false;
            descInput.placeholder = '';
        }
    });
}

// category change listener
const eCategory = document.getElementById('e_category');
const eDescription = document.getElementById('e_description');
if(eCategory && eDescription) {
    eCategory.addEventListener('change', () => {
        if(eCategory.value === 'Otros') {
            eDescription.required = true;
            eDescription.placeholder = 'Por favor especifique...';
        } else {
            eDescription.required = false;
            eDescription.placeholder = '';
        }
    });
}

// Close Modal Expense
if(closeBtnExpense) {
    closeBtnExpense.addEventListener('click', () => {
        modalExpense.style.display = 'none';
    });
}

// Close outside click
window.addEventListener('click', (e) => {
    if (e.target == modalExpense) {
        modalExpense.style.display = 'none';
    }
});

// Add/Edit Expense
if(addFormExpense) {
    addFormExpense.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get values
        const id = document.getElementById('e_id').value;
        const dateRaw = document.getElementById('e_date').value;
        const category = document.getElementById('e_category').value;
        let description = document.getElementById('e_description').value;
        
        // Use category as description if empty (and not "Otros")
        if(!description && category !== 'Otros') {
            description = category;
        }
        
        const amount = parseFloat(document.getElementById('e_amount').value) || 0;

        // Format date to dd/mm/yyyy
        const dateParts = dateRaw.split('-');
        const dateDisplay = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        // Format amount
        const amountFormatted = formatCurrency(amount.toString());

        if (isEditingExpense && currentEditRowExpense) {
            // Update existing row
            currentEditRowExpense.innerHTML = `
                <td>${id}</td>
                <td>${dateDisplay}</td>
                <td>${category}</td>
                <td>${description}</td>
                <td>${amountFormatted}</td>
                <td class="actions-cell">
                    <button class="icon-btn edit-btn"><i class='bx bxs-edit-alt'></i></button>
                    <button class="icon-btn delete-btn"><i class='bx bxs-trash'></i></button>
                    <!-- Hidden data -->
                    <input type="hidden" class="raw-date" value="${dateRaw}">
                    <input type="hidden" class="raw-amount" value="${amount}">
                </td>
            `;
            isEditingExpense = false;
            currentEditRowExpense = null;
        } else {
            // Create Row
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${id}</td>
                <td>${dateDisplay}</td>
                <td>${category}</td>
                <td>${description}</td>
                <td>${amountFormatted}</td>
                <td class="actions-cell">
                    <button class="icon-btn edit-btn"><i class='bx bxs-edit-alt'></i></button>
                    <button class="icon-btn delete-btn"><i class='bx bxs-trash'></i></button>
                    <!-- Hidden data -->
                    <input type="hidden" class="raw-date" value="${dateRaw}">
                    <input type="hidden" class="raw-amount" value="${amount}">
                </td>
            `;
            if(tableBodyExpenses) tableBodyExpenses.appendChild(newRow);
        }

        modalExpense.style.display = 'none';
        addFormExpense.reset();
    });
}

// Table actions (Edit / Delete)
if(tableBodyExpenses) {
    tableBodyExpenses.addEventListener('click', (e) => {
        // Delete
        if(e.target.closest('.delete-btn')) {
            if(confirm('¿Estás seguro de eliminar este egreso?')) {
                const row = e.target.closest('tr');
                row.remove();
            }
        }

        // Edit
        if(e.target.closest('.edit-btn')) {
            const row = e.target.closest('tr');
            const cells = row.getElementsByTagName('td');

            // Populate Form
            document.getElementById('e_id').value = cells[0].innerText;
            
            const rawDateField = row.querySelector('.raw-date');
            if(rawDateField) document.getElementById('e_date').value = rawDateField.value;
            
            document.getElementById('e_category').value = cells[2].innerText;
            document.getElementById('e_category').dispatchEvent(new Event('change'));
            document.getElementById('e_description').value = cells[3].innerText;
            
            const rawAmountField = row.querySelector('.raw-amount');
            if(rawAmountField) document.getElementById('e_amount').value = rawAmountField.value;

            // Set state
            isEditingExpense = true;
            currentEditRowExpense = row;
            document.getElementById('expenseModalTitle').innerText = 'Editar Egreso';
            modalExpense.style.display = 'block';
        }
    });
}

// Search Logic
if(searchExpenseInput && tableBodyExpenses) {
    searchExpenseInput.addEventListener('keyup', function() {
        const filter = this.value.toLowerCase();
        const rows = tableBodyExpenses.getElementsByTagName('tr');

        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            let match = false;
            
            // Search in ID, Date, Category, Description
            if (cells[0] && cells[0].innerText.toLowerCase().indexOf(filter) > -1) match = true;
            if (cells[1] && cells[1].innerText.toLowerCase().indexOf(filter) > -1) match = true;
            if (cells[2] && cells[2].innerText.toLowerCase().indexOf(filter) > -1) match = true;
            if (cells[3] && cells[3].innerText.toLowerCase().indexOf(filter) > -1) match = true;

            rows[i].style.display = match ? "" : "none";
        }
    });
}

// ==========================================
// Tax Tracking (SUNAT) Logic
// ==========================================
let sunatGoal = 500;

function updateTaxSummary() {
    if (!tableBodyExpenses) return;
    
    let totalPaidSunat = 0;
    const rows = tableBodyExpenses.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        // Column Index 2 is Category. Ensure it matches "SUNAT"
        if (cells.length > 2 && cells[2].innerText.trim().toUpperCase() === 'SUNAT') {
            // Get raw amount from hidden field
            const rawAmountField = row.querySelector('.raw-amount');
            if (rawAmountField) {
                totalPaidSunat += parseFloat(rawAmountField.value) || 0;
            }
        }
    });
    
    const totalPendingSunat = Math.max(0, sunatGoal - totalPaidSunat);
    
    // Update UI
    const goalEl = document.getElementById('tax-goal');
    const paidEl = document.getElementById('tax-paid');
    const pendingEl = document.getElementById('tax-pending');
    
    if (goalEl) goalEl.innerText = formatCurrency(sunatGoal.toString());
    if (paidEl) paidEl.innerText = formatCurrency(totalPaidSunat.toString());
    if (pendingEl) pendingEl.innerText = formatCurrency(totalPendingSunat.toString());
}

// Edit Tax Goal
const btnEditTaxGoal = document.getElementById('btnEditTaxGoal');
if (btnEditTaxGoal) {
    btnEditTaxGoal.addEventListener('click', () => {
        const newGoal = prompt('Ingrese el monto de la meta/deuda mensual de SUNAT:', sunatGoal);
        if (newGoal !== null) {
            const parsedGoal = parseFloat(newGoal);
            if (!isNaN(parsedGoal) && parsedGoal >= 0) {
                sunatGoal = parsedGoal;
                updateTaxSummary();
            } else {
                alert('Por favor, ingrese un monto válido.');
            }
        }
    });
}

// Observe tableBodyExpenses for changes to auto-update summary
if (tableBodyExpenses) {
    const expenseObserver = new MutationObserver(() => {
        updateTaxSummary();
    });
    expenseObserver.observe(tableBodyExpenses, { childList: true, subtree: true });
}

// Initial call
document.addEventListener('DOMContentLoaded', () => {
    updateTaxSummary();
});

// ==========================================
// Export Expenses to PDF Logic
// ==========================================
const btnOpenExportExpenses = document.getElementById('btnOpenExportExpenses');
const modalExportExpenses = document.getElementById('exportExpensesModal');
const closeBtnExpExport = document.querySelector('.export-expenses-close');
const btnGenerateExpPDF = document.getElementById('btnGenerateExpPDF');

if (btnOpenExportExpenses) {
    btnOpenExportExpenses.addEventListener('click', () => {
        // Clear inputs and open
        document.getElementById('exportExpStartDate').value = '';
        document.getElementById('exportExpEndDate').value = '';
        modalExportExpenses.style.display = 'block';
    });
}

if (closeBtnExpExport) {
    closeBtnExpExport.addEventListener('click', () => {
        modalExportExpenses.style.display = 'none';
    });
}

if (btnGenerateExpPDF) {
    btnGenerateExpPDF.addEventListener('click', () => {
        const startDateVal = document.getElementById('exportExpStartDate').value;
        const endDateVal = document.getElementById('exportExpEndDate').value;

        if (!startDateVal || !endDateVal) {
            alert('Por favor, selecciona un rango de fechas completo.');
            return;
        }

        const startDate = new Date(startDateVal);
        const endDate = new Date(endDateVal);
        endDate.setHours(23, 59, 59, 999);

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Title and Header
        doc.setFontSize(18);
        doc.text('REPORTE DE EGRESOS - ÓPTICA ROMA', 14, 20);
        doc.setFontSize(11);
        doc.text(`Periodo: ${startDateVal} al ${endDateVal}`, 14, 30);
        doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 14, 35);

        const rowsData = [];
        let totalExpenses = 0;

        const rows = tableBodyExpenses.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.getElementsByTagName('td');
            if (cells.length > 4) {
                const dateText = cells[1].innerText; // dd/mm/yyyy
                const [day, month, year] = dateText.split('/');
                const rowDate = new Date(`${year}-${month}-${day}`);

                if (rowDate >= startDate && rowDate <= endDate) {
                    const id = cells[0].innerText;
                    const category = cells[2].innerText;
                    const description = cells[3].innerText;
                    const amount = cells[4].innerText;
                    
                    rowsData.push([id, dateText, category, description, amount]);
                    totalExpenses += parseFloat(amount.replace('S/. ', '').replace(',', '')) || 0;
                }
            }
        });

        if (rowsData.length === 0) {
            alert('No se encontraron registros en el rango de fechas seleccionado.');
            return;
        }

        // Generate Table
        doc.autoTable({
            startY: 40,
            head: [['ID', 'Fecha', 'Categoría', 'Descripción', 'Monto']],
            body: rowsData,
            theme: 'grid',
            headStyles: { fillColor: [231, 76, 60] }, // Red for Expenses
            styles: { fontSize: 9 }
        });

        // Add Footer with Total
        const finalY = doc.lastAutoTable.finalY || 40;
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(`TOTAL EGRESOS: ${formatCurrency(totalExpenses.toString())}`, 14, finalY + 10);

        // Save
        doc.save(`Reporte_Egresos_${startDateVal}_${endDateVal}.pdf`);
        modalExportExpenses.style.display = 'none';
    });
}

// ==========================================
// FINANCIAL DASHBOARD & SUMMARIES LOGIC
// ==========================================
const NEGOSY_GOAL = 50;

function updateFinancialDashboards() {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // For weekly sales (last 7 days including today)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0,0,0,0);

    let salesToday = 0;
    let salesWeek = 0;

    // 1. Calculate Sales from Clients Table
    if (tableBodyClients) {
        const rows = tableBodyClients.querySelectorAll('tr');
        rows.forEach(row => {
            const dateRawInput = row.querySelector('.raw-date');
            const totalInput = row.querySelector('.raw-total');
            const advanceInput = row.querySelector('.raw-advance');
            
            if (dateRawInput && (totalInput || advanceInput)) {
                const advance = parseFloat(advanceInput?.value) || 0;
                
                // dateRaw is yyyy-mm-dd
                const parts = dateRawInput.value.split('-');
                const rowYear = parseInt(parts[0]);
                const rowMonth = parseInt(parts[1]) - 1;
                const rowDay = parseInt(parts[2]);
                const rowDate = new Date(rowYear, rowMonth, rowDay);
                rowDate.setHours(0,0,0,0);

                // Check if today (strictly comparing year, month, day to avoid TZ issues)
                const isToday = rowYear === today.getFullYear() && 
                                rowMonth === today.getMonth() && 
                                rowDay === today.getDate();

                if (isToday) {
                    salesToday += advance;
                }

                // Check if within week
                if (rowDate >= sevenDaysAgo && rowDate <= today) {
                    salesWeek += advance;
                }
            }
        });
    }

    // 2. Calculate Pending Expenses (SUNAT + NEGOSY)
    let sunatPaid = 0;
    let negosyPaid = 0;

    if (tableBodyExpenses) {
        const rows = tableBodyExpenses.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.getElementsByTagName('td');
            if (cells.length > 2) {
                const category = cells[2].innerText;
                const amountInput = row.querySelector('.raw-amount');
                const amount = amountInput ? parseFloat(amountInput.value) : 0;
                
                if (category === 'SUNAT') sunatPaid += amount;
                else if (category === 'Negosy') negosyPaid += amount;
            }
        });
    }

    const sunatPending = Math.max(0, sunatGoal - sunatPaid);
    const negosyPending = Math.max(0, NEGOSY_GOAL - negosyPaid);
    const totalPending = sunatPending + negosyPending;

    // 3. Update UI Elements
    // Dashboard Cards
    const dashVentasHoy = document.getElementById('dash-ventas-hoy');
    const dashVentasSemana = document.getElementById('dash-ventas-semana');
    const dashGastosPend = document.getElementById('dash-gastos-pend');
    const dashPendSunat = document.getElementById('dash-pend-sunat');
    const dashPendNegosy = document.getElementById('dash-pend-negosy');

    if (dashVentasHoy) dashVentasHoy.innerText = formatCurrency(salesToday.toString());
    if (dashVentasSemana) dashVentasSemana.innerText = formatCurrency(salesWeek.toString());
    if (dashGastosPend) dashGastosPend.innerText = formatCurrency(totalPending.toString());
    if (dashPendSunat) dashPendSunat.innerText = formatCurrency(sunatPending.toString());
    if (dashPendNegosy) dashPendNegosy.innerText = formatCurrency(negosyPending.toString());

    // Clientes Summary
    const clientSalesVal = document.getElementById('client-sales-today');

    if (clientSalesVal) clientSalesVal.innerText = formatCurrency(salesToday.toString());
    
    // Trigger existing SUNAT summary update if we are in that section
    if (typeof updateTaxSummary === 'function') {
        updateTaxSummary();
    }
}

// Observers for real-time updates
if (tableBodyClients) {
    const clientObserver = new MutationObserver(updateFinancialDashboards);
    clientObserver.observe(tableBodyClients, { childList: true, subtree: true });
}

if (tableBodyExpenses) {
    const expensesObserver = new MutationObserver(updateFinancialDashboards);
    expensesObserver.observe(tableBodyExpenses, { childList: true, subtree: true });
}

// Initial update on load
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    updateFinancialDashboards();
    setupSummaryModal();
    setupWeeklySummaryModal();
});

// ==========================================
// DAILY SUMMARY MODAL LOGIC
// ==========================================
function setupSummaryModal() {
    const cardVentasHoy = document.getElementById('card-ventas-hoy');
    const modalSummary = document.getElementById('daySummaryModal');
    const closeBtnSummary = document.querySelector('.summary-close');

    if (cardVentasHoy && modalSummary) {
        cardVentasHoy.addEventListener('click', () => {
            showDaySummary();
            modalSummary.style.display = 'block';
        });
    }

    const btnDownloadDayPDF = document.getElementById('btnDownloadDayPDF');
    if (btnDownloadDayPDF) {
        btnDownloadDayPDF.addEventListener('click', () => {
            exportDaySummaryToPDF();
        });
    }

    if (closeBtnSummary) {
        closeBtnSummary.addEventListener('click', () => {
            modalSummary.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == modalSummary) {
            modalSummary.style.display = 'none';
        }
    });
}

function showDaySummary() {
    const today = new Date();
    today.setHours(0,0,0,0);
    const dateStr = getLocalDateString(); // yyyy-mm-dd
    
    const config = {
        dateDisplayId: 'summaryModalDate',
        salesTbodyId: '#summarySalesTable tbody',
        expensesTbodyId: '#summaryExpensesTable tbody',
        totalInId: 'sum-total-in',
        totalOutId: 'sum-total-out',
        balanceId: 'sum-balance',
        totalVisaId: 'sum-total-visa',
        totalYapeId: 'sum-total-yape',
        totalCashId: 'sum-total-efectivo'
    };

    populateSummaryData(today, dateStr, config);
}

function populateSummaryData(dateObj, dateStr, config) {
    const dateDisplay = dateObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById(config.dateDisplayId).innerText = dateDisplay.charAt(0).toUpperCase() + dateDisplay.slice(1);

    const salesTbody = document.querySelector(config.salesTbodyId);
    const expensesTbody = document.querySelector(config.expensesTbodyId);
    salesTbody.innerHTML = '';
    expensesTbody.innerHTML = '';

    let totalIn = 0;
    let totalOut = 0;
    let totalVisa = 0;
    let totalYape = 0;
    let totalCash = 0;

    // 1. Process Sales (Clients)
    if (tableBodyClients) {
        const rows = tableBodyClients.querySelectorAll('tr');
        rows.forEach(row => {
            const dateInput = row.querySelector('.raw-date');
            if (dateInput && dateInput.value === dateStr) {
                const cells = row.getElementsByTagName('td');
                const id = cells[0].innerText;
                const purchaseDataRaw = row.querySelector('.raw-data')?.value || '';
                const advanceRaw = row.querySelector('.raw-advance');
                const paymentMethod = row.querySelector('.raw-payment-method')?.value || '';
                const amount = advanceRaw ? parseFloat(advanceRaw.value) : 0;
                const status = cells[5].innerHTML; // Get the badge

                let paymentIcon = '';
                const pMethodLower = paymentMethod.toLowerCase();
                if (pMethodLower.includes('efectivo')) {
                    paymentIcon = "<i class='bx bx-money' style='margin-right:5px; color:#27ae60;'></i>";
                    totalCash += amount;
                } else if (pMethodLower.includes('yape') || pMethodLower.includes('plin') || pMethodLower.includes('transferencia')) {
                    paymentIcon = "<i class='bx bx-transfer' style='margin-right:5px; color:#9b59b6;'></i>";
                    totalYape += amount;
                } else if (pMethodLower.includes('tarjeta') || pMethodLower.includes('visa')) {
                    paymentIcon = "<i class='bx bx-credit-card' style='margin-right:5px; color:#2980b9;'></i>";
                    totalVisa += amount;
                }

                totalIn += amount;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="font-weight:600; color:#555;">${id}</td>
                    <td>${formatPurchaseDataForDisplay(purchaseDataRaw)}</td>
                    <td>${status}</td>
                    <td><span style="display:flex; align-items:center; font-size:0.9rem; color:#444;">${paymentIcon} ${paymentMethod}</span></td>
                    <td style="text-align: right; font-weight:700; color:#333;">${formatCurrency(amount.toString())}</td>
                `;
                salesTbody.appendChild(tr);
            }
        });
    }

    // 2. Process Expenses
    if (tableBodyExpenses) {
        const rows = tableBodyExpenses.querySelectorAll('tr');
        rows.forEach(row => {
            const dateInput = row.querySelector('.raw-date');
            if (dateInput && dateInput.value === dateStr) {
                const description = row.getElementsByTagName('td')[3].innerText;
                const amountInput = row.querySelector('.raw-amount');
                const amount = amountInput ? parseFloat(amountInput.value) : 0;

                totalOut += amount;
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid #eee';
                tr.innerHTML = `<td style="padding: 8px;">${description}</td><td style="padding: 8px; text-align: right;">${formatCurrency(amount.toString())}</td>`;
                expensesTbody.appendChild(tr);
            }
        });
    }

    // Handle empty states
    if (salesTbody.innerHTML === '') salesTbody.innerHTML = `<tr><td colspan="5" style="padding: 8px; color: #999; text-align: center;">No hay ingresos este día</td></tr>`;
    if (expensesTbody.innerHTML === '') expensesTbody.innerHTML = `<tr><td colspan="2" style="padding: 8px; color: #999; text-align: center;">No hay egresos este día</td></tr>`;

    // 3. Update Footer
    if (config.totalVisaId) document.getElementById(config.totalVisaId).innerText = formatCurrency(totalVisa.toString());
    if (config.totalYapeId) document.getElementById(config.totalYapeId).innerText = formatCurrency(totalYape.toString());
    if (config.totalCashId) document.getElementById(config.totalCashId).innerText = formatCurrency(totalCash.toString());

    document.getElementById(config.totalInId).innerText = formatCurrency(totalIn.toString());
    document.getElementById(config.totalOutId).innerText = formatCurrency(totalOut.toString());
    const balance = totalIn - totalOut;
    const balanceEl = document.getElementById(config.balanceId);
    balanceEl.innerText = formatCurrency(balance.toString());
    balanceEl.style.color = balance >= 0 ? 'var(--green-card)' : 'var(--red-card)';
}

// ==========================================
// WEEKLY SUMMARY MODAL LOGIC
// ==========================================
let currentWeeklyDate = new Date();

function setupWeeklySummaryModal() {
    const cardVentasSemana = document.getElementById('card-ventas-semana');
    const modalWeekly = document.getElementById('weeklySummaryModal');
    const closeBtnWeekly = document.querySelector('.weekly-close');
    const tabsContainer = document.getElementById('weeklyDayTabs');

    if (cardVentasSemana && modalWeekly) {
        cardVentasSemana.addEventListener('click', () => {
            generateWeeklyTabs();
            // Show today by default
            const today = new Date();
            today.setHours(0,0,0,0);
            selectWeeklyDay(today);
            modalWeekly.style.display = 'block';
        });
    }

    if (closeBtnWeekly) {
        closeBtnWeekly.addEventListener('click', () => {
            modalWeekly.style.display = 'none';
        });
    }

    const btnDownloadWeeklyPDF = document.getElementById('btnDownloadWeeklyPDF');
    if (btnDownloadWeeklyPDF) {
        btnDownloadWeeklyPDF.addEventListener('click', () => {
            exportSpecificDayToPDF(currentWeeklyDate);
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == modalWeekly) {
            modalWeekly.style.display = 'none';
        }
    });

    function generateWeeklyTabs() {
        tabsContainer.innerHTML = '';
        const today = new Date();
        today.setHours(0,0,0,0);

        // Generate tabs from past to today (6 days ago -> Today)
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            
            // Skip Sunday
            if (d.getDay() === 0) continue;

            const btn = document.createElement('button');
            const isToday = (i === 0);
            
            btn.className = 'tab-btn';
            if (isToday) {
                btn.classList.add('active');
                currentWeeklyDate = d;
                selectWeeklyDay(d);
            }
            
            const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
            const dayNum = d.getDate();
            btn.innerHTML = `<b>${dayName.toUpperCase()}</b> ${dayNum}`;
            
            btn.addEventListener('click', () => {
                const allTabs = tabsContainer.querySelectorAll('.tab-btn');
                allTabs.forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                
                selectWeeklyDay(d);
            });
            
            tabsContainer.appendChild(btn);
        }
    }

    function selectWeeklyDay(dateObj) {
        currentWeeklyDate = new Date(dateObj);
        const y = dateObj.getFullYear();
        const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        const dateStr = `${y}-${m}-${day}`;

        const config = {
            dateDisplayId: 'weeklyModalDateDisplay',
            salesTbodyId: '#weeklySalesTable tbody',
            expensesTbodyId: '#weeklyExpensesTable tbody',
            totalInId: 'weekly-sum-total-in',
            totalOutId: 'weekly-sum-total-out',
            balanceId: 'weekly-sum-balance',
            totalVisaId: 'weekly-sum-total-visa',
            totalYapeId: 'weekly-sum-total-yape',
            totalCashId: 'weekly-sum-total-efectivo'
        };

        populateSummaryData(dateObj, dateStr, config);
    }
}

function exportSpecificDayToPDF(dateObj, config) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Default to weekly if no config provided
    const cfg = config || {
        salesTbodyId: '#weeklySalesTable tbody',
        expensesTbodyId: '#weeklyExpensesTable tbody',
        totalInId: 'weekly-sum-total-in',
        totalOutId: 'weekly-sum-total-out',
        balanceId: 'weekly-sum-balance'
    };
    
    const y = dateObj.getFullYear();
    const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const d = dateObj.getDate().toString().padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    const dateDisplay = dateObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedDate = dateDisplay.charAt(0).toUpperCase() + dateDisplay.slice(1);

    // Header
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Resumen Financiero Diario', 14, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${formattedDate}`, 14, 30);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 38);

    // Sales Table
    doc.setFontSize(14);
    doc.setTextColor(0, 128, 0); // Green
    doc.text('INGRESOS (VENTAS)', 14, 50);

    const salesRows = [];
    const salesTableRows = document.querySelectorAll(`${cfg.salesTbodyId} tr`);
    salesTableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            salesRows.push([
                cells[0].innerText,
                cells[1].innerText,
                cells[2].innerText,
                cells[3].innerText,
                cells[4].innerText
            ]);
        }
    });

    if (salesRows.length > 0 && !salesRows[0][0].includes('No hay')) {
        doc.autoTable({
            startY: 55,
            head: [['Cod', 'Vendido', 'Estado', 'Mod', 'Monto']],
            body: salesRows,
            theme: 'striped',
            headStyles: { fillColor: [46, 204, 113] }
        });
    } else {
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('No hay ingresos este día.', 14, 55);
    }

    // Expenses Table
    let currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 70;
    doc.setFontSize(14);
    doc.setTextColor(231, 76, 60); // Red
    doc.text('EGRESOS (GASTOS)', 14, currentY);

    const expensesRows = [];
    const expensesTableRows = document.querySelectorAll(`${cfg.expensesTbodyId} tr`);
    expensesTableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
            expensesRows.push([
                cells[0].innerText,
                cells[1].innerText
            ]);
        }
    });

    if (expensesRows.length > 0 && !expensesRows[0][0].includes('No hay')) {
        doc.autoTable({
            startY: currentY + 5,
            head: [['Descripción', 'Monto']],
            body: expensesRows,
            theme: 'striped',
            headStyles: { fillColor: [231, 76, 60] }
        });
    } else {
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('No hay egresos este día.', 14, currentY + 5);
        doc.lastAutoTable = { finalY: currentY + 5 };
    }

    // Summary Footer
    currentY = doc.lastAutoTable.finalY + 20;
    
    // Draw box for balance
    doc.setDrawColor(200);
    doc.setFillColor(249, 249, 249);
    doc.rect(14, currentY, 182, 35, 'F');
    doc.rect(14, currentY, 182, 35, 'S');

    doc.setFontSize(12);
    doc.setTextColor(40);
    
    const totalIn = document.getElementById(cfg.totalInId).innerText;
    const totalOut = document.getElementById(cfg.totalOutId).innerText;
    const balance = document.getElementById(cfg.balanceId).innerText;

    doc.text(`Total Ingresos:`, 20, currentY + 12);
    doc.setTextColor(0, 128, 0);
    doc.text(totalIn, 100, currentY + 12, { align: 'right' });

    doc.setTextColor(40);
    doc.text(`Total Egresos:`, 20, currentY + 19);
    doc.setTextColor(231, 76, 60);
    doc.text(totalOut, 100, currentY + 19, { align: 'right' });

    doc.setDrawColor(220);
    doc.line(20, currentY + 23, 190, currentY + 23);

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(40);
    doc.text(`Balance Neto:`, 20, currentY + 30);
    doc.text(balance, 100, currentY + 30, { align: 'right' });

    doc.save(`Resumen_Diario_${dateStr}.pdf`);
}

function exportDaySummaryToPDF() {
    const dailyConfig = {
        salesTbodyId: '#summarySalesTable tbody',
        expensesTbodyId: '#summaryExpensesTable tbody',
        totalInId: 'sum-total-in',
        totalOutId: 'sum-total-out',
        balanceId: 'sum-balance'
    };
    exportSpecificDayToPDF(new Date(), dailyConfig);
}

// ==========================================
// EXPORT LUNAS & MONTURAS PDF LOGIC
// ==========================================

function setupExportLunas() {
    const btnOpen = document.getElementById('btnOpenExportLunas');
    const modal = document.getElementById('exportLunasModal');
    const btnGenerate = document.getElementById('btnGenerateLunasPDF');
    const closeBtn = document.querySelector('.export-lunas-close');

    if (btnOpen && modal) {
        btnOpen.addEventListener('click', () => {
            document.getElementById('exportLunasStartDate').value = getLocalDateString();
            document.getElementById('exportLunasEndDate').value = getLocalDateString();
            modal.style.display = 'block';
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.style.display = 'none');
        }

        if (btnGenerate) {
            btnGenerate.addEventListener('click', () => {
                const start = document.getElementById('exportLunasStartDate').value;
                const end = document.getElementById('exportLunasEndDate').value;
                generateLunasPDF(start, end);
                modal.style.display = 'none';
            });
        }
    }
}

function setupExportMonturas() {
    const btnOpen = document.getElementById('btnOpenExportMonturas');
    const modal = document.getElementById('exportMonturasModal');
    const btnGenerate = document.getElementById('btnGenerateMonturasPDF');
    const closeBtn = document.querySelector('.export-monturas-close');

    if (btnOpen && modal) {
        btnOpen.addEventListener('click', () => {
            document.getElementById('exportMonturasStartDate').value = getLocalDateString();
            document.getElementById('exportMonturasEndDate').value = getLocalDateString();
            modal.style.display = 'block';
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.style.display = 'none');
        }

        if (btnGenerate) {
            btnGenerate.addEventListener('click', () => {
                const start = document.getElementById('exportMonturasStartDate').value;
                const end = document.getElementById('exportMonturasEndDate').value;
                generateMonturasPDF(start, end);
                modal.style.display = 'none';
            });
        }
    }
}

function generateLunasPDF(startDate, endDate) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);

    doc.setFontSize(18);
    doc.text('Reporte de Lunas', 14, 20);
    doc.setFontSize(11);
    doc.text(`Rango: ${startDate} al ${endDate}`, 14, 28);

    const rows = [];
    const lunasTableRows = document.querySelectorAll('#lunasTable tbody tr');
    
    lunasTableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 7) {
            const rowDateRaw = cells[6].innerText;
            const rowDate = new Date(rowDateRaw);
            if (!isNaN(rowDate) && rowDate >= start && rowDate <= end) {
                rows.push([
                    cells[0].innerText,
                    cells[1].innerText,
                    cells[2].innerText,
                    cells[3].innerText,
                    cells[4].innerText,
                    cells[5].innerText,
                    rowDateRaw
                ]);
            }
        }
    });

    if (rows.length > 0) {
        doc.autoTable({
            startY: 35,
            head: [['Cod', 'Nombre', 'Lab', 'Medida', 'Costo', 'Venta', 'Fecha']],
            body: rows,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] }
        });
    } else {
        doc.text('No se encontraron registros en el rango seleccionado.', 14, 40);
    }

    doc.save(`Reporte_Lunas_${startDate}_${endDate}.pdf`);
}

function generateMonturasPDF(startDate, endDate) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);

    doc.setFontSize(18);
    doc.text('Reporte de Ventas de Monturas', 14, 20);
    doc.setFontSize(11);
    doc.text(`Rango: ${startDate} al ${endDate}`, 14, 28);
    doc.text('Este reporte muestra las monturas vendidas según el historial de clientes.', 14, 34);

    const rows = [];
    const clientRows = document.querySelectorAll('#clientsTable tbody tr');
    
    clientRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rawDateField = row.querySelector('.raw-date');
        const rawDataField = row.querySelector('.raw-data');
        
        if (rawDateField && rawDataField) {
            const rowDate = new Date(rawDateField.value);
            if (!isNaN(rowDate) && rowDate >= start && rowDate <= end) {
                const dataString = rawDataField.value;
                if (dataString && dataString !== 'Consulta') {
                    let monturaSold = '';
                    
                    if (dataString.includes('|')) {
                        const parts = dataString.split('|').map(p => p.trim());
                        monturaSold = parts[2] || '';
                    } else {
                        // Compatibility for old format
                        const parts = dataString.split(' , ').map(p => p.trim());
                        if (parts.length >= 3) {
                            monturaSold = parts[2];
                        } else if (parts.length === 1 && !parts[0].toLowerCase().includes('luna')) {
                            monturaSold = parts[0];
                        }
                    }

                    if (monturaSold) {
                        rows.push([
                            rawDateField.value,
                            cells[1].innerText, // Client Name
                            monturaSold,
                            cells[7].innerText  // Total Sales (Monto)
                        ]);
                    }
                }
            }
        }
    });

    if (rows.length > 0) {
        doc.autoTable({
            startY: 40,
            head: [['Fecha', 'Cliente', 'Modelo Montura', 'Monto Venta']],
            body: rows,
            theme: 'striped',
            headStyles: { fillColor: [231, 76, 60] }
        });
    } else {
        doc.text('No se encontraron ventas de monturas en el rango seleccionado.', 14, 45);
    }

    doc.save(`Reporte_Ventas_Monturas_${startDate}_${endDate}.pdf`);
}

// Call setups
window.addEventListener('DOMContentLoaded', () => {
    setupExportLunas();
    setupExportMonturas();
});

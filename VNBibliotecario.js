document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const addFolderBtn = document.getElementById('addFolderBtn');
    const folderModal = document.getElementById('folderModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const createFolderBtn = document.getElementById('createFolderBtn');
    const folderNameInput = document.getElementById('folderNameInput');
    const foldersContainer = document.getElementById('foldersContainer');
    const folderContentView = document.getElementById('folderContentView');
    const backToFoldersBtn = document.getElementById('backToFoldersBtn');
    const currentFolderName = document.getElementById('currentFolderName');
    const folderItemsContainer = document.getElementById('folderItemsContainer');
    // Datos de las carpetas (se cargan desde localStorage)
    let folders = JSON.parse(localStorage.getItem('verificanews_folders')) || [];
    let currentOpenFolder = null;
    // Inicialización - renderizar carpetas existentes
    renderFolders();
    // Event Listeners
    addFolderBtn.addEventListener('click', openFolderModal);
    closeModalBtn.addEventListener('click', closeFolderModal);
    createFolderBtn.addEventListener('click', createFolder);
    backToFoldersBtn.addEventListener('click', closeFolderView);
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === folderModal) {
            closeFolderModal();
        }
    });
    // Funciones
    function openFolderModal() {
        folderModal.style.display = 'flex';
        folderNameInput.focus();
    }
    function closeFolderModal() {
        folderModal.style.display = 'none';
        folderNameInput.value = '';
    }
    if (window.location.pathname.includes('VNHistorial.html')) {
        loadFolderHistory();
    }
    function createFolder() {
        const folderName = folderNameInput.value.trim();
        
        if (!folderName) {
            alert('Por favor ingresa un nombre para la carpeta');
            return;
        }
        
        const newFolder = {
            id: Date.now().toString(),
            name: folderName,
            items: [],
            createdAt: new Date().toISOString()
        };
        
        folders.push(newFolder);
        saveFolders();
        renderFolders();
        closeFolderModal();
    }
    function renderFolders() {
        foldersContainer.innerHTML = '';
    
        if (folders.length === 0) {
            foldersContainer.innerHTML = '<p class="empty-message">No hay carpetas creadas</p>';
            return;
        }
        folders.forEach(folder => {
            const folderElement = document.createElement('div');
            folderElement.className = 'folder-item';
            folderElement.dataset.id = folder.id;
            folderElement.innerHTML = `
                <img src="add_folder_icon.png" alt="Carpeta" class="folder-icon">
                <span class="folder-name">${folder.name}</span>
            `;
        
            folderElement.addEventListener('click', () => openFolder(folder.id));
        
            foldersContainer.appendChild(folderElement);
        });
    }
    function openFolder(folderId) {
        currentOpenFolder = folderId; // Guardar la carpeta seleccionada
    
        const folder = folders.find(f => f.id === folderId);
        if (!folder) {
            alert("Carpeta no encontrada");
            return;
        }
        // Renderizar contenido de la carpeta
        renderFolderItems(folder);
        
        // Mostrar la vista de carpeta
        folderContentView.style.display = 'block';
        setupFolderOptions(folderId);
    }
    
    function renderFolderItems(folder) {
        folderItemsContainer.innerHTML = '';
        
        if (folder.items.length === 0) {
            folderItemsContainer.innerHTML = '<p class="empty-folder-message">Esta carpeta está vacía</p>';
            return;
        }
        
        // Aquí puedes renderizar los elementos de la carpeta
        folder.items.forEach(item => {
            // Implementa según el tipo de contenido que tendrán las carpetas
            const itemElement = document.createElement('div');
            itemElement.className = 'folder-item';
            itemElement.textContent = item.name || 'Elemento de carpeta';
            folderItemsContainer.appendChild(itemElement);
        });
    }
    
    function closeFolderView() {
        folderContentView.style.display = 'none';
        currentOpenFolder = null;
    }
    
    function saveFolders() {
        localStorage.setItem('verificanews_folders', JSON.stringify(folders));
    }

    function setupFolderOptions(folderId) {
        const optionsButton = document.querySelector('.options-button');
        const optionsMenu = document.querySelector('.options-menu');
    
        // Mostrar/ocultar menú
        optionsButton.addEventListener('click', function(e) {
            e.stopPropagation();
            optionsMenu.classList.toggle('show');
        });
    
        // Ver historial
        document.querySelector('.view-history').addEventListener('click', function() {
            optionsMenu.classList.remove('show');
            viewFolderHistory(folderId);
        });
    
        // Eliminar carpeta
        document.querySelector('.delete').addEventListener('click', function(e) {
            e.stopPropagation();
            deleteFolder(folderId);
        });
    
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function() {
            optionsMenu.classList.remove('show');
        });
    }

    // Función para ver historial (actualizada)
    function viewFolderHistory(folderId) {
        const folder = folders.find(f => f.id === folderId);
    
        // Guardar el ID de la carpeta en localStorage para usarlo en VNHistorial.html
        localStorage.setItem('currentFolderId', folderId);
        localStorage.setItem('currentFolderName', folder.name);
    
        // Redirigir a la página de historial
        window.location.href = 'VNHistorial.html';
    }

    // Función para cargar el historial (añadir al inicio del archivo)
    function loadFolderHistory() {
        const folderId = localStorage.getItem('currentFolderId');
        const folderName = localStorage.getItem('currentFolderName');
    
        if (folderId && folderName) {
            // Aquí puedes cargar el historial específico de la carpeta
            console.log(`Cargando historial de la carpeta: ${folderName}`);
        
            // Ejemplo: Mostrar el nombre de la carpeta en el historial
            document.getElementById('historial-title').textContent = `Historial: ${folderName}`;
        
            // Limpiar después de usar
            localStorage.removeItem('currentFolderId');
            localStorage.removeItem('currentFolderName');
        }
    }

    function deleteFolder(folderId) {
        // Validación del ID
        if (!folderId) {
            console.error("Error: No se proporcionó ID de carpeta");
            return;
        }

        // Buscar la carpeta específica
        const folderIndex = folders.findIndex(folder => folder.id === folderId);
    
        if (folderIndex === -1) {
            alert("Error: No se encontró la carpeta a eliminar");
            return;
        }

        const folderName = folders[folderIndex].name;
    
        // Confirmación explícita
        if (!confirm(`¿Estás seguro de eliminar la carpeta "${folderName}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        // Eliminar solo la carpeta seleccionada
        folders = folders.filter((folder, index) => {
            if (folder.id === folderId) {
                console.log(`Eliminando carpeta: ${folder.name} (ID: ${folder.id})`);
                return false; // Excluir solo esta carpeta
            }
            return true; // Mantener todas las demás
        });

        // Verificación después de eliminar
        const wasDeleted = !folders.some(f => f.id === folderId);
        if (!wasDeleted) {
            alert("Error: La carpeta no fue eliminada correctamente");
            return;
        }

        // Actualizar almacenamiento y UI
        saveFolders();
    
        if (currentOpenFolder === folderId) {
            closeFolderView();
        }
    
        renderFolders();
        showNotification(`Carpeta "${folderName}" eliminada correctamente`);
    }

    // Función auxiliar para obtener nombre de carpeta
    function getFolderName(folderId) {
        const folder = folders.find(f => f.id === folderId);
        return folder ? folder.name : 'Carpeta desconocida';
    }

    // Función para mostrar notificaciones
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
    
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }





});
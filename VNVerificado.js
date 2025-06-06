document.addEventListener('DOMContentLoaded', () => {
    const clipIcon = document.getElementById('clipIcon');
    const imageUpload = document.getElementById('imageUpload');
    const imageDropArea = document.getElementById('imageDropArea');
    const urlInput = document.getElementById('urlInput');
    const clearUrlButton = document.getElementById('clearUrlButton'); // Nuevo: el botón de borrado de URL

    // Función de validación de URL simple
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Función para añadir una imagen al imageDropArea
    const addImageToDropArea = (src) => {
        const imgContainer = document.createElement('div');
        imgContainer.style.position = 'relative';
        imgContainer.style.display = 'inline-block';
        imgContainer.style.margin = '5px';
        imgContainer.classList.add('image-item');

        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';

        const deleteButton = document.createElement('span');
        deleteButton.innerHTML = '&#x2716;';
        deleteButton.style.position = 'absolute';
        deleteButton.style.top = '5px';
        deleteButton.style.right = '5px';
        deleteButton.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        deleteButton.style.color = 'white';
        deleteButton.style.borderRadius = '50%';
        deleteButton.style.width = '20px';
        deleteButton.style.height = '20px';
        deleteButton.style.display = 'flex';
        deleteButton.style.justifyContent = 'center';
        deleteButton.style.alignItems = 'center';
        deleteButton.style.fontSize = '12px';
        deleteButton.style.fontWeight = 'bold';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.zIndex = '10';

        deleteButton.addEventListener('click', () => {
            imgContainer.remove();
        });

        imgContainer.appendChild(img);
        imgContainer.appendChild(deleteButton);
        imageDropArea.appendChild(imgContainer);

        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(imageDropArea);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    };

    // 1. Manejar clic en el icono del clip para abrir el selector de archivos
    if (clipIcon && imageUpload) {
        clipIcon.addEventListener('click', () => {
            imageUpload.click();
        });

        imageUpload.addEventListener('change', (event) => {
            const files = event.target.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        addImageToDropArea(e.target.result);
                        imageUpload.value = '';
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Por favor, selecciona un archivo de imagen.');
                }
            }
        });
    }

    // 2. Bloquear la inserción de texto en imageDropArea y manejar pegado de imágenes
    if (imageDropArea) {
        imageDropArea.addEventListener('beforeinput', (event) => {
            if (event.inputType === 'insertText') {
                event.preventDefault();
            }
        });

        imageDropArea.addEventListener('paste', (event) => {
            event.preventDefault();

            const clipboardData = event.clipboardData || window.clipboardData;
            if (!clipboardData) return;

            let imagePasted = false;

            for (let i = 0; i < clipboardData.items.length; i++) {
                const item = clipboardData.items[i];

                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            addImageToDropArea(e.target.result);
                        };
                        reader.readAsDataURL(file);
                        imagePasted = true;
                    }
                }
            }
        });

        imageDropArea.addEventListener('dragover', (event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
            imageDropArea.style.borderColor = 'rgb(35, 166, 150)';
        });

        imageDropArea.addEventListener('dragleave', (event) => {
            imageDropArea.style.borderColor = '#ccc';
        });

        imageDropArea.addEventListener('drop', (event) => {
            event.preventDefault();
            imageDropArea.style.borderColor = '#ccc';

            const files = event.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        addImageToDropArea(e.target.result);
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Solo se admiten imágenes para arrastrar y soltar en esta área.');
                }
            }
        });
    }

    // 3. Validar el campo de URL y controlar la visibilidad del botón de borrado
    if (urlInput && clearUrlButton) {
        const updateUrlInputState = () => {
            const isUrlValid = isValidUrl(urlInput.value);
            const hasText = urlInput.value.length > 0;

            // Actualizar borde según validez
            urlInput.classList.remove('valid-url', 'invalid-url');
            if (hasText) {
                if (isUrlValid) {
                    urlInput.classList.add('valid-url');
                } else {
                    urlInput.classList.add('invalid-url');
                }
            }

            // Mostrar/ocultar botón de borrado
            if (hasText) {
                clearUrlButton.style.visibility = 'visible';
                clearUrlButton.style.opacity = '1';
            } else {
                clearUrlButton.style.visibility = 'hidden';
                clearUrlButton.style.opacity = '0';
            }
        };

        // Escuchar cambios en el input
        urlInput.addEventListener('input', updateUrlInputState);

        // También actualizar el estado al cargar la página por si hay un valor inicial
        updateUrlInputState();

        // Manejar clic en el botón de borrado de URL
        clearUrlButton.addEventListener('click', () => {
            urlInput.value = ''; // Vaciar el input
            updateUrlInputState(); // Actualizar el estado (ocultará la 'X' y reseteará el borde)
            urlInput.focus(); // Opcional: devolver el foco al input
        });
    }
});
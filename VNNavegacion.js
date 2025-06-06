//Sistema de navegación para VerificaNews
document.addEventListener('DOMContentLoaded', () => {
    //Mapeo de elementos del menú con sus archivos correspondientes
    const navigationMap = {
        'Inicio': 'VNPaginaPrincipal.html',
        'Tutorial de uso': 'VNTutorial.html',
        'Contenido Educativo Fake NEWS': 'VNContenido.html',
        'Bliblioteca': 'VNBiblioteca.html',
        'Historial': 'VNHistorial.html',
        'Configuración': 'VNConfiguracion.html',
        'Cerrar Sesion': 'VNInicioSesion.html' // Redirige al login
    };
    // Función para manejar la navegación
    function handleNavigation(text, element) {
        const targetPage = navigationMap[text];
        if (targetPage) {
            // Agregar efecto visual de clic
            element.style.backgroundColor = '#1a9685';
            element.style.transform = 'scale(0.98)';
            // Pequeño delay para mostrar el efecto visual
            setTimeout(() => {
                window.location.href = targetPage;
            }, 150);
        }
    }
    // Agregar eventos de clic a todos los elementos del menú
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        // Solo agregar evento si no es un divider
        if (!item.classList.contains('divider')) {
            const textElement = item.querySelector('.item-text');
            if (textElement) {
                const text = textElement.textContent.trim();
                // Hacer el elemento clickeable
                item.style.cursor = 'pointer';
                // Agregar evento de clic
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    handleNavigation(text, item);
                });
                // Mejorar el efecto hover
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'translateX(5px)';
                    item.style.transition = 'all 0.3s ease';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'translateX(0)';
                });
            }
        }
    });
    // Función especial para el logo (redirige a página principal)
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            window.location.href = 'VNPaginaPrincipal.html';
        });
    }
    // Resaltar la página actual en el menú
    function highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop();
        const pageToMenuMap = {
            'VNPaginaPrincipal.html': 'Inicio',
            'VNTutorial.html': 'Tutorial de uso',
            'VNContenido.html': 'Contenido Educativo Fake NEWS',
            'VNBiblioteca.html': 'Bliblioteca',
            'VNHistorial.html': 'Historial',
            'VNConfiguracion.html': 'Configuración',
        };
        const currentMenuItem = pageToMenuMap[currentPage];
        if (currentMenuItem) {
            menuItems.forEach(item => {
                const textElement = item.querySelector('.item-text');
                if (textElement && textElement.textContent.trim() === currentMenuItem) {
                    item.style.backgroundColor = '#e8f4fc';
                    textElement.style.color = 'rgb(35, 166, 150)';
                    textElement.style.fontWeight = 'bold';
                }
            });
        }
    }
    // Aplicar resaltado de página actual
    highlightCurrentPage();
});
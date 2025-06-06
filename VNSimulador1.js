document.addEventListener('DOMContentLoaded', () => {
    //Inicializar usuarios si no existen
    if (!localStorage.getItem('registeredUsers')) {
        localStorage.setItem('registeredUsers', JSON.stringify([
            { email: "usuario@example.com", password: "123456" },
            { email: "admin@example.com", password: "admin123" }
        ]));
    }
    //Muestra Errores
    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => { element.style.display = 'none'; }, 3000);
    }
    //Login Usuario
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const errorMessage = document.getElementById('error-message');
            const users = JSON.parse(localStorage.getItem('registeredUsers'));
            if (!email || !password) {
                showError(errorMessage, "Todos los campos son obligatorios");
                return;
            }
            const userExists = users.some(user => user.email === email && user.password === password);
            if (userExists) {
                window.location.href = "VNPaginaPrincipal.html";
            } else {
                showError(errorMessage, "Correo o contraseña incorrectos");
            }
        });
    }
    //Registro del Usuario
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newEmail = document.getElementById('newEmail').value.trim();
            const newPassword = document.getElementById('newPassword').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            const birthDate = document.getElementById('birthDate').value;
            const registerError = document.getElementById('register-error');
            let users = JSON.parse(localStorage.getItem('registeredUsers'));
            if (!newEmail || !newPassword || !birthDate || !confirmPassword) {
                showError(registerError, "Todos los campos son obligatorios");
                return;
            }
            if (newPassword !== confirmPassword) {
                showError(registerError, 'Las contraseñas no coinciden');
            }
            if (users.some(user => user.email === newEmail)) {
                showError(registerError, "Este correo ya está registrado");
            } else {
                users.push({ 
                    email: newEmail,
                    password: newPassword,
                    birthDate: birthDate
                });
                localStorage.setItem('registeredUsers', JSON.stringify(users));
                alert("¡Registro exitoso! Redirigiendo...");
                window.location.href = "VNInicioSesion.html";
            }
        });
    }
});
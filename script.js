document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('mainform');
    const email = document.getElementById('email');
    const senha = document.getElementById('password');
    const registrar = document.querySelector('.btn-register'); // Use querySelector para selecionar um único elemento

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (checkInputs()) {
            login();
        }
    });

    registrar.addEventListener('click', function (e) { // Adicione um evento de clique ao botão de registro
        e.preventDefault(); // Evite o comportamento padrão de envio do formulário
        register(); // Chame a função de registro
    });

    email.addEventListener('input', () => {
        validateField(email, isEmail(email.value.trim()), 'Email não é válido!');
    });

    senha.addEventListener('input', () => {
        validateField(senha, senha.value.trim().length >= 8, 'Senha tem que ter mais de 8 caracteres!');
    });

    function checkInputs() {
        let isValid = true;
        validateField(email, isEmail(email.value.trim()), 'Email não é válido!');
        validateField(senha, senha.value.trim().length >= 8, 'Senha tem que ter mais de 8 caracteres!');

        document.querySelectorAll('.custome-input').forEach((control) => {
            if (control.classList.contains('error')) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateField(input, condition, errorMessage) {
        if (condition) {
            setSuccess(input);
        } else {
            setError(input, errorMessage);
        }
    }

    function setError(input, message) {
        const formControl = input.parentElement;
        const icon = formControl.querySelector('.icon');
        formControl.classList.remove('success');
        formControl.classList.add('error');
        icon.innerHTML = '<i class="fas fa-times-circle"></i>';
        input.placeholder = message;
    }

    function setSuccess(input) {
        const formControl = input.parentElement;
        const icon = formControl.querySelector('.icon');
        formControl.classList.remove('error');
        formControl.classList.add('success');
        icon.innerHTML = '<i class="fas fa-check-circle"></i>';
    }

    function isEmail(email) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
    }

    function showModal() {
        if (checkInputs()) {
            const modal = document.getElementById('successModal');
            modal.style.display = 'block';
    
            setTimeout(() => {
                modal.style.display = 'none';
                window.location.href = "./kanban-main/site_tigas/index.html";
            }, 3000); // Aguarda 3 segundos antes de redirecionar para a próxima página
        }
    }

    function login() {
        showLoading();
        firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(response => {

            showModal();

        }).catch(error => {
            hideLoading();
            alert(getErrorMessage(error));

        });

        //
    }

    function register() {
        //window.location.href = "./registrar/register.html";
        showLoading();
    }

    function getErrorMessage(error) {
        switch (error.code) {
            case "auth/user-not-found":
                return "Usuário não encontrado";
            case "auth/invalid-credential":
                return "Credencial inválida";
            default:
                return error.message;
        }
    }
});
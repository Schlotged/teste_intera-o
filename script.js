document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('mainform');
    const email = document.getElementById('email');
    const senha = document.getElementById('password');
    const registrar = document.querySelector('.btn-register'); // Use querySelector para selecionar um único elemento
    const reset = document.getElementById('reset-password'); // Use querySelector para selecionar um único elemento

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

    reset.addEventListener('click', () => {
        // Verificar se o campo de email está vazio
        if (email.value.trim() === '') {
            alert('Por favor, insira seu endereço de email.');
            return; // Encerrar a função se o campo estiver vazio
        }
        recoverPassword();
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
                window.location.href = "./kanban-main/site/index.html";
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
    }

    function register() {
        //
        showLoading();
        window.location.href = "./registrar/register.html";
    }
    

    function getErrorMessage(error) {
        if (error.code == "auth/user-not-found") {
            return "Usuário não encontrado";
        }
        if (error.code ==  "auth/invalid-credential") {
            return "Credencial inválida";
        }
        if (error.code ==  "auth/wrong-password") {
            return "Senha invalida";
        }
        if (error.code == "auth/email-already-in-use"){
            return "Usuário já esta em uso."
        }

        return error.message;
    }

    function recoverPassword () {
        showLoading();
        firebase.auth().sendPasswordResetEmail(email.value.trim()).then(() => {
            hideLoading();
            alert('Email enviado com sucesso')
        }).catch(error => {
            hideLoading();
            alert(getErrorMessage(error));
        });
    }

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            window.location.href = "./kanban-main/site/home.html"
        }
    })

});
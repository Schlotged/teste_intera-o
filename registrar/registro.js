document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('mainform');
    const email = document.getElementById('email');
    const senha = document.getElementById('password');
    const confirmeSenha = document.getElementById("confirm-password");
    const registerButton = document.getElementById("register-button");
    const loginButton = document.getElementById("login-button");

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (checkInputs()) {
            //alert('Sucesso');
            toggleRegisterButtonDisable();

        } else {
           if ( senha, senha.value.trim().length >= 8) {
                alert('Senhas nao coincidem')
           }
            
        }
    });

    registerButton.addEventListener('click', () => {
        register();
    })

    email.addEventListener('input', () => {
        validateField(email, isEmail(email.value.trim()), 'Email não é válido!');
        toggleRegisterButtonDisable();
    });

    senha.addEventListener('input', () => {
        validateField(senha, senha.value.trim().length >= 8, 'Senha tem que ter mais de 8 caracteres!');
        toggleRegisterButtonDisable();
    });

    confirmeSenha.addEventListener('input', () => {
        if (senha.value.trim() !== '') {
            validateField(confirmeSenha, confirmeSenha.value === senha.value, 'As senhas não coincidem!');
            toggleRegisterButtonDisable();
        }
    });

    function checkInputs() {
        let isValid = true;
        validateField(email, isEmail(email.value.trim()), 'Email não é válido!');
        validateField(senha, senha.value.trim().length >= 8, 'Senha tem que ter mais de 8 caracteres!');
        validateField(confirmeSenha, confirmeSenha.value.trim().length >= 8, 'Senha tem que ter mais de 8 caracteres!');
        validateField(confirmeSenha, confirmeSenha.value === senha.value, 'As senhas não coincidem!');

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

    function toggleRegisterButtonDisable() {
        registerButton.disabled = !isFormValid();
        loginButton.disabled = !isFormValid();
    }

    function isFormValid () {
        const e_mail = email.value.trim();
        if (!email || !e_mail) {
            return false;
        }
        const s_enha = senha.value.trim();
        if (!senha || s_enha.length < 8) { // Ajuste: a condição deve ser s_enha.length < 8
            return false;
        }
    
        const confirme_password = confirmeSenha.value.trim();
        if (s_enha !== confirme_password ) { // Ajuste: a condição deve ser s_enha !== confirme_password
            return false;
        }
    
        return true;
    }

    function register() {
        showLoading();
        const emaill = email.value;
        const password = senha.value;
        firebase.auth().createUserWithEmailAndPassword(
        emaill, password
        ).then( () => {
            hideLoading;
            window.location.href = '../kanban-main/site/index.html'
        }).catch(error => {
            hideLoading;
            alert(getErrorMessage(error));
        })
    }

    function getErrorMessage (error) {
        if (error.code == "auth/email-already-in-use"){
            return "Usuário já esta em uso."
        }
        
        return error.message;
    }

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            window.location.href = "./kanban-main/site/index.html"
        }
    })

});
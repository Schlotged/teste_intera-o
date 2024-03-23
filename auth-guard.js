firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        // Se o usuário não estiver autenticado
        if (window.location.pathname.includes('index.html')) {
            // Se o usuário estiver na página inicial

            window.location.href = "../../auth-guard.js";
        } else {
            // Se o usuário estiver em qualquer outra página

            window.location.href = "../../index.html";
        }
    }
});
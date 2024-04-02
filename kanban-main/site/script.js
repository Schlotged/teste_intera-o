
const cards = document.querySelectorAll('.card')
const dropzones = document.querySelectorAll('.dropzone')

// Adiciona ouvintes de eventos para os campos do formulário
document.getElementById('title_card').addEventListener('input', toggleSaveButton);
document.getElementById('text-new-card').addEventListener('input', toggleSaveButton);
document.getElementById('data-new-card').addEventListener('input', toggleSaveButton);
document.getElementById('avisos-new-card').addEventListener('input', toggleSaveButton);

// Função para alternar a habilitação do botão de salvar
function toggleSaveButton() {
    const title = document.getElementById('title_card').value.trim();
    const texto = document.getElementById('text-new-card').value.trim();
    const date = document.getElementById('data-new-card').value.trim();
    const aviso = document.getElementById('avisos-new-card').value;

    const buttonsave = document.getElementById('save-new-card');
    // Verifica se todos os campos estão preenchidos
    if (title && texto && date && aviso) {
        buttonsave.disabled = false; // Habilita o botão de salvar se todos os campos estiverem preenchidos
    } else {
        buttonsave.disabled = true; // Desabilita o botão de salvar se algum campo estiver vazio
    }
}

// Chamada inicial para verificar o estado dos campos e habilitar/desabilitar o botão de salvar
toggleSaveButton();


/** our cards */
cards.forEach(card => {
    card.addEventListener('dragstart', dragstart);
    card.addEventListener('drag', drag);
    card.addEventListener('dragend', dragend);
    card.setAttribute('draggable', true);

})

function toggleMenu() {
    var menu = document.getElementById("menuOptions");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function logout() {
    // Implemente a lógica de logout aqui
    console.log("Logout realizado!");
}

function dragstart() {
    // log('CARD: Start dragging ')
    dropzones.forEach( dropzone => dropzone.classList.add('highlight'));

    // this = card
    this.classList.add('is-dragging');
}

function drag() {
    // log('CARD: Is dragging ')
}

function dragend() {
    // log('CARD: Stop drag! ')
    dropzones.forEach( dropzone => dropzone.classList.remove('highlight'));

    // this = card
    this.classList.remove('is-dragging');
}

/** place where we will drop cards */
dropzones.forEach( dropzone => {
    dropzone.addEventListener('dragenter', dragenter);
    dropzone.addEventListener('dragover', dragover);
    dropzone.addEventListener('dragleave', dragleave);
    dropzone.addEventListener('drop', drop);
})

function dragenter() {
    // log('DROPZONE: Enter in zone ')
}

function dragover() {
    // this = dropzone
    this.classList.add('over');

    // get dragging card
    const cardBeingDragged = document.querySelector('.is-dragging');

    // this = dropzone
    this.appendChild(cardBeingDragged);
}

function dragleave() {
    // log('DROPZONE: Leave ')
    // this = dropzone
    this.classList.remove('over');

}

function drop(event) {
    // Prevent default (opening as link for some elements)
    event.preventDefault();
    // Remove 'over' class from dropzone
    this.classList.remove('over');
    // Get the dragging card
    const cardBeingDragged = document.querySelector('.is-dragging');
    // Append the dragging card to the dropzone
    this.querySelector('.cards').appendChild(cardBeingDragged);
    // Remove 'is-dragging' class from the dragging card
    cardBeingDragged.classList.remove('is-dragging');
    // Adjust the size of all cards in the dropzone to match the first card
    adjustCardSize(this);

}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert("Erro ao fazer logout");
    })
}

// const fakeCard = [{
//     type: 'todo',
//     title: 'Agendamento Privado',
//     texto: 'Agendamento pendente para fulano.',
//     aviso: 'Agendar'
// }, {
//     type: 'doing',
//     title: 'Agendamento Privado',
//     texto: 'Agendamento feito na clinica tal para fulano.',
//     aviso: 'Agendandado'
// }, {
//     type: 'done',
//     title: 'Agendamento Privado',
//     texto: 'Agendamento concluido para fulano.',
//     date: '2024-02-17',
//     aviso: 'Concluido',

// }]


function addCardToScreen(cardData) {
    const kanbanTodo = document.getElementById('todo');
    const kanbanDoing = document.getElementById('doing');
    const kanbanDone = document.getElementById('done');

    cardData.forEach(cardData => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add(cardData.type);

        const cardTitle = document.createElement('h3');
        cardTitle.textContent = cardData.title;

        const cardP = document.createElement('P');
        cardP.textContent = cardData.texto;

        const dataspan = document.createElement('span');
        dataspan.textContent = cardData.date;
        dataspan.classList.add('data-span');

        const cardSpan = document.createElement('span');
        cardSpan.textContent = cardData.aviso;
        cardSpan.classList.add('card-tags');
        
        cardDiv.appendChild(cardTitle);
        cardDiv.appendChild(cardP);
        cardDiv.appendChild(dataspan);
        cardDiv.appendChild(cardSpan);
        

        cardDiv.classList.add('card');

        // Adiciona atributos de arrastar e soltar
        cardDiv.setAttribute('draggable', true);
        cardDiv.addEventListener('dragstart', dragstart);
        cardDiv.addEventListener('drag', drag);
        cardDiv.addEventListener('dragend', dragend);


        if (cardData.type === 'todo') {
            kanbanTodo.appendChild(cardDiv);
        } else if (cardData.type === 'doing') {
            kanbanDoing.appendChild(cardDiv);
        } else if (cardData.type === 'done') {
            kanbanDone.appendChild(cardDiv);
        }

    });
}

function findCard(user) {

    firebase.firestore()
        .collection('card')
        .where('user.uid', '==', user.uid)
        .orderBy('date', 'desc')
        .get()
        .then(snapshot => {

            const cardData = snapshot.docs.map(doc => doc.data());
            addCardToScreen(cardData);
        })
        .catch(error => {
            console.error("Error getting documents: ", error);
        });
}

firebase.auth().onAuthStateChanged(user => {
    if (user){
        findCard(user);
    }
})

function newCard() {
    showBack ();
    var containerNewCard = document.querySelector('.container-new-card');
    containerNewCard.style.display = "block";
}

function closeModal() {
    hideBack();
    var containerNewCard = document.querySelector('.container-new-card');
    containerNewCard.style.display = "none";
}

function addCardToNewCard() {
    showLoading();
    const type = document.getElementById('todo').dataset.type;
    const title = document.getElementById('title_card');
    const texto = document.getElementById('text-new-card');
    const date = document.getElementById('data-new-card');
    const aviso  = document.getElementById('avisos-new-card');
    const buttonsave = document.getElementById('save-new-card');

    if (!isFormValid()) {
        return false;
    } else {
        buttonsave.disabled = false; // Habilita o botão de salvar se o formulário for válido
    }

    const cardObj = {
        type: type,
        title: title.value,
        texto: texto.value,
        date: date.value,
        aviso: aviso.value,
        user: {
            uid: firebase.auth().currentUser.uid
        }
        
    };

    console.log(cardObj);

    firebase.firestore()
        .collection('card')
        .add(cardObj)
        .then(() => {
            hideBack();
            closeModal();
            window.location.href = './home.html'
        })
        .catch(() => {
            hideBack();
            buttonsave.disabled = false;
            alert('Erro ao salvar os dados');
        })
    
    title.value = "";
    texto.value = "";
    date.value = "";
    aviso.value = "";

}

function isFormValid() {
    const title = document.getElementById('title_card').value.trim();
    const texto = document.getElementById('text-new-card').value.trim();
    const date = document.getElementById('data-new-card').value.trim();
    const aviso = document.getElementById('avisos-new-card').value;

    if (!title || !texto || !date || !aviso) {
        return false; // Retorna falso se algum campo estiver vazio
    }

    return true; // Retorna verdadeiro se todos os campos estiverem preenchidos
}


// Função para criar elemento de cartão com base nos dados
function createCardElement(cardData) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = cardData.title;

    const cardP = document.createElement('p');
    cardP.textContent = cardData.texto;

    const dataspan = document.createElement('span');
    dataspan.textContent = cardData.date;
    dataspan.classList.add('data-span');

    const cardSpan = document.createElement('span');
    cardSpan.textContent = cardData.aviso;
    cardSpan.classList.add('card-tags');
    
    cardDiv.appendChild(cardTitle);
    cardDiv.appendChild(cardP);
    cardDiv.appendChild(dataspan);
    cardDiv.appendChild(cardSpan);

    // Adiciona atributos de arrastar e soltar
    cardDiv.setAttribute('draggable', true);
    cardDiv.addEventListener('dragstart', dragstart);
    cardDiv.addEventListener('drag', drag);
    cardDiv.addEventListener('dragend', dragend);

    return cardDiv;
}

let lastActivityTime;
const MAX_INACTIVITY_TIME = 10 * 60 * 1000; // 30 minutos em milissegundos

// Função para atualizar o tempo da última atividade
function updateLastActivityTime() {
    lastActivityTime = Date.now();
}

// Função para verificar o tempo de inatividade e deslogar o usuário, se necessário
function checkInactivityAndLogout() {
    const currentTime = Date.now();
    const inactiveTime = currentTime - lastActivityTime;

    if (inactiveTime > MAX_INACTIVITY_TIME) {
        // Desloga o usuário
        logout();
    }
}

// Adiciona event listeners para rastrear a atividade do usuário
document.addEventListener("mousemove", updateLastActivityTime);
document.addEventListener("keydown", updateLastActivityTime);

// Define um intervalo para verificar periodicamente a inatividade do usuário
setInterval(checkInactivityAndLogout, 60000); // Verifica a cada minuto
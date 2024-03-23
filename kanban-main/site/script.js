
const cards = document.querySelectorAll('.card')
const dropzones = document.querySelectorAll('.dropzone')


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

const fakeCard = [{
    type: 'todo',
    title: 'Agendamento Privado',
    texto: 'Agendamento pendente para fulano.',
    aviso: 'Agendar'
}, {
    type: 'doing',
    title: 'Agendamento Privado',
    texto: 'Agendamento feito na clinica tal para fulano.',
    aviso: 'Agendandado'
}, {
    type: 'done',
    title: 'Agendamento Privado',
    texto: 'Agendamento concluido para fulano.',
    date: '2024-02-17',
    aviso: 'Concluido',

}]


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

const cards = document.querySelectorAll('.card')
const dropzones = document.querySelectorAll('.dropzone')
let currentCardId; 

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

    this.dataset.cardId = this.querySelector('.card-table').id;

    // Encontra o elemento do cartão dentro da zona de drop
    const cardDrop = this.querySelector('.card-table'); 

    // Obtém o idCard do elemento do cartão
    currentCardId = cardDrop.dataset.cardId; 

    console.log("ID do card arrastado:", currentCardId);


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

function dragover(event) {

    // this = dropzone
    this.classList.add('over');

    // get dragging card
    const cardBeingDragged = document.querySelector('.is-dragging');

    // this = dropzone
    this.appendChild(cardBeingDragged);
    event.preventDefault();

}

function dragleave() {
    // log('DROPZONE: Leave ')
    // this = dropzone
    this.classList.remove('over');
}

function drop() {
    const cardBeingDragged = document.querySelector('.is-dragging');
    cardBeingDragged.classList.remove('is-dragging');
    
    this.classList.remove('over');

    const cardType = this.getAttribute('data-type');
    cardId = currentCardId;
    console.log("ID do card arrastado:", cardId);
    console.log("Tipo do card:", cardType);
    console.log("Tentando atualizar o tipo do cartão com ID:", cardId, "e tipo:", cardType);


    firebase.firestore()
        .collection('card')
        .doc(cardId) // Usar cardId em vez de cardDrop.id
        .get()
        .then(doc => {
            if (doc.exists) {
                const currentType = doc.data().type;
                if (currentType !== cardType) {
                    // Apenas atualize se o tipo atual for diferente do novo tipo
                    console.log('Atualizado')
                    return doc.ref.update({ type: cardType });

                } else {
                    console.log("O tipo do cartão não foi alterado. Nenhuma atualização necessária.");
                }
            } else {
                console.error(`Documento com ID ${cardId} não encontrado.`);
            }
        })
        .catch(error => {
            console.error(`Erro ao atualizar o tipo do cartão ${cardId} no Firebase:`, error);
        });
    

}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert("Erro ao fazer logout");
    })
}

const toggleSidebar = () => document.body.classList.toggle("open");

function addCardToScreen(cardData) {
    cardData.sort((a, b) => new Date(b.date) - new Date(a.date));
    const kanbanTodo = document.getElementById('todo');
    const kanbanDoing = document.getElementById('doing');
    const kanbanDone = document.getElementById('done');
    

    cardData.forEach(cardData  => {
        const cardDiv = document.createElement('table');
        cardDiv.classList.add(cardData.type);
        cardDiv.classList.add('card');
        

        // Add double click event listener
        cardDiv.addEventListener('dblclick', () => {
            newCard() + cardDiv.id;
            console.log(cardData.idCard);
        });

        // Create table for card data
        const table = document.createElement('table');
        table.classList.add('card-table');
        table.dataset.cardId = cardData.uid;
        table.id = cardData.idCard;

        // Create table body
        const tbody = document.createElement('tbody');

        const dataRow = document.createElement('tr');


        const titleData = document.createElement('td');
        titleData.textContent = cardData.title;
        titleData.style.textAlign = 'left';
        titleData.style.width = '110px';
        dataRow.appendChild(titleData);

        const textoData = document.createElement('td');
        textoData.textContent = cardData.texto;
        textoData.style.textAlign = 'left';
        textoData.style.width = '140px';

        dataRow.appendChild(textoData);

        const dateData = document.createElement('td');
        dateData.textContent = cardData.date;
        dateData.style.textAlign = 'center';
        dateData.classList.add('data-span');
        dateData.style.width = '100px';
        dataRow.appendChild(dateData);



        const avisoData = document.createElement('td');
        avisoData.textContent = cardData.aviso;
        avisoData.style.textAlign = 'left';
        avisoData.classList.add('tags');
        avisoData.style.width = '150px';
        dataRow.appendChild(avisoData);

        const colaboradorData = document.createElement('td');
        colaboradorData.textContent = cardData.colaborador;
        colaboradorData.style.textAlign = 'center';
        colaboradorData.style.width = '100px';
        dataRow.appendChild(colaboradorData);

        tbody.appendChild(dataRow);
        table.appendChild(tbody);

        cardDiv.appendChild(table);
        // Add draggable attributes
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

        function diffDays(date1, date2) {
            const diffTime = Math.abs(date2.getTime() - date1.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        }
        
        // Obter a data atual
        const currentDate = new Date();
        
        // Converter a data salva no cartão para um objeto de data
        const savedDate = new Date(cardData.date);
        
        // Calcular a diferença em dias entre a data atual e a data do cartão
        const daysDifference = diffDays(currentDate, savedDate);
        
        // Obter a data de criação do cartão
        const creationDate = new Date(cardData.creationDate);
        
        // Calcular a diferença em dias entre a data atual e a data de criação do cartão
        const daysSinceCreation = diffDays(currentDate, creationDate);
        
        // Verificar se passaram mais de 10 dias desde a criação do cartão e aplicar estilos correspondentes
        if (daysSinceCreation >= 30) {
            // Se passaram mais de 10 dias desde a criação do cartão, aplicar o estilo de cor amarela ao cardDiv
            cardDiv.style.borderLeftColor = 'red';
            dateData.style.color = 'red';

        } else if (daysDifference >= 10) {
            // Se passaram mais de 10 dias desde a data do cartão, adicionar a classe 'tags' ao elemento dateData e alterar a cor da borda do cardDiv para vermelho
            dateData.style.color = '#FF8C00';
            cardDiv.style.borderLeftColor = '#FF8C00'; 

        } else if (daysDifference >= 5) {
            // Se passaram mais de 5 dias desde a data do cartão, aplicar o estilo de cor amarela diretamente ao elemento dateData e à borda do cardDiv
            dateData.style.color = 'green';
            cardDiv.style.borderLeftColor = 'green';
        } else {
            dateData.style.color = 'none';
            cardDiv.style.borderLeftColor = 'gray';
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

            const cardData = snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id,
            }));
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
    const colaborador  = document.getElementById('colaborador-new-card');
    const buttonsave = document.getElementById('save-new-card');
    const idCard = Math.floor(Math.random() * (10000 - 100 + 1)) + 100;

    if (!isFormValid()) {
        return false;
    } else {
        buttonsave.disabled = false; // Habilita o botão de salvar se o formulário for válido
    }

    const currentDate = new Date(); // Obtem a data atual
    const cardObj = {
        type: type,
        title: title.value,
        texto: texto.value,
        date: date.value,
        aviso: aviso.value,
        colaborador: colaborador.value,
        idCard: idCard,
        user: {
            uid: firebase.auth().currentUser.uid
        },
        creationDate: currentDate
        
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



let lastActivityTime;
const MAX_INACTIVITY_TIME = 60 * 60 * 1000; // 30 minutos em milissegundos

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


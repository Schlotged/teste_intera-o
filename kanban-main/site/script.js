
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
        dataRow.style.cursor = "pointer"

        const titleData = document.createElement('td');
        titleData.textContent = cardData.title;
        titleData.style.textAlign = 'left';
        titleData.style.width = '110px';
        dataRow.appendChild(titleData);

        const textoData = document.createElement('td');
        textoData.textContent = cardData.texto;
        textoData.style.textAlign = 'left';
        textoData.style.width = '140px';

        const maxLength = 12; // Número máximo de palavras permitidas
        const maxLines = 1; // Número máximo de linhas permitidas
        textoData.textContent = truncateText(cardData.texto, maxLength, maxLines);

        dataRow.appendChild(textoData);

        const dateData = document.createElement('td');
        dateData.textContent = cardData.date;
        dateData.style.textAlign = 'left';
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
        colaboradorData.style.textAlign = 'left';
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
        
        if (currentDate > savedDate) {
            const daysDifference = diffDays(currentDate, savedDate);
        
            if (daysDifference >= 30) {
                // Se passaram mais de 30 dias desde a data do cartão, aplicar o estilo de cor vermelha ao cardDiv
                cardDiv.style.borderLeftColor = 'red';
                dateData.style.color = 'red';
            } else if (daysDifference >= 10) {
                // Se passaram mais de 10 dias desde a data do cartão, aplicar o estilo de cor laranja ao cardDiv
                dateData.style.color = '#FF8C00';
                cardDiv.style.borderLeftColor = '#FF8C00';
            } else if (daysDifference >= 5) {
                // Se passaram mais de 5 dias desde a data do cartão, aplicar o estilo de cor verde ao cardDiv
                dateData.style.color = 'green';
                cardDiv.style.borderLeftColor = 'green';
            } else {
                // Se passaram menos de 5 dias desde a data do cartão, aplicar o estilo de cor padrão ao cardDiv
                dateData.style.color = 'none';
                cardDiv.style.borderLeftColor = 'gray';
            }
        } else {
            // Se a data atual ainda não passou a data do cartão, manter os estilos padrão
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

function truncateText(text, maxLength, maxLines) {
    // Check if the text length is greater than the maxLength
    if (text.length > maxLength) {
        // Truncate the text to the maxLength
        let truncatedText = text.substring(0, maxLength);

        // Check if the text has more lines than the maxLines
        const lines = truncatedText.split('\n');
        if (lines.length > maxLines) {
            // Truncate the text to the maxLines
            truncatedText = lines.slice(0, maxLines).join('\n');
        }

        // Add ellipsis (...) at the end of the truncated text
        truncatedText += '...';

        return truncatedText;
    } else {
        return text;
    }
}

function isInHomePage() {
    // Verifica se existe um elemento com o id "home"
    return document.getElementById('app') !== null;
}

// Função para ajustar o zoom da página
function adjustPageZoom() {
    // Verifica se a página está na tela inicial
    if (isInHomePage()) {
        // Define a escala de visualização para 80%
        document.body.style.zoom = '80%';
    } else {
        // Se não estiver na página inicial, retorna para o zoom padrão (100%)
        document.body.style.zoom = '100%';
    }
}

// Chama a função para ajustar o zoom da página quando a página é carregada
window.onload = adjustPageZoom;



function altNameHeadKanban() {
    const titleDrops = document.querySelectorAll('.title-dropzone');

    titleDrops.forEach(dropzone => {
        const titleDrop = dropzone.querySelector('h2');

        titleDrop.addEventListener('click', () => {
            // Torna a div editável
            titleDrop.contentEditable = true;
            titleDrop.focus(); // Coloca o foco na div para facilitar a edição
            titleDrop.style.minHeight = '20px'; // Ajusta o tamanho mínimo da div
            titleDrop.style.display = 'flex';
            titleDrop.style.alignItems = 'center';
            titleDrop.style.minWidth = '100px';

            // Obtém o ID da div onde o h2 está contido
            const idTitle = titleDrop.id;

            // Salva o valor digitado quando o usuário sair do foco da div
            titleDrop.addEventListener('blur', () => {
                const newTitle = titleDrop.textContent.trim(); // Obtém o novo título digitado

                // Verifica se o ID é válido antes de chamar a função saveTitle
                if (idTitle) {
                    saveTitle(idTitle, newTitle); // Passa o ID e o novo título para a função
                    titleDrop.contentEditable = false; // Desabilita a edição
                    titleDrop.style.minHeight = 'auto'; // Restaura o tamanho mínimo da div
                } else {
                    console.error('ID do documento ausente ou inválido.');
                }
            });
        });

        titleDrop.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Impede que a quebra de linha seja inserida
                titleDrop.blur(); // Força a div a perder o foco, desencadeando o evento blur
            }
        });
    });
}

function saveTitle(id, newTitle) {
    // Atualiza o título diretamente no Firestore usando o ID do documento
    firebase.firestore()
        .collection('table-fluxo')
        .doc(id)
        .update({ title: newTitle })
        .then(() => {
            console.log('Título atualizado com sucesso no Firestore.');
        })
        .catch(error => {
            console.error('Erro ao atualizar o título no Firestore:', error);
        });
}

// Chama a função para tornar a div editável quando clicar no ícone de edição
function enableEdit() {
    altNameHeadKanban();
}

function addH2ToScreen(h2Data) {
    const kanbanTodo = document.getElementById('table-todo');
    const kanbanDoing = document.getElementById('table-doing');
    const kanbanDone = document.getElementById('table-done');

    h2Data.forEach(data => {
        const titleDiv = document.createElement('div'); // Criar a div para o título
        titleDiv.classList.add('title-dropzone'); // Adicionar a classe

        const h2 = document.createElement('h2'); // Criar o h2 para o título
        h2.textContent = data.title; // Definir o texto do h2
        h2.id = data.id;

        titleDiv.appendChild(h2); // Adicionar o h2 dentro da div de título

        // Selecionar a div de dropzone correspondente
        let dropzone;
        if (data.type === 'todo') {
            dropzone = kanbanTodo.querySelector('.title-dropzone.todo');
        } else if (data.type === 'doing') {
            dropzone = kanbanDoing.querySelector('.title-dropzone.doing');
        } else if (data.type === 'done') {
            dropzone = kanbanDone.querySelector('.title-dropzone.done');
        }

        // Se a dropzone existir e o tipo da tabela coincidir com o tipo da dropzone
        if (dropzone && dropzone.classList.contains(data.type)) {
            dropzone.appendChild(titleDiv); // Adicionar a div do título à dropzone
        }
    });
}

function findText() {
    firebase.firestore()
        .collection('table-fluxo')
        .get()
        .then(snapshot => {
            const h2Data = snapshot.docs.map(doc => ({
                type: doc.data().type, // Obter o tipo da tabela do Firebase
                title: doc.data().title // Obter o título da tabela do Firebase
            }));
            addH2ToScreen(h2Data); // Chamar a função para adicionar os títulos à tela
        })
        .catch(error => {
            console.error("Error getting documents: ", error);
        });
}

findText();
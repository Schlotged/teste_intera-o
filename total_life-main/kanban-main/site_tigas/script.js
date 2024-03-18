const cards = document.querySelectorAll('.card')
const dropzones = document.querySelectorAll('.dropzone')

/** our cards */
cards.forEach(card => {
    card.addEventListener('dragstart', dragstart);
    card.addEventListener('drag', drag);
    card.addEventListener('dragend', dragend);
    card.setAttribute('draggable', true);

})

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
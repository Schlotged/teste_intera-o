function showLoading () {
    const div = document.createElement("div");
    div.classList.add("loading");
    document.body.appendChild(div);
    
    const label = document.createElement('label');
    
    // Criando uma div para envolver a imagem
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container'); // Adicionando uma classe para estilização CSS

    const img = document.createElement('img');
    img.src = '../assests/logo2.png';
    img.alt = ''; 

    imgContainer.appendChild(img);
    label.appendChild(imgContainer);

    div.appendChild(label);


}

function hideLoading() {
    const loadings = document.getElementsByClassName('loading');
    if (loadings.length) {
        loadings[0].remove();
    }
}
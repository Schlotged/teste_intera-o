function showLoading () {
    const loadingContainer = document.createElement("div");
    loadingContainer.classList.add("loading");

    const loader = document.createElement("div");
    loader.classList.add("loader");

    loadingContainer.appendChild(loader);

    document.body.appendChild(loadingContainer);
}

function hideLoading() {
    const loadings = document.getElementsByClassName('loading');
    if (loadings.length) {
        loadings[0].remove();
    }
}
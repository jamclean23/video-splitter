// Add common event listeners to DOM

// ====== IMPORTS ======

// ====== FUNCTIONS ======

function addEventListeners () {
    updateCssVars();

    window.addEventListener('resize', updateCssVars);
}

function updateCssVars () {
    const root = document.querySelector(':root');
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Set Css vars
    root.style.setProperty('--window-height', `${windowHeight}px`);
    root.style.setProperty('--window-width', `${windowWidth}px`);

}


// ====== EXPORTS ======

export default addEventListeners;
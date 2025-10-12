document.addEventListener("DOMContentLoaded", function() {
    // Lógica para mostrar el botón de Editar solo si el usuario es el dueño del negocio
    function checkUserRole() {
        // Simulación: en un escenario real, esta información vendría de una API
        const userIsOwner = true; // Cambiar a 'false' para probar el comportamiento de un usuario regular

        const editButton = document.getElementById("edit-button");
        if (userIsOwner) {
            editButton.classList.remove("d-none");
        }
    }

    checkUserRole();

    // Lógica para simular la carga de reseñas
    function loadReviews() {
        const reviewFeed = document.getElementById("review-feed");
        // Aquí iría el código para llamar a una API y obtener las reseñas.
        // Por ahora, el HTML ya tiene un par de reseñas de ejemplo.
        console.log("Feed de reseñas cargado.");
    }

    loadReviews();
});


/* Seccion de carrusel */
/**
 * ========================================
 * CARRUSEL DE MENÚ - FUNCIONALIDAD
 * ========================================
 * 
 * Este script permite agregar dinámicamente nuevos platillos al carrusel
 * mediante la carga de imágenes desde el dispositivo del usuario.
 */

// Variables globales
let selectedImageFile = null;
let selectedImageURL = null;

/**
 * Inicializa los event listeners cuando el DOM está cargado
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeFileInput();
});

/**
 * Configura el input de archivo para manejar la selección de imágenes
 * 
 * @function initializeFileInput
 * @returns {void}
 */
function initializeFileInput() {
    const fileInput = document.getElementById('fileInput');
    
    if (!fileInput) {
        console.error('No se encontró el input de archivo');
        return;
    }
    
    // Event listener para cuando se selecciona un archivo
    fileInput.addEventListener('change', function(event) {
        handleFileSelect(event);
    });
}

/**
 * Maneja la selección de un archivo de imagen
 * Muestra el modal para ingresar el nombre del platillo
 * 
 * @function handleFileSelect
 * @param {Event} event - Evento de cambio del input file
 * @returns {void}
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) {
        console.warn('No se seleccionó ningún archivo');
        return;
    }
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        event.target.value = '';
        return;
    }
    
    // Guardar el archivo seleccionado
    selectedImageFile = file;
    
    // Crear URL temporal para previsualizar la imagen
    selectedImageURL = URL.createObjectURL(file);
    
    // Mostrar previsualización en el modal
    const previewImage = document.getElementById('previewImage');
    if (previewImage) {
        previewImage.src = selectedImageURL;
        previewImage.style.display = 'block';
    }
    
    // Limpiar el input del nombre
    const dishNameInput = document.getElementById('dishName');
    if (dishNameInput) {
        dishNameInput.value = '';
    }
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('dishNameModal'));
    modal.show();
}

/**
 * Agrega el nuevo platillo al carrusel
 * Crea un nuevo item con la imagen y nombre proporcionados
 * 
 * @function addDishToCarousel
 * @returns {void}
 */
function addDishToCarousel() {
    const dishName = document.getElementById('dishName').value.trim();
    
    // Validar que se haya ingresado un nombre
    if (!dishName) {
        alert('Por favor ingresa un nombre para el platillo');
        return;
    }
    
    // Validar que haya una imagen seleccionada
    if (!selectedImageURL) {
        alert('No se ha seleccionado ninguna imagen');
        return;
    }
    
    // Buscar el último slide con contenido (antes del slide de agregar)
    const carouselInner = document.getElementById('carouselInner');
    const allItems = carouselInner.querySelectorAll('.carousel-item');
    const addButtonSlide = allItems[allItems.length - 1];
    const lastContentSlide = allItems[allItems.length - 2];
    
    // Contar cuántos items hay en el último slide con contenido
    const itemsInLastSlide = lastContentSlide.querySelectorAll('.col-4').length;
    
    if (itemsInLastSlide < 3) {
        // Si hay espacio en el último slide, agregar ahí
        addItemToExistingSlide(lastContentSlide, dishName, selectedImageURL);
    } else {
        // Si el último slide está lleno, crear un nuevo slide
        createNewSlideWithItem(carouselInner, addButtonSlide, dishName, selectedImageURL);
    }
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('dishNameModal'));
    modal.hide();
    
    // Limpiar variables y el input de archivo
    selectedImageFile = null;
    selectedImageURL = null;
    document.getElementById('fileInput').value = '';
    document.getElementById('dishName').value = '';
    
    console.log('Platillo agregado exitosamente:', dishName);
}

/**
 * Agrega un nuevo item a un slide existente que tiene espacio disponible
 * 
 * @function addItemToExistingSlide
 * @param {HTMLElement} slide - Slide donde se agregará el item
 * @param {string} dishName - Nombre del platillo
 * @param {string} imageURL - URL de la imagen
 * @returns {void}
 */
function addItemToExistingSlide(slide, dishName, imageURL) {
    const row = slide.querySelector('.row');
    
    const newCol = document.createElement('div');
    newCol.className = 'col-4';
    
    newCol.innerHTML = `
        <div class="menu-item">
            <img src="${imageURL}" class="menu-item-img" alt="${dishName}">
            <div class="menu-item-overlay">
                <p class="menu-item-name">${dishName}</p>
            </div>
        </div>
    `;
    
    row.appendChild(newCol);
}

/**
 * Crea un nuevo slide con el item cuando el último slide está lleno
 * 
 * @function createNewSlideWithItem
 * @param {HTMLElement} carouselInner - Contenedor del carrusel
 * @param {HTMLElement} addButtonSlide - Slide con el botón de agregar
 * @param {string} dishName - Nombre del platillo
 * @param {string} imageURL - URL de la imagen
 * @returns {void}
 */
function createNewSlideWithItem(carouselInner, addButtonSlide, dishName, imageURL) {
    const newSlide = document.createElement('div');
    newSlide.className = 'carousel-item';
    
    newSlide.innerHTML = `
        <div class="row g-3">
            <div class="col-4">
                <div class="menu-item">
                    <img src="${imageURL}" class="menu-item-img" alt="${dishName}">
                    <div class="menu-item-overlay">
                        <p class="menu-item-name">${dishName}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insertar el nuevo slide antes del slide del botón "Agregar"
    carouselInner.insertBefore(newSlide, addButtonSlide);
}

/**
 * Limpia la previsualización de la imagen cuando se cierra el modal
 */
document.getElementById('dishNameModal')?.addEventListener('hidden.bs.modal', function() {
    const previewImage = document.getElementById('previewImage');
    if (previewImage) {
        previewImage.style.display = 'none';
        previewImage.src = '';
    }
});
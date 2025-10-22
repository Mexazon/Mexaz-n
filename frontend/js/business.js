/**
 * ========================================
 * CARRUSEL DE MENÚ - FUNCIONALIDAD COMPLETA
 * CON PERSISTENCIA EN LOCAL STORAGE
 * ========================================
 */

// Variable global para el archivo de imagen seleccionado
let selectedImageFile = null;

// =================================================================
// SECCIÓN DE MANEJO DE DATOS (LOCAL STORAGE)
// =================================================================

/**
 * Obtiene todos los platillos desde Local Storage.
 * @returns {Array} Un array de objetos de platillos.
 */
function getDishesFromStorage() {
    const dishes = localStorage.getItem('dishes');
    return dishes ? JSON.parse(dishes) : [];
}

/**
 * Guarda el array completo de platillos en Local Storage.
 * @param {Array} dishes - El array de platillos a guardar.
 */
function saveDishesToStorage(dishes) {
    localStorage.setItem('dishes', JSON.stringify(dishes));
}

// =================================================================
// INICIALIZACIÓN Y CARGA DE DATOS
// =================================================================

/**
 * Inicializa los event listeners cuando el DOM está cargado.
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeFileInput();
    initializeModalCleanup();
    
    // Carga los platillos guardados en Local Storage al iniciar.
    loadAndDisplayDishes();

    // ¡NUEVO! Conectar el botón del modal con la función
    const saveButton = document.getElementById('saveDishButton');
    if (saveButton) {
        saveButton.addEventListener('click', validateAndAddDish);
    }

    // Para la FASE 2 (JSON), comentarías la línea de arriba y usarías esta:
    // loadDishesFromJSON();
});

/**
 * Carga los platillos desde Local Storage y los muestra en el carrusel.
 */
function loadAndDisplayDishes() {
    const dishes = getDishesFromStorage();
    dishes.forEach(dish => {
        addDishToCarousel(dish.name, dish.price, dish.description, dish.imageUrl);
    });
}

/**
 * (Para Fase 2) Carga los platillos desde un archivo JSON.
 */
async function loadDishesFromJSON() {
    try {
        const response = await fetch('menu.json'); // Asegúrate de tener este archivo
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const dishes = await response.json();
        dishes.forEach(dish => {
            addDishToCarousel(dish.name, dish.price, dish.description, dish.imageUrl);
        });
    } catch (error) {
        console.error("No se pudieron cargar los platillos del JSON:", error);
    }
}


// =================================================================
// FUNCIONALIDAD DEL MODAL Y FORMULARIO
// =================================================================

/**
 * Configura el input de archivo para manejar la selección de imágenes.
 */
function initializeFileInput() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput) {
        console.error('No se encontró el input de archivo #fileInput');
        return;
    }
    fileInput.addEventListener('change', handleFileSelect);
}

/**
 * Limpia el formulario y la previsualización cuando el modal se cierra.
 */
function initializeModalCleanup() {
    const modalElement = document.getElementById('addDishDetailsModal');
    if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', function() {
            const form = document.getElementById('addDishForm');
            form.classList.remove('was-validated');
            form.reset(); // Manera más simple de limpiar el form

            const previewImage = document.getElementById('previewImage');
            previewImage.style.display = 'none';
            previewImage.src = '';
            
            document.getElementById('imagePlaceholder').style.display = 'none';
            
            selectedImageFile = null;
            document.getElementById('fileInput').value = '';
        });
    }
}

/**
 * Maneja la selección de un archivo de imagen y muestra el modal.
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        return;
    }

    selectedImageFile = file;
    const previewImage = document.getElementById('previewImage');
    previewImage.src = URL.createObjectURL(file); // URL temporal solo para previsualizar
    previewImage.style.display = 'block';
    document.getElementById('imagePlaceholder').style.display = 'block';
    
    const modal = new bootstrap.Modal(document.getElementById('addDishDetailsModal'));
    modal.show();
}

/**
 * Valida el formulario y guarda el nuevo platillo en Local Storage.
 */
function validateAndAddDish() {
    const form = document.getElementById('addDishForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    if (!selectedImageFile) {
        alert('Error: No se ha seleccionado ninguna imagen.');
        return;
    }

    // Proceso para convertir la imagen a Base64 y guardar
    const reader = new FileReader();
    reader.readAsDataURL(selectedImageFile); // Convierte la imagen
    
    reader.onload = function() {
        const imageBase64 = reader.result;

        const newDish = {
            id: `dish-${Date.now()}`,
            name: document.getElementById('dishName').value.trim(),
            price: parseFloat(document.getElementById('dishPrice').value).toFixed(2),
            description: document.getElementById('dishDescription').value.trim(),
            imageUrl: imageBase64 // Guardamos la imagen en formato Base64
        };

        const dishes = getDishesFromStorage();
        dishes.push(newDish);
        saveDishesToStorage(dishes);

        addDishToCarousel(newDish.name, newDish.price, newDish.description, newDish.imageUrl);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('addDishDetailsModal'));
        modal.hide();
    };

    reader.onerror = function(error) {
        console.error('Error al leer el archivo:', error);
        alert('Hubo un error al procesar la imagen.');
    };
}


// =================================================================
// MANIPULACIÓN DEL DOM (CARRUSEL) - SIN CAMBIOS
// =================================================================

/**
 * Agrega el nuevo platillo al carrusel.
 */
function addDishToCarousel(dishName, dishPrice, dishDescription, imageURL) {
    const carouselInner = document.getElementById('carouselInner');
    if (!carouselInner) {
        console.error('Error: No se encontró el contenedor del carrusel (#carouselInner).');
        return;
    }

    const allItems = carouselInner.querySelectorAll('.carousel-item');
    const addButtonSlide = allItems[allItems.length - 1];
    let lastContentSlide = allItems.length > 1 ? allItems[allItems.length - 2] : null;

    if (lastContentSlide && lastContentSlide.querySelectorAll('.col-4').length < 3) {
        addItemToExistingSlide(lastContentSlide, dishName, dishPrice, dishDescription, imageURL);
    } else {
        createNewSlideWithItem(carouselInner, addButtonSlide, dishName, dishPrice, dishDescription, imageURL);
    }
}

/**
 * Agrega un nuevo item a un slide existente.
 */
function addItemToExistingSlide(slide, dishName, dishPrice, dishDescription, imageURL) {
    const row = slide.querySelector('.row');
    const newCol = document.createElement('div');
    newCol.className = 'col-4';
    newCol.innerHTML = createDishCardHTML(dishName, dishPrice, dishDescription, imageURL);
    row.appendChild(newCol);
}

/**
 * Crea un nuevo slide con el item.
 */
function createNewSlideWithItem(carouselInner, addButtonSlide, dishName, dishPrice, dishDescription, imageURL) {
    const newSlide = document.createElement('div');
    newSlide.className = 'carousel-item';
    newSlide.innerHTML = `
        <div class="row g-3">
            <div class="col-4">
                ${createDishCardHTML(dishName, dishPrice, dishDescription, imageURL)}
            </div>
        </div>
    `;
    carouselInner.insertBefore(newSlide, addButtonSlide);
}

/**
 * Genera el HTML para la tarjeta de platillo y su modal correspondiente.
 */
function createDishCardHTML(dishName, dishPrice, dishDescription, imageURL) {
    const escapedName = dishName.replace(/"/g, '&quot;');
    const dishId = `dish-${Date.now()}-${Math.random()}`; // ID más robusto

    // Este HTML es diferente al que tenías para hacerlo más compacto y visual
    return `
        <div class="position-relative rounded-3 overflow-hidden shadow-sm" 
             style="height: 180px; cursor: pointer;"
             data-bs-toggle="modal" data-bs-target="#${dishId}-modal">
            <img src="${imageURL}" class="w-100 h-100 object-fit-cover" alt="${escapedName}">
            <div class="position-absolute bottom-0 start-0 end-0 p-3"
                 style="background: linear-gradient(to top, rgba(0,0,0,0.8), transparent 100%);">
                <p class="text-white fw-bold mb-0 fs-6 text-truncate">${escapedName}</p>
            </div>
        </div>

        <div class="modal fade" id="${dishId}-modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content border-0 rounded-4 shadow">
                    <div class="modal-header border-0">
                        <h5 class="modal-title">${escapedName}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="${imageURL}" class="img-fluid rounded mb-3" style="max-height: 200px; width: 100%; object-fit: cover;">
                        <p class="fw-semibold text-success fs-5">$${dishPrice} MXN</p>
                        <p>${dishDescription}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}
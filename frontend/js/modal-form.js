//importo las rutas de los chiles 
import redPepper from '../assets/red-pepper.svg';
import blackPepper from '../assets/black-pepper.svg';
import {existentUsers} from './loadData.js'

// Variables globales
let currentRating = 0;

// Elementos del DOM
const postalCodeSelect = document.getElementById('postalCode');
const locationSelect = document.getElementById('location');
const starRating = document.getElementById('starRating');
const ratingText = document.getElementById('ratingText');
const ratingInput = document.getElementById('rating');
const reviewTextArea = document.getElementById('reviewText');
const submitBtn = document.getElementById('submitBtn');
export const reviewForm = document.getElementById('reviewForm');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    existentUsers.filt
    initializePostalCodes();
    initializeStarRating();
    initializeFormValidation();
});

// Cargar códigos postales
function initializePostalCodes() {
    const places = new Set();
    for(let business of foodData){
        places.add(business.location);
    }
    places.forEach(place => {
        const option = document.createElement('option');
        option.value = place;
        option.textContent = place;
        postalCodeSelect.appendChild(option);
        
    });
}


// Manejar cambio de código postal
postalCodeSelect.addEventListener('change', function() {
    const selectedCode = this.value;

    if (selectedCode) {
        // Habilitar selector de ubicación
        locationSelect.disabled = false;
        locationSelect.innerHTML = '<option value="">Selecciona un lugar...</option>';

        // Cargar lugares correspondientes al código postal
        const places = foodData.filter(business => business.location == selectedCode);
        places.forEach(place => {
            const option = document.createElement('option');
            option.value = place.name;
            option.textContent = place.name;
            locationSelect.appendChild(option);
        });

        // Resetear pasos posteriores
        resetSubsequentSteps(2);
    } else {
        // Resetear todo
        resetSubsequentSteps(1);
    }
});

// Manejar cambio de ubicación
locationSelect.addEventListener('change', function() {
    const selectedLocation = this.value;
    
    if (selectedLocation) {
        // Habilitar calificación
        enableRating();
        
        // Resetear pasos posteriores
        resetSubsequentSteps(3);
    } else {
        resetSubsequentSteps(2);
    }
});

// Inicializar sistema de calificación por estrellas
function initializeStarRating() {
    const stars = starRating.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            if (!starRating.classList.contains('disabled')) {
                currentRating = index + 1;
                ratingInput.value = currentRating;
                updateStarDisplay();
                updateRatingText();
                // Habilitar textarea
                enableReviewText();
            }
        });
        
        star.addEventListener('mouseenter', function() {
            if (!starRating.classList.contains('disabled')) {
                highlightStars(index + 1);
            }
        });
    });
    
    starRating.addEventListener('mouseleave', function() {
        if (!starRating.classList.contains('disabled')) {
            updateStarDisplay();
        }
    });
}

// Habilitar calificación
function enableRating() {
    starRating.classList.remove('disabled');
    ratingText.textContent = 'Selecciona una calificación';
    const stars = starRating.querySelectorAll('.star');
    stars.forEach(star => {
        star.style.cursor = 'pointer';
    });
}

// Deshabilitar calificación
function disableRating() {
    starRating.classList.add('disabled');
    ratingText.textContent = 'Primero selecciona un local';
    currentRating = 0;
    ratingInput.value = '';
    updateStarDisplay();
    const stars = starRating.querySelectorAll('.star');
    stars.forEach(star => {
        star.style.cursor = 'not-allowed';
    });
}

// Actualizar visualización de estrellas
function updateStarDisplay() {
    const stars = starRating.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < currentRating) {
            star.src = redPepper;
        } else {
            star.src = blackPepper;
        }
      
    });
}

// Resaltar estrellas al hacer hover
function highlightStars(rating) {
    const stars = starRating.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.src = redPepper;
        } else {
            star.src = blackPepper;
        }
      
    });
}

// Actualizar texto de calificación
function updateRatingText() {
    const ratingTexts = {
        1: '',
        2: '',
        3: 'Orale',
        4: 'Sabroso',
        5: 'A toda madre!!!'
    };
    ratingText.textContent = ratingTexts[currentRating] || 'Selecciona una calificación';
}

// Habilitar área de texto de reseña
function enableReviewText() {
    reviewTextArea.disabled = false;
    reviewTextArea.placeholder = 'Escribe tu reseña aquí...';
}

// Deshabilitar área de texto de reseña
function disableReviewText() {
    reviewTextArea.disabled = true;
    reviewTextArea.value = '';
    reviewTextArea.placeholder = 'Primero completa los pasos anteriores...';
}

// Validación del formulario en tiempo real
function initializeFormValidation() {
    reviewTextArea.addEventListener('input', function() {
        validateForm();
    });
}

// Validar formulario completo
function validateForm() {
    const isValid = postalCodeSelect.value && 
                   locationSelect.value && 
                   currentRating > 0 && 
                   reviewTextArea.value.trim().length > 0;
    
    submitBtn.disabled = !isValid;
}
// Validar datos del formulario

// Resetear pasos posteriores
function resetSubsequentSteps(fromStep) {
    if (fromStep <= 1) {
        locationSelect.disabled = true;
        locationSelect.innerHTML = '<option value="">Primero selecciona un código postal</option>';
    }
    
    if (fromStep <= 2) {
        disableRating();
    }
    
    if (fromStep <= 3) {
        disableReviewText();
    }
    
    submitBtn.disabled = true;
}

// Resetear formulario completo
export function resetForm() {
    reviewForm.reset();
    currentRating = 0;
    
    // Resetear selectores
    locationSelect.disabled = true;
    locationSelect.innerHTML = '<option value="">Primero selecciona un código postal</option>';
    
    // Resetear calificación
    disableRating();
    
    // Resetear textarea
    disableReviewText();
    
    submitBtn.disabled = true;
}

//Agregar una foto
const photoInput = document.getElementById('reviewPhoto');
const photoPreviewContainer = document.getElementById('photoPreviewContainer');
const photoPreviewList = document.getElementById('photoPreviewList');

photoInput.addEventListener('change', function(event) {
  const files = event.target.files;

  // Limpia vistas previas anteriores
  photoPreviewList.innerHTML = '';

  if (files.length === 0) {
    photoPreviewContainer.classList.add('d-none');
    return;
  }

  photoPreviewContainer.classList.remove('d-none');

  // Recorre todos los archivos seleccionados
  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.classList.add('img-thumbnail', 'shadow-sm');
        img.style.width = '120px';
        img.style.height = '120px';
        img.style.objectFit = 'cover';
        photoPreviewList.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });
});


/**
 * businessLoad.js
 * Controlador de vista para la página de perfil de negocio.
 * Utiliza los controladores de API para obtener y renderizar los datos.
 */
import {
    getBusinessById,
    getUserAddress,
    getHoursByBusiness,
    listBusinessPosts,
    getBusinessRating,
    getUserById
} from './controllers/getControllers.js';

// ... (El DAY_MAP y getBusinessId quedan igual) ...
const DAY_MAP = {
    Mon: { short: 'L', long: 'Lunes' },
    Tue: { short: 'M', long: 'Martes' },
    Wed: { short: 'M', long: 'Miércoles' },
    Thu: { short: 'J', long: 'Jueves' },
    Fri: { short: 'V', long: 'Viernes' },
    Sat: { short: 'S', long: 'Sábado' },
    Sun: { short: 'D', long: 'Domingo' }
};

function getBusinessId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || '13'; // Fallback a 13 si no hay ID
}

// --- (Las funciones displayBusinessInfo, displayAddress, displayHours, displayRating, displayReviews quedan igual) ---
function displayBusinessInfo(businessData) {
    if (!businessData) return;
    const { user } = businessData;
    document.querySelector('.profile-img').src = user.avatarUrl;
    document.getElementById('nombreNegocio').textContent = user.name;
    document.getElementById('descripcionParrafo').textContent = user.description;
}

function displayAddress(addressData) {
    if (!addressData) return;
    const addressEl = document.getElementById('direccionNegocio');
    addressEl.innerHTML = `
        <i class="bi bi-geo-alt me-1"></i>
        ${addressData.street} #${addressData.number}, ${addressData.colonia}, ${addressData.alcaldia} <br>
        C.P. ${addressData.postalCode}
    `;
}

function displayHours(hoursData) {
    // ... (código de la función sin cambios)
    if (!hoursData) return;
    const popoverButton = document.querySelector('[data-bs-toggle="popover"]');
    if (!popoverButton) return;
    const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const sortedHours = hoursData.sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek));
    const popoverContentHTML = sortedHours.map(hour => {
        const dayInfo = DAY_MAP[hour.dayOfWeek] || { short: '?' };
        const isWorking = hour.working && hour.timeIn && hour.timeOut;
        const timeRange = isWorking ? `${hour.timeIn.substring(0, 5)} - ${hour.timeOut.substring(0, 5)}` : 'Cerrado';
        const statusClass = isWorking ? 'bg-success' : 'bg-danger';
        const statusText = isWorking ? 'Abierto' : 'Cerrado';
        return `
            <li class="row w-100 align-items-center mb-1">
                <div class="col-2 fw-bold">${dayInfo.short}</div>
                <div class="col-6 text-muted">${timeRange}</div>
                <div class="col-4 d-flex align-items-center justify-content-end">
                    <span class="status-dot ${statusClass} me-2"></span>
                    <span class="status-text">${statusText}</span>
                </div>
            </li>`;
    }).join('');
    popoverButton.setAttribute('data-bs-content', `<ul class="list-unstyled small m-0">${popoverContentHTML}</ul>`);
    new window.bootstrap.Popover(popoverButton, { html: true, sanitize: false });
}

function displayRating(ratingData) {
    
    // ... (código de la función sin cambios)
    if (!ratingData) return;
    const { averageRating, totalRatings } = ratingData;
    const ratingContainer = document.querySelector('.chile-rating');
    if (ratingContainer) {
        const roundedRating = Math.round(averageRating);
        let chilesHTML = '';
        for (let i = 1; i <= 5; i++) {
            chilesHTML += `<i class="bi ${i <= roundedRating ? 'bi-chile-fill text-danger' : 'bi-chile'}"></i>`;
        }
        ratingContainer.innerHTML = chilesHTML;
    }
    const reviewsCountEl = document.getElementById('cantidadReseñas');
    if(reviewsCountEl){
        reviewsCountEl.querySelector('span').textContent = `${totalRatings} reseñas`;
    }
}

async function displayReviews(postsData) {
    


 // 1) Get container safely
  const reviewsContainer = document.getElementById("reviews");
  if (!reviewsContainer) {
    console.warn('⚠️ #reviews not found in DOM');
    return;
  }

  // 2) Normalize data: support both an array OR an object with .content
  const reviews = (Array.isArray(postsData) ? postsData : postsData?.content) ?? [];

  // 3) Empty state
  if (reviews.length === 0) {
    reviewsContainer.innerHTML = '<p class="text-muted">No reviews yet.</p>';
    return;
  }
    reviewsContainer.innerHTML = reviews.map(post => {
    
        console.log(postUser);
        const postDate = new Date(post.createdAt).toLocaleDateString('es-MX');
        return `
            <div class="col-12 col-md-6">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <img src="${post.authorAvatarUrl || 'assets/default-avatar.png'}" alt="avatar" class="rounded-circle me-2" width="40" height="40">
                            <div>
                                <h6 class="card-title mb-0">${post.authorName}</h6>
                                <small class="text-muted">${postDate}</small>
                            </div>
                        </div>
                        <p class="card-text">${post.content}</p>
                    </div>
                </div>
            </div>`;
    }).join('');
}


// ---------- NUEVA FUNCIÓN AÑADIDA ----------
/**
 * Muestra el estado (Abierto/Cerrado) del negocio.
 * Muestra un botón 'toggle' si el usuario es el dueño.
 * Muestra un indicador estático si es un visitante.
 * @param {boolean} esDueno - Si el usuario logueado es dueño del perfil.
 * @param {boolean} negocioAbierto - El estado 'isActive' del negocio según la API.
 */
function displayBusinessStatus(esDueno, negocioAbierto) {
    const contenedor = document.getElementById("negocioOpenClose");
    if (!contenedor) return;
    
    // Usamos 'let' para poder actualizar el estado si el dueño hace clic
    let estadoActual = negocioAbierto; 

    if (esDueno) {
        contenedor.innerHTML = `
            <div class="card-toggle" id="toggleNegocio" title="Clic para cambiar estado">
                <div class="inner-card ${estadoActual ? "" : "flipped"}">
                    <div class="front">OPEN</div>
                    <div class="back">CLOSED</div>
                </div>
            </div>
        `;
        
        // Agregar evento para voltear
        const card = document.getElementById("toggleNegocio");
        card.addEventListener("click", () => {
            // (Aquí podrías agregar una llamada a la API para guardar el estado)
            const innerCard = card.querySelector(".inner-card");
            innerCard.classList.toggle("flipped");
            estadoActual = !estadoActual;
            console.log("Nuevo estado del negocio:", estadoActual ? "Abierto" : "Cerrado");
        });
    } else {
        // Visitante: Muestra un indicador estático
        contenedor.innerHTML = `
            <span class="badge ${estadoActual ? "text-bg-success" : "text-bg-danger"}" style="font-size: 1rem; padding: 0.8em;">
                ${estadoActual ? "ABIERTO" : "CERRADO"}
            </span>
        `;
    }
}




// --- Función Principal de Carga (MODIFICADA) ---

async function loadProfileData() {
    const businessId = await getBusinessId();
    const mainContainer = document.getElementById('business_profile');
    
    // Obtenemos el ID del usuario logueado desde localStorage
    const loggedInUserId = localStorage.getItem("userId");
    
    // Comparamos si el usuario logueado es el dueño de este perfil
    const esDueno = (loggedInUserId === businessId);

    try {
        const [
            businessData, 
            addressData, 
            hoursData, 
            ratingData, 
            rawPostsData
        ] = await Promise.all([
            // --- ¡CAMBIO IMPORTANTE! ---
            // Ahora también "atrapamos" el error de las llamadas principales
            // para que no detengan el Promise.all si fallan (ej. 404)
            getBusinessById(businessId).catch(err => {
                console.error("Falló getBusinessById:", err);
                return null; // Devuelve null si no se encuentra
            }),
            getUserAddress(businessId).catch(err => {
                console.error("Falló getUserAddress:", err);
                return null;
            }),
            getHoursByBusiness(businessId).catch(err => {
                console.error("Falló getHoursByBusiness:", err);
                return null;
            }),
            
            // Estas ya tenían el .catch para los errores 500
            getBusinessRating(businessId).catch(err => {
                console.error("Falló getBusinessRating (Error 500):", err);
                return null;
            }),
            listBusinessPosts(businessId, 0, 4).catch(err => {
                console.error("Falló listBusinessPosts (Error 500):", err);
                return null; 
            })
            
        ]);

        // --- ¡LÓGICA DE VALIDACIÓN PRINCIPAL! ---
        // Esta es la validación que solicitaste.
        // Si businessData es nulo (porque falló o no se encontró),
        // lanzamos un error para ir al bloque catch y mostrar el error.
        if (!businessData || !businessData.user) {
            console.error("No se pudo cargar la información principal del negocio (businessData es nulo o no tiene usuario).");
            throw new Error("El perfil del negocio no se encontró.");
        }

        // --- Si llegamos aquí, businessData SÍ es válido ---

        // Obtenemos el estado real del negocio
        const negocioAbierto = businessData.isActive;
        
        const postsData = rawPostsData?.content ?? []; // <-- make it iterable
        // 1. Mostramos la info principal (que sabemos que existe)
        displayBusinessInfo(businessData);
        displayBusinessStatus(esDueno, negocioAbierto);

        // 2. Mostramos el resto de la información SÓLO SI existe
        if (addressData) {
            displayAddress(addressData);
        }
        if (hoursData) {
            displayHours(hoursData);
        }
        if (ratingData) {
            displayRating(ratingData);
        }
        if (postsData) {
            displayReviews(postsData);
        }
        
    } catch (error) { // El 'throw new Error' de arriba nos mandará aquí
        console.error("Error final al cargar el perfil:", error.message);
        mainContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <strong>Error:</strong> No se pudo cargar el perfil. 
                Es posible que el negocio no exista o haya un problema con el servidor.
            </div>`;
    }
}

// --- Punto de Entrada ---
document.addEventListener('DOMContentLoaded', loadProfileData);
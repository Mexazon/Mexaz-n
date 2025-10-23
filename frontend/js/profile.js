import {renderPepperRating} from "./peppers-rendering.js";
import {existentUsers} from "./loadData.js";

const params = new URLSearchParams(window.location.search);
const currentUserId = params.get('id');

let currentUser;


let btn;

if(localStorage.getItem("userId") == currentUserId){
    btn = '<button data-bs-toggle="modal" data-bs-target="#editprofile" class="btn btn-outline-secondary btn-sm">Editar Perfil</button>';
    currentUser = logedUser; 
}
else{
    btn=" ";
    currentUser = existentUsers.find(u => u.id == currentUserId)
}


const publications = JSON.parse(localStorage.getItem("publications")) || [];

const currentReviews = currentUser
  ? publications.filter(card => card.usuario.id === currentUser.id)
  : [];

document.addEventListener("DOMContentLoaded", () => {
    let profileReviews = document.getElementById("user-posts");
    const profileContent = document.getElementById("profile-data");
    profileContent.innerHTML = `
        <div class="card shadow-sm mb-3 h-75 d-flex flex-column justify-content-center">
            <div class="card-body text-center d-flex flex-column justify-content-center align-items-center">
              <img src="${currentUser.avatar}" class="rounded-circle mb-3" alt="Profile" width="100" height="100">
              <h4 class="mb-1">${currentUser.name}</h4>
              <p class="text-muted mb-3">${currentUser.bioDescription}</p>

              <div class="d-flex align-items-center justify-content-center mb-3">
                <div class="px-3">
                  <h6 class="mb-0">10</h6><small class="text-muted">Reseñas</small>
                </div>
              </div>

              <div class="d-flex justify-content-center gap-2 mb-3">
                ${btn}
              </div>
            </div>
            <div class="border-top px-3 py-2 d-flex justify-content-between text-muted small">
                <span>${currentUser.dateRegistered}</span>
                <span><i class="bi bi-geo-alt"></i> ${currentUser.city}, México</span>
            </div>
        </div> 
          
        <div class="card h-50 d-flex card-business">
        <div class="card-header">
            <strong>Favorito</strong>
        </div>
        <img src="https://picsum.photos/seed/${335577*Math.random()}/320/240" alt="IMG" style="height: 220px;width: 100%;object-fit: cover;">
        <div class="card-body p-2">
            <h6 class="card-title mb-1 text-truncate">Tortas Bertha</h6>
            <div class="pepper-rating small mb-1"></div>
        </div>
        <div class="card-footer border-1 pt-0 mt-auto text-end">
            <small class="text-muted">24 reseñas</small>
        </div>
        </div>
    `;  

    renderPepperRating(profileContent.querySelector('.pepper-rating'), 5, 5);   
    let currentReview;

    for(let review of currentReviews){
        
        currentReview = document.createElement('div');
        
        currentReview.innerHTML =`
            <div class="card shadow-sm mb-3 border border-dark-subtle bg-cebolla card-review">
                <div class="card-header">
                    <div class="d-flex align-items-center gap-2 mb-1 flex-wrap text-truncate">
                    <img src="${currentUser.avatar}" 
                        alt="avatar" 
                        class="rounded-circle" 
                        style="width:28px; height:28px; object-fit:cover;">
                    <strong>@${currentUser.name}</strong>
                    <span class="text-muted small text-truncate">hizo una reseña a un nuevo puesto</span>
                    </div>
                </div>
                <div class="card-body d-flex flex-row-reverse align-items-start gap-3 p-3">
                <img src="${review.foto}" 
                    alt="foto reseña" 
                    class="rounded img-fluid"
                    style="max-width: 140px; height: auto; object-fit: cover;">

                <div class="flex-grow-1 min-w-0 text-break">
                    <div class="fw-semibold text-truncate">${review.lugar}</div>

                    <div class="pepper-rating" aria-label="picante"></div>
                    <p class="mt-2 mb-2 small text-muted review-text">${review.descripcion}</p>
                    <div class="d-flex align-items-center gap-3 small flex-wrap">
                        <span class="text-muted">hace 2 horas</span>
                    </div>
                </div>
                </div>
            </div>`
            
  renderPepperRating(currentReview.querySelector('.pepper-rating'), review.calificacion, 5);      
  profileReviews.prepend(currentReview)
    }
    
});


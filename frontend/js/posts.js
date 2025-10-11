//importo la clase Review
import { Review } from "./classes.js";
import  {resetForm,reviewForm}  from "./modal-form.js";
import {renderPepperRating} from "./peppers-rendering.js";

//objeto usuario basico (Cambiar al modelo establecido en el UML)"
const user = {
  displayName: 'Jay Co',
  avatar: 'https://i.pravatar.cc/200?img=12',
};

//Arreglo de objetos tipo 'Review'
let post;
let postsList = (JSON.parse(localStorage.getItem("publications")) || []); 



//Funcion para crear una etiqueta html con un atributo en especifico
const create = (tag, attrs={}) => Object.assign(document.createElement(tag), attrs);

const list = document.getElementById("reviews");



reviewForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(reviewForm);

    post=new Review(2,formData.get("puesto"),formData.get("rating"),formData.get("resenia"),Date.now());
    postsList.push(post);
    localStorage.setItem("publications", JSON.stringify(postsList));

    renderReview(post);
        //Enviar datos al modelo
    resetForm();
    
});

//Funcion agarra los objetos tipo Review del arreglo posts y los inserta en un string html para luego ser insertado en el div "Reviews"
//Agarra como parametro una lista de reviews
function renderReview(r,size){
    //Se crea un elemento div con la clase 'review'
    const card = create('div', { className: `${size}`});
    //Asigno el formato completo de la tarjeta con los datos del elemento Review
    card.innerHTML = `
    <div class="card shadow-sm mb-3 border border-dark-subtle bg-cebolla">
      <div class="card-header">
        <div class="d-flex align-items-center gap-2 mb-1 flex-wrap text-truncate">
        <img src="${user.avatar}" 
             alt="avatar" 
             class="rounded-circle" 
             style="width:28px; height:28px; object-fit:cover;">
        <strong>@${user.displayName}</strong>
        <span class="text-muted small text-truncate">hizo una reseña a un nuevo puesto</span>
      </div>
      </div>
      <div class="card-body d-flex flex-row-reverse align-items-start gap-3 p-3">
    <img src="${r.foto}" 
         alt="foto reseña" 
         class="rounded img-fluid"
         style="max-width: 140px; height: auto; object-fit: cover;">

    <div class="flex-grow-1 min-w-0 text-break">
      

      <div class="fw-semibold text-truncate">${r.lugar}</div>

      <div class="pepper-rating" aria-label="picante">
      </div>

      <p class="mt-2 mb-2 small text-muted review-text">${r.descripcion}</p>

      <div class="d-flex align-items-center gap-3 small flex-wrap">
        <span class="text-muted">hace 2 horas</span>
      </div>
    </div>
  </div>
  </div>`;

    //Inserto el elemento card al div principal de "Reviews"
    list.appendChild(card);
    // Pinta el rating de esa tarjeta 
    renderPepperRating(card.querySelector('.pepper-rating'), r.calificacion, 5);
}

function renderAllReviews(list){
  for(let element of list){
    renderReview(element,'col-12 col-xl-4 col-lg-6');
  }
}

renderAllReviews(postsList);





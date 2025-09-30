//importo la clase Review
import { Review } from "./classes.js";
//importo las rutas de los chiles 
import redPepper from '../assets/red-pepper.svg';
import blackPepper from '../assets/black-pepper.svg';

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

//Funcion que decide que imagen de chile pone 
function pepperImg(filled = true){
  const src = filled ? redPepper : blackPepper;
  return `<img src="${src}" alt="nivel picante" />`;
}

//Funcion que imprime los chiles en el container que le pasen
function renderPepperRating(container, value, max = 5){
  const v = Math.max(0, Math.min(max, value|0));
  let html = '';
  for (let i = 1; i <= max; i++) html += pepperImg(i <= v);
  container.innerHTML = html;
}

let addButton = document.getElementById("btnNewReview")

addButton.addEventListener("click", function(e){
    post=new Review(2,"Coyoacan",4,"Muy Buenos",Date.now());
    postsList.push(post);
    localStorage.setItem("publications", JSON.stringify(postsList));
    renderReview(post);
});

//Funcion agarra los objetos tipo Review del arreglo posts y los inserta en un string html para luego ser insertado en el div "Reviews"
//Agarra como parametro una lista de reviews
function renderReview(r) {

    //Se crea un elemento div con la clase 'review'
    const card = create('div', { className: 'review' });
    //Asigno el formato completo de la tarjeta con los datos del elemento Review
    card.innerHTML = `
      <div class="d-flex gap-3">
        <img src="${r.foto}" alt="foto reseña">
        <div class="flex-grow-1">
          <div class="d-flex align-items-center gap-2 mb-1">
            <img src="${user.avatar}" alt="avatar" class="rounded-circle" style="width:28px; height:28px; object-fit:cover;">
            <strong>@${user.displayName}</strong>
            <span class="text-muted small">hizo una reseña a un nuevo puesto</span>
          </div>
          <div class="fw-semibold">${r.lugar}</div>
          <div class="pepper-rating" aria-label="picante"></div>
          <p class="mt-2 mb-2">${r.descripcion}</p>
          <div class="d-flex align-items-center gap-3 small">
            <button class="btn btn-sm btn-outline-success btn-like" data-id="${r.idResenia}">
              <i class="bi bi-heart"></i> <span>${r.likes}</span>
            </button>
            <span class="text-muted">hace ${r.hoursAgo} horas</span>
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
    renderReview(element);
  }
    
  
}

renderAllReviews(postsList);





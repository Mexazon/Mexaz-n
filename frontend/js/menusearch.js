import {renderPepperRating} from "./peppers-rendering.js";
import tacos from '../assets/tacos.svg';
import elotes from '../assets/elotes.svg';
import tamales from '../assets/tamales.svg';
import burritos from '../assets/burritos.svg';
import pozole from '../assets/pozoles.svg';
import {existentUsers} from './loadData.js'
import { Schedule,isOpen } from "./classes.js";
import { Business } from "./classes.js";
// --- DATA ---

const normalSchedule = [
    new Schedule("", ""),
    new Schedule("08:00", "18:00"),
    new Schedule("08:00", "18:00"),
    new Schedule("08:00", "18:00"),
    new Schedule("08:00", "18:00"),
    new Schedule("", ""),
    new Schedule("", "")
]
isOpen(normalSchedule);

export const foodData = [
  {name: 'Tacos El Güero',location: 'Benito Juarez'},
  {name: 'Elotes Doña Mary', location: 'Benito Juarez'},
  {name: 'Tamales Oaxaqueños',location: 'Coyoacán'},
  {name: 'Burritos Express', location: 'Cuauhtémoc' },
  {name: 'Pozolería La Tradicional',location: 'Benito Juarez' },
  {name: 'Tacos de Canasta Lupita', location: 'Coyoacán'},
  {name: 'Elotes Don Pepe', location: 'Benito Juarez'},
  {name: 'Tamales de Rajas', location: 'Benito Juarez'},
  {name: 'Burrito Loco', location: 'Benito Juarez'},
  {name: 'Pozole Rojo y Verde', location: 'Cuauhtémoc'},
  {name: 'Tacos al Pastor El Rey', location: 'Benito Juarez'},
  {name: 'Esquites La Güera', location: 'Coyoacán'},
];

function createBusinessesFromFoodData() {
  const businesses = foodData.map((food, index) => {
    const randomCp = Math.floor(10000 + Math.random() * 89999); // CP aleatorio
    const email = `${food.name.toLowerCase().replace(/\s+/g, '')}@ejemplo.com`;
    const password = `business${index + 1}`;
    const dateRegistered = new Date().toISOString().split("T")[0];
    const schedule = normalSchedule;

    return new Business(
      food.name,          // name
      food.location,      // city
      randomCp,           // cp
      email,              // email
      password,           // password
      dateRegistered,     // dateRegistered
      schedule            // schedule
    );
  });

  return businesses;
}
const newBusiness = createBusinessesFromFoodData();
// Ejemplo de uso:
existentUsers.push(...newBusiness);

//console.log(existentUsers)

const businesses = existentUsers.filter(user =>{
    return user.role == "business";
});

const categories = [
  { name: 'todos', icon: 'bi-grid-fill' }, // Changed to icon
  { name: 'tacos', image: tacos },
  { name: 'elotes', image: elotes },
  { name: 'tamales', image: tamales },
  { name: 'burritos', image: burritos },
  { name: 'pozole', image: pozole },
];

// --- STATE MANAGEMENT ---
let selectedCategory = 'todos';
let isFilteringOpen = false;
let selectedLocation = 'Benito Juarez';
let searchTerm = '';

const foodCardContainer = document.getElementById('food-card-container');
const navbarContainer = document.getElementById('navbar-container');
// --- RENDER FUNCTIONS asdN---



function renderNavbar() {
    
    

    const categoryButtons = categories.map(cat => {
        const isActive = cat.name === selectedCategory ? 'active' : '';
        let content;
        if (cat.icon) {
            content = `<i class="bi ${cat.icon}"></i>`;
        } else {
            content = `<img src="${cat.image}" alt="${cat.name}">`;
        }

        return `
            <button class="btn btn-light category-btn ${isActive}" data-category="${cat.name}" title="${cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}">
                ${content}
            </button>
        `;
    }).join('');
    navbarContainer.innerHTML = ``
    navbarContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center flex-wrap gy-3">
            
            <div class="input-group" style="flex-basis: 300px;">
                <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
                <input type="text" id="search-input" class="form-control border-start-0 top-search-bar" placeholder="Buscar...">
            </div>

   
            <div class="d-flex justify-content-center flex-grow-1 gap-2">
                ${categoryButtons}
            </div>


            <div class="d-flex align-items-center justify-content-end gap-2" style="flex-basis: 340px;">
                <div class="dropdown">
                    <button class="btn btn-outline-secondary dropdown-toggle rounded-pill" type="button" id="locationDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi-geo-alt"></i> ${selectedLocation}
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="locationDropdown">
                        <li><a class="dropdown-item" href="#" data-location="Benito Juarez">Benito Juarez</a></li>
                        <li><a class="dropdown-item" href="#" data-location="Coyoacán">Coyoacán</a></li>
                        <li><a class="dropdown-item" href="#" data-location="Cuauhtémoc">Cuauhtémoc</a></li>
                    </ul>
                </div>
                <button id="open-now-btn" class="btn btn-outline-secondary rounded-pill">ABIERTO AHORA</button>
            </div>
        </div>
    `;
}

function renderFoodCards() {
    foodCardContainer.innerHTML = ''; // Clear existing cards

    const filteredData = businesses.filter(card => {
        const categoryMatch = selectedCategory === 'todos' || card.category === selectedCategory;
        const openMatch = !isFilteringOpen || card.isOpen == true;
        const locationMatch = card.location === selectedLocation;
        const searchMatch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
        return categoryMatch && openMatch && locationMatch && searchMatch;
    });

    if (filteredData.length === 0) {
        foodCardContainer.innerHTML = '<p class="text-center w-100">No se encontraron resultados.</p>';
        return;
    }

    filteredData.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'col';
        cardElement.innerHTML = `
           <div class="card h-100 d-flex card-business">
            <img src="${card.avatar}" alt="IMG" class="card-img-top img-shrink">
            <div class="card-body p-2">
                <h6 class="card-title mb-1 text-truncate">${card.name}</h6>
                <div class="pepper-rating small mb-1"></div>
            </div>

            <!-- Footer aligned to the right -->
            <div class="card-footer border-1 pt-0 mt-auto text-end">
                <small class="text-muted">${card.reviews} reseñas</small>
            </div>
            </div>
        `;
        renderPepperRating(cardElement.querySelector('.pepper-rating'), card.rating, 5);
        foodCardContainer.appendChild(cardElement);
    });
}

// --- EVENT LISTENERS & INITIALIZATION ---

function initializeEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderFoodCards();
    });

    // Category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCategory = btn.dataset.category;
            renderFoodCards();
        });
    });

    // Location dropdown
    const locationDropdownItems = document.querySelectorAll('.dropdown-item[data-location]');
    const locationDropdownButton = document.getElementById('locationDropdown');
    locationDropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            selectedLocation = item.dataset.location;
            locationDropdownButton.innerHTML = `<i class="bi-geo-alt"></i> ${selectedLocation}`;
            renderFoodCards();
        });
    });

    // Open Now button
    const openNowButton = document.getElementById('open-now-btn');
    openNowButton.addEventListener('click', () => {
        isFilteringOpen = !isFilteringOpen;
        openNowButton.classList.toggle('active');
        renderFoodCards();
    });

    // Click to open details
    foodCardContainer.addEventListener('click', (e) => {
    const cardEl = e.target.closest('.card');
    if (!cardEl) return;

    const payload = {
        id: cardEl.dataset.id,
        name: cardEl.dataset.name,
        reviews: Number(cardEl.dataset.reviews),
        rating: Number(cardEl.dataset.rating)
    };

    // Example: pass data to detail page
    sessionStorage.setItem('selectedCard', JSON.stringify(payload));
    location.href = 'business_profile.html';
    });

}

// --- MAIN EXECUTION ---
document.addEventListener('DOMContentLoaded', () => {
    if(navbarContainer != null || foodCardContainer != null){
  renderNavbar();
  renderFoodCards();
  initializeEventListeners();
    }
});

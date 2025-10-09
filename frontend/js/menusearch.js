//Estructura de objetos con los iconos y categorias de alimentos
const categories = [
  { name: 'todos', icon: 'bi-grid-fill' }, // Changed to icon
  { name: 'tacos', image: '/tacos.svg' },
  { name: 'elotes', image: '/elotes.svg' },
  { name: 'tamales', image: '/tamal.svg' },
  { name: 'burritos', image: '/burrito.svg' },
  { name: 'pozole', image: '/pozole.svg' },
];



// --- STATE MANAGEMENT ---
let selectedCategory = 'todos';
let isFilteringOpen = false;
let selectedLocation = 'Benito Juarez';
let searchTerm = '';


// --- RENDER FUNCTIONS ---



function renderNavbar() {
    const navbarContainer = document.getElementById('navbar-container');

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

    navbarContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center flex-wrap gy-3">
            <!-- Search Bar -->
            <div class="input-group" style="flex-basis: 300px;">
                <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
                <input type="text" id="search-input" class="form-control border-start-0 top-search-bar" placeholder="Buscar...">
            </div>

            <!-- Category Filters -->
            <div class="d-flex justify-content-center flex-grow-1 gap-2">
                ${categoryButtons}
            </div>

            <!-- Right Controls -->
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
    const foodCardContainer = document.getElementById('food-card-container');
    foodCardContainer.innerHTML = ''; // Clear existing cards

    const filteredData = foodData.filter(card => {
        const categoryMatch = selectedCategory === 'todos' || card.category === selectedCategory;
        const openMatch = !isFilteringOpen || card.status === 'open';
        const locationMatch = card.location === selectedLocation;
        const searchMatch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
        return categoryMatch && openMatch && locationMatch && searchMatch;
    });

    if (filteredData.length === 0) {
        foodCardContainer.innerHTML = '<p class="text-center w-100">No se encontraron resultados.</p>';
        return;
    }

    filteredData.forEach(card => {
        const chiliIcons = Array.from({ length: 5 }, (_, i) =>
            i < card.rating
                ? '<i class="bi bi-wind"></i>'
                : '<i class="bi bi-wind text-muted"></i>'
        ).join('');

        const cardElement = document.createElement('div');
        cardElement.className = 'col';
        cardElement.innerHTML = `
            <div class="food-card">
                <div class="food-card-img">IMG</div>
                <div class="food-card-body">
                    <h5 class="food-card-title">${card.name}</h5>
                    <div class="rating-chilis">${chiliIcons}</div>
                    <small class="text-muted">${card.reviews} reseñas</small>
                </div>
            </div>
        `;
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
}

// --- MAIN EXECUTION ---
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFoodCards();
  initializeEventListeners();
});

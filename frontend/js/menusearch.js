import { renderPepperRating } from "./peppers-rendering.js";
import tacos from "../assets/tacos.svg";
import elotes from "../assets/elotes.svg";
import tamales from "../assets/tamales.svg";
import burritos from "../assets/burritos.svg";
import pozole from "../assets/pozoles.svg";
import { searchBusinesses } from "./controllers/getControllers.js";

// --- CATEGORÍAS VISUALES (las que ve el usuario)
const categories = [
  { name: "todos", icon: "bi-grid-fill" },
  { name: "tacos", image: tacos },
  { name: "elotes", image: elotes },
  { name: "tamales", image: tamales },
  { name: "burritos", image: burritos },
  { name: "pozole", image: pozole },
];

// --- STATE ---
let selectedCategory = "todos";
let isFilteringOpen = false; // (no se usa con backend por ahora)
let selectedLocation = "Benito Juárez"; // sin acentos para matchear seed
let searchTerm = "";
let lastPage = null; // guardamos la última Page<BusinessCard>

// --- DOM ---
const foodCardContainer = document.getElementById("food-card-container");
const navbarContainer = document.getElementById("navbar-container");

// --- UTILS ---
const stripAccents = (s) => s.normalize("NFD").replace(/\p{Diacritic}/gu, ""); // por si usas acentos en la UI

function renderNavbar() {
  const categoryButtons = categories
    .map((cat) => {
      const isActive = cat.name === selectedCategory ? "active" : "";
      const content = cat.icon
        ? `<i class="bi ${cat.icon}"></i>`
        : `<img src="${cat.image}" alt="${cat.name}">`;

      return `
      <button class="btn btn-light category-btn ${isActive}"
              data-category="${cat.name}"
              title="${cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}">
        ${content}
      </button>
    `;
    })
    .join("");

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
          <button class="btn btn-outline-secondary dropdown-toggle rounded-pill"
                  type="button" id="locationDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi-geo-alt"></i> ${selectedLocation}
          </button>
            <ul class="dropdown-menu" aria-labelledby="locationDropdown">
                <li><a class="dropdown-item" href="#" data-location="Álvaro Obregón">Álvaro Obregón</a></li>
                <li><a class="dropdown-item" href="#" data-location="Azcapotzalco">Azcapotzalco</a></li>
                <li><a class="dropdown-item" href="#" data-location="Benito Juárez">Benito Juárez</a></li>
                <li><a class="dropdown-item" href="#" data-location="Coyoacán">Coyoacán</a></li>
                <li><a class="dropdown-item" href="#" data-location="Cuauhtémoc">Cuauhtémoc</a></li>
                <li><a class="dropdown-item" href="#" data-location="Gustavo A. Madero">Gustavo A. Madero</a></li>
                <li><a class="dropdown-item" href="#" data-location="Iztapalapa">Iztapalapa</a></li>
                <li><a class="dropdown-item" href="#" data-location="Miguel Hidalgo">Miguel Hidalgo</a></li>
                <li><a class="dropdown-item" href="#" data-location="Tlalpan">Tlalpan</a></li>
                <li><a class="dropdown-item" href="#" data-location="Tláhuac">Tláhuac</a></li>
                <li><a class="dropdown-item" href="#" data-location="Venustiano Carranza">Venustiano Carranza</a></li>
                <li><a class="dropdown-item" href="#" data-location="Xochimilco">Xochimilco</a></li>
            </ul>
        </div>
        <button id="open-now-btn" class="btn btn-outline-secondary rounded-pill">ABIERTO AHORA</button>
      </div>
    </div>
  `;
}

function renderFoodCards(pageObj) {
  foodCardContainer.innerHTML = "";

  if (!pageObj || !pageObj.content || pageObj.content.length === 0) {
    foodCardContainer.innerHTML =
      '<p class="text-center w-100">No se encontraron resultados.</p>';
    return;
  }

  pageObj.content.forEach((card) => {
    const reviews = Number(card.reviewsCount ?? 0);
    const rating = Number(card.rating ?? 0);

    const el = document.createElement("div");
    el.className = "col";
    el.innerHTML = `
      <div class="card h-100 d-flex card-business"
           data-id="${card.id}"
           data-name="${card.name ?? ""}"
           data-reviews="${reviews}"
           data-rating="${rating}">
        <img src="${card.avatarUrl ?? "assets/default-business.png"}"
             alt="${card.name ?? "Negocio"}"
             class="card-img-top img-shrink">
        <div class="card-body p-2">
          <h6 class="card-title mb-1 text-truncate">${
            card.name ?? "Negocio"
          }</h6>
          <div class="pepper-rating small mb-1"></div>
        </div>
        <div class="card-footer border-1 pt-0 mt-auto text-end">
          <small class="text-muted">${reviews} reseñas</small>
        </div>
      </div>
    `;
    renderPepperRating(el.querySelector(".pepper-rating"), rating, 5);
    foodCardContainer.appendChild(el);
  });
}

async function fetchAndRender() {
  // categories: si es 'todos' no enviamos nada; si no, enviamos 1 categoría
  const cats = selectedCategory === "todos" ? [] : [selectedCategory];

  const page = await searchBusinesses({
    q: searchTerm.trim(),
    alcaldia: selectedLocation, // por si mandas acentos
    categories: cats, // backend matchea por nombre (lower) de MenuCategory
    page: 0,
    size: 20,
    // sort: dejamos vacío para que el back use rating,desc
  });

  lastPage = page;
  renderFoodCards(page);
}

function initializeEventListeners() {
  // Search con debounce
  const searchInput = document.getElementById("search-input");
  let t;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(t);
    searchTerm = e.target.value;
    t = setTimeout(fetchAndRender, 250);
  });

  // Categorías
  const categoryButtons = document.querySelectorAll(".category-btn");
  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedCategory = btn.dataset.category;
      fetchAndRender();
    });
  });

  // Alcaldía
  const locationDropdownItems = document.querySelectorAll(
    ".dropdown-item[data-location]"
  );
  const locationDropdownButton = document.getElementById("locationDropdown");
  locationDropdownItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      selectedLocation = item.dataset.location;
      locationDropdownButton.innerHTML = `<i class="bi-geo-alt"></i> ${selectedLocation}`;
      fetchAndRender();
    });
  });

  // Abierto ahora (por ahora UI-only)
  const openNowButton = document.getElementById("open-now-btn");
  openNowButton.addEventListener("click", () => {
    isFilteringOpen = !isFilteringOpen;
    openNowButton.classList.toggle("active");
    // No filtramos por horario aún (el backend no lo devuelve), así que sólo refrescamos
    fetchAndRender();
  });

  // Click card → detalle
  foodCardContainer.addEventListener("click", (e) => {
    const cardEl = e.target.closest(".card");
    if (!cardEl) return;

    const payload = {
      id: cardEl.dataset.id,
      name: cardEl.dataset.name,
      reviews: Number(cardEl.dataset.reviews),
      rating: Number(cardEl.dataset.rating),
    };

    sessionStorage.setItem("selectedCard", JSON.stringify(payload));
    location.href = "business_profile.html";
  });
}

// MAIN
document.addEventListener("DOMContentLoaded", async () => {
  if (!navbarContainer || !foodCardContainer) return;
  renderNavbar();
  initializeEventListeners();
  await fetchAndRender(); // primera carga
});

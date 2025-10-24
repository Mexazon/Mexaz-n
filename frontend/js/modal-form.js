/** 
 * Modal-form.js 
 * Controla la creación de reseñas en el modal
**/

import { getFeedPosts } from "./controllers/getControllers.js";
import { createPost } from "./controllers/postControllers.js";

// Referencias al DOM
const reviewForm = document.getElementById("reviewForm");
const postalSelect = document.getElementById("postalCode");
const locationSelect = document.getElementById("location");
const reviewText = document.getElementById("reviewText");
const ratingInput = document.getElementById("rating");
const submitBtn = document.getElementById("submitBtn");

// Calificación visual (chiles)
const ratingImages = document.querySelectorAll(".star");

// Inicializa rating visual
ratingImages.forEach(img => {
  img.addEventListener("click", () => {
    const rating = img.getAttribute("data-rating");
    ratingInput.value = rating;
    updatePeppers(rating);
    reviewText.disabled = false;
    submitBtn.disabled = false;
  });
});

function updatePeppers(value) {
  ratingImages.forEach(img => {
    const chili = parseInt(img.dataset.rating);
    img.src = chili <= value ? "assets/red-pepper.svg" : "assets/black-pepper.svg";
  });
}

// Envío de formulario
reviewForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(reviewForm);

  const newReview = {
    userId: 1, // Temporal, en el futuro se obtendrá del login
    businessId: formData.get("puesto"),
    rating: parseInt(formData.get("rating")),
    comment: formData.get("resenia"),
  };

  try {
    const created = await createPost(newReview);
    console.log("✅ Reseña creada:", created);

    // Limpia el formulario
    reviewForm.reset();
    updatePeppers(0);
    reviewText.disabled = true;
    submitBtn.disabled = true;

    // Actualiza el feed inmediatamente
    const list = document.querySelector("#reviews");
    const postElement = renderReview(created);
    list.prepend(postElement);

  } catch (error) {
    console.error("❌ Error creando reseña:", error);
    alert("No se pudo publicar la reseña.");
  }
});

// Render dinámico para el nuevo post
function renderReview(post) {
  const div = document.createElement("div");
  div.classList.add("col-12", "col-lg-4");
  div.innerHTML = `
    <div class="card shadow-sm p-3">
      <div class="d-flex align-items-center mb-2">
        <img src="assets/user-default.svg" class="rounded-circle me-2" width="40" height="40">
        <strong>Usuario #${post.userId}</strong>
      </div>
      <p class="mb-2">${post.comment}</p>
      <div class="text-warning">
        ${"🌶️".repeat(post.rating)}
      </div>
    </div>
  `;
  return div;
}

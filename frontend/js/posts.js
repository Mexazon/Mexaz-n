/** 
 * Posts.js 
 * Carga y muestra las reseñas existentes desde la API
**/

import { getFeedPosts } from "./controllers/getControllers.js";

// Contenedor de reseñas
const list = document.querySelector("#reviews");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const posts = await getFeedPosts();
    if (!posts || posts.length === 0) {
      list.innerHTML = `<p class="text-muted text-center">No hay reseñas aún. ¡Sé el primero en publicar una!</p>`;
      return;
    }

    posts.forEach((post) => {
      const postElement = renderReview(post);
      list.appendChild(postElement);
    });
  } catch (error) {
    console.error("❌ Error cargando reseñas:", error);
    list.innerHTML = `<p class="text-danger text-center">Error al cargar reseñas</p>`;
  }
});

// Función para renderizar cada reseña
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

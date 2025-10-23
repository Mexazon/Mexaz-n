const BASE_URL_POSTS = "http://localhost:8080/api/posts";

/**
 * 📘 Obtener una reseña por su ID
 * Método: GET /api/posts/{postId}
 * Devuelve los datos de la reseña si existe, o lanza un error si no se encuentra.
 */
export async function getPostById(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}posts/${postId}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Post not found");
    }
    return await response.json();
  } catch (err) {
    console.error("❌ getPostById:", err.message);
    throw err;
  }
}

/**
 * 📋 Listar reseñas de un negocio
 * Método: GET /api/businesses/{businessId}/posts?page=&size=
 * Retorna una página de reseñas asociadas a un negocio específico.
 */
export async function listBusinessPosts(businessId, page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_BASE_URL}businesses/${businessId}/posts?page=${page}&size=${size}`
    );
    if (!response.ok) throw new Error("Error fetching business posts");
    return await response.json();
  } catch (err) {
    console.error("❌ listBusinessPosts:", err.message);
    throw err;
  }
}

/**
 * 👤 Listar reseñas creadas por un usuario
 * Método: GET /api/users/{authorUserId}/posts?page=&size=
 * Permite obtener las reseñas escritas por un usuario determinado.
 */
export async function listUserPosts(authorUserId, page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_BASE_URL}users/${authorUserId}/posts?page=${page}&size=${size}`
    );
    if (!response.ok) throw new Error("Error fetching user posts");
    return await response.json();
  } catch (err) {
    console.error("❌ listUserPosts:", err.message);
    throw err;
  }
}

/**
 * 🌍 Feed global de reseñas
 * Método: GET /api/feed/posts?page=&size=
 * Devuelve las reseñas más recientes publicadas por todos los usuarios.
 */
export async function getFeedPosts(page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_BASE_URL}feed/posts?page=${page}&size=${size}`
    );
    if (!response.ok) throw new Error("Error fetching feed posts");
    return await response.json();
  } catch (err) {
    console.error("❌ getFeedPosts:", err.message);
    throw err;
  }
}

/**
 * ⭐ Obtener el rating agregado de un negocio
 * Método: GET /api/businesses/{businessId}/rating
 * Devuelve promedio, número total de reseñas y distribución por estrellas.
 */
export async function getBusinessRating(businessId) {
  try {
    const response = await fetch(`${API_BASE_URL}businesses/${businessId}/rating`);
    if (!response.ok) throw new Error("Error fetching business rating");
    return await response.json();
  } catch (err) {
    console.error("❌ getBusinessRating:", err.message);
    throw err;
  }
}

/**
 * ✍️ Crear una nueva reseña
 * Método: POST /api/posts
 * Envía un objeto CreatePostRequest (rating, contenido, businessId, etc.)
 * y devuelve la reseña creada.
 */
export async function createPost(postData) {
  try {
    const response = await fetch(`${API_BASE_URL}posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error creating post");
    }

    return await response.json();
  } catch (err) {
    console.error("❌ createPost:", err.message);
    throw err;
  }
}


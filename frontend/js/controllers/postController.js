/**
 * PostController
 * Maneja las operaciones CRUD para posts (reseñas de negocios)
 */

const BASE_URL_POSTS = "http://localhost:8080/api/posts";

/**
 * ---------- GET OPERATIONS ----------
 */

/**
 * GET → Obtiene un post por su ID.
 *
 * @param {number} postId - Identificador del post.
 * @returns {Promise<object|null>} - Objeto con los datos del post o null si no existe.
 */
export async function getPostById(postId) {
  try {
    const response = await fetch(`${BASE_URL_POSTS}/${postId}`);

    if (response.status === 404) {
      console.warn("⚠️ Post no encontrado");
      return null;
    }

    if (!response.ok) {
      throw new Error("Error obteniendo post");
    }

    const post = await response.json();
    console.log("✅ Post obtenido:", post);
    return post;

  } catch (error) {
    console.error("❌ Error en getPostById:", error.message);
    return null;
  }
}

/**
 * GET → Obtiene todos los posts de un autor específico.
 *
 * @param {number} userId - ID del autor.
 * @returns {Promise<Array>} - Lista de posts del autor.
 */
export async function getPostsByAuthor(userId) {
  try {
    const response = await fetch(`${BASE_URL_POSTS}/author/${userId}`);

    if (!response.ok) {
      throw new Error("Error obteniendo posts del autor");
    }

    const posts = await response.json();
    console.log(`✅ Posts del autor ${userId} obtenidos:`, posts.length);
    return posts;

  } catch (error) {
    console.error("❌ Error en getPostsByAuthor:", error.message);
    return [];
  }
}

/**
 * GET → Obtiene todos los posts de un negocio específico.
 *
 * @param {number} businessId - ID del negocio.
 * @returns {Promise<Array>} - Lista de posts del negocio.
 */
export async function getPostsByBusiness(businessId) {
  try {
    const response = await fetch(`${BASE_URL_POSTS}/business/${businessId}`);

    if (!response.ok) {
      throw new Error("Error obteniendo posts del negocio");
    }

    const posts = await response.json();
    console.log(`✅ Posts del negocio ${businessId} obtenidos:`, posts.length);
    return posts;

  } catch (error) {
    console.error("❌ Error en getPostsByBusiness:", error.message);
    return [];
  }
}

/**
 * GET → Obtiene todos los posts.
 *
 * @returns {Promise<Array>} - Lista de todos los posts.
 */
export async function getAllPosts() {
  try {
    const response = await fetch(BASE_URL_POSTS);

    if (!response.ok) {
      throw new Error("Error obteniendo posts");
    }

    const posts = await response.json();
    console.log("✅ Posts obtenidos:", posts.length);
    return posts;

  } catch (error) {
    console.error("❌ Error en getAllPosts:", error.message);
    return [];
  }
}

/**
 * GET → Obtiene posts filtrados por rating mínimo.
 *
 * @param {number} minRating - Rating mínimo (1-5).
 * @returns {Promise<Array>} - Lista de posts con rating >= minRating.
 */
export async function getPostsByMinRating(minRating) {
  try {
    const response = await fetch(`${BASE_URL_POSTS}?minRating=${minRating}`);

    if (!response.ok) {
      throw new Error("Error filtrando posts por rating");
    }

    const posts = await response.json();
    console.log(`✅ Posts con rating >= ${minRating} obtenidos:`, posts.length);
    return posts;

  } catch (error) {
    console.error("❌ Error en getPostsByMinRating:", error.message);
    return [];
  }
}

/**
 * ---------- POST OPERATIONS ----------
 */

/**
 * POST → Crea un nuevo post (reseña).
 *
 * @param {object} newPost - Datos del post a crear.
 * @param {number} newPost.rating - Calificación (1-5, obligatorio).
 * @param {string} newPost.description - Descripción del post (obligatorio).
 * @param {number} newPost.authorId - ID del usuario autor (obligatorio).
 * @param {number} newPost.businessId - ID del negocio reseñado (obligatorio).
 * @returns {Promise<object|null>} - Post creado o null si falla.
 */
export async function createPost(newPost) {
  try {
    const response = await fetch(BASE_URL_POSTS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`${errorData.error || "Error"}: ${errorData.message || "No se pudo crear el post"}`);
    }

    const createdPost = await response.json();
    console.log("✅ Post creado:", createdPost);
    return createdPost;

  } catch (error) {
    console.error("❌ Error creando post:", error.message);
    return null;
  }
}

/**
 * ---------- PUT OPERATIONS ----------
 */

/**
 * PUT → Actualiza un post existente.
 *
 * @param {number} postId - ID del post a actualizar.
 * @param {object} updateData - Datos a actualizar.
 * @param {number} [updateData.rating] - Nueva calificación (1-5).
 * @param {string} [updateData.description] - Nueva descripción.
 * @returns {Promise<object|null>} - Post actualizado o null si falla.
 */
export async function updatePost(postId, updateData) {
  try {
    const response = await fetch(`${BASE_URL_POSTS}/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error actualizando post");
    }

    const updated = await response.json();
    console.log("✅ Post actualizado:", updated);
    return updated;

  } catch (error) {
    console.error("❌ Error actualizando post:", error.message);
    return null;
  }
}

/**
 * ---------- DELETE OPERATIONS ----------
 */

/**
 * DELETE → Elimina un post por su ID.
 *
 * @param {number} postId - ID del post a eliminar.
 * @returns {Promise<boolean>} - true si se eliminó correctamente, false si falló.
 */
export async function deletePost(postId) {
  try {
    const response = await fetch(`${BASE_URL_POSTS}/${postId}`, {
      method: "DELETE"
    });

    if (response.status === 404) {
      console.warn("⚠️ Post no encontrado");
      return false;
    }

    if (!response.ok) {
      throw new Error("Error eliminando post");
    }

    console.log(`✅ Post ${postId} eliminado`);
    return true;

  } catch (error) {
    console.error("❌ Error eliminando post:", error.message);
    return false;
  }
}

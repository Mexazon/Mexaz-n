/**
 * Configuración global de endpoints
 **/
export const API_BASE_URL = "http://localhost:8080/api";

/** Obtener usuario por ID: GET /api/users/{userId} */
export async function getUserById(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);

    if (response.status === 404) throw new Error("User not found");
    if (!response.ok) throw new Error("Error fetching user");

    return await response.json();
  } catch (err) {
    console.error("❌ getUserById:", err.message);
    throw err;
  }
}

/** Verificar email: GET /api/users/exists?email=...  → devuelve true|false */
export async function checkEmailExists(email) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users/exists?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) throw new Error("Error checking email");

    const result = await response.json();
    return result.exists === true;
  } catch (err) {
    console.error("❌ checkEmailExists:", err.message);
    throw err;
  }
}

/**
 * PostalCodeCatalogController
 **/

/**
 * GET → Obtiene todas las colonias asociadas a un código postal.
 *
 * @param {string} postalCode - El código postal a consultar.
 * @returns {Promise<object>} - Objeto con el código postal y lista de colonias.
 */
export async function getColoniasByPostalCode(postalCode) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/postal-code-catalog?postalCode=${postalCode}`
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al consultar código postal");
    }
    const data = await response.json();
    return data.colonias ?? data; // return the array if present, else raw data
  } catch (error) {
    return null;
  }
}
/**
 * ---------- NEGOCIOS ----------
 */

/**
 * Obtiene un negocio con información resumida del usuario asociado.
 * @param {number} businessId
 * @returns {Promise<Object|null>} Objeto negocio o null si no existe.
 */
export async function getBusinessById(businessId) {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`);

    if (response.status === 404) return null; // negocio no encontrado
    if (!response.ok) throw new Error("Error obteniendo negocio");

    const business = await response.json();

    return business;
  } catch (error) {
    return null;
  }
}

/**
 * GET → Obtiene una entrada específica del catálogo (código postal + colonia).
 *
 * @param {string} postalCode - Código postal.
 * @param {string} colonia - Nombre exacto de la colonia.
 * @returns {Promise<object>} - Objeto con postalCode, colonia y alcaldía.
 */
export async function getExactPostalEntry(postalCode, colonia) {
  try {
    const encodedColonia = encodeURIComponent(colonia.trim());
    const response = await fetch(
      `${API_BASE_URL}/postal-code-catalog/${postalCode}/${encodedColonia}`
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Entrada no encontrada");
    }
    return await response.json();
  } catch (error) {
    console.error("❌ Error en getExactPostalEntry:", error);
    throw error;
  }
}

/**
 * MenuCategoryController
 **/

/**
 * GET → Obtiene todas las categorías de menú disponibles.
 *
 * @returns {Promise<Array>} - Lista completa de categorías de menú.
 */
export async function getAllMenuCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/menu-categories`);
    if (!response.ok) {
      throw new Error("Error al obtener las categorías de menú");
    }
    return await response.json();
  } catch (error) {
    console.error("❌ Error en getAllMenuCategories:", error);
    throw error;
  }
}

/**
 * DishController
 **/

/**
 * GET → Obtiene un platillo específico por su ID.
 *
 * @param {number} dishId - Identificador del platillo.
 * @returns {Promise<object>} - Objeto con los datos del platillo.
 *
 * Ejemplo:
 * getDishById(12)
 *   .then(dish => console.log(dish.dishName))
 *   .catch(err => console.error(err.message));
 */
export async function getDishById(dishId) {
  try {
    const response = await fetch(`${API_BASE_URL}/dishes/${dishId}`);
    if (!response.ok) {
      if (response.status === 404) throw new Error("Platillo no encontrado");
      throw new Error("Error al obtener el platillo");
    }
    return await response.json();
  } catch (error) {
    console.error("❌ Error en getDishById:", error);
    throw error;
  }
}

//Obtiene la lista de horarios de operación de un negocio.
// @param {number} businessId
// @returns {Promise<Array<Object>|null>} Lista de BusinessHour o null si falla.

export async function getBusinessHours(businessId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/businesses/${businessId}/hours`
    );

    if (!response.ok) throw new Error("Error obteniendo horarios");

    const hours = await response.json();
    console.log("✅ Horarios obtenidos:", hours);
    return hours;
  } catch (error) {
    console.error("❌ Error obteniendo horarios:", error.message);
    return null;
  }
}

/**
 * GET → Lista los platillos filtrados por negocio, categoría, texto o rango de precios.
 *
 * @param {object} filters - Filtros de búsqueda.
 * @param {number} filters.businessId - ID del negocio (obligatorio).
 * @param {number} [filters.categoryId] - ID de la categoría (opcional).
 * @param {string} [filters.search] - Texto de búsqueda parcial (opcional).
 * @param {number} [filters.minPrice] - Precio mínimo (opcional).
 * @param {number} [filters.maxPrice] - Precio máximo (opcional).
 *
 * @returns {Promise<Array>} - Lista de platillos que cumplen los filtros.
 *
 * Ejemplo:
 * getFilteredDishes({ businessId: 3, search: "taco", minPrice: 20, maxPrice: 60 })
 *   .then(dishes => console.log(dishes))
 *   .catch(console.error);
 */
export async function getFilteredDishes(filters) {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/dishes?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Error al listar los platillos");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en getFilteredDishes:", error);
    throw error;
  }
}

// ---------- HORARIOS DE NEGOCIO ----------
//

/**
 * Obtiene todos los horarios registrados para un negocio.
 * @param {number} businessId
 * @returns {Promise<Array<Object>|null>} Lista de horarios o null si falla.
 */
export async function getHoursByBusiness(businessId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/business-hours/${businessId}`
    );

    if (!response.ok) throw new Error("Error obteniendo horarios del negocio");

    const hours = await response.json();
    console.log("✅ Horarios del negocio:", hours);
    return hours;
  } catch (error) {
    console.error("❌ Error obteniendo horarios del negocio:", error.message);
    return null;
  }
}

/**
 * Recupera el horario de un negocio para un día específico.
 * @param {number} businessId
 * @param {string} dayOfWeek - Ej. "Mon", "Tue", ...
 * @returns {Promise<Object|null>} Horario encontrado o null si no existe.
 */
export async function getHourByDay(businessId, dayOfWeek) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/business-hours/${businessId}/${dayOfWeek}`
    );

    if (response.status === 404) return null; // no existe
    if (!response.ok) throw new Error("Error obteniendo horario por día");

    const hour = await response.json();
    console.log(`✅ Horario de ${dayOfWeek}:`, hour);
    return hour;
  } catch (error) {
    console.error("❌ Error obteniendo horario por día:", error.message);
    return null;
  }
}

export async function getUserAddress(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}/address`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Address not found");
    }

    return await response.json(); // Devuelve { userId, postalCode, colonia, alcaldia, street, number }
  } catch (err) {
    console.error("❌ Error in getUserAddress:", err.message);
    throw err;
  }
}


/**
 * 📘 Obtener una reseña por su ID
 * Método: GET /api/posts/{postId}
 * Devuelve los datos de la reseña si existe, o lanza un error si no se encuentra.
 */
export async function getPostById(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
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
      `${API_BASE_URL}/users/${authorUserId}/posts?page=${page}&size=${size}`
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
      `${API_BASE_URL}/feed/posts?page=${page}&size=${size}`
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
    const response = await fetch(
      `${API_BASE_URL}/businesses/${businessId}/rating`
    );
    if (!response.ok) throw new Error("Error fetching business rating");
    return await response.json();
  } catch (err) {
    console.error("❌ getBusinessRating:", err.message);
    throw err;
  }
}

/* ============================================================
   🟩 GET /api/businesses/search
   ------------------------------------------------------------
   🔹 Permite buscar negocios con filtros opcionales:
       - q → texto de búsqueda (nombre, descripción, etc.)
       - alcaldia → filtra por alcaldía
       - categories → lista de categorías (array de strings)
       - page, size → paginación
       - sort → criterio de orden (por defecto name,asc)
   ============================================================ */
export async function searchBusinesses({
  q = "",
  alcaldia = "",
  categories = [],
  page = 0,
  size = 20,
  sort = "", // <- antes: "name,asc"
} = {}) {
  try {
    const params = new URLSearchParams();

    if (q) params.append("q", q);
    if (alcaldia) params.append("alcaldia", alcaldia);
    if (categories.length > 0) {
      categories.forEach((cat) => params.append("categories", cat));
    }
    params.append("page", page);
    params.append("size", size);
    if (sort) params.append("sort", sort);

    // 🟡 --- LOGS DE DEPURACIÓN ---
    console.group("🔎 searchBusinesses()");
    console.log("➡ Parámetros enviados:", {
      q,
      alcaldia,
      categories,
      page,
      size,
      sort,
    });
    console.log("➡ Query final:", params.toString());
    console.log(
      "➡ URL completa:",
      `${API_BASE_URL}/businesses/search?${params.toString()}`
    );

    const response = await fetch(
      `${API_BASE_URL}/businesses/search?${params.toString()}`
    );
    console.log("📡 Estado HTTP:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error HTTP recibido:", response.status, errorText);
      throw new Error(
        `Error ${response.status}: No se pudo obtener resultados`
      );
    }

    const data = await response.json();
    console.log("🟢 Datos recibidos del backend:", data);
    console.groupEnd();

    return data; // Page<BusinessCard>
  } catch (error) {
    console.error("❌ Error en searchBusinesses:", error);
    console.groupEnd?.();
    return null;
  }
}

/* ============================================================
   🟦 GET /api/businesses/top
   ------------------------------------------------------------
   🔹 Obtiene los negocios mejor valorados o destacados
     dentro de la alcaldía del usuario especificado.
     - userId (requerido)
     - page, size (opcional)
   ============================================================ */
export async function getTopBusinesses(userId, page = 0, size = 20) {
  try {
    if (!userId) throw new Error("⚠️ userId es obligatorio.");

    const params = new URLSearchParams({
      userId: userId,
      page: page,
      size: size,
    });

    const response = await fetch(
      `${API_BASE_URL}/businesses/top?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: No se pudo obtener los negocios destacados`
      );
    }

    const data = await response.json();
    return data; // Devuelve el Page<BusinessCard>
  } catch (error) {
    console.error("❌ Error en getTopBusinesses:", error);
    return null;
  }
}

/* Utilidad para evitar fallos al leer JSON en errores */
async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

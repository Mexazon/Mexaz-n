/** 
 * Configuración global de endpoints
**/
export const API_BASE_URL = "http://localhost:8080/api";

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
    const response = await fetch(`${API_BASE_URL}/postal-code-catalog?postalCode=${postalCode}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al consultar código postal");
    }
    const data = await response.json();
    return data.colonias ?? data; // return the array if present, else raw data
  } catch (error) {
    console.error("❌ Error en getColoniasByPostalCode:", error);
    throw error;
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
    const response = await fetch(`${API_BASE_URL}/postal-code-catalog/${postalCode}/${encodedColonia}`);
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
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/hours`);

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
    const response = await fetch(`${API_BASE_URL}/business-hours/${businessId}`);

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
    const response = await fetch(`${API_BASE_URL}/business-hours/${businessId}/${dayOfWeek}`);

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

/** 
 * Configuración global de endpoints
**/
const API_BASE_URL = "http://localhost:8080/api";


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
    return await response.json();
  } catch (error) {
    console.error("❌ Error en getColoniasByPostalCode:", error);
    throw error;
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


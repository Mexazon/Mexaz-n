const BASE_URL_BUSINESSES = "http://localhost:8080/api/businesses";
const BASE_URL_BUSINESS_HOURS = "http://localhost:8080/api/business-hours";

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
    const response = await fetch(`${BASE_URL_BUSINESSES}/${businessId}`);

    if (response.status === 404) return null; // negocio no encontrado
    if (!response.ok) throw new Error("Error obteniendo negocio");

    const business = await response.json();
    console.log("✅ Negocio obtenido:", business);
    return business;

  } catch (error) {
    console.error("❌ Error obteniendo negocio:", error.message);
    return null;
  }
}

/**
 * Obtiene la lista de horarios de operación de un negocio.
 * @param {number} businessId
 * @returns {Promise<Array<Object>|null>} Lista de BusinessHour o null si falla.
 */
export async function getBusinessHours(businessId) {
  try {
    const response = await fetch(`${BASE_URL_BUSINESSES}/${businessId}/hours`);

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
 * ---------- HORARIOS DE NEGOCIO ----------
 */

/**
 * Obtiene todos los horarios registrados para un negocio.
 * @param {number} businessId
 * @returns {Promise<Array<Object>|null>} Lista de horarios o null si falla.
 */
export async function getHoursByBusiness(businessId) {
  try {
    const response = await fetch(`${BASE_URL_BUSINESS_HOURS}/${businessId}`);

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
    const response = await fetch(`${BASE_URL_BUSINESS_HOURS}/${businessId}/${dayOfWeek}`);

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

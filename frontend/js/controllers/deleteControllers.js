// controllers/businessHourController.js
const BASE_URL = "http://localhost:8080/api/business-hours";

/**
 * Elimina un horario específico de un negocio por día.
 * @param {number} businessId
 * @param {string} dayOfWeek - Ej. "Mon", "Tue", ...
 * @returns {Promise<boolean>} true si se eliminó, false si hubo error
 */
export async function deleteHour(businessId, dayOfWeek) {
  try {
    const response = await fetch(`${BASE_URL}/${businessId}/${dayOfWeek}`, {
      method: "DELETE"
    });

    if (response.status === 204) {
      console.log(`✅ Horario de ${dayOfWeek} eliminado correctamente`);
      return true;
    } else {
      throw new Error("No se pudo eliminar el horario");
    }

  } catch (error) {
    console.error("❌ Error eliminando horario:", error.message);
    return false;
  }
}

/**
 * Elimina todos los horarios asociados a un negocio.
 * @param {number} businessId
 * @returns {Promise<boolean>} true si se eliminó todo, false si hubo error
 */
export async function deleteAllHours(businessId) {
  try {
    const response = await fetch(`${BASE_URL}/${businessId}`, {
      method: "DELETE"
    });

    if (response.status === 204) {
      console.log(`✅ Todos los horarios del negocio ${businessId} eliminados`);
      return true;
    } else {
      throw new Error("No se pudieron eliminar los horarios");
    }

  } catch (error) {
    console.error("❌ Error eliminando todos los horarios:", error.message);
    return false;
  }
}

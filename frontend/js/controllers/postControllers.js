const BASE_URL_DISHES = "http://localhost:8080/api/dishes";
const BASE_URL_AUTH = "http://localhost:8080/api/auth";
const BASE_URL_BUSINESSES = "http://localhost:8080/api/businesses";
const BASE_URL_BUSINESS_HOURS = "http://localhost:8080/api/business-hours";

/**
 * ---------- PLATILLOS ----------
 * Crea un nuevo platillo.
 * @param {Object} newDish
 * @returns {Promise<Object|null>} Objeto creado o null si falla.
 */
export async function createDish(newDish) {
  try {
    const response = await fetch(BASE_URL_DISHES, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDish)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`${errorData.error || "Error"}: ${errorData.message || "No se pudo crear el platillo"}`);
    }

    const createdDish = await response.json();
    console.log("✅ Dish creado:", createdDish);
    return createdDish;

  } catch (error) {
    console.error("❌ Error creando platillo:", error.message);
    return null;
  }
}

/**
 * ---------- AUTENTICACIÓN ----------
 * Valida credenciales de usuario.
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} Respuesta: { valid, userId?, userType?, error? }
 */
export async function login(credentials) {
  try {
    const response = await fetch(`${BASE_URL_AUTH}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error en login");
    }

    const data = await response.json();

    if (data.valid) {
      console.log(`✅ Usuario válido: ID ${data.userId}, tipo ${data.userType}`);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userType", data.userType);
    } else {
      console.warn("❌ Credenciales inválidas");
    }

    return data;

  } catch (error) {
    console.error("❌ Error login:", error.message);
    return { valid: false, error: error.message };
  }
}

/**
 * ---------- NEGOCIOS ----------
 * Crea un negocio con horarios.
 * @param {Object} newBusiness - { businessId, isActive?, businessHours[] }
 * @returns {Promise<Object|null>} Negocio creado o null si falla.
 */
export async function createBusiness(newBusiness) {
  try {
    const response = await fetch(BASE_URL_BUSINESSES, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBusiness)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error creando negocio");
    }

    const created = await response.json();
    console.log("✅ Negocio creado:", created);
    return created;

  } catch (error) {
    console.error("❌ Error creando negocio:", error.message);
    return null;
  }
}

/**
 * Actualiza información de un negocio (nombre, descripción, avatar).
 * @param {number} businessId
 * @param {Object} updateData - { name?, description?, avatarUrl? }
 * @returns {Promise<Object|null>} Negocio actualizado o null si falla.
 */
export async function updateBusiness(businessId, updateData) {
  try {
    const response = await fetch(`${BASE_URL_BUSINESSES}/${businessId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error actualizando negocio");
    }

    const updated = await response.json();
    console.log("✅ Negocio actualizado:", updated);
    return updated;

  } catch (error) {
    console.error("❌ Error actualizando negocio:", error.message);
    return null;
  }
}

/**
 * ---------- HORARIOS DE NEGOCIO ----------
 * Crea o actualiza varios horarios a la vez.
 * @param {Array<Object>} businessHours - { businessId, dayOfWeek, timeIn?, timeOut?, isWorking? }
 * @returns {Promise<Array<Object>|null>} Lista de horarios persistidos o null si falla.
 */
export async function saveAllBusinessHours(businessHours) {
  try {
    const response = await fetch(`${BASE_URL_BUSINESS_HOURS}/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(businessHours)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error guardando horarios");
    }

    const savedHours = await response.json();
    console.log("✅ Horarios guardados:", savedHours);
    return savedHours;

  } catch (error) {
    console.error("❌ Error guardando horarios:", error.message);
    return null;
  }
}

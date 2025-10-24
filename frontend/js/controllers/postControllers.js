import {API_BASE_URL} from './getControllers'

const BASE_URL_DISHES = API_BASE_URL + "/dishes";
const BASE_URL_AUTH = API_BASE_URL + "/auth";
const BASE_URL_BUSINESSES = API_BASE_URL + "/businesses";
const BASE_URL_BUSINESS_HOURS = API_BASE_URL + "/business-hours";



/** Crear usuario: POST /api/users */
export async function createUser(newUser) {
  try {
    const response = await fetch(`${API_BASE_URL}users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      const error = await safeJson(response);
      throw new Error(error?.message || "Error creating user");
    }

    return await response.json();
  } catch (err) {
    console.error("❌ createUser:", err.message);
    throw err;
  }
}


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


/**
 * ✍️ Crear una nueva reseña
 * Método: POST /api/posts
 * Envía un objeto CreatePostRequest (rating, contenido, businessId, etc.)
 * y devuelve la reseña creada.
 */
export async function createPost(postData) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
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

/**
 * 🖼️ Agregar fotografías a una reseña existente
 * Método: POST /api/posts/{postId}/photos
 * Envía un objeto AddPhotosRequest con una lista de URLs o datos de fotos.
 * Devuelve la lista actualizada de fotos.
 */
export async function addPhotosToPost(postId, photosData) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(photosData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error adding photos");
    }

    return await response.json();
  } catch (err) {
    console.error("❌ addPhotosToPost:", err.message);
    throw err;
  }
}


/* Utilidad para evitar fallos al leer JSON en errores */
async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}

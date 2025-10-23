/**
 * UserAddressController
 * Maneja las operaciones CRUD para direcciones de usuarios
 */

const BASE_URL_USER_ADDRESS = "http://localhost:8080/api/user-addresses";

/**
 * ---------- GET OPERATIONS ----------
 */

/**
 * GET → Obtiene la dirección de un usuario por su ID.
 *
 * @param {number} userId - Identificador del usuario.
 * @returns {Promise<object|null>} - Objeto con los datos de la dirección o null si no existe.
 */
export async function getUserAddressById(userId) {
  try {
    const response = await fetch(`${BASE_URL_USER_ADDRESS}/${userId}`);

    if (response.status === 404) {
      console.warn("⚠️ Dirección no encontrada para el usuario");
      return null;
    }

    if (!response.ok) {
      throw new Error("Error obteniendo dirección del usuario");
    }

    const address = await response.json();
    console.log("✅ Dirección obtenida:", address);
    return address;

  } catch (error) {
    console.error("❌ Error en getUserAddressById:", error.message);
    return null;
  }
}

/**
 * GET → Obtiene todas las direcciones registradas.
 *
 * @returns {Promise<Array>} - Lista de todas las direcciones.
 */
export async function getAllUserAddresses() {
  try {
    const response = await fetch(BASE_URL_USER_ADDRESS);

    if (!response.ok) {
      throw new Error("Error obteniendo direcciones");
    }

    const addresses = await response.json();
    console.log("✅ Direcciones obtenidas:", addresses.length);
    return addresses;

  } catch (error) {
    console.error("❌ Error en getAllUserAddresses:", error.message);
    return [];
  }
}

/**
 * GET → Obtiene direcciones filtradas por código postal.
 *
 * @param {string} postalCode - Código postal a buscar.
 * @returns {Promise<Array>} - Lista de direcciones con ese código postal.
 */
export async function getAddressesByPostalCode(postalCode) {
  try {
    const response = await fetch(`${BASE_URL_USER_ADDRESS}/postal-code/${postalCode}`);

    if (!response.ok) {
      throw new Error("Error obteniendo direcciones por código postal");
    }

    const addresses = await response.json();
    console.log(`✅ Direcciones con código postal ${postalCode} obtenidas:`, addresses.length);
    return addresses;

  } catch (error) {
    console.error("❌ Error en getAddressesByPostalCode:", error.message);
    return [];
  }
}

/**
 * GET → Obtiene direcciones filtradas por colonia.
 *
 * @param {string} colonia - Nombre de la colonia.
 * @returns {Promise<Array>} - Lista de direcciones en esa colonia.
 */
export async function getAddressesByColonia(colonia) {
  try {
    const encodedColonia = encodeURIComponent(colonia);
    const response = await fetch(`${BASE_URL_USER_ADDRESS}/colonia/${encodedColonia}`);

    if (!response.ok) {
      throw new Error("Error obteniendo direcciones por colonia");
    }

    const addresses = await response.json();
    console.log(`✅ Direcciones en colonia ${colonia} obtenidas:`, addresses.length);
    return addresses;

  } catch (error) {
    console.error("❌ Error en getAddressesByColonia:", error.message);
    return [];
  }
}

/**
 * ---------- POST OPERATIONS ----------
 */

/**
 * POST → Crea una nueva dirección para un usuario.
 *
 * @param {object} newAddress - Datos de la dirección a crear.
 * @param {number} newAddress.userId - ID del usuario (obligatorio).
 * @param {string} newAddress.street - Nombre de la calle (obligatorio).
 * @param {string} newAddress.number - Número de la dirección (obligatorio).
 * @param {string} newAddress.postalCode - Código postal (obligatorio).
 * @param {string} newAddress.colonia - Colonia (obligatorio).
 * @returns {Promise<object|null>} - Dirección creada o null si falla.
 */
export async function createUserAddress(newAddress) {
  try {
    const response = await fetch(BASE_URL_USER_ADDRESS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAddress)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`${errorData.error || "Error"}: ${errorData.message || "No se pudo crear la dirección"}`);
    }

    const createdAddress = await response.json();
    console.log("✅ Dirección creada:", createdAddress);
    return createdAddress;

  } catch (error) {
    console.error("❌ Error creando dirección:", error.message);
    return null;
  }
}

/**
 * ---------- PUT OPERATIONS ----------
 */

/**
 * PUT → Actualiza la dirección de un usuario.
 *
 * @param {number} userId - ID del usuario.
 * @param {object} updateData - Datos a actualizar.
 * @param {string} [updateData.street] - Nueva calle.
 * @param {string} [updateData.number] - Nuevo número.
 * @param {string} [updateData.postalCode] - Nuevo código postal.
 * @param {string} [updateData.colonia] - Nueva colonia.
 * @returns {Promise<object|null>} - Dirección actualizada o null si falla.
 */
export async function updateUserAddress(userId, updateData) {
  try {
    const response = await fetch(`${BASE_URL_USER_ADDRESS}/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error actualizando dirección");
    }

    const updated = await response.json();
    console.log("✅ Dirección actualizada:", updated);
    return updated;

  } catch (error) {
    console.error("❌ Error actualizando dirección:", error.message);
    return null;
  }
}

/**
 * ---------- DELETE OPERATIONS ----------
 */

/**
 * DELETE → Elimina la dirección de un usuario.
 *
 * @param {number} userId - ID del usuario cuya dirección se eliminará.
 * @returns {Promise<boolean>} - true si se eliminó correctamente, false si falló.
 */
export async function deleteUserAddress(userId) {
  try {
    const response = await fetch(`${BASE_URL_USER_ADDRESS}/${userId}`, {
      method: "DELETE"
    });

    if (response.status === 404) {
      console.warn("⚠️ Dirección no encontrada");
      return false;
    }

    if (!response.ok) {
      throw new Error("Error eliminando dirección");
    }

    console.log(`✅ Dirección del usuario ${userId} eliminada`);
    return true;

  } catch (error) {
    console.error("❌ Error eliminando dirección:", error.message);
    return false;
  }
}

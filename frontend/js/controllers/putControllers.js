import {API_BASE_URL} from './getControllers'

/**
 * Actualiza información de un negocio (nombre, descripción, avatar).
 * @param {number} businessId
 * @param {Object} updateData - { name?, description?, avatarUrl? }
 * @returns {Promise<Object|null>} Negocio actualizado o null si falla.
 */
export async function updateBusiness(businessId, updateData) {
  try {
    const response = await fetch(`${API_BASE_URL}/${businessId}`, {
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

export async function updateUserPartial(userId, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });

    if (response.status === 404) throw new Error("User not found");
    if (!response.ok) throw new Error("Error updating user");

    return await response.json();
  } catch (err) {
    console.error("❌ Error in updateUserPartial:", err.message);
    throw err;
  }
}

export async function createOrUpdateAddress(userId, addressData) {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}/address`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error creating/updating address");
    }

    return await response.json(); // Devuelve el objeto con userId, postalCode, colonia, alcaldia, street, number
  } catch (err) {
    console.error("❌ Error in createOrUpdateAddress:", err.message);
    throw err;
  }
}
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



async function createDish(newDish) {
  try {
    const response = await fetch("http://localhost:8080/api/dishes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newDish)
    });

    if (!response.ok) {
      // Si el backend devuelve un error, lo procesamos
      const errorData = await response.json();
      throw new Error(`${errorData.error}: ${errorData.message}`);
    }

    const createdDish = await response.json();
    console.log("Dish created successfully:", createdDish);
    return createdDish;

  } catch (error) {
    console.error("Error creating dish:", error.message);
    alert("Error: " + error.message);
  }
}

/** 
 * DishController
**/

/**
 * POST → Crea un nuevo platillo.
 * 
 * @param {object} dishData - Datos del platillo a registrar.
 * @param {number} dishData.businessId - ID del negocio.
 * @param {number} dishData.categoryId - ID de la categoría.
 * @param {string} dishData.dishName - Nombre del platillo.
 * @param {string} dishData.description - Descripción del platillo.
 * @param {number} dishData.price - Precio del platillo.
 * @param {string} [dishData.photoUrl] - URL de la foto del platillo.
 * 
 * @returns {Promise<object>} - Platillo creado.
 * 
 * Ejemplo:
 * createDish({
 *   businessId: 3,
 *   categoryId: 1,
 *   dishName: "Taco al pastor",
 *   description: "Con piña y cebolla",
 *   price: 45.00,
 *   photoUrl: "https://cdn..."
 * })
 * .then(newDish => console.log("Platillo creado:", newDish))
 * .catch(err => alert(err.message));
 */
export async function createDish(dishData) {
  try {
    const response = await fetch(`${API_BASE_URL}/dishes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dishData)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      switch (response.status) {
        case 400:
          throw new Error(error.message || "Datos inválidos");
        case 409:
          throw new Error(error.message || "Platillo duplicado");
        default:
          throw new Error("Error al crear el platillo");
      }
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en createDish:", error);
    throw error;
  }
}

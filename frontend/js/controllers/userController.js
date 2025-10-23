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

/** Obtener usuario por ID: GET /api/users/{userId} */
export async function getUserById(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}users/${userId}`);

    if (response.status === 404) throw new Error("User not found");
    if (!response.ok) throw new Error("Error fetching user");

    return await response.json();
  } catch (err) {
    console.error("❌ getUserById:", err.message);
    throw err;
  }
}

/** Actualización parcial: PATCH /api/users/{userId} */
export async function updateUserPartial(userId, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (response.status === 404) throw new Error("User not found");
    if (!response.ok) throw new Error("Error updating user");

    return await response.json();
  } catch (err) {
    console.error("❌ updateUserPartial:", err.message);
    throw err;
  }
}

/** Verificar email: GET /api/users/exists?email=...  → devuelve true|false */
export async function checkEmailExists(email) {
  try {
    const response = await fetch(
      `${API_BASE_URL}users/exists?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) throw new Error("Error checking email");

    const result = await response.json();
    return result.exists === true;
  } catch (err) {
    console.error("❌ checkEmailExists:", err.message);
    throw err;
  }
}

/* Utilidad para evitar fallos al leer JSON en errores */
async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}
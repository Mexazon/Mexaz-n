/**
 * UserController
 * Maneja las operaciones CRUD para usuarios
 */

const BASE_URL_USERS = "http://localhost:8080/api/users";

/**
 * ---------- GET OPERATIONS ----------
 */

/**
 * GET → Obtiene un usuario por su ID.
 *
 * @param {number} userId - Identificador del usuario.
 * @returns {Promise<object|null>} - Objeto con los datos del usuario o null si no existe.
 */
export async function getUserById(userId) {
  try {
    const response = await fetch(`${BASE_URL_USERS}/${userId}`);

    if (response.status === 404) {
      console.warn("⚠️ Usuario no encontrado");
      return null;
    }

    if (!response.ok) {
      throw new Error("Error obteniendo usuario");
    }

    const user = await response.json();
    console.log("✅ Usuario obtenido:", user);
    return user;

  } catch (error) {
    console.error("❌ Error en getUserById:", error.message);
    return null;
  }
}

/**
 * GET → Obtiene todos los usuarios.
 *
 * @returns {Promise<Array>} - Lista de todos los usuarios.
 */
export async function getAllUsers() {
  try {
    const response = await fetch(BASE_URL_USERS);

    if (!response.ok) {
      throw new Error("Error obteniendo usuarios");
    }

    const users = await response.json();
    console.log("✅ Usuarios obtenidos:", users.length);
    return users;

  } catch (error) {
    console.error("❌ Error en getAllUsers:", error.message);
    return [];
  }
}

/**
 * GET → Obtiene usuarios filtrados por tipo.
 *
 * @param {string} userType - Tipo de usuario a filtrar.
 * @returns {Promise<Array>} - Lista de usuarios del tipo especificado.
 */
export async function getUsersByType(userType) {
  try {
    const response = await fetch(`${BASE_URL_USERS}?userType=${userType}`);

    if (!response.ok) {
      throw new Error("Error filtrando usuarios por tipo");
    }

    const users = await response.json();
    console.log(`✅ Usuarios de tipo '${userType}' obtenidos:`, users.length);
    return users;

  } catch (error) {
    console.error("❌ Error en getUsersByType:", error.message);
    return [];
  }
}

/**
 * GET → Obtiene un usuario por email.
 *
 * @param {string} email - Email del usuario.
 * @returns {Promise<object|null>} - Objeto con los datos del usuario o null si no existe.
 */
export async function getUserByEmail(email) {
  try {
    const encodedEmail = encodeURIComponent(email);
    const response = await fetch(`${BASE_URL_USERS}/email/${encodedEmail}`);

    if (response.status === 404) {
      console.warn("⚠️ Usuario no encontrado");
      return null;
    }

    if (!response.ok) {
      throw new Error("Error obteniendo usuario por email");
    }

    const user = await response.json();
    console.log("✅ Usuario obtenido por email:", user);
    return user;

  } catch (error) {
    console.error("❌ Error en getUserByEmail:", error.message);
    return null;
  }
}

/**
 * ---------- POST OPERATIONS ----------
 */

/**
 * POST → Crea un nuevo usuario.
 *
 * @param {object} newUser - Datos del usuario a crear.
 * @param {string} newUser.userType - Tipo de usuario (obligatorio).
 * @param {string} newUser.email - Email del usuario (obligatorio, único).
 * @param {string} newUser.passwordHash - Contraseña hasheada (obligatorio).
 * @param {string} newUser.phone - Teléfono (obligatorio, único).
 * @param {string} newUser.name - Nombre del usuario (obligatorio).
 * @param {string} [newUser.description] - Descripción opcional.
 * @param {string} [newUser.avatar] - URL del avatar opcional.
 * @returns {Promise<object|null>} - Usuario creado o null si falla.
 */
export async function createUser(newUser) {
  try {
    const response = await fetch(BASE_URL_USERS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`${errorData.error || "Error"}: ${errorData.message || "No se pudo crear el usuario"}`);
    }

    const createdUser = await response.json();
    console.log("✅ Usuario creado:", createdUser);
    return createdUser;

  } catch (error) {
    console.error("❌ Error creando usuario:", error.message);
    return null;
  }
}

/**
 * ---------- PUT OPERATIONS ----------
 */

/**
 * PUT → Actualiza información de un usuario.
 *
 * @param {number} userId - ID del usuario a actualizar.
 * @param {object} updateData - Datos a actualizar.
 * @param {string} [updateData.name] - Nombre del usuario.
 * @param {string} [updateData.description] - Descripción.
 * @param {string} [updateData.avatar] - URL del avatar.
 * @param {string} [updateData.phone] - Teléfono.
 * @returns {Promise<object|null>} - Usuario actualizado o null si falla.
 */
export async function updateUser(userId, updateData) {
  try {
    const response = await fetch(`${BASE_URL_USERS}/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error actualizando usuario");
    }

    const updated = await response.json();
    console.log("✅ Usuario actualizado:", updated);
    return updated;

  } catch (error) {
    console.error("❌ Error actualizando usuario:", error.message);
    return null;
  }
}

/**
 * ---------- DELETE OPERATIONS ----------
 */

/**
 * DELETE → Elimina un usuario por su ID.
 *
 * @param {number} userId - ID del usuario a eliminar.
 * @returns {Promise<boolean>} - true si se eliminó correctamente, false si falló.
 */
export async function deleteUser(userId) {
  try {
    const response = await fetch(`${BASE_URL_USERS}/${userId}`, {
      method: "DELETE"
    });

    if (response.status === 404) {
      console.warn("⚠️ Usuario no encontrado");
      return false;
    }

    if (!response.ok) {
      throw new Error("Error eliminando usuario");
    }

    console.log(`✅ Usuario ${userId} eliminado`);
    return true;

  } catch (error) {
    console.error("❌ Error eliminando usuario:", error.message);
    return false;
  }
}

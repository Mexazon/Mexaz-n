import { updateUserPartial } from './controllers/putControllers';
import { getUserById } from './controllers/getControllers';

// Variables globales
let photoInput = null;
let photoPreview = null;
let selectedImageFile = null;

// Referencias a los elementos del formulario
const nameInput = document.getElementById("editName");
const descriptionInput = document.getElementById("editDescription");
const saveBtn = document.getElementById('saveProfileBtn');

// Obtener el ID del usuario actual
const currentUserId = localStorage.getItem("userId");

// Función para inyectar el campo de foto dinámicamente
function injectPhotoField() {
    // Verificar si ya existe el campo
    if (document.getElementById('profilePhotoContainer')) {
        return;
    }

    // Buscar el comentario <!-- Foto --> en el modal
    const modalBody = document.querySelector('#editprofile .modal-body form');
    const nameDiv = nameInput.closest('.mb-3');

    // Crear el contenedor del campo de foto
    const photoContainer = document.createElement('div');
    photoContainer.className = 'mb-3';
    photoContainer.id = 'profilePhotoContainer';
    photoContainer.innerHTML = `
        <label for="profilePhoto" class="form-label">Foto de perfil</label>
        <div class="d-flex align-items-center gap-3 mb-2">
            <img id="photoPreview" src="" alt="Vista previa" class="rounded-circle"
                 style="width: 80px; height: 80px; object-fit: cover; display: none; border: 2px solid #dee2e6;">
            <div class="flex-grow-1">
                <input type="file" class="form-control" id="profilePhoto" accept="image/*">
                <small class="text-muted">Formatos aceptados: JPG, PNG, GIF (máx 5MB)</small>
            </div>
        </div>
    `;

    // Insertar antes del campo de nombre
    modalBody.insertBefore(photoContainer, nameDiv);

    // Actualizar referencias
    photoInput = document.getElementById('profilePhoto');
    photoPreview = document.getElementById('photoPreview');

    // Agregar event listener para preview
    photoInput.addEventListener('change', handlePhotoChange);
}

// Función para manejar cambio de foto
function handlePhotoChange(event) {
    const file = event.target.files[0];

    if (file) {
        // Validar tamaño
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen es muy grande. Máximo 5MB.');
            photoInput.value = '';
            return;
        }

        // Validar tipo
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen válida');
            photoInput.value = '';
            return;
        }

        selectedImageFile = file;

        // Mostrar preview
        const reader = new FileReader();
        reader.onload = function(e) {
            photoPreview.src = e.target.result;
            photoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Función para convertir imagen a base64
function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Función para cargar datos del usuario en el modal
async function loadUserData() {
    try {
        // Inyectar campo de foto si no existe
        injectPhotoField();

        const user = await getUserById(currentUserId);
        if (user) {
            nameInput.value = user.name || '';
            descriptionInput.value = user.description || '';

            // Mostrar foto actual si existe
            if (user.avatarUrl && photoPreview) {
                photoPreview.src = user.avatarUrl;
                photoPreview.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error cargando datos del usuario:', error);
        alert('Error al cargar los datos del perfil');
    }
}

// Cargar datos cuando se abre el modal
document.getElementById('editprofile').addEventListener('show.bs.modal', loadUserData);

// Manejar el guardado del perfil
saveBtn.addEventListener('click', async function() {
    try {
        // Deshabilitar botón mientras se procesa
        saveBtn.disabled = true;
        saveBtn.textContent = 'Guardando...';

        const updates = {};

        // Agregar nombre si cambió
        if (nameInput.value.trim() !== '') {
            updates.name = nameInput.value.trim();
        }

        // Agregar descripción si cambió
        if (descriptionInput.value.trim() !== '') {
            updates.description = descriptionInput.value.trim();
        }

        // Agregar foto si se seleccionó una
        if (selectedImageFile) {
            const base64Image = await imageToBase64(selectedImageFile);
            updates.avatarUrl = base64Image;
        }

        // Verificar que hay algo que actualizar
        if (Object.keys(updates).length === 0) {
            alert('No hay cambios para guardar');
            return;
        }

        // Llamar a la API para actualizar
        const result = await updateUserPartial(currentUserId, updates);

        if (result) {
            alert('Perfil actualizado exitosamente');

            // Cerrar el modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editprofile'));
            modal.hide();

            // Limpiar archivo seleccionado
            selectedImageFile = null;
            if (photoInput) photoInput.value = '';

            // Recargar la página para mostrar los cambios
            window.location.reload();
        }

    } catch (error) {
        console.error('Error actualizando perfil:', error);
        alert('Hubo un error al actualizar el perfil. Por favor intenta de nuevo.');
    } finally {
        // Rehabilitar botón
        saveBtn.disabled = false;
        saveBtn.textContent = 'Guardar';
    }
})


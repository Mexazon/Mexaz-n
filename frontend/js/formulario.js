document.addEventListener('DOMContentLoaded', () => {
    // Selecciona el formulario de contacto por su ID
    const form = document.getElementById('contactForm');
    const statusMessageContainer = document.getElementById('statusMessage');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Evita el envío tradicional del formulario

            const formData = {
                nombre: form.querySelector('#nombre').value,
                correo: form.querySelector('#correo').value,
                asunto: form.querySelector('#asunto').value,
                mensaje: form.querySelector('#mensaje').value,
            };

            // Aquí es donde harías la llamada a tu API o servidor
            // En este ejemplo, simulamos un envío exitoso
            console.log('Datos del formulario:', formData);

            try {
                // Simulación de una llamada a una API
                const response = await simulateFormSubmission(formData);
                console.log('Respuesta del servidor:', response);

                if (response.success) {
                    showStatusMessage('¡Mensaje enviado con éxito!', 'alert-success');
                    form.reset(); 
                } else {
                    showStatusMessage('Hubo un error al enviar el mensaje. Inténtalo de nuevo.', 'alert-danger');
                }
            } catch (error) {
                console.error('Error en el envío:', error);
                showStatusMessage('Hubo un error inesperado. Por favor, revisa tu conexión.', 'alert-danger');
            }
        });
    }

    // Función para simular el envío a un servidor
    function simulateFormSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simula una respuesta exitosa
                resolve({ success: true, message: 'Formulario recibido correctamente.' });
            }, 1000); // Retraso de 1 segundo para simular la latencia
        });
    }

    // Función para mostrar mensajes de estado
    function showStatusMessage(message, type) {
        if (statusMessageContainer) {
            statusMessageContainer.textContent = message;
            statusMessageContainer.className = `alert ${type} mt-3 text-center`; // Reemplaza las clases existentes
            statusMessageContainer.style.display = 'block';

            // Oculta el mensaje después de 5 segundos
            setTimeout(() => {
                statusMessageContainer.style.display = 'none';
            }, 5000);
        }
    }
});
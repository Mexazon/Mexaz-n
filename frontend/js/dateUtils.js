/**
 * Calcula el tiempo transcurrido desde una fecha hasta ahora
 * @param {Date|string|number} date - Fecha a comparar (puede ser Date object, string ISO, o timestamp)
 * @returns {string} Texto formateado como "hace X tiempo"
 *
 * Ejemplos:
 * - "hace unos segundos"
 * - "hace 5 minutos"
 * - "hace 2 horas"
 * - "hace 3 días"
 * - "hace 1 mes"
 * - "hace 2 años"
 */
export function getTimeAgo(date) {
    // Convertir la fecha a objeto Date si no lo es
    const fechaPasada = new Date(date);
    const ahora = new Date();

    // Verificar si la fecha es válida
    if (isNaN(fechaPasada.getTime())) {
        return "fecha inválida";
    }

    // Calcular la diferencia en milisegundos
    const diferenciaMilisegundos = ahora - fechaPasada;

    // Si la fecha es en el futuro, retornar un mensaje apropiado
    if (diferenciaMilisegundos < 0) {
        return "en el futuro";
    }

    // Convertir a segundos
    const segundos = Math.floor(diferenciaMilisegundos / 1000);

    // Menos de 60 segundos
    if (segundos < 60) {
        return "hace unos segundos";
    }

    // Convertir a minutos
    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) {
        return minutos === 1 ? "hace 1 minuto" : `hace ${minutos} minutos`;
    }

    // Convertir a horas
    const horas = Math.floor(minutos / 60);
    if (horas < 24) {
        return horas === 1 ? "hace 1 hora" : `hace ${horas} horas`;
    }

    // Convertir a días
    const dias = Math.floor(horas / 24);
    if (dias < 30) {
        return dias === 1 ? "hace 1 día" : `hace ${dias} días`;
    }

    // Convertir a meses
    const meses = Math.floor(dias / 30);
    if (meses < 12) {
        return meses === 1 ? "hace 1 mes" : `hace ${meses} meses`;
    }

    // Convertir a años
    const años = Math.floor(meses / 12);
    return años === 1 ? "hace 1 año" : `hace ${años} años`;
}

/**
 * Obtiene la fecha y hora actual en formato ISO
 * @returns {string} Fecha actual en formato ISO
 */
export function getCurrentDateTime() {
    return new Date().toISOString();
}

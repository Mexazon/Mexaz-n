document.addEventListener('DOMContentLoaded', () => {
  const contactFormEl = document.getElementById('contactForm');
  const statusMessageContainer = document.getElementById('statusMessage');

  // Tu endpoint real de Formspree:
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mrbyzjlj';

  if (!contactFormEl) return;

  contactFormEl.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Campos según TU HTML actual
    const nombreEl   = contactFormEl.querySelector('#nombre');
    const correoEl   = contactFormEl.querySelector('#correo');
    const asuntoEl   = contactFormEl.querySelector('#asunto');    // ← ya no usamos "select"
    const telefonoEl = contactFormEl.querySelector('#telefono');  // ← nuevo
    const mensajeEl  = contactFormEl.querySelector('#mensaje');

    // Validaciones
    const nameOk = /^[A-Za-zÀ-ÿ'’\s.-]{2,60}$/.test(nombreEl.value.trim());
    const mailOk = correoEl.checkValidity(); // type="email" nativo
    const asuntoOk = !!asuntoEl && asuntoEl.selectedIndex > 0;
    const telOk = /^(\+?52)?\s?(\d{10})$/.test(telefonoEl.value.trim());
    const msgOk = mensajeEl.value.trim().length >= 10;

    if (!nameOk)   { nombreEl.focus();   return showStatus('Escribe un nombre válido (2–60 caracteres).', 'alert-warning'); }
    if (!mailOk)   { correoEl.focus();   return showStatus('Revisa tu correo electrónico.', 'alert-warning'); }
    if (!asuntoOk) { asuntoEl.focus();   return showStatus('Selecciona un asunto.', 'alert-warning'); }
    if (!telOk)    { telefonoEl.focus(); return showStatus('Teléfono inválido (10 dígitos, opcional +52).', 'alert-warning'); }
    if (!msgOk)    { mensajeEl.focus();  return showStatus('Tu mensaje debe tener al menos 10 caracteres.', 'alert-warning'); }

    const asuntoTexto = asuntoEl.options[asuntoEl.selectedIndex].text;

    // Construir FormData (sin depender de name="")
    const fd = new FormData();
    fd.append('nombre',   nombreEl.value.trim());
    fd.append('email',    correoEl.value.trim());
    fd.append('asunto',   asuntoTexto);
    fd.append('telefono', telefonoEl.value.trim());
    fd.append('mensaje',  mensajeEl.value.trim());
    fd.append('_subject', `Contacto Mexazón: ${asuntoTexto}`);

    const submitBtn = contactFormEl.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const resp = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });

      if (resp.ok) {
        showStatus('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'alert-success');
        // usar el target para evitar cualquier colisión global
        if (event.target && typeof event.target.reset === 'function') {
          event.target.reset();
        }
      } else {
        let msg = 'No se pudo enviar. Intenta de nuevo en un momento.';
        try {
          const data = await resp.json();
          if (data?.errors?.length) msg = data.errors.map(e => e.message).join(' ');
        } catch {}
        showStatus(msg, 'alert-danger');
      }
    } catch (err) {
      console.error(err);
      showStatus('Hubo un error inesperado. Revisa tu conexión.', 'alert-danger');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  function showStatus(message, type) {
    if (!statusMessageContainer) return;
    statusMessageContainer.textContent = message;
    statusMessageContainer.className = `alert ${type} mt-3 text-center`;
    statusMessageContainer.style.display = 'block';
    setTimeout(() => { statusMessageContainer.style.display = 'none'; }, 5000);
  }
});

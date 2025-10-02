//btnNext = document.getElementById("btnNext");
//inputNombre = document.getElementById(nombreNegocio)
//inputCorreo = document.getElementById(emailRegistro)
//inputTelefono = document.getElementById(telefonoRegistro)
//inputCiudad = document.getElementById()
//inputCP = document.getElementById()

(() => {
  // Map your inputs (kept exactly as in your snippet)
  const DAYS = [
    { key: "Lunes",      startId: "LunesA",     endId: "LunesC" }, // <- note the 'C'
    { key: "Martes",     startId: "MartesA",    endId: "MartesB" },
    { key: "Miércoles",  startId: "MiercolesA", endId: "MiercolesB" },
    { key: "Jueves",     startId: "JuevesA",    endId: "JuevesB" },
    { key: "Viernes",    startId: "ViernesA",   endId: "ViernesB" },
    { key: "Sábado",     startId: "SabadoA",    endId: "SabadoB" },
    { key: "Domingo",    startId: "DomingoA",   endId: "DomingoB" },
  ];

  const STORAGE_KEY = "businessSchedule:v1";

  // Grab or create preview container
  let preview = document.getElementById("schedulePreview");
  if (!preview) {
    // insert right after the provided section
    const section = document.querySelector('section.wizard-step[data-step="2a"]');
    preview = document.createElement("div");
    preview.id = "schedulePreview";
    preview.className = "mt-3";
    section?.appendChild(preview);
  }

  // Helpers
  const getInput = (id) => document.getElementById(id);
  const fmt = (t) => (t && t.length >= 4 ? t : "");               // keep native "HH:MM"
  const isValidRange = (a, b) => a && b && a < b;                  // string compare works for "HH:MM"
  const isEmpty = (a, b) => !a && !b;

  function readScheduleFromDOM() {
    return DAYS.map(({ key, startId, endId }) => {
      const a = fmt(getInput(startId)?.value || "");
      const b = fmt(getInput(endId)?.value || "");
      return { day: key, open: a, close: b };
    });
  }

  function save(schedule) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule)); } catch {}
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function restoreToDOM(schedule) {
    if (!schedule) return;
    schedule.forEach(row => {
      const map = DAYS.find(d => d.key === row.day);
      if (!map) return;
      const s = getInput(map.startId);
      const e = getInput(map.endId);
      if (s && row.open)  s.value = row.open;
      if (e && row.close) e.value = row.close;
    });
  }

  function render(schedule) {
    // Build a Bootstrap-friendly table + small status line
    let invalidCount = 0;

    const rows = schedule.map(({ day, open, close }) => {
      let status;
      if (isEmpty(open, close)) {
        status = `<span class="badge text-bg-secondary">Cerrado</span>`;
      } else if (!open || !close) {
        invalidCount++;
        status = `<span class="badge text-bg-warning">Falta horario</span>`;
      } else if (!isValidRange(open, close)) {
        invalidCount++;
        status = `<span class="badge text-bg-danger">Rango inválido</span>`;
      } else {
        status = `<span class="badge text-bg-success">Abierto</span>`;
      }

      const range = (!open && !close) ? "—" : `${open || "??:??"} — ${close || "??:??"}`;
      return `
        <tr>
          <th class="fw-semibold">${day}</th>
          <td>${range}</td>
          <td class="text-end">${status}</td>
        </tr>
      `;
    }).join("");

    const alert = invalidCount
      ? `<div class="alert alert-warning py-2 px-3 mb-2">Revisa ${invalidCount} día(s) con horarios incompletos o inválidos.</div>`
      : "";

    preview.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h6 class="card-title mb-2">Horario configurado</h6>
          ${alert}
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th style="width: 30%">Día</th>
                  <th>Horario</th>
                  <th class="text-end" style="width: 20%">Estado</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
          <p class="text-muted small mt-2 mb-0">Consejo: deja ambos campos vacíos para marcar el día como “Cerrado”.</p>
        </div>
      </div>
    `;
  }

  function update() {
    const schedule = readScheduleFromDOM();
    render(schedule);
    save(schedule);
  }

  // Set up listeners (input events = live update)
  function bind() {
    DAYS.forEach(({ startId, endId }) => {
      const s = getInput(startId);
      const e = getInput(endId);
      s && s.addEventListener("input", update);
      e && e.addEventListener("input", update);
      // Optional: normalize seconds to ":00" if browser provides seconds
      [s, e].forEach(inp => {
        if (!inp) return;
        inp.addEventListener("change", () => {
          // Some browsers allow seconds; we keep HH:MM only
          if (inp.value && /^\d{2}:\d{2}(:\d{2})?$/.test(inp.value)) {
            inp.value = inp.value.slice(0,5);
            update();
          }
        });
      });
    });
  }

  // Boot
  (function init() {
    restoreToDOM(load());
    bind();
    update(); // initial render
  })();
})();
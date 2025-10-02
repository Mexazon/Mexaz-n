import { Schedule } from "./classes.js";

    const DAYS = [
        { label: "Domingo",   startId: "DomingoA",   endId: "DomingoB" },
        { label: "Lunes",     startId: "LunesA",     endId: "LunesC" },
        { label: "Martes",    startId: "MartesA",    endId: "MartesB" },
        { label: "Miércoles", startId: "MiercolesA", endId: "MiercolesB" },
        { label: "Jueves",    startId: "JuevesA",    endId: "JuevesB" },
        { label: "Viernes",   startId: "ViernesA",   endId: "ViernesB" },
        { label: "Sábado",    startId: "SabadoA",    endId: "SabadoB" },
    ];

    const STORAGE_KEY = "businessSchedule";
    let preview = document.getElementById("schedulePreview");
    if (!preview) {
        const section = document.querySelector('section.wizard-step[data-step="2a"]');
        preview = document.createElement("div");
        preview.id = "schedulePreview";
        preview.className = "mt-3";
        section?.appendChild(preview);
    }

    const getInput = id => document.getElementById(id);
    const fmt = t => (t && t.length >= 4 ? t : "");
    const isValidRange = (a, b) => a && b && a < b;

    function buildScheduleArray() {
        return DAYS.map(({ startId, endId }) => {
            const open = fmt(getInput(startId)?.value || "");
            const close = fmt(getInput(endId)?.value || "");
            return new Schedule(open, close);
        });
    }

    function save(arr) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch {}
    }

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }

    function restoreToDOM(arr) {
        if (!arr) return;
        arr.forEach((item, index) => {
            const map = DAYS[index];
            if (!map) return;
            const s = getInput(map.startId);
            const e = getInput(map.endId);
            if (s && item.opening) s.value = item.opening;
            if (e && item.closing) e.value = item.closing;
        });
    }

    function render(arr) {
        let invalidCount = 0;

        const rows = arr.map((item, index) => {
            const { label } = DAYS[index];
            let status;

            if (!item.opening && !item.closing) {
                status = `<span class="badge text-bg-secondary">Cerrado</span>`;
            } else if (!item.opening || !item.closing) {
                invalidCount++;
                status = `<span class="badge text-bg-warning">Falta horario</span>`;
            } else if (!isValidRange(item.opening, item.closing)) {
                invalidCount++;
                status = `<span class="badge text-bg-danger">Rango inválido</span>`;
            } else {
                status = `<span class="badge text-bg-success">Abierto</span>`;
            }

            const range = (!item.opening && !item.closing)
                ? "—"
                : `${item.opening || "??:??"} — ${item.closing || "??:??"}`;

            return `
                <tr>
                  <th class="fw-semibold">${label}</th>
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
              </div>
            </div>
        `;
    }

    export function isScheduleValid(scheduleArray) {
      // scheduleArray is your 7-element array of { opening, closing }
      return scheduleArray.every(item => {
        const { opening, closing } = item;

        // Case 1: both empty = valid closed day
        if (!opening && !closing) return true;

        // Case 2: one missing = invalid
        if (!opening || !closing) return false;

        // Case 3: both present -> must be a valid range
        return opening < closing;
      });
    }

    function update() {
        const arr = buildScheduleArray();
        render(arr);
        save(arr);
        window.currentSchedule = arr; // 👈 exposed if needed
    }

    function bind() {
        DAYS.forEach(({ startId, endId }) => {
            const s = getInput(startId);
            const e = getInput(endId);
            s && s.addEventListener("input", update);
            e && e.addEventListener("input", update);
        });
    }

    // Boot
    const data = load();
    restoreToDOM(data);
    bind();
    update();



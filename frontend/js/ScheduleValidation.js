import { BusinessHours } from "./model-classes.js";
    
    const DAYS = [
       
        { label: "Mon",     startId: "LunesA",     endId: "LunesB" },
        { label: "Tue",    startId: "MartesA",    endId: "MartesB" },
        { label: "Wed", startId: "MiercolesA", endId: "MiercolesB" },
        { label: "Thu",    startId: "JuevesA",    endId: "JuevesB" },
        { label: "Fri",   startId: "ViernesA",   endId: "ViernesB" },
        { label: "Sat",    startId: "SabadoA",    endId: "SabadoB" },
        { label: "Sun",   startId: "DomingoA",   endId: "DomingoB" }
    ];

    const STORAGE_KEY = "businessSchedule";
    export let preview = document.getElementById("schedulePreview");
 

    const getInput = id => document.getElementById(id);
    const fmt = t => (t && t.length >= 4 ? t : null);
    const isValidRange = (a, b) => a && b && a < b;

    function buildScheduleArray() {
        let working;
        return DAYS.map(({label, startId, endId }) => {
            const open = fmt(getInput(startId)?.value || null);
            const close = fmt(getInput(endId)?.value || null);
            working = (open != null && close != null) ? true : false;
            return new BusinessHours(label,open, close, working);
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
            if (s && item.timeIn) s.value = item.timeOut;
            if (e && item.timeIn) e.value = item.timeOut;
        });
    }

    function render(arr) {
        let invalidCount = 0;

        const rows = arr.map((item, index) => {
            const { label } = DAYS[index];
            let status;

            if (!item.timeIn && !item.timeOut) {
                status = `<span class="badge text-bg-secondary">Cerrado</span>`;
            } else if (!item.timeIn || !item.timeOut) {
                invalidCount++;
                status = `<span class="badge text-bg-warning">Falta horario</span>`;
            } else if (!isValidRange(item.timeIn, item.timeOut)) {
                invalidCount++;
                status = `<span class="badge text-bg-danger">Rango inválido</span>`;
            } else {
                status = `<span class="badge text-bg-success">Abierto</span>`;
            }

            const range = (!item.timeIn && !item.timeOut)
                ? "—"
                : `${item.timeIn || "??:??"} — ${item.timeOut || "??:??"}`;

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

        preview.innerHTML += `
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

    export function update() {
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



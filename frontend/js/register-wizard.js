
  // Asegura que el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    const modal = document.getElementById("registerModal");
    if (!modal) return;

    const root  = modal.querySelector("#wizardRoot");
    const btnNext   = modal.querySelector("#btnNext");
    const btnBack   = modal.querySelector("#btnBack");
    const btnFinish = modal.querySelector("#btnFinish");

    const steps = {
      "1":  root.querySelector('[data-step="1"]'),
      "2a": root.querySelector('[data-step="2a"]'), // rama "puesto"
      "2b": root.querySelector('[data-step="2b"]'), // rama "no puesto"
      "3":  root.querySelector('[data-step="3"]'),  // confirmar
    };

    let current = "1";
    let branch  = null; // "2a" o "2b"

    function show(step) {
      // Oculta todos los pasos
      Object.values(steps).forEach(s => s && s.classList.add("d-none"));
      // Muestra el solicitado
      steps[step]?.classList.remove("d-none");
      current = step;

      // Botonera
      btnBack.classList.toggle("d-none", step === "1");
      const isLast = (step === "3");
      btnNext.classList.toggle("d-none", isLast);
      btnFinish.classList.toggle("d-none", !isLast);
    }

    function nextFromStep1() {
      const si = modal.querySelector("#rSi")?.checked;
      const no = modal.querySelector("#rNo")?.checked;
      if (!si && !no) {
        alert("Selecciona si eres un puesto para continuar.");
        return;
      }
      branch = si ? "2a" : "2b";
      show(branch);
    }

    // Eventos de navegación
    btnNext.addEventListener("click", () => {
      if (current === "1")       return nextFromStep1();
      if (current === "2a" || current === "2b") return show("3");
    });

    btnBack.addEventListener("click", () => {
      if (current === "3")                     return show(branch);
      if (current === "2a" || current === "2b") return show("1");
    });

    btnFinish.addEventListener("click", () => {
      // submit/fetch
      const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
      bsModal.hide();
    });

    // Evita submit accidental con Enter en pasos intermedios
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && current !== "3") {
        e.preventDefault();
        btnNext.click();
      }
    });

    // Reset de estado al abrir/cerrar
    modal.addEventListener("shown.bs.modal", () => {
      show("1");
      branch = null;
      // focus al primer input disponible
      const first = modal.querySelector('input, select, textarea, button');
      setTimeout(() => first?.focus(), 50);
    });

    modal.addEventListener("hidden.bs.modal", () => {
      // Limpia formularios dentro del wizard (opcional)
      modal.querySelectorAll("form").forEach(f => f.reset());
      show("1");
      branch = null;
    });
  }

  function isBusiness(){
    
  }


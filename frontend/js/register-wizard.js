
    // Asegura que el DOM esté listo
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    function init() {
        const modal = document.getElementById("registerModal");
        if (!modal) return;

        const root = modal.querySelector("#wizardRoot");
        const btnNext = modal.querySelector("#btnNext");
        const btnBack = modal.querySelector("#btnBack");
        const btnFinish = modal.querySelector("#btnFinish");
        
        // Contenedor de mensajes
        const statusMessageContainer = modal.querySelector('#registerStatusMessage'); 

        // inputs usados en el registro

        const nombreNegocioEl = modal.querySelector('#nombreNegocio');
        const emailRegistroEl = modal.querySelector('#emailRegistro');
        const telefonoRegistroEl = modal.querySelector('#telefonoRegistro');
        const passwordEl = modal.querySelector('#passwordRegistro');
        const confirmaPasswordEl = modal.querySelector('#passwordRegistroConfirmacion');
        const ciudadRegistroEl = modal.querySelector('#ciudadRegistro'); 
        const codigoPostalRegistroEl = modal.querySelector('#codigoPostalRegistro');

        //inputs intereses
        const inputEl = modal.querySelector('#tagInput');
        const displayContainer = modal.querySelector('#tagContainer');
        const hiddenInput = modal.querySelector('#interesesHidden');
        const tagErrorEl = modal.querySelector('#tagError');

        let si = modal.querySelector("#rSi")?.checked;
        let no = modal.querySelector("#rNo")?.checked;
        
        const steps = {
            "1": root.querySelector('[data-step="1"]'),
            "2a": root.querySelector('[data-step="2a"]'),
            "3": root.querySelector('[data-step="3"]'),
        };

        let current = "1";
        let branch = null; // "2a" o "2b"
        
        function showStatusRegistro(message, type) {
            if (!statusMessageContainer) return;
            statusMessageContainer.textContent = message;
            statusMessageContainer.className = `alert ${type} mt-3 text-center`;
            statusMessageContainer.style.display = 'block';
            setTimeout(() => { statusMessageContainer.style.display = 'none'; }, 5000);
        }

        function hideStatusRegistro() {
            if (statusMessageContainer) statusMessageContainer.style.display = 'none';
        }

        function show(step) {
            //oculta los pasos
            hideStatusRegistro();
            Object.values(steps).forEach(s => s && s.classList.add("d-none"));
            steps[step]?.classList.remove("d-none");
            current = step;

            // Botonera
            btnBack.classList.toggle("d-none", step === "1");
            const isLast = (step === "3");
            btnNext.classList.toggle("d-none", isLast);
            btnFinish.classList.toggle("d-none", !isLast);
        }
        

        function nextFromStep1() {
            // Validacion de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const mailOk = emailRegex.test(emailRegistroEl.value.trim()); 
            
            if (!mailOk) {
                emailRegistroEl.focus();
                return showStatusRegistro('Revisa tu correo electrónico, parece inválido.', 'alert-warning');
            }
            
            // Validacion de telefono
            const telOk = /^\d{10}$/.test(telefonoRegistroEl.value.trim()); 
            if (!telOk) {
                telefonoRegistroEl.focus();
                return showStatusRegistro('Ingresa un teléfono válido de 10 dígitos.', 'alert-warning');
            }

            // Validar que la contrasenia tiene una longitude de minimo 8 caracteres
            const passOk = passwordEl.value.length >= 8;
            if (!passOk) {
                passwordEl.focus();
                return showStatusRegistro('La contraseña debe tener al menos 8 caracteres.', 'alert-warning');
            }

            // Validacion para confirmar la contrasenia 
            if (passwordEl.value !== confirmaPasswordEl.value) {
                confirmaPasswordEl.focus();
                return showStatusRegistro('Las contraseñas no coinciden.', 'alert-warning');
            }
            //Validacion de la ciudad
            if (ciudadRegistroEl.value.trim().length < 3) {
                ciudadRegistroEl.focus();
                return showStatusRegistro('Por favor, ingresa una ciudad válida.', 'alert-warning');
            }

            //validacion del C.P.
            if (!/^\d{5}$/.test(codigoPostalRegistroEl.value.trim())) {
                codigoPostalRegistroEl.focus();
                return showStatusRegistro('El código postal debe tener 5 dígitos.', 'alert-warning');
            }

            si = modal.querySelector("#rSi")?.checked;
            no = modal.querySelector("#rNo")?.checked;

            //tipo de usurio <se movio de posicion>
            if (!si && !no) {
                return showStatusRegistro("Selecciona si eres un puesto para continuar.", 'alert-warning');
            }

            branch = si ? "2a" : "3";
            show(branch);
        }

        // --- Eventos de Navegación ---
        btnNext.addEventListener("click", () => {
            if (current === "1") return nextFromStep1();
            if (current === "2a") return show("3");
        });

        btnBack.addEventListener("click", () => {
            if (current === "3" && si) return show("2a");
            if (current === "3" && !si) return show("1");
            if (current === "2a") return show("1");
            console.log(si,current)
        });
        //confirmacion del registro 
        btnFinish.addEventListener("click", () => {
            showStatusRegistro('¡Registro completado! Redireccionando...', 'alert-success');
            setTimeout(() => {
                const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
                bsModal.hide();
            }, 1500);
        });

    // Evita submit accidental con Enter en pasos intermedios
        modal.addEventListener("keydown", (e) => {
            if (e.target.id === 'tagInput' && e.key === "Enter") {
                return; 
            } //caso tag
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
            hideStatusRegistro();
            const first = modal.querySelector('input, select, textarea, button');
            setTimeout(() => first?.focus(), 50);
        });

        modal.addEventListener("hidden.bs.modal", () => {
            // Limpia formularios dentro del wizard (opcional)
            modal.querySelectorAll("form").forEach(f => f.reset());
            show("1");
            branch = null;
            hideStatusRegistro();
        });

       
    }


  function isBusiness(){
    
  }

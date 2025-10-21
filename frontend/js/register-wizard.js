    import {preview}  from "./ScheduleValidation.js";
    import { update } from "./ScheduleValidation.js";
    import {isScheduleValid} from "./ScheduleValidation"
    import {Business,UserCostumer} from "./classes.js";
    import {existentUsers} from "./loadData.js"

    // Asegura que el DOM esté listo
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    let checkData;

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

        const emailRegistroEl = modal.querySelector('#emailRegistro');
        const telefonoRegistroEl = modal.querySelector('#telefonoRegistro');
        const passwordEl = modal.querySelector('#passwordRegistro');
        const confirmaPasswordEl = modal.querySelector('#passwordRegistroConfirmacion');
        const ciudadRegistroEl = modal.querySelector('#ciudadRegistro'); 
        const codigoPostalRegistroEl = modal.querySelector('#codigoPostalRegistro');

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
            const passOk = passwordEl.value.trim().length >= 8;
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

            //Hacer la validacion del nombre de usuario

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
            checkData=`
                <p class="mb-2"><strong>Email:</strong> <span>${emailRegistroEl.value}</span></p>
                <p class="mb-2"><strong>Teléfono:</strong> <span">${telefonoRegistroEl.value}</span></p>
                <p class="mb-2"><strong>Ciudad:</strong> <span">${ciudadRegistroEl.value}</span></p>
                <p class="mb-0"><strong>Código Postal:</strong> <span>${codigoPostalRegistroEl.value}</span></p>
            `;
            preview.innerHTML=checkData;
            let sheduleReview = JSON.parse(localStorage.getItem("businessSchedule"))

            if (current === "1"){
                localStorage.removeItem("schedulePreview");
                btnFinish.disabled = false;
                return nextFromStep1();
            } 
            if (current === "2a"){
                update();
                if(!isScheduleValid(sheduleReview)){
                    btnFinish.disabled = true;
                }else{
                    btnFinish.disabled = false;
                } 

                return show("3");
            } 
        });

        btnBack.addEventListener("click", () => {
            preview.innerHTML="";
            if (current === "3" && si) return show("2a");
            if (current === "3" && !si) return show("1");
            if (current === "2a") return show("1");
            
        });
        //confirmacion del registro 
        btnFinish.addEventListener("click", () => {

            if(si){
                existentUsers.push(new Business("new_usiness",ciudadRegistroEl.value,codigoPostalRegistroEl.value,emailRegistroEl.value,passwordEl.value,new Date().toISOString().split('T')[0],JSON.parse(localStorage.getItem("businessSchedule"))))
            }else{
                existentUsers.push(new UserCostumer("new_ser",ciudadRegistroEl.value,codigoPostalRegistroEl.value,emailRegistroEl.value,passwordEl.value,new Date().toISOString().split('T')[0]))
            }
            localStorage.removeItem('businessSchedule');
            localStorage.setItem("registedUsers",JSON.stringify(existentUsers))
            
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



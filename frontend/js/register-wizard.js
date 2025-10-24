    import {preview}  from "./ScheduleValidation.js";
    import { update } from "./ScheduleValidation.js";
    import {isScheduleValid} from "./ScheduleValidation"
    import {User, Business} from "./model-classes.js";
    import {getColoniasByPostalCode, checkEmailExists} from "./controllers/getControllers.js"
    import {createUser,createBusiness} from "./controllers/postControllers.js"

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
        const passwordEl = modal.querySelector('#passwordRegistro');
        const confirmaPasswordEl = modal.querySelector('#passwordRegistroConfirmacion');
        const ciudadRegistroEl = modal.querySelector('#ciudadRegistro'); 
        const codigoPostalRegistroEl = modal.querySelector('#codigoPostalRegistro');
        const coloniaRegistroEl = modal.querySelector('#coloniaRegistro');
        const usuarioRegistroEl = modal.querySelector('#usuarioRegistro'); 

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
        
        async function fillSelects(cp){
            const address = await getColoniasByPostalCode(cp);
            if(address != null){
                ciudadRegistroEl.value = `${address[0].colonia}, ${address[0].alcaldia}`
            }
            else{
                ciudadRegistroEl.value = "Codigo postal no encontrado"
            }
        }

        codigoPostalRegistroEl.addEventListener('input',function(){
            if(this.value.length == 5){
                fillSelects(this.value)
            }
            else if(this.value.length >= 5){
                ciudadRegistroEl.value = "Ingresa un numero valido"
            }
        });

        async function nextFromStep1() {
            // Validacion de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const mailOk = emailRegex.test(emailRegistroEl.value.trim()); 
            let exist

            if(emailRegistroEl.value.trim() != ""){
                console.log(emailRegistroEl.value)
                exist = await checkEmailExists(emailRegistroEl.value)
                console.log(exist)
            }else{
                return showStatusRegistro('Ingresa un correo electronico.', 'alert-warning');
            }

            if (!mailOk){
                emailRegistroEl.focus();
                return showStatusRegistro('Revisa tu correo electrónico, parece inválido.', 'alert-warning');
                
            }else if(exist){
                emailRegistroEl.focus();
                return showStatusRegistro('El email ingresado ya esta registado.', 'alert-warning');
            }

            //Validacion del nombre de usuario

            if (usuarioRegistroEl.value.trim() === '') {
                usuarioRegistroEl.focus();
                return showStatusRegistro('El nombre de usuario no puede estar vacío', 'alert-warning');
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

            //validacion del C.P.
            if (!/^\d{5}$/.test(codigoPostalRegistroEl.value.trim())) {
                codigoPostalRegistroEl.focus();
                return showStatusRegistro('El código postal debe tener 5 dígitos.', 'alert-warning');
            }

            if (coloniaRegistroEl.value.trim() === '') {
                usuarioRegistroEl.focus();
                return showStatusRegistro('Ingresa tu calle', 'alert-warning');
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
            checkData=`
                <p class="mb-2"><strong>Usuario:</strong> <span">${usuarioRegistroEl.value}</span></p>
                <p class="mb-2"><strong>Email:</strong> <span>${emailRegistroEl.value}</span></p>
                <p class="mb-2"><strong>Alcaldía:</strong> <span">${ciudadRegistroEl.value}</span></p>
                <p class="mb-2"><strong>Código Postal:</strong> <span>${codigoPostalRegistroEl.value}</span></p>
                <p class="mb-2"><strong>Colonia:</strong> <span>${coloniaRegistroEl.value}</span></p>

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
        btnFinish.addEventListener("click", async function(){

        const role = si ? "business" : "ordinary";
        const NewUser = await createUser(new User(role,emailRegistroEl.value,"6666666666",usuarioRegistroEl.value,"Nuevo el pueblo",'https://doodleipsum.com/1200x1200?i=68988796ecff7ce49d335d7e1f04e8ea',passwordEl.value))    
            console.log(localStorage.getItem("businessSchedule"));
        if(role == "business")await createBusiness(new Business(NewUser.userId,true,JSON.parse(localStorage.getItem('businessSchedule'))));
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
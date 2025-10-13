import {existentUsers} from "./loadData.js";
import {setLogedUser} from "./loadData.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // evita que se envíe sin validar

    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();

    // validaciones de incio de sesión
    if (user === "" || pass === "") {
      showError("Debes ingresar usuario y contraseña");
      return;
    }
  

    //local storage
   const foundUser = existentUsers.find(u => u.email === user && u.password === pass);
   if (!foundUser) {
      showError("Usuario o contraseña incorrectos");
      return; 
    }

    // valida inicio de sesión si los datos coinciden
    loginError.classList.add("d-none");
    setLogedUser(foundUser);
    window.location.href = "feed.html"; // redirige si todo es correcto
  });

  function showError(message) {
    loginError.textContent = message;
    loginError.classList.remove("d-none");
  }
});






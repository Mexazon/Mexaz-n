document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  //usuario y contraseña de prueba
  const testUsers = [
    { username: "andrea", password: "123456" },
    { username: "paty", password: "abcdef" },
    { username: "gio", password: "holacrayola"},
    { username: "jacov", password: "clave123"},
    { username: "freddy", password: "adiostonotos"}
  ];

   if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(testUsers));
   }
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
    const users = JSON.parse(localStorage.getItem("users"));
   const foundUser = users.find(u => u.username === user && u.password === pass);
   if (!foundUser) {
  showError("Usuario o contraseña incorrectos");
  return; 
}

    // valida inicio de sesión si los datos coinciden
    loginError.classList.add("d-none");
    alert("✅ Inicio de sesión válido");
    window.location.href = "feed.html"; // redirige si todo es correcto
  });

  function showError(message) {
    loginError.textContent = message;
    loginError.classList.remove("d-none");
  }
});






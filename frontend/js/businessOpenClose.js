// Simula si el usuario es dueño del negocio (esto vendrá de tu sesión real)
const esDueno = true;

// Estado inicial del negocio (true = abierto)
let negocioAbierto = true;

// Referencia al contenedor principal
const contenedor = document.getElementById("negocioStatus");

function renderNegocioStatus() {
  if (esDueno) {
    contenedor.innerHTML = `
      <div class="card-toggle" id="toggleNegocio">
        <div class="inner-card ${negocioAbierto ? "" : "flipped"}">
          <div class="front">OPEN</div>
          <div class="back">CLOSED</div>
        </div>
      </div>
    `;

    // Agregar evento para voltear
    const card = document.getElementById("toggleNegocio");
    card.addEventListener("click", () => {
      const innerCard = card.querySelector(".inner-card");
      innerCard.classList.toggle("flipped");
      negocioAbierto = !negocioAbierto;
    });
  } else {
    contenedor.innerHTML = `
      <div style="
        padding: 20px;
        border-radius: 10px;
        width: 200px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${negocioAbierto ? "#28a745" : "#dc3545"};
        color: white;
        font-weight: bold;">
        ${negocioAbierto ? "OPEN" : "CLOSED"}
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", renderNegocioStatus);

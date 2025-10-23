import {getLogedUser} from "./loadData.js"

const logedUser = getLogedUser();

const LargeSidebar = document.getElementById("desk-sidebar");
const OffSidebar = document.getElementById("tiny-sidebar");


document.addEventListener("DOMContentLoaded", () => {
  const sidebarContent=`
            <li class="nav-item" id="own-profile">
              <a class="nav-link text-white" href=#><i class="bi bi-person-circle me-2"></i>Perfil</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" href="feed.html"><i class="bi bi-book-half me-2"></i>Feed</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" href="#"><i class="bi bi-heart-fill me-2"></i>Favoritos</a>
            </li>
        
            <li class="nav-item" id="log-out">
              <a class="nav-link text-white" href="index.html"><i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión</a>
            </li>`;
      LargeSidebar.innerHTML = sidebarContent;
    OffSidebar.innerHTML = sidebarContent;
    const btnHambre = document.getElementById("btnHambre");
    const logOutBtn = document.getElementById("log-out");
    btnHambre.addEventListener('click', () => {
      window.location.href = 'hambre.html';
    });
    
    logOutBtn.addEventListener('click', () => {
      console.log("entra")
      localStorage.removeItem("userId");
      localStorage.removeItem("userType");
    });

    document.getElementById('own-profile').addEventListener('click', () =>{
      if(localStorage.getItem("userType")=="ordinary"){
        window.location.href = `user_profile.html?id=${localStorage.getItem("userId")}`
      }
      else{
        window.location.href = `business_profile.html?id=${logedUser.id}`
      }
        
    })
  // Your code here, for example:
});
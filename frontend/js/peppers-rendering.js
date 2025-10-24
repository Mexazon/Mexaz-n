//importo las rutas de los chiles 
import redPepper from '../assets/red-pepper.svg';
import blackPepper from '../assets/black-pepper.svg';
//Funcion que decide que imagen de chile pone 
function pepperImg(filled = true){
  const src = filled ? redPepper : blackPepper;
  return `<img src="${src}" alt="nivel picante" />`;
}

//Funcion que imprime los chiles en el container que le pasen
export function renderPepperRating(container, value, max = 5){
  const v = Math.max(0, Math.min(max, value|0));
  let html = '';
  for (let i = 1; i <= max; i++) html += pepperImg(i <= v);
  container.innerHTML = html;
}
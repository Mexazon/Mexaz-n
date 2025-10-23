import { Schedule, Business} from "./classes.js";
import {existentUsers} from './loadData.js'



if (existentUsers.length < 10){

// --- DATA ---

const normalSchedule = [
    new Schedule('',''),
    new Schedule("08:00", "18:00"),
    new Schedule("08:00", "18:00"),
    new Schedule("08:00", "18:00"),
    new Schedule("08:00", "18:00"),
    new Schedule("", ""),
    new Schedule("", "")
]

const foodData = [
  {name: 'Tacos El Güero',location: 'Benito Juarez'},
  {name: 'Elotes Doña Mary', location: 'Benito Juarez'},
  {name: 'Tamales Oaxaqueños',location: 'Coyoacán'},
  {name: 'Burritos Express', location: 'Cuauhtémoc' },
  {name: 'Pozolería La Tradicional',location: 'Benito Juarez' },
  {name: 'Tacos de Canasta Lupita', location: 'Coyoacán'},
  {name: 'Elotes Don Pepe', location: 'Benito Juarez'},
  {name: 'Tamales de Rajas', location: 'Benito Juarez'},
  {name: 'Burrito Loco', location: 'Benito Juarez'},
  {name: 'Pozole Rojo y Verde', location: 'Cuauhtémoc'},
  {name: 'Tacos al Pastor El Rey', location: 'Benito Juarez'},
  {name: 'Esquites La Güera', location: 'Coyoacán'},
];

function createBusinessesFromFoodData() {
  const businesses = foodData.map((food, index) => {
    const randomCp = Math.floor(10000 + Math.random() * 89999); // CP aleatorio
    const email = `${food.name.toLowerCase().replace(/\s+/g, '')}@ejemplo.com`;
    const password = `business${index + 1}`;
    const dateRegistered = new Date().toISOString().split("T")[0];
    const schedule = normalSchedule;

    return new Business(
      food.name,          // name
      food.location,      // city
      randomCp,           // cp
      email,              // email
      password,           // password
      dateRegistered,     // dateRegistered
      schedule            // schedule
    );
  });

  return businesses;
}
const newBusiness = createBusinessesFromFoodData();
// Ejemplo de uso:
existentUsers.push(...newBusiness);
localStorage.setItem("registedUsers",JSON.stringify(existentUsers))

}

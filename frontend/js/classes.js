import {existentUsers} from "./loadData.js";
//Construccion del modelo de las resenias "Reviews"
export class Review{
    constructor(hours,lugar,calificacion,descripcion,Usuario){
        this.idResenia = JSON.parse(localStorage.getItem("publications"))
        ? JSON.parse(localStorage.getItem("publications")).length+1
        : 1;
        this.usuario = Usuario
        this.hoursAgo = hours
        this.foto = `https://picsum.photos/seed/${Date.now()*Math.random()}/320/240`
        this.lugar = lugar
        this.calificacion = calificacion
        this.descripcion = descripcion
     
    }
}

//Aniadir un metodo para calcular un metodo para calcular el tiempo desde que se creo la review hasta el presente
//si fue hace menos de 24hrs mostrar en horas, su fue en menos de 30 dias mostrar en dias, si fue hace mas de 30 diqs, contar por meses
//Eliminar el paramentro de horas y remplazarlo por 'fecha de cracion' Debe almacenar el dia que se creo el post


class User{
    role;
    avatar;
    constructor(name,city,cp,email,password,dateRegistered){
        this.id = existentUsers.length + 1
        this.name=name
        this.location=city
        this.cp=cp
        this.email=email
        this.password=password
        this.dateRegistered=dateRegistered
    }
}

export class Schedule{
    constructor(opening, closing){
        this.opening=opening;
        this.closing=closing;
    }
}
export function isOpen(schedule) {
    // Si los valores no existen o están vacíos → cerrado
    if (
        !schedule ||
        !schedule.opening || !schedule.closing ||
        schedule.opening.trim() === "" || schedule.closing.trim() === ""
    ) {
        return false;
    }

    const now = new Date();

    // Hora actual en minutos desde medianoche
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Convertir horarios a minutos
    const [openH, openM] = schedule.opening.split(':').map(Number);
    const [closeH, closeM] = schedule.closing.split(':').map(Number);

    const openingMinutes = openH * 60 + openM;
    const closingMinutes = closeH * 60 + closeM;

    // Caso normal (mismo día)
    if (openingMinutes < closingMinutes) {
        return currentMinutes >= openingMinutes && currentMinutes < closingMinutes;
    }

    // Caso nocturno (por ejemplo 20:00 → 02:00)
    return currentMinutes >= openingMinutes || currentMinutes < closingMinutes;
}

export class Dishes{
    constructor(dishName,description,price,category){
        this.dishName = dishName;
        this.descripcion =description;
        this.price=price;
        this.category=category;
    }
}

export class Business extends User{
    constructor(name,city,cp,email,password,dateRegistered,schedule){
        super(name,city,cp,email,password,dateRegistered);
        this.schedule = schedule;
        this.role="business";
        this.bioDescription="Tragate toda la garnacha!";
        this.avatar= `https://picsum.photos/seed/${335577*Math.random()}/320/240`;
        this.menu = [];
        this.isOpen = isOpen(this.schedule)
    }
}

export class UserCostumer extends User{
    constructor(name,city,cp,email,password,dateRegistered){
        super(name,city,cp,email,password,dateRegistered);
        this.role="user";
        this.bioDescription="Que antojo tengo!";
        this.avatar=`https://i.pravatar.cc/400?img=${Math.floor(Math.random() * 70) + 1}`;
    }
}


//Construccion del modelo de las resenias "Reviews"
export class Review{
    constructor(hours,lugar,calificacion,descripcion,id){
        const idResenia = id;
        const idUsuario = 2
        const idNegocio = 3
        this.hoursAgo = hours
        this.foto = `https://picsum.photos/seed/${idResenia*Math.random()}/320/240`
        this.lugar = lugar
        this.likes = 0
        this.calificacion = calificacion
        this.descripcion = descripcion
    }
}

//Aniadir un metodo para calcular un metodo para calcular el tiempo desde que se creo la review hasta el presente
//si fue hace menos de 24hrs mostrar en horas, su fue en menos de 30 dias mostrar en dias, si fue hace mas de 30 diqs, contar por meses
//Eliminar el paramentro de horas y remplazarlo por 'fecha de cracion' Debe almacenar el dia que se creo el post


class User{
    role;
    constructor(name,city,cp,email,password,dateRegistered){
        this.name=name
        this.city=city
        this.cp=cp
        this.email=email
        this.password=password
        this.dateRegistered=dateRegistered
        this.bioDescription="Que antojo tengo!";
        this.profilePhoto="https://i.pravatar.cc/200?img=12";
    }
}

export class Schedule{
    constructor(opening, closing){
        this.opening=opening;
        this.closing=closing;
    }
}

export class Business extends User{
    constructor(name,city,cp,email,password,dateRegistered,schedule){
        super(name,city,cp,email,password,dateRegistered);
        this.schedule = schedule;
        this.role="business";
        this.ranking = 0;
        this.menu = [];
    }
}

export class UserCostumer extends User{
    constructor(name,city,cp,email,password,dateRegistered){
        super(name,city,cp,email,password,dateRegistered);
        this.role="user";
        this.favorito="";
    }
}
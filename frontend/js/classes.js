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
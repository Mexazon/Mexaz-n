

function getExistentUsers(){
    let registedUsers = JSON.parse(localStorage.getItem("registedUsers")) || [];
    return registedUsers; 
}



export function getLogedUser(){
    return JSON.parse(localStorage.getItem("logedUser"))
}

export let existentUsers = getExistentUsers();


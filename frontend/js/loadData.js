import {Business,UserCostumer} from "./classes.js";

function getExistentUsers(){
    let registedUsers = JSON.parse(localStorage.getItem("registedUsers")) || [];
    const restoredList = registedUsers.map(u => {return u.role =="business" 
        ? Object.assign(new Business(), u)
        :Object.assign(new UserCostumer(), u)});
    return restoredList; 
}

function setLogedUser(users){
    localStorage.setItem("logedUser",JSON.stringify(users));
}

export let existentUsers = getExistentUsers();

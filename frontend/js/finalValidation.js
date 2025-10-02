import {isScheduleValid} from "./ScheduleValidation"

const btnConfirm = document.getElementById("btnFinish");
let sheduleReview = JSON.parse(localStorage.getItem("businessSchedule"))
const btnNext   = document.getElementById("btnNext");

btnNext.addEventListener("click",()=>{
    if(isScheduleValid(sheduleReview)){
        btnConfirm.disabled = false;
    }
    else{
        btnConfirm.disabled = true;
    }
})



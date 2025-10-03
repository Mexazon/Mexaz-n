import {isScheduleValid} from "./ScheduleValidation"

const btnConfirm = document.getElementById("btnFinish");

const btnNext   = document.getElementById("btnNext");

btnNext.addEventListener("click",()=>{
    let sheduleReview = JSON.parse(localStorage.getItem("businessSchedule"))
    if(isScheduleValid(sheduleReview)){
        btnConfirm.disabled = false;
    }
    else{
        btnConfirm.disabled = true;
    }
})



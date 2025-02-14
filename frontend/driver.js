document.addEventListener("DOMContentLoaded", function(){
    const passengerList=document.getElementById("passengerList");
    const toggleDutyBtn=document.getElementById("toggleDuty");
    const dutyStatus=document.getElementById("dutyStatus");

    let isOnDuty=localStorage.getItem("isOnDuty") === "true";

    function updateDutyStatus(){
        if (isOnDuty){
            dutyStatus.innerText="Status: On Duty";
            toggleDutyBtn.innerText="Go Off Duty";
            updatePassengerList();
        } else {
            dutyStatus.innerText="Status: Off Duty";
            toggleDutyBtn.innerText="Go On Duty";
            passengerList.innerHTML="";
        }
}

toggleDutyBtn.addEventListener("click", function(){
    isOnDuty=!isOnDuty;
    localStorage.setItem("isOnDuty", isOnDuty);
    updateDutyStatus();
});

function updatePassengerList(){
    if (!isOnDuty) return;

    passengerList.innerHTML="";

    let checkIns=JSON.parse(localStorage.getItem("passengerCheckIns")) || [];
    checkIns.forEach(data => {
        document.createElement("li");
        listItem.innerHTML=`Passenger at </b> ${data.lat}, <b>Lng:</b> ${data.lng} <br> Checked in at: ${data.timestamp}`;
        passengerList.appendChild(listItem);
    });
}

setInterval(updatePassengerList, 5000);

updateDutyStatus();
});
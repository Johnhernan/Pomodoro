//---------------- Config Variables ---------------
let DOMWorkTime = document.querySelector('.work-time');
let DOMBreakTime = document.querySelector('.break-time');
let DOMStartBtn = document.querySelector("#start-btn");
let DOMResetBtn = document.querySelector("#reset-btn");

let _configWorkTime = null;
let _configBreakTime = null;
let appRunning = false;

let interval = 0;    
let workTime = {
    seconds: 0,
    minutes: 0
};
//---------------- Work Time Listener ---------------
DOMWorkTime.addEventListener('change', (event) => {
    _configWorkTime = event.target.value;
    workTime.minutes = _configWorkTime;
    updateTimerDOM(`${_configWorkTime}:00`);
    if(isInt(_configBreakTime)) {
       DOMStartBtn.disabled = false;
    }
});
//---------------- Break Time Listener ---------------
DOMBreakTime.addEventListener('change', (event) => {
    _configBreakTime = event.target.value;
    if(isInt(_configWorkTime)) {
        DOMStartBtn.disabled = false;
    }
});

//---------------- Start Counter Listener ---------------
DOMStartBtn.addEventListener("click", function(event) {
    if (!DOMWorkTime.disabled){
        DOMWorkTime.disabled = true;
        DOMBreakTime.disabled = true;
        DOMResetBtn.disabled = false;
    }
    updateStartButtonDOM("Pause!")
    
    appRunning = !appRunning;
    let isWorkTime = true;
    let intervalID = setInterval(function () {
        if (interval === 3){
            appRunning = false;
            updateHeaderDOM("Finished! Refresh to Reset.");
            DOMStartBtn.disabled = true;
            clearInterval(intervalID);
        }
        if(appRunning) {
            if (workTime.seconds != 0) {
                workTime.seconds -= 1;
                time = `${formatTime(workTime.minutes)}:${formatTime(workTime.seconds)}`;
                updateTimerDOM(time);
            }
            else if (workTime.seconds <= 0) {
                workTime.seconds += 59;
                workTime.minutes -= 1;
                time = `${formatTime(workTime.minutes)}:${formatTime(workTime.seconds)}`;
                updateTimerDOM(time);
            }

            if (time === "00:00") {
                if (isWorkTime) {
                    workTime.minutes += _configBreakTime;
                    updateHeaderDOM("Break Time!")
                }
                else {
                    workTime.minutes += _configWorkTime;
                    interval += 1; 
                    updateHeaderDOM("Work Time!")
                    document.querySelector(`.interval-${interval}`).style.background = "green";
                }
                isWorkTime = !isWorkTime;
            }
        }else{
            updateStartButtonDOM("Continue")
            clearInterval(intervalID);
        }
    }, 1);
});

DOMResetBtn.addEventListener("click", function(event) {
    _configWorkTime = null;
    _configBreakTime = null;
    appRunning = false;
    workTime = {
        seconds: 0,
        minutes: 0
    };
    DOMWorkTime.disabled = false;
    DOMBreakTime.disabled = false;
    DOMWorkTime.value = "default";
    DOMBreakTime.value = "default";
    updateHeaderDOM("Work Time!");
    updateTimerDOM("Select a time");
    updateStartButtonDOM("Start!");
    resetIntervalCount();
    DOMResetBtn.disabled = true;
    DOMStartBtn.disabled = true;
});

//---------------- Utilities ---------------
function isInt(value) {
    return !isNaN(value) && 
        parseInt(Number(value)) == value && 
        !isNaN(parseInt(value, 10));
}

function formatTime(time) {   
    let formatedTime = "";
    if (time < 10) {
        formatedTime = "0" + `${time}`;
    } 
    else formatedTime = time;
    return formatedTime;
}

//---------------- Update the DOM ---------------
function updateTimerDOM(time) {
    document.querySelector(".timer").innerHTML = `${time}`;
}

function resetIntervalCount() {
    interval = 0;  
    const icons = document.querySelectorAll(".cycle-icon");
    icons.forEach(function(icon) {
        icon.style.background = "red";
    })
}
function updateStartButtonDOM(state) {
    document.querySelector("#start-btn").innerHTML = `${state}`;
}

function updateHeaderDOM(task) {
    document.querySelector(".task-header").innerHTML = `${task}`;
}

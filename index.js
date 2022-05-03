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
//---------------- Work Time Selector Listener ---------------
DOMWorkTime.addEventListener('change', (event) => {
    _configWorkTime = event.target.value;
    workTime.minutes = _configWorkTime;
    updateTimerDOM(`${_configWorkTime}:00`);
    if(isInt(_configBreakTime)) {
       DOMStartBtn.disabled = false;
    }
});
//---------------- Break Time Selector Listener ---------------
DOMBreakTime.addEventListener('change', (event) => {
    _configBreakTime = event.target.value;
    if(isInt(_configWorkTime)) {
        DOMStartBtn.disabled = false;
    }
});

//---------------- Start Counter Listener ---------------
DOMStartBtn.addEventListener("click", function(event) {
    //Disables Selectors, enables reset btn
    if (!DOMWorkTime.disabled) {
        DOMWorkTime.disabled = true;
        DOMBreakTime.disabled = true;
        DOMResetBtn.disabled = false;
    }
    //Changes btn text
    updateStartButtonDOM("Pause!")
    appRunning = !appRunning;
    let isWorkTime = true;

    //Initialize count
    let intervalID = setInterval(function () {
        console.log("here")
        //If last interval ends countdown
        if (interval === 3) {
            appRunning = false;
            updateHeaderDOM("Finished! Please click the Reset button");
            DOMStartBtn.disabled = true;
            clearInterval(intervalID);
        }

        if(appRunning) {
            //Reduces seconds
            if (workTime.seconds != 0) {
                workTime.seconds -= 1;
                time = `${formatTime(workTime.minutes)}:${formatTime(workTime.seconds)}`;
                updateTimerDOM(time);
            }
            //Once minute has passed reduces minutes. Resets seconds
            else if (workTime.seconds <= 0) {
                workTime.seconds += 59;
                workTime.minutes -= 1;
                time = `${formatTime(workTime.minutes)}:${formatTime(workTime.seconds)}`;
                updateTimerDOM(time);
            }
            //Executes once counter reaches 0
            if (time === "00:00") {
                //Switches to break counter
                if (isWorkTime) {
                    workTime.minutes += _configBreakTime;
                    updateHeaderDOM("Break Time!");
                }
                //Switches to work counter
                else {
                    workTime.minutes += _configWorkTime;
                    interval += 1; 
                    updateHeaderDOM("Work Time!");
                    document.querySelector(`.interval-${interval}`).style.background = "#FD5D5D";
                }
                //Toggles between work time and break time
                isWorkTime = !isWorkTime;
            }
        }
        //Catches Pause button click. 
        else{
            //Condition is needed to check if Pause button was pressed
            if(document.querySelector("#start-btn").innerHTML === "Pause!" && !appRunning) {
                updateStartButtonDOM("Continue");
            }
            clearInterval(intervalID);
        }
    }, 1000);
});

//Reset button. Reinitializes the app
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
        icon.style.background = "#FF8080";
    })
}
function updateStartButtonDOM(state) {
    document.querySelector("#start-btn").innerHTML = `${state}`;
}

function updateHeaderDOM(task) {
    document.querySelector(".current-task").innerHTML = `${task}`;
}

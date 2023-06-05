import { setCoordinates,fillInputDots,fillColor,objectDisappear,objectAppear,setter,calculateFullAdder} from "./animation-utility.js";

'use strict'

window.appendInputA0 = appendInputA0;
window.appendInputB0 = appendInputB0;
window.appendInputA1 = appendInputA1;
window.appendInputB1 = appendInputB1;
window.appendInputA2 = appendInputA2;
window.appendInputB2 = appendInputB2;
window.appendInputA3 = appendInputA3;
window.appendInputB3 = appendInputB3;
window.appendInputC0 = appendInputC0;
window.simulationStatus = simulationStatus;
window.restartCircuit = restartCircuit;
window.setSpeed=setSpeed;


let C1 = '0';
let C2 = '0';
let C3 = '0';



// Dimensions of working area
const circuitBoard = document.getElementById("circuit-board");
const sidePanels = document.getElementsByClassName("v-datalist-container");
// Distance of working area from top
const circuitBoardTop = circuitBoard.offsetTop;
// Full height of window
const windowHeight = window.innerHeight;
const width = window.innerWidth;

const svg = document.querySelector(".svg");
const svgns = "http://www.w3.org/2000/svg";

const EMPTY="";
// stroing the necessary div elements in const
const status = document.getElementById("play-or-pause");
const observ = document.getElementById("observations");
const speed = document.getElementById("speed");

// global varaibles declared here
const objects = [
    document.getElementById("inputa0"),
    document.getElementById("inputb0"),
    document.getElementById("inputa1"),
    document.getElementById("inputb1"),
    document.getElementById("inputa2"),
    document.getElementById("inputb2"),
    document.getElementById("inputa3"),
    document.getElementById("inputb3"),
    document.getElementById("inputc0"),
    document.getElementById("outputs0"),
    document.getElementById("outputs1"),
    document.getElementById("outputs2"),
    document.getElementById("outputs3"),
    document.getElementById("outputc4")
];
const textInput = [
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text")
];
const textOutput = [
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text")
];
const dots = [
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle")
];
// First 2 dots emerge from input A0 and B0
// Next 2 dots emerge from input A1 and B1
// Next 2 dots emerge from input A2 and B2
// Next 2 dots emerge from input A3 and B3
// Last dot emerges from input C0



// decide help to decide the speed
let decide = false;
// circuitStarted is initialised to 0 which depicts that demo hasn't started whereas circuitStarted 1 depicts that the demo has started.
let circuitStarted = false;


// function to take care of width
function demoWidth() {
    if (width < 1024) {
        circuitBoard.style.height = "600px";
    } else {
        circuitBoard.style.height = `${windowHeight - circuitBoardTop - 20}px`;
    }
    sidePanels[0].style.height = circuitBoard.style.height;
}

// function to initialise the input text i.e. either 0/1 that gets displayed after user click on them
function textIOInit() {
    for( const text of textInput){
        text.textContent = 2;
    }
}


// function to mark the output coordinates
function outputCoordinates() {
    setCoordinates(170,546,textOutput[0]);
    svg.append(textOutput[0]);
    setCoordinates(370,546,textOutput[1]);
    svg.append(textOutput[1]);
    setCoordinates(570,546,textOutput[2]);
    svg.append(textOutput[2]);
    setCoordinates(770,546,textOutput[3]);
    svg.append(textOutput[3]);
    setCoordinates(921,394,textOutput[4]);
    svg.append(textOutput[4]);
}

// function to mark the input dots
function inputDots() {
    for(const dot of dots){
        fillInputDots(dot,20,550,15,"#FF0000");
        svg.append(dot);
    }
}

// function to disappear the input dots
function inputDotDisappear() {
    for(const dot of dots){
        objectDisappear(dot);
    }
}

// function to appear the input dots
function inputDotVisible1() {
    objectAppear(dots[0]);
    objectAppear(dots[1]);
    objectAppear(dots[8]);
}
function inputDotVisible2() {
    objectAppear(dots[2]);
    objectAppear(dots[3]);
}
function inputDotVisible3() {
    objectAppear(dots[4]);
    objectAppear(dots[5]);
}
function inputDotVisible4() {
    objectAppear(dots[6]);
    objectAppear(dots[7]);
}

// function to disappear the output text
function outputDisappear() {
    for(const text of textOutput){
        objectDisappear(text);
    }
}
// function to appear the output text
function outputVisible() {
    for(const text of textOutput){
        objectAppear(text);
    }
}
// function to diappear the input text
function inputTextDisappear() {
    for(const text of textInput){
        objectDisappear(text);
    }
}

function clearObservation() {
    observ.innerHTML = EMPTY;
}
function allDisappear() {
    inputDotDisappear();
    outputDisappear();
    inputTextDisappear();
    for(const object of objects){
        fillColor(object,"#008000");
    }
}

function appendInputA0() {
    if (textInput[0].textContent !== "0" && timeline.progress() === 0) {
        changeto0(146,244,0,0);
    }
    else if (textInput[0].textContent !== "1" && timeline.progress() === 0) {
        changeto1(146,244,0,0);
    }
    setter(textInput[0].textContent,dots[0]);
}
function appendInputB0() {
    if (textInput[1].textContent !== "0" && timeline.progress() === 0) {
        changeto0(196,244,1,1);
    }
    else if (textInput[1].textContent !== "1" && timeline.progress() === 0) {
        changeto1(196,244,1,1);
    }
    setter(textInput[1].textContent,dots[1]);
}
function appendInputA1() {
    if (textInput[2].textContent !== "0" && timeline.progress() === 0) {
        changeto0(346,244,2,2);
    }
    else if (textInput[2].textContent !== "1" && timeline.progress() === 0) {
        changeto1(346,244,2,2);
    }
    setter(textInput[2].textContent,dots[2]);
}
function appendInputB1() {
    if (textInput[3].textContent !== "0" && timeline.progress() === 0) {
        changeto0(396,244,3,3);
    }
    else if (textInput[3].textContent !== "1" && timeline.progress() === 0) {
        changeto1(396,244,3,3);
    }
    setter(textInput[3].textContent,dots[3]);
}
function appendInputA2() {
    if (textInput[4].textContent !== "0" && timeline.progress() === 0) {
        changeto0(546,244,4,4);
    }
    else if (textInput[4].textContent !== "1" && timeline.progress() === 0) {
        changeto1(546,244,4,4);
    }
    setter(textInput[4].textContent,dots[4]);
}
function appendInputB2() {
    if (textInput[5].textContent !== "0" && timeline.progress() === 0) {
        changeto0(596,244,5,5);
    }
    else if (textInput[5].textContent !== "1" && timeline.progress() === 0) {
        changeto1(596,244,5,5);
    }
    setter(textInput[5].textContent,dots[5]);
}
function appendInputA3() {
    if (textInput[6].textContent !== "0" && timeline.progress() === 0) {
        changeto0(746,244,6,6);
    }
    else if (textInput[6].textContent !== "1" && timeline.progress() === 0) {
        changeto1(746,244,6,6);
    }
    setter(textInput[6].textContent,dots[6]);
}
function appendInputB3() {
    if (textInput[7].textContent !== "0" && timeline.progress() === 0) {
        changeto0(796,244,7,7);
    }
    else if (textInput[7].textContent !== "1" && timeline.progress() === 0) {
        changeto1(796,244,7,7);
    }
    setter(textInput[7].textContent,dots[7]);
}


function appendInputC0() {
    if (textInput[8].textContent !== "0" && timeline.progress() === 0) {
        changeto0(21,394,8,8);
    }
    else if (textInput[8].textContent !== "1" && timeline.progress() === 0) {
        changeto1(21,394,8,8);
    }
    setter(textInput[8].textContent,dots[8]);

}

function changeto1(coordinateX,coordinateY,object,textObject) {
    textInput[textObject].textContent = 1;
    svg.appendChild(textInput[textObject]);
    setCoordinates(coordinateX,coordinateY,textInput[textObject]);
    fillColor(objects[object],"#29e");
    clearObservation();
    objectAppear(textInput[textObject]);
}

function changeto0(coordinateX,coordinateY,object,textObject) {
    textInput[textObject].textContent = 0;
    svg.appendChild(textInput[textObject]);
    setCoordinates(coordinateX,coordinateY,textInput[textObject]);
    fillColor(objects[object],"#eeeb22");
    clearObservation();
    objectAppear(textInput[textObject]);
}



function stage1() {
    objectDisappear(dots[1]);
    const arr = calculateFullAdder(textInput[0].textContent,textInput[1].textContent,textInput[8].textContent); // [sum,carry]
    setter(arr[0],dots[0]);
    setter(arr[1],dots[8]);
    C1 = arr[1];
}
function stage2() {
    objectDisappear(dots[3]);
    const arr = calculateFullAdder(textInput[2].textContent,textInput[3].textContent,C1); // [sum,carry]
    setter(arr[0],dots[2]);
    setter(arr[1],dots[8]);
    C2 = arr[1];
}
function stage3() {
    objectDisappear(dots[5]);
    const arr = calculateFullAdder(textInput[4].textContent,textInput[5].textContent,C2); // [sum,carry]
    setter(arr[0],dots[4]);
    setter(arr[1],dots[8]);
    C3 = arr[1];
}
function stage4() {
    objectDisappear(dots[7]);
    const arr = calculateFullAdder(textInput[6].textContent,textInput[7].textContent,C3); // [sum,carry]
    setter(arr[0],dots[6]);
    setter(arr[1],dots[8]);
}

// function partialDotAppear(){
//     for(let i=0;i<2;i++){
//         objectAppear(dots[i]);
//     }
// }



function outputSetter1(){
    objectDisappear(dots[0]);
    const arr = calculateFullAdder(textInput[0].textContent,textInput[1].textContent,textInput[8].textContent); // [sum,carry]
    textOutput[0].textContent = arr[0];
    setter(textOutput[0].textContent,objects[9]);
    objectAppear(textOutput[0]);
}
function outputSetter2(){
    objectDisappear(dots[2]);
    const arr = calculateFullAdder(textInput[2].textContent,textInput[3].textContent,C1); // [sum,carry]
    textOutput[1].textContent = arr[0];
    setter(textOutput[1].textContent,objects[10]);
    objectAppear(textOutput[1]);
}
function outputSetter3(){
    objectDisappear(dots[4]);
    const arr = calculateFullAdder(textInput[4].textContent,textInput[5].textContent,C2); // [sum,carry]
    textOutput[2].textContent = arr[0];
    setter(textOutput[2].textContent,objects[11]);
    objectAppear(textOutput[2]);
}
function outputSetter4(){
    objectDisappear(dots[6]);
    const arr = calculateFullAdder(textInput[6].textContent,textInput[7].textContent,C3); // [sum,carry]
    textOutput[3].textContent = arr[0];
    setter(textOutput[3].textContent,objects[12]);
    objectAppear(textOutput[3]);
}
function outputSetter5(){
    objectDisappear(dots[8]);
    const arr = calculateFullAdder(textInput[6].textContent,textInput[7].textContent,C3); // [sum,carry]
    textOutput[4].textContent = arr[1];
    setter(textOutput[4].textContent,objects[13]);
    objectAppear(textOutput[4]);
}

function display() {
    observ.innerHTML = "Simulation has finished. Please click on Reset and repeat the instructions given to start again."
}

function reboot() {
    for(const text of textInput){
        text.textContent = 2;
    }
}

function setSpeed(speed) {
    if (circuitStarted) {
        timeline.timeScale(parseInt(speed));
        observ.innerHTML = `${speed}x speed`;
    }
}

function restartCircuit() {
    if (circuitStarted) {
        circuitStarted = false;
    }
    timeline.seek(0);
    timeline.pause();
    allDisappear();
    reboot();
    clearObservation();
    decide = false;
    status.innerHTML = "Start";
    observ.innerHTML = "Successfully restored";
    speed.selectedIndex = 0;
}

function simulationStatus() {
    if (!decide) {
        startCircuit();
    }
    else {
        stopCircuit();
    }
}
function stopCircuit() {
    if (timeline.progress() !== 1) {
        timeline.pause();
        observ.innerHTML = "Simulation has been Paused. Please click on the 'Start' button to Resume.";
        decide = false;
        status.innerHTML = "Start";
        speed.selectedIndex = 0;
    }
    else {
        observ.innerHTML = "Please Restart the simulation";
    }
}
function startCircuit() {
    for(const text of textInput){
        if (text.textContent === "2") {
            observ.innerHTML = "Please set the input values";
            return;
        }
    }
    if (timeline.progress() !== 1) {
        if (!circuitStarted) {
            circuitStarted = true;
        }
        timeline.play();
        timeline.timeScale(1);
        observ.innerHTML = "Simulation has started.";
        decide = true;
        status.innerHTML = "Pause";
        speed.selectedIndex = 0;
    }
    else {
        observ.innerHTML = "Please Restart the simulation";
    }
}



// all the execution begin here
let timeline = gsap.timeline({ repeat: 0, repeatDelay: 0 });
gsap.registerPlugin(MotionPathPlugin);
demoWidth();
// calling all the functions that are going to initialise 
textIOInit();
outputCoordinates();
inputDots();
outputDisappear();

timeline.add(inputDotVisible1, 0);
timeline.add(stage1, 2);
timeline.add(inputDotVisible2, 2);
timeline.add(outputSetter1, 4);
timeline.add(stage2, 4);
timeline.add(inputDotVisible3, 4);
timeline.add(outputSetter2, 6);
timeline.add(stage3, 6);
timeline.add(inputDotVisible4, 6);
timeline.add(outputSetter3, 8);
timeline.add(stage4, 8);
timeline.add(outputSetter4, 10);
timeline.add(outputSetter5, 10);
timeline.eventCallback("onComplete", outputVisible);
timeline.eventCallback("onComplete", display);

timeline.to(dots[0], {
    motionPath: {
        path: "#path1",
        align: "#path1",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[1], {
    motionPath: {
        path: "#path2",
        align: "#path2",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[2], {
    motionPath: {
        path: "#path3",
        align: "#path3",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    delay: 2,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[3], {
    motionPath: {
        path: "#path4",
        align: "#path4",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    delay: 2,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[4], {
    motionPath: {
        path: "#path5",
        align: "#path5",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    delay: 4,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[5], {
    motionPath: {
        path: "#path6",
        align: "#path6",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    delay: 4,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[6], {
    motionPath: {
        path: "#path7",
        align: "#path7",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    delay: 6,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[7], {
    motionPath: {
        path: "#path8",
        align: "#path8",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    delay: 6,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[8], {
    motionPath: {
        path: "#path9",
        align: "#path9",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[8], {
    motionPath: {
        path: "#path10",
        align: "#path10",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    delay: 2,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[8], {
    motionPath: {
        path: "#path11",
        align: "#path11",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    delay: 4,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[8], {
    motionPath: {
        path: "#path12",
        align: "#path12",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    delay: 6,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[8], {
    motionPath: {
        path: "#path13",
        align: "#path13",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    delay: 8,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[0], {
    motionPath: {
        path: "#path14",
        align: "#path14",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    delay: 2,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[2], {
    motionPath: {
        path: "#path15",
        align: "#path15",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    delay: 4,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[4], {
    motionPath: {
        path: "#path16",
        align: "#path16",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 2,
    delay: 6,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[6], {
    motionPath: {
        path: "#path17",
        align: "#path17",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    
    duration: 2,
    delay: 8,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

},0);


timeline.pause();
inputDotDisappear();
import { simulateFA, deleteFA } from "./fa.js";
import { simulate, deleteElement } from "./gate.js";
import {
  connectGate,
  connectFA,
  unbindEvent,
  initHalfAdder,
  initFullAdder,
  initRippleAdder,
  refreshWorkingArea,
} from "./main.js";

"use strict";
// Wires Colours
export const wireColours = [
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#bf6be3",
  "#ff00ff",
  "#00ffff",
  "#ff8000",
  "#00ff80",
  "#80ff00",
  "#ff0080",
  "#8080ff",
  "#c0c0c0",
];

// Contextmenu
const menu = document.querySelector(".menu");
const menuOption = document.querySelector(".menu-option");

export const setPosition = ({ top, left }) => {
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  menu.style.display = "block";
};

window.addEventListener("click", e => {
  if (menu.style.display != "none")
  {
    menu.style.display = "none";
  }
  window.selectedComponent = null;
  window.componentType = null;
});

menuOption.addEventListener("click", e => {
  if (e.target.innerHTML === "Delete") {

    if (window.componentType === "gate") {
      deleteElement(window.selectedComponent);
    }

    else if(window.componentType === "fullAdder"){
      deleteFA(window.selectedComponent);
    }
  }
  window.selectedComponent = null;
  window.componentType = null;
});

// Tabs

function changeTabs(e) {
  const task = e.target.parentNode.id;
  if (window.currentTab === task) {
    return;
  }

  if (window.currentTab != null) {
    document.getElementById(window.currentTab).classList.remove("is-active");
  }
  window.currentTab = task;
  document.getElementById(task).classList.add("is-active");

  // Half adder
  switch (task) {
    case "task1":
      unbindEvent();
      connectGate();
      refreshWorkingArea();
      initHalfAdder();
      window.simulate = simulate;
      break;
    case "task2":
      unbindEvent();
      connectGate();
      refreshWorkingArea();
      initFullAdder();
      window.simulate = simulate;
      break;
    case "task3":
      unbindEvent();
      connectFA();
      refreshWorkingArea();
      initRippleAdder();
      window.simulate = simulateFA;
      break; 
  }
  updateToolbar();
  updateInstructions();
  clearObservations();
  resize();
}

window.changeTabs = changeTabs;

// Instruction box
const updateInstructions = () => {
  const task = window.currentTab;
  const instructionBox = document.getElementById("instruction-title");
  let title = ""; 
  if (task === "task1") {
    title = `Instructions<br>Implement a 1-bit half adder using logic gates`;
  } else if (task === "task2") {
    title = `Instructions<br>Implement a 1-bit full adder using logic gates`;
  } else if (task === "task3") {
    title = `Instructions<br>Implement a 4-bit ripple carry adder using full adders`;
  }
  instructionBox.innerHTML = title;
}

// Toolbar

function updateToolbar() {
  let elem = "";
  if (window.currentTab === "task1") {
    elem =
      '<div class="component-button and" onclick="addGate(event)">AND</div><div class="component-button or" onclick="addGate(event)">OR</div><div class="component-button not" onclick="addGate(event)">NOT</div><div class="component-button nand" onclick="addGate(event)">NAND</div><div class="component-button nor" onclick="addGate(event)">NOR</div><div class="component-button xor" onclick="addGate(event)">XOR</div><div class="component-button xnor" onclick="addGate(event)">XNOR</div>';
  } else if (window.currentTab === "task2") {
    elem =
      '<div class="component-button and" onclick="addGate(event)">AND</div><div class="component-button or" onclick="addGate(event)">OR</div><div class="component-button not" onclick="addGate(event)">NOT</div><div class="component-button nand" onclick="addGate(event)">NAND</div><div class="component-button nor" onclick="addGate(event)">NOR</div><div class="component-button xor" onclick="addGate(event)">XOR</div><div class="component-button xnor" onclick="addGate(event)">XNOR</div>';
  } else if (window.currentTab === "task3") {
    elem =
      '<div class="component-button fulladder" onclick="addFA(event)"></div>';
  }

  document.getElementById("toolbar").innerHTML = elem;
}

// Clear observations
function clearObservations() {
  document.getElementById("table-body").innerHTML = "";
  document.getElementById("table-head").innerHTML = "";
  document.getElementById("result").innerHTML = "";
}

// Making webpage responsive

// Dimensions of working area
const circuitBoard = document.getElementById("circuit-board");
// Distance of working area from top
const circuitBoardTop = circuitBoard.offsetTop;
// Full height of window
const windowHeight = window.innerHeight;
const width = window.innerWidth;
if (width < 1024) {
  circuitBoard.style.height = 600 + "px";
} else {
  circuitBoard.style.height = windowHeight - circuitBoardTop - 20 + "px";
}

function resize() {
  const circuitBoard = document.getElementById("circuit-board");
  const sidePanels = document.getElementsByClassName("v-datalist-container");

  if (width >= 1024) {
    for (let i = 0; i < sidePanels.length; i++) {
      sidePanels[i].style.height = circuitBoard.style.height;
    }
  }
}

resize();
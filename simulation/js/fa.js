import { registerGate, jsPlumbInstance } from "./main.js";
import { setPosition } from "./layout.js";
import { clearResult, gates, printErrors } from "./gate.js";
import {
  computeAnd,
  computeOr,
  computeXor
} from "./validator.js";

"use strict";
// Dictionary of all full adders in the circuit with their IDs as keys
export let fullAdder = {};

export function clearFAs() {
  for (let faID in fullAdder) {
    delete fullAdder[faID];
  }
  fullAdder = {};
}

// {output-id: [gate,pos]}
export const finalOutputs = {
  "Output-5": [],
  "Output-8": [],
  "Output-11": [],
  "Output-12": [],
};

export class FullAdder {
  constructor() {
    this.id = "FullAdder-" + window.numComponents++;
    this.a0 = []; // Takes 2 items in a list : Gate, Output endpoint of gate
    this.b0 = [];
    this.cin = [];
    this.sum = null;
    this.cout = null;
    this.outCout = [];
    this.outSum = [];
    this.inputPoints = [];
    this.outputPoints = [];
    this.coutIsConnected = false;
    this.sumIsConnected = false;
    this.component = `<div class="drag-drop fulladder" id= ${this.id} style="width:100px;height:100px;"></div>`;
  }

  // Adds element to the circuit board, adds event listeners and generates its endpoints.
  registerComponent(workingArea, x = 0, y = 0) {
    const parent = document.getElementById(workingArea);
    parent.insertAdjacentHTML("beforeend", this.component);
    const el = document.getElementById(this.id);

    el.style.left = x + "px";
    el.style.top = y + "px";

    el.addEventListener(
      "contextmenu",
      function (ev) {
        ev.preventDefault();
        const origin = {
          left: ev.pageX - document.getScroll()[0],
          top: ev.pageY - document.getScroll()[1],
        };
        setPosition(origin);
        window.selectedComponent = this.id;
        window.componentType = "fullAdder";
        return false;
      },
      false
    );

    fullAdder[this.id] = this;
    registerGate(this.id, this);
  }

  // Sets values of the inputs and outputs of the full adder
  setA0(A0) {
    this.a0 = A0;
  }

  setB0(B0) {
    this.b0 = B0;
  }

  setCin(cin) {
    this.cin = cin;
  }

  setSum(Sum) {
    this.sum = Sum;
  }

  setCout(cout) {
    this.cout = cout;
  }

  addCout(gate) {
    this.outCout.push(gate);
  }

  addSum(gate) {
    this.outSum.push(gate);
  } 

  // adds input endpoints points to the list of input points
  addInputPoints(input) {
    this.inputPoints.push(input);
  }

  // Adds the output endpoints to the list of output points
  addOutputPoints(output) {
    this.outputPoints.push(output);
  }

  // Removes the selected gates from outCout and outSum
  removeoutCout(gate) {
   for (let i = this.outCout.length - 1; i >= 0; i--) {
       if (this.outCout[i] === gate) {
         this.outCout.splice(i, 1);
       }
       }
}

  removeoutSum(gate) {
    // Find and remove all occurrences of gate
  for (let i = this.outSum.length - 1; i >= 0; i--) {
    if (this.outSum[i] === gate) {
      this.outSum.splice(i, 1);
    }
  }
  }

  // Generates the output of the full adder
  generateOutput() {
    // we know that for a full adder
    // sum = A xor B xor Cin
    // carry = AB or Cin(A xor B)

    const aXorb = computeXor(
      getOutputFA(this.a0[0], this.a0[1]),
      getOutputFA(this.b0[0], this.b0[1])
    );
    this.cout = computeOr(
      computeAnd(
        getOutputFA(this.a0[0], this.a0[1]),
        getOutputFA(this.b0[0], this.b0[1])
      ),
      computeAnd(getOutputFA(this.cin[0], this.cin[1]), aXorb)
    );
    this.sum = computeXor(getOutputFA(this.cin[0], this.cin[1]), aXorb);
  }

  // Sets the output enpoint of the full adder as connected
  setConnected(val, pos) {
    if (pos === "Carry") {
      this.coutIsConnected = val;
    } else if (pos === "Sum") {
      this.sumIsConnected = val;
    }
  }
}

// Add a full adder to the circuit board
export function addFA() {
  let fA = new FullAdder();
  fA.registerComponent("working-area");
}

window.addFA = addFA;

// Used to extract output from a given gate, if pos isnt empty the gate is a full adder with the position specified
export function getOutputFA(gate, pos) {
  if (pos === "Carry") {
    return gate.cout;
  } else if (pos === "Sum") {
    return gate.sum;
  }
  // But if the gate is not an FA, but an input bit, then return the value of the input
  else {
    return gate.output;
  }
}

// Recursive function that evaluates the output of the full adder
export function getResultFA(fa) {
  // check if fa type is Gate object
  if (fa.constructor.name === "Gate") {
    return;
  }

  if (fa.cout != null && fa.sum != null) {
    return;
  }

  if (getOutputFA(fa.a0[0], fa.a0[1]) == null) {
    getResultFA(fa.a0[0]);
  }
  if (getOutputFA(fa.b0[0], fa.b0[1]) == null) {
    getResultFA(fa.b0[0]);
  }
  if (getOutputFA(fa.cin[0], fa.cin[1]) == null) {
    getResultFA(fa.cin[0]);
  }

  fa.generateOutput();

  return;
}

// Checks if the connections are correct
export function checkConnectionsFA() {
  for (let faID in fullAdder) {
    const gate = fullAdder[faID];
    const id = document.getElementById(gate.id);
    if (gate.coutIsConnected === false || gate.outCout.length === 0) {
      printErrors("Cout of Full Adder not connected\n",id);
      return false;

    }
    if (gate.sumIsConnected === false || gate.outSum.length === 0) {
      printErrors("Sum of Full Adder not connected\n",id);
      return false;

    }

    // Check if all the inputs are connected
    if (gate.a0 == null || gate.a0.length === 0) {
      printErrors("A0 of Full Adder not connected\n",id);
      return false;

    }
    if (gate.b0 == null || gate.b0.length === 0) {
      printErrors("B0 of Full Adder not connected\n",id);
      return false;

    }
    if (gate.cin == null || gate.cin.length === 0) {
      printErrors("Cin of Full Adder not connected\n",id);
      return false;

    }
  }
  for (let gateId in gates) {
    const gate = gates[gateId];
    const id = document.getElementById(gate.id);
    if (gate.isInput) {
      if (gate.isConnected === false || gate.outputs.length===0) {
        printErrors("Highlighted component not connected properly\n",id);
        return false;
      }
    }
    if (gate.isOutput) {
      if (gate.inputs.length === 0) {
        printErrors("Highlighted component not connected properly\n",id);
        return false;
      }
    }
  }

  return true;
}

// Simulates the circuit
export function simulateFA() {
  clearResult();
  if (!checkConnectionsFA()) {
    return;
  }

  // reset output in gate
  for (let faID in fullAdder) {
    fullAdder[faID].cout = null;
    fullAdder[faID].sum = null;
  }
  for (let gateId in gates) {
    const gate = gates[gateId];
    if (gate.isOutput) {
      gates[gateId].output = null;
    }
  }

  for (let gateId in gates) {
    if (gates[gateId].isOutput) {
      getResultFA(gates[gateId].inputs[0]);
    }
  }

  for (let key in finalOutputs) {
    let element = document.getElementById(key);
    gates[key].output = getOutputFA(finalOutputs[key][0], finalOutputs[key][1]);
    if (gates[key].output) {
      element.className = "high";
      element.childNodes[0].innerHTML = "1";
    } else {
      element.className = "low";
      element.childNodes[0].innerHTML = "0";
    }
  }

  // Displays message confirming Simulation completion
  let message = "Simulation has finished";
  const result = document.getElementById('result');
  result.innerHTML += message;
  result.className = "success-message";
  setTimeout(clearResult, 2000);
  
}

// Simulates the circuit for given fulladders and gates; Used for testing the circuit for all values
export function testSimulationFA(fA, gates) {
  if (!checkConnectionsFA()) {
    document.getElementById("table-body").innerHTML = "";
    return false;
  }

  // reset output in gate
  for (let faID in fA) {
    fA[faID].cout = null;
    fA[faID].sum = null;
  }
  for (let gateId in gates) {
    const gate = gates[gateId];
    if (gate.isOutput) {
      gates[gateId].output = null;
    }
  }

  for (let gateId in gates) {
    if (gates[gateId].isOutput) {
      getResultFA(gates[gateId].inputs[0]);
    }
  }

  for (let key in finalOutputs) {
    gates[key].output = getOutputFA(finalOutputs[key][0], finalOutputs[key][1]);
  }
  return true;
}

// Delete Full Adder
export function deleteFA(id) {
  const fa = fullAdder[id];
  jsPlumbInstance.removeAllEndpoints(document.getElementById(fa.id));
  jsPlumbInstance._removeElement(document.getElementById(fa.id));

  for (let key in fullAdder) {
    if (fullAdder[key].id === id) {
      delete fullAdder[key];
      continue;
    }
    if (fullAdder[key].a0[0] === fa) {
      fullAdder[key].a0 = null;
    }
    if (fullAdder[key].b0[0] === fa) {
      fullAdder[key].b0 = null;
    }
    if (fullAdder[key].cin[0] === fa) {
      fullAdder[key].cin = null;
    }
    if(fullAdder[key].outCout.includes(fa)){
      fullAdder[key].removeoutCout(fa);
    }
    if(fullAdder[key].outSum.includes(fa)){
      fullAdder[key].removeoutSum(fa);
 }
  }

  for (let key in finalOutputs) {
    if (finalOutputs[key][0] === fa) {
      delete finalOutputs[key];
    }

    gates[key].inputs = [];
  }

  for (let elem in gates) {
    if (gates[elem].inputs.includes(fa)) {
      gates[elem].removeInput(fa);
    }
    if(gates[elem].outputs.includes(fa)) {
      gates[elem].removeOutput(fa);
      if(gates[elem].isInput && gates[elem].outputs.length ==0)
      gates[elem].setConnected(false);
    }
  }
}

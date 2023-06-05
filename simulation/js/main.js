import * as gatejs from "./gate.js";
import * as fajs from "./fa.js";
import { wireColours } from "./layout.js";

"use strict";

let num_wires = 0;

// Gets the coordinates of the mouse
document.getScroll = function () {
  if (window.pageYOffset != undefined) {
    return [pageXOffset, pageYOffset];
  } else {
    let sx,
      sy,
      d = document,
      r = d.documentElement,
      b = d.body;
    sx = r.scrollLeft || b.scrollLeft || 0;
    sy = r.scrollTop || b.scrollTop || 0;
    return [sx, sy];
  }
};
const workingArea = document.getElementById("working-area");

// Creating a js Plumb Instance
export const jsPlumbInstance = jsPlumbBrowserUI.newInstance({
  container: workingArea,
  maxConnections: -1,
  endpoint: {
    type: "Dot",
    options: { radius: 6 },
  },
  dragOptions: {
    containment: "parentEnclosed",
    containmentPadding: 5,
  },
  connector: "Flowchart",
  paintStyle: { strokeWidth: 4, stroke: "#888888" },
  connectionsDetachable: false,
});

// This is an event listener for establishing connections between gates
export const connectGate = function () {
  jsPlumbInstance.bind("beforeDrop", function (data) {
    const fromEndpoint = data.connection.endpoints[0];
    const toEndpoint = data.dropEndpoint;

    const start_uuid = fromEndpoint.uuid.split(":")[0];
    const end_uuid = toEndpoint.uuid.split(":")[0];

    if (fromEndpoint.elementId === toEndpoint.elementId) {
      return false;
    }

    if (start_uuid === "input" && end_uuid === "input") {
      return false;
    } else if (start_uuid === "output" && end_uuid === "output") {
      return false;
    } else if ((end_uuid==="input" && toEndpoint.connections.length > 0) || (start_uuid==="input" && fromEndpoint.connections.length>1)) {
      // If it already has a connection, do not establish a new connection
      return false;
    } else {
      jsPlumbInstance.connect({
        uuids: [fromEndpoint.uuid, toEndpoint.uuid],
        paintStyle: { stroke: wireColours[num_wires], strokeWidth: 4 },
      });
      num_wires++;
      num_wires = num_wires % wireColours.length;
      if (start_uuid === "output") {
        let input = gatejs.gates[fromEndpoint.elementId];
        input.isConnected = true;
        gatejs.gates[toEndpoint.elementId].addInput(input);
        input.addOutput(gatejs.gates[toEndpoint.elementId]);
      } else if (end_uuid === "output") {
        let input = gatejs.gates[toEndpoint.elementId];
        input.isConnected = true;
        gatejs.gates[fromEndpoint.elementId].addInput(input);
        input.addOutput(gatejs.gates[fromEndpoint.elementId]);
      }
    }
  });
};

// This is an event listener for establishing connections between Full adders and input output gates
export const connectFA = function () {
  jsPlumbInstance.bind("beforeDrop", function (data) {
    const fromEndpoint = data.connection.endpoints[0];
    const toEndpoint = data.dropEndpoint;

    const start_uuid = fromEndpoint.uuid.split(":")[0];
    const end_uuid = toEndpoint.uuid.split(":")[0];

    if (fromEndpoint.elementId == toEndpoint.elementId) {
      return false;
    }

    if (start_uuid === "input" && end_uuid === "input") {
      return false;
    } else if (start_uuid === "output" && end_uuid === "output") {
      return false;
    } else if ((end_uuid==="input" && toEndpoint.connections.length > 0) || (start_uuid==="input" && fromEndpoint.connections.length>1)) {
      // If it already has a connection, do not establish a new connection
      return false;
    } else {
      jsPlumbInstance.connect({
        uuids: [fromEndpoint.uuid, toEndpoint.uuid],
        paintStyle: { stroke: wireColours[num_wires], strokeWidth: 4 },
      });
      num_wires++;
      num_wires = num_wires % wireColours.length;
      const start_type = fromEndpoint.elementId.split("-")[0];
      const end_type = toEndpoint.elementId.split("-")[0];
      if (start_type === "FullAdder" && end_type === "FullAdder") {
        if (start_uuid === "output") {
          const input = fajs.fullAdder[fromEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("sum")) {
            pos = "Sum";
            input.addSum(fajs.fullAdder[toEndpoint.elementId]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("cout")) {
            pos = "Carry";
            input.addCout(fajs.fullAdder[toEndpoint.elementId]);
          }
          input.setConnected(true, pos);
          if (Object.keys(toEndpoint.overlays)[0].includes("a")) {
            fajs.fullAdder[toEndpoint.elementId].setA0([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("b")) {
            fajs.fullAdder[toEndpoint.elementId].setB0([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("cin")) {
            fajs.fullAdder[toEndpoint.elementId].setCin([input, pos]);
          }
        } else if (end_uuid === "output") {
          const input = fajs.fullAdder[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("sum")) {
            pos = "Sum";
            input.addSum(fajs.fullAdder[fromEndpoint.elementId]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("cout")) {
            pos = "Carry";
            input.addCout(fajs.fullAdder[fromEndpoint.elementId]);
          }
          input.setConnected(true, pos);
          if (Object.keys(fromEndpoint.overlays)[0].includes("a")) {
            fajs.fullAdder[fromEndpoint.elementId].setA0([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("b")) {
            fajs.fullAdder[fromEndpoint.elementId].setB0([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("cin")) {
            fajs.fullAdder[fromEndpoint.elementId].setCin([input, pos]);
          }
        }
      } else if (start_type === "FullAdder" && end_type === "Input") {
        if (end_uuid === "output") {
          const input = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("a")) {
            fajs.fullAdder[fromEndpoint.elementId].setA0([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("b")) {
            fajs.fullAdder[fromEndpoint.elementId].setB0([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("cin")) {
            fajs.fullAdder[fromEndpoint.elementId].setCin([input, pos]);
          }
          input.addOutput(fajs.fullAdder[fromEndpoint.elementId]);
        }
      } else if (start_type === "Input" && end_type === "FullAdder") {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("a")) {
            fajs.fullAdder[toEndpoint.elementId].setA0([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("b")) {
            fajs.fullAdder[toEndpoint.elementId].setB0([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("cin")) {
            fajs.fullAdder[toEndpoint.elementId].setCin([input, pos]);
          }
          input.addOutput(fajs.fullAdder[toEndpoint.elementId]);
        }
      } else if (start_type === "FullAdder" && end_type === "Output") {
        if (start_uuid === "output") {
          const input = fajs.fullAdder[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("sum")) {
            pos = "Sum";
            input.addSum(output);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("cout")) {
            pos = "Carry";
            input.addCout(output);
          }
          input.setConnected(true, pos);
          output.addInput(input);
          fajs.finalOutputs[toEndpoint.elementId] = [input, pos];
        }
      } else if (start_type === "Output" && end_type === "FullAdder") {
        if (start_uuid === "input") {
          const input = fajs.fullAdder[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("sum")) {
            pos = "Sum";
            input.addSum(output);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("carry")) {
            pos = "Carry";
            input.addCout(output);
          }
          input.setConnected(true, pos);
          output.addInput(input);
          fajs.finalOutputs[fromEndpoint.elementId] = [input, pos];
        }
      } else if (start_type === "Input" && end_type === "Output") {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input);
          fajs.finalOutputs[toEndpoint.elementId] = [input, ""];
          input.addOutput(output);
        }
      } else if (start_type === "Output" && end_type === "Input") {
        if (start_uuid === "input") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input);
          fajs.finalOutputs[fromEndpoint.elementId] = [input, ""];
          input.addOutput(output);
        }
      }
      // return true;
    }
  });
};

// Unbinds the event listeners
export const unbindEvent = () => {
  jsPlumbInstance.unbind("beforeDrop");
};

// Generates the endpoints for the respective gate with the help of JsPlumb
export function registerGate(id, gate) {
  const element = document.getElementById(id);
  const gateType = id.split("-")[0];

  if (
    gateType === "AND" ||
    gateType === "OR" ||
    gateType === "XOR" ||
    gateType === "XNOR" ||
    gateType === "NAND" ||
    gateType === "NOR"
  ) {
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, -9],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
      })
    );
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 10],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:1:" + id,
      })
    );
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
      })
    );
  } else if (gateType === "NOT") {
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
      })
    );
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
      })
    );
  } else if (gateType === "Input") {
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
      })
    );
  } else if (gateType === "Output") {
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
      })
    );
  } else if (gateType === "FullAdder") {
    // carry output
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "Cout", id: "cout", location: [3, 0.2] },
          },
        ],
      })
    );
    // sum output
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0.5, 1, 0, 1, 0, 7],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:1:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "Sum", id: "sum", location: [0.3, -1.7] },
          },
        ],
      })
    );
    // input A0
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0.5, 0, 0, -1, -25, -7],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "A0", id: "a0", location: [0.3, 1.7] },
          },
        ],
      })
    );
    // input B0
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0.5, 0, 0, -1, 25, -7],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:1:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "B0", id: "b0", location: [0.3, 1.7] },
          },
        ],
      })
    );
    // carry input
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:2:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "Cin", id: "cin", location: [-1, 0.2] },
          },
        ],
      })
    );
  }
}

// Initialise Half adder experiment by generating and adding gates and components to the circuit board at given positions
export function initHalfAdder() {
  const ids = ["Input-0", "Input-1", "Output-2", "Output-3"]; // [A B Sum Carry Out]
  const types = ["Input", "Input", "Output", "Output"];
  const names = ["A", "B", "Sum", "Carry"];
  const positions = [
    { x: 40, y: 200 },
    { x: 40, y: 550 },
    { x: 820, y: 200 },
    { x: 820, y: 550 },
  ];
  for (let i = 0; i < ids.length; i++) {
    let gate = new gatejs.Gate(types[i]);
    gate.setId(ids[i]);
    gate.setName(names[i]);
    const component = gate.generateComponent();
    const parent = document.getElementById("working-area");
    parent.insertAdjacentHTML("beforeend", component);
    gate.registerComponent("working-area", positions[i].x, positions[i].y);
  }
}

// Initialise Full adder experiment by generating and adding gates and components to the circuit board at given positions
export function initFullAdder() {
  const ids = ["Input-0", "Input-1", "Input-2", "Output-3", "Output-4"]; // [A,B,carry -input,Sum,carry-output]
  const types = ["Input", "Input", "Input", "Output", "Output"];
  const names = ["A", "B", "CarryIn", "Sum", "CarryOut"];
  const positions = [
    { x: 40, y: 150 },
    { x: 40, y: 375 },
    { x: 40, y: 600 },
    { x: 820, y: 262.5 },
    { x: 820, y: 487.5 },
  ];
  for (let i = 0; i < ids.length; i++) {
    let gate = new gatejs.Gate(types[i]);
    gate.setId(ids[i]);
    gate.setName(names[i]);
    const component = gate.generateComponent();
    const parent = document.getElementById("working-area");
    parent.insertAdjacentHTML("beforeend", component);
    gate.registerComponent("working-area", positions[i].x, positions[i].y);
  }
}

// Initialise Ripple carry adder experiment by generating and adding gates and components to the circuit board at given positions
export function initRippleAdder() {
  const ids = [
    "Input-0",
    "Input-1",
    "Output-2",
    "Input-3",
    "Input-4",
    "Output-5",
    "Input-6",
    "Input-7",
    "Output-8",
    "Input-9",
    "Input-10",
    "Output-11",
    "Output-12",
    "Input-13",
  ]; // [A0,B0,Sum0,A1,B1,Sum1,A2,B2,Sum2,A3,B3,Sum3,CarryOut, CarryIn]
  const types = [
    "Input",
    "Input",
    "Output",
    "Input",
    "Input",
    "Output",
    "Input",
    "Input",
    "Output",
    "Input",
    "Input",
    "Output",
    "Output",
    "Input",
  ];
  const names = [
    "A0",
    "B0",
    "Sum0",
    "A1",
    "B1",
    "Sum1",
    "A2",
    "B2",
    "Sum2",
    "A3",
    "B3",
    "Sum3",
    "CarryOut",
    "CarryIn",
  ];
  const positions = [
    { x: 640, y: 50 },
    { x: 740, y: 50 },
    { x: 800, y: 725 },
    { x: 440, y: 50 },
    { x: 540, y: 50 },
    { x: 600, y: 725 },
    { x: 240, y: 50 },
    { x: 340, y: 50 },
    { x: 400, y: 725 },
    { x: 40, y: 50 },
    { x: 140, y: 50 },
    { x: 200, y: 725 },
    { x: 40, y: 600 },
    { x: 820, y: 150 },
  ];
  for (let i = 0; i < ids.length; i++) {
    let gate = new gatejs.Gate(types[i]);
    gate.setId(ids[i]);
    gate.setName(names[i]);
    const component = gate.generateComponent();
    const parent = document.getElementById("working-area");
    parent.insertAdjacentHTML("beforeend", component);
    gate.registerComponent("working-area", positions[i].x, positions[i].y);
  }
}

// Refresh the circuit board by removing all gates and components
export function refreshWorkingArea() {
  jsPlumbInstance.reset();
  window.numComponents = 0;

  gatejs.clearGates();
  fajs.clearFAs();
}

// Initialise Task 1 experiment when the page loads
window.currentTab = "task1";
connectGate();
refreshWorkingArea();
initHalfAdder();

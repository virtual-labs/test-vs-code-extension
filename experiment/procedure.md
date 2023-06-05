# 1-bit Half Adder

## Components Required - 

* 1 XOR gate
* 1 AND gate

## Circuit Connections - 

* Drag the XOR gate and connect its inputs with A and B inputs. Also, connect its output with Sum output bit.
* Drag the AND gate and connect its inputs with A and B inputs. Also, connect its output with Carry output bit.
* Click on "Simulate" and observe the values of Sum and Carry for different input values of A and B.

## Observations - 

* The Sum bit shows the sum of A and B binary bits while Carry bit displays the carry of the sum of A and B.
* If the circuit has been made as described above, a "Success" message will be displayed upon clicking "Submit".

# 1-bit Full Adder

## Components Required - 

* 3 XOR gates
* 2 AND gates

## Circuit Connections - 

* Drag the first XOR gate and connect its inputs with A and B inputs.
* Drag the second XOR gate and connect its inputs with CarryIn input bit and the output point of the first XOR gate. Connect its output point with Sum output bit. 
* Drag the first AND gate and connect its inputs with CarryIn input bit and the output point of the first XOR gate. 
* Drag the second AND gate and connect its inputs with A and B inputs.
* Drag the third XOR gate and connect its inputs with output points of the two AND gates. Connect its output point with CarryOut output bit. 
* Click on "Simulate" and observe the values of Sum and Carry for different input values of A,B and CarryIn.

## Observations - 

* The Sum bit shows the sum of A,B and CarryIn binary bits while CarryOut bit displays the carry of the sum of A,B and CarryIn.
* If the circuit has been made as described above, a "Success" message will be displayed upon clicking "Submit".

# 4-bit Ripple Carry Adder

## Components Required - 

* 4 1-bit Full Adders

## Circuit Connections - 

* Drag the first Full Adder and connect its A0 and B0 input points with A0 and B0 input bits. Connect its Cin input point with CarryIn input bit and Sum output point with Sum0 output bit.
* Drag the second Full Adder and connect its A0 and B0 input points with A1 and B1 input bits. Connect its Cin input point with Cout output point of first Full Adder and Sum output point with Sum1 output bit.
* Drag the third Full Adder and connect its A0 and B0 input points with A2 and B2 input bits. Connect its Cin input point with Cout output point of second Full Adder and Sum output point with Sum2 output bit.
* Drag the fourth Full Adder and connect its A0 and B0 input points with A3 and B3 input bits. Connect its Cin input point with Cout output point of third Full Adder and Sum output point with Sum3 output bit.
* Connect the CarryOut output bit with the Cout output point of the fourth Full Adder and click on "Simulate".

## Observations - 

* The binary sum of 4 numbers A0B0, A1B1, A2B2 and A3B3 alongwith carry CarryIn is observed as Sum3Sum2Sum1Sum0 with carry CarryOut.  
* If the circuit has been made as described above, a "Success" message will be displayed upon clicking "Submit".
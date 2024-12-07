pragma circom 2.2.0;
include "../node_modules/circomlib/circuits/mimcsponge.circom";

// Task: Create a circuit that computes hash of two inputs using MiMCSponge.
// The circuit should take two inputs (left and right) and output their combined hash.
//
// Hint: MiMCSponge takes number of inputs, number of outputs, and rounds as parameters
// MiMCSponge(nInputs, nRounds, nOutputs) => use MimCSponge(2, 220, 1)

template HashLeftRight() {
    signal input left;
    signal input right;
    signal output hash;

    // TODO: Use MiMCSponge to create a hash of the two inputs
}

// NOTE: Uncomment last line to test your implementation.
// After testing, comment it back.
// component main { public [left, right]} = HashLeftRight();
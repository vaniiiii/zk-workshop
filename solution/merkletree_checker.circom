pragma circom 2.2.0;
include "./hash_left_right.circom";

// Task: Create a circuit that verifies a Merkle tree inclusion proof
// Given: 
// - A leaf value
// - A merkle root
// - Path elements (intermediary hashes)
// - Path indices (0/1 indicating left/right position of path elements)
//
// The circuit should verify that the leaf is indeed part of the tree
// with the given root by reconstructing the path using HashLeftRight.
//
// Note: DualMux component is provided - it arranges pairs of inputs
// based on the path index (0: [in0,in1], 1: [in1,in0])

template DualMux() {
    signal input in[2];
    signal input s;
    signal output out[2];
    
    s * (1 - s) === 0;
    out[0] <== (in[1] - in[0])*s + in[0];
    out[1] <== (in[0] - in[1])*s + in[1];
}

template MerkleTreeChecker(levels) {
    signal input leaf;
    signal input root;
    signal input pathElements[levels];
    signal input pathIndices[levels];

    component selectors[levels];
    component hashers[levels];

    for (var i = 0; i < levels; i++) {
        selectors[i] = DualMux();
        selectors[i].in[0] <== i == 0 ? leaf : hashers[i - 1].hash;
        selectors[i].in[1] <== pathElements[i];
        selectors[i].s <== pathIndices[i];

        hashers[i] = HashLeftRight();
        hashers[i].left <== selectors[i].out[0];
        hashers[i].right <== selectors[i].out[1];
    }

    root === hashers[levels - 1].hash;
}

// component main { public [root] } = MerkleTreeChecker(20);
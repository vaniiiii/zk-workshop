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

    // TODO: Implement the Merkle tree verification
    // For each level:
    // 1. Select correct ordering of current hash and path element using DualMux
    // 2. Hash the ordered pair using HashLeftRight
    // 3. Use the result as input for next level
    // 4. At the end, verify computed hash matches the provided root
    component hashers[levels];
    component selectors[levels];

    for (var i = 0; i < levels; i++) {
        selectors[i] = DualMux();
        hashers[i] = HashLeftRight();

        selectors[i].in[0] <== i == 0 ? leaf : hashers[i-1].hash;
        selectors[i].in[1] <== pathElements[i];
        selectors[i].s <== pathIndices[i];

        hashers[i].left <== selectors[i].out[0];
        hashers[i].right <== selectors[i].out[1];
    }

    root === hashers[levels - 1].hash;
}

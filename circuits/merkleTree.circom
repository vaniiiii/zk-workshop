pragma circom 2.0.0;
include "../node_modules/circomlib/circuits/mimcsponge.circom";

template HashLeftRight() {
    signal input in[2];
    signal output out; 

    component hasher = MiMCSponge(2, 220, 1);
    hasher.k <== 0;
    hasher.ins[0] <== in[0];
    hasher.ins[1] <== in[1];

    out <== hasher.outs[0];
}

template Mux() {
    signal input in[2];
    signal input s;
    signal output out[2];

    s*(1-s) === 0;

    out[0] <== in[0] + s*(in[1] - in[0]);
    out[1] <== in[1] + s*(in[0] - in[1]);
}

template MerkleTreeChecker(levels) {
    signal input leaf;
    signal input root;
    signal input treePaths[levels];
    signal input treeIndices[levels]; // left = 0, right = 1

    component selectors[levels];
    component hashers[levels];

    /// high-level logic is this
    /// indices tells us if value is from left or right side
    /// for level = 0, if indices is right we hash (leaf, treePaths(0))
    /// for level = 1, we hash (hash(leaf, treePaths(0), treePaths(1)) and so on
    for(var i = 0; i < levels; i++) {
        selectors[i] = Mux();
        selectors[i].in[0] <== i == 0 ? leaf : hashers[i-1].out;
        selectors[i].in[1] <== treePaths[i];
        selectors[i].s <== treeIndices[i];

        hashers[i] = HashLeftRight();
        hashers[i].in[0] <== selectors[i].out[0];
        hashers[i].in[1] <== selectors[i].out[1];
    }
    root === hashers[levels - 1].out;
}
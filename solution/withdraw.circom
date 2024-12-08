pragma circom 2.2.0;

include "./commitment_hasher.circom";
include "./merkletree_checker.circom";

// Task: Create a withdrawal circuit that proves:
// 1. The user knows a secret and nullifier that generate a commitment
// 2. This commitment exists in the merkle tree (proof of inclusion)
// 3. The provided nullifierHash matches the nullifier
//
// The circuit prevents double-spending by making nullifierHash public
// while keeping the actual nullifier and secret private

template Withdraw(levels) {
    // PUBLIC INPUTS
    signal input root;
    signal input nullifierHash;
    signal input recipient;
    // PRIVATE INPUTS
    signal input nullifier;
    signal input secret;
    signal input pathElements[levels];
    signal input pathIndices[levels];

    component hasher = CommitmentHasher();
    hasher.nullifier <== nullifier;
    hasher.secret <== secret;
    hasher.nullifierHash === nullifierHash;

    component tree = MerkleTreeChecker(levels);
    tree.leaf <== hasher.commitment;
    tree.root <== root;
    for (var i = 0; i < levels; i++) {
        tree.pathElements[i] <== pathElements[i];
        tree.pathIndices[i] <== pathIndices[i];
    }
    // Would be good to remove this for educational purposes/homework
    signal recipientSquare;
    recipientSquare <== recipient * recipient;

}

component main { public [root, nullifierHash, recipient] } = Withdraw(20);
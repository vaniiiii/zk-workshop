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

    // TODO:
    // 1. Use CommitmentHasher to generate commitment and verify nullifierHash
    // 2. Use MerkleTreeChecker to verify the commitment exists in the tree
    component commitmentHasher = CommitmentHasher();
    commitmentHasher.nullifier <== nullifier;
    commitmentHasher.secret <== secret;

    component merkleTreeChecker = MerkleTreeChecker(levels);
    merkleTreeChecker.root <== root;
    merkleTreeChecker.leaf <== commitmentHasher.commitment;

    for (var i = 0; i < levels; i++) {
        merkleTreeChecker.pathElements[i] <== pathElements[i];
        merkleTreeChecker.pathIndices[i] <== pathIndices[i];
    }

    root === merkleTreeChecker.root;
    commitmentHasher.nullifierHash === nullifierHash;
    // BONUS: prevent non-recipient from using the proof @ ask-for-help
}

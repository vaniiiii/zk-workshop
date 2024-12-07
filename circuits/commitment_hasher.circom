pragma circom 2.2.0;
include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/pedersen.circom";

// Task: Implement a hasher that creates two hashes:
// 1. commitment: hash of combined nullifier and secret
// 2. nullifierHash: hash of just the nullifier
// 
// Hint: Pedersen hash expects bits as input, use Num2Bits to convert numbers to bits

template CommitmentHasher() {
    signal input nullifier;
    signal input secret;
    signal output commitment;
    signal output nullifierHash;

    // TODO:
    // Create and connect components to generate commitment and nullifierHash
    // using Pedersen hash. Remember that Pedersen outputs two values - 
    // use out[0] as the hash result.
}

// component main { public [nullifier, secret]} = CommitmentHasher();
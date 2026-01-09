pragma circom 2.2.0;
include "./lib/commitment_hasher.circom";

component main { public [nullifier, secret] } = CommitmentHasher();

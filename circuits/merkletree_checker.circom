pragma circom 2.2.0;
include "./lib/merkletree_checker.circom";

component main { public [root] } = MerkleTreeChecker(20);

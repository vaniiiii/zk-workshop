pragma circom 2.0.0;
include "../node_modules/circomlib/circuits/pedersen.circom";
include "../node_modules/circomlib/circuits/bitify.circom";
include "./merkleTree.circom";

template CommitmentHasher() {
    signal input nullifier;
    signal input secret;

    signal output commitment;
    signal output nullifierHash;
    
    component commitmentHasher = Pedersen(496);
    component nullifierHasher = Pedersen(248);
    component secretBits = Num2Bits(248);
    component nullifierBits = Num2Bits(248);

    secretBits.in <== secret;
    nullifierBits.in <== nullifier;

    for(var i = 0; i < 248; i++) {
        commitmentHasher.in[i] <== nullifierBits.out[i];
        nullifierHasher.in[i] <== nullifierBits.out[i];
        commitmentHasher.in[i+248] <== secretBits.out[i];
    }

    commitment <== commitmentHasher.out[0];
    nullifierHash <== nullifierHasher.out[0];
}

template Withdraw(levels) {
    /*//////////////////////////////////////////////////////////////
                             PRIVATE INPUTS
    //////////////////////////////////////////////////////////////*/
    signal input secret; 
    signal input nullifier; 
    
    /*//////////////////////////////////////////////////////////////
                             PUBLIC INPUTS
    //////////////////////////////////////////////////////////////*/
    signal input root;
    signal input nullifierHash; 
    signal input treePaths[levels]; // treePaths[0] = leaf next to commitment, treePaths[1] = yellow on level 1
    signal input treeIndices[levels]; // treeIndices[levels] = right, treeIndices[levels] = right, 

    component hasher = CommitmentHasher();
    hasher.nullifier <== nullifier;
    hasher.secret <== secret;

    hasher.nullifierHash === nullifierHash; 

    component tree = MerkleTreeChecker(levels);
    tree.root <== root;
    tree.leaf <==  hasher.commitment;
    for(var i = 0; i < levels; i++) {
         tree.treeIndices[i] <== treeIndices[i];
         tree.treePaths[i] <== treePaths[i];
    }
}

component main { public [root, nullifierHash]} = Withdraw(20);
pragma circom 2.2.0;
include "./lib/withdraw.circom";

component main { public [root, nullifierHash, recipient] } = Withdraw(20);

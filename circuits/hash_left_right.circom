pragma circom 2.2.0;
include "./lib/hash_left_right.circom";

component main { public [left, right] } = HashLeftRight();

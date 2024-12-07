// SPDX-License-Identifier: MIT

/* AUTOGENERATED FILE BY HARDHAT-ZKIT. DO NOT EDIT. */

pragma solidity >=0.7.0 <0.9.0;

contract WithdrawGroth16Verifier {
    /// @dev base field size
    uint256 public constant BASE_FIELD_SIZE =
        21888242871839275222246405745257275088696311157297823662689037894645226208583;

    /// @dev verification key data
    uint256 public constant ALPHA_X =
        20491192805390485299153009773594534940189261866228447918068658471970481763042;
    uint256 public constant ALPHA_Y =
        9383485363053290200918347156157836566562967994039712273449902621266178545958;
    uint256 public constant BETA_X1 =
        4252822878758300859123897981450591353533073413197771768651442665752259397132;
    uint256 public constant BETA_X2 =
        6375614351688725206403948262868962793625744043794305715222011528459656738731;
    uint256 public constant BETA_Y1 =
        21847035105528745403288232691147584728191162732299865338377159692350059136679;
    uint256 public constant BETA_Y2 =
        10505242626370262277552901082094356697409835680220590971873171140371331206856;
    uint256 public constant GAMMA_X1 =
        11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 public constant GAMMA_X2 =
        10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 public constant GAMMA_Y1 =
        4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 public constant GAMMA_Y2 =
        8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 public constant DELTA_X1 =
        16761147722938806341748410332575884094418462067457456342713314850528615568096;
    uint256 public constant DELTA_X2 =
        2465990247563250205439046172503829739121051660365321278234013013033741576381;
    uint256 public constant DELTA_Y1 =
        19015955515761472580135178664261727427467649533597409502457523075478488705180;
    uint256 public constant DELTA_Y2 =
        8044799192944876699442333376266196827363843942710196752089333776885557811899;

    uint256 public constant IC0_X =
        5954766214921040520521011620453990320723595660029934145665910669969019997015;
    uint256 public constant IC0_Y =
        7291207514954311341709090599704573775913781467909191664925443998589947708159;
    uint256 public constant IC1_X =
        10956531203243250209772355912527198112888108391171757419599002013376016952519;
    uint256 public constant IC1_Y =
        3036728369014135229567967120757699601701153417997412222986889478795630266173;
    uint256 public constant IC2_X =
        12644173272001619782420179135788282252311883282329455108754899441292005834364;
    uint256 public constant IC2_Y =
        17243920923199172721822156730004814185019738148887380918712104060770725085333;
    uint256 public constant IC3_X =
        14571050816985280304717341331796169438155974603294396978511957135290337133350;
    uint256 public constant IC3_Y =
        16294830912333295254050963506269418868460777647969612640645662082231972390427;
    
    /// @dev memory pointer sizes
    uint16 public constant P_PUBLIC_SIGNALS_ACCUMULATOR_SIZE = 128;
    uint16 public constant P_TOTAL_SIZE = 896;

    function verifyProof(
        uint256[2] memory pointA_,
        uint256[2][2] memory pointB_,
        uint256[2] memory pointC_,
        uint256[3] memory publicSignals_
    ) public view returns (bool verified_) {
        assembly {
            function checkField(signal_) -> res_ {
                res_ := lt(signal_, BASE_FIELD_SIZE)
            }

            function g1MulAdd(pR_, x_, y_, s_) -> res_ {
                let pointer_ := mload(64) // free pointer

                mstore(pointer_, x_)
                mstore(add(pointer_, 32), y_)
                mstore(add(pointer_, 64), s_)

                res_ := staticcall(6000, 7, pointer_, 96, pointer_, 64) // ecMul
                res_ := and(res_, gt(returndatasize(), 0)) // check that multiplication succeeded

                if iszero(res_) {
                    leave
                }

                mstore(add(pointer_, 64), mload(pR_))
                mstore(add(pointer_, 96), mload(add(pR_, 32)))

                res_ := staticcall(150, 6, pointer_, 128, pR_, 64) // ecAdd
                res_ := and(res_, gt(returndatasize(), 0)) // check that addition succeeded
            }

            function checkPairing(pA_, pB_, pC_, pubSignals_, pointer_) -> res_ {
                let pPairing_ := add(pointer_, P_PUBLIC_SIGNALS_ACCUMULATOR_SIZE)

                mstore(pointer_, IC0_X)
                mstore(add(pointer_, 32), IC0_Y)

                /// @dev compute the linear combination of public signals
                if iszero(g1MulAdd(pointer_, IC1_X, IC1_Y, mload(add(pubSignals_, 0)))) {
                    leave
                }
                if iszero(g1MulAdd(pointer_, IC2_X, IC2_Y, mload(add(pubSignals_, 32)))) {
                    leave
                }
                if iszero(g1MulAdd(pointer_, IC3_X, IC3_Y, mload(add(pubSignals_, 64)))) {
                    leave
                }
                
                /// @dev -A
                mstore(pPairing_, mload(pA_))
                mstore(
                    add(pPairing_, 32),
                    mod(sub(BASE_FIELD_SIZE, mload(add(pA_, 32))), BASE_FIELD_SIZE)
                )

                /// @dev B
                mstore(add(pPairing_, 64), mload(mload(pB_)))
                mstore(add(pPairing_, 96), mload(add(mload(pB_), 32)))
                mstore(add(pPairing_, 128), mload(mload(add(pB_, 32))))
                mstore(add(pPairing_, 160), mload(add(mload(add(pB_, 32)), 32)))

                /// @dev alpha1
                mstore(add(pPairing_, 192), ALPHA_X)
                mstore(add(pPairing_, 224), ALPHA_Y)

                /// @dev beta2
                mstore(add(pPairing_, 256), BETA_X1)
                mstore(add(pPairing_, 288), BETA_X2)
                mstore(add(pPairing_, 320), BETA_Y1)
                mstore(add(pPairing_, 352), BETA_Y2)

                /// @dev public signals
                mstore(add(pPairing_, 384), mload(pointer_))
                mstore(add(pPairing_, 416), mload(add(pointer_, 32)))

                /// @dev gamma2
                mstore(add(pPairing_, 448), GAMMA_X1)
                mstore(add(pPairing_, 480), GAMMA_X2)
                mstore(add(pPairing_, 512), GAMMA_Y1)
                mstore(add(pPairing_, 544), GAMMA_Y2)

                /// @dev C
                mstore(add(pPairing_, 576), mload(pC_))
                mstore(add(pPairing_, 608), mload(add(pC_, 32)))

                /// @dev delta2
                mstore(add(pPairing_, 640), DELTA_X1)
                mstore(add(pPairing_, 672), DELTA_X2)
                mstore(add(pPairing_, 704), DELTA_Y1)
                mstore(add(pPairing_, 736), DELTA_Y2)

                res_ := staticcall(181000, 8, pPairing_, 768, pPairing_, 32) // ecPairing
                res_ := and(res_, mload(pPairing_)) // check that pairing succeeded
            }

            let pointer_ := mload(64) // free pointer
            mstore(64, add(pointer_, P_TOTAL_SIZE))

            /// @dev check that all public signals are in F
            verified_ := 1
            verified_ := and(verified_, checkField(mload(add(publicSignals_, 0))))
            verified_ := and(verified_, checkField(mload(add(publicSignals_, 32))))
            verified_ := and(verified_, checkField(mload(add(publicSignals_, 64))))
            
            /// @dev check pairings
            if not(iszero(verified_)) {
                verified_ := checkPairing(pointA_, pointB_, pointC_, publicSignals_, pointer_)
            }
        }
    }
}

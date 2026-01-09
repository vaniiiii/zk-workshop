import { zkit } from "hardhat";
import { expect } from "chai";
import { CalldataWithdrawGroth16, Withdraw } from "@zkit";
import { WithdrawGroth16Verifier__factory } from "../typechain-types";
import { WithdrawGroth16Verifier } from "../typechain-types";
import hre from "hardhat";
import {
  generateCommitment,
  pedersenHash,
  bigIntToBuffer,
} from "../utils/utils";
import { createTree } from "../utils/tree";
import { PrivateWithdrawGroth16 } from "@zkit";

describe("Withdraw Test", () => {
  let circuit: Withdraw;
  let verifier: WithdrawGroth16Verifier;
  let recipient = hre.ethers.Wallet.createRandom().address;

  beforeEach(async () => {
    circuit = await zkit.getCircuit("Withdraw");
    const VerifierFactory: WithdrawGroth16Verifier__factory =
      await hre.ethers.getContractFactory("WithdrawGroth16Verifier");
    verifier = await VerifierFactory.deploy();
    await verifier.waitForDeployment();
  });

  it("should verify witness generation and proof", async () => {
    const { nullifier, secret, commitment } = await generateCommitment();
    const tree = await createTree();
    tree.insert(commitment.toString());

    const { pathElements, pathIndices } = tree.path(
      tree.indexOf(commitment.toString())
    );

    const input: PrivateWithdrawGroth16 = {
      secret,
      nullifier,
      root: BigInt(tree.root),
      nullifierHash: await pedersenHash(bigIntToBuffer(nullifier, 31)),
      pathElements: pathElements.map((el) => BigInt(el)),
      pathIndices,
      recipient: BigInt(recipient),
    };

    await expect(circuit).with.witnessInputs(input).to.have.witnessOutputs({});
    await expect(circuit).to.generateProof(input);

    const proof = await circuit.generateProof(input);
    await expect(circuit)
      .to.useSolidityVerifier(verifier)
      .and.verifyProof(proof);
  });

  it("should fail with incorrect nullifier", async () => {
    const { nullifier, secret, commitment } = await generateCommitment();
    const tree = await createTree();
    tree.insert(commitment.toString());

    const { pathElements, pathIndices } = tree.path(
      tree.indexOf(commitment.toString())
    );

    const input: PrivateWithdrawGroth16 = {
      secret,
      nullifier: BigInt(0),
      root: BigInt(tree.root),
      nullifierHash: await pedersenHash(bigIntToBuffer(nullifier, 31)),
      pathElements: pathElements.map((el) => BigInt(el)),
      pathIndices,
      recipient: BigInt(recipient),
    };

    await expect(expect(circuit).witnessInputs(input)).to.be.rejectedWith(
      "Error in template Withdraw",
      "Wrong nullifier hash validation"
    );
  });

  it("should fail with incorrect commitment", async () => {
    const { nullifier, secret } = await generateCommitment();
    const tree = await createTree();

    const invalidCommitment = BigInt(1000);
    tree.insert(invalidCommitment.toString());

    const { pathElements, pathIndices } = tree.path(
      tree.indexOf(invalidCommitment.toString())
    );

    const input: PrivateWithdrawGroth16 = {
      secret,
      nullifier,
      root: BigInt(tree.root),
      nullifierHash: await pedersenHash(bigIntToBuffer(nullifier, 31)),
      pathElements: pathElements.map((el) => BigInt(el)),
      pathIndices,
      recipient: BigInt(recipient),
    };

    await expect(expect(circuit).with.witnessInputs(input)).to.be.rejectedWith(
      "Error in template MerkleTreeChecker"
    );
  });

  it("should fail with tampered proof", async () => {
    const { nullifier, secret, commitment } = await generateCommitment();
    const tree = await createTree();
    tree.insert(commitment.toString());

    const { pathElements, pathIndices } = tree.path(
      tree.indexOf(commitment.toString())
    );

    const input: PrivateWithdrawGroth16 = {
      secret,
      nullifier,
      root: BigInt(tree.root),
      nullifierHash: await pedersenHash(bigIntToBuffer(nullifier, 31)),
      pathElements: pathElements.map((el) => BigInt(el)),
      pathIndices,
      recipient: BigInt(recipient),
    };

    const proof = await circuit.generateProof(input);
    const calldata: CalldataWithdrawGroth16 =
      await circuit.generateCalldata(proof);

    const tamperedCalldata: CalldataWithdrawGroth16 = {
      proofPoints: {
        a: [calldata.proofPoints.a[1], calldata.proofPoints.a[0]],
        b: calldata.proofPoints.b,
        c: calldata.proofPoints.c,
      },
      publicSignals: calldata.publicSignals,
    };

    const validResult = await verifier.verifyProof(
      calldata.proofPoints.a,
      calldata.proofPoints.b,
      calldata.proofPoints.c,
      calldata.publicSignals
    );
    expect(validResult).to.be.true;

    const invalidResult = await verifier.verifyProof(
      tamperedCalldata.proofPoints.a,
      tamperedCalldata.proofPoints.b,
      tamperedCalldata.proofPoints.c,
      tamperedCalldata.publicSignals
    );
    expect(invalidResult).to.be.false;
  });
});

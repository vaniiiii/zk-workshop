import { zkit } from "hardhat";
import { expect } from "chai";
import { Withdraw } from "@zkit";
import { buildPedersenHash, buildMimcSponge } from "circomlibjs";
import MerkleTree, { Element, HashFunction } from "fixed-merkle-tree";
import {
  WithdrawGroth16Verifier,
  WithdrawGroth16Verifier__factory,
} from "../typechain-types";
import hre from "hardhat";

const leBufferToBigint = (buff: Buffer): bigint => {
  let res = 0n;
  for (let i = 0; i < buff.length; i++) {
    res = res + (BigInt(buff[i]) << BigInt(i * 8));
  }
  return res;
};

const leBigintToBuffer = (num: bigint, byteLength: number): Buffer => {
  if (num < 0n) throw new Error("BigInt must be non-negative");
  const buffer = Buffer.alloc(byteLength);
  for (let i = 0; i < byteLength; i++) {
    buffer[i] = Number(num & 0xffn);
    num >>= 8n;
  }
  return buffer;
};

describe("Withdrawal Test", () => {
  let mimc: any;
  let pedersen: any;
  let circuit: Withdraw;
  let tree: MerkleTree;
  let validInputs: any;
  let verifier: WithdrawGroth16Verifier;

  before(async () => {
    mimc = await buildMimcSponge();
    pedersen = await buildPedersenHash();
    circuit = await zkit.getCircuit("Withdraw");

    const VerifierFactory: WithdrawGroth16Verifier__factory =
      await hre.ethers.getContractFactory("WithdrawGroth16Verifier");
    verifier = await VerifierFactory.deploy();
    await verifier.waitForDeployment();

    const hasher: HashFunction<Element> = (
      left: Element,
      right: Element
    ): string => {
      return mimc.F.toString(mimc.multiHash([left, right]));
    };

    tree = new MerkleTree(20, [], { hashFunction: hasher });
    validInputs = createWithdrawInputs(BigInt(987654321), BigInt(123456789));
  });

  const createWithdrawInputs = (nullifier: bigint, secret: bigint) => {
    if (nullifier <= 0n || secret <= 0n) {
      throw new Error("Nullifier and secret must be positive");
    }

    const pedersenHash = (data: Buffer): bigint => {
      const pedersenOutput = pedersen.hash(data);
      return leBufferToBigint(
        pedersen.babyJub.F.fromMontgomery(
          pedersen.babyJub.unpackPoint(pedersenOutput)[0]
        )
      );
    };

    const commitment = pedersenHash(
      Buffer.concat([
        leBigintToBuffer(nullifier, 31),
        leBigintToBuffer(secret, 31),
      ])
    );

    tree.insert(commitment.toString());
    const { pathElements, pathIndices } = tree.path(
      tree.indexOf(commitment.toString())
    );
    const nullifierHashValue = pedersenHash(leBigintToBuffer(nullifier, 31));

    return {
      root: BigInt(tree.root),
      nullifierHash: BigInt(nullifierHashValue),
      nullifier,
      secret,
      pathElements: pathElements.map((el) => BigInt(el)),
      pathIndices,
    };
  };

  it("should verify valid withdrawal with merkle proof and check constraints", async () => {
    await expect(circuit).witnessInputs(validInputs).to.have.witnessOutputs({});

    const proof = await circuit.generateProof(validInputs);
    await expect(circuit).to.verifyProof(proof);
    await expect(circuit).to.have.constraints.within(30000, 40000);
  });

  it("should verify proof using Solidity verifier", async () => {
    const proof = await circuit.generateProof(validInputs);

    await expect(circuit)
      .to.useSolidityVerifier(verifier)
      .and.verifyProof(proof);
  });

  it("should fail Solidity verification with corrupted proof", async () => {
    const proof = await circuit.generateProof(validInputs);
    const calldata = await circuit.generateCalldata(proof);

    // Corrupt proof points
    const corruptedCalldata = [...calldata];
    corruptedCalldata[0] = [
      "0x0000000000000000000000000000000000000000000000000000000000000001",
      "0x0000000000000000000000000000000000000000000000000000000000000001",
    ];

    const result = await verifier.verifyProof(
      // @ts-ignore
      corruptedCalldata[0],
      corruptedCalldata[1],
      corruptedCalldata[2],
      corruptedCalldata[3]
    );

    expect(result).to.be.false;
  });

  it("should fail with incorrect nullifier hash", async () => {
    const invalidInputs = { ...validInputs, nullifierHash: BigInt(123) };

    await expect(
      expect(circuit).witnessInputs(invalidInputs)
    ).to.be.rejectedWith(
      "Error in template Withdraw",
      "Wrong nullifier hash validation"
    );
  });

  it("should fail with non-existent merkle path", async () => {
    const invalidInputs = {
      ...validInputs,
      pathElements: validInputs.pathElements.map(() => BigInt(999)),
      root: BigInt(888),
    };

    await expect(
      expect(circuit).witnessInputs(invalidInputs)
    ).to.be.rejectedWith(
      "Error in template MerkleTreeChecker",
      "Invalid Merkle path"
    );
  });

  it("should fail with invalid nullifier/secret values", async () => {
    await expect(() => createWithdrawInputs(0n, 123n)).to.throw(
      "Nullifier and secret must be positive"
    );
  });
});

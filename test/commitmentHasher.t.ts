import { zkit } from "hardhat";
import { expect } from "chai";
import { CommitmentHasher } from "@zkit";
import { bigIntToBuffer, generateCommitment } from "../utils/utils";
import { PrivateCommitmentHasherGroth16 } from "@zkit";
import { pedersenHash } from "../utils/utils";

describe("CommitmentHasher Test", () => {
  let circuit: CommitmentHasher;

  beforeEach(async () => {
    circuit = await zkit.getCircuit("CommitmentHasher");
  });

  it("should correctly generate commitment and nullifier hash", async () => {
    const { nullifier, secret, commitment } = await generateCommitment();
    const input: PrivateCommitmentHasherGroth16 = {
      nullifier,
      secret,
    };

    await expect(circuit)
      .with.witnessInputs(input)
      .to.have.witnessOutputs({
        commitment: commitment,
        nullifierHash: await pedersenHash(bigIntToBuffer(nullifier, 31)),
      });
  });

  it("should fail with invalid input", async () => {
    const { nullifier, secret, commitment } = await generateCommitment();
    const expectedNullifierHash = await pedersenHash(
      bigIntToBuffer(nullifier, 31)
    );

    const witness = await circuit.calculateWitness({
      nullifier: secret, // Swapping values on purpose
      secret,
    });

    const calculatedCommitment = witness[0];
    const calculatedNullifierHash = witness[1];

    expect(calculatedCommitment).to.not.equal(commitment);
    expect(calculatedNullifierHash).to.not.equal(expectedNullifierHash);
  });
});

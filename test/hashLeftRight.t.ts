import { zkit } from "hardhat";
import { expect } from "chai";
import { HashLeftRight } from "@zkit";
import { buildMimcSponge } from "circomlibjs";
import { MimcSponge } from "circomlibjs";
import { PrivateHashLeftRightGroth16 } from "@zkit";

describe("HashLeftRight Test", () => {
  let circuit: HashLeftRight;
  let mimc: MimcSponge;

  beforeEach(async () => {
    circuit = await zkit.getCircuit("HashLeftRight");
    mimc = await buildMimcSponge();
  });

  it("should compute hash matching MiMC implementation", async () => {
    const left = BigInt(123);
    const right = BigInt(456);

    const input: PrivateHashLeftRightGroth16 = {
      left,
      right,
    };

    await expect(circuit)
      .with.witnessInputs(input)
      .to.have.witnessOutputs({
        hash: mimc.F.toString(mimc.multiHash([left, right])),
      });
  });

  it("should fail to compute hash matching MiMC implementation", async () => {
    const left = BigInt(123);
    const right = BigInt(456);

    const input: PrivateHashLeftRightGroth16 = {
      left: right, // // Swapping values on purpose
      right,
    };

    await expect(circuit)
      .with.witnessInputs(input)
      .to.not.have.witnessOutputs({
        hash: mimc.F.toString(mimc.multiHash([left, right])),
      });
  });
});

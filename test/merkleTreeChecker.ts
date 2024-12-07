import { zkit } from "hardhat";
import { expect } from "chai";
import { MerkleTreeChecker } from "@zkit";
import { createTree } from "../utils/tree";
import { generateCommitment } from "../utils/utils";

describe("MerkleTreeChecker Test", () => {
  let circuit: MerkleTreeChecker;

  beforeEach(async () => {
    circuit = await zkit.getCircuit("MerkleTreeChecker");
  });

  it("should verify valid merkle proof", async () => {
    const { commitment } = await generateCommitment();
    const tree = await createTree();
    tree.insert(commitment.toString());

    const { pathElements, pathIndices } = tree.path(
      tree.indexOf(commitment.toString())
    );

    const input = {
      leaf: commitment,
      root: BigInt(tree.root),
      pathElements: pathElements.map((el) => BigInt(el)),
      pathIndices,
    };

    await expect(circuit).with.witnessInputs(input).to.have.witnessOutputs({});
  });
});

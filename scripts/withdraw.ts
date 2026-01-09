import { Tornado } from "../typechain-types";
import { logger } from "../utils/logger";
import { deployContracts } from "./deployContracts";
import { deposit } from "./deposit";
import {
  bigIntToBuffer,
  bigIntToHex,
  generateCommitment,
  pedersenHash,
} from "../utils/utils";
import { Withdraw } from "@zkit";
import { createTree } from "../utils/tree";
import { zkit } from "hardhat";
import { PrivateWithdrawGroth16 } from "@zkit";
import { ProofWithdrawGroth16 } from "@zkit";
import hre from "hardhat";

async function withdraw(
  tornado: Tornado,
  circuit: Withdraw,
  proof: ProofWithdrawGroth16,
  root: string,
  nullifierHash: string,
  recipient: string
) {
  logger.startBlock("STARTING WITHDRAW PROCESS");
  logger.info(
    `💰 Recipient balance before withdrawal: ${await hre.ethers.provider.getBalance(recipient)}`
  );
  const calldata = await circuit.generateCalldata(proof);
  await tornado.withdraw(
    calldata.proofPoints.a,
    calldata.proofPoints.b,
    calldata.proofPoints.c,
    calldata.publicSignals
  );
  logger.success(
    `🤑 Recipient balance after withdrawal: ${await hre.ethers.provider.getBalance(recipient)}`
  );
  logger.endBlock("WITHDRAW SUCCESSFULL");
}

async function main() {
  logger.startBlock("DEPLOYING CONTRACTS");
  const tornado: Tornado = await deployContracts();
  logger.endBlock("CONTRACTS DEPLOYED");
  logger.pending("🔑 Generating commitment...");
  const { nullifier, secret, commitment } = await generateCommitment();
  logger.success("✓ Commitment generated");
  await deposit(tornado, nullifier, secret, commitment);

  // Creating tree off-chain
  const tree = await createTree();
  tree.insert(commitment.toString());

  const { pathElements, pathIndices } = tree.path(
    tree.indexOf(commitment.toString())
  );

  // Generating recipient
  const recipient = hre.ethers.Wallet.createRandom().address;

  // Create circuit representation
  const circuit = await zkit.getCircuit("Withdraw");
  // Create inputs
  const input: PrivateWithdrawGroth16 = {
    root: BigInt(tree.root),
    nullifierHash: await pedersenHash(bigIntToBuffer(nullifier, 31)),
    nullifier,
    secret,
    pathElements: pathElements.map((el) => BigInt(el)),
    pathIndices,
    recipient: BigInt(recipient),
  };
  // Generate proof
  const proof = await circuit.generateProof(input);
  const nullifierHash = bigIntToHex(
    await pedersenHash(bigIntToBuffer(nullifier, 31))
  );

  // Withdraw
  await withdraw(
    tornado,
    circuit,
    proof,
    tree.root.toString(),
    nullifierHash,
    recipient
  );
}

main().catch((e) => {
  console.error(e);
});

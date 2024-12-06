import { deployContracts } from "./deployContracts";
import { generateCommitment, bigIntToHex } from "../utils/utils";
import { Tornado } from "../typechain-types";
import hre from "hardhat";
import { logger } from "../utils/logger";

async function deposit(
  tornado: Tornado,
  nullifier: bigint,
  secret: bigint,
  commitment: bigint
) {
  logger.startBlock("STARTING DEPOSIT PROCESS");

  if (!tornado) {
    logger.pending("📦 Deploying Tornado contract...");
    tornado = await deployContracts();
    logger.success("✓ Tornado contract deployed\n");
  }

  logger.separator();
  logger.info(`Nullifier:  ${nullifier.toString(16)}`);
  logger.info(`Secret:     ${secret.toString(16)}`);
  logger.info(`Commitment: ${commitment.toString(16)}`);
  logger.separator();

  const depositAmount = hre.ethers.parseEther("1");
  const commitmentBytes = hre.ethers.AbiCoder.defaultAbiCoder().encode(
    ["bytes32"],
    [bigIntToHex(commitment)]
  );

  logger.pending("\n🔄 Submitting deposit transaction...");
  try {
    await tornado.deposit(commitmentBytes, { value: depositAmount });
    logger.endBlock("DEPOSIT SUCCESSFUL", true);
  } catch (e: any) {
    logger.endBlock("DEPOSIT FAILED", false);
    logger.error(e);
    process.exit(1);
  }
}

export { deposit };

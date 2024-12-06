import {
  ETHTornado,
  ETHTornado__factory,
  WithdrawGroth16Verifier,
  WithdrawGroth16Verifier__factory,
} from "../typechain-types";
import { mimcSpongecontract } from "circomlibjs";
import hre from "hardhat";
import { logger } from "../utils/logger";

async function deployContracts(): Promise<ETHTornado> {
  logger.startBlock("STARTING DEPLOY CONTRACTS");

  const signers = await hre.ethers.getSigners();
  logger.deployAccount(signers[0].address);

  const DENOMINATION = hre.ethers.parseEther("1");
  const LEVELS = 20;
  const SEED = "mimcsponge";
  const ROUNDS = 220;

  // Deploy MiMC Hasher
  logger.deploymentStart("MiMC Hasher");
  const mimcAbi = [
    "function MiMCSponge(uint256 in_xL, uint256 in_xR, uint256 k) external pure returns (uint256 xL, uint256 xR)",
  ];
  const MimcFactory = new hre.ethers.ContractFactory(
    mimcAbi,
    mimcSpongecontract.createCode(SEED, ROUNDS),
    signers[0]
  );
  const mimcHasher = await MimcFactory.deploy();
  await mimcHasher.waitForDeployment();
  logger.deploymentSuccess("MiMC Hasher", await mimcHasher.getAddress());

  // Deploy Verifier
  logger.deploymentStart("Verifier");
  const verifierFactory: WithdrawGroth16Verifier__factory =
    await hre.ethers.getContractFactory("WithdrawGroth16Verifier");
  const verifier: WithdrawGroth16Verifier = await verifierFactory.deploy();
  await verifier.waitForDeployment();
  logger.deploymentSuccess("Verifier", await verifier.getAddress());

  // Deploy Tornado
  logger.deploymentStart("Tornado");
  const tornadoFactory: ETHTornado__factory =
    await hre.ethers.getContractFactory("ETHTornado");
  const tornado: ETHTornado = await tornadoFactory.deploy(
    await verifier.getAddress(),
    await mimcHasher.getAddress(),
    DENOMINATION,
    LEVELS
  );
  await tornado.waitForDeployment();
  logger.deploymentSuccess("Tornado", await tornado.getAddress());

  logger.configuration(hre.ethers.formatEther(DENOMINATION), LEVELS);
  logger.endBlock("DEPLOY CONTRACTS DONE");

  return tornado;
}

export { deployContracts };

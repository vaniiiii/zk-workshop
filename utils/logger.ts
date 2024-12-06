import { red, green, blue, yellow, cyan } from "kleur";

export const logger = {
  startBlock: (title: string) => {
    console.log(
      cyan(
        "\n============================================================================"
      )
    );
    console.log(
      cyan(`||                        ${title}                         ||`)
    );
    console.log(
      cyan(
        "============================================================================\n"
      )
    );
  },

  endBlock: (title: string, success = true) => {
    console.log(
      cyan(
        "\n============================================================================"
      )
    );
    console.log(
      success
        ? green(`||                        ${title}                         ||`)
        : red(`||                        ${title}                         ||`)
    );
    console.log(
      cyan(
        "============================================================================\n"
      )
    );
  },

  separator: () => console.log(blue("-".repeat(50))),

  info: (msg: string) => console.log(blue(msg)),
  success: (msg: string) => console.log(green(msg)),
  pending: (msg: string) => console.log(yellow(msg)),
  error: (msg: string | Error) => console.log(red(msg as any)),

  // Deploy specific logging
  deployAccount: (address: string) => {
    console.log(yellow(`📝 Deploy Account: ${address}`));
    logger.separator();
  },

  deploymentStart: (contractName: string) => {
    console.log(yellow(`🔐 Deploying ${contractName}...`));
  },

  deploymentSuccess: (contractName: string, address: string) => {
    console.log(green(`✓ ${contractName} deployed to: ${address}`));
    logger.separator();
  },

  configuration: (denomination: string, levels: number) => {
    console.log(green("✨ DEPLOYMENT COMPLETE"));
    console.log(yellow("Configuration:"));
    console.log(blue(`📊 Denomination: ${denomination} ETH`));
    console.log(blue(`📊 Tree Levels: ${levels}`));
  },
};

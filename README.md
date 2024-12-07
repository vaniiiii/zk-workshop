<div align="center">
<h1>Zero Knowledge Mixer Workshop 🌪️<br>| Build Your Own Tornado Cash |</h1>
</div>

# Table of Contents

<details>
  <summary><a href="#resources--prerequisites">Resources & Setup</a></summary>
  <ul>
    <li><a href="#essential-reading">Essential Reading</a></li>
    <li>
      <a href="#requirements--setup-options">Requirements & Setup Options</a>
      <ul>
        <li><a href="#option-a-local-installation">Option A: Local Installation</a></li>
        <li><a href="#option-b-docker-setup">Option B: Docker Setup</a></li>
      </ul>
    </li>
  </ul>
</details>

<details>
  <summary><a href="#background">Understanding Privacy & Mixers</a></summary>
  <ul>
    <li><a href="#what-is-a-mixer">What is a Mixer?</a></li>
    <li><a href="#how-does-it-work">How Does it Work?</a></li>
    <li><a href="#technical-overview">Technical Overview</a></li>
  </ul>
</details>

<details>
  <summary><a href="#workshop-tasks">Workshop Tasks</a></summary>
  <ul>
    <li>
      <a href="#1-commitmenthasher">Task 1: CommitmentHasher</a>
      <ul>
        <li>Building secure commitments</li>
        <li>Understanding Pedersen hash</li>
      </ul>
    </li>
    <li>
      <a href="#2-hashleftright">Task 2: HashLeftRight</a>
      <ul>
        <li>MiMC hash implementation</li>
        <li>Binary tree basics</li>
      </ul>
    </li>
    <li>
      <a href="#3-merkletreechecker">Task 3: MerkleTreeChecker</a>
      <ul>
        <li>Merkle tree verification</li>
        <li>Path validation</li>
      </ul>
    </li>
    <li>
      <a href="#4-withdraw-circuit">Task 4: Withdraw Circuit</a>
      <ul>
        <li>Combining all components</li>
        <li>Final implementation</li>
      </ul>
    </li>
  </ul>
</details>

<details>
  <summary><a href="#getting-help">Getting Help & Next Steps</a></summary>
  <ul>
    <li><a href="#getting-help">Getting Help</a></li>
    <li><a href="#going-further">Going Further</a></li>
  </ul>
</details>

<hr style="border: 1px dashed #ccc;">

# Resources & Prerequisites 📋

## Essential Reading

- [Tornado Cash Whitepaper](https://berkeley-defi.github.io/assets/material/Tornado%20Cash%20Whitepaper.pdf) - The foundational paper we're implementing
- [Circomlib Documentation](https://github.com/iden3/circomlib) - Library of circuits we'll use
- [Hardhat-ZKit](https://github.com/dl-solarity/hardhat-zkit) - Our testing framework

# Requirements & Setup Options

You can choose between two setup methods:

## Option A: Local Installation

### Requirements:

- [Node.js >= 18](https://nodejs.org/en/download/package-manager)
- [Circom](https://docs.circom.io/getting-started/installation/)
- Basic familiarity with terminal
- Basic understanding of:
  - Cryptographic hash functions
  - Smart contracts (basic)

### Setup:

```bash
# Clone the repository
git clone https://github.com/vaniiiii/zk-workshop
cd zk-workshop

# Install dependencies
npm install

# Verify installation
npx hardhat help
npx hardhat zkit
npx hardhat compile
npx hardhat zkit compile
npx hardhat clean

# Verify Circom installation
circom --help
circom --version
```

## Option B: Docker Setup

### Requirements:

- [Docker](https://www.docker.com/products/docker-desktop/) installed on your system
- Git
- Basic familiarity with terminal

### Setup:

```bash
# Clone the repository
git clone https://github.com/vaniiiii/zk-workshop
cd zk-workshop
```

Start Docker container:

For macOS/Linux:

```bash
docker run -it --rm -v $(pwd):/workspace vani0xff/zk-workshop bash
```

For Windows PowerShell:

```powershell
docker run -it --rm -v ${PWD}:/workspace vani0xff/zk-workshop bash
```

If Windows path issues occur, use full path:

```powershell
docker run -it --rm -v C:\full\path\to\workshop:/workspace vani0xff/zk-workshop bash
```

### Working with Docker:

- Edit files locally in your preferred editor
- Run all commands in the Docker terminal
- To exit Docker: type `exit`
- To restart: run the docker run command again
- Verify setup inside Docker container:
  ```bash
  circom --help
  circom --version
  ```

# Background 🎯

## What is a Mixer?

A mixer is a privacy protocol that enables users to break the on-chain link between source and destination addresses. It works like a pool where many users deposit fixed amounts of tokens, and later withdraw them to different addresses, making it impossible to trace which deposit corresponds to which withdrawal.

## How Does it Work?

### 1. Deposit Phase

- User generates two random values: `nullifier` and `secret`
- Creates a commitment (hash of both values)
- Deposits tokens along with the commitment
- Commitment gets added to a Merkle tree

### 2. Withdrawal Phase

- User provides a zero-knowledge proof showing:
  - They know a secret corresponding to a commitment in the tree
  - They haven't withdrawn these tokens before (using nullifier)
- If proof verifies, tokens are sent to a new address

### 3. Privacy Protection

- Commitments hide the actual secret values
- Merkle tree proves membership without revealing which leaf
- Nullifiers prevent double-spending without linking to deposit

## Technical Overview

Our implementation consists of four main components:

1. **CommitmentHasher**: Creates commitment and nullifier hashes
2. **HashLeftRight**: Hash two values using MiMc hash function
3. **MerkleTreeChecker**: Verifies membership proofs
4. **Withdraw**: Main circuit combining all components

## Workshop Structure

The workshop consists of two parts:

### Part 1: Circuit Implementation (Current)

In this part, we'll implement the core zero-knowledge circuits that power the mixer. You'll build each component step by step, with tests to verify your implementation.

### Part 2: Smart Contract Integration (Following)

After completing the circuits, we'll explore the smart contract side. This includes:

- Deposit and withdrawal mechanics
- On-chain verification
- Complete system integration

The full implementation can be found in `scripts/withdraw.ts`.

# Workshop Tasks 🛠️

## 1. CommitmentHasher

### What we're building:

A circuit that creates two different hashes:

- A commitment that securely combines nullifier and secret
- A nullifier hash that serves as a public identifier

### Technical Details:

- Uses Pedersen Hash, a specialized commitment scheme that:
  - Maps inputs to points on an elliptic curve
  - Combines points using curve arithmetic
  - Provides:
    - Perfect hiding: Output reveals nothing about inputs
    - Computational binding: Practically impossible to find different inputs with same output
    - Efficient for ZK circuits

<details>
<summary>💡 Need a hint for CommitmentHasher?</summary>

1. Structure:

```circom
component nullifierBits = Num2Bits(248);
component secretBits = Num2Bits(248);
component commitmentHasher = Pedersen(496);  // Why 496?
component nullifierHasher = Pedersen(248);
```

2. Think about:

- How to connect bits between components
- Why nullifierHash only needs nullifier bits
- Order of bits in commitment
</details>

### Testing Your Implementation:

```bash
npx hardhat zkit compile
npx hardhat test test/commitmentHasher.t.ts
```

## 2. HashLeftRight

### What we're building:

A circuit that combines two inputs into one hash, used as the building block for our Merkle tree.

### Technical Details:

- Uses MiMCSponge hash function:
  - Optimized for ZK circuits
  - Fewer constraints than Pedersen
  - Perfect for binary tree structures

<details>
<summary>💡 Need a hint for HashLeftRight?</summary>

1. Structure:

```circom
component hasher = MiMCSponge(2, 220, 1);
// Think about:
// - How to connect inputs
// - Which output to use
// - What the k parameter means
```

</details>

### Testing Your Implementation:

```bash
npx hardhat zkit compile
npx hardhat test test/hashLeftRight.t.ts
```

## 3. MerkleTreeChecker

### What we're building:

A circuit that verifies a value exists in a Merkle tree without revealing which leaf it is.

### Technical Details:

- Uses path verification
- Implements selective hash combination
- Handles dynamic positioning with DualMux

<details>
<summary>💡 Need a hint for MerkleTreeChecker?</summary>

1. Structure:

```circom
component selectors[levels];
component hashers[levels];
// Think about:
// - How to initialize components
// - How to connect between levels
// - Final root comparison
```

</details>

### Testing Your Implementation:

```bash
npx hardhat zkit compile
npx hardhat test test/merkleTreeChecker.t.ts
```

## 4. Withdraw Circuit

### What we're building:

The main circuit that ties everything together to enable private withdrawals.

### Technical Details:

- Combines commitment verification
- Implements membership proof
- Ensures single-use through nullifiers
- Maintains zero-knowledge properties

<details>
<summary>💡 Need a hint for Withdraw?</summary>

1. Structure:

```circom
component hasher = CommitmentHasher();
component tree = MerkleTreeChecker(levels);
// Think about:
// - How to verify nullifierHash
// - How to connect commitment to tree
// - Why we need recipient constraint
```

</details>

### Testing Your Implementation:

```bash
npx hardhat zkit compile
npx hardhat zkit verifiers
npx hardhat test test/withdraw.t.ts
```

# Getting Help 🤝

Use logging for debugging:

```circom
// In circuits
log("Value of signal:", signal);
log("Debug point reached");
```

```typescript
// In tests
console.log("Witness output:", witness);
console.log("Circuit inputs:", input);
```

Clear cache and compile again:

```bash
npx hardhat clean
npx hardhat zkit compile
```

# Going Further 🚀

To test your circuit with the smart contract implementation:

```bash
# Generate Solidity verifier
npx hardhat zkit verifiers

# Deploy and test the contract
npx hardhat run scripts/withdraw.ts
```

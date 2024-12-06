import { randomBytes } from "crypto";
import { bigint } from "hardhat/internal/core/params/argumentTypes";
import { buildPedersenHash, PedersenHash } from "circomlibjs";

const BYTES_SIZE = 31; // 248 bits, Whitepaper parameter

const pedersenHash = async (data: Buffer): Promise<bigint> => {
  // Create the Pedersen hasher
  const pedersen = await buildPedersenHash();

  // Hash the data to a point on BabyJub curve in compressed format
  const hashPoint = pedersen.hash(data);

  // Decompress the point and get x-coordinate
  const [xCoord] = pedersen.babyJub.unpackPoint(hashPoint);

  // Convert from Montgomery form
  const normalForm = pedersen.babyJub.F.fromMontgomery(xCoord);

  // Convert to bigint
  return bufferToBigInt(normalForm);
};

// Little endian
function bufferToBigInt(buffer: Buffer): bigint {
  let result = BigInt(0);
  for (let i = 0; i < buffer.length; i++) {
    let temp = BigInt(buffer[i]) << BigInt(i * 8);
    result = result + temp;
  }
  return result;
}

function bigIntToBuffer(int: bigint, length: number): Buffer {
  const requiredLength = Math.ceil(int.toString(2).length / 8);
  if (requiredLength > length)
    throw "Invalid number value, length is lower than required one";

  const buffer = Buffer.alloc(length);
  for (let i = 0; i < length; i++) {
    buffer[i] = Number(int & 0xffn);
    int >>= 8n;
  }
  return buffer;
}

async function generateCommitment(): Promise<{
  nullifier: bigint;
  secret: bigint;
  commitment: bigint;
}> {
  const nullifierBytes: Buffer = randomBytes(BYTES_SIZE);
  const nullifier = bufferToBigInt(nullifierBytes);

  const secretBytes: Buffer = randomBytes(BYTES_SIZE);
  const secret = bufferToBigInt(secretBytes);

  const commitmentBytes = Buffer.concat([nullifierBytes, secretBytes]);
  const commitment = await pedersenHash(commitmentBytes);

  return { nullifier, secret, commitment };
}

export { pedersenHash, bigIntToBuffer, generateCommitment };

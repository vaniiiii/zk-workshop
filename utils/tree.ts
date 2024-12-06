import MerkleTree from "fixed-merkle-tree";
import { buildMimcSponge } from "circomlibjs";
import { HashFunction, Element } from "fixed-merkle-tree";

const LEVELS = 20; // Whitepaper parameter

const tree = new MerkleTree(20);

async function mimcHasher(): Promise<HashFunction<Element>> {
  const mimc = await buildMimcSponge();

  const hasher: HashFunction<Element> = (
    left: Element,
    right: Element
  ): string => {
    return mimc.F.toString(mimc.multiHash([left, right]));
  };

  return hasher;
}

async function createTree(levels = LEVELS): Promise<MerkleTree> {
  const hasher = await mimcHasher();
  return new MerkleTree(levels, [], { hashFunction: hasher });
}

export { createTree };

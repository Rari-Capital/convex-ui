import { PoolInformation } from "../../types";
/**
 * @param provider - An initiated ethers provider.
 * @param id - The pool id.
 * @param directoryAddress - Fuse Directory address.
 * @returns - Object with following properties: name: string, creator: address, comptroller: address, blockPosted: bn, timestampPosted: bn.
 */
export declare function getPool(): Promise<PoolInformation>;

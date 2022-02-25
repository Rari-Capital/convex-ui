import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { PoolInstance } from "./types";
/**
 * @param provider - An initiated ethers provider.
 * @param id - The chain ID. Arbitrum and Mainnet are supported.
 * @param poolId - The pool's id.
 * @returns An interface that'll let apps interact with fuse pools. (read/write functions).
 */
export declare const Pool: (provider: Web3Provider | JsonRpcProvider, id: number, poolId: number) => PoolInstance;

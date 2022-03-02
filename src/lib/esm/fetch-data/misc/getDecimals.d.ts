import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
/**
 * @param tokenAddress - Address of the token to get decimals for.
 * @param provider - An initiated ethers provider.
 * @returns - The decimals of given token.
 */
export declare function getDecimals(tokenAddress: string, provider: Web3Provider | JsonRpcProvider): Promise<number>;

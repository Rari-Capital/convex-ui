import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
/**
 * @param comptrollerAddress - Address of the comptroller where the market is listed.
 * @param marketAddress - Address of market to interact with.
 * @param actionType - Enter or exit.
 * @param provider - An initiated ethers provider.
 */
export declare function collateral(comptrollerAddress: string, marketAddress: string[], action: actionType, provider: Web3Provider | JsonRpcProvider): Promise<void>;
declare type actionType = "enter" | "exit";
export {};

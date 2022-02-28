import { USDPricedFuseAsset } from "../../../types";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
/**
 * @param provider - An initiated ethers provider.
 * @param userAddress - The users address. Will be used to get user's balance in pool.
 * @param cTokenAddress - The markets/ctoken contract address to query.
 * @param oracleAddress - The pool's oracle address.
 * @returns - All dynamic market data with USD calculations.
 */
export declare function fetchDynamicMarketData(provider: Web3Provider | JsonRpcProvider, userAddress: string, cTokenAddress: string, oracleAddress: string): Promise<USDPricedFuseAsset>;

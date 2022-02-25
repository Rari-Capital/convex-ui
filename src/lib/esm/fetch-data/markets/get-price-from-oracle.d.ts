import { BigNumber } from "@ethersproject/bignumber";
/**
 * @param tokenAddress - Token address.
 * @param oracleAddress - The comptroller's oracle address.
 * @param provider - An initiated ethers provider.
 * @returns - Price of the given token based on the price feed used by the comptroller.
 */
export declare function getPriceFromOracle(tokenAddress: string, oracleAddress: string): Promise<BigNumber>;

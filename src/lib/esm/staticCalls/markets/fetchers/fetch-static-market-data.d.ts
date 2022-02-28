import { StaticData } from "../../../types";
/**
 *
 * @param marketAddress - The market contract address to query.
 * @param provider - An initiated ethers provider.
 * @param oracleAddress - The pool's oracle address.
 * @returns - The markets static data. Oracle, collateral factor, etc.
 */
export declare function fetchStaticMarketData(marketAddress: string, provider: any, oracleAddress: string): Promise<StaticData>;

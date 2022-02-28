import { RewardsInPool } from "../../types";
/**
 * @param comptrollerAddress - The comptroller address to call.
 * @param oracleAddress - The pool's oracle address.
 * @param userAddress - The users address.
 * @returns an async function call to get IncentivesData
 */
export declare function fetchRewardsInPool(comptrollerAddress: string, oracleAddress: string, userAddress: string): Promise<RewardsInPool>;

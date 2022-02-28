import { RewardsDistributorData } from "../../../types";
/**
 * @param comptrollerAddress - Address of comptroller to query.
 * @returns - An array of addresses of available reward distributors in given comptroller.
 */
export declare function fetchAvailableRdsWithContext(comptrollerAddress: string): Promise<RewardsDistributorData[]>;

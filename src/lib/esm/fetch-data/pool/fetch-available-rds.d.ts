/**
 * @param comptrollerAddress - Address of comptroller to query.
 * @returns - An array of addresses of available reward distributors in given comptroller.
 */
export declare function fetchAvailableRdsWithContext(comptrollerAddress: string): Promise<RewardsDistributorData[]>;
export interface RewardsDistributorData {
    address: string;
    isRewardsDistributor: boolean;
    isFlywheel: boolean;
}

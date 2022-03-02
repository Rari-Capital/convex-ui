/**
 * @param rdAddress - Address of the reward distributor to query.
 * @returns - An array of addresses for all rewarded markets.
 */
export declare function fetchRewardedMarketsInRd(rdAddress: string): Promise<string[]>;

/**
 * @param comptrollerAddress - Address of comptroller to query.
 * @param provider - An initiated ethers provider.
 * @returns - An array of addresses of available reward distributors in given comptroller.
 */
export declare function fetchAllMarkets(comptrollerAddress: string, provider: any): Promise<string[]>;

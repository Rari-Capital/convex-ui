import { BigNumber } from "@ethersproject/bignumber";
/**
 * @param rdAddress - The rewards distributor address.
 * @param marketAddress - Address of market to query.
 * @param type - String. supply or borrow.
 * @returns - BigNumber representation of supply/borrow reward speed by block.
 * @note - It can be made a regular number by parsing it with the rewarded token's decimals.
 */
export declare function fetchRewardSpeedInMarket(rdAddress: string, marketAddress: string, type: 'supply' | 'borrow'): Promise<BigNumber>;

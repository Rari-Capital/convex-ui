import { BigNumber } from "@ethersproject/bignumber";
import { USDPricedFuseAsset } from "../types";
export declare function getUnderlyingBalancesForPool(markets: USDPricedFuseAsset[]): {
    [cToken: string]: BigNumber;
};

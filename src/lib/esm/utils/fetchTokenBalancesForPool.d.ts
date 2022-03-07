import { BigNumber } from "@ethersproject/bignumber";
import { USDPricedFuseAsset } from "../types";
export declare function fetchTokenBalancesForPool(markets: USDPricedFuseAsset[], userAddress: string): Promise<BigNumber[]>;

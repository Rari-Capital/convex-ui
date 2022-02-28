var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Internal utils
import { constructMantissa } from "../../utils/constructMantissa";
import { convertMantissaToAPR, convertMantissaToAPY } from "../../utils/convertMantissa";
// Fetchers
import { fetchRewardedMarketsInRd } from "./fetchers/fetch-rewarded-markets-in-rd";
import { fetchRewardTokenInRd } from "./fetchers/fetch-reward-token-in-rd";
import { fetchRewardSpeedInMarket } from "./fetchers/fetch-reward-speed-in-market";
import { fetchAvailableRdsWithContext } from "./fetchers/fetch-available-rds-with-context";
import { fetchDynamicMarketData } from "../markets/fetchers/fetch-dynamic-market-data";
/**
 * @param comptrollerAddress - The comptroller address to call.
 * @param oracleAddress - The pool's oracle address.
 * @param userAddress - The users address.
 * @returns an async function call to get IncentivesData
 */
export function fetchRewardsInPool(comptrollerAddress, oracleAddress, userAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Get all Reward Distributors in pool.
        const rdsWithContext = yield fetchAvailableRdsWithContext.bind(this)(comptrollerAddress);
        let rewards = {};
        // 2. For every reward distributor:
        for (const rd of rdsWithContext) {
            rewards[rd.address] = {};
            // If rd is not a flywheel we have to calculate the supply and borrow APY/APR.
            if (rd.isFlywheel === false) {
                // 1. Get reward distributor underlying token info
                const rdToken = yield fetchRewardTokenInRd.bind(this)(rd.address);
                const rdTokenDecimals = yield this.getDecimals(rdToken);
                const rewardEthPrice = yield this.getPriceFromOracle(rdToken, oracleAddress);
                // 2. Get all market rewarded by this reward distributor.
                const marketsInRd = yield fetchRewardedMarketsInRd.bind(this)(rd.address);
                // 3. For every market
                for (const market of marketsInRd) {
                    // 1. Fetch supply and borrow speed
                    const supplySpeed = yield fetchRewardSpeedInMarket.bind(this)(rd.address, market, 'supply');
                    const borrowSpeed = yield fetchRewardSpeedInMarket.bind(this)(rd.address, market, 'borrow');
                    // 2. Get info necessary to get APY and APR
                    const underlying = yield fetchDynamicMarketData.bind(this)(this._provider, userAddress, market, oracleAddress);
                    const supplyMantissa = constructMantissa(supplySpeed, rewardEthPrice, underlying.totalSupply, underlying.underlyingPrice, rdTokenDecimals, underlying.underlyingDecimals);
                    const borrowMantissa = constructMantissa(borrowSpeed, rewardEthPrice, underlying.totalSupply, underlying.underlyingPrice, rdTokenDecimals, underlying.underlyingDecimals);
                    // 5. Get APY and APR for supply and borrow speeds.
                    const supplyAPY = convertMantissaToAPY(supplyMantissa, 365);
                    const supplyAPR = convertMantissaToAPR(supplyMantissa);
                    const borrowAPY = convertMantissaToAPY(borrowMantissa, 365);
                    const borrowAPR = convertMantissaToAPR(borrowMantissa);
                    rewards[rd.address][market] = { supplyAPR, supplyAPY, borrowAPR, borrowAPY };
                }
            }
            else
                return;
        }
        return rewards;
    });
}

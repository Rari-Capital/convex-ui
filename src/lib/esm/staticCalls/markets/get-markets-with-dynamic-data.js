var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Zero } from '@ethersproject/constants';
// Utils
import { fetchAllMarkets } from './fetchers/fetch-all-markets';
import { fetchDynamicMarketData } from './fetchers/fetch-dynamic-market-data';
/**
 * @param comptrollerAddress - Comptroller to look for.
 * @param userAddress - User to get information for.
 * @param oracleAddress - The pool's oracle address.
 * @returns - Dynamic data for all listed markets.
 */
export function getAllMarketsWithDynamicData(comptrollerAddress, userAddress, oracleAddress, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const marketsInPool = yield fetchAllMarkets(comptrollerAddress, this._provider);
        let markets = [];
        for (const market of marketsInPool) {
            const marketWithData = yield fetchDynamicMarketData.bind(this)(this._provider, userAddress, market, oracleAddress);
            markets.push(marketWithData);
        }
        let marketsWithData = {
            markets,
            totalLiquidityUSD: Zero,
            totalSupplyBalanceUSD: Zero,
            totalBorrowBalanceUSD: Zero,
            totalSuppliedUSD: Zero,
            totalBorrowedUSD: Zero
        };
        for (const market of markets) {
            marketsWithData.totalLiquidityUSD = marketsWithData.totalLiquidityUSD.add(market.liquidityUSD);
            marketsWithData.totalSupplyBalanceUSD = marketsWithData.totalSupplyBalanceUSD.add(market.supplyBalanceUSD);
            marketsWithData.totalBorrowBalanceUSD = marketsWithData.totalBorrowBalanceUSD.add(market.borrowBalanceUSD);
            marketsWithData.totalSuppliedUSD = marketsWithData.totalSuppliedUSD.add(market.totalSupplyUSD);
            marketsWithData.totalBorrowedUSD = marketsWithData.totalBorrowedUSD.add(market.totalBorrowUSD);
        }
        return marketsWithData;
    });
}

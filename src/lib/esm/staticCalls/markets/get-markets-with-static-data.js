var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchAllMarkets } from "./fetchers/fetch-all-markets";
import { fetchStaticMarketData } from "./fetchers/fetch-static-market-data";
/**
 *
 * @param comptrollerAddress - The pool's comptroller address.
 * @param oracleAddress - The pool's oracle address.
 * @returns - Static data for all listed markets.
 */
export function getAllMarketsWithStaticData(comptrollerAddress, oracleAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        // Gives back array of addresses of CTokens from Comptroller
        const markets = yield fetchAllMarkets(comptrollerAddress, this._provider);
        let marketsWithStaticData = [];
        for (const market of markets) {
            const staticData = yield fetchStaticMarketData(market, this._provider, oracleAddress, comptrollerAddress);
            marketsWithStaticData.push(staticData);
        }
        return marketsWithStaticData;
    });
}

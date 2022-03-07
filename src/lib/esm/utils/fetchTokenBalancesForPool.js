var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchTokenBalance } from "./fetchTokenBalance";
export function fetchTokenBalancesForPool(markets, userAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let arrayOfUnderlyings = [];
        for (const market of markets) {
            arrayOfUnderlyings.push(market.underlyingToken);
        }
        let balances = [];
        for (const underlying of arrayOfUnderlyings) {
            const balance = yield fetchTokenBalance.bind(this)(underlying, userAddress);
            balances.push(balance);
        }
        return balances;
    });
}

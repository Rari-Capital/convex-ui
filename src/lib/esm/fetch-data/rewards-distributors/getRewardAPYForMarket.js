var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Internal Utils
import { constructMantissa } from "./utils/constructMantissa";
import { convertMantissaToAPY, convertMantissaToAPR } from "./utils/convertMantissa";
export function getRewardAPYForMarket() {
    return __awaiter(this, void 0, void 0, function* () {
        const rdAddress = '0x5302E909d1e93e30F05B5D6Eea766363D14F9892';
        const marketAddress = '0xB8DA336A58a13D9F09FaA41570cAAf5Ec4879266';
        const oracleAddress = '0xc60d11e23fc0e61A833f2c83ba2d764464704062';
        const comptrollerAddress = '0x42053c258b5cd0b7f575e180DE4B90763cC2358b';
        const rewardSpeed = yield this.fetchRewardSpeedInMarket(rdAddress, marketAddress, 'supply');
        const rdToken = yield this.fetchRewardTokenInRd(rdAddress);
        const rdTokenDecimals = yield this.getDecimals(rdToken, this._provider);
        const rewardEthPrice = yield this.getPriceFromOracle(rdToken, oracleAddress, this._provider);
        const underlying = yield this.getMarketsWithData(comptrollerAddress);
        const mantissa = constructMantissa(rewardSpeed, rewardEthPrice, underlying.assets[0].totalSupply, underlying.assets[0].underlyingPrice, rdTokenDecimals, underlying.assets[0].underlyingDecimals);
        const supplyAPY = convertMantissaToAPY(mantissa, 365);
        const supplyAPR = convertMantissaToAPR(mantissa);
        return {
            supplyAPR,
            supplyAPY
        };
    });
}

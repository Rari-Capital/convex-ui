var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Contract } from "@ethersproject/contracts";
import { WeiPerEther } from '@ethersproject/constants';
import { Interface } from "@ethersproject/abi";
export default class WhitePaperInterestRateModel {
    init(interestRateModelAddress, assetAddress, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const irmInterface = new Interface([
                'function baseRatePerBlock() view returns (uint256)',
                'function multiplierPerBlock() view returns (uint256)',
            ]);
            const whitePaperModelContract = new Contract(interestRateModelAddress, irmInterface, provider);
            this.baseRatePerBlock = yield whitePaperModelContract.callStatic.baseRatePerBlock();
            this.multiplierPerBlock = yield whitePaperModelContract.callStatic.multiplierPerBlock();
            const cTokenInterface = new Interface([
                'function reserveFactorMantissa() view returns (uint256)',
                'function adminFeeMantissa() view returns (uint256)',
                'function fuseFeeMantissa() view returns (uint256)'
            ]);
            const cTokenContract = new Contract(assetAddress, cTokenInterface, provider);
            this.reserveFactorMantissa = yield cTokenContract.callStatic.reserveFactorMantissa();
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(yield cTokenContract.callStatic.adminFeeMantissa());
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(yield cTokenContract.callStatic.fuseFeeMantissa());
            this.initialized = true;
        });
    }
    getBorrowRate(utilizationRate) {
        if (!this.initialized || !this.multiplierPerBlock || !this.baseRatePerBlock)
            throw new Error("Interest rate model class not initialized.");
        return utilizationRate.mul(this.multiplierPerBlock).div(WeiPerEther).add(this.baseRatePerBlock);
    }
    getSupplyRate(utilizationRate) {
        if (!this.initialized || !this.reserveFactorMantissa)
            throw new Error("Interest rate model class not initialized.");
        const oneMinusReserveFactor = WeiPerEther.sub(this.reserveFactorMantissa);
        const borrowRate = this.getBorrowRate(utilizationRate);
        const rateToPool = borrowRate.mul(oneMinusReserveFactor).div(WeiPerEther);
        return utilizationRate.mul(rateToPool).div(WeiPerEther);
    }
}
WhitePaperInterestRateModel.RUNTIME_BYTECODE_HASH = "0xe3164248fb86cce0eb8037c9a5c8d05aac2b2ebdb46741939be466a7b17d0b83";

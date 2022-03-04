var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Interface } from "@ethersproject/abi";
import { Contract } from "@ethersproject/contracts";
import { WeiPerEther } from '@ethersproject/constants';
export default class JumpRateModelV2 {
    init(interestRateModelAddress, assetAddress, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const irmInterface = new Interface([
                'function baseRatePerBlock() view returns (uint256)',
                'function multiplierPerBlock() view returns (uint256)',
                'function jumpMultiplierPerBlock() view returns (uint256)',
                'function kink() view returns (uint256)'
            ]);
            const jumpRateModelContract = new Contract(interestRateModelAddress, irmInterface, provider);
            this.baseRatePerBlock = yield jumpRateModelContract.callStatic.baseRatePerBlock();
            this.multiplierPerBlock = yield jumpRateModelContract.callStatic.multiplierPerBlock();
            this.jumpMultiplierPerBlock = yield jumpRateModelContract.callStatic.jumpMultiplierPerBlock();
            this.kink = yield jumpRateModelContract.callStatic.kink();
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
        if (!this.initialized || !this.multiplierPerBlock || !this.kink || !this.baseRatePerBlock || !this.jumpMultiplierPerBlock)
            throw new Error("Interest rate model class not initialized.");
        if (utilizationRate.lte(this.kink)) {
            return utilizationRate.mul(this.multiplierPerBlock).div(WeiPerEther).add(this.baseRatePerBlock);
        }
        else {
            const normalRate = this.kink.mul(this.multiplierPerBlock).div(WeiPerEther).add(this.baseRatePerBlock);
            const excessUtil = utilizationRate.sub(this.kink);
            return excessUtil.mul(this.jumpMultiplierPerBlock).div(WeiPerEther).add(normalRate);
        }
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
JumpRateModelV2.RUNTIME_BYTECODE_HASH = "0xc6df64d77d18236fa0e3a1bb939e979d14453af5c8287891decfb67710972c3c";

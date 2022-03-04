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
import { Interface } from "@ethersproject/abi";
import { WeiPerEther } from '@ethersproject/constants';
export default class JumpRateModel {
    init(interestRateModelAddress, assetAddress, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const irmInterface = new Interface([
                'function baseRatePerBlock() view returns (uint256)',
                'function multiplierPerBlock() view returns (uint256)',
                'function jumpMultiplierPerBlock() view returns (uint256)',
                'function kink() view returns (uint256)'
            ]);
            const irmContract = new Contract(interestRateModelAddress, irmInterface, provider);
            this.baseRatePerBlock = yield irmContract.callStatic.baseRatePerBlock();
            this.multiplierPerBlock = yield irmContract.callStatic.multiplierPerBlock();
            this.jumpMultiplierPerBlock = yield irmContract.callStatic.jumpMultiplierPerBlock();
            this.kink = yield irmContract.callStatic.kink();
            const cTokenInterface1 = new Interface([
                'function reserveFactorMantissa() view returns (uint256)',
                'function adminFeeMantissa() view returns (uint256)',
                'function fuseFeeMantissa() view returns (uint256)'
            ]);
            const cTokenContract1 = new Contract(assetAddress, cTokenInterface1, provider);
            this.reserveFactorMantissa = yield cTokenContract1.callStatic.reserveFactorMantissa();
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(yield cTokenContract1.callStatic.adminFeeMantissa());
            this.reserveFactorMantissa = this.reserveFactorMantissa.add(yield cTokenContract1.callStatic.fuseFeeMantissa());
            this.initialized = true;
        });
    }
    getBorrowRate(utilizationRate) {
        if (!this.initialized || !this.kink || !this.multiplierPerBlock || !this.baseRatePerBlock || !this.jumpMultiplierPerBlock)
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
JumpRateModel.RUNTIME_BYTECODE_HASHES = [
    "0x00f083d6c0022358b6b3565c026e815cfd6fc9dcd6c3ad1125e72cbb81f41b2a",
    "0x47d7a0e70c9e049792bb96abf3c7527c7543154450c6267f31b52e2c379badc7"
];

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import JumpRateModel from "./JumpRateModel.js";
import { Contract } from "@ethersproject/contracts";
import { Interface } from "@ethersproject/abi";
export default class DAIInterestRateModelV2 extends JumpRateModel {
    init(interestRateModelAddress, assetAddress, provider) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.init.call(this, interestRateModelAddress, assetAddress, provider);
            const interestRateInterface = new Interface([
                'function dsrPerBlock() view returns (uint256)'
            ]);
            const interestRateContract = new Contract(interestRateModelAddress, interestRateInterface, provider);
            this.dsrPerBlock =
                yield interestRateContract.callStatic.dsrPerBlock();
            const cTokenInterface = new Interface([
                'function getCash() external view returns (uint)',
                'function totalBorrowsCurrent() external returns (uint)',
                'function totalReserves() view returns (uint)'
            ]);
            const cTokenContract = new Contract(assetAddress, cTokenInterface, provider);
            this.cash = yield cTokenContract.callStatic.getCash();
            this.borrows = yield cTokenContract.callStatic.totalBorrowsCurrent();
            this.reserves = yield cTokenContract.callStatic.totalReserves();
        });
    }
    getSupplyRate(utilizationRate) {
        if (!this.initialized ||
            !this.cash ||
            !this.borrows ||
            !this.reserves ||
            !this.dsrPerBlock)
            throw new Error("Interest rate model class not initialized.");
        // const protocolRate = super.getSupplyRate(utilizationRate, this.reserveFactorMantissa); //todo - do we need this
        const protocolRate = super.getSupplyRate(utilizationRate);
        const underlying = this.cash.add(this.borrows).sub(this.reserves);
        if (underlying.isZero()) {
            return protocolRate;
        }
        else {
            const cashRate = this.cash.mul(this.dsrPerBlock).div(underlying);
            return cashRate.add(protocolRate);
        }
    }
}
DAIInterestRateModelV2.RUNTIME_BYTECODE_HASH = "0x4b4c4f6386fd72d3f041a03e9eee3945189457fcf4299e99098d360a9f619539";

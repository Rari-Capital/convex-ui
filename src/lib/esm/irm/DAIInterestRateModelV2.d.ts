import JumpRateModel from "./JumpRateModel.js";
import { BigNumber } from "@ethersproject/bignumber";
export default class DAIInterestRateModelV2 extends JumpRateModel {
    static RUNTIME_BYTECODE_HASH: string;
    initialized: boolean | undefined;
    dsrPerBlock: BigNumber | undefined;
    cash: BigNumber | undefined;
    borrows: BigNumber | undefined;
    reserves: BigNumber | undefined;
    reserveFactorMantissa: BigNumber | undefined;
    init(interestRateModelAddress: string, assetAddress: string, provider: any): Promise<void>;
    getSupplyRate(utilizationRate: BigNumber): BigNumber;
}

import { BigNumber } from "@ethersproject/bignumber";
export interface JumpRateModelInterface {
    JumpRateModel: any;
}
export default class JumpRateModel {
    static RUNTIME_BYTECODE_HASHES: string[];
    initialized: boolean | undefined;
    baseRatePerBlock: BigNumber | undefined;
    multiplierPerBlock: BigNumber | undefined;
    jumpMultiplierPerBlock: BigNumber | undefined;
    kink: BigNumber | undefined;
    reserveFactorMantissa: BigNumber | undefined;
    RUNTIME_BYTECODE_HASHES: any;
    init(interestRateModelAddress: string, assetAddress: string, provider: any): Promise<void>;
    getBorrowRate(utilizationRate: BigNumber): BigNumber;
    getSupplyRate(utilizationRate: BigNumber): BigNumber;
}

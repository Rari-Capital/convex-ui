import { BigNumber } from "@ethersproject/bignumber";
export default class JumpRateModelV2 {
    static RUNTIME_BYTECODE_HASH: string;
    initialized: boolean | undefined;
    baseRatePerBlock: BigNumber | undefined;
    multiplierPerBlock: BigNumber | undefined;
    jumpMultiplierPerBlock: BigNumber | undefined;
    kink: BigNumber | undefined;
    reserveFactorMantissa: BigNumber | undefined;
    init(interestRateModelAddress: string, assetAddress: string, provider: any): Promise<void>;
    getBorrowRate(utilizationRate: BigNumber): BigNumber;
    getSupplyRate(utilizationRate: BigNumber): BigNumber;
}

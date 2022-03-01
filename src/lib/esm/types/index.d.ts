import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
export interface TokenData {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    color: string;
    overlayTextColor: string;
    logoURL: string;
}
export interface FuseAsset {
    cToken: string;
    borrowBalance: BigNumber;
    supplyBalance: BigNumber;
    liquidity: BigNumber;
    membership: boolean;
    underlyingName: string;
    underlyingSymbol: string;
    underlyingToken: string;
    underlyingDecimals: BigNumber;
    underlyingPrice: BigNumber;
    underlyingBalance: BigNumber;
    collateralFactor: BigNumber;
    reserveFactor: BigNumber;
    adminFee: BigNumber;
    fuseFee: BigNumber;
    oracle: string;
    borrowRatePerBlock: BigNumber;
    supplyRatePerBlock: BigNumber;
    totalBorrow: BigNumber;
    totalSupply: BigNumber;
}
export interface USDPricedFuseAsset extends FuseAsset {
    supplyBalanceUSD: BigNumber;
    borrowBalanceUSD: BigNumber;
    totalSupplyUSD: BigNumber;
    totalBorrowUSD: BigNumber;
    liquidityUSD: BigNumber;
    isPaused: boolean;
    borrowGuardianPaused?: boolean;
}
export interface USDPricedFuseAssetWithTokenData extends USDPricedFuseAsset {
    tokenData: TokenData;
}
export interface FusePoolData {
    comptroller: string;
    name: string;
    oracle: string;
    oracleModel: string | null;
    id?: number;
    admin: string;
}
export declare type MarketsWithData = {
    assets: USDPricedFuseAsset[];
    totalLiquidityUSD: BigNumber;
    totalSupplyBalanceUSD: BigNumber;
    totalBorrowBalanceUSD: BigNumber;
    totalSuppliedUSD: BigNumber;
    totalBorrowedUSD: BigNumber;
};
export declare type Options = {
    from?: string;
};
export declare type PoolInformation = {
    name: string;
    creator: string;
    comptroller: string;
    blockPosted: BigNumber;
    timestampPosted: BigNumber;
};
export declare type Addresses = {
    FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS: string;
    FUSE_POOL_LENS_CONTRACT_ADDRESS: string;
};
export declare type OracleHashes = {
    [key: string]: string;
};
export interface RewardsDistributorData {
    address: string;
    isRewardsDistributor: boolean;
    isFlywheel: boolean;
}
export declare type PoolInstance = {
    poolId: number;
    contracts: {
        fuseLensContract: Contract;
    };
    _provider: Web3Provider | JsonRpcProvider;
    addresses: Addresses;
    oracleHashes: OracleHashes;
    getPriceFromOracle(tokenAddress: string, oracleAddress: string): Promise<BigNumber>;
    getMarketsWithData(comptrollerAddress: string, options?: Options | undefined): Promise<MarketsWithData>;
    getEthUsdPriceBN: () => Promise<BigNumber>;
    getDecimals(tokenAddress: string, provider: Web3Provider | JsonRpcProvider): Promise<number>;
    fetchAvailableRdsWithContext(comptrollerAddress: string): Promise<RewardsDistributorData[]>;
    fetchFusePoolData(): Promise<FusePoolData | undefined>;
    getPool(): Promise<PoolInformation>;
    fetchAllMarkets(comptrollerAddress: string): Promise<string[]>;
    fetchRewardedMarketsInRd(rdAddress: string): Promise<string[]>;
    fetchRewardSpeedInMarket(rdAddress: string, marketAddress: string, type: 'supply' | 'borrow'): Promise<BigNumber>;
    fetchRewardTokenInRd(rdAddress: string): Promise<string>;
    getRewardAPYForMarket(): Promise<{
        supplyAPR: number;
        supplyAPY: number;
    }>;
};

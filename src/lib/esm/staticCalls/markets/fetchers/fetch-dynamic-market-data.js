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
import { WeiPerEther, Zero } from '@ethersproject/constants';
import { getEthUsdPriceBN } from "../..";
import { callInterfaceWithMulticall } from "../../../utils/multicall";
/**
 * @param provider - An initiated ethers provider.
 * @param userAddress - The users address. Will be used to get user's balance in pool.
 * @param cTokenAddress - The markets/ctoken contract address to query.
 * @param oracleAddress - The pool's oracle address.
 * @returns - All dynamic market data with USD calculations.
 */
export function fetchDynamicMarketData(provider, userAddress, cTokenAddress, oracleAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. We get all the market data directly from contracts.
        // At this point all USD priced entries are a BigNumber that equals zero.
        let marketData = yield contractCalls.bind(this)(provider, userAddress, cTokenAddress, oracleAddress);
        // 2. Get ETH price. Will be used to calculate USD priced entries.
        const ethPrice = yield getEthUsdPriceBN();
        // 3. Calculate USD priced entries and add them to the marketsData object.
        const parsedMarketData = getUSDEntries(marketData, ethPrice);
        return parsedMarketData;
    });
}
function contractCalls(provider, userAddress, cTokenAddress, oracleAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const cTokenInterface = new Interface([
            'function getCash() external view returns (uint)',
            'function totalReserves() external view returns (uint)',
            'function totalAdminFees() external view returns (uint)',
            'function totalFuseFees() external view returns (uint)',
            'function totalBorrowsCurrent() external returns (uint)',
            'function isCEther() external view returns (bool)',
            'function underlying() external view returns (address)',
            'function borrowRatePerBlock() external view returns (uint)',
            'function supplyRatePerBlock() external view returns (uint)',
            'function balanceOfUnderlying(address owner) external returns (uint)',
            'function borrowBalanceStored(address account) external view returns (uint)',
            'function exchangeRateStored() external view returns (uint)'
        ]);
        const cTokenData = yield callInterfaceWithMulticall(provider, cTokenInterface, cTokenAddress, [
            "getCash",
            "totalReserves",
            "totalAdminFees",
            "totalFuseFees",
            "totalBorrowsCurrent",
            "isCEther",
            "underlying",
            "borrowRatePerBlock",
            "supplyRatePerBlock",
            "balanceOfUnderlying",
            "borrowBalanceStored",
            "exchangeRateStored"
        ], [[], [], [], [], [], [], [], [], [], [userAddress], [userAddress], []]);
        const liquidity = cTokenData[0][0];
        const totalReserves = cTokenData[1][0];
        const totalAdminFees = cTokenData[2][0];
        const totalFuseFees = cTokenData[3][0];
        const totalBorrow = cTokenData[4][0];
        const isCEther = cTokenData[5][0];
        const underlying = cTokenData[6][0];
        const borrowRatePerBlock = cTokenData[7][0];
        const supplyRatePerBlock = cTokenData[8][0];
        const supplyBalance = cTokenData[9][0];
        const borrowBalance = cTokenData[10][0];
        const totalSupply = liquidity.add(totalBorrow).sub(totalReserves.add(totalAdminFees).add(totalFuseFees));
        let underlyingBalance;
        let underlyingPrice;
        if (isCEther) {
            underlyingBalance = yield provider.getBalance(userAddress);
            underlyingPrice = WeiPerEther;
        }
        else {
            const ERC20Interface = new Interface([
                'function balanceOf(address _owner) public view returns (uint256 balance)',
            ]);
            const ERC20Contract = new Contract(underlying, ERC20Interface, provider);
            underlyingBalance = yield ERC20Contract.callStatic.balanceOf(userAddress);
            underlyingPrice = yield this.getPriceFromOracle(underlying, oracleAddress, provider);
        }
        const membership = false;
        const isPaused = false;
        return {
            cToken: cTokenAddress,
            borrowBalance,
            supplyBalance,
            liquidity,
            membership,
            supplyRatePerBlock,
            borrowRatePerBlock,
            underlyingPrice,
            underlyingBalance,
            totalBorrow,
            totalSupply,
            supplyBalanceUSD: Zero,
            borrowBalanceUSD: Zero,
            totalSupplyUSD: Zero,
            totalBorrowUSD: Zero,
            liquidityUSD: Zero,
            isPaused: false
        };
    });
}
function getUSDEntries(asset, ethPrice) {
    asset.supplyBalanceUSD = asset.supplyBalance
        .mul(asset.underlyingPrice)
        .mul(ethPrice)
        .div(WeiPerEther.pow(3));
    asset.borrowBalanceUSD = asset.borrowBalance
        .mul(asset.underlyingPrice)
        .mul(ethPrice)
        .div(WeiPerEther.pow(3));
    // totalSupplyBalanceUSD = totalSupplyBalanceUSD.add(asset.supplyBalanceUSD);
    // totalBorrowBalanceUSD = totalBorrowBalanceUSD.add(asset.borrowBalanceUSD);
    asset.totalSupplyUSD = asset.totalSupply
        .mul(asset.underlyingPrice)
        .mul(ethPrice)
        .div(WeiPerEther.pow(3));
    asset.totalBorrowUSD = asset.totalBorrow
        .mul(asset.underlyingPrice)
        .mul(ethPrice)
        .div(WeiPerEther.pow(3));
    // totalSuppliedUSD = totalSuppliedUSD.add(asset.totalSupplyUSD);
    // totalBorrowedUSD = totalBorrowedUSD.add(asset.totalBorrowUSD);
    asset.liquidityUSD = asset.liquidity
        .mul(asset.underlyingPrice)
        .mul(ethPrice)
        .div(WeiPerEther.pow(3));
    // totalLiquidityUSD.add(asset.liquidityUSD);
    return asset;
}

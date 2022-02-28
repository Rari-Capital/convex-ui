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
import { callInterfaceWithMulticall, } from "../../../utils/multicall";
/**
 *
 * @param marketAddress - The market contract address to query.
 * @param provider - An initiated ethers provider.
 * @param oracleAddress - The pool's oracle address.
 * @returns - The markets static data. Oracle, collateral factor, etc.
 */
export function fetchStaticMarketData(marketAddress, provider, oracleAddress, comptrollerAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const cTokenInterface = new Interface([
            "function isCEther() external view returns (bool)",
            "function underlying() external view returns (address)",
            "function adminFeeMantissa() external view returns (uint256)",
            "function fuseFeeMantissa() external view returns (uint256)",
            "function reserveFactorMantissa() external view returns (uint256)",
        ]);
        let cTokenData = yield callInterfaceWithMulticall(provider, cTokenInterface, marketAddress, [
            "isCEther",
            "underlying",
            "adminFeeMantissa",
            "fuseFeeMantissa",
            "reserveFactorMantissa",
        ], [[], [], [], [], []]);
        const comptrollerInterface = new Interface([
            "function markets(address cToken) external view returns (bool, uint)"
        ]);
        const comptrollerContract = new Contract(comptrollerAddress, comptrollerInterface, provider);
        const [isListed, collateralFactor] = yield comptrollerContract.callStatic.markets(marketAddress);
        const isCEther = cTokenData[0][0];
        const underlying = cTokenData[1][0];
        const adminFeeMantissa = cTokenData[2][0];
        const fuseFeeMantissa = cTokenData[3][0];
        const reserveFactor = cTokenData[4][0];
        const mpoInterface = new Interface([
            "function oracles(address) public view returns (address)",
        ]);
        const mpoContract = new Contract(oracleAddress, mpoInterface, provider);
        const oracle = yield mpoContract.oracles(marketAddress);
        let underlyingToken;
        let underlyingName;
        let underlyingSymbol;
        let underlyingDecimals;
        if (isCEther) {
            underlyingToken = "0x0000000000000000000000000000000000000000";
            underlyingName = "Ethereum";
            underlyingSymbol = "ETH";
            underlyingDecimals = 18;
        }
        else {
            const ERC20Interface = new Interface([
                "function name() public view returns (string)",
                "function symbol() public view returns (string)",
                "function decimals() public view returns (uint8)",
            ]);
            let underlyingData = yield callInterfaceWithMulticall(provider, ERC20Interface, underlying, ["name", "symbol", "decimals"], [[], [], []]);
            underlyingToken = underlying;
            underlyingName = underlyingData[0][0];
            underlyingSymbol = underlyingData[1][0];
            underlyingDecimals = underlyingData[2][0];
        }
        return {
            marketAddress,
            isCEther,
            underlying,
            adminFeeMantissa,
            fuseFeeMantissa,
            reserveFactor,
            collateralFactor,
            oracle,
            underlyingToken,
            underlyingName,
            underlyingSymbol,
            underlyingDecimals,
        };
    });
}

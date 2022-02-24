import { Contract } from "@ethersproject/contracts";
import { Interface } from "@ethersproject/abi";
// Internal
// Utils
import { getAddresses } from "./utils/getAddresses";
import { getOracleHashes } from "./utils/getOracleHashes";
// Fetching Data Functions
import * as fetching from "./fetch-data";
// Market Interactions
import * as market from './market-interactions';
/**
 * @param provider - An initiated ethers provider.
 * @param id - The chain ID. Arbitrum and Mainnet are supported.
 * @param poolId - The pool's id.
 * @returns An interface that'll let apps interact with fuse pools. (read/write functions).
 */
export const Pool = function (provider, id, poolId) {
    if (!provider || !id || !poolId) {
        return;
    }
    const addresses = getAddresses(id);
    const oracleHashes = getOracleHashes(id);
    const fuseLensInterface = new Interface([
        'function getPoolAssetsWithData(address comptroller) external returns ( tuple(address cToken, address underlyingToken, string underlyingName, string underlyingSymbol, uint256 underlyingDecimals, uint256 underlyingBalance, uint256 supplyRatePerBlock, uint256 borrowRatePerBlock, uint256 totalSupply, uint256 totalBorrow, uint256 supplyBalance, uint256 borrowBalance, uint256 liquidity, bool membership, uint256 exchangeRate, uint256 underlyingPrice, address oracle, uint256 collateralFactor, uint256 reserveFactor, uint256 adminFee, uint256 fuseFee, bool borrowGuardianPaused)[] )',
    ]);
    const fuseLensContract = new Contract(addresses.FUSE_POOL_LENS_CONTRACT_ADDRESS, fuseLensInterface, provider);
    const instance = Object.assign(Object.assign({ poolId, contracts: {
            fuseLensContract
        }, _provider: provider, addresses,
        oracleHashes }, fetching), market);
    return instance;
};
//# sourceMappingURL=index.js.map
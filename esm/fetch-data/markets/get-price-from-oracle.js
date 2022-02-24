// Ethers
import { Interface } from "@ethersproject/abi";
import { Contract } from "@ethersproject/contracts";
/**
 * @param tokenAddress - Token address.
 * @param oracleAddress - The comptroller's oracle address.
 * @param provider - An initiated ethers provider.
 * @returns - Price of the given token based on the price feed used by the comptroller.
 */
export function getPriceFromOracle(tokenAddress, oracleAddress) {
    // We need to call the MPO to get price of the given asset.
    const oracleInterface = new Interface([
        'function price(address underlying) external view returns (uint)'
    ]);
    const oracleContract = new Contract(oracleAddress, oracleInterface, this._provider);
    return oracleContract.callStatic.price(tokenAddress);
}
//# sourceMappingURL=get-price-from-oracle.js.map
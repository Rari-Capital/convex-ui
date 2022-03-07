var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Ethers
import { Interface } from "@ethersproject/abi";
import { Contract } from "@ethersproject/contracts";
/**
 * @param comptrollerAddress - Address of the comptroller where the market is listed.
 * @param marketAddress - Address of market to interact with.
 * @param actionType - Enter or exit.
 * @param provider - An initiated ethers provider.
 */
export function collateral(comptrollerAddress, marketAddress, action) {
    return __awaiter(this, void 0, void 0, function* () {
        const comptrollerInterface = new Interface([
            'function enterMarkets(address[] calldata cTokens) external returns (uint[] memory)',
            'function exitMarket(address cTokenAddress) external returns (uint) '
        ]);
        const comptrollerContract = new Contract(comptrollerAddress, comptrollerInterface, this._provider.getSigner());
        // Don't await this, we don't care if it gets executed first!
        if (action === "enter") {
            yield comptrollerContract.enterMarkets(marketAddress);
        }
        else {
            yield comptrollerContract.exitMarket(marketAddress);
        }
    });
}

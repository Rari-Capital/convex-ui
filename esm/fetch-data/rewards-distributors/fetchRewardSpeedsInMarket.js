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
 * @param rdAddress - The rewards distributor address.
 * @param marketAddress - Address of market to query.
 * @param type - String. supply or borrow.
 * @returns - BigNumber representation of supply/borrow reward speed by block.
 * @note - It can be made a regular number by parsing it with the rewarded token's decimals.
 */
export function fetchRewardSpeedInMarket(rdAddress, marketAddress, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const rdInterface = new Interface([
            'function compSupplySpeeds(address) public returns (uint256)',
            'function compBorrowSpeeds(address) public returns (uint256)'
        ]);
        const rdContract = new Contract(rdAddress, rdInterface, this._provider);
        return type === 'supply'
            ? rdContract.callStatic.compSupplySpeeds(marketAddress)
            : rdContract.callStatic.compBorrowSpeeds(marketAddress);
    });
}
//# sourceMappingURL=fetchRewardSpeedsInMarket.js.map
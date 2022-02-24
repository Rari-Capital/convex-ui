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
/**
 * @param comptrollerAddress - Address of comptroller to query.
 * @returns - An array of addresses of available reward distributors in given comptroller.
 */
export function fetchAvailableRds(comptrollerAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const comptrollerInterface = new Interface([
            'function getRewardsDistributors() external view returns (address[] memory)'
        ]);
        const comptrollerContract = new Contract(comptrollerAddress, comptrollerInterface, this._provider);
        const availableRds = yield comptrollerContract.callStatic.getRewardsDistributors();
        // this.pool.availableRds = availableRds
        return availableRds;
    });
}
//# sourceMappingURL=fetch-available-rds.js.map
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
import { Contract } from "@ethersproject/contracts";
import { Interface } from "@ethersproject/abi";
// Utils
import { filterOnlyObjectProperties } from "../utils/filterOnlyObjectProperties";
/**
 * @param provider - An initiated ethers provider.
 * @param id - The pool id.
 * @param directoryAddress - Fuse Directory address.
 * @returns - Object with following properties: name: string, creator: address, comptroller: address, blockPosted: bn, timestampPosted: bn.
 */
export function getPool() {
    return __awaiter(this, void 0, void 0, function* () {
        const fusePoolDirectoryInterface = new Interface([
            'function pools(uint256) view returns (string name, address creator, address comptroller, uint256 blockPosted, uint256 timestampPosted)'
        ]);
        const fusePoolDirectoryContract = new Contract(this.addresses.FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS, fusePoolDirectoryInterface, this._provider);
        const poolInformation = yield fusePoolDirectoryContract.callStatic.pools(this.poolId);
        const parsedPoolInformation = filterOnlyObjectProperties(poolInformation);
        return parsedPoolInformation;
    });
}
//# sourceMappingURL=get-pool.js.map
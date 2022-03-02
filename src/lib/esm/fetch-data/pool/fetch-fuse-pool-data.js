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
// Functions
import { filterPoolName } from "../utils/filterPoolName";
/**
 * @returns - General pool data of given pool.
 */
export function fetchFusePoolData() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Get Pool info from lens.
        const { comptroller, name: _unfiliteredName, } = yield this.getPool(this._provider, this.poolId, this.addresses.FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS);
        // Remove any profanity from the pool name
        let name = filterPoolName(_unfiliteredName);
        // This is the only thing that should be continiously updated. 
        // To avoid unnecessary calls to the lens, these shouldnt be together, at least not if the App is constantly updating.
        // Its better to use them separetly.
        // // x. Get all pool assets with their data.
        // let {
        //     assets,
        //     totalLiquidityUSD,
        //     totalSuppliedUSD,
        //     totalBorrowedUSD,
        //     totalSupplyBalanceUSD,
        //     totalBorrowBalanceUSD
        // } = await this.getPoolAssetsWithData(
        //     this._provider, 
        //     this.addresses.FUSE_POOL_LENS_CONTRACT_ADDRESS, 
        //     comptroller,
        //     this._userAddress
        // )
        // 2. Create comptroller contract.
        const comptrollerInterface = new Interface([
            'function oracle() returns (address)',
            'function admin() returns (address)',
        ]);
        const comptrollerContract = new Contract(comptroller, comptrollerInterface, this._provider);
        // 3. Get Oracle and oracle model.
        let oracle = yield comptrollerContract.callStatic.oracle();
        let oracleModel = yield this.identifyPriceOracle(oracle);
        // 4. Get pool's admin address.
        const admin = yield comptrollerContract.callStatic.admin();
        return {
            comptroller,
            name,
            oracle,
            oracleModel,
            admin,
        };
    });
}
;

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { keccak256 } from '@ethersproject/keccak256';
/**
 * @param oracleAddress - Oracle address to use.
 * @returns - The oracle model.
 */
export const identifyPriceOracle = function (oracleAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get price oracle contract name from runtime bytecode hash
        const runtimeBytecodeHash = keccak256(yield this._provider.getCode(oracleAddress));
        for (const model of Object.keys(this.oracleHashes)) {
            if (runtimeBytecodeHash ===
                this.oracleHashes[model])
                return model;
        }
        return null;
    });
};

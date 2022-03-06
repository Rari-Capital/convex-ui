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
import { keccak256 } from "@ethersproject/keccak256";
// IRMS
import DAIInterestRateModelV2 from '../../irm/DAIInterestRateModelV2';
import JumpRateModel from '../../irm/JumpRateModel';
import JumpRateModelV2 from '../../irm/JumpRateModelV2';
import WhitePaperInterestRateModel from "../../irm/WhitePaperInterestRateModel";
export const getInterestRateModel = function (assetAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const cTokenInterface = new Interface([
            "function interestRateModel() view returns (address)"
        ]);
        // Get interest rate model address from asset address
        const assetContract = new Contract(assetAddress, cTokenInterface, this._provider);
        // Get IRM address
        const interestRateModelAddress = yield assetContract.callStatic.interestRateModel();
        //  Identify IRM
        const interestRateModels = {
            JumpRateModel: JumpRateModel,
            JumpRateModelV2: JumpRateModelV2,
            DAIInterestRateModelV2: DAIInterestRateModelV2,
            WhitePaperInterestRateModel: WhitePaperInterestRateModel,
        };
        const runtimeBytecodeHash = keccak256(yield this._provider.getCode(interestRateModelAddress));
        let irm;
        outerLoop: for (const model of Object.keys(interestRateModels)) {
            if (interestRateModels[model].RUNTIME_BYTECODE_HASHES !== undefined) {
                for (const hash of interestRateModels[model]
                    .RUNTIME_BYTECODE_HASHES) {
                    if (runtimeBytecodeHash === hash) {
                        irm = new interestRateModels[model]();
                        break outerLoop;
                    }
                }
            }
            else if (runtimeBytecodeHash ===
                interestRateModels[model].RUNTIME_BYTECODE_HASH) {
                irm = new interestRateModels[model]();
                break;
            }
        }
        console.log(irm);
        yield irm.init(interestRateModelAddress, assetAddress, this._provider);
        return irm;
    });
};

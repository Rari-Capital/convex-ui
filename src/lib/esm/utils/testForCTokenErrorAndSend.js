var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ComptrollerErrorCodes, CTokenErrorCodes } from "../types";
export function testForCTokenErrorAndSend(txObjectStaticCall, // for static calls
txArgs, txObject, // actual method
failMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield txObjectStaticCall(txArgs);
        // For some reason `response` will be `["0"]` if no error but otherwise it will return a string of a number.
        if (response.toString() !== "0") {
            response = parseInt(response);
            let err;
            if (response >= 1000) {
                const comptrollerResponse = response - 1000;
                let msg = ComptrollerErrorCodes[comptrollerResponse];
                if (msg === "BORROW_BELOW_MIN") {
                    msg =
                        "As part of our guarded launch, you cannot borrow less than 1 ETH worth of tokens at the moment.";
                }
                // This is a comptroller error:
                err = new Error(failMessage + " Comptroller Error: " + msg);
            }
            else {
                // This is a standard token error:
                err = new Error(failMessage + " CToken Code: " + CTokenErrorCodes[response]);
            }
            //   LogRocket.captureException(err);
            throw err;
        }
        return yield txObject(txArgs);
    });
}

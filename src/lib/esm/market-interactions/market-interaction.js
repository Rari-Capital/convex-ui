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
import { parseEther, parseUnits } from "@ethersproject/units";
// Fuse SDK
import { testForCTokenErrorAndSend } from "./utils/testForCTokenErrorAndSend";
import { getDecimals } from "../fetch-data/misc/getDecimals";
/**
 * @param action - Type of action to perform. i.e borrow, withdraw, repay.
 * @param cTokenAddress - Address of market to withdraw from.
 * @param amount - The amount to withdraw.
 * @param provider - An initiated ethers provider.
 * @param tokenAddress - Address of the market's underlying asset.
 * @param decimals - Underlying token's decimals. i.e DAI = 18.
 */
export function marketInteraction(action, cTokenAddress, amount, tokenAddress, decimals) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Initiate market/ctoken contract.
        const cTokenInterface = new Interface([
            'function redeemUnderlying(uint redeemAmount) external returns (uint)',
            'function borrow(uint borrowAmount) returns (uint)',
            'function repayBorrow(uint repayAmount) returns (uint)',
            'function repayBorrow() payable',
            'function mint() payable',
            'function mint(uint mintAmount) returns (uint)'
        ]);
        const cTokenContract = new Contract(cTokenAddress, cTokenInterface, this._provider.getSigner());
        const isEth = tokenAddress === "0";
        // 2. Parse given amount to the underlying asset's notation.
        // Fetch decimals if not given.
        if (!decimals && !isEth) {
            decimals = yield getDecimals(tokenAddress, this._provider);
        }
        // 3. Parse given amount.
        const parsedAmount = decimals === 18 || isEth
            ? parseEther(amount)
            : parseUnits(amount, decimals);
        // 4. Perform action.
        switch (action) {
            case 'withdraw':
                yield testForCTokenErrorAndSend(cTokenContract.callStatic.redeemUnderlying, parsedAmount, cTokenContract.redeemUnderlying, "Cannot withdraw this amount right now!");
                break;
            case 'borrow':
                yield testForCTokenErrorAndSend(cTokenContract.callStatic['borrow(uint256)'], parsedAmount, cTokenContract['borrow(uint256)'], "Cannot borrow this amount right now!");
                break;
            case 'repay':
                if (!isEth) {
                    yield testForCTokenErrorAndSend(cTokenContract.callStatic['repayBorrow(uint256)'], parsedAmount, cTokenContract['repayBorrow(uint256)'], "Cannot repay this amount right now!");
                }
                else {
                    yield cTokenContract['repayBorrow()']({
                        value: parsedAmount,
                    });
                }
                break;
            case 'supply':
                if (!isEth) {
                    yield testForCTokenErrorAndSend(cTokenContract.callStatic['mint(uint256)'], parsedAmount, cTokenContract['mint(uint256)'], "Cannot deposit this amount right now!");
                }
                else {
                    yield cTokenContract['mint()']({
                        value: parsedAmount
                    });
                }
                break;
            default:
                break;
        }
    });
}
//# sourceMappingURL=market-interaction.js.map
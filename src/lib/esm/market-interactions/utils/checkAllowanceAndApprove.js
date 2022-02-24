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
import { One } from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { Interface } from '@ethersproject/abi';
/**
 * @param userAddress - Address of user to check allowance for.
 * @param marketAddress - Market/ctoken to give approval to.
 * @param underlyingAddress - The token to approve.
 * @param amount - Amount user is supplying.
 * @param provider - An initiated ethers provider.
 */
export function checkAllowanceAndApprove(userAddress, marketAddress, underlyingAddress, amount, provider) {
    return __awaiter(this, void 0, void 0, function* () {
        const erc20Interface = new Interface([
            'function allowance(address owner, address spender) public view returns (uint256 remaining)',
            'function approve(address spender, uint256 value) public returns (bool success)',
        ]);
        const erc20Contract = new Contract(underlyingAddress, erc20Interface, provider.getSigner(userAddress));
        const hasApprovedEnough = (yield erc20Contract.callStatic.allowance(userAddress, marketAddress)).gte(amount);
        if (!hasApprovedEnough) {
            const max = BigNumber.from(2).pow(BigNumber.from(256)).sub(One); //big fucking #
            yield erc20Contract.approve(marketAddress, max);
        }
    });
}
//# sourceMappingURL=checkAllowanceAndApprove.js.map
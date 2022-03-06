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
import { WeiPerEther } from '@ethersproject/constants';
import { Contract } from "@ethersproject/contracts";
export function fetchTokenBalance(tokenAddress, address) {
    return __awaiter(this, void 0, void 0, function* () {
        let balance;
        // if (chainId !== 1) return constants.Zero;
        if (!tokenAddress)
            return 0;
        if (!address || address === "0x0000000000000000000000000000000000000000") {
            balance = "0";
        }
        else if (tokenAddress === "0x0000000000000000000000000000000000000000" ||
            tokenAddress === "NO_ADDRESS_HERE_USE_WETH_FOR_ADDRESS") {
            balance = yield this._provider.getBalance(address);
        }
        else {
            const ERC20Interface = new Interface([
                'function balanceOf(address) view returns (uint)'
            ]);
            const contract = new Contract(tokenAddress, ERC20Interface, this._provider);
            balance = yield contract.callStatic.balanceOf(address);
        }
        console.log(balance)
        const parsedBalance = parseFloat(balance.div(WeiPerEther).toString());
        return parsedBalance;
    });
}
;

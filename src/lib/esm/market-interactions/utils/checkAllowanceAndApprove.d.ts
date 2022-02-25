import { BigNumber } from '@ethersproject/bignumber';
import { Web3Provider, JsonRpcProvider } from '@ethersproject/providers';
/**
 * @param userAddress - Address of user to check allowance for.
 * @param marketAddress - Market/ctoken to give approval to.
 * @param underlyingAddress - The token to approve.
 * @param amount - Amount user is supplying.
 * @param provider - An initiated ethers provider.
 */
export declare function checkAllowanceAndApprove(userAddress: string, marketAddress: string, underlyingAddress: string, amount: BigNumber, provider: Web3Provider | JsonRpcProvider): Promise<void>;

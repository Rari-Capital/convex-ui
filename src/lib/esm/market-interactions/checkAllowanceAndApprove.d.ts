/**
 * @param userAddress - Address of user to check allowance for.
 * @param marketAddress - Market/ctoken to give approval to.
 * @param underlyingAddress - The token to approve.
 * @param amount - Amount user is supplying.
 * @param provider - An initiated ethers provider.
 */
export declare function checkAllowanceAndApprove(userAddress: string, marketAddress: string, underlyingAddress: string, decimals: number, amount: string, signer: any): Promise<void>;

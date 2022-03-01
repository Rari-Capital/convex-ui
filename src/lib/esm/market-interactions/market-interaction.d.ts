/**
 * @param action - Type of action to perform. i.e borrow, withdraw, repay.
 * @param cTokenAddress - Address of market to withdraw from.
 * @param amount - The amount to withdraw.
 * @param provider - An initiated ethers provider.
 * @param tokenAddress - Address of the market's underlying asset.
 * @param decimals - Underlying token's decimals. i.e DAI = 18.
 */
export declare function marketInteraction(action: marketInteractionType, cTokenAddress: string, amount: string, tokenAddress: string, decimals?: number): Promise<void>;
declare type marketInteractionType = "withdraw" | "borrow" | "repay" | "supply";
export {};

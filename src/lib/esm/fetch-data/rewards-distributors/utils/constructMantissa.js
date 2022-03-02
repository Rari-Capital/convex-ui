/**
 * @param rewardSpeed - Speed at which reward is distributed.
 * @param rewardEthPrice - Price of the rewarded token denominated in ETH.
 * @param underlyingTotalSupply - The market's underlying token's total supply.
 * @param underlyingEthPrice - Price of the underlying asset in the market.
 * @param rewardDecimals - Decimals of the rewarded token.
 * @param underlyingDecimals - Decimals of the market's underlying asset.
 * @returns - The Mantissa used to get apy/apr.
 */
export const constructMantissa = (rewardSpeed, rewardEthPrice, underlyingTotalSupply, underlyingEthPrice, rewardDecimals = 18, underlyingDecimals = 18) => {
    const newRewardETHPerBlock = rewardEthPrice * (rewardSpeed / 10 ** rewardDecimals);
    const newUnderlyingTotalSupplyETH = underlyingEthPrice * (underlyingTotalSupply / 10 ** underlyingDecimals);
    const newMantissa = (newRewardETHPerBlock * 1e18) / newUnderlyingTotalSupplyETH;
    return newMantissa;
};

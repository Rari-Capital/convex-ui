import { USDPricedFuseAsset } from "lib/esm/types";
import { BigNumber, constants } from "ethers";

/**
 * @param assets - An array of all assets in the pool.
 * @param options - ??
 * @returns - The users borrow limit as BigNumber.
 */
export const getBorrowLimit = (
  assets: USDPricedFuseAsset[],
  options?: { ignoreIsEnabledCheckFor?: string }
): BigNumber => {
  let _maxBorrow = constants.Zero;

  for (let i = 0; i < assets.length; i++) {
    let asset = assets[i];
    if (options?.ignoreIsEnabledCheckFor === asset.cToken || asset.membership) {
      _maxBorrow = _maxBorrow.add(
        asset.supplyBalanceUSD.mul(asset.collateralFactor)
      );
    }
  }

  return _maxBorrow.eq(0) ? _maxBorrow : _maxBorrow.div(constants.WeiPerEther);
};

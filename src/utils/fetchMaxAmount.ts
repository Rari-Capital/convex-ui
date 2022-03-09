// Ethers
import { ActionType } from "components/pages/Pool";
import { constants } from "ethers";

// Types
import { PoolInstance, USDPricedFuseAsset } from "lib/esm/types";

export async function fetchMaxAmount(
  mode: ActionType,
  pool: PoolInstance,
  address: string,
  asset: USDPricedFuseAsset
) {
  if (mode === ActionType.SUPPLY) {
    const balance = asset.underlyingBalance

    return balance;
  }

  if (mode === ActionType.REPAY) {
    const balance = asset.underlyingBalance

    const borrowBalance = asset.borrowBalance
      .div(constants.WeiPerEther)

    if (borrowBalance.lt(balance)) {
      return asset.borrowBalance
    } else {
      return balance;
    }
  }

  if (mode === ActionType.BORROW) {
    if (!asset.membership) return constants.Zero;
    try {
      const maxBorrow =
        await pool.contracts.secondaryFuseLens.callStatic.getMaxBorrow(
          address,
          asset.cToken
        );

      return maxBorrow
    } catch (err) {
      throw new Error("Could not fetch your max borrow amount! Code: " + err);
    }
  }

  if (mode === ActionType.WITHDRAW) {
    try {
      const maxRedeem =
        await pool.contracts.secondaryFuseLens.callStatic.getMaxRedeem(
          address,
          asset.cToken
        );

      return maxRedeem
    } catch (err) {
      throw new Error("Could not fetch your max borrow amount! Code: " + err);
    }
  }
}

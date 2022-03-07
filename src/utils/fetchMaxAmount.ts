// Ethers
import { ActionType } from "components/pages/Pool";
import { constants } from "ethers";

// Types
import { PoolInstance, USDPricedFuseAsset } from "lib/esm/types";


export async function fetchMaxAmount(
    mode: ActionType,
    pool: PoolInstance,
    address: string,
    asset: USDPricedFuseAsset,
  ) {

    if (mode === ActionType.supply) {
      const balance = await pool.fetchTokenBalance(
        asset.underlyingToken,
        address
      );
  
      return balance;
    }
  
    if (mode === ActionType.repay) {
      const balance = await pool.fetchTokenBalance(
        asset.underlyingToken,
        address
      );

      const borrowBalance = asset.borrowBalance.div(constants.WeiPerEther).toNumber()
  
      if (borrowBalance < balance) {
        return asset.borrowBalance.div(constants.WeiPerEther).toString();
      } else {
        return balance;
      }
    }
  
    if (mode === ActionType.borrow) {
      if (!asset.membership) return constants.Zero
      try {
        const maxBorrow =
          await pool.contracts.secondaryFuseLens.callStatic.getMaxBorrow(
            address,
            asset.cToken
          );
  
        return maxBorrow.div(constants.WeiPerEther).toString()
      } catch (err) {
        throw new Error("Could not fetch your max borrow amount! Code: " + err);
      }
    }
  
    if (mode === ActionType.withdraw) {
      try {
        const maxRedeem =
          await pool.contracts.secondaryFuseLens.callStatic.getMaxRedeem(
            address,
            asset.cToken
          );

  
        return maxRedeem.div(constants.WeiPerEther).toString();
      } catch (err) {
        throw new Error("Could not fetch your max borrow amount! Code: " + err);
      }
    }
}
  
// Ethers
import { BigNumber } from "@ethersproject/bignumber";
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

    console.log({pool})
  
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
      const debt = BigNumber.from(asset.borrowBalance);
  
      if (balance.gt(debt)) {
        return debt;
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
  
        const amount = maxBorrow.mul(3).div(4);
  
        return amount.div(1);
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
  
        return maxRedeem;
      } catch (err) {
        throw new Error("Could not fetch your max borrow amount! Code: " + err);
      }
    }
}
  
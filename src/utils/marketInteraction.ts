import { PoolInstance, USDPricedFuseAsset } from "lib/esm/types"

export const marketInteraction = async (
    amount: string,
    pool: PoolInstance,
    market: USDPricedFuseAsset,
    type: "supply" | "borrow" | "withdraw" | "repay"
) => {
    if (amount === "") return

    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

    switch (type) {
      case "supply":

          await pool?.checkAllowanceAndApprove(
            address,
            market.cToken,
            market.underlyingToken,
            amount,
            market.underlyingDecimals,
          )

          
          await pool?.marketInteraction(
            'supply',
            market.cToken,
            amount,
            market.underlyingToken,
            market.underlyingDecimals,
          )
        break;

      case "borrow":
        await pool?.marketInteraction(
          'borrow',
          market.cToken,
          amount,
          market.underlyingToken,
          market.underlyingDecimals,
        )
        break;
    
      default:
        break;
    }
  }
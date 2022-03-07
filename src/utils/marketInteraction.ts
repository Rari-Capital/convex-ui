import { ActionType } from "components/pages/Pool";
import { usePoolContext } from "context/PoolContext";
import { PoolInstance, USDPricedFuseAsset } from "lib/esm/types";

export const marketInteraction = async (
  amount: string,
  pool: PoolInstance,
  market: USDPricedFuseAsset,
  action: ActionType,
  comptroller: string,
  enterMarket: boolean
) => {
  if (amount === "") return;

  const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  switch (action) {
    case  ActionType.supply:

      if (enterMarket) {
        await pool?.collateral(
          comptroller,
          [market.cToken],
          "enter"
        )
      }

      await pool?.checkAllowanceAndApprove(
        address,
        market.cToken,
        market.underlyingToken,
        amount,
        market.underlyingDecimals
      );

      await pool?.marketInteraction(
        "supply",
        market.cToken,
        amount,
        market.underlyingToken,
        market.underlyingDecimals
      );
      break;

    case ActionType.borrow:
      await pool?.marketInteraction(
        "borrow",
        market.cToken,
        amount,
        market.underlyingToken,
        market.underlyingDecimals
      );
      break;

    case ActionType.repay:
      await pool?.marketInteraction(
        "repay",
        market.cToken,
        amount,
        market.underlyingToken,
        market.underlyingDecimals
      );
      break;

    case ActionType.withdraw:
      await pool?.marketInteraction(
        "withdraw",
        market.cToken,
        amount,
        market.underlyingToken,
        market.underlyingDecimals
      );
      break;

    default:
      break;
  }
};

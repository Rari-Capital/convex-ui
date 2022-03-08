import { ActionType } from "components/pages/Pool";
import { usePoolContext } from "context/PoolContext";
import { PoolInstance, USDPricedFuseAsset } from "lib/esm/types";
import { Dispatch, SetStateAction } from "react";
import { QueryClient } from "react-query";

export const marketInteraction = async (
  amount: string,
  pool: PoolInstance | undefined,
  market: USDPricedFuseAsset,
  action: ActionType,
  increaseActiveStep: (step: string) => void,
  comptroller: string | undefined,
  enterMarket: boolean,
  address: string
) => {
  if (amount === "" || !pool || !comptroller) return;

  switch (action) {
    case  ActionType.supply:
      console.log("hello")

      if (enterMarket) {
        increaseActiveStep("Approving market")
        await pool?.collateral(
          comptroller,
          [market.cToken],
          "enter"
        )

        increaseActiveStep("Approving Asset")
        await pool?.checkAllowanceAndApprove(
          address,
          market.cToken,
          market.underlyingToken,
          amount,
          market.underlyingDecimals
        );
      }

      increaseActiveStep("Supplying")
      await pool?.marketInteraction(
        "supply",
        market.cToken,
        amount,
        market.underlyingToken,
        market.underlyingDecimals
      );
      increaseActiveStep("Done")
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

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
  increaseActiveStep: (step: number) => void,
  comptroller: string | undefined,
  enterMarket: boolean,
  address: string,
  shouldApprove: boolean = true
) => {
  if (amount === "" || !pool || !comptroller) return;
  // const parsedAmount =

  switch (action) {
    case ActionType.SUPPLY:

      if (shouldApprove) {
        increaseActiveStep(0);
        await pool?.checkAllowanceAndApprove(
          address,
          market.cToken,
          market.underlyingToken,
          amount,
          market.underlyingDecimals
        );
      }

      if (enterMarket) {
        increaseActiveStep(1);
        await pool?.collateral(comptroller, [market.cToken], "enter");
      }

      increaseActiveStep(2);
      await pool?.marketInteraction(
        "supply",
        market.cToken,
        amount,
        market.underlyingToken,
        market.underlyingDecimals
      );
      increaseActiveStep(3);
      break;

    case ActionType.BORROW:
      increaseActiveStep(0)
      await pool?.marketInteraction(
        "borrow",
        market.cToken,
        amount,
        market.underlyingToken,
        market.underlyingDecimals
      );
      increaseActiveStep(1)
      break;

    case ActionType.REPAY:
      increaseActiveStep(0)
      await pool?.marketInteraction(
        "repay",
        market.cToken,
        amount,
        market.underlyingToken,
        market.underlyingDecimals
      );
      increaseActiveStep(1)
      break;

    case ActionType.WITHDRAW:
      increaseActiveStep(0)
      await pool?.marketInteraction(
        "withdraw",
        market.cToken,
        amount,
        market.underlyingToken,
        market.underlyingDecimals
      );
      increaseActiveStep(1)
      break;

    default:
      break;
  }
};

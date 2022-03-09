import { constants } from "ethers";
import { MarketsWithData, USDPricedFuseAsset } from "lib/esm/types";
import { useQuery } from "react-query";
import { getBorrowLimit } from "./getBorrowLimit";

/**
 * @param marketsDynamicData - Response from the lens.
 * @returns - The user's health (0-100% where the closer to 100 the closer to liquidation), and the borrow limit.
 */
const useUserHealth = (marketsDynamicData: MarketsWithData | undefined) => {
  const { data: borrowLimit } = useQuery(
    "User's borrow limit and health",
    () => {
      if (!marketsDynamicData) return;

      const borrowLimitBN = getBorrowLimit(marketsDynamicData.assets);
      const healthBN = borrowLimitBN.eq(0)
        ? constants.Zero
        : marketsDynamicData.totalBorrowBalanceUSD.mul(100).div(borrowLimitBN);

      const userHealth = parseFloat(healthBN.toString());
      const borrowLimit = parseFloat(borrowLimitBN.toString());

      return { userHealth, borrowLimit, borrowLimitBN };
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: true,
      enabled: marketsDynamicData ? true : false,
    }
  );

  return {
    userHealth: borrowLimit?.userHealth ?? 0,
    borrowLimit: borrowLimit?.borrowLimit ?? 0,
    borrowLimitBN: borrowLimit?.borrowLimitBN ?? constants.Zero,
  };
};

/**
 * @param marketsDynamicData - Response from the lens.
 * @returns - The user's health (0-100% where the closer to 100 the closer to liquidation), and the borrow limit.
 */
export const useBorrowLimit = (assets: USDPricedFuseAsset[]) => {
  const { data: borrowLimit } = useQuery(
    "User's borrow limit and health for assets " + assets.map(a => a.cToken).join(', '),
    () => {
      if (!assets.length) return;

      const borrowLimitBN = getBorrowLimit(assets);
      const { totalBorrowBalanceUSD } = calculateUpdatedPoolData(assets)
      const healthBN = borrowLimitBN.eq(0)
        ? constants.Zero
        : totalBorrowBalanceUSD.mul(100).div(borrowLimitBN);

      const userHealth = parseFloat(healthBN.toString());
      const borrowLimit = parseFloat(borrowLimitBN.toString());

      return { userHealth, borrowLimit, borrowLimitBN };
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: true,
      enabled: !!assets.length ? true : false,
    }
  );

  return {
    userHealth: borrowLimit?.userHealth ?? 0,
    borrowLimit: borrowLimit?.borrowLimit ?? 0,
    borrowLimitBN: borrowLimit?.borrowLimitBN ?? constants.Zero,
  };
};

export const calculateUpdatedPoolData = (markets: USDPricedFuseAsset[]) => {
  let marketsWithData = {
    markets,
    totalLiquidityUSD: constants.Zero,
    totalSupplyBalanceUSD: constants.Zero,
    totalBorrowBalanceUSD: constants.Zero,
    totalSuppliedUSD: constants.Zero,
    totalBorrowedUSD: constants.Zero

  }

  for (const market of markets) {
    marketsWithData.totalLiquidityUSD = marketsWithData.totalLiquidityUSD.add(market.liquidityUSD)
    marketsWithData.totalSupplyBalanceUSD = marketsWithData.totalSupplyBalanceUSD.add(market.supplyBalanceUSD)
    marketsWithData.totalBorrowBalanceUSD = marketsWithData.totalBorrowBalanceUSD.add(market.borrowBalanceUSD)
    marketsWithData.totalSuppliedUSD = marketsWithData.totalSuppliedUSD.add(market.totalSupplyUSD)
    marketsWithData.totalBorrowedUSD = marketsWithData.totalBorrowedUSD.add(market.totalBorrowUSD)
  }
  return marketsWithData
}

export default useUserHealth;

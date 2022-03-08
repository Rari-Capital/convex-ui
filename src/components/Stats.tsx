import { useMemo } from "react";
import { MarketsWithData, USDPricedFuseAsset } from "lib/esm/types";
import { utils, constants, BigNumber } from "ethers";
import { usePoolContext } from "context/PoolContext";
import { useUpdatedUserAssets } from "hooks/useUpdatedUserAssets";
import {
  convertMantissaToAPR,
  convertMantissaToAPY,
  smallUsdFormatter,
  smallStringUsdFormatter,
} from "utils/formatters";
import { getBorrowLimit } from "hooks/getBorrowLimit";
import { StatisticTable } from "rari-components";
import { ActionType } from "./pages/Pool";
import { Center, Spinner } from "@chakra-ui/react";

export const Stats = ({
  marketData,
  action,
  amount,
  markets,
  index,
  enterMarket,
}: {
  marketData: USDPricedFuseAsset;
  action: ActionType;
  amount: string;
  markets: USDPricedFuseAsset[];
  index: number;
  enterMarket: boolean;
}) => {
  const parsedAmount = utils.parseUnits(amount, marketData.underlyingDecimals);
  const { borrowLimit, marketsDynamicData, borrowLimitBN } = usePoolContext();

  const updatedMarkets = useUpdatedUserAssets({
    action,
    assets: markets,
    index,
    amount: parsedAmount,
  });

  const updatedMarket = updatedMarkets ? updatedMarkets[index] : null;

  const stats: [title: string, value: string][] = getStats(
    action,
    updatedMarket,
    marketData,
    marketsDynamicData,
    updatedMarkets,
    borrowLimit,
    borrowLimitBN,
    enterMarket
  );

  if (stats.length == 0) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <StatisticTable
      border="none"
      statistics={stats}
    />
  );
};

const getStats = (
  action: ActionType,
  updatedMarket: USDPricedFuseAsset | null,
  marketData: USDPricedFuseAsset,
  marketsDynamicData: MarketsWithData | undefined,
  updatedMarkets: USDPricedFuseAsset[] | undefined,
  borrowLimit: number | undefined,
  borrowLimitBN: BigNumber | undefined,
  enterMarket: boolean
) => {
  if (
    !updatedMarket ||
    !marketsDynamicData ||
    typeof borrowLimit === "undefined" ||
    !borrowLimitBN ||
    !updatedMarkets
  )
    return [];

  let _stats: [title: string, value: string][] = [];

  if (action === ActionType.supply || action === ActionType.withdraw) {
    const textOne = `${smallUsdFormatter(
      marketData.supplyBalanceUSD.toString()
    )}
                → ${smallStringUsdFormatter(
                  updatedMarket.supplyBalanceUSD.toString()
                )}`;

    const newBorrow = getBorrowLimit(updatedMarkets, {
      ignoreIsEnabledCheckFor: enterMarket ? marketData.cToken : undefined,
    });

    const textTwo = `${smallUsdFormatter(
      borrowLimit ?? 0
    )} → ${smallUsdFormatter(newBorrow.toString())}`;

    const supplyAPY = convertMantissaToAPY(
      marketData.supplyRatePerBlock,
      365
    ).toFixed(2);

    const updatedSupplyAPY = convertMantissaToAPY(
      updatedMarket.supplyRatePerBlock,
      365
    ).toFixed(2);

    const textThree = `${supplyAPY}% → ${updatedSupplyAPY}%`;

    _stats = [
      ["Supply Balance", textOne],
      ["Borrow Limit", textTwo],
      ["Supply APY", textThree],
    ];
  }

  if (action === ActionType.borrow || action === ActionType.repay) {
    const textOne = `${smallStringUsdFormatter(
      marketData.borrowBalanceUSD.toString()
    )} 
                → ${smallStringUsdFormatter(
                  updatedMarket.borrowBalanceUSD.toString()
                )}`;

    const borrowAPR = convertMantissaToAPR(
      marketData.borrowRatePerBlock
    ).toFixed(2);

    const updatedBorrowAPR = convertMantissaToAPR(
      updatedMarket.borrowRatePerBlock ?? 0
    ).toFixed(2);

    const textThree = `${borrowAPR}% → ${updatedBorrowAPR}%`;

    _stats = [
      ["Borrow Balance", textOne],
      ["Borrow Limit", smallUsdFormatter(borrowLimit ?? 0)],
      ["Borrow APY", textThree],
    ];
  }

  return _stats;
};

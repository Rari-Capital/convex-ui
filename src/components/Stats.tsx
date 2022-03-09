import { useMemo } from "react";
import { MarketsWithData, TokenData, USDPricedFuseAsset } from "lib/esm/types";
import { utils, constants, BigNumber } from "ethers";
import { usePoolContext } from "context/PoolContext";
import { useUpdatedUserAssets } from "hooks/useUpdatedUserAssets";
import {
  convertMantissaToAPR,
  convertMantissaToAPY,
  smallUsdFormatter,
  smallStringUsdFormatter,
  formatBNToFixed,
} from "utils/formatters";
import { getBorrowLimit } from "hooks/getBorrowLimit";
import { StatisticTable } from "rari-components";
import { ActionType } from "./pages/Pool";
import { Center, Spinner } from "@chakra-ui/react";
import { useBorrowLimit } from "hooks/useUserHealth";

export const Stats = ({
  marketData,
  action,
  amount,
  markets,
  index,
  tokenData
}: {
  marketData: USDPricedFuseAsset;
  action: ActionType;
  amount: string;
  markets: USDPricedFuseAsset[];
  index: number;
  tokenData: TokenData
}) => {
  const parsedAmount = marketData.underlyingDecimals.eq(18) ? utils.parseEther(amount) : utils.parseUnits(amount, marketData.underlyingDecimals);
  const { borrowLimit, marketsDynamicData, borrowLimitBN, userHealth } = usePoolContext();

  const updatedMarkets = useUpdatedUserAssets({
    action,
    assets: markets,
    index,
    amount: parsedAmount,
  });

  const updatedMarket = updatedMarkets ? updatedMarkets[index] : null;

  const updatedBorrowLimit = useBorrowLimit(updatedMarkets ?? [])

  const stats: [title: string, value: string][] = getStats(
    action,
    updatedMarket,
    marketData,
    marketsDynamicData,
    updatedMarkets,
    borrowLimit,
    borrowLimitBN,
    tokenData,
    userHealth ?? 0,
    updatedBorrowLimit.userHealth
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
      variant="light"
      backgroundColor="white"
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
  tokenData: TokenData,
  userHealth: number,
  updatedUserHealth: number
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

  if (action === ActionType.SUPPLY || action === ActionType.WITHDRAW) {

    const textOne = `${formatBNToFixed(marketData.supplyBalance, marketData.underlyingDecimals)} ${tokenData?.symbol ?? marketData.underlyingSymbol}
                → ${formatBNToFixed(updatedMarket.supplyBalance, updatedMarket.underlyingDecimals)} ${tokenData?.symbol ?? marketData.underlyingSymbol} `;

    const newBorrow = getBorrowLimit(updatedMarkets, {
      ignoreIsEnabledCheckFor: marketData.cToken
    });

    const textTwo = `${smallUsdFormatter(
      borrowLimit ?? 0
    )
      } → ${smallUsdFormatter(newBorrow.toString())} `;

    const supplyAPY = convertMantissaToAPY(
      marketData.supplyRatePerBlock,
      365
    ).toFixed(2);

    const updatedSupplyAPY = convertMantissaToAPY(
      updatedMarket.supplyRatePerBlock,
      365
    ).toFixed(2);

    const textThree = `${supplyAPY}% → ${updatedSupplyAPY}% `;

    _stats = [
      ["Supply Balance", textOne],
      ["Borrow Limit", textTwo],
      ["Supply APY", textThree],
    ];
  }

  if (action === ActionType.BORROW || action === ActionType.REPAY) {

    const textOne = `${formatBNToFixed(marketData.borrowBalance, marketData.underlyingDecimals)} ${tokenData?.symbol ?? marketData.underlyingSymbol}
→ ${formatBNToFixed(updatedMarket.borrowBalance, updatedMarket.underlyingDecimals)} ${tokenData?.symbol ?? marketData.underlyingSymbol} `;

    const textTwo = `${userHealth}% → ${updatedUserHealth}%`

    const borrowAPR = convertMantissaToAPR(
      marketData.borrowRatePerBlock
    ).toFixed(2);

    const updatedBorrowAPR = convertMantissaToAPR(
      updatedMarket.borrowRatePerBlock ?? 0
    ).toFixed(2);

    const textThree = `${borrowAPR}% → ${updatedBorrowAPR}% `;

    _stats = [
      ["Borrow Balance", textOne],
      ["Health", textTwo],
      ["Borrow APY", textThree],
    ];
  }

  return _stats;
};

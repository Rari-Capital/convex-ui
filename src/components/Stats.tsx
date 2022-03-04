import { useMemo } from "react"
import { MarketsWithData, USDPricedFuseAsset } from "lib/esm/types"
import { utils, constants } from "ethers"
import { usePoolContext } from "context/PoolContext"
import { useUpdatedUserAssets } from "hooks/useUpdatedUserAssets"
import { convertMantissaToAPR, convertMantissaToAPY, smallUsdFormatter, smallStringUsdFormatter } from "utils/formatters"
import { getBorrowLimit } from "hooks/getBorrowLimit"
import { StatisticTable } from "rari-components"

export const Stats = ({ 
    isBorrowing,
    marketData,
    type,
    amount,
    markets,
    index
  } : { 
    isBorrowing: boolean, 
    marketData: USDPricedFuseAsset,
    type: "supply" | "borrow" | "withdraw" | "repay",
    amount: string,
    markets: USDPricedFuseAsset[],
    index: number
  }) => {
    const parsedAmount = marketData.underlyingDecimals.eq(18) ? utils.parseEther(amount) : utils.parseUnits(amount, marketData.underlyingDecimals)
    const { borrowLimit, marketsDynamicData } = usePoolContext()
    
    const updatedAssets = useUpdatedUserAssets({
      mode: type,
      assets: markets,
      index,
      amount: parsedAmount
    })
  
    const updatedMarket = updatedAssets ? updatedAssets[index] : null;
    const updatedBorrowLimit = getBorrowLimit(updatedAssets ?? [],{
      ignoreIsEnabledCheckFor: marketData.cToken,
    })
  
    const borrowAPR = convertMantissaToAPR(marketData.borrowRatePerBlock).toFixed(2)
    const supplyAPY = convertMantissaToAPY(
      marketData.supplyRatePerBlock,
      365
    ).toFixed(2)
  
    const updatedBorrowAPR = convertMantissaToAPR(updatedMarket?.borrowRatePerBlock ?? 0).toFixed(2)
    const updatedSupplyAPY = convertMantissaToAPY(marketData.supplyRatePerBlock,
      365).toFixed(2)
  
    
    const textTwo = getStats(
      isBorrowing,
      updatedMarket,
      marketsDynamicData
    )
    
    const textFour = isBorrowing && updatedMarket ?
      `${borrowAPR}% -> ${updatedBorrowAPR}%` : borrowAPR
  
  
    const stats: [title: string, value: string][] = useMemo(() => {
      const _stats: [title: string, value: string][] = [
      ["Borrow Balance",textTwo],
      ["Borrow Limit", smallUsdFormatter(borrowLimit ?? 0)],
      ["Borrow APY", textFour]
    ]
  
    if (!isBorrowing) _stats.unshift([
      `Supply Balance`,
      `${smallUsdFormatter( markets[index].supplyBalanceUSD.toNumber())}`
    ]) 
  
    return _stats
  
  }, [isBorrowing, markets, index, textFour, borrowLimit])
  
    return (
      <StatisticTable
        variant="light"
        statistics={stats}
    />
    )
  }


  const getStats = (
    isBorrowing: boolean,
    updatedMarket: USDPricedFuseAsset | null,
    marketsDynamicData: MarketsWithData | undefined,
    ) => {
      if (!marketsDynamicData || !updatedMarket) return ''


    const simulatedAmount = marketsDynamicData.totalBorrowBalanceUSD.add(updatedMarket.borrowBalanceUSD.div(constants.WeiPerEther))

    const textTwo = isBorrowing && updatedMarket ?
    `${smallStringUsdFormatter(marketsDynamicData.totalBorrowBalanceUSD.toString())} 
      -> ${smallStringUsdFormatter( simulatedAmount.toString()) }`
    : isBorrowing ? `${smallStringUsdFormatter( marketsDynamicData?.totalBorrowBalanceUSD.toString() ?? 0)}` : "null"

    return textTwo
  }
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
  
    const borrowAPR = convertMantissaToAPR(marketData.borrowRatePerBlock).toFixed(2)
    const supplyAPY = convertMantissaToAPY(
      marketData.supplyRatePerBlock,
      365
    ).toFixed(2)
  
    const updatedBorrowAPR = convertMantissaToAPR(updatedMarket?.borrowRatePerBlock ?? 0).toFixed(2)
    const updatedSupplyAPY = convertMantissaToAPY(marketData.supplyRatePerBlock,
      365).toFixed(2)
  
    const stats: [title: string, value: string][] = getStats(
      type,
      updatedMarket,
      marketsDynamicData,
      borrowLimit,
      borrowAPR,
      supplyAPY,
      updatedSupplyAPY,
      updatedBorrowAPR
    )
  
    return (
      <StatisticTable
        variant="light"
        statistics={stats}
    />
    )
  }

  const getStats = (
    type: "supply" | "borrow" | "withdraw" | "repay",
    updatedMarket: USDPricedFuseAsset | null,
    marketsDynamicData: MarketsWithData | undefined,
    borrowLimit: number | undefined,
    borrowAPR: string,
    supplyAPY: string,
    updatedSupplyAPY: string,
    updatedBorrowAPR: string
  ) => {
      if(!updatedMarket || !marketsDynamicData || typeof borrowLimit === "undefined") return []

      let _stats: [title: string, value: string][] = []
      if(type === "supply") {
        const simulatedSupply = marketsDynamicData.totalSupplyBalanceUSD.add(updatedMarket.supplyBalanceUSD.div(constants.WeiPerEther))
          
        const textOne = `${smallUsdFormatter(marketsDynamicData.totalSupplyBalanceUSD.toString())}
                => ${smallStringUsdFormatter(simulatedSupply.toString())}`

        const newBorrow = (
          updatedMarket.supplyBalanceUSD
          .mul(updatedMarket.collateralFactor)
        ).div(constants.WeiPerEther)
  
        const textTwo = `${smallUsdFormatter(borrowLimit ?? 0)} -> ${smallUsdFormatter(newBorrow.div(constants.WeiPerEther).toString())}`

        const textThree =  `${supplyAPY}% -> ${updatedSupplyAPY}%`
        
        _stats = [
          [ "Supply Balance", textOne ],
          [ "Borrow Limit", textTwo],
          [ "Supply APY", textThree]
        ]
      }

      
      
      if (type === "borrow") {
           const simulatedBorrow = marketsDynamicData.totalBorrowBalanceUSD.add(updatedMarket.borrowBalanceUSD.div(constants.WeiPerEther))
           
           const textOne = `${smallStringUsdFormatter(marketsDynamicData.totalBorrowBalanceUSD.toString())} 
                -> ${smallStringUsdFormatter( simulatedBorrow.toString()) }`

            const textThree = `${borrowAPR}% -> ${updatedBorrowAPR}%`

          _stats = [
          ["Borrow Balance",textOne],
          ["Borrow Limit", smallUsdFormatter(borrowLimit ?? 0)],
          ["Borrow APY", textThree]
        ]
      }

      return _stats
  }
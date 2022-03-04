import { useState, useMemo } from "react";
import { usePoolContext } from "context/PoolContext";
import { useRari } from "context/RariContext";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { constants, utils } from "ethers";
import { USDPricedFuseAsset } from "lib/esm/types";
import {
  Badge,
  Button,
  ExpandableCard,
  Heading,
  StatisticTable,
  Text,
  TokenAmountInput,
  TokenIcon,
} from "rari-components";
import { getMillions, convertMantissaToAPY, smallUsdFormatter, smallStringUsdFormatter, convertMantissaToAPR } from "utils/formatters";
import { useUpdatedUserAssets } from "hooks/useUpdatedUserAssets";
import { getBorrowLimit } from "hooks/getBorrowLimit";
import { useAuthedCallback } from "hooks/useAuthedCallback";
import { marketInteraction } from "utils/marketInteraction";

type MarketCardProps = Omit<
  React.ComponentProps<typeof ExpandableCard>,
  "expandableChildren"
> & {
  type: "supply" | "borrow";
  marketData: USDPricedFuseAsset
  markets: USDPricedFuseAsset[],
  index: number
};

const MarketCard: React.FC<MarketCardProps> = ({
  markets,
  marketData,
  index,
  type,
  ...restProps
}) => {
  const { pool } = usePoolContext()
  const { isAuthed,  }= useRari()

  const [amount, setAmount] = useState<string>("")
  const isBorrowing = type === "borrow";

  const isSupply = type === "supply"
  const APY =  convertMantissaToAPY(
    isSupply 
      ? marketData.supplyRatePerBlock 
      : marketData.borrowRatePerBlock, 365
    )

  const authedHandleClick = useAuthedCallback(
    marketInteraction,
    [
      amount,
      pool,
      marketData,
      type
    ]
  )

  return (
    <ExpandableCard
      width="100%"
      variant="light"
      inAccordion={true}
      expandableChildren={
        <VStack spacing={4} alignItems="stretch">
          <TokenAmountInput
            variant="light"
            tokenSymbol={markets[index].underlyingSymbol}
            tokenAddress={markets[index].underlyingToken}
            onChange={(e: any) => setAmount(e.target.value)}
            onClickMax={() => { }}
          />
          { amount === "" ? null :
          <Stats 
            marketData={marketData} 
            amount={amount} 
            type={type} 
            isBorrowing={isBorrowing} 
            markets={markets} 
            index={index} 
          />
          }
          <Button
            onClick={authedHandleClick}
          >
            Approve
          </Button>
        </VStack>
      }
      {...restProps}
    >
      <Flex alignItems="center" width="100%">
        <TokenIcon tokenAddress={markets[index].underlyingToken} mr={4} />
        <Flex direction="column" width="100%">
          <Flex width="auto">
            <Heading size="lg" mr={4}>
              {markets[index].underlyingSymbol}
            </Heading>
            <Box alignSelf="center">
              <Badge variant={type === "supply" ? "success" : "warning"}>
                {type}
              </Badge>
            </Box>
          </Flex>
          <MarketTLDR
            marketData={markets[index]}
            APY={APY}
            isSupply={isSupply}
          />
        </Flex>
      </Flex>
    </ExpandableCard>
  );
};

const MarketTLDR = ({
  marketData,
  isSupply,
  APY
} : {
  marketData: USDPricedFuseAsset,
  isSupply: boolean,
  APY: number
}) => {

 
  const Text1 = isSupply 
    ? `${utils.formatEther(marketData.collateralFactor.mul(100))}% LTV` 
    : `${getMillions(marketData.liquidityUSD)}M Liquidity`

  
  return (
    <Flex justifyContent="flex-start !important">
      <Text variant="secondary" alignSelf="flex-start"  mr="1.5vh">
        {Text1}
      </Text>

      &middot;

      <Text variant="secondary" mr="1.5vh" ml="1.5vh">
        {APY.toFixed(2)}% APY
      </Text>

      
      { 
      
      isSupply ? (
        <>
        &middot;
        <Text variant="secondary" ml="1.5vh">
          {getMillions(marketData.totalSupplyUSD)}M Supplied
        </Text>
        </>
      )
        : null 
      }
    </Flex>
  )
}

export default MarketCard;

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

  
  const textTwo = isBorrowing && updatedMarket ?
    `${smallStringUsdFormatter( marketsDynamicData?.totalBorrowBalanceUSD.toString() ?? 0)} -> ${smallStringUsdFormatter( marketsDynamicData?.totalBorrowBalanceUSD.add(updatedMarket?.borrowBalanceUSD ?? 0).div(constants.WeiPerEther).toString() ?? 0)}`
    : isBorrowing ? `${smallStringUsdFormatter( marketsDynamicData?.totalBorrowBalanceUSD.toString() ?? 0)}` : "null"

  
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
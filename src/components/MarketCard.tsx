import { useState } from "react";
import { usePoolContext } from "context/PoolContext";
import { useRari } from "context/RariContext";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { utils } from "ethers";
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
import { getMillions, convertMantissaToAPY, smallUsdFormatter } from "utils/formatters";

type MarketCardProps = Omit<
  React.ComponentProps<typeof ExpandableCard>,
  "expandableChildren"
> & {
  marketData: USDPricedFuseAsset;
  type: "supply" | "borrow";
};

const MarketCard: React.FC<MarketCardProps> = ({
  marketData,
  type,
  ...restProps
}) => {
  const { pool } = usePoolContext()
  const { isAuthed }= useRari()

  const [amount, setAmount] = useState<string>("")
  const isBorrowing = type === "borrow";

  const handleClick = async () => {
    if (amount === "") return

    if (!isAuthed) { 
      // This should open connect modal
      return console.log('hello')
    }

    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

    switch (type) {
      case "supply":
          await pool?.checkAllowanceAndApprove(
            address,
            marketData.cToken,
            marketData.underlyingToken,
            amount,
            marketData.underlyingDecimals,
          )

          
          await pool?.marketInteraction(
            'supply',
            marketData.cToken,
            amount,
            marketData.underlyingToken,
            marketData.underlyingDecimals,
          )
        break;

      case "borrow":
        await pool?.marketInteraction(
          'borrow',
          marketData.cToken,
          amount,
          marketData.underlyingToken,
          marketData.underlyingDecimals,
        )
        break;
    
      default:
        break;
    }
  }

  return (
    <ExpandableCard
      width="100%"
      variant="light"
      inAccordion={true}
      expandableChildren={
        <VStack spacing={4} alignItems="stretch">
          <TokenAmountInput
            variant="light"
            tokenSymbol={marketData.underlyingSymbol}
            tokenAddress={marketData.underlyingToken}
            onChange={(e: any) => setAmount(e.target.value)}
            onClickMax={() => { }}
          />
          <StatisticTable
            variant="light"
            statistics={[
              [
                `${isBorrowing ? "Borrow" : "Supply"} Balance`,
                smallUsdFormatter(
                  (isBorrowing
                    ? marketData.borrowBalanceUSD
                    : marketData.supplyBalanceUSD
                  ).toNumber()
                ),
              ],
              ["Borrow Limit", "$0"],
            ]}
          />
          <Button
            onClick={() => handleClick()}
          >
            Approve
          </Button>
        </VStack>
      }
      {...restProps}
    >
      <Flex alignItems="center" width="100%">
        <TokenIcon tokenAddress={marketData.underlyingToken} mr={4} />
        <Flex direction="column" width="100%">
          <Flex width="auto">
            <Heading size="lg" mr={4}>
              {marketData.underlyingSymbol}
            </Heading>
            <Box alignSelf="center">
              <Badge variant={type === "supply" ? "success" : "warning"}>
                {type}
              </Badge>
            </Box>
          </Flex>
          <MarketTLDR
            marketData={marketData}
            type={type}
          />
        </Flex>
      </Flex>
    </ExpandableCard>
  );
};

const MarketTLDR = ({
  marketData,
  type
} : {
  marketData: USDPricedFuseAsset,
  type: "supply" | "borrow"
}) => {

  const isSupply = type === "supply"
  const APY =  convertMantissaToAPY(
    isSupply 
      ? marketData.supplyRatePerBlock 
      : marketData.borrowRatePerBlock, 365
    )
 
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
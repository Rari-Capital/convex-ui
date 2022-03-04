import { useState } from "react"
import { MarketsWithData, USDPricedFuseAsset } from "lib/esm/types"
import { constants } from "ethers"
import { 
  Badge,
  Button,
  ExpandableCard,
  Heading,
  StatisticTable,
  Tabs,
  Text,
  TokenAmountInput,
  TokenIcon,
} from "rari-components"
import { 
  VStack, 
  Flex, 
  Box, 
  Spacer,
  HStack,
  TabPanels,
  TabList,
  Tab,
  TabPanel,
  Accordion
} from "@chakra-ui/react"
import { convertMantissaToAPR, convertMantissaToAPY, smallUsdFormatter } from "utils/formatters"
import { formatUnits } from "ethers/lib/utils"
import { useRari } from "context/RariContext"
import { usePoolContext } from "context/PoolContext"
import { Stats } from "./MarketCard"
import { marketInteraction } from "utils/marketInteraction"
import { useAuthedCallback } from "hooks/useAuthedCallback"


const Positions = ({marketsDynamicData}: {marketsDynamicData: MarketsWithData}) => {
    const { address } = useRari()
    return (
      <Accordion allowToggle>  {
        marketsDynamicData.assets.map((market, i) => {
          if (market.supplyBalanceUSD.gt(constants.Zero)) {
          return (
              <PositionCard market={market} address={address} index={i} key={i} type="supply"/>
            )}
          }
        )
        }
        {
        marketsDynamicData.assets.map((market, i) => {
          if (market.borrowBalanceUSD.gt(constants.Zero)) {
          return (
              <PositionCard market={market} address={address} index={i} key={i} type="borrow"/>
            )}
          }
        )
        }
      </Accordion>
  
    )
  }

export default Positions
  
const PositionCard = ({
  market, 
  address, 
  type,
  index
} : {
  market: USDPricedFuseAsset, 
  address:  string, 
  type: "supply" | "borrow" | "withdraw" | "repay"
  index: number
}) => {
    const isSupplying = type === "supply"
    const isBorrowing = type === "borrow"
  
    return (
          <ExpandableCard
                inAccordion
                variant="active"
                expandableChildren={
                  <Internal 
                    type={type} 
                    market={market} 
                    isBorrowing={isBorrowing} 
                    index={index}
                  />
                }
              >
                <Flex alignItems="center">
                  <TokenIcon tokenAddress={market.underlyingToken} mr={4} />
                  <Heading size="xl" mr={4}>
                    {market.underlyingSymbol}
                  </Heading>
                  <Badge variant={isBorrowing ? "warning" : "success"}>
                    {isBorrowing ? "Borrow" : "Supply"}
                  </Badge>
                  <Spacer />
                  <HStack spacing={8} mr={8} textAlign="right">
                    <Box>
                      <Text variant="secondary" mb={1}>
                        {!!address ? "You" : "Total"}{" "}
                        {isBorrowing ? "Borrowed" : "Supplied"}
                      </Text>
                      <Heading
                        size="md"
                        variant={isBorrowing ? "warning" : "success"}
                      >
                        {parseFloat(
                          formatUnits(
                            isBorrowing
                              ? market.borrowBalance
                              : market.supplyBalance,
                            market.underlyingDecimals
                          )
                        ).toFixed(2)}{" "}
                        {market.underlyingSymbol}
                      </Heading>
                    </Box>
                    <Box>
                      <Text variant="secondary" mb={1}>
                        {isBorrowing ? "Borrow" : "Supply"} APY
                      </Text>
                      <Heading size="md">
                        {isBorrowing
                          ? convertMantissaToAPR(market.borrowRatePerBlock)
                          : convertMantissaToAPY(
                              market.supplyRatePerBlock,
                              365
                            ).toFixed(2)}
                        %
                      </Heading>
                    </Box>
                  </HStack>
                </Flex>
              </ExpandableCard>
            );
  }

const Internal = ({
  isBorrowing,
  market,
  index,
  type
} : {
  isBorrowing: boolean,
  market: USDPricedFuseAsset,
  index: number,
  type: "supply" | "borrow" | "withdraw" | "repay"
}) => {
  const { marketsDynamicData, pool } = usePoolContext()

  const [amount, setAmount] = useState<string>("")

  const authedHandleClick = useAuthedCallback(
    marketInteraction,
    [
      amount,
      pool,
      market,
      type
    ]
  )
  return (
      <Tabs>
        <TabList>
          <Tab>{isBorrowing ? "Borrow" : "Supply"}</Tab>
          <Tab>{isBorrowing ? "Repay" : "Withdraw"}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={4} alignItems="stretch">
              <TokenAmountInput
                size="lg"
                variant="light"
                tokenSymbol={market.underlyingSymbol}
                tokenAddress={market.underlyingToken}
                onChange={(e: any) => setAmount(e.target.value)}
                onClickMax={() => {}}
              />
              { !marketsDynamicData || amount === ""  ? null :
                  <Stats 
                  amount={amount}
                  type={type}
                  index={index}
                  isBorrowing={isBorrowing} 
                  markets={marketsDynamicData?.assets} 
                  marketData={market}
                />}
              <Button alignSelf="stretch" onClick={authedHandleClick}>
                {isBorrowing ? "Borrow" : "Supply"}
              </Button>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
  )
}


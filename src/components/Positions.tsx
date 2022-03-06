import { useState } from "react"
import { MarketsWithData, USDPricedFuseAsset } from "lib/esm/types"
import { constants, utils } from "ethers"
import { 
  Badge,
  Button,
  ExpandableCard,
  Heading,
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
import { Stats } from "./Stats"
import { marketInteraction } from "utils/marketInteraction"
import { useAuthedCallback } from "hooks/useAuthedCallback"


const Positions = ({marketsDynamicData}: {marketsDynamicData: MarketsWithData}) => {
    const { address } = useRari()
    return (
      <Accordion allowToggle>  
        <VStack mt={4} mb={8} align="stretch" spacing={4}>
      {
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
        </VStack>
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
  type: "supply" | "borrow"
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
                        {utils.commify(
                            isBorrowing
                              ? market.borrowBalanceUSD.toString()
                              : market.supplyBalanceUSD.toString(),
                        )}{" "}
                        USD
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
  type: "supply" | "borrow"
}) => {
  const { marketsDynamicData, pool } = usePoolContext()
  const [action, setAction] = useState('')
  console.log({action})

  const [amount, setAmount] = useState<string>("")

  const authedHandleClick = useAuthedCallback(
    marketInteraction,
    [
      amount,
      pool,
      market,
      action
    ]
  )
  return (
      <Tabs>
        <TabList>
          <Tab onClick={() => setAction(isBorrowing ? 'borrow' : 'supply')}>{isBorrowing ? "Borrow" : "Supply"}</Tab>
          <Tab onClick={() => setAction(isBorrowing ? 'repay' : 'withdraw')}>{isBorrowing ? "Repay" : "Withdraw"}</Tab>
        </TabList>
        <TabPanels>
        <VStack mt={4} spacing={4} alignItems="stretch">
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
                  />
              }
              <Button alignSelf="stretch" onClick={authedHandleClick}>
                {isBorrowing ? "Borrow" : "Supply"}
              </Button>
            </VStack>
        </TabPanels>
      </Tabs>
  )
}


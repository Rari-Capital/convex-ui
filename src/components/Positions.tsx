import { MarketsWithData, USDPricedFuseAsset} from "lib/esm/types"
import { constants, utils } from "ethers"
import { ExpandableCard, TokenIcon, StatisticTable, TokenAmountInput } from "rari-components"
import { VStack, Heading, Text, Flex, Button, Badge, Box, Spacer } from "@chakra-ui/react"


const Positions = ({marketsDynamicData}: {marketsDynamicData: MarketsWithData}) => {
    return (
      <>  {
        marketsDynamicData.assets.map((market, i) => {
          if (market.supplyBalanceUSD.gt(constants.Zero) || market.borrowBalance.gt(constants.Zero)) {
          return (
              <PositionCard market={market} key={i}/>
            )}
          })
        }
      </>
  
    )
  }

export default Positions
  
const PositionCard = ({market}: {market: USDPricedFuseAsset}) => {
    const isSupplying = market.supplyBalanceUSD.gt(constants.Zero)
    const isBorrowing = market.borrowBalanceUSD.gt(constants.Zero)
  
    return (
      <ExpandableCard
            variant="active"
            expandableChildren={
              <VStack spacing={4} alignItems="stretch">
                <TokenAmountInput
                  size="lg"
                  variant="light"
                  tokenSymbol={market.underlyingSymbol}
                  tokenAddress={market.underlyingToken}
                  onClickMax={() => {}}
                />
                <StatisticTable
                  variant="light"
                  statistics={[
                    ["Supply Balance", "$24,456"],
                    ["Borrow Limit", "$18,543"],
                  ]}
                />
                <Button alignSelf="stretch">Approve</Button>
              </VStack>
            }
          >
            <Flex alignItems="center" height="100%">
              <TokenIcon
                tokenAddress={market.underlyingToken}
                mr={4}
              />
              <Heading size="xl" mr={4}>
                {market.underlyingSymbol}
              </Heading>
              <Flex direction="column">
                {
                  isSupplying ? <Badge variant="success">Supplying</Badge> : null
                } 
  
                {
                  isBorrowing ? <Badge variant="warning">Borrowing</Badge> : null
                } 
              </Flex>
  
              <Spacer />
  
              { isSupplying ?
                <Box mr={8}>
                  <Text variant="secondary" mb={1}>
                    Total Supplied
                  </Text>
                  <Heading size="lg">
                    ${utils.commify(market.supplyBalanceUSD.toString())}
                  </Heading>
                </Box> : null
              }
  
              { isBorrowing ?
                <Box mr={8}>
                  <Text variant="secondary" mb={1}>
                    Total Borrowed
                  </Text>
                  <Heading size="lg">
                    ${utils.commify(market.borrowBalanceUSD.toString())}
                  </Heading>
                </Box> : null
              }
            </Flex>
          </ExpandableCard>
    )
  }
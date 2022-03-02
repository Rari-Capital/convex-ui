import {
  Accordion,
  Box,
  Flex,
  Spacer,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  VStack,
} from "@chakra-ui/react";
import MarketCard from "components/MarketCard";
import { usePoolContext } from "context/PoolContext";
import { useRari } from "context/RariContext";
import { BigNumber, utils } from "ethers";
import usePoolData from "hooks/pool/usePoolData";
import { FusePoolData, MarketsWithData, USDPricedFuseAsset } from "lib/esm/types";
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
} from "rari-components";
// import { useEffect } from 'react'
// import { convexAPR } from 'utils/convex/convex2'

const Pool = () => {
  const { address, provider } = useRari();
  const { poolInfo, marketsDynamicData } = usePoolContext();
  // useEffect(() => {
  //     convexAPR("frax", provider).then((apr) => console.log({ apr }))
  // }, [])

  if (!poolInfo) return <Spinner />;

  return (
    <Box>
      <Heading size="md" color="white">
        Active Positions
      </Heading>{" "}
      <Accordion allowToggle>
        <VStack mt={4} mb={8} align="stretch">
          <ExpandableCard
            inAccordion
            variant="active"
            expandableChildren={
              <Tabs>
                <TabList>
                  <Tab>Supply</Tab>
                  <Tab>Withdraw</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <VStack spacing={4} alignItems="stretch">
                      <TokenAmountInput
                        size="lg"
                        variant="light"
                        tokenSymbol="UST"
                        tokenAddress="0xa47c8bf37f92aBed4A126BDA807A7b7498661acD"
                        onClickMax={() => {}}
                      />
                      <StatisticTable
                        variant="active"
                        statistics={[
                          ["Supply Balance", "$24,456"],
                          ["Borrow Limit", "$18,543"],
                        ]}
                      />
                      <Button alignSelf="stretch">Supply</Button>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack spacing={4} alignItems="stretch">
                      <TokenAmountInput
                        size="lg"
                        variant="light"
                        tokenSymbol="UST"
                        tokenAddress="0xa47c8bf37f92aBed4A126BDA807A7b7498661acD"
                        onClickMax={() => {}}
                      />
                      <StatisticTable
                        variant="active"
                        statistics={[
                          ["Supply Balance", "$24,456"],
                          ["Borrow Limit", "$18,543"],
                        ]}
                      />
                      <Button alignSelf="stretch">Withdraw</Button>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            }
          >
            <Flex alignItems="center">
              <TokenIcon
                tokenAddress="0xa47c8bf37f92aBed4A126BDA807A7b7498661acD"
                mr={4}
              />
              <Heading size="xl" mr={4}>
                UST
              </Heading>
              <Badge variant="success">Supply</Badge>
              <Spacer />
              <Box mr={8}>
                <Text variant="secondary" mb={1}>
                  Supply APY
                </Text>
                <Heading size="lg">27.6%</Heading>
              </Box>
            </Flex>
          </ExpandableCard>
          <ExpandableCard
            inAccordion
            variant="active"
            expandableChildren={
              <Tabs>
                <TabList>
                  <Tab>Supply</Tab>
                  <Tab>Withdraw</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <VStack spacing={4} alignItems="stretch">
                      <TokenAmountInput
                        size="lg"
                        variant="light"
                        tokenSymbol="FEI3CRV"
                        tokenAddress="0xD533a949740bb3306d119CC777fa900bA034cd52"
                        onClickMax={() => {}}
                      />
                      <StatisticTable
                        variant="active"
                        statistics={[
                          ["Supply Balance", "$24,456"],
                          ["Borrow Limit", "$18,543"],
                        ]}
                      />
                      <Button alignSelf="stretch">Supply</Button>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack spacing={4} alignItems="stretch">
                      <TokenAmountInput
                        size="lg"
                        variant="light"
                        tokenSymbol="FEI3CRV"
                        tokenAddress="0xD533a949740bb3306d119CC777fa900bA034cd52"
                        onClickMax={() => {}}
                      />
                      <StatisticTable
                        variant="active"
                        statistics={[
                          ["Supply Balance", "$24,456"],
                          ["Borrow Limit", "$18,543"],
                        ]}
                      />
                      <Button alignSelf="stretch">Withdraw</Button>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            }
          >
            <Flex alignItems="center">
              <TokenIcon
                tokenAddress="0xD533a949740bb3306d119CC777fa900bA034cd52"
                mr={4}
              />
              <Heading size="xl" mr={4}>
                FEI3CRV
              </Heading>
              <Badge variant="warning">Borrow</Badge>
              <Spacer />
              <Box mr={8}>
                <Text variant="secondary" mb={1}>
                  Borrow APR
                </Text>
                <Heading size="lg">27.6%</Heading>
              </Box>
            </Flex>
          </ExpandableCard>
        </VStack>
      </Accordion>
      <Heading size="md" color="black">
        Markets
      </Heading>
      <Stack mt={4} width="100%" direction={["column", "row"]} spacing={4}>
        <VStack alignItems="stretch" spacing={4} flex={1}>
          {marketsDynamicData?.assets?.map((market, i) => (
            <MarketCard marketData={market} key={i} type="supply"/>
          ))}
        </VStack>
        <VStack alignItems="stretch" spacing={4} flex={1}>
          {marketsDynamicData?.assets?.map((market, i) => market.borrowGuardianPaused ?  null : (
            <MarketCard marketData={market} type="borrow"/>
          )) }
        </VStack>
      </Stack>
    </Box>
  );
};

export default Pool;

const MarketCard = ({
  marketData,
  type
} : {
  marketData: USDPricedFuseAsset
  type: "supply" | "borrow"
}) => {

  return (
    <ExpandableCard
        width="100%"
        variant="light"
        expandableChildren={
          <VStack spacing={4} alignItems="stretch">
            <TokenAmountInput
              variant="light"
              tokenSymbol={ marketData.underlyingSymbol}
              tokenAddress={marketData.underlyingToken}
              onClickMax={() => {}}
            />
            <StatisticTable
              variant="light"
              statistics={[
                ["Supply Balance", "$24,456"],
                ["Borrow Limit", "$18,543"],
              ]}
            />
            <Button>Approve</Button>
          </VStack>
        }
      >
        <Flex alignItems="flex-start" id="hello" width="100%">
          <TokenIcon tokenAddress={marketData.underlyingToken} mr={4} />
          <Flex direction="column" width="100%">
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
            </Flex>
            <MarketTLDR 
              marketData={marketData} 
              type={type}
            />
          </Flex>
        </Flex>
      </ExpandableCard>
  )
}

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
        {APY}% APY
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


// Port over to sdk
export const toInt = (input: BigNumber) => {
  if (!input) return 0
  return parseInt(input.toString())
}

const getMillions = (bn: BigNumber) => {
  const number  = parseFloat(bn.toString())

  return (number / 1000000).toFixed(1)
}

export const convertMantissaToAPY = (mantissa: any, dayRange: number = 35) => {
  const parsedMantissa = toInt(mantissa)
  return (Math.pow((parsedMantissa / 1e18) * 6500 + 1, dayRange) - 1) * 100;
};

export const convertMantissaToAPR = (mantissa: any) => {
  const parsedMantissa = toInt(mantissa)
  return (parsedMantissa * 2372500) / 1e16;
};


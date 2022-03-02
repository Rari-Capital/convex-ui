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

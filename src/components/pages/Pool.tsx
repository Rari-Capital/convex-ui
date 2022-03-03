import {
  Accordion,
  Box,
  Center,
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
import { smallUsdFormatter } from "utils/formatters";
// import { useEffect } from 'react'
// import { convexAPR } from 'utils/convex/convex2'

const Pool = () => {
  const { address, provider } = useRari();
  const { poolInfo, marketsDynamicData } = usePoolContext();
  // useEffect(() => {
  //     convexAPR("frax", provider).then((apr) => console.log({ apr }))
  // }, [])

  if (!poolInfo) {
    return (
      <Center p={8}>
        <Spinner />
      </Center>
    );
  }

  const activeAssets =
    marketsDynamicData?.assets.filter(
      (asset) => asset.borrowBalance.gt(0) || asset.supplyBalance.gt(0)
    ) ?? [];

  return (
    <Box>
      <Heading size="md" color="white">
        Active Positions
      </Heading>
      <Accordion allowToggle>
        <VStack mt={4} mb={8} align="stretch">
          {activeAssets.map((asset) => {
            const isBorrowing = asset.borrowBalance.gt(0);

            return (
              <ExpandableCard
                inAccordion
                variant="active"
                expandableChildren={
                  <Tabs>
                    <TabList>
                      <Tab>{isBorrowing ? "Borrow" : "Supply"}</Tab>
                      <Tab>Withdraw</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <VStack spacing={4} alignItems="stretch">
                          <TokenAmountInput
                            size="lg"
                            variant="light"
                            tokenSymbol={asset.underlyingSymbol}
                            tokenAddress={asset.underlyingToken}
                            onClickMax={() => {}}
                          />
                          <StatisticTable
                            variant="active"
                            statistics={[
                              [
                                `${isBorrowing ? "Borrow" : "Supply"} Balance`,
                                smallUsdFormatter(
                                  (isBorrowing
                                    ? asset.borrowBalanceUSD
                                    : asset.supplyBalanceUSD
                                  ).toNumber()
                                ),
                              ],
                              ["Borrow Limit", "$0"],
                            ]}
                          />
                          <Button alignSelf="stretch">
                            {isBorrowing ? "Borrow" : "Supply"}
                          </Button>
                        </VStack>
                      </TabPanel>
                      <TabPanel>
                        <VStack spacing={4} alignItems="stretch">
                          <TokenAmountInput
                            size="lg"
                            variant="light"
                            tokenSymbol={asset.underlyingSymbol}
                            tokenAddress={asset.underlyingToken}
                            onClickMax={() => {}}
                          />
                          <StatisticTable
                            variant="active"
                            statistics={[
                              [
                                `${isBorrowing ? "Borrow" : "Supply"} Balance`,
                                smallUsdFormatter(
                                  (isBorrowing
                                    ? asset.borrowBalanceUSD
                                    : asset.supplyBalanceUSD
                                  ).toNumber()
                                ),
                              ],
                              ["Borrow Limit", "$0"],
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
                  <TokenIcon tokenAddress={asset.underlyingToken} mr={4} />
                  <Heading size="xl" mr={4}>
                    {asset.underlyingSymbol}
                  </Heading>
                  <Badge variant={isBorrowing ? "warning" : "success"}>
                    {isBorrowing ? "Borrow" : "Supply"}
                  </Badge>
                  <Spacer />
                  <Box mr={8}>
                    <Text variant="secondary" mb={1}>
                      Supply APY
                    </Text>
                    <Heading size="lg">27.6%</Heading>
                  </Box>
                </Flex>
              </ExpandableCard>
            );
          })}
        </VStack>
      </Accordion>
      <Heading size="md" color="black">
        Markets
      </Heading>
      <Stack mt={4} width="100%" direction={["column", "row"]} spacing={4}>
        <VStack alignItems="stretch" spacing={4} flex={1}>
          {marketsDynamicData?.assets?.map((market, i) => (
            <MarketCard marketData={market} key={i} type="supply" />
          ))}
        </VStack>
        <VStack alignItems="stretch" spacing={4} flex={1}>
          {marketsDynamicData?.assets?.map((market, i) =>
            market.borrowGuardianPaused ? null : (
              <MarketCard marketData={market} type="borrow" />
            )
          )}
        </VStack>
      </Stack>
    </Box>
  );
};

export default Pool;

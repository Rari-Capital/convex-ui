import {
  Accordion,
  Box,
  Flex,
  Spacer,
  Spinner,
  Stack,
  VStack,
} from "@chakra-ui/react";
import MarketCard from "components/MarketCard";
import { usePoolContext } from "context/PoolContext";
import { useRari } from "context/RariContext";
import { utils } from "ethers";
import usePoolData from "hooks/pool/usePoolData";
import { MarketsWithData, StaticData, USDPricedFuseAsset } from "lib/esm/types";
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
// import { useEffect } from 'react'
// import { convexAPR } from 'utils/convex/convex2'

const Pool = () => {
  const { address, provider } = useRari();
  const { poolInfo, marketsDynamicData, marketsStaticData } = usePoolContext();
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
                <Button alignSelf="stretch">Approve</Button>
              </VStack>
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
                <Button alignSelf="stretch">Approve</Button>
              </VStack>
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
      <Accordion allowToggle>
        <Stack
          mt={4}
          width="100%"
          direction={["column", "column", "column", "column", "row"]}
          spacing={4}
        >
          <VStack alignItems="stretch" spacing={4} flex={1}>
            {marketsStaticData
              ? marketsDynamicData?.markets?.map((market, i) => (
                  <MarketCard
                    marketStaticData={marketsStaticData[i]}
                    marketsDynamicData={market}
                    key={i}
                    type="supply"
                    inAccordion
                  />
                ))
              : null}
          </VStack>
          <VStack alignItems="stretch" spacing={4} flex={1}>
            {marketsStaticData
              ? marketsDynamicData?.markets?.map((market, i) => (
                  <MarketCard
                    marketStaticData={marketsStaticData[i]}
                    marketsDynamicData={market}
                    type="borrow"
                    inAccordion
                  />
                ))
              : null}
          </VStack>
        </Stack>
      </Accordion>
    </Box>
  );
};

export default Pool;

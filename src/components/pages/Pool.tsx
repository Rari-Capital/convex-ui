import { Box, Flex, Spacer, Spinner, Stack, Tag, VStack } from "@chakra-ui/react";
import { usePoolContext } from "context/PoolContext";
import { useRari } from "context/RariContext";
import { utils } from "ethers";
import usePoolData from "hooks/pool/usePoolData";
import { MarketsWithData, StaticData, USDPricedFuseAsset } from "lib/esm/types";
import {
  Button,
  Card,
  ExpandableCard,
  Heading,
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
      </Heading>
      <VStack mt={4} mb={8} align="stretch" spacing={4}>
        <ExpandableCard
          variant="active"
          expandableChildren={
            <VStack spacing={4}>
              <TokenAmountInput
                size="lg"
                variant="light"
                tokenSymbol="UST"
                tokenAddress="0xa47c8bf37f92aBed4A126BDA807A7b7498661acD"
                onClickMax={() => {}}
              />
              <Button alignSelf="flex-start">Approve</Button>
            </VStack>
          }
        >
          <Flex alignItems="center">
            <TokenIcon
              tokenAddress="0xa47c8bf37f92aBed4A126BDA807A7b7498661acD"
              mr={4}
            />
            <Heading size="xl">UST</Heading>
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
          variant="active"
          expandableChildren={
            <VStack spacing={4}>
              <TokenAmountInput
                size="lg"
                variant="light"
                tokenSymbol="FEI3CRV"
                tokenAddress="0xD533a949740bb3306d119CC777fa900bA034cd52"
                onClickMax={() => {}}
              />
              <Button alignSelf="flex-start">Approve</Button>
            </VStack>
          }
        >
          <Flex alignItems="center">
            <TokenIcon
              tokenAddress="0xD533a949740bb3306d119CC777fa900bA034cd52"
              mr={4}
            />
            <Heading size="xl">FEI3CRV</Heading>
            <Spacer />
            <Box mr={8}>
              <Text variant="secondary" mb={1}>
                Supply APY
              </Text>
              <Heading size="lg">27.6%</Heading>
            </Box>
          </Flex>
        </ExpandableCard>
      </VStack>
      <Heading size="md" color="black">
        Markets
      </Heading>
      <Stack mt={4} width="100%" direction={["column", "row"]} spacing={4}>
        <VStack alignItems="stretch" spacing={4} flex={1}>
          {marketsStaticData ? marketsDynamicData?.markets?.map((market, i) => (
            <MarketCard marketStaticData={marketsStaticData[i]} marketsDynamicData={market} key={i} type="supply"/>
          )): null}
        </VStack>
        <VStack alignItems="stretch" spacing={4} flex={1}>
          { marketsStaticData ?marketsDynamicData?.markets?.map((market, i) => (
            <MarketCard marketStaticData={marketsStaticData[i]} marketsDynamicData={market} type="borrow"/>
          )) : null }
        </VStack>
      </Stack>
    </Box>
  );
};

export default Pool;

const MarketCard = ({
  marketStaticData,
  marketsDynamicData,
  type
} : {
  marketStaticData: StaticData,
  marketsDynamicData: USDPricedFuseAsset
  type: "supply" | "borrow"
}) => {
  return (
    <ExpandableCard
        width="100%"
        variant="light"
        expandableChildren={
          <VStack spacing={4}>
            <TokenAmountInput
              variant="light"
              tokenSymbol={ marketStaticData.underlyingSymbol}
              tokenAddress={marketStaticData.underlyingToken}
              onClickMax={() => {}}
            />
            <Button>Approve</Button>
          </VStack>
        }
      >
        <Flex alignItems="center" id="hello" width="100%">
            <TokenIcon tokenAddress={marketStaticData.underlyingToken} mr={4} />
          <Flex direction="column" width="100%">
            <Flex width="auto">
              <Heading 
                size="lg" 
                mr="3vh"
              >
                {marketStaticData.underlyingSymbol}
              </Heading>
              <Box alignSelf="center">
                <Tag 
                  size="sm" 
                  variant="solid" 
                  backgroundColor={type === "supply" ? "#002F17": "#2F1C00"} 
                  color={type === "supply" ? "#4CD791" : "#FFBE5E"}
                >
                  {type}
                </Tag>
              </Box>
            </Flex>
            <Flex>
              <Text
                display="block"
              >
                {parseFloat(utils.formatEther(marketStaticData.collateralFactor))* 100}% LTV
              </Text>
              <Separator/>

              <Text
                display="block"
              >
                {utils.formatEther(marketsDynamicData.supplyRatePerBlock.mul(100))} Supply APY
              </Text>
              <Separator/>
              <Text
                display="block"
              >
                {marketsDynamicData.totalSupplyUSD.toString()}M Supplied
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </ExpandableCard>
  )
}

const Separator = () => {
  return (
    <Text
      opacity="0.5"
    >
      ●
    </Text>
  )
}
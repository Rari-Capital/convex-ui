import { Box, Flex, Spacer, Spinner, Stack, VStack } from "@chakra-ui/react";
import { usePoolContext } from "context/PoolContext";
import { useRari } from "context/RariContext";
import usePoolData from "hooks/pool/usePoolData";
import {
  Button,
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
  const { poolInfo, markets } = usePoolContext();
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
          {markets?.assets?.map((asset) => (
            <ExpandableCard
              variant="light"
              expandableChildren={
                <VStack spacing={4}>
                  <TokenAmountInput
                    variant="light"
                    tokenSymbol={asset.underlyingSymbol}
                    tokenAddress={asset.underlyingToken}
                    onClickMax={() => {}}
                  />
                  <Button alignSelf="flex-start">Approve</Button>
                </VStack>
              }
            >
              <Flex alignItems="center">
                <TokenIcon tokenAddress={asset.underlyingToken} mr={4} />
                <Box textAlign="left">
                  <Heading size="lg">{asset.underlyingSymbol}</Heading>
                  <Text variant="secondary">
                    60% LTV &middot; 37.6% Supply APY &middot; 32M Supplied
                  </Text>
                </Box>
              </Flex>
            </ExpandableCard>
          ))}
        </VStack>
        <VStack alignItems="stretch" spacing={4} flex={1}>
          {markets?.assets?.map((asset) => (
            <ExpandableCard
              variant="light"
              expandableChildren={
                <VStack spacing={4}>
                  <TokenAmountInput
                    variant="light"
                    tokenSymbol={asset.underlyingSymbol}
                    tokenAddress={asset.underlyingToken}
                    onClickMax={() => {}}
                  />
                  <Button alignSelf="flex-start">Approve</Button>
                </VStack>
              }
            >
              <Flex alignItems="center">
                <TokenIcon tokenAddress={asset.underlyingToken} mr={4} />
                <Box textAlign="left">
                  <Heading size="lg">{asset.underlyingSymbol}</Heading>
                  <Text variant="secondary">
                    7.2M Liquidity &middot; 37.6% Borrow APR
                  </Text>
                </Box>
              </Flex>
            </ExpandableCard>
          ))}
        </VStack>
      </Stack>
    </Box>
  );
};

export default Pool;

import { Box, Flex, Spacer, Spinner, Stack, VStack } from "@chakra-ui/react";
import { usePoolContext } from "context/PoolContext";
import { useRari } from "context/RariContext";
import usePoolData from "hooks/pool/usePoolData";
import {
  Button,
  Card,
  ExpandableCard,
  Heading,
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
        <ExpandableCard variant="active" expandableChildren={<></>}>
          <Heading size="lg">UST</Heading>
        </ExpandableCard>
        <ExpandableCard variant="active" expandableChildren={<></>}>
          <Heading size="lg">FEI3CRV</Heading>
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
                  <Button>Approve</Button>
                </VStack>
              }
            >
              <Flex alignItems="center">
                <TokenIcon tokenAddress={asset.underlyingToken} mr={4} />
                <Heading size="lg">{asset.underlyingSymbol}</Heading>
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
                  <Button>Approve</Button>
                </VStack>
              }
            >
              <Flex alignItems="center">
                <TokenIcon tokenAddress={asset.underlyingToken} mr={4} />
                <Heading size="lg">{asset.underlyingSymbol}</Heading>
              </Flex>
            </ExpandableCard>
          ))}
        </VStack>
      </Stack>
    </Box>
  );
};

export default Pool;

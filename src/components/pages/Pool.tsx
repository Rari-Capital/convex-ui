import { Box, Flex, Spinner, VStack } from "@chakra-ui/react";
import { usePoolContext } from "context/PoolContext";
import { useRari } from "context/RariContext";
import usePoolData from "hooks/pool/usePoolData";
import { Card, Heading, TokenIcon } from "rari-components";
// import { useEffect } from 'react'
// import { convexAPR } from 'utils/convex/convex2'

const Pool = () => {
  const { address, provider } = useRari();
  const { poolInfo, markets } = usePoolContext();
  // useEffect(() => {
  //     convexAPR("frax", provider).then((apr) => console.log({ apr }))
  // }, [])

  if (!poolInfo) return <Spinner />;

  console.log({ markets });

  return (
    <Box>
      <Heading size="md" color="white">
        Active Positions
      </Heading>
      <VStack mt={4} mb={8} align="stretch" spacing={4}>
        <Card variant="active">
          <Heading size="lg">UST</Heading>
        </Card>
        <Card variant="active">
          <Heading size="lg">FEI3CRV</Heading>
        </Card>
      </VStack>
      <Heading size="md" color="black">
        Markets
      </Heading>
      <VStack mt={4} align="stretch" spacing={4}>
        {markets?.assets?.map((asset) => (
          <Card variant="light">
            <Flex alignItems="center">
              <TokenIcon address={asset.underlyingToken} mr={4} />
              <Heading size="lg">{asset.underlyingSymbol}</Heading>
            </Flex>
          </Card>
        ))}
      </VStack>
    </Box>
  );
};

export default Pool;

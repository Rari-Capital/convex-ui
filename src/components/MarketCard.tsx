import { Box, Flex, VStack } from "@chakra-ui/react";
import { utils } from "ethers";
import { USDPricedFuseAsset } from "lib/esm/types";
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
import { getMillions, convertMantissaToAPY } from "utils/formatters";

type MarketCardProps = Omit<
  React.ComponentProps<typeof ExpandableCard>,
  "expandableChildren"
> & {
  marketData: USDPricedFuseAsset;
  type: "supply" | "borrow";
};

const MarketCard: React.FC<MarketCardProps> = ({
  marketData,
  type,
  ...restProps
}) => {
  return (
    <ExpandableCard
      width="100%"
      variant="light"
      expandableChildren={
        <VStack spacing={4} alignItems="stretch">
          <TokenAmountInput
            variant="light"
            tokenSymbol={marketData.underlyingSymbol}
            tokenAddress={marketData.underlyingToken}
            onClickMax={() => { }}
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
      {...restProps}
    >
      <Flex alignItems="center" width="100%">
        <TokenIcon tokenAddress={marketData.underlyingToken} mr={4} />
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
          <Text variant="secondary" textAlign="left">
            {parseFloat(utils.formatEther(marketData.collateralFactor)) *
              100}
            % LTV &middot;
            {utils.formatEther(
              marketData.supplyRatePerBlock.mul(100)
            )}{" "}
            Supply APY &middot;
            {marketData.totalSupplyUSD.toString()}M Supplied
          </Text>
        </Flex>
      </Flex>
    </ExpandableCard>
  );
};

const _MarketCard = ({
  marketData,
  type
}: {
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
            tokenSymbol={marketData.underlyingSymbol}
            tokenAddress={marketData.underlyingToken}
            onClickMax={() => { }}
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
}: {
  marketData: USDPricedFuseAsset,
  type: "supply" | "borrow"
}) => {

  const isSupply = type === "supply"
  const APY = convertMantissaToAPY(
    isSupply
      ? marketData.supplyRatePerBlock
      : marketData.borrowRatePerBlock, 365
  )

  const Text1 = isSupply
    ? `${utils.formatEther(marketData.collateralFactor.mul(100))} LTV`
    : `${getMillions(marketData.liquidityUSD)} Liquidity`

  // const 
  return (
    <Flex justifyContent="flex-start !important">
      <Text variant="secondary" alignSelf="flex-start" mr="1.5vh">
        { }% LTV
      </Text>

      &middot;

      <Text variant="secondary" mr="1.5vh" ml="1.5vh">
        {Text1}
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


export default MarketCard;

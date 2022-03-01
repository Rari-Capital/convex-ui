import { Box, Flex, VStack } from "@chakra-ui/react";
import { utils } from "ethers";
import { StaticData, USDPricedFuseAsset } from "lib/esm/types";
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

type MarketCardProps = Omit<
  React.ComponentProps<typeof ExpandableCard>,
  "expandableChildren"
> & {
  marketStaticData: StaticData;
  marketsDynamicData: USDPricedFuseAsset;
  type: "supply" | "borrow";
};

const MarketCard: React.FC<MarketCardProps> = ({
  marketStaticData,
  marketsDynamicData,
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
            tokenSymbol={marketStaticData.underlyingSymbol}
            tokenAddress={marketStaticData.underlyingToken}
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
      {...restProps}
    >
      <Flex alignItems="center" id="hello" width="100%">
        <TokenIcon tokenAddress={marketStaticData.underlyingToken} mr={4} />
        <Flex direction="column" width="100%">
          <Flex width="auto">
            <Heading size="lg" mr={4}>
              {marketStaticData.underlyingSymbol}
            </Heading>
            <Box alignSelf="center">
              <Badge variant={type === "supply" ? "success" : "warning"}>
                {type}
              </Badge>
            </Box>
          </Flex>
          <Text variant="secondary" textAlign="left">
            {parseFloat(utils.formatEther(marketStaticData.collateralFactor)) *
              100}
            % LTV &middot;
            {utils.formatEther(
              marketsDynamicData.supplyRatePerBlock.mul(100)
            )}{" "}
            Supply APY &middot;
            {marketsDynamicData.totalSupplyUSD.toString()}M Supplied
          </Text>
        </Flex>
      </Flex>
    </ExpandableCard>
  );
};

export default MarketCard;

import { useState } from "react";
import { usePoolContext } from "context/PoolContext";
import { useRari } from "context/RariContext";
import { Avatar, Box, Flex, VStack } from "@chakra-ui/react";
import { utils } from "ethers";
import { TokenData, useTokenData } from "hooks/useTokenData";
import { USDPricedFuseAsset } from "lib/esm/types";
import {
  Badge,
  Button,
  ExpandableCard,
  Heading,
  Text,
  TokenAmountInput,
  TokenIcon,
} from "rari-components";
import { getMillions, convertMantissaToAPY } from "utils/formatters";
import { useAuthedCallback } from "hooks/useAuthedCallback";
import { marketInteraction } from "utils/marketInteraction";
import { Stats } from "./Stats";
import useDebounce from "hooks/useDebounce";

type MarketCardProps = Omit<
  React.ComponentProps<typeof ExpandableCard>,
  "expandableChildren"
> & {
  type: "supply" | "borrow";
  marketData: USDPricedFuseAsset;
  markets: USDPricedFuseAsset[];
  index: number;
  tokenData: TokenData;
};

const MarketCard: React.FC<MarketCardProps> = ({
  markets,
  marketData,
  index,
  type,
  tokenData,
  ...restProps
}) => {
  const isSupply = type === "supply";
  const APY = convertMantissaToAPY(
    isSupply ? marketData.supplyRatePerBlock : marketData.borrowRatePerBlock,
    365
  );

    console.log({tokenData})
  return (
    <ExpandableCard
      width="100%"
      variant="light"
      inAccordion={true}
      expandableChildren={
        <Internal 
          market={marketData}
          type={type}
          index={index}
        />
      }
      {...restProps}
    >
      <Flex alignItems="center" width="100%">
        <Avatar src={tokenData.logoURL} mr={4}/>
        <Flex direction="column" width="100%">
          <Flex width="auto">
            <Heading size="lg" mr={4}>
              {markets[index].underlyingSymbol}
            </Heading>
            <Box alignSelf="center">
              <Badge variant={isSupply ? "success" : "warning"}>
                {type}
              </Badge>
            </Box>
          </Flex>
          <MarketTLDR
            marketData={markets[index]}
            APY={APY}
            isSupply={isSupply}
          />
        </Flex>
      </Flex>
    </ExpandableCard>
  );
};

const MarketTLDR = ({
  marketData,
  isSupply,
  APY,
}: {
  marketData: USDPricedFuseAsset;
  isSupply: boolean;
  APY: number;
}) => {
  const Text1 = isSupply
    ? `${utils.formatEther(marketData.collateralFactor.mul(100))}% LTV`
    : `${getMillions(marketData.liquidityUSD)}M Liquidity`;

  return (
    <Flex justifyContent="flex-start !important">
      <Text variant="secondary" alignSelf="flex-start" mr="1.5vh">
        {Text1}
      </Text>
      &middot;
      <Text variant="secondary" mr="1.5vh" ml="1.5vh">
        {APY.toFixed(2)}% APY
      </Text>
      {isSupply ? (
        <>
          &middot;
          <Text variant="secondary" ml="1.5vh">
            {getMillions(marketData.totalSupplyUSD)}M Supplied
          </Text>
        </>
      ) : null}
    </Flex>
  );
};

export default MarketCard;


const Internal = ({
  market,
  type,
  index
}: {
  market: USDPricedFuseAsset;
  index: number;
  type: "supply" | "borrow";
}) => {
  const { marketsDynamicData, pool } = usePoolContext();
  const [amount, setAmount] = useState<string>("");

  const debouncedValue = useDebounce(amount, 3000);

  const authedHandleClick = useAuthedCallback(marketInteraction, [
    debouncedValue,
    pool,
    market,
    type,
  ]);

  return (
    <VStack spacing={4} alignItems="stretch">
          <TokenAmountInput
            variant="light"
            tokenSymbol={market.underlyingSymbol}
            tokenAddress={market.underlyingToken}
            onChange={(e: any) => setAmount(e.target.value)}
            onClickMax={() => {}}
          />
          {!marketsDynamicData || amount === "" ? null : (
            <Stats
              marketData={market}
              amount={amount}
              type={type}
              markets={marketsDynamicData?.assets}
              index={index}
            />
          )}
          <Button onClick={authedHandleClick}>Approve</Button>
        </VStack>
  )
}
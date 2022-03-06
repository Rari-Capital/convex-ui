import { useState } from "react";
import { usePoolContext } from "context/PoolContext";
import { Avatar, Box, Center, Flex, Spinner, VStack } from "@chakra-ui/react";
import { utils } from "ethers";
import { TokenData } from "hooks/useTokenData";
import { PoolInstance, USDPricedFuseAsset } from "lib/esm/types";
import {
  Badge,
  Button,
  ExpandableCard,
  Heading,
  Text,
  TokenAmountInput,
} from "rari-components";
import { getMillions, convertMantissaToAPY } from "utils/formatters";
import { useAuthedCallback } from "hooks/useAuthedCallback";
import { marketInteraction } from "utils/marketInteraction";
import { Stats } from "./Stats";
import useDebounce from "hooks/useDebounce";
import { ActionType } from "./pages/Pool";
import { fetchMaxAmount } from "utils/fetchMaxAmount";
import { useRari } from "context/RariContext";

type MarketCardProps = Omit<
  React.ComponentProps<typeof ExpandableCard>,
  "expandableChildren"
> & {
  action: ActionType;
  marketData: USDPricedFuseAsset;
  markets: USDPricedFuseAsset[];
  index: number;
  tokenData: TokenData;
};

const MarketCard: React.FC<MarketCardProps> = ({
  markets,
  marketData,
  index,
  action,
  tokenData,
  ...restProps
}) => {
  const { pool } = usePoolContext()
  const isSupply = action === ActionType.supply;

  const APY = convertMantissaToAPY(
    isSupply ? marketData.supplyRatePerBlock : marketData.borrowRatePerBlock,
    365
  );

  if (!pool ) return (
    <Center>
      <Spinner/>
    </Center>
  )
  return (
    <ExpandableCard
      width="100%"
      variant="light"
      inAccordion={true}
      expandableChildren={
        <Internal 
          market={marketData}
          action={action}
          index={index}
          pool={pool}
        />
      }
      {...restProps}
    >
      <Flex alignItems="center" width="100%">
       { tokenData ? <Avatar src={tokenData.logoURL} mr={4}/> : <Spinner />}
        <Flex direction="column" width="100%">
          <Flex width="auto">
            <Heading size="lg" mr={4}>
              {markets[index].underlyingSymbol}
            </Heading>
            <Box alignSelf="center">
              <Badge variant={isSupply ? "success" : "warning"}>
                {isSupply ? "Supply" : "Borrow"}
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
  action,
  index,
  pool
}: {
  market: USDPricedFuseAsset;
  index: number;
  action: ActionType;
  pool: PoolInstance;
}) => {
  const { address } = useRari()
  const { marketsDynamicData } = usePoolContext();
  const [amount, setAmount] = useState<string>("0");

  const debouncedValue = useDebounce(amount, 3000);

  const maxClickHandle = async () => {
    const answer: number = await fetchMaxAmount(action, pool, address, market)
    setAmount(answer.toString())
  }
  console.log({amount})

  const authedHandleClick = useAuthedCallback(marketInteraction, [
    debouncedValue,
    pool,
    market,
    action,
  ]);

  return (
    <VStack spacing={4} alignItems="stretch">
          <TokenAmountInput
            variant="light"
            tokenSymbol={market.underlyingSymbol}
            tokenAddress={market.underlyingToken}
            value={amount}
            onChange={(e: any) => setAmount(e.target.value)}
            onClickMax={maxClickHandle}
          />
          {!marketsDynamicData || amount === "0" || amount === "" ? null : (
            <Stats
              marketData={market}
              amount={amount}
              action={action}
              markets={marketsDynamicData?.assets}
              index={index}
            />
          )}
          <Button onClick={authedHandleClick}>Approve</Button>
        </VStack>
  )
}
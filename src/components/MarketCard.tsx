import { TriangleDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Center,
  Flex,
  Skeleton,
  SkeletonCircle,
  Spacer,
  Spinner,
} from "@chakra-ui/react";
import { usePoolContext } from "context/PoolContext";
import { utils } from "ethers";
import { TokenData } from "hooks/useTokenData";
import { USDPricedFuseAsset } from "lib/esm/types";
import { Badge, Card, ExpandableCard, Heading, Text } from "rari-components";
import { Dispatch, SetStateAction } from "react";
import { getMillions, convertMantissaToAPY } from "utils/formatters";
import { ActionType } from "./pages/Pool";
import { Internal } from "./Internal";

type MarketCardProps = Omit<
  React.ComponentProps<typeof ExpandableCard>,
  "expandableChildren"
> & {
  action: ActionType;
  marketData: USDPricedFuseAsset;
  markets: USDPricedFuseAsset[];
  index: number;
  tokenData: TokenData;
  setIndex: Dispatch<SetStateAction<number | undefined>>;
};

/**
 * Card which displays information about a specific market. Also includes
 * a skeleton component to be displayed while loading:
 * `<MarketCard.Skeleton />`
 */
const MarketCard: React.FC<MarketCardProps> & { Skeleton: React.FC } = ({
  markets,
  marketData,
  index,
  action,
  tokenData,
  setIndex,
  ...restProps
}) => {
  const { pool, poolInfo } = usePoolContext();
  const isSupply = action === ActionType.SUPPLY;
  const isBorrowing = action === ActionType.BORROW;

  const APY = convertMantissaToAPY(
    isSupply ? marketData.supplyRatePerBlock : marketData.borrowRatePerBlock,
    365
  );

  if (!pool || !poolInfo)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  if (!tokenData) {
    return (
      <MarketCard.Skeleton />
    );
  }

  return (
    <ExpandableCard
      p={4}
      py={6}
      width="100%"
      variant="light"
      inAccordion={true}
      expandableChildren={
        <Internal
          isBorrowing={isBorrowing}
          market={marketData}
          action={action}
          index={index}
          pool={pool}
          tokenData={tokenData}
          isPosition={false}
          setIndex={setIndex}
        />
      }
      {...restProps}
    >
      <Flex alignItems="center" width="100%">
        {tokenData ? <Avatar src={tokenData.logoURL} mr={4} /> : <Spinner />}
        <Flex direction="column" width="100%">
          <Flex width="auto">
            <Heading size="lg" mr={4}>
              {tokenData?.symbol}
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

MarketCard.Skeleton = () => {
  return (
    <Card variant="light" p={4} py={6}>
      <Flex alignItems="center">
        <SkeletonCircle size="12" mr={4} />
        <Box flex={1}>
          <Flex mb={1} alignItems="center">
            <Skeleton height={9} width={36} mr={4} />
            <Skeleton height={6} width={16} />
          </Flex>
          <Skeleton height={5} maxWidth={72} />
        </Box>
        <Center alignItems="center" width={10}>
          <TriangleDownIcon />
        </Center>
      </Flex>
    </Card>
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

import { usePoolContext } from "context/PoolContext";
import {
  Avatar,
  Box,
  Center,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { utils } from "ethers";
import { TokenData } from "hooks/useTokenData";
import { USDPricedFuseAsset } from "lib/esm/types";
import {
  Badge,
  ExpandableCard,
  Heading,
  Text,
} from "rari-components";
import { getMillions, convertMantissaToAPY } from "utils/formatters";
import { ActionType } from "./pages/Pool";
import { Internal } from './Internal';
import { Dispatch, SetStateAction } from "react";

type MarketCardProps = Omit<
  React.ComponentProps<typeof ExpandableCard>,
  "expandableChildren"
> & {
  action: ActionType;
  marketData: USDPricedFuseAsset;
  markets: USDPricedFuseAsset[];
  index: number;
  tokenData: TokenData;
  setIndex: Dispatch<SetStateAction<number | undefined>>
};

const MarketCard: React.FC<MarketCardProps> = ({
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

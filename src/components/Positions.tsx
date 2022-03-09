import { MarketsWithData, USDPricedFuseAsset } from "lib/esm/types";
import { BigNumber, constants, utils } from "ethers";
import {
  Badge,
  ExpandableCard,
  Heading,
  Text,
} from "rari-components";
import {
  VStack,
  Flex,
  Box,
  Spacer,
  HStack,
  Accordion,
  Center,
  Spinner,
  Avatar,
} from "@chakra-ui/react";
import {
  convertMantissaToAPR,
  convertMantissaToAPY,
  smallUsdFormatter,
} from "utils/formatters";
import { useRari } from "context/RariContext";
import { usePoolContext } from "context/PoolContext";
import { ActionType } from "./pages/Pool";
import { TokenData, TokensDataMap } from "hooks/useTokenData";
import { Internal } from "./Internal";
import { Dispatch, SetStateAction, useState } from "react";

const Positions = ({
  marketsDynamicData,
  tokensData
}: {
  marketsDynamicData: MarketsWithData;
  tokensData: TokensDataMap
}) => {
  const { address } = useRari();
  const [index, setIndex] = useState<number | undefined>()

  return (
    <Accordion allowToggle index={index} onChange={(i: number) => setIndex(i)}>
      <VStack mt={4} mb={8} align="stretch" spacing={4}>
        {marketsDynamicData.assets.map((market, i) => {
          if (market.supplyBalanceUSD.gt(constants.Zero) && address) {
            return (
              <PositionCard
                market={market}
                address={address}
                index={i}
                key={i}
                action={ActionType.SUPPLY}
                tokenData={tokensData[market.underlyingToken]}
                setIndex={setIndex}
              />
            );
          }
        })}
        {marketsDynamicData.assets.map((market, i) => {
          if (market.borrowBalanceUSD.gt(constants.Zero) && address) {
            return (
              <PositionCard
                market={market}
                address={address}
                index={i}
                key={i}
                action={ActionType.BORROW}
                tokenData={tokensData[market.underlyingToken]}
                setIndex={setIndex}
              />
            );
          }
        })}
      </VStack>
    </Accordion>
  );
};

export default Positions;

const PositionCard = ({
  market,
  address,
  action,
  index,
  tokenData,
  setIndex
}: {
  market: USDPricedFuseAsset;
  address: string;
  action: ActionType;
  index: number;
  tokenData: TokenData;
  setIndex:  Dispatch<SetStateAction<number | undefined>>;
}) => {
  const { pool } = usePoolContext();
  const isBorrowing = action === ActionType.BORROW;

  if (!pool) return (
    <Center>
      <Spinner />
    </Center>
  )

  return (
    <ExpandableCard
      inAccordion
      variant="active"
      expandableChildren={
        <Internal
          action={action}
          market={market}
          isBorrowing={isBorrowing}
          index={index}
          pool={pool}
          tokenData={tokenData}
          isPosition={true}
          setIndex={setIndex}
        />
      }
    >
      <Flex alignItems="center">
        {tokenData ? <Avatar src={tokenData.logoURL} mr={4} /> : <Spinner />}
        <Heading size="xl" mr={4}>
          {tokenData?.symbol}
        </Heading>
        <Badge variant={isBorrowing ? "warning" : "success"}>
          <Text alignSelf="center" align="center">{isBorrowing ? "Borrowed" : "Supplied"}</Text>
        </Badge>
        <Spacer />
        <HStack spacing={12} mr={12} textAlign="center">
          <Box>
            <Text variant="secondary" mb={1}>
              {!!address ? "You" : "Total"}{" "}
              {isBorrowing ? "Borrowed" : "Supplied"}
            </Text>
            <Heading size="md" variant={isBorrowing ? "warning" : "success"}>
              {smallUsdFormatter(
                (isBorrowing
                  ? market.borrowBalanceUSD
                  : market.supplyBalanceUSD
                ).toString()
              )}
            </Heading>
            <Text variant="secondary" fontSize="xs">
              {utils.commify((isBorrowing ? market.borrowBalance : market.supplyBalance)
                .div(BigNumber.from(10).pow(market.underlyingDecimals))
                .toNumber()
                .toFixed(2))}{" "}
              {tokenData?.symbol}
            </Text>
          </Box>
          <Box>
            <Text variant="secondary" mb={1}>
              {isBorrowing ? "Borrow" : "Supply"} APY
            </Text>
            <Heading size="md">
              {isBorrowing
                ? convertMantissaToAPR(market.borrowRatePerBlock).toFixed(2)
                : convertMantissaToAPY(market.supplyRatePerBlock, 365).toFixed(
                  2
                )}
              %
            </Heading>
            {/* Empty text is here to align the APR/APY with the supply number */}
            <Text variant="secondary" fontSize="xs">
              &nbsp;
            </Text>
          </Box>
        </HStack>
      </Flex>
    </ExpandableCard>
  );
};

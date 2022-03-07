import { useState } from "react";
import { MarketsWithData, PoolInstance, USDPricedFuseAsset } from "lib/esm/types";
import { BigNumber, constants, utils } from "ethers";
import {
  Badge,
  Button,
  ExpandableCard,
  Heading,
  Tabs,
  Text,
  TokenAmountInput,
  TokenIcon,
} from "rari-components";
import {
  VStack,
  Flex,
  Box,
  Spacer,
  HStack,
  TabPanels,
  TabList,
  Tab,
  Accordion,
  Center,
  Spinner,
} from "@chakra-ui/react";
import {
  convertMantissaToAPR,
  convertMantissaToAPY,
  smallUsdFormatter,
} from "utils/formatters";
import { useRari } from "context/RariContext";
import { usePoolContext } from "context/PoolContext";
import { Stats } from "./Stats";
import { marketInteraction } from "utils/marketInteraction";
import { useAuthedCallback } from "hooks/useAuthedCallback";
import { ActionType } from "./pages/Pool";
import { fetchMaxAmount } from "utils/fetchMaxAmount";
import { CollateralSwitch } from "./MarketCard";

const Positions = ({
  marketsDynamicData,
}: {
  marketsDynamicData: MarketsWithData;
}) => {
  const { address } = useRari();
  return (
    <Accordion allowToggle>
      <VStack mt={4} mb={8} align="stretch" spacing={4}>
        {marketsDynamicData.assets.map((market, i) => {
          if (market.supplyBalanceUSD.gt(constants.Zero)) {
            return (
              <PositionCard
                market={market}
                address={address}
                index={i}
                key={i}
                action={ActionType.supply}
              />
            );
          }
        })}
        {marketsDynamicData.assets.map((market, i) => {
          if (market.borrowBalanceUSD.gt(constants.Zero)) {
            return (
              <PositionCard
                market={market}
                address={address}
                index={i}
                key={i}
                action={ActionType.borrow}
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
}: {
  market: USDPricedFuseAsset;
  address: string;
  action: ActionType;
  index: number;
}) => {
  const { pool } = usePoolContext()
  const isBorrowing = action === ActionType.borrow;

  if (!pool ) return (
    <Center>
      <Spinner/>
    </Center>
  )

  return (
    <ExpandableCard
      inAccordion
      variant="active"
      expandableChildren={
        <Internal
          type={action}
          market={market}
          isBorrowing={isBorrowing}
          index={index}
          pool={pool}
        />
      }
    >
      <Flex alignItems="center">
        <TokenIcon tokenAddress={market.underlyingToken} mr={4} />
        <Heading size="xl" mr={4}>
          {market.underlyingSymbol}
        </Heading>
        <Badge variant={isBorrowing ? "warning" : "success"}>
          <Text alignSelf="center" align="center">{isBorrowing ? "Borrowed" : "Supplied"}</Text>
          <Text variant="secondary" fontSize="8px" align="center">not collateral</Text>
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
              {market.underlyingSymbol}
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

const Internal = ({
  isBorrowing,
  market,
  index,
  type,
  pool
}: {
  isBorrowing: boolean;
  market: USDPricedFuseAsset;
  index: number;
  type: ActionType;
  pool: PoolInstance;
}) => {
  const { address } = useRari()
  const { marketsDynamicData } = usePoolContext();
  const [action, setAction] = useState<ActionType>(type);
  const [amount, setAmount] = useState<string>("0");
  const [enterMarket, setEnterMarket] = useState<boolean>(market.membership)

  const maxClickHandle = async () => {
    const answer: number = await fetchMaxAmount(action, pool, address, market)
    setAmount(answer.toString())
  }
  console.log({amount})

  const authedHandleClick = useAuthedCallback(marketInteraction, [
    amount,
    pool,
    market,
    action,
  ]);
  
  return (
    <Tabs>
      <TabList>
        <Tab onClick={() => setAction(isBorrowing ? ActionType.borrow : ActionType.supply)}>
          {isBorrowing ? "Borrow" : "Supply"}
        </Tab>
        <Tab onClick={() => setAction(isBorrowing ? ActionType.repay : ActionType.withdraw)}>
          {isBorrowing ? "Repay" : "Withdraw"}
        </Tab>
      </TabList>
      <TabPanels>
        <VStack mt={4} spacing={4} alignItems="stretch">
          <TokenAmountInput
            size="lg"
            variant="light"
            value={amount}
            tokenSymbol={market.underlyingSymbol}
            tokenAddress={market.underlyingToken}
            onChange={(e: any) => setAmount(e.target.value)}
            onClickMax={maxClickHandle}
          />
          {!marketsDynamicData || amount === "" || amount === "0" ? null : (
            <Stats
              amount={amount}
              action={action}
              index={index}
              markets={marketsDynamicData?.assets}
              marketData={market}
              enterMarket={market.membership}
            />
          )}
          <Button alignSelf="stretch" onClick={authedHandleClick}>
            {isBorrowing ? "Borrow" : "Supply"}
          </Button>
        </VStack>
      </TabPanels>
    </Tabs>
  );
};

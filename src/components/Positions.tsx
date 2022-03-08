import { useEffect, useState } from "react";
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
  StepBubbles
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
  Avatar,
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
import useDebounce from "hooks/useDebounce";
import { TokenData, TokensDataMap } from "hooks/useTokenData";
import { formatUnits } from "ethers/lib/utils";

const Positions = ({
  marketsDynamicData,
  tokensData
}: {
  marketsDynamicData: MarketsWithData;
  tokensData: TokensDataMap
}) => {
  const { address } = useRari();

  return (
    <Accordion allowToggle>
      <VStack mt={4} mb={8} align="stretch" spacing={4}>
        {marketsDynamicData.assets.map((market, i) => {
          if (market.supplyBalanceUSD.gt(constants.Zero) && address) {
            return (
              <PositionCard
                market={market}
                address={address}
                index={i}
                key={i}
                action={ActionType.supply}
                tokenData={tokensData[market.underlyingToken]}
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
                action={ActionType.borrow}
                tokenData={tokensData[market.underlyingToken]}
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
  tokenData
}: {
  market: USDPricedFuseAsset;
  address: string;
  action: ActionType;
  index: number;
  tokenData: TokenData
}) => {
  const { pool } = usePoolContext();
  const isBorrowing = action === ActionType.borrow;

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
          type={action}
          market={market}
          isBorrowing={isBorrowing}
          index={index}
          pool={pool}
          tokenData={tokenData}
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

const Internal = ({
  isBorrowing,
  market,
  index,
  type,
  pool,
  tokenData,
}: {
  isBorrowing: boolean;
  market: USDPricedFuseAsset;
  index: number;
  type: ActionType;
  pool: PoolInstance;
  tokenData: TokenData
}) => {
  const { address } = useRari();
  const { marketsDynamicData, poolInfo } = usePoolContext();

  // Will determine actionType and amount to send for interaction.
  const [action, setAction] = useState<ActionType>(type);
  const [amount, setAmount] = useState<string>("0");
  const debouncedAmount = useDebounce(amount, 1000);

  // Triggered to get max amount user can use for a given actionType.
  const maxClickHandle = async () => {
    if (!address) return
    const answer: number = await fetchMaxAmount(action, pool, address, market)
    setAmount(answer.toString())
  }

  const balance = parseFloat(formatUnits(market.underlyingBalance, market.underlyingDecimals)).toFixed(2)

  if (!poolInfo || !address) return null
  return (
    <Tabs>
      <TabList>
        <Tab
          onClick={() =>
            setAction(isBorrowing ? ActionType.borrow : ActionType.supply)
          }
        >
          {isBorrowing ? "Borrow" : "Supply"}
        </Tab>
        <Tab
          onClick={() =>
            setAction(isBorrowing ? ActionType.repay : ActionType.withdraw)
          }
        >
          {isBorrowing ? "Repay" : "Withdraw"}
        </Tab>
      </TabList>
      <TabPanels>
        <VStack mt={4} spacing={4} alignItems="stretch">
          <TokenAmountInput
            size="lg"
            variant="light"
            value={amount}
            tokenSymbol={tokenData?.symbol}
            tokenAddress={market.underlyingToken}
            onChange={(newValue: any) => setAmount(newValue.target.value)}
            onClickMax={maxClickHandle}
          />
          <Text ml={"auto"} color="grey" fontWeight={"medium"}> You have {balance} {tokenData?.symbol}</Text>
          {!marketsDynamicData || amount === "" || amount === "0" ? null : (
            <Stats
              amount={debouncedAmount}
              action={action}
              index={index}
              markets={marketsDynamicData?.assets}
              marketData={market}
              enterMarket={market.membership}
            />
          )}
          <SubmitButton
            debouncedAmount={debouncedAmount}
            market={market}
            action={action}
            comptrollerAddress={poolInfo?.comptroller}
            userAddress={address}
          />
        </VStack>
      </TabPanels>
    </Tabs>
  );
};

const supplyApproveSteps = [
  "Enter market",
  "Approving Asset",
  "Supplying",
  "Done"
]

const supplySteps = [
  "Supplying",
  "Done"
]

const borrowSteps = [
  "Borrowing",
  "Done"
]
const withdrawSteps = [
  "Withdrawing",
  "Done"
]
const repaySteps = [
  "Repaying",
  "Done"
]

const SubmitButton = ({
  debouncedAmount,
  market,
  action,
  comptrollerAddress,
  userAddress
}: {
  debouncedAmount: string,
  market: USDPricedFuseAsset,
  action: ActionType,
  comptrollerAddress: string
  userAddress: string
}) => {
  const { pool } = usePoolContext()

  const [activeStep, setActiveStep] = useState<number | undefined>()
  const steps: string[] = getSteps(action, market.membership)
  
  const increaseActiveStep = (step: string) => {
    setActiveStep(steps.indexOf(step));
  };

  useEffect(() => {
    if (activeStep === steps.length) {
      console.log("hello")
    }
  })

  // Triggered when the user is interacting with the market.
  const handleSubmitClick = useAuthedCallback(marketInteraction, [
    debouncedAmount,
    pool,
    market,
    action,
    increaseActiveStep,
    comptrollerAddress,
    !market.membership,
    userAddress
  ]);

  const isEmpty = debouncedAmount === "0" || debouncedAmount === ""
  const ButtonText = getButtonText(
    steps,
    activeStep,
    isEmpty
  )

  return (
    <>
      <Button
        alignSelf="stretch"
        onClick={handleSubmitClick}
        disabled={isEmpty}
      >
        {ButtonText}
      </Button>
      <Center color="white">
        {typeof activeStep === "undefined" ? null : <StepBubbles loading steps={steps.length} activeIndex={activeStep} />}
      </Center>
    </>
  )
}

const getButtonText = (
  steps: string[],
  activeStep: number | undefined,
  isEmpty: boolean
) => {
  if (activeStep === undefined) {
    return isEmpty ? "Please enter a valid amount" : "Approve"
  } else {
    return steps[activeStep]
  }
}

const getSteps = (action: ActionType, membership: boolean) => {
  switch (action) {
    case ActionType.borrow:
      return borrowSteps
    case ActionType.supply:
      if (membership) {
        return supplySteps
      }
      else return supplyApproveSteps
    case ActionType.repay:
      return repaySteps
    case ActionType.withdraw:
      return withdrawSteps
    default:
      return ['']
  }
}

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { usePoolContext } from "context/PoolContext";
import { Avatar, Box, Center, Flex, Spinner, Switch, VStack } from "@chakra-ui/react";
import { BigNumber, constants, utils } from "ethers";
import { TokenData } from "hooks/useTokenData";
import { PoolInstance, USDPricedFuseAsset } from "lib/esm/types";
import {
  Badge,
  Button,
  Card,
  ExpandableCard,
  Heading,
  Text,
  TokenAmountInput,
  StepBubbles
} from "rari-components";
import { getMillions, convertMantissaToAPY } from "utils/formatters";
import { useAuthedCallback } from "hooks/useAuthedCallback";
import { marketInteraction } from "utils/marketInteraction";
import { Stats } from "./Stats";
import useDebounce from "hooks/useDebounce";
import { ActionType } from "./pages/Pool";
import { fetchMaxAmount } from "utils/fetchMaxAmount";
import { useRari } from "context/RariContext";
import { formatUnits, parseUnits } from "ethers/lib/utils";

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
  const { pool, poolInfo } = usePoolContext()
  const isSupply = action === ActionType.supply;

  const APY = convertMantissaToAPY(
    isSupply ? marketData.supplyRatePerBlock : marketData.borrowRatePerBlock,
    365
  );

  if (!pool || !poolInfo) return (
    <Center>
      <Spinner />
    </Center>
  )
  return (
    <ExpandableCard
      p={4}
      py={6}
      width="100%"
      variant="light"
      inAccordion={true}
      expandableChildren={
        <Internal
          market={marketData}
          action={action}
          index={index}
          pool={pool}
          tokenData={tokenData}
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
      <Text variant="secondary" mr
        ="1.5vh" ml="1.5vh">
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
  pool,
  tokenData
}: {
  market: USDPricedFuseAsset;
  index: number;
  action: ActionType;
  pool: PoolInstance;
  tokenData: TokenData;
}) => {
  const { address } = useRari()
  const { marketsDynamicData, poolInfo, balances } = usePoolContext();

  const balance = parseFloat(formatUnits(market.underlyingBalance, market.underlyingDecimals)).toFixed(2)

  const [amount, setAmount] = useState<string>("0");
  const [enterMarket, setEnterMarket] = useState<boolean>(market.membership)

  const debouncedAmount = useDebounce(amount, 1000);

  const maxClickHandle = async () => {
    if (!address) return
    const answer: number = await fetchMaxAmount(action, pool, address, market)
    setAmount(formatUnits(answer, market.underlyingDecimals))
  }

  const isEmpty = debouncedAmount === "0" || debouncedAmount === ""

  return (
    <VStack spacing={4} alignItems="stretch" background="#F0F0F0">
      <TokenAmountInput
        border="none"
        variant="light"
        tokenSymbol={tokenData?.symbol}
        tokenAddress={market.underlyingToken}
        value={amount}
        onChange={(e: any) => setAmount(e.target.value)}
        onClickMax={maxClickHandle}
      />
      {!address ? null : <Text ml={"auto"} color="grey" fontWeight={"medium"}> You have {balance} {tokenData?.symbol}</Text> }
      {!marketsDynamicData || isEmpty ? null : (
        <>
          <Stats
            marketData={market}
            amount={debouncedAmount}
            action={action}
            markets={marketsDynamicData?.assets}
            index={index}
            enterMarket={enterMarket}
          />
        </>
      )}
      <SubmitButton 
        debouncedAmount={debouncedAmount}
        market={market}
        action={action}
      />
    </VStack>
  )
}

const supplySteps = [
  "Approving market",
  "Approving Asset",
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
  action
}: {
  debouncedAmount: string,
  market: USDPricedFuseAsset,
  action: ActionType
}) => {
  const { pool, poolInfo } = usePoolContext()

  const [activeStep, setActiveStep] = useState<number | undefined>()
  const steps: string[] = getSteps(action)

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
    poolInfo?.comptroller,
    true
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
      <Center>
        {typeof activeStep === "undefined" ? null : <StepBubbles steps={steps.length} activeIndex={activeStep} />}
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

const getSteps = (action: ActionType) => {
  switch (action) {
    case ActionType.borrow:
      return borrowSteps
    case ActionType.supply:
      return supplySteps
    case ActionType.repay:
      return repaySteps
    case ActionType.withdraw:
      return withdrawSteps
    default:
      return ['']
  }
}


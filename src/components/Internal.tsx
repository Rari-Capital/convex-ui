import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PoolInstance, USDPricedFuseAsset } from "lib/esm/types";
import { BigNumber, constants, utils } from "ethers";
import {
  Button,
  Text,
  TokenAmountInput,
  StepBubbles
} from "rari-components";
import {
  VStack,
  Flex,
  Center,
} from "@chakra-ui/react";
import { useRari } from "context/RariContext";
import { usePoolContext } from "context/PoolContext";
import { Stats } from "./Stats";
import { marketInteraction } from "utils/marketInteraction";
import { useAuthedCallback } from "hooks/useAuthedCallback";
import { ActionType } from "./pages/Pool";
import { fetchMaxAmount } from "utils/fetchMaxAmount";
import useDebounce from "hooks/useDebounce";
import { TokenData } from "hooks/useTokenData";
import { formatEther, formatUnits, parseUnits } from "ethers/lib/utils";
import { useQueryClient } from "react-query";

export const Internal = ({
  isBorrowing,
  market,
  index,
  action,
  pool,
  tokenData,
  isPosition,
  setIndex
}: {
  isBorrowing: boolean;
  market: USDPricedFuseAsset;
  index: number;
  action: ActionType;
  pool: PoolInstance;
  tokenData: TokenData;
  isPosition: boolean;
  setIndex: Dispatch<SetStateAction<number | undefined>>;
}) => {
  const { address } = useRari();
  const { marketsDynamicData, poolInfo } = usePoolContext();

  const balance = parseFloat(
    formatUnits(market.underlyingBalance, market.underlyingDecimals)
  ).toFixed(2);

  // Will determine actionType and amount to send for interaction.
  const [internalAction, setAction] = useState<ActionType>(action);
  const [amount, setAmount] = useState<string>("0");

  const debouncedAmount = useDebounce(amount, 1000);

  // Triggered to get max amount user can use for a given actionType.
  const maxClickHandle = async () => {
    if (!address) return
    const answer: number = await fetchMaxAmount(internalAction, pool, address, market)

    setAmount(
      internalAction === ActionType.SUPPLY || internalAction === ActionType.BORROW ?
        formatUnits(answer, market.underlyingDecimals) : formatEther(answer)
    );
  }

  const [activeStep, setActiveStep] = useState<number | undefined>();
  const steps: Step[] = getSteps(internalAction);

  const increaseActiveStep = (step: number) => {
    setActiveStep(step);
  };

  const queryClient = useQueryClient();
  useEffect(() => {
    if (activeStep === (steps.length - 1)) {
      queryClient.refetchQueries();
      setActiveStep(undefined)
      setAmount("0")
      setIndex(-1)

    }
  });

  const isEmpty = debouncedAmount === "0" || debouncedAmount === "";
  const buttonText = getButtonText(
    steps,
    activeStep,
    isEmpty,
    parseUnits(debouncedAmount === "" ? "0" : debouncedAmount, market.underlyingDecimals),
    market,
    internalAction
  );

  if (!poolInfo || !address) return null

  return (
    <>
      {isPosition ?
        <Flex width="70%" justifyContent="space-between">
          <Button
            width="48%"
            onClick={() =>
              setAction(isBorrowing ? ActionType.BORROW : ActionType.SUPPLY)
            }
            opacity={internalAction === ActionType.BORROW || internalAction === ActionType.SUPPLY ? 1 : 0.5}
          >
            {isBorrowing ? "Borrow" : "Supply"}
          </Button>
          <Button
            opacity={internalAction === ActionType.REPAY || internalAction === ActionType.WITHDRAW ? 1 : 0.5}
            width="48%"
            onClick={() =>
              setAction(isBorrowing ? ActionType.REPAY : ActionType.WITHDRAW)
            }
          >
            {isBorrowing ? "Repay" : "Withdraw"}
          </Button>
        </Flex> : null
      }
      <VStack mt={4} spacing={4} alignItems="stretch">
        <TokenAmountInput
          size="lg"
          variant="light"
          value={amount}
          tokenSymbol={tokenData?.symbol}
          tokenAddress={market.underlyingToken}
          onChange={(newValue: any) => setAmount(newValue)}
          onClickMax={maxClickHandle}
          mb={0}
        />
        {action === ActionType.SUPPLY && (
          <Text alignSelf="flex-end" color="grey" fontWeight={"medium"} fontSize="sm"> You have {utils.commify(balance)} {tokenData?.symbol}</Text>
        )}
        {!marketsDynamicData || debouncedAmount === "" || debouncedAmount === "0" ? null : (
          <Stats
            amount={debouncedAmount}
            action={internalAction}
            index={index}
            markets={marketsDynamicData?.assets}
            marketData={market}
            tokenData={tokenData}
          />
        )}
        <SubmitButton
          debouncedAmount={debouncedAmount}
          market={market}
          action={internalAction}
          steps={steps}
          activeStep={activeStep}
          increaseActiveStep={increaseActiveStep}
          buttonText={buttonText}
        />
      </VStack>
    </>
  );
};

type Step = {
  name: string;
  buttonText: string;
};

const supplySteps: Step[] = [
  {
    name: "Approve Asset",
    buttonText: "Approving Asset..",
  },
  {
    name: "Entering Market",
    buttonText: "Entering market..",
  },
  {
    name: "Supply",
    buttonText: "Supplying...",
  },
  {
    name: "Done",
    buttonText: "Done!",
  },
];

const borrowSteps: Step[] = [
  {
    name: "Borrow Asset",
    buttonText: "Borrowing Asset..",
  },

  {
    name: "Done",
    buttonText: "Done!",
  },
];

const withdrawSteps: Step[] = [
  {
    name: "Withdraw Asset",
    buttonText: "Withdraw Asset....",
  },
  {
    name: "Done",
    buttonText: "Done!",
  },
];

const repaySteps: Step[] = [
  {
    name: "Repaying Debt",
    buttonText: "Repaying Debt..",
  },
  {
    name: "Done",
    buttonText: "Done!",
  }
];

const SubmitButton = ({
  debouncedAmount,
  market,
  action,
  steps,
  activeStep,
  buttonText,
  increaseActiveStep,
}: {
  debouncedAmount: string;
  market: USDPricedFuseAsset;
  action: ActionType;
  steps: Step[];
  activeStep: number | undefined;
  increaseActiveStep: (step: number) => void;
  buttonText: {
    text: string,
    isValid: boolean
  }
}) => {
  const { address } = useRari();
  const { pool, poolInfo } = usePoolContext();

  // Triggered when the user is interacting with the market.
  const handleSubmitClick = useAuthedCallback(marketInteraction, [
    debouncedAmount,
    pool,
    market,
    action,
    increaseActiveStep,
    poolInfo?.comptroller,
    !market.membership,
    address,
  ]);

  return (
    <>
      <Button
        alignSelf="stretch"
        onClick={handleSubmitClick}
        disabled={!buttonText.isValid}
      >
        {buttonText.text}
      </Button>
      <Center color="white">
        {typeof activeStep === "undefined" ? null : (
          <StepBubbles loading steps={steps.length} activeIndex={activeStep} />
        )}
      </Center>
    </>
  );
};

/*
  Account for
   - You don't have this much to supply 
   - If it's supply and you've approved then you should go to the next step
   - If it's supply and you've entered markets then u should go to next step
*/
const getButtonText = (
  steps: Step[],
  activeStep: number | undefined,
  isEmpty: boolean,
  amount: BigNumber,
  market: USDPricedFuseAsset,
  action: ActionType
) => {
  if (activeStep === undefined) {
    if (isEmpty) {
      return {
        text: "Please enter a valid amount",
        isValid: false
      }
    }
    if (action === ActionType.SUPPLY && amount.gt(market.underlyingBalance)) {
      return "You cannot supply this much.";
    }
    if (action === ActionType.WITHDRAW && amount.gt(market.supplyBalance)) {
      return "You cannot withdraw this much.";
    }
    return {
      text: action,
      isValid: true
    }
  } else {
    return {
      text: steps[activeStep].buttonText,
      isValid: false
    }
  }
};

const getSteps = (action: ActionType): Step[] => {
  switch (action) {
    case ActionType.BORROW:
      return borrowSteps;
    case ActionType.SUPPLY:
      return supplySteps;
    case ActionType.REPAY:
      return repaySteps;
    case ActionType.WITHDRAW:
      return withdrawSteps;
    default:
      return [];
  }
};
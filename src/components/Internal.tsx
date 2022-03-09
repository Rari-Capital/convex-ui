import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {  PoolInstance, USDPricedFuseAsset } from "lib/esm/types";
import { BigNumber } from "ethers";
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
import { formatUnits, parseUnits } from "ethers/lib/utils";
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
  
    const [isApproved, setIsApproved] = useState(false);
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
      setAmount(formatUnits(answer, market.underlyingDecimals));
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
      isApproved,
      internalAction
    );
  
    if (!poolInfo || !address) return null

    return (
      <>
      { isPosition ?
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
              onChange={(newValue: any) => setAmount(newValue.target.value)}
              onClickMax={maxClickHandle}
            />
            <Text ml={"auto"} color="grey" fontWeight={"medium"}> You have {balance} {tokenData?.symbol}</Text>
            {!marketsDynamicData || debouncedAmount === "" || debouncedAmount === "0" ? null : (
              <Stats
                amount={debouncedAmount}
                action={internalAction}
                index={index}
                markets={marketsDynamicData?.assets}
                marketData={market}
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
    buttonText: string;
  }) => {
    const { address } = useRari();
    const { pool, poolInfo } = usePoolContext();
    console.log({steps})
  
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
  
    const isEmpty = debouncedAmount === "0" || debouncedAmount === "";
  
    return (
      <>
        <Button
          alignSelf="stretch"
          onClick={handleSubmitClick}
          disabled={isEmpty}
        >
          {buttonText}
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
    isApproved: boolean,
    action: ActionType
  ) => {
    if (activeStep === undefined) {
      if (isEmpty) {
        return "Please enter a valid amount";
      }
      if (amount.gt(market.underlyingBalance)) {
        return "You do not enough balance.";
      }
      return action;
    } else {
      return steps[activeStep].buttonText;
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
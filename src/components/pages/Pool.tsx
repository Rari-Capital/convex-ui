import { Accordion, Box, ModalOverlay, Spinner, Stack, VStack } from "@chakra-ui/react";
import { usePoolContext } from "context/PoolContext";
import { BigNumber, constants } from "ethers";
import { Button, Heading } from "rari-components";
import MarketCard from "components/MarketCard";
import Positions from "components/Positions";
import { useTokensDataAsMap } from "hooks/useTokenData";
import { useState } from "react";
import { useRari } from "context/RariContext";
import { useAuthedCallback } from "hooks/useAuthedCallback";
import { CTokenInfoModal } from "components/CTokenInfoModal";

export enum ActionType {
  SUPPLY = "Supply",
  BORROW = "Borrow",
  WITHDRAW = "Withdraw",
  REPAY = "Repay",
  ENTER_MARKET = "Enter Market",
}

const Pool = () => {
  const { poolInfo, marketsDynamicData, openCTokenInfo} = usePoolContext();
  const { isAuthed, login } = useRari();
  const [index, setIndex] = useState<number | undefined>()

  const hasSupplied = marketsDynamicData?.totalSupplyBalanceUSD.gt(
    constants.Zero
  );

  const tokensData = useTokensDataAsMap(
    marketsDynamicData?.assets.map(({ underlyingToken }) => underlyingToken)
  );

  const handleAccordionChange = (i: number) => {
    if (isAuthed) {
      setIndex(i)
      return
    }
    login()
    setIndex(-1)
  }

  const showActivePositions = !!(hasSupplied && marketsDynamicData && isAuthed);

  return (
    <>
    <CTokenInfoModal />
    <Box>
      {(showActivePositions  ) && (
        <>
          <Heading size="md" color="white">
            Active Positions
          </Heading>
          <Positions
            marketsDynamicData={marketsDynamicData}
            tokensData={tokensData}
          />
        </>
      )}
      {/* If active positions aren't shown, this `Heading` will be over a black
      background, so we should invert the color. */}
      <Heading size="md" color={showActivePositions ? "black" : "white"}>
        Markets
      </Heading>
      <Stack mt={4} width="100%" direction={["column", "row"]} spacing={2}>
        <VStack alignItems="stretch" spacing={2} flex={1}>
          <Accordion allowToggle index={index} onChange={(i: number) => handleAccordionChange(i)}>
            <VStack alignItems="stretch" spacing={2} flex={1}>
              {marketsDynamicData
                  ? marketsDynamicData.assets?.map((market, i) =>
                      market.supplyBalanceUSD.gt(1) ? null : (
                        <MarketCard
                          markets={marketsDynamicData?.assets}
                          marketData={market}
                          index={i}
                          key={i}
                          action={ActionType.SUPPLY}
                          tokenData={tokensData[market.underlyingToken]}
                          setIndex={setIndex}
                        />
                      )
                    )
                  : Array.from({ length: 6 }).map((_, i) => (
                      <MarketCard.Skeleton key={i} />
                    ))}
            </VStack>
          </Accordion>
        </VStack>
        <VStack alignItems="stretch" spacing={2} flex={1}>
          <Accordion allowToggle  index={index} onChange={(i: number) => handleAccordionChange(i)}>
            <VStack alignItems="stretch" spacing={2} flex={1}>
              {marketsDynamicData ?
                marketsDynamicData?.assets?.map((market, i) =>
                  market.borrowGuardianPaused ||
                    market.borrowBalanceUSD.gt(constants.Zero) ? null : (
                    <MarketCard
                      markets={marketsDynamicData?.assets}
                      index={i}
                      marketData={market}
                      key={i}
                      action={ActionType.BORROW}
                      tokenData={tokensData[market.underlyingToken]}
                      setIndex={setIndex}
                    />
                  )
                 ) : Array.from({ length: 6 }).map((_, i) => (
                  <MarketCard.Skeleton key={i} />
                ))}
            </VStack>
          </Accordion>
        </VStack>
      </Stack>
    </Box>
    </>
  );
};

export default Pool;

// Port over to sdk
export const toInt = (input: BigNumber) => {
  if (!input) return 0;
  return parseInt(input.toString());
};

const getMillions = (bn: BigNumber) => {
  const number = parseFloat(bn.toString());

  return (number / 1000000).toFixed(1);
};

export const convertMantissaToAPY = (mantissa: any, dayRange: number = 35) => {
  const parsedMantissa = toInt(mantissa);
  return (Math.pow((parsedMantissa / 1e18) * 6500 + 1, dayRange) - 1) * 100;
};

export const convertMantissaToAPR = (mantissa: any) => {
  const parsedMantissa = toInt(mantissa);
  return (parsedMantissa * 2372500) / 1e16;
};

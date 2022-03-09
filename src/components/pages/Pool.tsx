import { Accordion, Box, Spinner, Stack, VStack } from "@chakra-ui/react";
import { usePoolContext } from "context/PoolContext";
import { BigNumber, constants } from "ethers";
import { Heading } from "rari-components";
import MarketCard from "components/MarketCard";
import Positions from "components/Positions";
import { useTokensDataAsMap } from "hooks/useTokenData";
import { useState } from "react";

export enum ActionType {
  SUPPLY = "Supply",
  BORROW ="Borrow",
  WITHDRAW = "Withdraw",
  REPAY = "Repay",
  ENTER_MARKET = "Enter Market",
}

const Pool = () => {
  const { poolInfo, marketsDynamicData } = usePoolContext();
  const [index, setIndex] = useState<number | undefined>()

  const hasSupplied = marketsDynamicData?.totalSupplyBalanceUSD.gt(
    constants.Zero
  );

  const tokensData = useTokensDataAsMap(
    marketsDynamicData?.assets.map(({ underlyingToken }) => underlyingToken)
  );

  const showActivePositions = !!(hasSupplied && marketsDynamicData);

  const supplyAssets = marketsDynamicData?.assets?.filter((market => !market.supplyBalanceUSD.gt(0))).sort((a, b) => {
    if (a.underlyingBalance.lt(b.underlyingBalance)) {
      return 1
    } else if (b.underlyingBalance.lt(a.underlyingBalance)) {
      return -1
    } else {
      return 0
    }
  }) ?? []

  if (!poolInfo) return <Spinner />;

  return (
    <Box>
      {showActivePositions && (
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
          <Accordion allowToggle index={index} onChange={(i: number) => setIndex(i)}>
            <VStack alignItems="stretch" spacing={2} flex={1}>
              {marketsDynamicData && supplyAssets.map((market, i) =>
                market.supplyBalanceUSD.gt(0) ? null : (
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
              )}
            </VStack>
          </Accordion>
        </VStack>
        <VStack alignItems="stretch" spacing={2} flex={1}>
          <Accordion allowToggle>
            <VStack alignItems="stretch" spacing={2} flex={1}>
              {marketsDynamicData?.assets?.map((market, i) =>
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
              )}
            </VStack>
          </Accordion>
        </VStack>
      </Stack>
    </Box>
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

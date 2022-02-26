import { animate, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { Card, Heading, Statistic } from "rari-components";
import { Box, Stack } from "@chakra-ui/react";
import { useRari } from "context/RariContext";
import { usePoolContext } from "context/PoolContext";
import { smallUsdFormatter } from "utils/formatters";

export const PoolOverview = () => {
  const { address } = useRari();
  const { markets } = usePoolContext();

  // Show total market statistics if user's wallet is not connected.
  const heading = !!address ? "Portfolio Overview" : "Pool Overview";
  const supplyStatisticTitle = !!address ? "You Supplied" : "Total Supplied";
  const borrowStatisticTitle = !!address ? "You Borrowed" : "Total Borrowed";
  const supplyStatisticValue =
    (!!address
      ? markets?.totalSupplyBalanceUSD
      : markets?.totalSuppliedUSD
    )?.toNumber() ?? 0;
  const borrowStatisticValue =
    (!!address
      ? markets?.totalBorrowBalanceUSD
      : markets?.totalBorrowedUSD
    )?.toNumber() ?? 0;

  // Initialize animated values at 0.
  const supplyStatisticInitialValue = useMotionValue(0);
  const borrowStatisticInitialValue = useMotionValue(0);

  // Store displayed values in state
  const [supplyStatisticDisplayedValue, setSupplyStatisticDisplayedValue] =
    useState(supplyStatisticInitialValue.get());
  const [borrowStatisticDisplayedValue, setBorrowStatisticDisplayedValue] =
    useState(borrowStatisticInitialValue.get());

  useEffect(() => {
    // Animate displayed values up to actual values. `duration` is in seconds.
    const supplyStatisticValueAnimation = animate(
      supplyStatisticInitialValue,
      supplyStatisticValue,
      {
        duration: 1,
        onUpdate(value) {
          setSupplyStatisticDisplayedValue(value);
        },
      }
    );
    const borrowStatisticValueAnimation = animate(
      borrowStatisticInitialValue,
      borrowStatisticValue,
      {
        duration: 1,
        onUpdate(value) {
          setBorrowStatisticDisplayedValue(value);
        },
      }
    );

    return () => {
      supplyStatisticValueAnimation.stop();
      borrowStatisticValueAnimation.stop();
    };
  }, [supplyStatisticValue, borrowStatisticValue]);

  return (
    <Box paddingTop={16}>
      <Heading size="md">{heading}</Heading>
      <Stack paddingTop={8} spacing={8} direction={["column", "row"]}>
        <Card minW={"225px"} minH="130px">
          <Statistic
            title={supplyStatisticTitle}
            value={smallUsdFormatter(supplyStatisticDisplayedValue)}
          />
        </Card>
        <Card minW={"225px"}>
          <Statistic
            title={borrowStatisticTitle}
            value={smallUsdFormatter(borrowStatisticDisplayedValue)}
          />
        </Card>
      </Stack>
    </Box>
  );
};

export default PoolOverview;

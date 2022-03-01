import { Box, Stack } from "@chakra-ui/react";
import { useRari } from "context/RariContext";
import { usePoolContext } from "context/PoolContext";
import { animate, useMotionValue } from "framer-motion";
import { Card, Heading, Progress, Statistic, Text } from "rari-components";
import { useEffect, useState } from "react";
import { smallUsdFormatter } from "utils/formatters";

export const PoolOverview = () => {
  const { address } = useRari();
  const { marketsDynamicData } = usePoolContext();

  // Show total market statistics if user's wallet is not connected.
  const heading = !!address ? "Portfolio Overview" : "Pool Overview";
  const supplyStatisticTitle = !!address ? "You Supplied" : "Total Supplied";
  const borrowStatisticTitle = !!address ? "You Borrowed" : "Total Borrowed";
  const supplyStatisticValue =
    (!!address
      ? marketsDynamicData?.totalSupplyBalanceUSD
      : marketsDynamicData?.totalSuppliedUSD
    )?.toNumber() ?? 0;
  const borrowStatisticValue =
    (!!address
      ? marketsDynamicData?.totalBorrowBalanceUSD
      : marketsDynamicData?.totalBorrowedUSD
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
        <Card minWidth={48}>
          <Statistic
            title={supplyStatisticTitle}
            value={smallUsdFormatter(supplyStatisticDisplayedValue)}
          />
        </Card>
        <Card minWidth={48}>
          <Statistic
            title={borrowStatisticTitle}
            value={smallUsdFormatter(borrowStatisticDisplayedValue)}
          />
        </Card>
        <Card justifyContent="center" flex={1}>
          <Text variant="secondary" fontSize="sm" mb={2}>
            Borrow Balance
          </Text>
          <Progress variant="light" barVariant="gradient" value={80} />
        </Card>
      </Stack>
    </Box>
  );
};

export default PoolOverview;

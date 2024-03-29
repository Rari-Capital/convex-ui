import { Box, Stack, Flex, VStack, HStack, BoxProps, Skeleton } from "@chakra-ui/react";
import { useRari } from "context/RariContext";
import { usePoolContext } from "context/PoolContext";
import { animate, useMotionValue } from "framer-motion";
import { Card, Heading, Progress, Statistic as RariStatistic, Text } from "rari-components";
import React, { useEffect, useMemo, useState } from "react";
import { smallUsdFormatter } from "utils/formatters";
import { utils } from "ethers";

// TODO(nathanhleung)
// Consider creating skeleton components for all components in rari-components
// accessible at `<Component>.Skeleton`.
const Statistic: typeof RariStatistic & {
  Skeleton: React.FC;
} = Object.assign(RariStatistic, {
  Skeleton: () => (
    <Stack mr={4}>
      <Skeleton height={5} width={24} />
      <Skeleton height={9} width={48} />
    </Stack>
  )
});

export const PoolOverview: React.FC<BoxProps> = (props) => {
  const { address } = useRari();
  const {
    marketsDynamicData,
    borrowLimit,
    userHealth: _userHealth,
  } = usePoolContext();

  // Show total market statistics if user's wallet is not connected.
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
  let borrowPercentageValue = _userHealth ?? 0;

  // Initialize animated values at 0.
  const supplyStatisticInitialValue = useMotionValue(0);
  const borrowStatisticInitialValue = useMotionValue(0);
  const borrowPercentageInitialValue = useMotionValue(0);

  // Store displayed values in state
  const [supplyStatisticDisplayedValue, setSupplyStatisticDisplayedValue] =
    useState(supplyStatisticInitialValue.get());
  const [borrowStatisticDisplayedValue, setBorrowStatisticDisplayedValue] =
    useState(borrowStatisticInitialValue.get());
  const [borrowPercentageDisplayedValue, setBorrowPercentageDisplayedValue] =
    useState(borrowPercentageInitialValue.get());

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
    const borrowPercentageValueAnimation = animate(
      borrowPercentageInitialValue,
      borrowPercentageValue,
      {
        duration: 1,
        onUpdate(value) {
          setBorrowPercentageDisplayedValue(value);
        },
      }
    );

    return () => {
      supplyStatisticValueAnimation.stop();
      borrowStatisticValueAnimation.stop();
      borrowPercentageValueAnimation.stop();
    };
  }, [supplyStatisticValue, borrowStatisticValue, borrowPercentageValue]);

  let color;
  if (borrowPercentageValue < 25) {
    color = "linear-gradient(90.12deg, #4AFA5B 5.91%, #40FFBA 96.27%)";
  } else if (borrowPercentageValue < 70) {
    color = "linear-gradient(90.12deg, #40C6FF 5.91%, #4A5BFA 96.27%)";
  } else {
    color = "linear-gradient(90.12deg, #F67B36 5.91%, #F64D36 96.27%)";
  }

  return (
    <Flex justify="center" align="center" {...props}>
      <VStack align="stretch">
        <HStack>
          <Card minWidth={48} p={4}>
            {marketsDynamicData ? <Statistic
              title={supplyStatisticTitle}
              value={smallUsdFormatter(supplyStatisticDisplayedValue)}
            /> : <Statistic.Skeleton />}
          </Card>
          <Card minWidth={48} p={4}>
            {marketsDynamicData ? <Statistic
              title={borrowStatisticTitle}
              value={smallUsdFormatter(borrowStatisticDisplayedValue)}
            /> : <Statistic.Skeleton />}
          </Card>
        </HStack>
        {!!address && (
          <HStack>
            <Card justifyContent="center" flex={1} w="100%" p={4}>
              <Text variant="secondary" fontSize="sm" mb={2}>
                Borrow Balance
              </Text>
              <Progress
                fontSize="10px"
                height={5}
                variant="light"
                barVariant={color}
                value={borrowPercentageDisplayedValue}
              />
              <Flex justifyContent="space-between" mt="1">
                <Text variant="secondary" fontSize="sm">
                  $0
                </Text>
                <Text variant="secondary" fontSize="sm">
                  ${utils.commify(borrowLimit ?? 0)}
                </Text>
              </Flex>
            </Card>
          </HStack>
        )}
      </VStack>
    </Flex>
  );
};

export default PoolOverview;

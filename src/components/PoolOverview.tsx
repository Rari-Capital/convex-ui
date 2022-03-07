import { Box, Stack, Flex, VStack, HStack, BoxProps } from "@chakra-ui/react";
import { useRari } from "context/RariContext";
import { usePoolContext } from "context/PoolContext";
import { animate, useMotionValue } from "framer-motion";
import { Card, Heading, Progress, Statistic, Text } from "rari-components";
import React, { useEffect, useMemo, useState } from "react";
import { smallUsdFormatter } from "utils/formatters";

export const PoolOverview: React.FC<BoxProps> = ({ ...restProps }) => {
  const { address } = useRari();
  const { marketsDynamicData, borrowLimit, userHealth: _userHealth } = usePoolContext();
  
  let userHealth = 80

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


  const color = useMemo(() => {
    if (userHealth < 25) return 'linear-gradient(90.12deg, #4AFA5B 5.91%, #40FFBA 96.27%)'
    else if (userHealth < 70) return 'linear-gradient(90.12deg, #40C6FF 5.91%, #4A5BFA 96.27%)'
    else return 'linear-gradient(90.12deg, #F67B36 5.91%, #F64D36 96.27%)'
  }, [userHealth])

  return (
    <Flex justify="center" align="center" {...restProps}>
      <VStack align="stretch">
        <HStack>
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
        </HStack>
        {!!address && (
          <HStack>
            <Card justifyContent="center" flex={1} w="100%" p={3}>
              <Text variant="secondary" fontSize="sm" mb={2}>
                Borrow Balance
              </Text>
              <Progress variant="light" barVariant={color} value={userHealth} height={4} />
            </Card>
          </HStack>
        )}
      </VStack>
      {/* 
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
          <Progress variant="light" barVariant="gradient" value={userHealth} />
        </Card>
      </Stack> */}
    </Flex>
  );
};

export default PoolOverview;

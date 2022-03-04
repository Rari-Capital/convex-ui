import { Accordion, Box,  Spinner, Stack, VStack } from "@chakra-ui/react";
import { usePoolContext } from "context/PoolContext";
import { useRari } from "context/RariContext";
import { BigNumber, constants } from "ethers";
// import { useBorrowLimit } from "hooks/useBorrowLimit";
import { Heading } from "rari-components";
import MarketCard from "components/MarketCard";
import Positions from "components/Positions";
// import { useEffect } from 'react'
// import { convexAPR } from 'utils/convex/convex2'

const Pool = () => {
  const { address, provider } = useRari();
  const { poolInfo, marketsDynamicData } = usePoolContext();
  
  const hasSupplied = marketsDynamicData?.totalSupplyBalanceUSD.gt(constants.Zero)

  if (!poolInfo) return <Spinner />;

  return (
    <Box>
      <Heading size="md" color="white">
        Active Positions
      </Heading>
      { marketsDynamicData?.totalSupplyBalanceUSD.gt(constants.Zero) ?
            <Positions marketsDynamicData={marketsDynamicData} />
        : null
      }
      <Heading size="md" color="black">
        Markets
      </Heading>
      <Stack mt={4} width="100%" direction={["column", "row"]} spacing={4}>
          <Accordion allowToggle>
            <VStack alignItems="stretch" spacing={4} flex={1}>
              {marketsDynamicData?.assets?.map((market, i) => ( market.supplyBalanceUSD.gt(0) ? null :
                <MarketCard markets={marketsDynamicData?.assets} marketData={market} index={i} key={i} type="supply"/>
              ))}
            </VStack>
          </Accordion>
          <Accordion allowToggle>
            <VStack alignItems="stretch" spacing={4} flex={1}>
            {marketsDynamicData?.assets?.map((market, i) => market.borrowGuardianPaused || market.borrowBalanceUSD.gt(constants.Zero) ?  null : (
              <MarketCard markets={marketsDynamicData?.assets} index={i} marketData={market} key={i} type="borrow"/>
            )) }
            </VStack>
          </Accordion>
      </Stack>
    </Box>
  );
};

export default Pool;


// Port over to sdk
export const toInt = (input: BigNumber) => {
  if (!input) return 0
  return parseInt(input.toString())
}

const getMillions = (bn: BigNumber) => {
  const number  = parseFloat(bn.toString())

  return (number / 1000000).toFixed(1)
}

export const convertMantissaToAPY = (mantissa: any, dayRange: number = 35) => {
  const parsedMantissa = toInt(mantissa)
  return (Math.pow((parsedMantissa / 1e18) * 6500 + 1, dayRange) - 1) * 100;
};

export const convertMantissaToAPR = (mantissa: any) => {
  const parsedMantissa = toInt(mantissa)
  return (parsedMantissa * 2372500) / 1e16;
};


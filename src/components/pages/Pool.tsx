import { Accordion, Box, Flex, Spacer, Spinner, Stack, VStack } from "@chakra-ui/react";
import { usePoolContext } from "context/PoolContext";
import { useRari } from "context/RariContext";
import { BigNumber, providers, utils, constants } from "ethers";
// import { useBorrowLimit } from "hooks/useBorrowLimit";
import { MarketsWithData, USDPricedFuseAsset } from "lib/esm/types";
import {
  Badge,
  Button,
  ExpandableCard,
  Heading,
  StatisticTable,
  Text,
  TokenAmountInput,
  TokenIcon,
} from "rari-components";
import { useState } from "react";
import { useQuery } from "react-query";
import { useAccount, useConnect } from "wagmi";
import MarketCard from "components/MarketCard";
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
          <VStack mt={4} mb={8} align="stretch" spacing={4}>
            <Positions marketsDynamicData={marketsDynamicData} />
          </VStack>
        : null
      }
      <Heading size="md" color="black">
        Markets
      </Heading>
      <Stack mt={4} width="100%" direction={["column", "row"]} spacing={4}>
        <VStack alignItems="stretch" spacing={4} flex={1}>
          <Accordion>
          {marketsDynamicData?.assets?.map((market, i) => ( market.supplyBalanceUSD.gt(0) ? null :
            <MarketCard marketData={market} key={i} type="supply"/>
          ))}
          </Accordion>
        </VStack>
        <VStack alignItems="stretch" spacing={4} flex={1}>
          <Accordion>
          {marketsDynamicData?.assets?.map((market, i) => market.borrowGuardianPaused || market.borrowBalanceUSD.gt(constants.Zero) ?  null : (
            <MarketCard marketData={market} key={i} type="borrow"/>
          )) }
          </Accordion>
        </VStack>
      </Stack>
    </Box>
  );
};

export default Pool;

const Positions = ({marketsDynamicData}: {marketsDynamicData: MarketsWithData}) => {

  return (
    <>  {
      marketsDynamicData.assets.map((market, i) => {
        if (market.supplyBalanceUSD.gt(constants.Zero) || market.borrowBalance.gt(constants.Zero)) {
        return (
            <PositionCard market={market} key={i}/>
          )}
        })
      }
    </>

  )
}

const PositionCard = ({market}: {market: USDPricedFuseAsset}) => {
  const isSupplying = market.supplyBalanceUSD.gt(constants.Zero)
  const isBorrowing = market.borrowBalanceUSD.gt(constants.Zero)

  return (
    <ExpandableCard
          variant="active"
          expandableChildren={
            <VStack spacing={4} alignItems="stretch">
              {/* <TokenAmountInput
                size="lg"
                variant="light"
                tokenSymbol={market.underlyingSymbol}
                tokenAddress={market.underlyingToken}
                onClickMax={() => {}}
              /> */}
              <StatisticTable
                variant="light"
                statistics={[
                  ["Supply Balance", "$24,456"],
                  ["Borrow Limit", "$18,543"],
                ]}
              />
              <Button alignSelf="stretch">Approve</Button>
            </VStack>
          }
        >
          <Flex alignItems="center" height="100%">
            <TokenIcon
              tokenAddress={market.underlyingToken}
              mr={4}
            />
            <Heading size="xl" mr={4}>
              {market.underlyingSymbol}
            </Heading>
            <Flex direction="column">
              {
                isSupplying ? <Badge variant="success">Supplying</Badge> : null
              } 

              {
                isBorrowing ? <Badge variant="warning">Borrowing</Badge> : null
              } 
            </Flex>

            <Spacer />

            { isSupplying ?
              <Box mr={8}>
                <Text variant="secondary" mb={1}>
                  Total Supplied
                </Text>
                <Heading size="lg">
                  ${utils.commify(market.supplyBalanceUSD.toString())}
                </Heading>
              </Box> : null
            }

            { isBorrowing ?
              <Box mr={8}>
                <Text variant="secondary" mb={1}>
                  Total Borrowed
                </Text>
                <Heading size="lg">
                  ${utils.commify(market.borrowBalanceUSD.toString())}
                </Heading>
              </Box> : null
            }
          </Flex>
        </ExpandableCard>
  )
}


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


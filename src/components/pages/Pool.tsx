import { Box, Flex, Spacer, Spinner, Stack, VStack } from "@chakra-ui/react";
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
          {marketsDynamicData?.assets?.map((market, i) => ( market.supplyBalanceUSD.gt(0) ? null :
            <MarketCard marketData={market} key={i} type="supply"/>
          ))}
        </VStack>
        <VStack alignItems="stretch" spacing={4} flex={1}>
          {marketsDynamicData?.assets?.map((market, i) => market.borrowGuardianPaused || market.borrowBalanceUSD.gt(constants.Zero) ?  null : (
            <MarketCard marketData={market} key={i} type="borrow" hasSupplied={hasSupplied}/>
          )) }
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
              <TokenAmountInput
                size="lg"
                variant="light"
                tokenSymbol={market.underlyingSymbol}
                tokenAddress={market.underlyingToken}
                onClickMax={() => {}}
              />
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

const MarketCard = ({
  marketData,
  type,
  hasSupplied
} : {
  marketData: USDPricedFuseAsset
  type: "supply" | "borrow"
  hasSupplied?: boolean
}) => {
  const [amount, setAmount] = useState<string>("")
  const { pool } = usePoolContext()
  const { isAuthed }= useRari()

  const [{ data: UsersConnector }, connect] = useConnect()
  const {data: signer} = useQuery('Users signer 1s', async () => {
    const  signer = await UsersConnector?.connector?.getSigner()
    const provider = await UsersConnector?.connector?.getProvider()
    const initiatedProvider = new providers.Web3Provider(provider)
    return signer
  })

  console.log({signer})

  const shouldBeDisabled = type === 'borrow' && !hasSupplied

  const handleClick = async () => {
    if (amount === "") return

    if (!isAuthed) { 
      // This should open connect modal
      return console.log('hello')
    }

    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

    switch (type) {
      case "supply":
          await pool?.checkAllowanceAndApprove(
            address,
            marketData.cToken,
            marketData.underlyingToken,
            parseInt(marketData.underlyingDecimals.toString()),
            amount,
            signer
          )

          
          await pool?.marketInteraction(
            'supply',
            marketData.cToken,
            amount,
            marketData.underlyingToken,
            signer,
            parseInt(marketData.underlyingDecimals.toString()),
          )
        break;

      case "borrow":
        await pool?.marketInteraction(
          'borrow',
          marketData.cToken,
          amount,
          marketData.underlyingToken,
          signer,
          parseInt(marketData.underlyingDecimals.toString()),
        )
        break;
    
      default:
        break;
    }
  }

  return (
    <ExpandableCard
        width="100%"
        variant="light"
        expandableChildren={
          <VStack spacing={4} alignItems="stretch">
            <TokenAmountInput
              variant="light"
              tokenSymbol={ marketData.underlyingSymbol}
              tokenAddress={marketData.underlyingToken}
              onChange={(e: any) => setAmount(e.target.value)}
              onClickMax={() => {}}
            />
            <Stats marketData={marketData} />          
            <Button onClick={handleClick} disabled={shouldBeDisabled}>Approve</Button>
          </VStack>
        }
      >
        <Flex alignItems="flex-start" id="hello" width="100%">
          <TokenIcon tokenAddress={marketData.underlyingToken} mr={4} />
          <Flex direction="column" width="100%">
            <Flex direction="column" width="100%">
              <Flex width="auto">
                <Heading size="lg" mr={4}>
                  {marketData.underlyingSymbol}
                </Heading>
                <Box alignSelf="center">
                  <Badge variant={type === "supply" ? "success" : "warning"}>
                    {type}
                  </Badge>
                </Box>
              </Flex>
            </Flex>
            <MarketTLDR 
              marketData={marketData} 
              type={type}
            />
          </Flex>
        </Flex>
      </ExpandableCard>
  )
}


const Stats = ({
  marketData
}: {
  marketData: USDPricedFuseAsset
}) => {
  const { borrowLimit } = usePoolContext()


  const currentSupplyBalanceUSD = utils.commify(marketData.supplyBalanceUSD.toString())
  const currentParsedLimit = utils.commify(borrowLimit ?? 0)
  const newSupplyBalanceUSD = currentSupplyBalanceUSD + 5

  return (
    <StatisticTable
              variant="light"
              statistics={[
                ["Supply Balance", currentSupplyBalanceUSD],
                ["Borrow Limit", currentParsedLimit],
              ]}
            />
  )
}

const MarketTLDR = ({
  marketData,
  type
} : {
  marketData: USDPricedFuseAsset,
  type: "supply" | "borrow"
}) => {

  const isSupply = type === "supply"
  const APY =  convertMantissaToAPY(
    isSupply 
      ? marketData.supplyRatePerBlock 
      : marketData.borrowRatePerBlock, 365
    )
 
  const Text1 = isSupply 
    ? `${utils.formatEther(marketData.collateralFactor.mul(100))}% LTV` 
    : `${getMillions(marketData.liquidityUSD)}M Liquidity`

  
  return (
    <Flex justifyContent="flex-start !important">
      <Text variant="secondary" alignSelf="flex-start"  mr="1.5vh">
        {Text1}
      </Text>

      &middot;

      <Text variant="secondary" mr="1.5vh" ml="1.5vh">
        {APY.toFixed(2)}% APY
      </Text>

      
      { 
      
      isSupply ? (
        <>
        &middot;
        <Text variant="secondary" ml="1.5vh">
          {getMillions(marketData.totalSupplyUSD)}M Supplied
        </Text>
        </>
      )
        : null 
      }
    </Flex>
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


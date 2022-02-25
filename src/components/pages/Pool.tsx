import { Heading, Spinner, Box, Text, HStack, VStack } from '@chakra-ui/react'
import { usePoolContext } from 'context/PoolContext'
import { useRari } from 'context/RariContext'
import usePoolData from 'hooks/pool/usePoolData'
import { Card } from 'rari-components'
import { useEffect, useState } from 'react'
import { convexAPR, ConvexData } from 'utils/convex/convex2'


// Convex Pools to get rewards APR from
const pools = ["frax", "steth", 'ust', 'tricrypto2']


const Pool = () => {
    const { provider } = useRari()
    const { poolInfo } = usePoolContext();

    const [convexPools, setConvexPools] = useState<(ConvexData | undefined)[]>([])

    useEffect(() => {
        Promise.all(pools.map(poolName => convexAPR(poolName, provider))).then(setConvexPools)
    }, [])


    if (!poolInfo) return <Spinner />

    return (
        <Box>
            {
                !!poolInfo ? <Heading>{poolInfo.name}</Heading> : <Spinner />
            }
            {convexPools.map((cvxPool) => {
                if (!cvxPool) return
                return (
                    <Card h="100%" w="1000px    " my={3} px={4}>
                        <Heading>{cvxPool.poolName}</Heading>
                        <HStack justify={"space-around"}>
                            <VStack align="flex-start">
                                <Text>APR: {cvxPool.apr.toFixed(2)} %</Text>
                                <Text>Reward Rate: {cvxPool.rate}</Text>
                                <Text>Supply: {cvxPool.supply}</Text>
                                <Text>Virtual Supply: {cvxPool.virtualSupplyUSD}</Text>
                            </VStack>
                            <VStack align="flex-start">
                                <Text>CRV Price: {cvxPool.crvPrice}</Text>
                                <Text>CVX Price: {cvxPool.cvxPrice}</Text>
                                <Text>CRV/yr: {cvxPool.crvPerYear}</Text>
                                <Text>CRV / underlying {cvxPool.crvPerUnderlying}</Text>
                            </VStack>
                        </HStack>
                    </Card>
                )
            })}
        </Box>
    )
}

export default Pool


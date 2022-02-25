import React from 'react'
import {
    Card,
    Heading,
    Statistic,
} from "rari-components";
import {
    Box,
    HStack,
} from "@chakra-ui/react";

import usePoolData from "hooks/pool/usePoolData";
import { useRari } from 'context/RariContext';
import { shortUsdFormatter } from 'utils/formatters';


const PoolOverview = () => {
    const { address } = useRari()
    const { markets } = usePoolData(156)

    const heading = !!address ? "Portfolio Overview" : "Pool Overview"

    const supplyText = !!address ? "You Supplied" : "Total Supplied"
    const supplyValue = shortUsdFormatter(!!address ? (markets?.totalSupplyBalanceUSD?.toString() ?? 0) : (markets?.totalSuppliedUSD?.toString() ?? 0))

    const borrowText = !!address ? "You Borrowed" : "Total Borrowed"
    const borrowValue = shortUsdFormatter(!!address ? (markets?.totalBorrowBalanceUSD?.toString() ?? 0) : (markets?.totalBorrowedUSD?.toString() ?? 0))

    return (
        <Box width="100%" paddingTop={16}>
            <Heading size="md">{heading}</Heading>
            <HStack paddingTop={8} spacing={8}>
                <Card minW={'225px'}>
                    <Statistic title={supplyText} value={supplyValue} />
                </Card>
                <Card minW={'225px'}>
                    <Statistic title={borrowText} value={borrowValue} />
                </Card>
            </HStack>
        </Box>
    )
}

export default PoolOverview
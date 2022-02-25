import { animate } from "framer-motion";
import { useEffect, useRef } from "react";
import {
    Card,
    Heading,
    Statistic,
} from "rari-components";
import {
    Box,
    HStack,
    Text
} from "@chakra-ui/react";
import { useRari } from 'context/RariContext';
import { usePoolContext } from "context/PoolContext";
import { shortUsdFormatter } from 'utils/formatters';

function Counter({ from, to }: { from: number, to: number }) {
    const nodeRef = useRef<HTMLParagraphElement>(null);
    useEffect(() => {
        const controls = animate(from, to, {
            duration: 1,
            onUpdate(_value) {
                let value = _value ?? 0
                if (nodeRef.current)
                    nodeRef.current.textContent = '$' + value.toFixed(2);
            }
        });

        return () => controls.stop();
    }, [from, to, nodeRef]);
    return <Text ref={nodeRef} />
}

export const PoolOverview = () => {
    const { address } = useRari()
    const { markets } = usePoolContext()

    const heading = !!address ? "Portfolio Overview" : "Pool Overview"

    const supplyText = !!address ? "You Supplied" : "Total Supplied"
    const supplyNum = !!address ? parseFloat(markets?.totalSupplyBalanceUSD?.toString() ?? '0') : parseFloat(markets?.totalSuppliedUSD?.toString() ?? '0')
    const supplyValue = shortUsdFormatter(supplyNum)

    const borrowText = !!address ? "You Borrowed" : "Total Borrowed"
    const borrowNum = !!address ? parseFloat(markets?.totalBorrowBalanceUSD?.toString() ?? '0') : parseFloat(markets?.totalBorrowedUSD?.toString() ?? '0')
    const borrowValue = shortUsdFormatter(borrowNum)

    return (
        <Box width="100%" paddingTop={16}>
            <Heading size="md">{heading}</Heading>
            <HStack paddingTop={8} spacing={8}>
                <Card minW={'225px'} minH="130px">
                    <Statistic title={supplyText} value={supplyValue} />
                    <Counter from={0} to={supplyNum} />
                </Card>
                <Card minW={'225px'}>
                    <Statistic title={borrowText} value={borrowValue} />
                    <Counter from={0} to={borrowNum} />
                </Card>
            </HStack>
        </Box>
    )
}

export default PoolOverview
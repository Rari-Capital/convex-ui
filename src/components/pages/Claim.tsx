import { InfoIcon } from "@chakra-ui/icons";
import { Box, VStack, Text, Button, HStack } from "@chakra-ui/react";
import { usePoolContext } from "context/PoolContext";
import { formatEther, formatUnits, parseEther } from "ethers/lib/utils";
import useCTokensWithRewardsPlugin from "hooks/plugins/useCTokensWithRewardsPlugin";
import { flywheels, useFlywheelsTotalUSD, useMaxUnclaimedByMarkets } from "hooks/rewards/useUnclaimedByMarkets";
import {
    Card,
    Heading,
    Statistic,
} from "rari-components";
import { smallStringUsdFormatter } from "utils/formatters";

const Claim = () => {
    const { marketsDynamicData } = usePoolContext()
    const cTokensWithPlugin = useCTokensWithRewardsPlugin(marketsDynamicData?.assets?.map(({ cToken }) => cToken))
    const { flywheelRewardsTotals, estimatedGas, call } = useMaxUnclaimedByMarkets(cTokensWithPlugin) ?? {}
    const { flywheelRewardsTotalsUSD, sumUSD } = useFlywheelsTotalUSD(flywheelRewardsTotals)
    console.log({ flywheelRewardsTotals, flywheelRewardsTotalsUSD, sumUSD, estimatedGas })

    const flywheelAddresses = Object.keys(flywheelRewardsTotals ?? {})

    const handleMaxClaim = async () => {
        if (call)
            await call()
    }


    return (
        <Box>
            <Text
                variant="secondary"
                display="flex"
                alignItems="center"
                my={4}
            >
                <InfoIcon mr={2} />
                Some information about Convex rewards can go here.
            </Text>

            <VStack spacing={4} align="stretch">
                <Card variant="active" _hover={{
                    variant: "active"
                }}>

                    <HStack justify={"space-between"}>
                        <VStack align="start">
                            <Statistic
                                title="Max Claimable"
                                value={smallStringUsdFormatter(sumUSD)}
                                variant="dark"
                            />
                            <Text color="grey" size="sm">{
                                Object.entries(flywheelRewardsTotals ?? {})
                                    .map(entry => {
                                        const f = entry[0]
                                        const tokenSymbol = flywheels[f].rewardTokenSymbol
                                        const value = parseFloat(formatEther(entry[1])).toFixed(2)
                                        return value ? `${value} ${tokenSymbol}` : ''
                                    }).join(', ')
                            }</Text>
                        </VStack>
                        <VStack align="end">
                            <Button onClick={handleMaxClaim}>Claim</Button>
                        </VStack>
                    </HStack>
                </Card>
            </VStack>

        </Box>
    );
};

export default Claim;

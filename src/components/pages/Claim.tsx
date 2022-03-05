import { InfoIcon } from "@chakra-ui/icons";
import { Box, VStack, Text, Button } from "@chakra-ui/react";
import { usePoolContext } from "context/PoolContext";
import useCTokensWithRewardsPlugin from "hooks/plugins/useCTokensWithRewardsPlugin";
import { useFlywheelsTotalUSD, useMaxUnclaimedByMarkets } from "hooks/rewards/useUnclaimedByMarkets";
import {
    Heading,
} from "rari-components";

const Claim = () => {

    const { marketsDynamicData } = usePoolContext()
    const cTokensWithPlugin = useCTokensWithRewardsPlugin(marketsDynamicData?.assets?.map(({ cToken }) => cToken))
    const { flywheelRewardsTotals, estimatedGas, call } = useMaxUnclaimedByMarkets(cTokensWithPlugin) ?? {}
    const { flywheelRewardsTotalsUSD, sumUSD } = useFlywheelsTotalUSD(flywheelRewardsTotals)
    console.log({ flywheelRewardsTotals, flywheelRewardsTotalsUSD, sumUSD, estimatedGas })

    const handleMaxClaim = async () => {
        if (call)
            await call()
    }

    return (
        <Box>
            <Heading size="md" color="white">
                Claim Rewards
            </Heading>

            <Text color="orange">Max Claim Estimated Gas {estimatedGas?.toString()}</Text>
            <Text color="orange">Max Claim sumUSD {sumUSD}</Text>

            <Button onClick={handleMaxClaim}>Claim</Button>

            <VStack mt={4} mb={8} align="stretch" spacing={4}>
            </VStack>


        </Box>
    );
};

export default Claim;

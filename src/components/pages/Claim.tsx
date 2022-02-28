import { InfoIcon } from "@chakra-ui/icons";
import { Box, Flex, VStack } from "@chakra-ui/react";
import {
  Card,
  ExpandableCard,
  Heading,
  Statistic,
  Text,
} from "rari-components";

const Claim = () => {
  return (
    <Box>
      <Heading size="md" color="white">
        Claim Rewards
      </Heading>
      <VStack mt={4} mb={8} align="stretch" spacing={4}>
        <ExpandableCard
          variant="light"
          expandableChildren={
            <VStack spacing={4} align="stretch">
              <Text
                variant="secondary"
                display="flex"
                alignItems="center"
                mb={4}
              >
                <InfoIcon mr={2} />
                Some information about Convex rewards can go here.
              </Text>
              <Card variant="active">
                <Statistic
                  title="Claimable Rewards"
                  value="$23,556"
                  variant="dark"
                />
              </Card>
            </VStack>
          }
        >
          <Heading size="lg">FEI3CRV</Heading>
        </ExpandableCard>
      </VStack>
    </Box>
  );
};

export default Claim;

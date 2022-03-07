import { Box, VStack } from "@chakra-ui/react";
import { Card, Heading, Text } from "rari-components";

const Faq = () => {
  return (
    <Box>
      <Card variant="light">
        <Heading>FAQ</Heading>
        <Text variant="secondary">Frequently asked questions</Text>
        <VStack spacing={8} alignItems="stretch" pt={4}>
          <Box>
            <Heading size="md">Why did the chicken cross the road?</Heading>
            <Text>To get to the other side.</Text>
          </Box>
          <Box>
            <Heading size="md">Why did the chicken cross the road?</Heading>
            <Text>To get to the other side.</Text>
          </Box>
        </VStack>
      </Card>
    </Box>
  );
};

export default Faq;

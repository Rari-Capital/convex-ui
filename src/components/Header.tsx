import {
  Box,
  HStack,
  Image,
  Spacer,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  Button,
  Card,
  Heading,
  Link,
  Statistic,
  Text,
  TokenGroup,
} from "rari-components";
import { truncate } from "utils/stringUtils";
import { useAccount } from "wagmi";
import ConnectModal from "./modals/ConnectModal";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });
  // if (accountData) {
  //     return (
  //         <Box>
  //             {accountData.ens?.avatar && <Image src={accountData.ens?.avatar} alt="ENS Avatar" />}
  //             <Box>
  //                 {accountData.ens?.name
  //                     ? `${accountData.ens?.name} (${accountData.address})`
  //                     : accountData.address}
  //             </Box>
  //             {/* <div>Connected to {accountData?.connector?.name}</div> */}
  //             <Button onClick={disconnect}>Disconnect</Button>
  //         </Box>
  //     )
  // }

  const handleClick = () => {
    if (accountData) {
      disconnect();
    } else {
      onOpen();
    }
  };

  return (
    <Box
      width="100%"
      bg="darkmatte"
      color="white"
      paddingX={16}
      paddingTop={4}
      paddingBottom={44}
      position="relative"
    >
      <Image
        src="/curve.png"
        position="absolute"
        left={-28}
        top={20}
        height={96}
        zIndex={0}
        opacity={0.5}
      />
      <Image
        src="/curve.png"
        position="absolute"
        transform="scaleX(-1)"
        right={-28}
        top={20}
        height={96}
        zIndex={0}
        opacity={0.5}
      />
      <Box position="relative" zIndex={1}>
        <HStack alignItems="center" spacing={12} width="100%">
          <HStack spacing={4}>
            <TokenGroup
              size="sm"
              addresses={[
                "0xd291e7a03283640fdc51b121ac401383a46cc623",
                "0xD533a949740bb3306d119CC777fa900bA034cd52",
              ]}
            />
            <Link href="/">Tribe Convex Pool</Link>
          </HStack>
          <Link href="/">Rewards</Link>
          <Spacer />
          <Button onClick={handleClick} variant="neutral">
            {!!accountData ? truncate(accountData.address ?? "", 8) : "Connect"}
          </Button>
          <ConnectModal isOpen={isOpen} onClose={onClose} />
        </HStack>
        <Box width="100%" paddingTop={16}>
          <Heading size="md">Portfolio Overview</Heading>
          <HStack paddingTop={8} spacing={8}>
            <Card>
              <Statistic title="You supplied" value="$23,556" />
            </Card>
            <Card>
              <Statistic title="You borrowed" value="$13,556" />
            </Card>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;

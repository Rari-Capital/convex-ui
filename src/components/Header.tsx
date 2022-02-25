import {
  Box,
  HStack,
  Image,
  Spacer,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRari } from "context/RariContext";
import usePoolData from "hooks/pool/usePoolData";
import {
  Button,
  Card,
  Heading,
  Link,
  Statistic,
  Text,
  TokenGroup,
} from "rari-components";
import { shortUsdFormatter } from "utils/formatters";
import { truncate } from "utils/stringUtils";
import { useAccount } from "wagmi";
import ConnectModal from "./modals/ConnectModal";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthed, address, logout } = useRari()

  const { markets } = usePoolData(156)

  console.log({ markets })

  const handleClick = () => {
    if (isAuthed) {
      logout();
    } else {
      onOpen();
    }
  };

  const supplyText = isAuthed ? "You Supplied" : "Total Supplied"
  const supplyValue = shortUsdFormatter(isAuthed ? (markets?.supplyBalanceUSD?.toString() ?? 0) : (markets?.totalSuppliedUSD?.toString() ?? 0))

  const borrowText = isAuthed ? "You Borrowed" : "Total Borrowed"
  const borrowValue = shortUsdFormatter(isAuthed ? (markets?.borrowBalanceUSD?.toString() ?? 0) : (markets?.totalBorrowedUSD?.toString() ?? 0))

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
            {isAuthed ? truncate(address ?? "", 8) : "Connect"}
          </Button>
          <ConnectModal isOpen={isOpen} onClose={onClose} />
        </HStack>
        <Box width="100%" paddingTop={16}>
          <Heading size="md">Portfolio Overview</Heading>
          <HStack paddingTop={8} spacing={8}>
            <Card>
              <Statistic title={supplyText} value={supplyValue} />
            </Card>
            <Card>
              <Statistic title={borrowText} value={borrowValue} />
            </Card>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;

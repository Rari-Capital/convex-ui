import {
  Box,
  HStack,
  Image,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { useRari } from "context/RariContext";
import {
  Button,
  Link,
  TokenGroup,
} from "rari-components";
import { truncate } from "utils/stringUtils";
import ConnectModal from "./modals/ConnectModal";
import PoolOverview from "./PoolOverview";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthed, address, logout, previewMode } = useRari()

  const handleClick = () => {
    if (isAuthed) {
      logout();
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
          <Link href="/claim">Rewards</Link>
          <Spacer />
          <HStack align={"flex-start"}>
            {/* <WarningIcon w={2} h={2} color="red.500" /> */}
            <Button onClick={handleClick} variant="neutral" bg={previewMode ? 'orange' : ''}>
              {!!address ? truncate(address ?? "", 8) : "Connect"}
            </Button>
          </HStack>
          <ConnectModal isOpen={isOpen} onClose={onClose} />
        </HStack>
        <PoolOverview />
      </Box>
    </Box>
  );
};

export default Header;

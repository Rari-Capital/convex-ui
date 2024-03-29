import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  StyleProps,
  useDisclosure,
  Link as ChakraLink
} from "@chakra-ui/react";
import { useRari } from "context/RariContext";
import { Button, Heading, Link, Text, TokenGroup } from "rari-components";
import { truncate } from "utils/stringUtils";
import ConnectModal from "./modals/ConnectModal";
import ClaimModal from "./modals/ClaimModal";
import { PoolOverview } from "./PoolOverview";

type HeaderProps = BoxProps & {
  /**
   * Styles to be passed to the `sx` prop of the inner Box containing the
   * Header content (not the background).
   */
  contentSx: StyleProps;
};

const Header: React.FC<HeaderProps> = ({ contentSx, ...restProps }) => {
  const {
    isOpen: isClaimModalOpen,
    onOpen: openClaimModal,
    onClose: closeClaimModal,
  } = useDisclosure();
  const { isAuthed, address, logout, login, previewMode } = useRari();

  const handleClick = () => {
    if (isAuthed) {
      logout();
    } else {
      login();
    }
  };

  return (
    <Box
      bg="darkmatte"
      color="white"
      paddingTop={4}
      position="relative"
      overflowX="hidden"
      {...restProps}
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
      <Box position="relative" zIndex={1} sx={contentSx}>
        <HStack alignItems="center" spacing={12} width="100%">
          <HStack spacing={12}>
            <HStack spacing={4}>
              <Link href="/">
                <TokenGroup
                  size="sm"
                  addresses={[
                    "0xd291e7a03283640fdc51b121ac401383a46cc623",
                    "0xD533a949740bb3306d119CC777fa900bA034cd52",
                  ]}
                />
              </Link>
              <Link href="/">Tribe Convex Pool</Link>
            </HStack>
            <Menu>
              <MenuButton fontWeight={600}>
                More <ChevronDownIcon />
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Link href="/faq" color="black">
                    FAQ
                  </Link>
                </MenuItem>

                <MenuItem>
                  <ChakraLink fontWeight={600} href="https://app.rari.capital/fuse/pool/156" color="black">
                    Rari Capital Dapp
                  </ChakraLink>
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
          {/* <Link href="/claim">Rewards</Link> */}
          <Spacer />
          <HStack align={"flex-start"}>
            <Button onClick={openClaimModal} bg="success">
              Claim Rewards
            </Button>
            {/* <WarningIcon w={2} h={2} color="red.500" /> */}
            <Button onClick={handleClick} bg={previewMode ? "warning" : undefined}>
              {!!address ? truncate(address ?? "", 8) : "Connect"}
            </Button>
          </HStack>
          <ConnectModal />
          <ClaimModal isOpen={isClaimModalOpen} onClose={closeClaimModal} />
        </HStack>
        <Box pt={12} w="100%" textAlign={"center"}>
          <Heading>
            {!!address ? "Your Portfolio" : "Tribe Convex Pool"}
          </Heading>
          <Text mt={2}>
            Leverage off your Curve LPs while keeping Convex Rewards
          </Text>
        </Box>
        <PoolOverview pt={8} maxW={{ base: "100%", md: "100%" }} mx="auto" />
      </Box>
    </Box>
  );
};

export default Header;

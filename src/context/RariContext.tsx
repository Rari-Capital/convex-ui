// React
import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/router";

// Wagmi
import { useAccount, useConnect } from "wagmi";
import { useNetwork } from "wagmi";

// Utils
import { alchemyURL } from "utils/connectors";
import { providers } from "ethers";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { isSupportedChainId } from "constants/networks";

export interface RariContextData {
  provider: any;
  chainId: number;
  address: string | undefined;
  accountData: any;
  isAuthed: boolean;
  previewMode: boolean;
  logout: () => void;
  login: () => void;
  isModalOpen: boolean;
  onClose: () => void;
}

export const RariContext = createContext<undefined | RariContextData>(
  undefined
);

export const RariProvider = ({ children }: { children: ReactNode }) => {
  const [{ data }] = useNetwork();
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });

  const [{ data: UsersConnector }] = useConnect();

  const chainId = useMemo(
    () => (isSupportedChainId(data.chain?.id) ? data.chain!.id : 1),
    [data]
  );

  // Warn on unsupported network
  const toast = useToast();
  useEffect(() => {
    if (!!data.chain?.id && !isSupportedChainId(data.chain.id)) {
      setTimeout(() => {
        toast({
          title: "Unsupported network!",
          description: "Please switch to mainnet",
          status: "warning",
          position: "bottom-right",
          duration: 300000,
          isClosable: true,
        });
      }, 1500);
    }
  }, [data.chain]);

  const provider = useMemo(() => {
    return UsersConnector.connector
      ? new providers.Web3Provider(UsersConnector?.connector?.getProvider())
      : new providers.JsonRpcProvider(alchemyURL);
  }, [UsersConnector]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Whether you have forced an address
  const router = useRouter();
  const address = useMemo(
    () => (router?.query.address ?? accountData?.address) as string | undefined,
    [router, accountData]
  );

  // If you are previewing an address
  const previewMode = useMemo(
    () => !!address && address === router?.query.address,
    [router, address]
  );
  const isAuthed = useMemo(() => !!accountData, [accountData]);

  // logs out
  const logout = useCallback(() => disconnect(), []);

  const login = useCallback(() => {
    onOpen();
  }, [onOpen]);

  const value = {
    provider,
    chainId,
    address,
    accountData,
    isAuthed,
    previewMode,
    logout,
    login,
    isModalOpen: isOpen,
    onClose,
  };

  return <RariContext.Provider value={value}>{children}</RariContext.Provider>;
};

// Hook
export function useRari() {
  const context = useContext(RariContext);

  if (context === undefined) {
    throw new Error(`useRari must be used within a RariProvider`);
  }

  return context;
}

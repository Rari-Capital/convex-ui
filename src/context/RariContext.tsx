
// React
import { createContext, useContext, ReactNode, useMemo, useCallback } from "react";
import { useRouter } from "next/router";

// Wagmi
import { useAccount, useConnect } from "wagmi";
import { useNetwork } from "wagmi";

// Utils
import { alchemyURL } from "utils/connectors";
import { providers } from "ethers";
import { useDisclosure } from "@chakra-ui/react";

export const RariContext = createContext<undefined | any>(
  undefined
);

export const RariProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const [{ data, error, loading }, switchNetwork] = useNetwork()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  const [{ data: UsersConnector }, connect] = useConnect()

  const chainId = useMemo(() => 1, [data])
  const provider = useMemo(() => {
    return UsersConnector.connector ? new providers.Web3Provider(UsersConnector?.connector?.getProvider()) :
    new providers.JsonRpcProvider(alchemyURL)
  }, [UsersConnector])

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Whether you have forced an address
  const router = useRouter()
  const address = useMemo(() => router?.query.address ?? accountData?.address, [router, accountData])
  const previewMode = useMemo(() => !!address && address === router?.query.address, [router, address])
  const isAuthed = useMemo(() => !!accountData, [accountData])

  // logs out
  const logout = useCallback(() => disconnect(), [])

  const login =useCallback(() => {
    onOpen()
  },[onOpen])

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
    onClose
  }

  return <RariContext.Provider value={value}>
    
    {children}
  
  </RariContext.Provider>;
};

// Hook
export function useRari() {
  const context = useContext(RariContext);

  if (context === undefined) {
    throw new Error(`useRari must be used within a RariProvider`);
  }

  return context;
}

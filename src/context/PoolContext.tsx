import { useDisclosure } from "@chakra-ui/react";
import { networkConfig } from "constants/networks";
import { BigNumber } from "ethers";
import usePoolData from "hooks/pool/usePoolData";
import useUserHealth from "hooks/useUserHealth";
import { FusePoolData, MarketsWithData, PoolInstance, USDPricedFuseAsset } from "lib/esm/types";
import { createContext, ReactChildren, useCallback, useContext, useMemo } from "react";
import { useRari } from "./RariContext";

export const PoolContext = createContext<undefined | PoolContextData>(
  undefined
);

type PoolContextData = {
  poolInfo?: FusePoolData;
  marketsDynamicData?: MarketsWithData;
  pool: PoolInstance | undefined;
  borrowLimit: number | undefined;
  userHealth: number | undefined;
  borrowLimitBN: BigNumber | undefined;
  balances: {
      [cToken: string]: BigNumber;
  } | undefined;
  isOpen: boolean;
  onClose: () => void;
  openCTokenInfo: (e: any) => void,
  activeCToken: undefined | USDPricedFuseAsset
}

export const PoolProvider = ({ children }: { children: ReactChildren }) => {
  const { chainId } = useRari();
  const poolIndex = networkConfig[chainId].poolId

  const { poolInfo, marketsDynamicData, pool } = usePoolData(poolIndex);

  const { borrowLimit, userHealth, borrowLimitBN } =
    useUserHealth(marketsDynamicData);
  
  const balances = pool && marketsDynamicData ? pool.getUnderlyingBalancesForPool(marketsDynamicData?.assets) : undefined

  const { isOpen, onOpen, onClose } = useDisclosure();

  let activeCToken: undefined | USDPricedFuseAsset
  // When opening save the given cToken info in state to access once in modal 
  const openCTokenInfo = useCallback((e) => {
    activeCToken = (e)
    onOpen();

  }, [onOpen]);

  const value = {
        isOpen,
        onClose,
        openCTokenInfo,
        activeCToken,
        poolInfo,
        pool,
        marketsDynamicData,
        borrowLimit,
        balances,
        userHealth,
        borrowLimitBN,
        
  } 
  
  return <PoolContext.Provider value={value}>{children}</PoolContext.Provider>;
};

// Hook
export function usePoolContext() {
  const context = useContext(PoolContext);

  if (context === undefined) {
    throw new Error(`usePoolContext must be used within a PoolProvider`);
  }

  return context;
}

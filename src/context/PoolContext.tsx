import { networkConfig } from "constants/networks";
import { BigNumber } from "ethers";
import usePoolData from "hooks/pool/usePoolData";
import useUserHealth from "hooks/useUserHealth";
import { FusePoolData, MarketsWithData, PoolInstance } from "lib/esm/types";
import { createContext, ReactChildren, useContext, useMemo } from "react";
import { useRari } from "./RariContext";

export const PoolContext = createContext<undefined | PoolContextData>(
  undefined
);

type PoolContextData = {
  poolInfo?: FusePoolData;
  marketsDynamicData?: MarketsWithData;
  pool: PoolInstance | undefined;
  borrowLimit: number;
  userHealth: number;
  borrowLimitBN: BigNumber;
};

export const PoolProvider = ({
  children,
}: {
  children: ReactChildren;
}) => {
  const { chainId } = useRari();
  const poolIndex = networkConfig[chainId].poolId
  const { poolInfo, marketsDynamicData, pool } = usePoolData(poolIndex);
  const { borrowLimit, userHealth, borrowLimitBN } =
    useUserHealth(marketsDynamicData);

  const value = useMemo(
    () => ({
      poolInfo,
      marketsDynamicData,
      pool,
      borrowLimit,
      userHealth,
      borrowLimitBN,
    }),
    [poolInfo, marketsDynamicData, pool, borrowLimit, userHealth, borrowLimitBN]
  );

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

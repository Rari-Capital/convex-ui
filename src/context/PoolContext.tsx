import usePoolData from "hooks/pool/usePoolData";
import useUserHealth from "hooks/useUserHealth";
import { FusePoolData, MarketsWithData, PoolInstance } from "lib/esm/types";
import { createContext, ReactChildren, useContext, useMemo } from "react";

export const PoolContext = createContext<undefined | PoolContextData>(
  undefined
);

type PoolContextData = {
  poolInfo?: FusePoolData;
  marketsDynamicData?: MarketsWithData;
  pool: PoolInstance | undefined | null;
  borrowLimit: number | undefined;
  userHealth: number | undefined;
};

export const PoolProvider = ({
  poolIndex,
  children,
}: {
  poolIndex: number;
  children: ReactChildren;
}) => {
  const { poolInfo, marketsDynamicData, pool } = usePoolData(poolIndex);
  const {borrowLimit, userHealth} = useUserHealth(marketsDynamicData)

  const value = useMemo(
    () => ({
      poolInfo,
      marketsDynamicData,
      pool,
      borrowLimit,
      userHealth
    }),
    [poolInfo, marketsDynamicData, pool, borrowLimit, userHealth]
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

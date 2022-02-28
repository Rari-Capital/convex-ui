import usePoolData from "hooks/pool/usePoolData";
import { FusePoolData, MarketsWithData, StaticData } from "lib/esm/types";
import { createContext, ReactChildren, useContext, useMemo } from "react";

export const PoolContext = createContext<undefined | PoolContextData>(
  undefined
);

type PoolContextData = {
  poolInfo?: FusePoolData;
  marketsDynamicData?: MarketsWithData;
  marketsStaticData?: StaticData[]
};

export const PoolProvider = ({
  poolIndex,
  children,
}: {
  poolIndex: number;
  children: ReactChildren;
}) => {
  const { poolInfo, marketsDynamicData, marketsStaticData } = usePoolData(poolIndex);
  const value = useMemo(
    () => ({
      poolInfo,
      marketsDynamicData,
      marketsStaticData
    }),
    [poolInfo, marketsDynamicData, marketsStaticData]
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

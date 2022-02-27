import usePoolData from "hooks/pool/usePoolData";
import { FusePoolData, MarketsWithData } from "lib/esm/types";
import { createContext, ReactChildren, useContext, useMemo } from "react";

export const PoolContext = createContext<undefined | PoolContextData>(
  undefined
);

type PoolContextData = {
  poolInfo?: FusePoolData;
  markets?: MarketsWithData;
};

export const PoolProvider = ({
  poolIndex,
  children,
}: {
  poolIndex: number;
  children: ReactChildren;
}) => {
  const { poolInfo, markets } = usePoolData(poolIndex);
  const value = useMemo(
    () => ({
      poolInfo,
      markets,
    }),
    [poolInfo, markets]
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

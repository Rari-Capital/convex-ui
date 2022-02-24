
import { createContext, useContext, ReactNode } from "react";

// Wagmi
import { useProvider } from "wagmi";
import { useNetwork } from "wagmi";

// Fuse SDK
import { Pool } from '../../esm';

import { useQuery } from "react-query";
import { providers } from "ethers";
import { alchemyURL } from "utils/connectors";

export const RariContext = createContext<undefined | any>(
    undefined
  );
  
export const RariProvider = ({
    poolId,
    children
}:{
    poolId: string, 
    children: ReactNode
}) => {
    const [{data, error, loading}, switchNetwork ] = useNetwork()

    const provider = new providers.JsonRpcProvider(alchemyURL)

    const PoolInstance = Pool(provider, "1", poolId)

    

    const value = {
      PoolInstance
    }

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
  
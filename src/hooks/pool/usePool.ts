import { useRari } from "context/RariContext";
import { useMemo } from "react";
import { Pool } from "lib/esm";

const usePool = (poolIndex: number) => {
  const { provider, chainId } = useRari();

  return useMemo(() => {
    if (!!provider && !!chainId) {
      const pool = Pool(provider, chainId, poolIndex);
      return pool;
    }
  }, [provider, chainId]);
};

export default usePool;

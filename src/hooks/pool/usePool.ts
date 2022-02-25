import { useRari } from "context/RariContext";
import { useMemo } from "react";
import { Pool } from "lib/esm";

const usePool = (poolIndex: number) => {
  const { provider, chainId } = useRari();

  return useMemo(() => {
    if (!!provider && !!chainId) {
      const pool = Pool(provider, chainId.toString(), poolIndex.toString());
      return pool;
    }
  }, [provider._network?.name, chainId]);
};

export default usePool;

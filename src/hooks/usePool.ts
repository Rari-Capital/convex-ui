import { useRari } from "context/RariContext";
import { useEffect, useState, useMemo } from "react";
import { Pool } from "../../esm";

const usePool = (poolIndex: number) => {
  const { provider, chainId } = useRari();
  //   console.log({ provider, chainId });
  return useMemo(() => {
    if (!!provider && !!chainId) {
      const pool = Pool(provider, chainId.toString(), poolIndex.toString());
      return pool;
    }
  }, [provider._network?.name, chainId]);
};

export default usePool;

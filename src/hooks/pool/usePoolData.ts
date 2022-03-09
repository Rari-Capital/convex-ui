import { useRari } from "context/RariContext";
import { useQuery } from "react-query";
import usePool from "./usePool";

const usePoolData = (poolIndex: number) => {
  const { address } = useRari();
  const pool = usePool(poolIndex);

  const { data: poolInfo } = useQuery(
    `Pool data PoolID ${pool?.poolId}`,
    async () => {
      if (pool) return await pool.fetchFusePoolData();
    },
    { refetchOnMount: false, refetchOnWindowFocus: false, enabled: !!pool }
  );

  const { data: marketsDynamicData } = useQuery(
    `Pool Markets PoolID ${pool?.poolId} for address ${address}`,
    async () => {
      if (pool && poolInfo) {
        let data = await pool.getMarketsWithData(poolInfo.comptroller, {
          from: address,
        });
        // Sort by balance
        if (!!address) {
          data.assets = data.assets.sort((a, b) => {
            if (a.underlyingBalance.lt(b.underlyingBalance)) {
              return 1
            } else if (b.underlyingBalance.lt(a.underlyingBalance)) {
              return -1
            } else {
              return 0
            }
          })
        }

        return data
      }
    },
    {
      enabled: poolInfo ? true : false,
      refetchInterval: 60000,
      refetchOnMount: false,
      refetchOnWindowFocus: true,
    }
  );

  return {
    poolInfo,
    marketsDynamicData,
    pool,
  };
};

export default usePoolData;

import { useRari } from 'context/RariContext';
import { useQuery } from 'react-query';
import usePool from './usePool';

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

  const { data: markets, isLoading } = useQuery(
    `Pool Markets PoolID ${pool?.poolId} for address ${address}`,
    async () => {
      if (pool && poolInfo)
        return await pool.getMarketsWithData(poolInfo.comptroller, {
          from: address,
        });
    },
    {
      enabled: !!poolInfo,
      refetchInterval: 60000,
    }
  );

  // console.log({ poolInfo, markets });

  return {
    poolInfo,
    markets,
  };
};

export default usePoolData;

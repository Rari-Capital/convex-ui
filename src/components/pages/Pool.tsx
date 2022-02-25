import { Heading, Spinner } from '@chakra-ui/react'
import { useRari } from 'context/RariContext'
import usePool from 'hooks/usePool'
import React from 'react'
import { useQuery } from 'react-query'

const Pool = () => {
    const { address } = useRari()
    const pool = usePool(156)

    const { data: poolInfo } = useQuery(`Pool data PoolID ${pool?.poolId}`, async () => {
        if (pool) return await pool.fetchFusePoolData()
    }, { refetchOnMount: false, refetchOnWindowFocus: false, enabled: !!pool })


    const { data: markets, isLoading } = useQuery(`Pool Markets PoolID ${pool?.poolId}`, async () => {
        if (pool) return await pool.getMarketsWithData(poolInfo.comptroller, { from: address })
    }, {
        enabled: !!poolInfo,
        refetchInterval: 60000
    })

    const { data: rds } = useQuery(`Pool RDs PoolID ${pool?.poolId}`, async () => {
        if (pool) return await pool.fetchAvailableRds(poolInfo.comptroller)
    }, {
        enabled: !!poolInfo,
        refetchOnMount: false,
        refetchOnWindowFocus: false
    })

    return (
        <>
            {
                !!poolInfo ? <Heading>{poolInfo.name}</Heading> : <Spinner />
            }
        </>
    )
}

export default Pool
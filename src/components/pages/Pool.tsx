import { Heading, Spinner } from '@chakra-ui/react'
import { useRari } from 'context/RariContext'
import usePoolData from 'hooks/pool/usePoolData'
import React from 'react'
import { useQuery } from 'react-query'

const Pool = () => {
    const { address } = useRari()
    const { poolInfo, markets, rds } = usePoolData(156)

    return (
        <>
            {
                !!poolInfo ? <Heading>{poolInfo.name}</Heading> : <Spinner />
            }
        </>
    )
}

export default Pool
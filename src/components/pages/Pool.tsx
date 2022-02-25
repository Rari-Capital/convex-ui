import { Heading, Spinner } from '@chakra-ui/react'
import { useRari } from 'context/RariContext'
import usePoolData from 'hooks/pool/usePoolData'
import { Card } from 'rari-components'
// import { useEffect } from 'react'
// import { convexAPR } from 'utils/convex/convex2'

const Pool = () => {
    const { address, provider } = useRari()
    const { poolInfo, markets } = usePoolData(156)
    // useEffect(() => {
    //     convexAPR("frax", provider).then((apr) => console.log({ apr }))
    // }, [])

    if (!poolInfo) return <Spinner />

    return (
        <>
            {
                !!poolInfo ? <Heading>{poolInfo.name}</Heading> : <Spinner />
            }
        </>
    )
}

export default Pool


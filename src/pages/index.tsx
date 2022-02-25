import { VStack } from '@chakra-ui/react'
import Pool from 'components/pages/Pool'
import Head from 'next/head'

function PoolPage() {
  return (
    <VStack>
      <Head>
        <title>Tribe Convex Pool</title>
        <meta name="description" content="Tribe Convex Pool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Pool />
    </VStack>
  )
}


export default PoolPage
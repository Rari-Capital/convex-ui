import { Heading, VStack } from '@chakra-ui/react'
import Pool from 'components/pages/Pool'
import Head from 'next/head'

function PoolPage() {

  return (
    <VStack>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Pool />
    </VStack>
  )
}


export default PoolPage
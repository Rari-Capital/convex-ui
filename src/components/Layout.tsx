import { Button, HStack, useDisclosure, VStack, Box, Image } from '@chakra-ui/react'
import React from 'react'
import { truncate } from 'utils/stringUtils'
import { useAccount } from 'wagmi'
import ConnectModal from './modals/ConnectModal'

export const Layout = ({ children }: { children: any }) => {
    return (
        <VStack w="100%" h="100%">
            <Header />
            {children}
        </VStack>
    )
}

const Header = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [{ data: accountData }, disconnect] = useAccount({
        fetchEns: true,
    })
    // if (accountData) {
    //     return (
    //         <Box>
    //             {accountData.ens?.avatar && <Image src={accountData.ens?.avatar} alt="ENS Avatar" />}
    //             <Box>
    //                 {accountData.ens?.name
    //                     ? `${accountData.ens?.name} (${accountData.address})`
    //                     : accountData.address}
    //             </Box>
    //             {/* <div>Connected to {accountData?.connector?.name}</div> */}
    //             <Button onClick={disconnect}>Disconnect</Button>
    //         </Box>
    //     )
    // }

    const handleClick = () => {
        if (accountData) {
            disconnect()
        } else {
            onOpen()
        }
    }

    return (
        <>
            <ConnectModal isOpen={isOpen} onClose={onClose} />
            <HStack w="100%" justify="flex-end">
                <Button onClick={handleClick}>{!!accountData ? truncate(accountData.address ?? '', 8) : 'Connect'}</Button>
            </HStack>
        </>
    )
}

export default Layout
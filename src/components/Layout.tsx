import { Button, HStack, useDisclosure, VStack, Box, Image, Text, Spacer } from '@chakra-ui/react'
import { useRari } from 'context/RariContext'
import React from 'react'
import { truncate } from 'utils/stringUtils'
import AppLink from './common/AppLink'
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
    const { address, accountData, logout } = useRari();

    const handleClick = () => {
        if (!!accountData) {
            logout()
        } else {
            onOpen()
        }
    }

    return (
        <>
            <ConnectModal isOpen={isOpen} onClose={onClose} />
            <HStack w="100%" justify="space-between">
                <HStack justify="flex-start">
                    <AppLink href="/" >
                        <Text>
                            Tribe Convex Pool
                        </Text>
                    </AppLink>
                    <Spacer />
                    <AppLink href="/claim" >
                        <Text>Claim</Text>
                    </AppLink>
                    <Spacer />
                </HStack>
                <Button onClick={handleClick} ml="auto">{!!address ? truncate(address ?? '', 8) : 'Connect'}</Button>
            </HStack>
        </>
    )
}

export default Layout
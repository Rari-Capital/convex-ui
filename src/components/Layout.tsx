import { VStack } from '@chakra-ui/react'
import Header from './Header'

export const Layout = ({ children }: { children: any }) => {
    return (
        <VStack w="100%" h="100%">
            <Header />
            {children}
        </VStack>
    )
}



export default Layout
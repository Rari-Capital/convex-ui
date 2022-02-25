import { Modal, ModalOverlay, ModalHeader, ModalCloseButton, ModalBody, ModalContent, ModalFooter, Button, Text, VStack } from '@chakra-ui/react'
import { useConnect } from 'wagmi'

const ConnectModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => any }) => {
    const [{ data, error }, connect] = useConnect()

    const handleConnect = (connector: any) => {
        connect(connector)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack>
                        {data.connectors.map((connector) => (
                            <Button
                                disabled={!connector.ready}
                                key={connector.id}
                                onClick={() => handleConnect(connector)}
                            >
                                {connector.name}
                                {!connector.ready && ' (unsupported)'}
                            </Button>
                        ))}
                        {error && <div>{error?.message ?? 'Failed to connect'}</div>}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ConnectModal
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRari } from "context/RariContext";
import { useConnect } from "wagmi";

const ConnectModal = () => {
  const [{ data, error }, connect] = useConnect();
  const { onClose, isModalOpen } = useRari();

  const handleConnect = (connector: any) => {
    connect(connector);
    onClose();
  };

  return (
    <Modal isOpen={isModalOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack alignItems="stretch" pb={4}>
            {data.connectors.map((connector) => (
              <Button
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => handleConnect(connector)}
              >
                {connector.name}
                {!connector.ready && " (unsupported)"}
              </Button>
            ))}
            {error && <div>{error?.message ?? "Failed to connect"}</div>}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConnectModal;

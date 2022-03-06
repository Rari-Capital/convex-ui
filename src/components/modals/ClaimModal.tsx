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
import Claim from "components/pages/Claim";

const ClaimModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Claim Rewards</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={8}>
          <Claim />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ClaimModal;

import { Button } from "rari-components"
import { 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react"
import { usePoolContext } from "context/PoolContext"

export const CTokenInfoModal = ({
} : {
}) => {
    const { isOpen, onClose, activeCToken } = usePoolContext()
  console.log({activeCToken})
    return (
      <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{activeCToken?.underlyingSymbol}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          </ModalBody>
  
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>
    )
  }
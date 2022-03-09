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
import { USDPricedFuseAsset } from "lib/esm/types"

export const CTokenInfoModal = ({
  market,
  isOpen,
  onClose
} : {
  market: USDPricedFuseAsset,
  isOpen: boolean,
  onClose: () => void
}) => {
    return (
      <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{market.underlyingSymbol}</ModalHeader>
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
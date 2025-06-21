import { Button, Text } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/modal';
import { useRef } from 'react';

interface ConfirmDeleteDialogProps {
  onConfirm: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const ConfirmDelete: React.FC<ConfirmDeleteDialogProps> = ({
  onConfirm,
  onClose,
  isOpen,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      size="xs"
      motionPreset="scale"
      blockScrollOnMount={true}
      trapFocus={true}
    >
      <ModalOverlay zIndex={9999} />
      <ModalContent
        bg="white"
        borderRadius="xl"
        boxShadow="2xl"
        border="2px solid #fd6193"
        zIndex={10000}
        maxW="350px"
        mx={4}
        p={6} // más padding interno
        position="relative"
      >
        <ModalCloseButton
          top="10px"
          right="10px"
          position="absolute"
        />
        <ModalHeader color="#fd6193" fontWeight="bold" pb={2}>
          Confirmar eliminación
        </ModalHeader>
        <ModalBody>
          <Text color="gray.700">
            ¿Estás segura de que querés eliminar este servicio? Esta acción no se puede deshacer.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            ref={cancelRef}
            onClick={onClose}
            colorScheme="pink"
            variant="solid"
            w="100%"
          >
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDelete;
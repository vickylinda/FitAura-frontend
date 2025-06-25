import {
  Dialog,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogTitle,
  Portal,
  Button as ChakraButton,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose(); // cerramos el modal si salió todo bien
    } catch (error) {
      console.error("Error al eliminar", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent
            bg="white"
            borderRadius="2xl"
            boxShadow="2xl"
            w="90%"
            maxW="28rem"
          >
            <DialogHeader>
              <DialogTitle fontSize="xl" fontWeight="bold">
                ¿Estás segura?
              </DialogTitle>
            </DialogHeader>

            <DialogBody>
              <Text color="gray.600">
                Esta acción es <strong>irreversible</strong>. El servicio será
                eliminado permanentemente.
              </Text>
            </DialogBody>

            <DialogFooter display="flex" justifyContent="flex-end" gap={3}>
              <DialogFooter display="flex" justifyContent="flex-end" gap={3}>
                <ChakraButton
                  onClick={onClose}
                  variant="outline"
                  borderColor="#ccc"
                  color="gray.700"
                  _hover={{ bg: "#f7f7f7", borderColor: "#999" }}
                  fontWeight="semibold"
                  loading={isLoading}
                  loadingText={"Cancelando..."}
                >
                  Cancelar
                </ChakraButton>

                <ChakraButton
                  bg="#e53e3e"
                  color="white"
                  fontWeight="semibold"
                  _hover={{ bg: "#c53030" }}
                  onClick={handleConfirm}
                  loading={isLoading}
                  loadingText={"Eliminando..."}
                >
                  Eliminar
                </ChakraButton>
              </DialogFooter>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </Dialog.Root>
  );
}

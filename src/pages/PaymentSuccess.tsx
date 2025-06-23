import {
  Dialog,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogPositioner,
  DialogTitle,
  Portal,
  Text,
  Button as ChakraButton,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const PaymentSuccess = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [countdown, setCountdown] = useState(35);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      onClose();
      window.location.href = "/mytrainings";
    }

    return () => clearInterval(interval);
  }, [countdown, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent
            bg="white"
            borderRadius="2xl"
            boxShadow="2xl"
            maxH="80vh"
            w="90%"
            maxW="35rem"
          >
            <DialogHeader>
              <DialogTitle
                fontSize="2xl"
                mt={4}
                fontFamily="Inter"
                fontWeight="bold"
              >
                ¡Reserva confirmada!
              </DialogTitle>
            </DialogHeader>

            <DialogBody>
              <Stack align="center" gap={4}>
                <Text fontSize="md" textAlign="center" mb={4}>
                  Tu pago se procesó correctamente y la reserva se encuentra{" "}
                  <b>pendiente de confirmación</b> por la entrenadora.
                  <br />
                  En caso de que la solicitud no sea aceptada en un plazo de{" "}
                  <b>48 hs hábiles</b> o sea cancelada, se realizará el
                  reembolso del dinero automáticamente al medio de pago elegido.
                </Text>

                <Text
                  fontSize="sm"
                  fontWeight={"bold"}
                  textAlign="center"
                  color="#fd6193"
                >
                  Redirigiendo a tus entrenamientos en {countdown} segundos...
                </Text>
                <ChakraButton
                  bg="#fc7faa"
                  color="white"
                  fontWeight="semibold"
                  _hover={{ bg: "#fd6193" }}
                  onClick={() => (window.location.href = "/mytrainings")}
                  fontFamily="Inter"
                  w="full"
                  maxW="200px"
                >
                  Ir ahora
                </ChakraButton>
              </Stack>
            </DialogBody>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </Dialog.Root>
  );
};

export default PaymentSuccess;

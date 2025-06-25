import {
  Box,
  Button as ChakraButton,
  Stack,
  Text,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogBackdrop,
  DialogPositioner,
  Portal,
  useBreakpointValue,
  Flex,
  Input,
  Group,
  Image,
  Show,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuCreditCard } from "react-icons/lu";
import { usePaymentInputs } from "react-payment-inputs";
import cardImages, { type CardImages } from "react-payment-inputs/images";
import { useFetchWithAuth } from "@/utils/fetchWithAuth";
import { InputRightElement, InputGroup } from "@chakra-ui/input";
import { toaster } from "@/components/ui/toaster";
const images = cardImages as unknown as CardImages;
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  serviceData: any;
  selectedHours: { [key: string]: string[] };
  endDate: string;
  comment: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  serviceData,
  selectedHours,
  endDate,
  comment,
}) => {
  const headingSize = useBreakpointValue({
    base: "1xl",
    sm: "2xl",
    md: "3xl",
    lg: "4xl",
  });

  const fetchWithAuth = useFetchWithAuth();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mp">("card");

  const payment = usePaymentInputs();
  const [loading, setLoading] = useState(false);

  const pricePerClass = Number(serviceData?.price || 0);
  const calculateClasses = () => {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    let total = 0;
    let current = new Date(today);
    while (current <= end) {
      const dayName = current.toLocaleDateString("en-US", { weekday: "long" });
      total += selectedHours[dayName]?.length || 0;
      current.setDate(current.getDate() + 1);
    }
    return total;
  };
  const totalClasses = calculateClasses();
  const totalPrice = totalClasses * pricePerClass;

  const CardImage = (props: ReturnType<typeof usePaymentInputs>) => {
    const { meta, getCardImageProps } = props;
    return (
      <Show
        when={meta.cardType}
        fallback={<LuCreditCard size={16} aria-hidden="true" />}
      >
        <svg {...getCardImageProps({ images })} />
      </Show>
    );
  };

  const handlePay = async () => {
    if (!serviceData || !endDate || Object.keys(selectedHours).length === 0) {
      toaster.create({
        title: "Error",
        description:
          "Debes ingresar al menos un horario semanal y una fecha de finalización de la contratación.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const payload = {
        serviceId: serviceData.id,
        selectedSchedule: selectedHours,
        endDate: Math.floor(new Date(endDate).getTime() / 1000),
        comment: comment.trim() || undefined,
      };

      const response = await fetchWithAuth(
        "http://localhost:4000/api/v1/client-trainings",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al reservar:", errorData);

        if (errorData.internalErrorCode === 1005) {
          toaster.create({
            title: "Error",
            description: "No podés reservar un entrenamiento con vos misma.",
            type: "error",
            duration: 3000,
          });
        } else {
          toaster.create({
            title: "Error al reservar",
            description:
              errorData.message || "Ocurrió un error inesperado al reservar.",
            type: "error",
            duration: 3000,
          });
        }

        return;
      }

      toaster.create({
        title: "Reserva creada",
        description: "¡Tu entrenamiento fue reservado correctamente!",
        type: "success",
        duration: 3000,
      });

      onPaymentSuccess();
    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Error de conexión al reservar.");
    } finally {
      setLoading(false);
    }
  };

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
            w="90%"
            maxW="35rem"
          >
            <DialogHeader>
              <DialogTitle
                fontSize={headingSize}
                mt={4}
                fontFamily="Inter"
                fontWeight="bold"
              >
                Método de pago
              </DialogTitle>
            </DialogHeader>

            <ChakraButton
              variant="ghost"
              position="absolute"
              top="1rem"
              right="1rem"
              onClick={onClose}
              _hover={{ bg: "gray.100" }}
              size="sm"
              color={"black"}
            >
              ✕
            </ChakraButton>

            <DialogBody>
              <Stack gap={4}>
                <Flex gap={4} mb={4}>
                  <ChakraButton
                    onClick={() => setPaymentMethod("card")}
                    bg={paymentMethod === "card" ? "#fd6193" : "gray.200"}
                    color={paymentMethod === "card" ? "white" : "black"}
                  >
                    Tarjeta de Crédito/Débito
                  </ChakraButton>
                  <ChakraButton
                    onClick={() => setPaymentMethod("mp")}
                    bg={paymentMethod === "mp" ? "#fd6193" : "gray.200"}
                    color={paymentMethod === "mp" ? "white" : "black"}
                  >
                    Mercado Pago
                  </ChakraButton>
                </Flex>
                {paymentMethod === "card" && (
                  <Box spaceY="-1px">
                    <Stack gap={4}>
                      <Flex position="relative" w="full">
                        <Input
                          w="full"
                          {...payment.getCardNumberProps()}
                          pr="3rem"
                        />
                        <Box
                          position="absolute"
                          top="50%"
                          right="1rem"
                          transform="translateY(-50%)"
                        >
                          <CardImage {...payment} />
                        </Box>
                      </Flex>

                      <Group w="full" attached>
                        <Input
                          roundedTopLeft="0"
                          {...payment.getExpiryDateProps()}
                        />
                        <Input roundedTopRight="0" {...payment.getCVCProps()} />
                      </Group>
                      <ChakraButton
                        loading={loading}
                        loadingText={"Procesando..."}
                        w="full"
                        bg="#fd6193"
                        color="white"
                        _hover={{ bg: "#fd99bf" }}
                        onClick={handlePay}
                      >
                        Confirmar pago y reservar
                      </ChakraButton>
                    </Stack>
                  </Box>
                )}
                {paymentMethod === "mp" && (
                  <Box w="full">
                    <ChakraButton
                      loading={loading}
                      loadingText={"Procesando..."}
                      w="full"
                      bg="#2abcff"
                      color="white"
                      _hover={{ bg: "#4ec2f7" }}
                      onClick={handlePay}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={2}
                    >
                      <Image
                        src="/mp.svg"
                        alt="Mercado Pago"
                        boxSize="32px"
                        objectFit="contain"
                      />
                      Pagar con Mercado Pago y reservar
                    </ChakraButton>
                  </Box>
                )}

                <Text fontSize="sm" textAlign="center" color="gray.500">
                  Todos los pagos son procesados de forma segura. Tus datos
                  financieros están protegidos.
                </Text>
              </Stack>
            </DialogBody>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </Dialog.Root>
  );
};

export default PaymentModal;

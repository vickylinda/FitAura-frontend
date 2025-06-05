import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  useBreakpointValue,
  Link as ChakraLink,
} from "@chakra-ui/react";
import HeaderLoginRegister from "@/components/HeaderLoginRegister";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecoverPassword() {
  const headingSize = useBreakpointValue({
    base: "2xl",
    md: "4xl",
    lg: "5xl",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="white">
      <HeaderLoginRegister />
      <Flex
        direction="column"
        align="flex-start"
        justify="flex-start"
        maxW="700px"
        mx={{ base: 4, md: 16, lg: 24 }}
        px={{ base: 4, md: 8 }}
        py={{ base: 8, md: 20 }}
      >
        <Heading
          fontSize={headingSize}
          fontFamily="Inter"
          fontWeight="bold"
          mb={8}
        >
          Recuperar contraseña
        </Heading>

        <Text
          fontSize={{ base: "sm", md: "md", lg: "xl" }}
          whiteSpace={{ base: "normal", lg: "nowrap" }}
          fontFamily={"Inter"}
          fontWeight={"regular"}
          mb={1}
        >
          Si te olvidaste tu contraseña, podés iniciar un proceso de
          recuperación.
        </Text>
        <Text
          fontSize={{ base: "sm", md: "md", lg: "xl" }}
          fontFamily={"Inter"}
          fontWeight={"regular"}
          mb={8}
        >
          Te enviaremos todos los detalles a tu correo electrónico.
        </Text>

        <Box maxW={{ base: "100%", md: "400px", lg: "500px" }} w="full">
          <Text
            fontFamily={"Inter"}
            fontWeight="semibold"
            fontSize={{ base: "sm", md: "md", lg: "xl" }}
            mb={1}
          >
            Email
          </Text>
          <Input
            mt={2}
            placeholder="Ingresá tu mail"
            type="email"
            bg="#dcd3f0"
            border="none"
            mb={6}
            w="full"
            fontFamily={"Inter"}
          />

          <ChakraLink
            w={"full"}
            _hover={{ textDecoration: "none" }}
            _focus={{
              boxShadow: "none",
              outline: "none",
              borderColor: "transparent",
            }}
            _active={{
              boxShadow: "none",
              outline: "none",
              borderColor: "transparent",
            }}
            _focusVisible={{
              boxShadow: "none",
              outline: "none",
              borderColor: "transparent",
            }}
          >
            <Button
              bg="#fc7faa"
              color="white"
              size="lg"
              w="full"
              fontFamily={"Inter"}
              _hover={{ bg: "#fd6193" }}
              _focus={{
                boxShadow: "none",
                outline: "none",
                borderColor: "transparent",
              }}
              _active={{
                boxShadow: "none",
                outline: "none",
                borderColor: "transparent",
              }}
              _focusVisible={{
                boxShadow: "none",
                outline: "none",
                borderColor: "transparent",
              }}
              onClick={() => setShowSuccess(true)}
            >
              Recuperar Contraseña
            </Button>
            {showSuccess && (
              <Box
                position="fixed"
                top="0"
                left="0"
                w="100vw"
                h="100vh"
                bg="rgba(0, 0, 0, 0.4)" // fondo oscuro semitransparente
                zIndex="1000"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  bg="green.50"
                  border="1px solid"
                  borderColor="green.200"
                  borderRadius="md"
                  boxShadow="lg"
                  p={6}
                  maxW="600px"
                  w="90%"
                >
                  <Flex align="center" justify="space-between">
                    <Text fontSize="sm" color="green.800">
                      ✅ Enviamos un correo a xxxx@xxxx.com. Ingresá a tu
                      casilla y seguí las instrucciones para continuar con la
                      recuperación de la contraseña.
                    </Text>
                    <Button
                      size="sm"
                      onClick={() => navigate("/password-reset")}
                      variant="ghost"
                      colorScheme="green"
                    >
                      ✖
                    </Button>
                  </Flex>
                </Box>
              </Box>
            )}
          </ChakraLink>
        </Box>
      </Flex>
    </Box>
  );
}

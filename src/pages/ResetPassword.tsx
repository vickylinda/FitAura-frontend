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
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { InputGroup, InputRightElement } from "@chakra-ui/input";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";



export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  console.log("TOKEN:", token);
  const headingSize = useBreakpointValue({
    base: "2xl",
    md: "4xl",
    lg: "5xl",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
 


  useEffect(() => {
    if (showSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showSuccess, navigate]);


  const handleResetPassword = async () => {
    if (!token) {
      alert("Token inválido o faltante.");
      return;
    }
  
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:4000/api/v1/users/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, token }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setShowSuccess(true);
      } else {
        switch (data.internalErrorCode) {
          case 1001:
            alert("Petición incorrecta. Faltan datos.");
            break;
          case 1002:
            alert("La contraseña no cumple con los requisitos de seguridad.");
            break;
          case 1008:
            alert("Token inválido o expirado. Por favor vuelve a solicitar el enlace.");
            break;
          case 1009:
            alert("Usuario no encontrado.");
            break;
          default:
            alert("Error desconocido. Intenta nuevamente.");
            break;
        }
      }
    } catch (err) {
      console.error(err);
      alert("Hubo un problema al resetear la contraseña.");
    }
  };
  
  
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
          mb={4}
        >
          Reestablecer contraseña
        </Heading>

        <Text
          fontSize={{ base: "sm", md: "md", lg: "xl" }}
          fontFamily={"Inter"}
          mb={8}
        >
          Establecé tu nueva contraseña. La misma debe contener mínimo 8
          caracteres, 1 mayúscula, 1 número y 1 carácter especial.
        </Text>

        <Box maxW={{ base: "100%", md: "400px", lg: "500px" }} w="full">
          <Text fontFamily={"Inter"} fontWeight="semibold" mb={1}>
            Nueva Contraseña
          </Text>
          <InputGroup mb={4}>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Ingresá tu contraseña nueva"
              bg="#dcd3f0"
              border="none"
              fontFamily="Inter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement>
              <Button
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
                _hover={{ bg: "transparent" }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </InputRightElement>
          </InputGroup>

          <Text fontFamily={"Inter"} fontWeight="semibold" mb={1}>
            Confirmar Nueva Contraseña
          </Text>
          <InputGroup mb={6}>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Volvé a ingresar tu contraseña nueva"
              bg="#dcd3f0"
              border="none"
              fontFamily="Inter"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <InputRightElement>
              <Button
                variant="ghost"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                _hover={{ bg: "transparent" }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </InputRightElement>
          </InputGroup>

          <ChakraLink
            w="full"
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
              fontFamily="Inter"
              _hover={{ bg: "#fd6193" }}
              onClick={handleResetPassword}
              //onClick={() => setShowSuccess(true)}
              
            >
              Reestablecer Contraseña
            </Button>
          </ChakraLink>
        </Box>
      </Flex>

      {/* superpuesto con fondo bloqueado */}
      {showSuccess && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          bg="rgba(0, 0, 0, 0.4)"
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
                ✅ Nueva contraseña generada con éxito! Aguarda unos segundos y
                te redirigiremos a la pestaña de inicio de sesión.
              </Text>
              <Text
                fontSize="sm"
                color="green.700"
                fontWeight="semibold"
                ml={4}
              >
                {" "}
                Redirigiendo en {countdown}...
              </Text>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
}

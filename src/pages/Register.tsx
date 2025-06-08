import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Image,
  Stack,
  useBreakpointValue,
  Link as ChakraLink,
  Switch,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/form-control";

import { InputGroup, InputRightElement } from "@chakra-ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import HeaderLoginRegister from "@/components/HeaderLoginRegister";
import { Link as RouterLink } from "react-router-dom";
import { HiCheck, HiX } from "react-icons/hi";

export default function Register() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDateError, setBirthDateError] = useState<string | null>(null);


  const [showPassword, setShowPassword] = useState(false);
  const [isTrainer, setIsTrainer] = useState(false);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const headingSize = useBreakpointValue({ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" });
  const labelFontSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const inputSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const imageSize = useBreakpointValue({ base: "40px", md: "50px", lg: "60px" });

  
  const handleRegister = async () => {
    try {
      if (birthDateError) {
        alert('Por favor, corrige la fecha de nacimiento antes de continuar.');
        return;
      }
    
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = birthDate.match(dateRegex);
    if (!match) {
      alert('Formato de fecha inválido. Usa dd/mm/aaaa.');
      return;
    }


      const [_, day, month, year] = match;
      const dateObj = new Date(`${year}-${month}-${day}T00:00:00`);
      if (isNaN(dateObj.getTime())) {
        alert('Fecha inválida.');
        return;
      }

      const birthDateTimestamp = Math.floor(dateObj.getTime() / 1000);

      const joiningDateTimestamp = Math.floor(Date.now() / 1000); // hoy
  
      
      const body = {
        email,
        password,
        isTrainer,
        name,
        birthDate: birthDateTimestamp,
        joiningDate: joiningDateTimestamp,
      };
  
      // Llamar al backend
      const response = await fetch(`http://localhost:4000/api/v1/users/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
        window.location.href = '/login';
      } else {
        switch (data.internalErrorCode) {
          case 1001:
            alert('Faltan campos obligatorios.');
            break;
          case 1002:
            alert('La contraseña no cumple con los requisitos.');
            break;
          case 1004:
            alert('El email ya está registrado.');
            break;
          case 1000:
            alert('Error de servidor. Intenta nuevamente.');
            break;
          default:
            alert(data.message || 'Error desconocido');
        }
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Error al registrar. Intenta nuevamente.');
    }
  };
  
  

  return (
    <Box
      bg="white"
      minH="100vh"
      minW="100vw"
      w="100%"
      position="relative"
      overflowX="hidden"
    >
      <HeaderLoginRegister />
      <Box px={{ base: 4, md: 8 }}>
        <Flex
          w="100%"
          px={{ base: 4, md: 10 }}
          py={{ base: 8, md: 12 }}
          direction="column"
          align="center"
          justify="center"
        >
          <Box
            flex="1"
            maxW="900px"
            w="full"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            h="auto"
            px={{ base: 2, md: 4 }}
            py={0}
          >
            <Flex align="center" gap={3} mb={4}>
              <Heading
                fontSize={headingSize}
                fontFamily="Inter"
                fontWeight="bold"
              >
                Registro
              </Heading>
              <Image src="/entren.png" boxSize={imageSize} />
            </Flex>

            <Flex align="center" gap={4} mb={6} mt={4}>
              <Switch.Root
                size="lg"
                colorPalette="pink"
                checked={isTrainer}
                onCheckedChange={(details) => setIsTrainer(details.checked)}
                id="trainer"
              >
                <Switch.HiddenInput />
                <Switch.Control>
                  <Switch.Thumb>
                    <Switch.ThumbIndicator fallback={<HiX color="black" />}>
                      <HiCheck />
                    </Switch.ThumbIndicator>
                  </Switch.Thumb>
                </Switch.Control>
                <Switch.Label fontWeight={"medium"} fontSize={labelFontSize}>Soy entrenadora</Switch.Label>
              </Switch.Root>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} rowGap={6} columnGap={6} mt={2}>
              <Box>
                <Text fontWeight="semibold" fontSize={labelFontSize} mb={1}>
                  Nombre y Apellido
                </Text>
                <Input
                  placeholder="Ingresá tu nombre completo"
                  bg="#dcd3f0"
                  border="none"
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>

              <FormControl isInvalid={!!birthDateError}>
  <FormLabel fontWeight="semibold" fontSize={labelFontSize} mb={1}>
    Fecha de Nacimiento
  </FormLabel>
  <Input
    placeholder="dd/mm/aaaa"
    bg="#dcd3f0"
    border="none"
    value={birthDate}
    onChange={(e) => {
      let input = e.target.value;
      const nativeEvent = e.nativeEvent as InputEvent;
    
      // Detectar si está borrando y si hay una / al final
      if (
        nativeEvent.inputType === "deleteContentBackward" &&
        input.endsWith("/")
      ) {
        input = input.slice(0, -1);
      }
    
      // Remover caracteres no permitidos
      input = input.replace(/[^\d/]/g, "");
    
      // Autoagregar "/"
      if (input.length === 2 && !input.includes("/")) {
        input = input + "/";
      } else if (input.length === 5 && input.split("/").length - 1 === 1) {
        input = input + "/";
      }
    
      // Limitar longitud
      if (input.length > 10) {
        input = input.slice(0, 10);
      }
    
      setBirthDate(input);
    
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = input.match(dateRegex);
      if (!match) {
        setBirthDateError("Formato inválido (dd/mm/aaaa)");
        return;
      }
    
      const [_, day, month, year] = match;
      const parsedDay = parseInt(day, 10);
      const parsedMonth = parseInt(month, 10) - 1;
      const parsedYear = parseInt(year, 10);
    
      const dateObj = new Date(parsedYear, parsedMonth, parsedDay);
    
      if (
        dateObj.getFullYear() !== parsedYear ||
        dateObj.getMonth() !== parsedMonth ||
        dateObj.getDate() !== parsedDay
      ) {
        setBirthDateError("Fecha inválida");
        return;
      }
    
      setBirthDateError(null);
    }}
    
    
  />
  {birthDateError ? (
    <FormErrorMessage>
      <HiX color="red" style={{ display: "inline", marginRight: "4px" }} />
      {birthDateError}
    </FormErrorMessage>
  ) : birthDate ? (
    <FormHelperText color="green.500">
      <HiCheck color="green" style={{ display: "inline", marginRight: "4px" }} />
      Formato válido
    </FormHelperText>
  ) : null}
</FormControl>

        <Box>
          <Text fontWeight="semibold" fontSize={labelFontSize} mb={1}>
            Email
          </Text>
          <Input
            placeholder="Ingresá tu mail"
            bg="#dcd3f0"
            border="none"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>

        <Box>
          <Text fontWeight="semibold" fontSize={labelFontSize} mb={1}>
            Contraseña
          </Text>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Ingresá tu contraseña"
              bg="#dcd3f0"
              border="none"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement h="full">
              <Button
                variant="ghost"
                onClick={handleTogglePassword}
                _hover={{ bg: "transparent" }}
              >
                {showPassword ? <EyeOff size={20} color="black" /> : <Eye size={20} color="black" />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </SimpleGrid>

      <Button
        mt={8}
        bg="#fc7faa"
        color="white"
        w="full"
        fontSize={inputSize}
        _hover={{ bg: "#fd6193" }}
        onClick={handleRegister}
      >
        Registrarme
      </Button>

      <Text textAlign="center" mt={4} fontSize="sm">
        ¿Ya tenés una cuenta? {" "}
        <ChakraLink
          as={RouterLink}
          to="/login"
          color="#fc7faa"
          _hover={{ textDecoration: "underline" }}
          fontWeight="medium"
        >
          Iniciar Sesión
              </ChakraLink>
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

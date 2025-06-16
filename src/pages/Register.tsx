import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Image,
  useBreakpointValue,
  Link as ChakraLink,
  Switch,
  SimpleGrid,
} from "@chakra-ui/react";
import { ToggleTip } from "@/components/ui/toggle-tip";
import {  toaster } from "@/components/ui/toaster"
import {
  FormControl,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import { Info } from "lucide-react";
import { InputGroup, InputRightElement } from "@chakra-ui/input";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import HeaderLoginRegister from "@/components/HeaderLoginRegister";
import { Link as RouterLink } from "react-router-dom";
import { HiCheck, HiX } from "react-icons/hi";

export default function Register() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDateError, setBirthDateError] = useState<string | null>(null);

  const [confirmPassword, setConfirmPassword] = useState("");


  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
useEffect(() => {
  if (!confirmPassword) {
    // Si hay password pero no hay confirmación: error
    if (password) {
      setConfirmPasswordError("No coinciden");
    } else {
      setConfirmPasswordError(null);
    }
    return;
  }

  if (password !== confirmPassword) {
    setConfirmPasswordError("No coinciden");
  } else {
    setConfirmPasswordError(null);
  }
}, [password, confirmPassword]);



  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [isTrainer, setIsTrainer] = useState(false);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const headingSize = useBreakpointValue({
    base: "3xl",
    sm: "4xl",
    md: "5xl",
    lg: "6xl",
  });
  const labelFontSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const inputSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const imageSize = useBreakpointValue({
    base: "40px",
    md: "50px",
    lg: "60px",
  });

const handleRegister = async () => {
  try {
    const errors: string[] = [];

    // ✅ Validación mínima de nombre
    if (!name || name.trim().length < 3) {
      errors.push("Ingresá tu nombre completo (mínimo 3 letras).");
    }

    if (!email) {
      errors.push("Ingresá tu email.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.push("El email no es válido.");
    }

    if (birthDateError) {
      errors.push("Corregí la fecha de nacimiento.");
    }

    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = birthDate.match(dateRegex);
    if (!match) {
      errors.push("Formato de fecha inválido (dd/mm/aaaa).");
    } else {
      const [_, day, month, year] = match;
      const dateObj = new Date(`${year}-${month}-${day}T00:00:00`);
      if (isNaN(dateObj.getTime())) {
        errors.push("Fecha inválida.");
      }
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      errors.push(
        "La contraseña debe tener 8 caracteres, 1 mayúscula, 1 número y 1 símbolo."
      );
    }

    if (password !== confirmPassword) {
      errors.push("Las contraseñas no coinciden.");
    }

    // 👉 Mostrar y cortar SI HAY ERRORES
    if (errors.length > 0) {
      errors.forEach((msg) => {
        toaster.create({
          description: msg,
          type: "error",
        });
      });
      return;
    }

    // ✅ Si todo bien, proceder
    const [__, day, month, year] = match!;
    const birthDateTimestamp = Math.floor(
      new Date(`${year}-${month}-${day}T00:00:00`).getTime() / 1000
    );
    const joiningDateTimestamp = Math.floor(Date.now() / 1000);

    const body = {
      email,
      password,
      isTrainer,
      name: name.trim(),
      birthDate: birthDateTimestamp,
      joiningDate: joiningDateTimestamp,
    };

    const response = await fetch(`http://localhost:4000/api/v1/users/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
  toaster.create({
    description: "Usuario registrado con éxito. Ahora podés iniciar sesión.",
    type: "success",
  });
   setTimeout(() => {
    window.location.href = "/login";
  }, 2500);

} else {
  switch (data.internalErrorCode) {
    case 1001:
      toaster.create({
        description: "Faltan campos obligatorios.",
        type: "error",
      });
      return;

    case 1002:
      toaster.create({
        description: "La contraseña no cumple con los requisitos.",
        type: "error",
      });
      return;

    case 1004:
      toaster.create({
        description: "El email ya está registrado.",
        type: "error",
      });
      return;

    default:
      toaster.create({
        description: "Error de servidor. Intenta nuevamente.",
        type: "error",
      });
      return;
  }
}

} catch (error) {
  console.error("Error en el registro:", error);
  toaster.create({
    description: "Error inesperado. Intenta nuevamente.",
    type: "error",
  });
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
          py={{ base: 4, md: 8 }}
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
                <Switch.Label fontWeight={"medium"} fontSize={labelFontSize}>
                  Soy entrenadora
                </Switch.Label>
              </Switch.Root>
            </Flex>

            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              rowGap={4}
              columnGap={6}
              mt={0}
              alignItems="start"
            >
              <Box order={{ base: 1, md: 1 }}>
                <Flex justify="space-between" align="baseline" mb={1}>
                <Text fontWeight="semibold" fontSize={labelFontSize} mb={1}>
                  Nombre y Apellido
                </Text>
                </Flex>
                <Input
                  placeholder="Ingresá tu nombre completo"
                  bg="#dcd3f0"
                  border="none"
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>
              <Box order={{ base: 2, md: 3 }}>
                <FormControl isInvalid={!!birthDateError}>
                  <Flex justify="space-between" align="baseline" mb={1}>
                    <Text fontWeight="semibold" fontSize={labelFontSize} mb={1}>
                      Fecha de Nacimiento
                    </Text>
                    {birthDateError ? (
                      <Text
                        color="red"
                        fontSize="xs"
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <HiX color="red" />
                        {birthDateError}
                      </Text>
                    ) : birthDate ? (
                      <Text
                        color="green.500"
                        fontSize="xs"
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <HiCheck color="green" />
                        Formato válido
                      </Text>
                    ) : null}
                  </Flex>
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
                      } else if (
                        input.length === 5 &&
                        input.split("/").length - 1 === 1
                      ) {
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
                        setBirthDateError("Formato inválido");
                        return;
                      }

                      const [_, day, month, year] = match;
                      const parsedDay = parseInt(day, 10);
                      const parsedMonth = parseInt(month, 10) - 1;
                      const parsedYear = parseInt(year, 10);

                      const dateObj = new Date(
                        parsedYear,
                        parsedMonth,
                        parsedDay
                      );

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
                  />{" "}
                  {/*
                {birthDateError ? (
                  <FormErrorMessage sx={{ fontSize: "0.75rem" }}>
                    <HiX
                      color="red"
                      style={{ display: "inline", marginRight: "4px" }}
                    />
                    {birthDateError}
                  </FormErrorMessage>
                ) : birthDate ? (
                  <FormHelperText color="green.500" sx={{ fontSize: "0.75rem" }}>
                    <HiCheck
                      color="green"
                      style={{ display: "inline", marginRight: "4px" }}
                    
                    />
                    Formato válido
                  </FormHelperText>
                ) : null} */}
                </FormControl>
              </Box>

              <Box order={{ base: 3, md: 5 }}>
                <FormControl isInvalid={!!emailError}>
                  <Flex justify="space-between" align="baseline" mb={1}>
                    <Text fontWeight="semibold" fontSize={labelFontSize} mb={1}>
                      Email
                    </Text>
                    {emailError ? (
                      <Text
                        color="red"
                        fontSize="xs"
                        mt={1}
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <HiX color="red" />
                        {emailError}
                      </Text>
                    ) : email ? (
                      <Text
                        color="green.500"
                        fontSize="xs"
                        mt={1}
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <HiCheck color="green" />
                        Email válido
                      </Text>
                    ) : null}
                  </Flex>
                  <Input
                    placeholder="Ingresá tu mail"
                    bg="#dcd3f0"
                    border="none"
                    //onChange={(e) => setEmail(e.target.value)}
                    onChange={(e) => {
                      const input = e.target.value;
                      setEmail(input);

                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(input)) {
                        setEmailError("Email inválido");
                      } else {
                        setEmailError(null);
                      }
                    }}
                  />
                </FormControl>
              </Box>

              <Box order={{ base: 4, md: 2 }}>
                <FormControl isInvalid={!!passwordError}>
                  <Flex justify="space-between" align="baseline" mb={1}>
                    <Flex align="baseline" gap={2}>
                      <Text
                        fontWeight="semibold"
                        fontSize={labelFontSize}
                        mb={1}
                      >
                        Contraseña
                      </Text>
                      <ToggleTip
                        positioning={{ placement: "top" }}
                        content="Debe tener 8 caracteres, 1 mayúscula, 1 número y 1 caracter especial"
                        
                      >
                        <button>
                          <Info size={16} cursor="pointer" />
                        </button>
                      </ToggleTip>
                    </Flex>
                    {passwordError ? (
                      <Text
                        color="red"
                        fontSize="xs"
                        mt={1}
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <HiX color="red" />
                        Contraseña inválida
                      </Text>
                    ) : password ? (
                      <Text
                        color="green.500"
                        fontSize="xs"
                        mt={1}
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <HiCheck color="green" />
                        Contraseña válida
                      </Text>
                    ) : null}
                  </Flex>

                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresá tu contraseña"
                      bg="#dcd3f0"
                      border="none"
                      //onChange={(e) => setPassword(e.target.value)}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPassword(value);

                        const passwordRegex =
                          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;

                        if (!passwordRegex.test(value)) {
                          setPasswordError(
                            "Debe tener 8 caracteres, 1 mayúscula, 1 número y 1 caracter especial"
                          );
                        } else {
                          setPasswordError(null);
                        }
                      }}
                    />
                    <InputRightElement h="full">
                      <Button
                        variant="ghost"
                        onClick={handleTogglePassword}
                        _hover={{ bg: "transparent" }}
                      >
                        {showPassword ? (
                          <EyeOff size={20} color="black" />
                        ) : (
                          <Eye size={20} color="black" />
                        )}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </Box>

              <Box order={{ base: 5, md: 4 }}>
                <FormControl isInvalid={!!confirmPasswordError}>
                  <Flex justify="space-between" align="baseline" mb={1}>
                    <Text fontWeight="semibold" fontSize={labelFontSize} mb={1}>
                      Repetí tu contraseña
                    </Text>
                    {confirmPasswordError ? (
  <Text
                        color="red"
                        fontSize="xs"
                        mt={1}
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <HiX color="red" />
                        Contraseñas no coinciden
                      </Text>
                    ) : password ? (
                      <Text
                        color="green.500"
                        fontSize="xs"
                        mt={1}
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <HiCheck color="green" />
                        Contraseñas coinciden
                      </Text>
                    ) : null}

                  </Flex>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Repetí tu contraseña"
                      bg="#dcd3f0"
                      border="none"
                      onChange={(e) => {
                        const value = e.target.value;
                        setConfirmPassword(value);

                        if (password && value !== password) {
                          setConfirmPasswordError(
                            "No coinciden"
                          );
                        } else {
                          setConfirmPasswordError(null);
                        }
                      }}
                    />
                    <InputRightElement h="full">
                      <Button
                        variant="ghost"
                        onClick={handleTogglePassword}
                        _hover={{ bg: "transparent" }}
                      >
                        {showPassword ? (
                          <EyeOff size={20} color="black" />
                        ) : (
                          <Eye size={20} color="black" />
                        )}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </Box>
            </SimpleGrid>
            <Flex justify="center" mt={8}>
              <Button
                minW={{ base: "200px", md: "400px" }}
                px={{ base: 10, md: 20 }}
                py={4}
                bg="#fc7faa"
                color="white"
                //w="full"
                fontSize={inputSize}
                _hover={{ bg: "#fd6193" }}
                onClick={handleRegister}
              >
                Registrarme
              </Button>
            </Flex>

            <Text textAlign="center" mt={4} fontSize="sm">
              ¿Ya tenés una cuenta?{" "}
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

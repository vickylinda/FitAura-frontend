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
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import HeaderLoginRegister from "@/components/HeaderLoginRegister";
import { InputGroup, InputRightElement } from "@chakra-ui/input";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();
  const showImage = useBreakpointValue({ base: false, md: true });
  const formRef = useRef<HTMLDivElement>(null);
  const [formHeight, setFormHeight] = useState(0);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const headingSize = useBreakpointValue({
    base: "3xl",
    sm: "4xl",
    md: "5xl",
    lg: "6xl",
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    if (formRef.current) {
      setFormHeight(formRef.current.offsetHeight);
    }
  }, [showImage]);

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/users/log-in-google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: credentialResponse.credential }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.internalErrorCode === 1001) {
          setError("No recibimos las credenciales de Google");
        } else if (errorData.internalErrorCode === 1005) {
          setError("No pudimos validar tus credenciales de Google");
        } else {
          setError(errorData.message || "Error al iniciar sesión con Google");
        }
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.jwt);
      localStorage.setItem("userId", data.userId);
      navigate("/home");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error con Google Sign-In");
    }
  };

  const handleGoogleError = () => {
    setError("Error al iniciar sesión con Google");
  };

  return (
    <Box
      bg="white"
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
      bgAttachment="fixed"
      minH="100vh"
      minW="100vw"
      w="100%"
      position="relative"
      overflowX="hidden"
    >
      <HeaderLoginRegister />
      <Box px={{ base: 4, md: 8 }}>
        <Flex
          maxW="1200px"
          mx="auto"
          w="full"
          align="flex-start"
          justify="space-between"
          mt={{ base: 6, md: 10, lg: 20 }}
          mb={0}
        >
          {/* Izquierda: formulario */}
          <Box
            ref={formRef}
            flex="1"
            maxW="500px"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            h="auto"
            px={{ base: 2, md: 4 }}
            py={0}
          >
            <Heading
              fontSize={headingSize}
              mb={2}
              fontFamily="Inter"
              fontWeight="bold"
            >
              Iniciar Sesión
            </Heading>

            <Flex
              align="center"
              //fontSize="xl"
              mb={6}
              mt={6}
              fontFamily="Inter"
              fontWeight="regular"
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
            >
              <Text>Hola, bienvenida otra vez</Text>
              <Image src="/manito.png" boxSize="24px" ml={2} />
            </Flex>

            <Stack spacing={4}>
              <Box>
                <Text
                  fontFamily="Inter"
                  fontSize={inputSize}
                  fontWeight="semibold"
                  mb={2}
                >
                  Email
                </Text>
                <Input
                  placeholder="Ingresá tu mail"
                  bg="#dcd3f0"
                  border="none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Box>

              <Box>
                <Text
                  fontFamily="Inter"
                  fontSize={inputSize}
                  fontWeight="semibold"
                  mt={4}
                  mb={2}
                >
                  Contraseña
                </Text>
                <InputGroup>
                  <Input
                    placeholder="Ingresá tu contraseña"
                    type={showPassword ? "text" : "password"}
                    bg="#dcd3f0"
                    border="none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </Box>

              <ChakraLink
                alignSelf="flex-end"
                fontSize="sm"
                color="#474BCA"
                as={RouterLink}
                to="/password-recovery"
                _hover={{ textDecoration: "underline" }}
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
                ¿Olvidaste tu contraseña?
              </ChakraLink>

              <Button
                bg="#fc7faa"
                mt={3}
                color="white"
                fontSize={inputSize}
                _hover={{ bg: "#fd6193" }}
                isLoading={loading}
                onClick={async () => {
                  setError("");

                  if (!email || !password) {
                    setError("Por favor completá todos los campos");
                    return;
                  }

                  setLoading(true);
                  try {
                    // Paso 1: Login
                    const response = await fetch(
                      "http://localhost:4000/api/v1/users/log-in",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password }),
                      }
                    );

                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(
                        errorData.message || "Error al iniciar sesión"
                      );
                    }

                    const data = await response.json();
                    localStorage.setItem("token", data.token);

                    // Paso 2: Obtener perfil con el token
                    const profileRes = await fetch(
                      "http://localhost:4000/api/v1/users/profile",
                      {
                        headers: {
                          Authorization: `Bearer ${data.token}`,
                        },
                      }
                    );

                    if (!profileRes.ok) {
                      throw new Error("No se pudo obtener el perfil");
                    }

                    const profileData = await profileRes.json();
                    const firstName =
                      profileData.name?.split(" ")[0] || "Usuaria";

                    // Guardamos en localStorage
                    localStorage.setItem(
                      "fitauraUser",
                      JSON.stringify({ id: profileData.id, name: firstName })
                    );

                    // Navegamos
                    navigate("/home");
                  } catch (err: any) {
                    setError(err.message || "Ocurrió un error");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Iniciar Sesión
              </Button>

              {/* Google Login */}
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                size="large"
              />

              {error && (
                <Text fontSize="sm" color="red.500" mt={2}>
                  {error}
                </Text>
              )}

              <Text fontSize="sm" textAlign="center">
                ¿No tenés una cuenta?{" "}
                <ChakraLink
                  as={RouterLink}
                  to="/register"
                  color="#fc7faa"
                  fontWeight="medium"
                  href="#"
                  _hover={{ textDecoration: "underline" }}
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
                  Creá una
                </ChakraLink>
              </Text>
            </Stack>
          </Box>

          {/* Derecha: imagen */}
          {showImage && (
            <Box
              flex="1"
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={`${formHeight}px`}
            >
              <Image
                src="/login-illustration.png"
                alt="Login illustration"
                objectFit="contain"
                height="100%"
              />
            </Box>
          )}
        </Flex>
      </Box>
    </Box>
  );
}

import {
  Box,
  Button as ChakraButton,
  Stack,
  Text,
  Link as ChakraLink,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogBackdrop,
  DialogPositioner,
  Portal,
  useBreakpointValue,
  Flex,
} from "@chakra-ui/react";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "@/context/AuthModalContext";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { InputGroup, InputRightElement } from "@chakra-ui/input";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const { login } = useAuth();
  const { reason } = useAuthModal();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const headingSize = useBreakpointValue({
    base: "1xl",
    sm: "2xl",
    md: "3xl",
    lg: "4xl",
  });
  const inputSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const inputSize2 = useBreakpointValue({ base: "sm", md: "sm", lg: "md" });

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError("");
    if (window.location.pathname === "/mytrainings") {
      navigate("/home");
    }
    onClose();
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/users/log-in-google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: credentialResponse.credential }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Error al iniciar sesión con Google");
        return;
      }

      const data = await response.json();
      const profileRes = await fetch(
        "http://localhost:4000/api/v1/users/profile",
        {
          headers: { Authorization: `Bearer ${data.jwt}` },
        }
      );

      if (!profileRes.ok) throw new Error("No se pudo obtener el perfil");

      const profileData = await profileRes.json();
      const firstName = profileData.name?.split(" ")[0] || "Usuaria";
      let profilePic = null;

      // Si es entrenadora, traer foto:
      if (profileData.isTrainer) {
        const trainerRes = await fetch(
          `http://localhost:4000/api/v1/trainers/${profileData.id}/profile`,
          {
            headers: { Authorization: `Bearer ${data.jwt}` },
          }
        );
        if (trainerRes.ok) {
          const trainerData = await trainerRes.json();
          profilePic = trainerData.profilePic || null;
        }
      }

      login(
        {
          id: profileData.id,
          name: firstName,
          isTrainer: profileData.isTrainer,
          profilePic: profilePic,
        },
        data.jwt
      );
      handleClose();
      if (onLoginSuccess) {
        onLoginSuccess();
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error con Google Sign-In");
    }
  };

  const handleGoogleError = () => {
    setError("Error al iniciar sesión con Google");
  };

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Por favor completá todos los campos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/users/log-in",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      const data = await response.json();
      const profileRes = await fetch(
        "http://localhost:4000/api/v1/users/profile",
        {
          headers: { Authorization: `Bearer ${data.token}` },
        }
      );

      if (!profileRes.ok) throw new Error("No se pudo obtener el perfil");

      const profileData = await profileRes.json();
      const firstName = profileData.name?.split(" ")[0] || "Usuaria";
      let profilePic = null;

      // Si es entrenadora, traer foto:
      if (profileData.isTrainer) {
        const trainerRes = await fetch(
          `http://localhost:4000/api/v1/trainers/${profileData.id}/profile`,
          {
            headers: { Authorization: `Bearer ${data.jwt}` },
          }
        );
        if (trainerRes.ok) {
          const trainerData = await trainerRes.json();
          profilePic = trainerData.profilePic || null;
        }
      }

      login(
        {
          id: profileData.id,
          name: firstName,
          isTrainer: profileData.isTrainer,
          profilePic: profilePic,
        },
        data.token
      );
      handleClose();
      if (onLoginSuccess) onLoginSuccess();
    } catch (err: any) {
      setError(err.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      scrollBehavior="inside"
      size="xl"
    >
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
                fontSize={headingSize}
                mt={4}
                fontFamily="Inter"
                fontWeight="bold"
              >
                Iniciar sesión
              </DialogTitle>
            </DialogHeader>
            <ChakraButton
              variant="ghost"
              position="absolute"
              top="1rem"
              right="1rem"
              onClick={handleClose}
              _hover={{ bg: "gray.100" }}
              size="sm"
            >
              ✕
            </ChakraButton>

            <DialogBody>
              <Stack gap={4}>
                <Text fontSize="sm" color="gray.500">
                  {reason === "expired"
                    ? "Tu sesión expiró, por favor iniciá sesión de nuevo."
                    : "Necesitás iniciar sesión para continuar."}
                </Text>

                <Flex
                  w="100%"
                  alignItems="center"
                  justifyContent="flex-start"
                  gap={4}
                >
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    size="large"
                  />
                  <Text
                    fontSize={inputSize2}
                    fontFamily={"Inter"}
                    fontWeight={"medium"}
                    color="black"
                    textAlign="center"
                  >
                    o con email:
                  </Text>
                </Flex>

                <Box>
                  <Text
                    mb={1}
                    fontFamily="Inter"
                    fontSize={inputSize}
                    fontWeight="semibold"
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

                <Box position="relative">
                  <Text
                    fontFamily="Inter"
                    fontSize={inputSize}
                    fontWeight="semibold"
                    mb={1}
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
                      <ChakraButton
                        variant="ghost"
                        onClick={handleTogglePassword}
                        _hover={{ bg: "transparent" }}
                      >
                        {showPassword ? (
                          <EyeOff size={20} color="black" />
                        ) : (
                          <Eye size={20} color="black" />
                        )}
                      </ChakraButton>
                    </InputRightElement>
                  </InputGroup>
                </Box>

                <ChakraLink
                  alignSelf="flex-end"
                  fontSize="sm"
                  color="#474BCA"
                  onClick={() => {
                    handleClose();
                    navigate("/password-recovery");
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </ChakraLink>

                {error && (
                  <Text fontSize="sm" color="red.500" textAlign="center">
                    {error}
                  </Text>
                )}
              </Stack>
            </DialogBody>

            <DialogFooter flexDirection="column" gap={2} mt={0}>
              <ChakraButton
                bg="#fc7faa"
                color="white"
                fontWeight="semibold"
                _hover={{ bg: "#fd6193" }}
                loading={isLoading}
                loadingText="Iniciando sesión..."
                onClick={handleLogin}
                w="full"
                fontSize={inputSize}
                fontFamily={"Inter"}
              >
                Iniciar Sesión
              </ChakraButton>

              <Text fontSize="sm" textAlign="center">
                ¿No tenés una cuenta?{" "}
                <ChakraLink
                  color="#fc7faa"
                  fontWeight="medium"
                  onClick={() => {
                    handleClose();
                    navigate("/register");
                  }}
                >
                  Creá una
                </ChakraLink>
              </Text>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </Dialog.Root>
  );
}

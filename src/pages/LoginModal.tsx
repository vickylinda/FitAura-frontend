import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
  } from "@chakra-ui/modal";
  import { Link as ChakraLink } from "@chakra-ui/react";

  import {
    Input,
    InputGroup,
    InputRightElement,
  } from "@chakra-ui/input";
  import { Text, Stack, Box, Link, Button } from "@chakra-ui/react";
  import { Divider } from "@chakra-ui/layout";
  import { Eye, EyeOff } from "lucide-react";

  import { useNavigate } from "react-router-dom";

  import { useAuthModal } from "@/context/AuthModalContext";
  import { useState } from "react";
  import { useAuth } from "@/context/AuthContext";
  import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";

  

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
    const [loading, setLoading] = useState(false);
  
    const handleTogglePassword = () => setShowPassword((prev) => !prev);
  
    const handleClose = () => {
      setEmail("");
      setPassword("");
      setError("");
      onClose();
    };
  
    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
      try {
        const response = await fetch("http://localhost:4000/api/v1/users/log-in-google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: credentialResponse.credential }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Error al iniciar sesión con Google");
          return;
        }
  
        const data = await response.json();
        const profileRes = await fetch("http://localhost:4000/api/v1/users/profile", {
          headers: { Authorization: `Bearer ${data.jwt}` },
        });
  
        if (!profileRes.ok) throw new Error("No se pudo obtener el perfil");
  
        const profileData = await profileRes.json();
        const firstName = profileData.name?.split(" ")[0] || "Usuaria";
  
        login({ id: profileData.id, name: firstName }, data.jwt);
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
        const response = await fetch("http://localhost:4000/api/v1/users/log-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al iniciar sesión");
        }
  
        const data = await response.json();
        const profileRes = await fetch("http://localhost:4000/api/v1/users/profile", {
          headers: { Authorization: `Bearer ${data.token}` },
        });
  
        if (!profileRes.ok) throw new Error("No se pudo obtener el perfil");
  
        const profileData = await profileRes.json();
        const firstName = profileData.name?.split(" ")[0] || "Usuaria";
  
        login({ id: profileData.id, name: firstName }, data.token);
        handleClose();
        if (onLoginSuccess) onLoginSuccess();
      } catch (err: any) {
        setError(err.message || "Ocurrió un error");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={handleClose} isCentered motionPreset="none">
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(4px)" />
        <ModalContent
            borderRadius="2xl"
            bg="white"
            boxShadow="2xl"
            mx="4"
            w="90%"               
            maxW="35rem"      
            mx="auto"
            h="fit-content"
            my="auto"
            
    
            >
          <ModalBody p={8} px={10} py={12}>
          <Stack spacing={4}>

            <Text fontSize="2xl" fontWeight="bold" mb={1}>
              Iniciar sesión
            </Text>
            <Text fontSize="sm" color="gray.500" mb={6}>
              {reason === "expired"
                ? "Tu sesión expiró, por favor iniciá sesión de nuevo."
                : "Necesitás iniciar sesión para continuar."}
            </Text>
  
            <Box w="100%" display="flex" justifyContent="center">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                size="large"
            />
            </Box>

  
              <Text fontSize="sm" color="gray.500" textAlign="center">
                o con email:
              </Text>
  
              <Box>
                <Text fontWeight="semibold" fontSize="sm" mb={1}>
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
                <Text fontWeight="semibold" fontSize="sm" mb={1}>
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
                onClick={() => {
                  handleClose();
                  navigate("/password-recovery");
                }}
              >
                ¿Olvidaste tu contraseña?
              </ChakraLink>
  
              <Button
                bg="#fc7faa"
                mt={1}
                color="white"
                fontWeight="bold"
                _hover={{ bg: "#fd6193" }}
                isLoading={loading}
                onClick={handleLogin}
              >
                Iniciar Sesión
              </Button>
  
              {error && (
                <Text fontSize="sm" color="red.500" mt={2} textAlign="center">
                  {error}
                </Text>
              )}
  
              <Text fontSize="sm" textAlign="center" mt={1}>
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
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  
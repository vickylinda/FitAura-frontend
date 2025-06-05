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
import { InputGroup, InputRightElement } from "@chakra-ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import HeaderLoginRegister from "@/components/HeaderLoginRegister";
import { Link as RouterLink } from "react-router-dom";
import { HiCheck, HiX } from "react-icons/hi";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isTrainer, setIsTrainer] = useState(false);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const headingSize = useBreakpointValue({ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" });
  const labelFontSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const inputSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const imageSize = useBreakpointValue({ base: "40px", md: "50px", lg: "60px" });

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
                />
              </Box>

              <Box>
                <Text fontWeight="semibold" fontSize={labelFontSize} mb={1}>
                  Fecha de Nacimiento
                </Text>
                <Input placeholder="dd/mm/aaaa" bg="#dcd3f0" border="none"  />
              </Box>

              <Box>
                <Text fontWeight="semibold" fontSize={labelFontSize} mb={1}>
                  Email
                </Text>
                <Input
                  placeholder="Ingresá tu mail"
                  bg="#dcd3f0"
                  border="none"
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

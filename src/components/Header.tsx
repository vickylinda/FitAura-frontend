import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  useBreakpointValue,
  Avatar,
  AvatarRoot,
  AvatarFallback,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { colorPalettes } from "compositions/lib/color-palettes";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useBreakpointValue({ base: true, xl: false });

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  //const handleLogout = () => {
  //localStorage.removeItem("token");
  //localStorage.removeItem("fitauraUser");
  //navigate("/home");
  //};
  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const transparentButtonStyles = {
    bg: "transparent",
    color: "white",
    fontSize: { base: "md", md: "lg", lg: "lg" },
    fontFamily: "'Instrument Sans', sans-serif",
    fontWeight: "medium",
    px: 2,
    py: 2,
    borderRadius: "md",
    display: "flex",
    border: "2px solid transparent",
    alignItems: "center",
    gap: 2,
    transition: "background 0.2s ease",
    _hover: {
      textDecoration: "underline",
      borderColor: "transparent",
      bg: "transparent",
      boxShadow: "none",
      outline: "none",
    },
    _active: {
      bg: "transparent",
      boxShadow: "none",
      outline: "none",
      borderColor: "transparent",
    },
    _focus: {
      boxShadow: "none",
      outline: "none",
      borderColor: "transparent",
    },
    _focusVisible: {
      boxShadow: "none",
      outline: "none",
      borderColor: "transparent",
    },
  };

{/*const [user, setUser] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("fitauraUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []); */}

  return (
    <Box as="header" w="100%" bg="white" px={{ base: 4, md: 12 }} py={4}>
      <Flex align="center" justify="space-between">
        {/* logo */}
        <Link
          as={RouterLink}
          to="/home"
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
          <Box
            bg="#fd6193"
            color="white"
            px={6}
            py={4}
            borderBottomLeftRadius="2xl"
            borderBottomRightRadius="2xl"
            fontWeight="bold"
            fontFamily="Poppins"
            cursor="pointer"
          >
            <Text
              as="span"
              fontStyle="italic"
              fontWeight="extrabold"
              fontSize="2xl"
            >
              FIT
            </Text>
            <Text
              as="span"
              fontStyle="italic"
              fontWeight="medium"
              ml={1}
              fontSize="2xl"
            >
              AURA
            </Text>
          </Box>
        </Link>

        {/* mobile */}
        {isMobile ? (
          <Box position="relative" zIndex={10}>
            <Menu>
              <MenuButton
                position="fixed"
                top="35px"
                right="35px"
                zIndex="9999"
                cursor="pointer"
              >
                <Image
                  src="/puntitosnegros.svg"
                  alt="menu"
                  boxSize="28px"
                  cursor="pointer"
                />
              </MenuButton>
              <MenuList
                bg="#fed2ea"
                color="black"
                border="2px solid black"
                sx={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "lg",
                  paddingX: 6,
                  paddingY: 2,
                }}
              >
                <MenuItem
                  onClick={() => handleNavigate("/trainings")}
                  borderBottom="1px solid black"
                  fontFamily={"Inter"}
                  fontWeight={"bold"}
                  cursor="pointer"
                  _hover={{ bg: "#fd99bf", color: "black" }}
                >
                  <Image src="/entrenamientos.svg" boxSize="20px" mr={2} />
                  Entrenamientos
                </MenuItem>
                <MenuItem
                  onClick={() => handleNavigate("/mytrainings")}
                  borderBottom="1px solid black"
                  fontFamily={"Inter"}
                  fontWeight={"bold"}
                  cursor="pointer"
                  _hover={{ bg: "#fd99bf", color: "black" }}
                >
                  <Image src="/misentrenamientos.svg" boxSize="20px" mr={2} />
                  Mis Entrenamientos
                </MenuItem>
                <MenuItem
                  onClick={() => handleNavigate("/portaltrainers")}
                  borderBottom="1px solid black"
                  fontFamily={"Inter"}
                  fontWeight={"bold"}
                  cursor="pointer"
                  _hover={{ bg: "#fd99bf", color: "black" }}
                >
                  <Image src="/portalentrenadoras.svg" boxSize="20px" mr={2} />
                  Portal Entrenadoras
                </MenuItem>
                {user ? (
                
                  <MenuItem
                    isDisabled
                    onClick={() => handleNavigate("/my-account")}
                    fontFamily={"Inter"}
                    fontWeight={"bold"}
                    cursor="pointer"
                    _hover={{ bg: "#fd99bf", color: "black" }}
                    borderBottom="1px solid black"
                  >
                    <Image src="micuenta.png" boxSize="20px" mr={2} />
                    Ver mi cuenta
                  </MenuItem> 
                ) : (
                  <>
                    <MenuItem
                      onClick={() => handleNavigate("/login")}
                      borderBottom="1px solid black"
                      fontFamily={"Inter"}
                      fontWeight={"bold"}
                      cursor="pointer"
                      _hover={{ bg: "#fd99bf", color: "black" }}
                    >
                      <Image src="login.svg" boxSize="20px" mr={2} />
                      Ingresar
                    </MenuItem>

                    <MenuItem
                      onClick={() => handleNavigate("/register")}
                      borderBottom="1px solid black"
                      fontFamily={"Inter"}
                      fontWeight={"bold"}
                      cursor="pointer"
                      _hover={{ bg: "#fd99bf", color: "black" }}
                    >
                      <Image src="register.svg" boxSize="20px" mr={2} />
                      Registrarse
                    </MenuItem>
                  </>
                )}
                {user && (
                  <MenuItem
                    onClick={handleLogout}
                    fontFamily="Inter"
                    fontWeight="bold"
                    cursor="pointer"
                    _hover={{ bg: "#fd99bf", color: "black" }}
                  >
                    <Image src="/logout.svg" boxSize="20px" mr={2} />
                    Cerrar sesión
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </Box>
        ) : (
          //navvvvv

          <HStack gap={4} w="100%" ml={8}>
            <Button
              {...transparentButtonStyles}
              onClick={() => handleNavigate("/trainings")}
              color={"black"}
            >
              Entrenamientos
            </Button>
            <Button
              {...transparentButtonStyles}
              onClick={() => handleNavigate("/mytrainings")}
              color={"black"}
            >
              Mis Entrenamientos
            </Button>
            <Button
              {...transparentButtonStyles}
              onClick={() => handleNavigate("/trainersportal")}
              color={"black"}
            >
              Portal Entrenadoras
            </Button>
            <Box flexGrow={1} />

            {/* Si hay usuario: saludo con avatar */}
            {user ? (
              <Menu>
                <MenuButton
                  as={Button}
                  {...transparentButtonStyles}
                  color="black"
                  cursor="pointer"
                  fontFamily="League Spartan"
                  fontWeight="semibold"
                  display="flex"
                  alignItems="center"
                  gap={2}
                > <Flex align="center" gap={2}>
                  <AvatarRoot colorPalette="pink">
                    <AvatarFallback />
                  </AvatarRoot>
                  ¡Hola, {user.name}!
                  </Flex>
                </MenuButton>
                
                <MenuList bg="#fed2ea" border="2px solid black" color={"black"} sx={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "lg",
                  paddingX: 6,
                  paddingY: 2,
                }}>
                  <MenuItem
                    onClick={() => handleNavigate("/profile")}
                    fontFamily="Inter"
                    fontWeight="bold"
                    _hover={{ bg: "#fd99bf", color: "black" }}
                  >
                    <Image src="/micuenta.png" boxSize="20px" mr={2} />
                    Ver mi perfil
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    fontFamily="Inter"
                    fontWeight="bold"
                    _hover={{ bg: "#fd99bf", color: "black" }}
                  >
                    <Image src="/logout.svg" boxSize="20px" mr={2} />
                    Cerrar sesión
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button
                  {...transparentButtonStyles}
                  onClick={() => handleNavigate("/login")}
                  color={"black"}
                  border="2px solid black"
                  _hover={{
                    bg: "#fc7faa",
                    color: "white",
                    textDecoration: "underline",
                  }}
                >
                  <Image src="login.svg" boxSize="20px" mr={0} />
                  Ingresar
                </Button>

                <Button
                  {...transparentButtonStyles}
                  onClick={() => handleNavigate("/register")}
                  color={"black"}
                  border="2px solid black"
                  _hover={{
                    bg: "#fc7faa",
                    color: "white",
                    textDecoration: "underline",
                  }}
                >
                  <Image src="register.svg" boxSize="20px" mr={0} />
                  Registrarse
                </Button>
              </>
            )}
          </HStack>
        )}
      </Flex>
    </Box>
  );
}

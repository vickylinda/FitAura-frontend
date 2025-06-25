import { Box, Button, Heading, Text, Image } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function Landing() {
  return (
    <Box
      position="relative"
      minHeight="100vh"
      backgroundImage="url('/aura.jpeg')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      px={{ base: 4, md: 8 }}
      py={{ base: 8, md: 0 }}
      overflowX="hidden"
    >
      <Box position="relative" zIndex={1} maxW="container.md">
        <Heading
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="bold"
          mb={{ base: 4, md: 6 }}
          color="white"
          fontFamily={"League Spartan"}
        >
          Bienvenida a
        </Heading>

        <Heading
          fontSize={{ base: "5xl", md: "7xl" }}
          mb={{ base: 2, md: 4 }}
          color="white"
          display="flex"
          gap={2}
          justifyContent="center"
          alignItems="center"
        >
          <Text
            as="span"
            fontFamily="Poppins"
            fontStyle="italic"
            fontWeight={800}
          >
            FIT
          </Text>
          <Text
            as="span"
            fontFamily="Poppins"
            fontStyle="italic"
            fontWeight={400}
          >
            AURA
          </Text>
        </Heading>

        <Text
          fontSize={{ base: "1xl", md: "3xl" }}
          color="white"
          fontFamily="League Spartan"
          fontWeight="bold"
          mb={{ base: 4, md: 6 }}
        >
          Entrenamiento por y para mujeres{" "}
          <Image
            src="/brillito.webp"
            display="inline"
            boxSize="2.5rem"
            ml={-2}
            verticalAlign="-0.30rem"
          />
        </Text>
        <Button
          as={RouterLink}
          to="/home"
          fontSize={{ base: "sm", md: "md" }}
          fontFamily="Poppins"
          px={{ base: 6, md: 8 }}
          py={{ base: 4, md: 6 }}
          bg="whiteAlpha.300"
          color="white"
          borderRadius="full"
          border="1px solid white"
          boxShadow="0 6px 10px rgba(0, 0, 0, 0.25)"
          _hover={{
            transform: "scale(1.05)",
            boxShadow: "0 8px 14px rgba(0, 0, 0, 0.3)",
          }}
        >
          Ingresar
        </Button>
      </Box>
    </Box>
  );
}

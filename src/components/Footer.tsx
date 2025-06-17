import { Box, Heading, Text, Flex } from "@chakra-ui/react";
export default function Footer() {
  return (
    <Box bg="#fd6193" color="white" py={{ base: 8, md: 12 }} px={{ base: 4, md: 8 }} textAlign="center"> 
      <Flex align="center" justify="center">
      <Heading
        fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
        fontFamily="Poppins"
        //fontWeight={"extrabold"}
        letterSpacing="wider"
        mb={0}
        display="inline-flex"
      >
        <Text
              as="span"
              fontStyle="italic"
              fontWeight="extrabold"
            >
              FIT
            </Text>
            <Text
              as="span"
              fontStyle="italic"
              fontWeight="medium"
              ml={1}
            >
              AURA
            </Text>
      </Heading>
      </Flex>
      <Text mt={2} fontFamily="Inter" fontWeight={"hairline"}
      fontSize={{ base: "sm", md: "md" }}maxW="800px"mx="auto"
      >
        Proyecto académico desarrollado por el equipo Nº2 de Aplicaciones Interactivas – UADE, 2025
      </Text>
      <Text fontSize={{ base: "xs", md: "sm" }} mt={4} fontFamily="Inter" fontWeight={"hairline"}>
        © 2025 FITAura | Todos los derechos reservados
      </Text>
    </Box>
  );
}
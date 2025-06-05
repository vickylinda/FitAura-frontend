import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function HeaderLoginRegister() {
  return (
    <Box
      as="header"
      w="100vw"
      bg="rgba(254, 210, 234, 0.85)" // rosa clarito translúcido
      px={{ base: 4, md: 12 }}
      py={4}
      backdropFilter="blur(6px)"
      boxShadow="sm"
      position="relative"
      zIndex={10}
      
    >
      <Flex align="center">
        <Link
          as={RouterLink}
          to="/home"
          _hover={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none", outline: "none", borderColor: "transparent" }}
          _active={{ boxShadow: "none", outline: "none", borderColor: "transparent" }}
          _focusVisible={{ boxShadow: "none", outline: "none", borderColor: "transparent" }}
        ><Box
            bg="#fd6193"
            color="white" //#fd6193
            px={6}
            py={4}
            borderBottomLeftRadius="2xl"
            borderBottomRightRadius="2xl"
            fontWeight="bold"
            fontFamily="Poppins"
            cursor="pointer"
          >
            <Text as="span" fontStyle="italic" fontWeight="extrabold" fontSize="2xl">
              FIT
            </Text>
            <Text as="span" fontStyle="italic" fontWeight="medium" ml={1} fontSize="2xl">
              AURA
            </Text>
          </Box>
        </Link>
      </Flex>
    </Box>
  );
}
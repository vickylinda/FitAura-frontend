import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  Link,
} from "@chakra-ui/react";
import Header from "../components/Header";
import { Link as RouterLink } from "react-router-dom";

const Home = () => {
  const fontSizeCard = useBreakpointValue({ base: "sm", md: "md" }) || "md";

  return (
    <Box>
      <Header />
      <Box
        minHeight="70vh"
        backgroundImage="url('/aura.jpeg')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={4}
      >
        <Box
          textAlign="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Heading
            fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
            fontWeight="bold"
            color="white"
            maxW="auto"
            fontFamily="League Spartan"
            lineHeight="short"
          >
            Elegí el entrenamiento que se adapte a vos
          </Heading>

          <Image
            src="/entren.png"
            boxSize={{ base: "50px", md: "60px" }}
            mt={4}
          />
        </Box>
      </Box>

      {/* filtros por tipo */}
      <Box px={{ base: 4, md: 12 }} py={8} bg="white">
        <Text
          fontWeight="semibold"
          fontFamily={"Poppins"}
          mb={4}
          fontSize={{ base: "lg", md: "xl" }}
        >
          Buscar por tipo de entrenamiento
        </Text>
        <SimpleGrid columns={{ base: 3, sm: 4, md: 6 }} gap={4}>
          {[
            { label: "YOGA", src: "/yoga.jpg" },
            { label: "FUERZA", src: "/fuerza.jpg" },
            { label: "PILATES", src: "/pilates.jpg" },
            { label: "SOLO 15'", src: "/15min.jpg" },
            { label: "CARDIO", src: "/cardio.jpg" },
            { label: "OTROS", src: "/otros.jpg" },
          ].map((item, i) => (
            <Link
              key={i}
              as={RouterLink}
              _hover={{ textDecoration: "none", transform: "scale(1.05)" }}
              transition="all 0.2s ease-in-out"
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
              <Stack align="center" w={"100%"}>
                <Image
                  src={item.src}
                  alt={item.label}
                  boxSize={{ base: "80px", md: "130px" }}
                  borderRadius="full"
                  objectFit="cover"
                />
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="medium"
                  fontFamily={"Poppins"}
                  color={"black"}
                >
                  {item.label}
                </Text>
              </Stack>
            </Link>
          ))}
        </SimpleGrid>
      </Box>

      {/* entrenamientos destacados */}
      <Box px={{ base: 4, md: 12 }} py={8} bg="pink.100">
        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" mb={6}>
          Nuestros entrenamientos{" "}
          <Text as="span" color="#fd6193">
            destacados{" "}
            <Image
              src="/brillito.webp"
              display="inline"
              boxSize="1.5rem"
              ml={0}
              verticalAlign="-0.30rem"
            />
          </Text>
        </Text>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3 }}
          gap={{ base: 6, md: 8 }}
          px={{ base: 4, md: 12 }}
          py={4}
        >
          {[
            {
              title: "Pilates Cardio",
              trainer: "María Paula",
              rating: "4.7/5",
              price: "$15",
              location: "Virtual por Zoom",
              language: "Español",
              image: "/trainer1.jpg",
            },
            {
              title: "Yoga de recuperación",
              trainer: "Vicky",
              rating: "5/5",
              price: "$17",
              location: "Recoleta, CABA",
              language: "Español",
              image: "/trainer2.jpg",
            },
            {
              title: "Pilates en casa",
              trainer: "Martina",
              rating: "4.5/5",
              price: "$20",
              location: "Virtual por Zoom",
              language: "Español",
              image: "/trainer3.avif",
            },
          ].map((clase, index) => (
            <Box key={index} p={4} bg="white" borderRadius="xl" boxShadow="md">
              <Flex
                justify="space-between"
                align="center"
                mb={4}
                wrap="wrap"
                gap={2}
              >
                <Text
                  fontWeight="semibold"
                  fontSize={{ base: "md", md: "lg" }}
                  fontFamily="Poppins"
                >
                  {clase.title}
                </Text>

                <Link
                  as={RouterLink}
                  _hover={{
                    textDecoration: "none",
                    transform: "scale(1.02)",
                    borderColor: "transparent",
                    bg: "transparent",
                  }}
                  _active={{
                    bg: "transparent",
                    boxShadow: "none",
                    outline: "none",
                    borderColor: "transparent",
                  }}
                  _focus={{
                    boxShadow: "none",
                    outline: "none",
                    borderColor: "transparent",
                  }}
                  _focusVisible={{
                    boxShadow: "none",
                    outline: "none",
                    borderColor: "transparent",
                  }}
                  transition="all 0.2s ease"
                >
                  <Flex
                    align="center"
                    border="1px solid #fd6193"
                    borderRadius="lg"
                    px={3}
                    py={2}
                    bg="white"
                    boxShadow="sm"
                  >
                    <Box mr={2}>
                      <Text
                        fontWeight="extrabold"
                        color="#fd6193"
                        fontSize="md"
                        fontFamily="Poppins"
                        lineHeight="1"
                      >
                        {clase.trainer}
                      </Text>
                      <Flex align="center" gap={1}>
                        <Text fontWeight="bold" fontSize="sm" color="black">
                          {clase.rating}
                        </Text>
                        <Image src="/estrella.png" boxSize="1rem" />
                      </Flex>
                    </Box>

                    <Image
                      src={clase.image}
                      alt={clase.trainer}
                      boxSize={{ base: "40px", md: "50px" }}
                      borderRadius="full"
                      objectFit="cover"
                      flexShrink={0}
                    />
                  </Flex>
                </Link>
              </Flex>

              <Text fontSize={fontSizeCard}>
                {" "}
                <Image
                  src="/dinero.webp"
                  display="inline"
                  boxSize="1.5rem"
                  ml={0}
                  verticalAlign="-0.30rem"
                />{" "}
                {clase.price}
              </Text>
              <Text fontSize={fontSizeCard}>
                {" "}
                <Image
                  src="/reloj.png"
                  display="inline"
                  boxSize="1.5rem"
                  ml={0}
                  verticalAlign="-0.30rem"
                />{" "}
                45 mins
              </Text>
              <Text fontSize={fontSizeCard}>
                {" "}
                <Image
                  src="/locacion.png"
                  display="inline"
                  boxSize="1.5rem"
                  ml={0}
                  verticalAlign="-0.30rem"
                />{" "}
                {clase.location}
              </Text>
              <Text fontSize={fontSizeCard}>
                {" "}
                <Image
                  src="/idioma.png"
                  display="inline"
                  boxSize="1.5rem"
                  ml={0}
                  verticalAlign="-0.30rem"
                />
                {clase.language}
              </Text>
              <Button
                mt={4}
                bg={"#fd6193"}
                w="full"
                borderRadius="xl"
                color={"white"}
                _hover={{
                  color: "white",
                  boxShadow: "0 8px 14px rgba(0, 0, 0, 0.3)",
                }}
              >
                Reservar clase
              </Button>
            </Box>
          ))}
        </SimpleGrid>

        <Flex justify="center" mt={10}>
          <Button
            variant="outline"
            fontWeight="bold"
            fontSize={{ base: "sm", md: "md" }}
            fontFamily="Poppins"
            px={{ base: 8, md: 10 }}
            py={{ base: 2, md: 4 }}
            bg="#fd6193"
            color="white"
            borderRadius="full"
            border="1px solid #fd6193"
            boxShadow="0 6px 10px rgba(0, 0, 0, 0.25)"
            _hover={{
              boxShadow: "0 8px 14px rgba(0, 0, 0, 0.3)",
            }}
          >
            Ver Todos
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default Home;

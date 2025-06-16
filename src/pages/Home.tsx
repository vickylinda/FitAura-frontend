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
import { Link as RouterLink } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const [highlightedServices, setHighlightedServices] = useState<any[]>([]);
  const [loadingHighlights, setLoadingHighlights] = useState<boolean>(false);
  const [errorHighlights, setErrorHighlights] = useState<string | null>(null);

  const fontSizeCard = useBreakpointValue({ base: "sm", md: "md" }) || "md";

  useEffect(() => {
    fetchHighlightedServices();
  }, []);

  const fetchHighlightedServices = async () => {
    setLoadingHighlights(true);
    setErrorHighlights(null);

    try {
      const response = await fetch(
        "http://localhost:4000/api/v2/highlighted-services"
      );
      const data = await response.json();

      if (!response.ok) {
        switch (data.internalErrorCode) {
          case 1007:
            setErrorHighlights("No se encontraron entrenamientos destacados.");
            break;
          default:
            setErrorHighlights("Error interno en el servidor.");
            break;
        }
        return;
      }

      setHighlightedServices(data.services);
    } catch (err) {
      console.error("Error al cargar destacados:", err);
      setErrorHighlights("Error interno en el servidor.");
    } finally {
      setLoadingHighlights(false);
    }
  };

  return (
    <Box>

      {/* Hero */}
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
            fontFamily="League Spartan"
            lineHeight="short"
          >
            Elegí el entrenamiento que se adapte a vos
          </Heading>
          <Image src="/entren.png" boxSize={{ base: "50px", md: "60px" }} mt={4} />
        </Box>
      </Box>

      {/* Filtros */}
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

      {/* Entrenamientos destacados */}
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
          {loadingHighlights ? (
            <Text>Cargando entrenamientos destacados...</Text>
          ) : errorHighlights ? (
            <Text color="red">{errorHighlights}</Text>
          ) : highlightedServices.length === 0 ? (
            <Text>No hay entrenamientos destacados.</Text>
          ) : (
            highlightedServices.map((clase, index) => (
              <Flex
                key={index}
                p={4}
                bg="white"
                borderRadius="xl"
                boxShadow="md"
                flexDirection="column"
                position="relative"
                minHeight="440px"
              >
                {/* Card Header */}
                <Flex
                  position="absolute"
                  top={4}
                  right={4}
                  bg="white"
                  border="2px solid #fd6193"
                  borderRadius="lg"
                  px={3}
                  py={2}
                  align="center"
                  boxShadow="md"
                  zIndex={1}
                >
                  <Box mr={2} textAlign="left">
                    <Text
                      fontWeight="extrabold"
                      color="#fd6193"
                      fontSize="md"
                      fontFamily="Poppins"
                      lineHeight="1"
                    >
                      {clase.trainer_name}
                    </Text>
                    <Flex align="center" gap={1}>
                      <Text fontWeight="bold" fontSize="sm" color="black">
                        {clase.trainer_rating
                          ? `${clase.trainer_rating.toFixed(1)}/5`
                          : "Sin reviews"}
                      </Text>
                      <Image src="/estrella.png" boxSize="1rem" />
                    </Flex>
                  </Box>
                  <Image
                    src={clase.profile_pic || "/default_trainer.png"}
                    alt={clase.trainer_name}
                    boxSize={{ base: "40px", md: "50px" }}
                    borderRadius="full"
                    objectFit="cover"
                  />
                </Flex>

                {/* Descripción */}
                <Box mt={20} mb={4} minHeight="60px">
                  {/* 👈 Aquí se fuerza un espacio mínimo */}
                  <Text
                    fontWeight="semibold"
                    fontSize={{ base: "md", md: "lg" }}
                    fontFamily="Poppins"
                  >
                    {clase.description}
                  </Text>
                </Box>

                {/* Bloque de info */}
                <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="flex-start" gap={2}>
                  <Text fontSize={fontSizeCard}>
                    <Image
                      src="/dinero.webp"
                      display="inline"
                      boxSize="1.5rem"
                      ml={0}
                      verticalAlign="-0.30rem"
                    />{" "}
                    ${Number(clase.price).toFixed(2)}
                  </Text>
                  <Text fontSize={fontSizeCard}>
                    <Image
                      src="/reloj.png"
                      display="inline"
                      boxSize="1.5rem"
                      ml={0}
                      verticalAlign="-0.30rem"
                    />{" "}
                    {clase.duration} mins
                  </Text>
                  <Text fontSize={fontSizeCard}>
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
                    <Image
                      src="/idioma.png"
                      display="inline"
                      boxSize="1.5rem"
                      ml={0}
                      verticalAlign="-0.30rem"
                    />{" "}
                    {clase.language}
                  </Text>
                </Box>

                {/* Botón */}
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
              </Flex>
            ))
          )}
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

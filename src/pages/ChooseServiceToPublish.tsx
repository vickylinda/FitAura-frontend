import {
  Box,
  Text,
  Flex,
  SimpleGrid,
  Image,
  AvatarRoot,
  AvatarFallback,
  Button,
  VStack,
  Heading,
} from "@chakra-ui/react";
import Header from "@/components/Header";
import { useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useBreakpointValue, Spinner } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { useFetchWithAuth } from "@/utils/fetchWithAuth";
import { toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
const ChooseServiceToPublish = () => {
  const fetchWithAuth = useFetchWithAuth();
  const { user } = useAuth();
  const trainerId = user?.id;
  const fontSizeCard = useBreakpointValue({ base: "sm", md: "md" }) || "md";

  const [services, setServices] = useState<any[]>([]);
  const [errorServices, setErrorServices] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!trainerId) return;
    const fetchData = async () => {
      setIsLoading(true);
      const numericId = Number(trainerId);
      console.log("Trainer ID detectado:", numericId);

      try {
        const servicesData = await fetchServices(numericId);
        setServices(servicesData);
      } catch (err) {
        console.error("Error al cargar servicios:", err);
        setErrorServices("No se pudieron cargar los servicios.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [trainerId]);

  const fetchServices = async (trainerId: number) => {
    const res = await fetch(
      `http://localhost:4000/api/v2/services?trainerId=${trainerId}&&published=false`
    );
    const data = await res.json();

    if (!res.ok) {
      if (data.internalErrorCode === 1007) {
        // No hay servicios disponibles (no es un error)
        return [];
      }
      throw new Error("Error al cargar los servicios");
    }
    return data.services;
  };

  if (isLoading) {
    return (
      <VStack justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="#fd6193" />
        <Text color="#fd6193">Cargando...</Text>
      </VStack>
    );
  }

  const publishService = async (serviceId: number) => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:4000/api/v2/services/${serviceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ published: true }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al publicar el servicio");
      }

      toaster.create({
        title: "Servicio publicado",
        description: "El servicio se publicó correctamente.",
        type: "success",
        duration: 2000,
      });

      window.location.reload();
    } catch (err) {
      console.error("Error al publicar servicio:", err);

      toaster.create({
        title: "Error al publicar",
        description: "No se pudo publicar el servicio.",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box minH="100vh" bg="white" overflowX="hidden">
<Header />
   
    <Box
      minH="100vh"
      w="100vw"
      bg="white"
      px={{ base: 4, md: 10 }}
      py={{ base: 4, md: 6 }}
    >

      <Heading
                     as="h1"
                     fontSize={{ base: "2xl", md: "3xl" }}
                     color="#fd6193"
                     fontWeight="bold"
                     mb={2}
                     fontFamily={"Inter"}
                     mt={0}
                   >
                     Seleccione el servicio a publicar
                   </Heading>
                   <Box h="2px" w="100%" bg="#fd6193" mb={6} />

      <Box
        mt={6}
        bg="white"
        borderRadius="2xl"
        boxShadow="xl"
        px={{ base: 4, md: 10 }}
        py={8}
      >
        {errorServices && <Text color="red">{errorServices}</Text>}
        {services.length === 0 ? (
          <Text>No hay servicios no publicados de esta entrenadora.</Text>
        ) : (
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3 }}
            gap={{ base: 6, md: 8 }}
          >
            {services.map((service, index) => (
              <Box
                key={index}
                p={4}
                bg="white"
                borderRadius="xl"
                boxShadow="md"
                display="flex"
                flexDirection="column"
                height="100%"
              >
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
                    flex="1 1 100%"
                    wordBreak="break-word"
                  >
                    {service.title}
                  </Text>

                  <Flex
                    as={RouterLink}
                    to={`/trainer/${service.trainerid}`}
                    _hover={{ transform: "scale(1.05)", boxShadow: "md" }}
                    transition="all 0.2s ease-in-out"
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
                        {service.trainer_name}
                      </Text>
                      <Flex align="center" gap={1}>
                        <Text fontWeight="bold" fontSize="sm" color="black">
                          {service.trainer_rating
                            ? `${service.trainer_rating.toFixed(1)}/5`
                            : "Sin reviews"}
                        </Text>
                        <Image src="/estrella.png" boxSize="1rem" />
                      </Flex>
                    </Box>
                    {service.profile_pic ? (
                      <Image
                        src={service.profile_pic}
                        alt={service.trainer_name}
                        boxSize={{ base: "40px", md: "50px" }}
                        borderRadius="full"
                        objectFit="cover"
                        flexShrink={0}
                      />
                    ) : (
                      <AvatarRoot colorPalette="pink">
                        <AvatarFallback />
                      </AvatarRoot>
                    )}
                  </Flex>
                </Flex>

                <Box flexGrow={1} mb={4}>
                  <Text fontSize={fontSizeCard}>
                    <Image
                      src="/dinero.webp"
                      display="inline"
                      boxSize="1.5rem"
                      verticalAlign="-0.30rem"
                    />{" "}
                    ${Number(service.price).toFixed(2)}
                  </Text>
                  <Text fontSize={fontSizeCard}>
                    <Image
                      src="/reloj.png"
                      display="inline"
                      boxSize="1.5rem"
                      verticalAlign="-0.30rem"
                    />{" "}
                    {service.duration} mins
                  </Text>
                  <Text fontSize={fontSizeCard}>
                    <Image
                      src="/locacion.png"
                      display="inline"
                      boxSize="1.5rem"
                      verticalAlign="-0.30rem"
                    />{" "}
                    {service.location}
                  </Text>
                  <Text fontSize={fontSizeCard}>
                    <Image
                      src="/idioma.png"
                      display="inline"
                      boxSize="1.5rem"
                      verticalAlign="-0.30rem"
                    />{" "}
                    {service.language}
                  </Text>

                  <Text fontSize={fontSizeCard} mt={2} fontWeight="bold">
                    Horarios disponibles:
                  </Text>
                  <Box mt={2} mb={4}>
                    {service.timeavailability ? (
                      Object.entries(service.timeavailability).map(
                        ([day, times]) => (
                          <Text key={day} fontSize={fontSizeCard}>
                            <strong>
                              {day.charAt(0).toUpperCase() + day.slice(1)}:
                            </strong>{" "}
                            {times.join(", ")}
                          </Text>
                        )
                      )
                    ) : (
                      <Text fontSize={fontSizeCard} color="gray.500">
                        No hay horarios disponibles.
                      </Text>
                    )}
                  </Box>

                  <Button
                    onClick={() => publishService(service.id)}
                    bg="#fd6193"
                    w="full"
                    borderRadius="xl"
                    color="white"
                    _hover={{
                      color: "white",
                      boxShadow: "0 8px 14px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    Publicar servicio
                  </Button>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
     <Footer />
     </Box>
  );
};

export default ChooseServiceToPublish;

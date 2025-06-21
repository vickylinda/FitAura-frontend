import {
  Box,
  Text,
  Flex,
  SimpleGrid,
  Button,
  Image,
  AvatarRoot,
  AvatarFallback,
} from '@chakra-ui/react';
import { Avatar} from '@chakra-ui/avatar';
import { useFetchWithAuth } from '@/utils/fetchWithAuth';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";

const MisEntrenamientos = () => {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState<number | null>(null);

  const fetchWithAuth = useFetchWithAuth();

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await fetchWithAuth("http://localhost:4000/api/v1/client-trainings");
        if (!res) return;

        const data = await res.json();
        console.log("[MisEntrenamientos] Respuesta del backend:", data);
        setTrainings(Array.isArray(data.trainings) ? data.trainings : []);
        console.log("[MisEntrenamientos] Trainings recibidos:", data.trainings);

        setErrorCode(null);
      } catch (err: any) {
        try {
          const errorData = await err?.response?.json?.();
          const code = errorData?.internalErrorCode || 1000;
          setErrorCode(code);
        } catch {
          setErrorCode(1000);
        }
        setTrainings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  const proximos = trainings.filter(t => t.status === 'aceptado' || t.status === 'pendiente');
  const calificar = trainings.filter(t => t.status === 'completado' && !t.hasReview);
  const realizados = trainings.filter(t => t.status === 'completado' && t.hasReview);

  if (loading) {
    return <Text p={8}>Cargando entrenamientos...</Text>;
  }

  return (
    <Box  minH="100vh" bg={"white"}>
      <Header />

      <Text color="#fd6193" fontWeight="bold" fontSize="2xl" mb={2}>
        Estado de mis entrenamientos
      </Text>

      <Box height="2px" width="100%" bg="#fd6193" borderRadius="full" mb={6} />

      {/* Próximos */}
      <Text color="gray.700" fontWeight="semibold" fontSize="lg" mb={2}>
        Próximos entrenamientos
      </Text>

      <Box height="2px" width="100%" bg="#fd6193" borderRadius="full" mb={6} />

      {proximos.length > 0 ? (
  <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={{ base: 6, md: 8 }} mb={8}>
    {proximos.map((training, index) => (
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
    <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
      <Text fontWeight="semibold" fontSize={{ base: "md", md: "lg" }} fontFamily="Poppins">
        {training.title}
      </Text>

      <Flex
        as={RouterLink}
        to={`/trainer/${training.trainerId}`}
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
          <Text fontWeight="extrabold" color="#fd6193" fontSize="md" fontFamily="Poppins">
            {training.trainerName}
          </Text>
          <Flex align="center" gap={1} >
            
            <Text fontWeight="bold" fontSize="sm" color="black" mt={1}>
              {!isNaN(parseFloat(training.trainerRating))
                ? `${parseFloat(training.trainerRating).toFixed(1)}/5`
                : "Sin reviews"}
            </Text>
            <Image src="/estrella.png" boxSize="1rem" />
          </Flex>
        </Box>

        {training.trainerPicture ? (
          <Image
            src={training.trainerPicture}
            alt={training.trainerName}
            boxSize="50px"
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
      <Text>
        <Image src="/dinero.webp" display="inline" boxSize="1.5rem" verticalAlign="-0.30rem" /> ${training.price}
      </Text>
      <Text>
        <Image src="/reloj.png" display="inline" boxSize="1.5rem" verticalAlign="-0.30rem" /> {training.duration} mins
      </Text>
      <Text>
        <Image src="/locacion.png" display="inline" boxSize="1.5rem" verticalAlign="-0.30rem" /> {training.location}
      </Text>
      <Text>
        <Image src="/idioma.png" display="inline" boxSize="1.5rem" verticalAlign="-0.30rem" /> {training.language}
      </Text>
      {training.selectedSchedule && (
        <Box mt={2}>
          <Text fontWeight="semibold">Horarios seleccionados:</Text>
          {(Object.entries(training.selectedSchedule) as [string, string[]][]).map(([day, times]) => (
            <Text key={day}>
              <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> {times.join(", ")}
            </Text>
          ))}
        </Box>
        )}

        {training.endDate && (
          <Text mt={2}>
            Finaliza el {" "}
            {new Date(training.endDate * 1000).toLocaleDateString("es-AR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        )}
    </Box>

    <Box
      mt="auto"
      bg={training.status === "aceptado" ? "green.300" : "yellow.200"}
      color="black"
      borderRadius="xl"
      fontWeight="semibold"
      textAlign="center"
      py={2}
    >
      {training.status === "aceptado" ? "Aceptado" : "Pendiente"}
    </Box>
  </Box>
))}

  </SimpleGrid>
) : (
  <Text color="red.500" fontSize="md" ml={2} mb={8}>
    Sin entrenamientos próximos.
  </Text>
)}

      {/* Completados */}
      <Text color="gray.700" fontWeight="semibold" fontSize="lg" mb={2}>
        Entrenamientos completados.
      </Text>

      <Box height="2px" width="100%" bg="#fd6193" borderRadius="full" mb={6} />

      {[...calificar, ...realizados].length > 0 ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={{ base: 6, md: 8 }} mb={8}>
          {[...calificar, ...realizados].map((training, index) => (
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
              <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
                <Text fontWeight="semibold" fontSize={{ base: "md", md: "lg" }} fontFamily="Poppins">
                  {training.description}
                </Text>

                <Flex
                    as={RouterLink}
                    to={`/trainer/${training.trainerId}`}
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
                    <Text fontWeight="extrabold" color="#fd6193" fontSize="md" fontFamily="Poppins">
                      {training.trainerName}
                    </Text>
                    <Flex align="center" gap={1}>
                    <Text fontWeight="bold" fontSize="sm" color="black" mt={1}>
                      {!isNaN(parseFloat(training.trainerRating))
                        ? `${parseFloat(training.trainerRating).toFixed(1)}/5`
                        : "Sin reviews"}
                    </Text>

                      <Image src="/estrella.png" boxSize="1rem" />
                    </Flex>
                  </Box>

                  {training.trainerPicture ? (
                    <Image
                      src={training.trainerPicture}
                      alt={training.trainerName}
                      boxSize="50px"
                      borderRadius="full"
                      objectFit="cover"
                      flexShrink={0}
                    />
                  ) : (
                    <Avatar name={training.trainerName} bg="pink.300" />
                  )}
                </Flex>
              </Flex>

              <Box flexGrow={1} mb={4}>
                <Text>
                  <Image src="/dinero.webp" display="inline" boxSize="1.5rem" verticalAlign="-0.30rem" /> ${training.price}
                </Text>
                <Text>
                  <Image src="/reloj.png" display="inline" boxSize="1.5rem" verticalAlign="-0.30rem" /> {training.duration} mins
                </Text>
                <Text>
                  <Image src="/locacion.png" display="inline" boxSize="1.5rem" verticalAlign="-0.30rem" /> {training.location}
                </Text>
                <Text>
                  <Image src="/idioma.png" display="inline" boxSize="1.5rem" verticalAlign="-0.30rem" /> {training.language}
                </Text>
                
                {training.selectedSchedule && (
                  <Box mt={2}>
                    <Text fontWeight="semibold">Horarios seleccionados:</Text>
                    {(Object.entries(training.selectedSchedule) as [string, string[]][]).map(([day, times]) => (
                      <Text key={day}>
                        <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> {times.join(", ")}
                      </Text>
                    ))}
                  </Box>
                  )}

                  {training.endDate && (
                    <Text mt={2}>
                      Finalizó el {" "}
                      {new Date(training.endDate * 1000).toLocaleDateString("es-AR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Text>
                  )}


              </Box>

              {training.hasReview ? (
  <Box
    mt="auto"
    bg="green.200"
    color="black"
    borderRadius="xl"
    fontWeight="semibold"
    textAlign="center"
    py={2}
  >
    Completado y servicio ya puntuado
  </Box>
) : (
  <Button
    mt="auto"
    bg="#fd6193"
    color="white"
    w="full"
    borderRadius="xl"
    fontWeight="semibold"
    _hover={{ bg: "#fc7faa" }}
  >
    Calificar entrenamiento
  </Button>
)}

            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text color="red.500" fontSize="md" ml={2} mb={8}>
          Sin entrenamientos completados.
        </Text>
      )}
    </Box>
  );
};

export default MisEntrenamientos;

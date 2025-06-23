import {
  Box,
  Text,
  Flex,
  SimpleGrid,
  Button,
  Image,
  AvatarRoot,
  AvatarFallback,
  Heading,
  Tag,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import { useFetchWithAuth } from "@/utils/fetchWithAuth";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Footer from "@/components/Footer";

const MisEntrenamientos = () => {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false); // 👉 Para spinner de acciones

  const fetchWithAuth = useFetchWithAuth();

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await fetchWithAuth(
          "http://localhost:4000/api/v1/client-trainings"
        );
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

  const proximos = trainings.filter(
    (t) =>
      t.status === "aceptado" ||
      t.status === "pendiente" ||
      t.status === "cancelado"
  );
  const calificar = trainings.filter(
    (t) => t.status === "completado" && !t.hasReview
  );
  const realizados = trainings.filter(
    (t) => t.status === "completado" && t.hasReview
  );

  const cancelTraining = async (trainingId: number) => {
  setSubmitting(true);
  try {
    const response = await fetchWithAuth(
      `http://localhost:4000/api/v1/trainings/${trainingId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newStatus: "cancelado",
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "No se pudo cancelar");
    }

    // ✅ Actualiza el estado local para reflejar el cambio en la UI:
    const updated = trainings.map(t =>
      t.id === trainingId ? { ...t, status: "cancelado" } : t
    );
    setTrainings(updated);

  } catch (err) {
    console.error("Error al cancelar entrenamiento:", err);
    // Opcional: podrías usar toaster para notificar
  } finally {
    setSubmitting(false);
  }
};



  if (loading || submitting) {
    return (
      <VStack justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="#fd6193" />
        <Text color="#fd6193">Cargando...</Text>
      </VStack>
    );
  }
  return (
    <Box minH="100vh" bg={"white"}>
      <Header />
      <Box px={{ base: 4, md: 12 }} py={6} maxW="100%" mx="auto">
        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          color="#fd6193"
          fontWeight="bold"
          mb={2}
          fontFamily={"Inter"}
        >
          Estado de mis entrenamientos
        </Heading>
        <Text color="gray.500" fontSize="sm" mb={2}>
          Consulta acá el estado de todos tus entrenamientos que aún no han
          concluido, ya sean pendientes de confirmación, aprobados o cancelados.
        </Text>
        <Box h="2px" w="100%" bg="#fd6193" mb={10} />

        {proximos.length > 0 ? (
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3 }}
            gap={{ base: 6, md: 8 }}
            mb={8}
          >
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
                <Flex direction="column" mb={4} gap={2}>
                  <Tag.Root
                    size="lg"
                    colorPalette={
                      training.status === "aceptado"
                        ? "green"
                        : training.status === "pendiente"
                          ? "yellow"
                          : training.status === "cancelado"
                            ? "red"
                            : "gray"
                    }
                    alignSelf="start"
                  >
                    <Tag.Label>
                      {training.status.charAt(0).toUpperCase() +
                        training.status.slice(1)}
                    </Tag.Label>
                  </Tag.Root>

                  <Text
                    fontWeight="semibold"
                    fontSize={{ base: "md", md: "lg" }}
                    fontFamily="Poppins"
                  >
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
                    alignSelf="start"
                  >
                    <Box mr={2}>
                      <Text
                        fontWeight="extrabold"
                        color="#fd6193"
                        fontSize="md"
                        fontFamily="Poppins"
                      >
                        {training.trainerName}
                      </Text>
                      <Flex align="center" gap={1}>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          color="black"
                          mt={1}
                        >
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
                    <Image
                      src="/dinero.webp"
                      display="inline"
                      boxSize="1.5rem"
                      verticalAlign="-0.30rem"
                    />{" "}
                    ${training.price}
                  </Text>
                  <Text>
                    <Image
                      src="/reloj.png"
                      display="inline"
                      boxSize="1.5rem"
                      verticalAlign="-0.30rem"
                    />{" "}
                    {training.duration} mins
                  </Text>
                  <Text>
                    <Image
                      src="/locacion.png"
                      display="inline"
                      boxSize="1.5rem"
                      verticalAlign="-0.30rem"
                    />{" "}
                    {training.location}
                  </Text>
                  <Text>
                    <Image
                      src="/idioma.png"
                      display="inline"
                      boxSize="1.5rem"
                      verticalAlign="-0.30rem"
                    />{" "}
                    {training.language}
                  </Text>
                  {training.selectedSchedule && (
                    <Box mt={2}>
                      <Text fontWeight="semibold">Horarios seleccionados:</Text>
                      {(
                        Object.entries(training.selectedSchedule) as [
                          string,
                          string[],
                        ][]
                      ).map(([day, times]) => (
                        <Text key={day}>
                          <strong>
                            {day.charAt(0).toUpperCase() + day.slice(1)}:
                          </strong>{" "}
                          {times.join(", ")}
                        </Text>
                      ))}
                    </Box>
                  )}

                  {training.endDate && (
                    <Text mt={2}>
                      Finaliza el{" "}
                      {new Date(training.endDate * 1000).toLocaleDateString(
                        "es-AR",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </Text>
                  )}
                  {training.status === "pendiente" && (
  <Flex
    align="center"
    gap={1}
    fontSize="sm"
    color="gray.600"
    mt={2}
    _hover={{
      textDecoration: "underline",
      cursor: "pointer",
    }}
    onClick={() => cancelTraining(training.id)}
  >
    <Image src="cancel.png" boxSize="1rem" />
    <Text>Cancelar entrenamiento</Text>
  </Flex>
)}

                  {training.status === "aceptado" &&
                    training.hasAttachments && (
                      <Flex
                        as={RouterLink}
                        to={`/training/${training.id}/attachments`}
                        align="center"
                        gap={2}
                        fontSize="sm"
                        color="gray.600"
                        mt={2}
                        _hover={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        <Image src="attachment.svg" boxSize="1rem" />
                        <Text>Ver archivos adjuntos</Text>
                      </Flex>
                    )}
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Text color="red.500" fontSize="md" ml={2} mb={8}>
            Sin entrenamientos próximos.
          </Text>
        )}

        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          color="#fd6193"
          fontWeight="bold"
          mb={2}
          fontFamily={"Inter"}
        >
          Comentar y puntuar
        </Heading>
        <Text color="gray.500" fontSize="sm" mb={2}>
          Todos los entrenamientos completados se mostrarán acá, dándote la
          posibilidad de calificarlos y escribir tus comentarios.
        </Text>
        <Box h="2px" w="100%" bg="#fd6193" mb={10} />

        {[...calificar, ...realizados].length > 0 ? (
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3 }}
            gap={{ base: 6, md: 8 }}
            mb={8}
          >
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
                <Flex
                  justify="space-between"
                  align="center"
                  mb={4}
                  wrap="wrap"
                  gap={2}
                >
                  {training.hasReview && (
                    <Tag.Root size="lg" colorPalette="pink" alignSelf="start">
                      <Tag.Label>Entrenamiento puntuado</Tag.Label>
                    </Tag.Root>
                  )}
                  <Text
                    fontWeight="semibold"
                    fontSize={{ base: "md", md: "lg" }}
                    fontFamily="Poppins"
                  >
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
                      <Text
                        fontWeight="extrabold"
                        color="#fd6193"
                        fontSize="md"
                        fontFamily="Poppins"
                      >
                        {training.trainerName}
                      </Text>
                      <Flex align="center" gap={1}>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          color="black"
                          mt={1}
                        >
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
                    <Image
                      src="/dinero.webp"
                      display="inline"
                      boxSize="1.5rem"
                      verticalAlign="-0.30rem"
                    />{" "}
                    ${training.price}
                  </Text>
                  <Text>
                    <Image
                      src="/reloj.png"
                      display="inline"
                      boxSize="1.5rem"
                      verticalAlign="-0.30rem"
                    />{" "}
                    {training.duration} mins
                  </Text>
                  <Text>
                    <Image
                      src="/locacion.png"
                      display="inline"
                      boxSize="1.5rem"
                      verticalAlign="-0.30rem"
                    />{" "}
                    {training.location}
                  </Text>
                  <Text>
                    <Image
                      src="/idioma.png"
                      display="inline"
                      boxSize="1.5rem"
                      verticalAlign="-0.30rem"
                    />{" "}
                    {training.language}
                  </Text>

                  {training.selectedSchedule && (
                    <Box mt={2}>
                      <Text fontWeight="semibold">Horarios seleccionados:</Text>
                      {(
                        Object.entries(training.selectedSchedule) as [
                          string,
                          string[],
                        ][]
                      ).map(([day, times]) => (
                        <Text key={day}>
                          <strong>
                            {day.charAt(0).toUpperCase() + day.slice(1)}:
                          </strong>{" "}
                          {times.join(", ")}
                        </Text>
                      ))}
                    </Box>
                  )}

                  {training.endDate && (
                    <Text mt={2}>
                      Finalizó el{" "}
                      {new Date(training.endDate * 1000).toLocaleDateString(
                        "es-AR",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </Text>
                  )}
                </Box>

                {!training.hasReview && (
                  <Button
                    as={RouterLink}
                    to={`/training/${training.id}/rate`}
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
      <Footer />
    </Box>
  );
};

export default MisEntrenamientos;

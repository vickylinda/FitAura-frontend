import {
  Box,
  Text,
  Flex,
  Image,
  Button,
  Textarea,
  Heading,
  AvatarRoot,
  AvatarFallback,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useFetchWithAuth } from "@/utils/fetchWithAuth";

const RateTraining = () => {
  const { trainingId } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fetchWithAuth = useFetchWithAuth();

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await fetchWithAuth(
          `http://localhost:4000/api/v1/trainings/${trainingId}`
        );
        const data = await res.json();
        setTraining(data.training);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (trainingId) fetchTraining();
  }, [trainingId]);

  const handleSubmit = async () => {
    if (!rating) {
      alert("Seleccioná una puntuación del 1 al 5.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetchWithAuth(`http://localhost:4000/api/v1/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainingId: parseInt(trainingId || "0"),
          rating,
          comment,
        }),
      });
      const data = await res.json();
      console.log("Reseña enviada:", data);
      navigate("/mytrainings");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <VStack justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="#fd6193" />
        <Text mt={4} color="#fd6193">
          Cargando entrenamiento...
        </Text>
      </VStack>
    );

  if (!training) return <Text p={8}>Entrenamiento no encontrado.</Text>;

  return (
    <Box minH="100vh" bg="white">
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
          Calificar entrenamiento
        </Heading>

        <Box h="2px" w="100%" bg="#fd6193" mb={10} />

        <Box
          p={4}
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          mb={8}
          maxW="400px" 
        >
          <Text fontWeight="semibold" fontSize={{ base: "md", md: "lg" }}>
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
            w="fit-content"
            mt={2}
          >
            <Box mr={2}>
              <Text fontWeight="extrabold" color="#fd6193" fontSize="md">
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
              <AvatarRoot colorPalette="pink">
                <AvatarFallback />
              </AvatarRoot>
            )}
          </Flex>

          <Box mt={4}>
            <Text>
              <Image
                src="/dinero.webp"
                display="inline"
                boxSize="1.5rem"
                verticalAlign="-0.30rem"
              />{" "}
              ${Number(training.price).toFixed(2)}
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
          </Box>
        </Box>

        <Box p={4} bg="white" borderRadius="xl" boxShadow="md" mb={8}>
          <Text mb={4} fontWeight="semibold">
            Del 1 al 5, considerando 1 como el puntaje más bajo y 5 como el más
            alto, ¿qué puntaje le darías a {training.trainerName}?
          </Text>
          <Flex gap={4} justify="center" mb={2} flexWrap="wrap">
            {[1, 2, 3, 4, 5].map((num) => (
              <Button
                key={num}
                onClick={() => setRating(num)}
                bg={rating === num ? "#fd6193" : "gray.100"}
                color={rating === num ? "white" : "black"}
                borderRadius="full"
                w="50px"
                h="50px"
                fontSize="lg"
                _hover={{ bg: "#fc7faa" }}
              >
                {num}
              </Button>
            ))}
          </Flex>
          <Text textAlign="center">Puntaje seleccionado: {rating ?? "-"}</Text>
        </Box>

        <Box p={4} bg="white" borderRadius="xl" boxShadow="md" mb={8}>
          <Text mb={4} fontWeight="semibold">
            ¿Querés agregar algún comentario sobre {training.trainerName}?
          </Text>
          <Textarea
            placeholder="Escribí tu comentario acá..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            minH="150px"
          />
        </Box>

        <Button
          bg="#fd6193"
          color="white"
          borderRadius="xl"
          fontWeight="semibold"
          _hover={{ bg: "#fc7faa" }}
          onClick={handleSubmit}
          display="block" 
          mx="auto"
          w="100%" 
          maxW="400px"
          isLoading={submitting}
        >
          Enviar calificación
        </Button>
      </Box>

      <Footer />
    </Box>
  );
};

export default RateTraining;

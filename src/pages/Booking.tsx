import {
  Box,
  Button,
  Heading,
  Flex,
  AvatarRoot,
  AvatarFallback,
  Image,
  Checkbox,
  Input,
  Text,
  VStack,
  SimpleGrid,
  Stack,
  Spinner,
  Center,
  Textarea,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { Link as RouterLink } from "react-router-dom";
import Header from "@/components/Header";
import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

import Footer from "@/components/Footer";
import { useFetchWithAuth } from "@/utils/fetchWithAuth";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import ReviewCard from "@/components/ReviewCard";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from "@mui/material/styles";

type ServiceData = {
  id: number;
  category: string;
  title: string;
  description: string;
  duration: number;
  price: string;
  published: boolean;
  location: string;
  timeAvailability: {
    [day: string]: string[];
  };
  freeSlots: {
    [day: string]: string[];
  };
  trainerId: number;
  language: string;
  capacity: number;
  trainerName: string;
  trainerPic: string;
  trainerDescription: string;
  trainerRating: string;
  statusCode: number;
};

export default function Booking() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [trainerStats, setTrainerStats] = useState<any>(null);
  const [trainerReviews, setTrainerReviews] = useState<any[]>([]);
  const [yearsUsingApp, setYearsUsingApp] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchWithAuth = useFetchWithAuth();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v2/services/${serviceId}`
        );
        setServiceData(res.data);
      } catch (err) {
        console.error("Error al cargar el servicio", err);
      }
    };
    if (serviceId) fetchService();
  }, [serviceId]);
  useEffect(() => {
    const fetchTrainerData = async () => {
      if (!serviceData?.trainerId) return;

      const id = serviceData.trainerId;

      try {
        const [statsRes, reviewsRes, profileRes] = await Promise.all([
          fetch(`http://localhost:4000/api/v1/users/${id}/trainer-statistics`),
          fetch(`http://localhost:4000/api/v1/reviews?trainerId=${id}`),
          fetch(`http://localhost:4000/api/v1/trainers/${id}/profile`),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setTrainerStats(statsData);
        }

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setTrainerReviews(reviewsData.reviews);
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const joiningDateSeconds = profileData.joiningDate;
          const years = Math.floor(
            (Date.now() / 1000 - joiningDateSeconds) / (60 * 60 * 24 * 365)
          );
          setYearsUsingApp(years);
        }
      } catch (err) {
        console.error("Fallo al obtener datos del trainer:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainerData();
  }, [serviceData]);

  const handleBooking = async () => {
    if (!serviceData || !endDate || Object.keys(selectedHours).length === 0) {
      toaster.create({
        title: "Error",
        description: "Debes ingresar al menos un horario semanal y una fecha de finalización de la contratación.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    const payload = {
      serviceId: serviceData.id,
      selectedSchedule: selectedHours,
      endDate: Math.floor(new Date(endDate).getTime() / 1000),
      comment: comment.trim() || undefined,
    };

    try {
      const response = await fetchWithAuth(
        "http://localhost:4000/api/v1/client-trainings",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al reservar:", errorData);
      
        if (errorData.internalErrorCode === 1005) {
          toaster.create({
            title: "Error",
            description: "No podés reservar un entrenamiento con vos misma.",
            type: "error",
            duration: 3000,
          });
        } else {
          toaster.create({
            title: "Error al reservar",
            description: errorData.message || "Ocurrió un error inesperado.",
            type: "error",
            duration: 3000,
          });
        }
      
        return;
      }
      
      
      toaster.create({
        title: "Reserva creada",
        description: "¡Tu entrenamiento fue reservado correctamente!",
        type: "success",
        duration: 3000,
      });
      

    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Error de conexión al reservar.");
    }
  };

  const [endDate, setEndDate] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedHours, setSelectedHours] = useState<{
    [key: string]: string[];
  }>({});
  const [comment, setComment] = useState("");
  const pricePerClass = Number(serviceData?.price) ;

  const calculateClasses = () => {
    if (!endDate) return 0;
    const today = dayjs().startOf("day");
    const end = dayjs(endDate).endOf("day");
    let total = 0;
    let current = today;
    while (current.isBefore(end)) {
      const dayName = current.format("dddd");
      const numHours = selectedHours[dayName]?.length || 0;
      total += numHours; // suma solo si hay horas (numHours > 0)
      current = current.add(1, "day");
    }
    return total;
  };

  const totalClasses = calculateClasses();
  const totalPrice = totalClasses * pricePerClass;

  /*Esto era para el mock. Ahora que integramos con el back lo dejo comentado.
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const availableHours = ["08:00", "09:00", "10:00", "18:00", "19:00", "20:00"];
*/

  if (isLoading || !serviceData) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="pink.400" />
      </Center>
    );
  }
  const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#fd6193",
      dark: "#fd6193",   // 👈 igual que main
      contrastText: "#fff",
    },
  },
});

  return (
    <Box minH="100vh" bg="white">
      <Header />

      <Box px={{ base: 4, md: 10 }} pb={10}>
        <Box
          p={4}
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          display="flex"
          flexDirection="column"
          height="100%"
          maxW="1000px"
          mx="auto"
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
              {serviceData?.title || "Cargando..."}
            </Text>
            <Flex
              as={RouterLink}
              to={`/trainer/${serviceData?.trainerId}`}
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
                  {serviceData?.trainerName || "Cargando..."}
                </Text>
                <Flex align="center" gap={1}>
                  <Text fontWeight="bold" fontSize="sm" color="black" mt={1}>
                    {serviceData?.trainerRating ?? "aún sin reviews"}
                  </Text>
                  <Image src="/estrella.png" boxSize="1rem" />
                </Flex>
              </Box>
              {serviceData?.trainerPic ? (
                <Image
                  src={serviceData?.trainerPic}
                  alt={serviceData.trainerName}
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

          {/* Fecha de finalización */}
          <ThemeProvider theme={muiTheme}>
<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
  <VStack align="start" mb={4} w="full">
    <Text fontWeight="bold">Fecha de finalización</Text>
    <DatePicker
      format="DD/MM/YYYY"
      value={endDate ? dayjs(endDate) : null}
      onChange={(newValue) => {
        if (newValue) {
          setEndDate(newValue.format("YYYY-MM-DD"));
        } else {
          setEndDate("");
        }
      }}
      slotProps={{
        textField: {
          fullWidth: true,
          size: "small",
          sx: {
            "& label": { color: "#fd6193" },
            "& label.Mui-focused": { color: "#fd6193" },
            "& .MuiInputBase-root": {
              "& fieldset": {
                borderColor: "#fd6193",
              },
              "&:hover fieldset": {
                borderColor: "#fd6193",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#fd6193",
              },
            },
            "& .MuiSvgIcon-root": {
              color: "#fd6193", // iconito del calendario
            },
          },
        },
      }}
    />
  </VStack>
</LocalizationProvider>
</ThemeProvider>


          {/* Selección de días y horas */}
          <VStack align="start" mb={4}>
            <Text fontWeight="bold">Selecciona días y horarios</Text>
            {Object.keys(serviceData?.freeSlots || {}).map((day) => (
              <Box
                key={day}
                border="1px solid #ddd"
                borderRadius="md"
                p={2}
                w="100%"
              >
                <Checkbox.Root
                  checked={selectedDays.includes(day)}
                  onCheckedChange={({checked}) => {
                    if (checked === true) {
                      setSelectedDays((prev) =>
                        Array.from(new Set([...prev, day]))
                      );
                    } else if (checked === false) {
                      setSelectedDays(selectedDays.filter((d) => d !== day));
                      const updatedHours = { ...selectedHours };
                      delete updatedHours[day];
                      setSelectedHours(updatedHours);
                    }
                  }}
                  colorPalette="pink"
                  variant="subtle"
                >
                  {" "}
                  <Checkbox.HiddenInput />
                  <Checkbox.Control style={{ cursor: "pointer" }} />
                  <Checkbox.Label style={{ cursor: "pointer" }}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Checkbox.Label>
                </Checkbox.Root>

                {selectedDays.includes(day) && (
                  <Flex mt={2} wrap="wrap" gap={2}>
                    {(serviceData.freeSlots[day] || []).map((hour) => {
                      const isSelected =
                        selectedHours[day]?.includes(hour) || false;

                      return (
                        <Button
                          key={hour}
                          size="sm"
                          variant={isSelected ? "solid" : "outline"}
                          colorScheme="pink"
                          onClick={() => {
                            const currentHours = selectedHours[day] ?? []; // asegura array

                            const newHours = isSelected
                              ? currentHours.filter((h) => h !== hour)
                              : [...currentHours, hour];
                            setSelectedHours({
                              ...selectedHours,
                              [day]: newHours,
                            });
                          }}
                        >
                          {hour}
                        </Button>
                      );
                    })}
                  </Flex>
                )}
              </Box>
            ))}
          </VStack>

          <VStack align="start" mb={4} w="full">
            <Text fontWeight="bold">Resumen:</Text>
            {selectedDays.length > 0 && (
              <Text>
                Reservaste {totalClasses} clases:{" "}
                {selectedDays
                  .filter((day) => (selectedHours[day] ?? []).length > 0)
                  .map((day) => {
                    const hours = selectedHours[day] || [];
                    return `${day} a las ${hours.join(", ")}`;
                  })
                  .join("; ")}
              </Text>
            )}

            <Text>Precio por clase: ${pricePerClass} ARS</Text>
            <Text fontWeight="bold">Total a pagar: ${totalPrice}</Text>
          </VStack>
          <VStack align="start" mb={4} w="full">
            <Text fontWeight="bold">
              Comentario para la entrenadora (opcional)
            </Text>
            <Textarea
              placeholder="Contale a la entrenadora tus objetivos, lesiones o lo que quieras trabajar..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              resize="vertical"
              minH="100px"
            />
          </VStack>

          {/* Botón */}
          <Button bg="#fd6193"
            color={"white"}
            _hover={{ bg: "#fd99bf" }} w="full" onClick={handleBooking}>
            Reservar y Pagar
          </Button>
        </Box>

        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          color="#fd6193"
          fontWeight="bold"
          mb={2}
          fontFamily={"Inter"}
          mt={10}
        >
          Descripción del servicio
        </Heading>
        <Box h="2px" w="100%" bg="#fd6193" mb={6} />

        <Text>
          {serviceData?.description || "Cargando..."}
          <br />
          Categoría: {serviceData?.category || "Cargando..."}
        </Text>

        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          color="#fd6193"
          fontWeight="bold"
          mb={2}
          fontFamily={"Inter"}
          mt={10}
        >
          Disponibilidad horaria
        </Heading>
        <Box h="2px" w="100%" bg="#fd6193" mb={6} />
        {serviceData?.freeSlots ? (
          <VStack align="start" spacing={3}>
            {Object.entries(serviceData.freeSlots).map(([day, hours]) => (
              <Box key={day}>
                <Text fontWeight="bold" textTransform="capitalize">
                  {day}
                </Text>
                <Text>{hours.join(", ")}</Text>
              </Box>
            ))}
          </VStack>
        ) : (
          <Text color="gray.500">Cargando disponibilidad...</Text>
        )}

        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          color="#fd6193"
          fontWeight="bold"
          mb={2}
          mt={10}
          fontFamily={"Inter"}
        >
          Más sobre la entrenadora
        </Heading>
        <Box h="2px" w="100%" bg="#fd6193" mb={6} />

        <Flex
          direction={{ base: "column", md: "row" }}
          gap={6}
          align="start"
          mb={6}
          width="100%"
        >
          {/* Columna de estadísticas */}
          {trainerStats && (
            <Box
              bg="white"
              p={6}
              borderRadius="xl"
              boxShadow="md"
              border="1px solid #E2E8F0"
              width={{ base: "100%", md: "50%" }}
              flexShrink={0}
            >
              <Text fontSize="2xl" fontWeight="bold" mb={6}>
                {serviceData?.trainerName}
              </Text>

              <Flex align="center" gap={1} mb={2}>
                <Text fontWeight="bold">{trainerStats.ratingaverage}/5</Text>
                <Image src="/estrella.png" boxSize="1rem" />
              </Flex>
              <Text>
                {trainerStats.completedtrainings} entrenamientos dictados.
              </Text>
              <Text>{trainerStats.activetrainees} alumnas activas.</Text>
              {yearsUsingApp != null && (
                <Text>
                  {yearsUsingApp < 1
                    ? "Aún no cumplió un año utilizando FitAura"
                    : `${yearsUsingApp} año${yearsUsingApp === 1 ? "" : "s"} usando FitAura`}
                </Text>
              )}
            </Box>
          )}

          {/* Columna de reviews */}
          <Box flex="1" w="100%">
            {trainerReviews.length > 0 ? (
              <Stack spacing={6}>
                {trainerReviews.map((review, idx) => (
                  <ReviewCard
                    key={idx}
                    reviewId={review.reviewId}
                    user={{ name: review.name }}
                    date={review.createdAt}
                    training={review.description}
                    rating={review.rating}
                    comment={review.comment}
                    reply={review.reply}
                  />
                ))}
              </Stack>
            ) : (
              <Text>No hay reseñas disponibles.</Text>
            )}
          </Box>
        </Flex>
      </Box>
      <Footer />
    </Box>
  );
}

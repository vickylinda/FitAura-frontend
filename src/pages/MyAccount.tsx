import {
  Box,
  Button,
  Input,
  Stack,
  Heading,
  Flex,
  Field,
  Text,
  SimpleGrid,
  IconButton,
  Textarea,
  VStack,
  AvatarRoot,
  AvatarFallback,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import { MdEdit } from "react-icons/md";
import { Global } from "@emotion/react";

import { Link as RouterLink } from "react-router-dom";
import { toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import TrainerStats from "@/components/TrainerStats";
import ReviewCard from "@/components/ReviewCard";
import TrainingCard from "@/components/Card.entrenamiento";
import ServiceActions from "@/components/ServiceActions";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useFetchWithAuth } from '@/utils/fetchWithAuth';


export default function MyAccount() {
  const { user, setUser } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fontSizeCard = useBreakpointValue({ base: "sm", md: "md" }) || "md";
  const [errorServices, setErrorServices] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [errorReviews, setErrorReviews] = useState<string | null>(null);
  const [trainerStats, setTrainerStats] = useState<any>(null);
  const [trainerStatsError, setTrainerStatsError] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    birthDate: "",
    isTrainer: false,
    joiningDate: "",
    avatarUrl: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const fetchWithAuth = useFetchWithAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate("/home");
        return;
      }

      try {
        const res = await fetchWithAuth("http://localhost:4000/api/v1/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener perfil");
        const data = await res.json();
        const birthDateFormatted = data.birthDate
          ? new Date(data.birthDate * 1000).toLocaleDateString("es-AR")
          : "";
        const joiningDateFormatted = data.joiningDate
          ? new Date(data.joiningDate * 1000).toLocaleDateString("es-AR")
          : "";

        let profileData = {
          name: data.name,
          email: data.email,
          birthDate: birthDateFormatted,
          joiningDate: joiningDateFormatted,
          isTrainer: data.isTrainer,
          avatarUrl:  "", // estos dos últimos pertenecen solo al perfil de entrenadoras
          description:  "",
        };
        // Si es entrenadora, pedimos el perfil con foto y descripción
        if (data.isTrainer && data.id) {
          const trainerRes = await fetchWithAuth(`http://localhost:4000/api/v1/trainers/${data.id}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (trainerRes.ok) {
            const trainerData = await trainerRes.json();
            profileData.avatarUrl = trainerData.profilePic || "";
            profileData.description = trainerData.description || "";
          }
        }
        setProfile(profileData)

      } catch (err) {
        toaster.create({
          title: "Error",
          description: "No se pudo cargar el perfil.",
          type: "error",
          duration: 3000,
        });
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const [day, month, year] = profile.birthDate.split("/");
      const birthDateTimestamp = Math.floor(
        new Date(`${year}-${month}-${day}`).getTime() / 1000
      );

      const res = await fetchWithAuth("http://localhost:4000/api/v1/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          birthDate: birthDateTimestamp,
        }),
      });

      if (!res.ok) throw new Error("No se pudo actualizar");

      const updatedUser = {
        id: user?.id || 0,
        name: profile.name.split(" ")[0] || "Usuaria",
      };
      setUser(updatedUser);
      localStorage.setItem("fitauraUser", JSON.stringify(updatedUser));

      toaster.create({
        title: "Guardado",
        description: "Tus datos se actualizaron correctamente.",
        type: "success",
        duration: 3000,
      });
      setIsEditing(false);
    } catch (err) {
      toaster.create({
        title: "Error",
        description: "Ocurrió un error al guardar.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const fetchMyServices = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/v2/services?trainerId=${user?.id}`);
        const data = await res.json();
      if (!res.ok) {
        if (data.internalErrorCode === 1007) {
          // No hay servicios publicados
          setServices([]);
          setErrorServices(null); 
          return;


        }
        throw new Error("Error al obtener tus servicios.");

      }
      setServices(data.services); // ajustá si es data directamente
    } catch (err) {
      console.error(err);
      setErrorServices("No se pudieron cargar tus servicios.");
    }
  };
  const fetchMyReviews = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/reviews?trainerId=${user?.id}`);
      const data = await res.json();
      
      setReviews(data.reviews);
    } catch (err) {
      console.error(err);
      setErrorReviews("No se pudieron cargar tus reseñas.");
    }
  };

  const fetchTrainerStats = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/users/${user?.id}/trainer-statistics`);
      if (!res) return;
  
      const data = await res.json();
      if (!res.ok) {
        const code = data.internalErrorCode || 1000;
        if (code === 1007) {
          setTrainerStats(null); 
          return;
        }
        throw new Error(data.message || 'Error al obtener estadísticas');
      }

      setTrainerStats({
        ratingAverage: data.ratingaverage !== null ? parseFloat(data.ratingaverage) : null,
        ratingCount: data.ratingcount,
        views: data.visualizations,
        contracts: data.hiredservices,
        conversionRate: parseFloat(data.conversionrate),
        ratingsBreakdown: data.ratingsBreakdown,
      });
      
    } catch (err: any) {
      console.error("Error al obtener estadísticas:", err);
      setTrainerStatsError("No se pudieron obtener tus estadísticas como entrenadora.");
    }
  };
  

  useEffect(() => {
    if (profile.isTrainer && user?.id) {
      fetchMyServices();
      fetchMyReviews();
      fetchTrainerStats();
    }
  }, [profile.isTrainer, user?.id]);

  // MOCKS para la vista Trainer:
  const mockReviews = [
    {
      user: { name: "Hanna", avatarUrl: "" },
      date: "Febrero 2025",
      training: "Pilates Cardio con María Paula",
      rating: 5,
      comment: "Me encantó la clase! María Paula es excelente profesora.",
    },
  ];

  const mockServices = [
    {
      title: "Pilates Cardio",
      trainer: {
        name: "María Paula",
        rating: 4.7,
        avatarUrl: profile.avatarUrl,
      },
      price: "$15",
      duration: "45 mins",
      location: "Palermo, CABA",
      language: "Español",
    },
  ];

// Flecha izquierda
const PrevArrow = ({ onClick }) => (
  <Box
    as="button"
    onClick={onClick}
    position="absolute"
    left="-40px"      // Ajustá según tu diseño
    top="50%"
    transform="translateY(-50%)"
    zIndex="2"
    _hover={{ transform: "translateY(-50%) scale(1.2)" }}
    cursor={"pointer"}
  >
    <Image src="/left-arrow.png" alt="Back" boxSize="40px" />
  </Box>
);

// Flecha derecha
const NextArrow = ({ onClick }) => (
  <Box
    as="button"
    onClick={onClick}
    position="absolute"
    right="-40px"
    top="50%"
    transform="translateY(-50%)"
    zIndex="2"
    _hover={{ transform: "translateY(-50%) scale(1.2)" }}
    cursor={"pointer"}
  >
    <Image src="/right-arrow.png" alt="Next" boxSize="40px" />
  </Box>
);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
      prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,

    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      
    ],
  };

  const handleReplySubmit = async (reviewId: number, replyText: string) => {
    try {
      const res = await fetchWithAuth(`http://localhost:4000/api/v1/reviews/${reviewId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply: replyText }),
      });
  
      if (!res.ok) throw new Error("Error al responder la review");
      
      await fetchMyReviews(); // recargamos las reviews actualizadas
      toaster.create({
        title: "Respuesta publicada",
        description: "Tu respuesta fue enviada correctamente.",
        type: "success",
        duration: 3000,
      });
    } catch (err) {
      toaster.create({
        title: "Error",
        description: "No se pudo enviar la respuesta.",
        type: "error",
        duration: 3000,
      });
    }
  };
  

  // --- RETURN ---
  return (
    
    <Box minH="100vh" bg="pink.100">
<Global
  styles={`
    .slick-dots li button:before {
      color: #fd6193 !important;
      opacity: 0.5;
      bottom: -90px; /* más separación */
      font-size: 12px; /* 👈 Cambiá el tamaño a gusto */
    }
    .slick-dots li.slick-active button:before {
      color: #fd6193 !important;
      opacity: 1;
      font-size: 12px; /* 👈 Igual acá para el activo */
    }
  `}
/>


      <Header />

      {/* TITULO */}
      <Box px={{ base: 4, md: 12 }} py={6} maxW="100%" mx="auto">
        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          color="#fd6193"
          fontWeight="bold"
          mb={2}
          fontFamily={"Inter"}
        >
          Mi cuenta
        </Heading>
        <Box h="2px" w="100%" bg="#fd6193" mb={10} />
      </Box>

      {profile.isTrainer ? (
        // === VISTA TRAINER ===
        <Box px={{ base: 4, md: 10 }} pb={10}>
          <SimpleGrid columns={1} gap={8} mb={8} mt={{ base: -4, md: -12 }}>
            <VStack gap={4}>
              <Flex
                direction={{ base: "column", md: "row-reverse" }}
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="xl"
                maxW="1000px" // <- más ancho
                //w="full" // <- que use todo el ancho disponible dentro del contenedor
                mx="auto"
                align={{ base: "center", md: "flex-start" }}
                //justify="space-between"
                gap={{ base: 6, md: 10 }}
              >
                <Flex
                  h={{ base: "auto", md: "100%" }}
                  align={{ base: "center", md: "flex-start" }}
                >
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.name}
                      boxSize={{ base: "150px", md: "250px" }}
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

                <Box>
                  <SimpleGrid
                    columns={{ base: 1, md: 2 }}
                    gap={{ base: 4, md: 20 }}
                    w="full"
                  >
                    {/*columna 1 uwu*/}
                    <Stack gap={4}>
                      <Box>
                        {isEditing ? (
                          <Field.Root>
                            <Field.Label>Nombre</Field.Label>
                            <Input
                              name="name"
                              value={profile.name}
                              onChange={handleChange}
                            />
                          </Field.Root>
                        ) : (
                          <Box>
                            <Text fontWeight="semibold" mb={1}>
                              Nombre
                            </Text>
                            <Text>{profile.name}</Text>
                          </Box>
                        )}
                      </Box>

                      <Box>
                        {isEditing ? (
                          <Field.Root>
                            <Field.Label>Email</Field.Label>
                            <Input
                              name="email"
                              value={profile.email}
                              onChange={handleChange}
                            />
                          </Field.Root>
                        ) : (
                          <Box>
                            <Text fontWeight="semibold" mb={1}>
                              Email
                            </Text>
                            <Text>{profile.email}</Text>
                          </Box>
                        )}
                      </Box>

                      <Box>
                        {isEditing ? (
                          <Field.Root>
                            <Field.Label>Fecha de nacimiento</Field.Label>
                            <Input
                              name="birthDate"
                              value={profile.birthDate}
                              onChange={handleChange}
                            />
                          </Field.Root>
                        ) : (
                          <Box>
                            <Text fontWeight="semibold" mb={1}>
                              Fecha de nacimiento
                            </Text>
                            <Text>{profile.birthDate}</Text>
                          </Box>
                        )}
                      </Box>
                    </Stack>
                    {/*columna 2*/}
                    <Stack gap={4}>
                      <Box>
                        {isEditing ? (
                          <Field.Root disabled>
                            <Field.Label>Rol</Field.Label>
                            <Input
                              value={
                                profile.isTrainer ? "Entrenadora" : "Alumna"
                              }
                            />
                          </Field.Root>
                        ) : (
                          <Box>
                            <Text fontWeight="semibold" mb={1}>
                              Rol
                            </Text>
                            <Text>
                              {profile.isTrainer ? "Entrenadora" : "Alumna"}
                            </Text>
                          </Box>
                        )}
                      </Box>
                      <Box>
                        {isEditing ? (
                          <Field.Root>
                            <Field.Label>Descripción</Field.Label>
                            <Textarea
                              value={profile.description || ""}
                              onChange={(e) =>
                                setProfile((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              fontSize="md"
                              minH="100px"
                            />
                          </Field.Root>
                        ) : (
                          <Box>
                            <Text fontWeight="semibold" mb={1}>
                              Descripción
                            </Text>
                            <Text>{profile.description}</Text>
                          </Box>
                        )}
                      </Box>
                      <Box>
                        {isEditing ? (
                          <Field.Root disabled>
                            <Field.Label>Fecha de registro</Field.Label>
                            <Input value={profile.joiningDate} />
                          </Field.Root>
                        ) : (
                          <Box>
                            <Text fontWeight="semibold" mb={1}>
                              Fecha de registro
                            </Text>
                            <Text>{profile.joiningDate}</Text>
                          </Box>
                        )}
                      </Box>
                    </Stack>
                  </SimpleGrid>

                  {!isEditing ? (
                    <Stack
                      direction={{ base: "column", md: "row" }}
                      gap={4} // espacio entre botones
                      mt={6}
                      w="full"
                    >
                      <Button
                        bg="#fd6193"
                        _hover={{ bg: "#fc7faa" }}
                        color="white"
                        onClick={() => setIsEditing(true)}
                        w={{ base: "100%", md: "auto" }}
                      >
                        Editar mis datos
                      </Button>
                      <Button
                        variant="outline"
                        bg="#dcd3f0"
                        _hover={{ bg: "#d9c9fc", color: "#474bca" }}
                        color="#474bca"
                        onClick={() => navigate("/home")}
                        w={{ base: "100%", md: "auto" }}
                      >
                        Volver al Home
                      </Button>
                    </Stack>
                  ) : (
                    <Stack
                      direction={{ base: "column", md: "row" }}
                      gap={4} // espacio entre botones
                      mt={6}
                      w="full"
                    >
                      <Button
                        bg="#7ed957"
                        _hover={{ bg: "#9af574" }}
                        color="white"
                        onClick={handleSave}
                        w={{ base: "100%", md: "auto" }}
                      >
                        Guardar cambios
                      </Button>
                      <Button
                        variant="outline"
                        bg="#ff3131"
                        _hover={{ bg: "#f86767" }}
                        color="white"
                        onClick={() => setIsEditing(false)}
                        w={{ base: "100%", md: "auto" }}
                      >
                        Cancelar
                      </Button>
                    </Stack>
                  )}
                </Box>
              </Flex>
            </VStack>
          </SimpleGrid>

          <Heading
            as="h1"
            fontSize={{ base: "2xl", md: "3xl" }}
            color="#fd6193"
            fontWeight="bold"
            mb={2}
            fontFamily={"Inter"}
          >
            Mis servicios
          </Heading>
          <Box h="2px" w="100%" bg="#fd6193" mb={6} />

          <Box>
            {errorServices && <Text color="red">{errorServices}</Text>}
            {services.length === 0 ? (
              <Text>Por el momento, no dispone de servicios publicados.</Text>
            ) : (
              <Box px={{ base: 2, md: 6 }} >
 

                <Slider {...sliderSettings}>
                  {services.map((service, index) => (
                    <Box
                      key={index}
                      p={4}
                      bg="white"
                      borderRadius="xl"
                      boxShadow="md"
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      height="100%"
                      minHeight="450px"
                      mx={2}
                      w="100%"
                      maxW="400px"
                    >
                      <Flex
                        justify="space-between"
                        align="center"
                        mb={4}
                        wrap="wrap"
                        gap={2}
                      >
                        {/* Descripción del servicio */}
                        <Text
                          fontWeight="semibold"
                          fontSize={{ base: "md", md: "lg" }}
                          fontFamily="Poppins"
                          flex="1 1 100%"
                          wordBreak="break-word"
                        >
                          {service.description}
                        </Text>

                        {/* Información del entrenador */}
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
                              <Text
                                fontWeight="bold"
                                fontSize="sm"
                                color="black"
                              >
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

                      {/* Detalles del servicio: precio, duración, ubicación e idioma */}
                      
      {/* Detalles del servicio: precio, duración, ubicación e idioma */}
      <Box flexGrow={1} mb={4}>
        <Flex align="center" fontSize={fontSizeCard} mb={1}>
  <Image src="/dinero.webp" boxSize="1.5rem" mr={2} />
  ${Number(service.price).toFixed(2)}
</Flex>

<Flex align="center" fontSize={fontSizeCard} mb={1}>
  <Image src="/reloj.png" boxSize="1.5rem" mr={2} />
  {service.duration} mins
</Flex>

<Flex align="center" fontSize={fontSizeCard} mb={1}>
  <Image src="/locacion.png" boxSize="1.5rem" mr={2} />
  {service.location}
</Flex>

<Flex align="center" fontSize={fontSizeCard} mb={1}>
  <Image src="/idioma.png" boxSize="1.5rem" mr={2} />
  {service.language}
</Flex>

                        {/* Mostrar los horarios de `timeavailability` */}
                        {service.timeavailability ? (
                          <Box mt={2}>
                            {Object.entries(service.timeavailability).map(
                              ([day, times]) => (
                                <Text key={day} fontSize={fontSizeCard}>
                                  <strong>
                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                    :
                                  </strong>{" "}
                                  {times.join(", ")}
                                </Text>
                              )
                            )}
                          </Box>
                        ) : (
                          <Text fontSize={fontSizeCard} color="gray.500">
                            No hay horarios disponibles.
                          </Text>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Slider>
                
              </Box>
            )}
          </Box>

          <Heading
            as="h1"
            fontSize={{ base: "2xl", md: "3xl" }}
            color="#fd6193"
            fontWeight="bold"
            mt={4}
            mb={2}
            fontFamily={"Inter"}
          >
            Mis estadísticas
          </Heading>
          <Box h="2px" w="100%" bg="#fd6193" mb={6} />

          <Flex
            direction={{ base: "column", md: "row" }}
            gap={8}
            align="flex-start"
            justify="space-between"
            wrap="wrap"
          >
            <Box
              minW={{ base: "100%", md: "500px" }}
              flex="1"
              border="1px solid #EDF2F7"
              borderRadius="xl"
              p={4}
              bg="white"
            >
            <TrainerStats stats={trainerStats} />
            </Box>

            <Box flex="2" minW={{ base: "100%", md: "500px" }}>
            <Stack spacing={6} w="100%">
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <ReviewCard
                  key={idx}
                  reviewId={review.reviewId}
                  user={{ name: review.name }}  
                  date={review.createdAt}
                  training={review.description}
                  rating={review.rating}
                  comment={review.comment}
                  reply={review.reply}
                  isOwner={true}
                  onReplySubmit={handleReplySubmit}
                />
              ))
            ) : (
              <Text>No hay reseñas disponibles.</Text>
            )}
          </Stack>

              
            </Box>
          </Flex>

          <Heading fontSize="2xl" color="#fd6193" mb={4}>
            Gestionar servicios
          </Heading>
          <Box h="2px" w="100%" bg="#fd6193" mb={6} />
          <ServiceActions />
        </Box>
      ) : (
        // === VISTA ALUMNA ===
        <Flex
          maxW="500px"
          mx="auto"
          mt={{ base: -2, md: -14 }}
          borderRadius="lg"
        >
          <Box
            bg="white"
            p={{ base: 6, md: 8 }}
            borderRadius="lg"
            boxShadow="xl"
            w="full"
          >
            <Stack gap={4} w="full">
              {isEditing ? (
                <Field.Root>
                  <Field.Label>Nombre</Field.Label>
                  <Input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </Field.Root>
              ) : (
                <Box>
                  <Text fontWeight="semibold" mb={1}>
                    Nombre
                  </Text>
                  <Text>{profile.name}</Text>
                </Box>
              )}

              {isEditing ? (
                <Field.Root>
                  <Field.Label>Email</Field.Label>
                  <Input
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </Field.Root>
              ) : (
                <Box>
                  <Text fontWeight="semibold" mb={1}>
                    Email
                  </Text>
                  <Text>{profile.email}</Text>
                </Box>
              )}

              {isEditing ? (
                <Field.Root>
                  <Field.Label>Fecha de nacimiento</Field.Label>
                  <Input
                    name="birthDate"
                    value={profile.birthDate}
                    onChange={handleChange}
                  />
                </Field.Root>
              ) : (
                <Box>
                  <Text fontWeight="semibold" mb={1}>
                    Fecha de nacimiento
                  </Text>
                  <Text>{profile.birthDate}</Text>
                </Box>
              )}

              {isEditing ? (
                <Field.Root disabled>
                  <Field.Label>Rol</Field.Label>
                  <Input value={profile.isTrainer ? "Entrenadora" : "Alumna"} />
                </Field.Root>
              ) : (
                <Box>
                  <Text fontWeight="semibold" mb={1}>
                    Rol
                  </Text>
                  <Text>{profile.isTrainer ? "Entrenadora" : "Alumna"}</Text>
                </Box>
              )}

              {isEditing ? (
                <Field.Root disabled>
                  <Field.Label>Fecha de registro</Field.Label>
                  <Input value={profile.joiningDate} />
                </Field.Root>
              ) : (
                <Box>
                  <Text fontWeight="semibold" mb={1}>
                    Fecha de registro
                  </Text>
                  <Text>{profile.joiningDate}</Text>
                </Box>
              )}

              {!isEditing ? (
                <Stack
                  direction={{ base: "column", md: "row" }}
                  gap={4} // espacio entre botones
                  mt={6}
                  w="full"
                >
                  <Button
                    bg="#fd6193"
                    _hover={{ bg: "#fc7faa" }}
                    color="white"
                    onClick={() => setIsEditing(true)}
                    w={{ base: "100%", md: "auto" }}
                  >
                    Editar mis datos
                  </Button>
                  <Button
                    variant="outline"
                    bg="#dcd3f0"
                    _hover={{ bg: "#d9c9fc", color: "#474bca" }}
                    color="#474bca"
                    onClick={() => navigate("/home")}
                    w={{ base: "100%", md: "auto" }}
                  >
                    Volver al Home
                  </Button>
                </Stack>
              ) : (
                <Stack
                  direction={{ base: "column", md: "row" }}
                  gap={4} // espacio entre botones
                  mt={6}
                  w="full"
                >
                  <Button
                    bg="#7ed957"
                    _hover={{ bg: "#9af574" }}
                    color="white"
                    onClick={handleSave}
                    w={{ base: "100%", md: "auto" }}
                  >
                    Guardar cambios
                  </Button>
                  <Button
                    variant="outline"
                    bg="#ff3131"
                    _hover={{ bg: "#f86767" }}
                    color="white"
                    onClick={() => setIsEditing(false)}
                    w={{ base: "100%", md: "auto" }}
                  >
                    Cancelar
                  </Button>
                </Stack>
              )}
            </Stack>
          </Box>
        </Flex>
      )}
    </Box>
  );
}

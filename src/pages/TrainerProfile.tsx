import { Box, Text, Flex, SimpleGrid, Image, AvatarRoot, AvatarFallback,Button } from '@chakra-ui/react';
import { Card, CardBody } from '@chakra-ui/card';
import { FaStar } from 'react-icons/fa';
import TrainingCard from '@/components/Card.entrenamiento';
import Header from '@/components/Header';
import ReviewCard from '@/components/ReviewCard';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { useBreakpointValue } from '@chakra-ui/react';

const TrainerProfile = () => {
  const { trainerId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const fontSizeCard = useBreakpointValue({ base: "sm", md: "md" }) || "md";

  const [stats, setStats] = useState<any>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const incrementedRef = useRef(false);
  const [services, setServices] = useState<any[]>([]);
  const [errorServices, setErrorServices] = useState<string | null>(null);
  const [reviewsData, setReviewsData] = useState<any[]>([]);
  const [errorReviews, setErrorReviews] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const numericId = Number(trainerId);
      console.log("Trainer ID detectado:", numericId);
  
      if (isNaN(numericId) || numericId <= 0) {
        setProfileError("ID inválido");
        return;
      }
  
      try {
        const profileData = await fetchTrainerProfile(numericId);
        setProfile(profileData);
      } catch (err: any) {
        console.error("Error al cargar perfil:", err);
        setProfileError(err.message);
      }
  
      try {
        const statsData = await fetchTrainerStatistics(numericId);
        setStats(statsData);
      } catch (err: any) {
        console.error("Error al cargar stats:", err);
        setStatsError(err.message);
      }

      try {
        const servicesData = await fetchServices(numericId);
        setServices(servicesData);
      } catch (err) {
        console.error("Error al cargar servicios:", err);
        setErrorServices("No se pudieron cargar los servicios.");
      }
      
      try {
        const reviewsData = await fetchReviews(numericId); 
        setReviewsData(reviewsData);
      } catch (err) {
        console.error("Error al cargar reseñas:", err);
        setErrorReviews("No se pudieron cargar las reseñas.");
      }
  
  
  
      if (!incrementedRef.current) {
        incrementedRef.current = true;
        incrementTrainerViews(numericId);
      }
      
    };
  
    fetchData(); 
  }, [trainerId]);
  

  const fetchTrainerProfile = async (trainerId: number) => {
    const res = await fetch(`http://localhost:4000/api/v1/trainers/${trainerId}/profile`);
    const data = await res.json();

    if (!res.ok) {
      const { internalErrorCode } = data;
      switch (internalErrorCode) {
        case 1002:
          throw new Error('Petición incorrecta: ID inválido');
        case 1007:
          throw new Error('Entrenadora no encontrada');
        default:
          throw new Error('Error del servidor al obtener el perfil');
      }
    }

    return data;
  };

  const fetchTrainerStatistics = async (trainerId: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:4000/api/v1/users/${trainerId}/trainer-statistics`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();

    if (!res.ok) {
      const { internalErrorCode } = data;
      switch (internalErrorCode) {
        case 1002:
          throw new Error('Petición incorrecta: ID inválido');
        case 1007:
          throw new Error('Estadísticas no encontradas');
        case 1100:
        case 1101:
          throw new Error('Debes iniciar sesión para ver estadísticas');
        default:
          throw new Error('Error del servidor al obtener estadísticas');
      }
    }

    return data;
  };

  const incrementTrainerViews = async (trainerId: number) => {
    try {
      const token = localStorage.getItem("token");
      //nota: acá el backend se fija de si es la misma persona o no antes de incrementar
      const res = await fetch(`http://localhost:4000/api/v1/users/${trainerId}/trainer-statistics/visualizations`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const data = await res.json();
        const { internalErrorCode } = data;
        switch (internalErrorCode) {
          case 1002:
          case 1007:
            console.warn('No se pudo incrementar vistas');
            break;
          default:
            console.warn('Error interno al incrementar vistas');
            break;
        }
      }
    } catch (err) {
      console.error('Fallo la conexión al incrementar vistas:', err);
    }
  };
  const fetchServices = async (trainerId: number) => {
    const res = await fetch(`http://localhost:4000/api/v2/services?trainerId=${trainerId}`);
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error('Error al cargar los servicios');
    }
  
    return data.services;
  };

  const fetchReviews = async (trainerId: number) => {
    const res = await fetch(`http://localhost:4000/api/v1/reviews?trainerId=${trainerId}`);
    const data = await res.json();
    console.log("Reseñas recibidas:", data.reviews);
    if (!res.ok) {
      throw new Error('Error al cargar las reseñas');
    }
  
    return data.reviews;
  };
  
  

  const TrainerInfo = ({
    name,
    rating,
    trainingsCount,
    activeStudents,
    yearsUsingApp,
    bio,
    avatarUrl,
  }: {
    name: string;
    rating: number;
    trainingsCount: number;
    activeStudents: number;
    yearsUsingApp: number;
    bio: string;
    avatarUrl: string;
  }) => (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      gap={4}
      w="100%"
      mb={12}
      flexWrap="wrap"
      fontFamily="Poppins"
      color="gray.800"
    >
      <Card flex={1} minW="280px" border="1px solid #E2E8F0" borderRadius="lg" p={4} boxShadow="md">
        <CardBody>
          <Flex justify="space-between" align="center" gap={6} direction={{ base: 'column', md: 'row' }}>
            <Box>
            <Text fontSize="lg" fontWeight="bold" mb={2}>{name}</Text>
              <Text fontWeight="medium" mb={2} display="flex" alignItems="center">
                {rating === null ? (
                  <Text as="span" fontWeight="medium" color="gray.500">Sin reviews ⭐</Text>
                ) : (
                  <>
                    <Text as="span" fontWeight="bold">{rating}/5</Text>
                    <FaStar color="#ECC94B" style={{ marginLeft: 4 }} />
                  </>
                )}
              </Text> 
              <Text>{trainingsCount} entrenamientos dictados</Text>
              <Text>{activeStudents} alumnas activas</Text>
              <Text>{yearsUsingApp} años usando FitAura</Text>
            </Box>
            <Box minW="140px">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={`Foto de ${name}`}
                boxSize="140px"
                objectFit="cover"
                borderRadius="full"
                border="2px solid #fd6193"
              />
            ) : (
              <AvatarRoot colorPalette="pink" size="2xl">
                <AvatarFallback />
              </AvatarRoot>
            )}

            </Box>
          </Flex>
        </CardBody>
      </Card>

      <Card flex={1} minW="280px" border="1px solid #E2E8F0" borderRadius="lg" p={4} boxShadow="md">
        <CardBody>
          <Text fontSize="lg" fontWeight="bold" mb={2}>Sobre mí</Text>
          <Text fontWeight="medium" color="gray.700">
            {bio?.trim()
              ? bio
              : `${name} no añadió una descripción...`}
          </Text>

        </CardBody>
      </Card>
    </Flex>
  );

  const trainings = [
    {
      title: "Pilates Cardio",
      trainer: {
        name: "María Paula",
        rating: 4.7,
        avatarUrl: "https://c.superprof.com/i/a/25195381/11487093/600/20240701132042/entrenadora-personal-online-planificacion-rutina-entrenamiento-personalizada-posibilidad-entrenamientos-online-ponte.jpg",
      },
      price: "$15",
      duration: "45min",
      location: "Palermo, CABA",
      language: "Español",
    },
  ];

  
  return (
    <Box minH="100vh" w="100vw" bg="white" px={{ base: 4, md: 10 }} py={{ base: 4, md: 6 }}>
      <Header />

      {!profile && !profileError && (
        <Text fontSize="md" color="gray.600" mb={6}>Cargando perfil de entrenadora...</Text>
      )}

      {profileError ? (
        <Box my={4}>
          <Text color="red.500" fontWeight="bold" fontSize="lg">
            {profileError}
          </Text>
        </Box>
      ) : profile && (
        <TrainerInfo
          name={profile.name}
          rating={stats?.ratingaverage ?? null}
          trainingsCount={stats?.completedtrainings ?? 0}
          activeStudents={stats?.activetrainees ?? 0}
          yearsUsingApp={2}
          bio={profile.description}
          avatarUrl={profile.profilePic}
        />
      )}

      {!stats && !statsError && (
        <Text fontSize="sm" color="gray.500" mb={2}>Cargando estadísticas...</Text>
      )}

      {statsError && (
        <Box my={2}>
          <Text color="red.500" fontWeight="semibold" fontSize="md">
            {statsError}
          </Text>
        </Box>
      )}

      <Flex direction="column" mt={2} mb={2} gap={2}>
        <Text color="#fd6193" fontWeight="bold" fontSize="2xl">Servicios</Text>
        <Text color="gray.500" fontSize="sm" mb={2}>Servicios dictados por la entrenadora.</Text>
      </Flex>
      {/* Servicios de la Entrenadora */}
      <Box>
        {errorServices && <Text color="red">{errorServices}</Text>}
        {services.length === 0 ? (
          <Text>No hay servicios disponibles para esta entrenadora.</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={{ base: 6, md: 8 }} px={{ base: 4, md: 12 }} py={4}>
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
      <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
        {/* Descripción del servicio */}
        <Text fontWeight="semibold" fontSize={{ base: "md", md: "lg" }} fontFamily="Poppins" flex="1 1 100%" wordBreak="break-word">
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
            <Text fontWeight="extrabold" color="#fd6193" fontSize="md" fontFamily="Poppins" lineHeight="1">
              {service.trainer_name}
            </Text>
            <Flex align="center" gap={1}>
              <Text fontWeight="bold" fontSize="sm" color="black">
                {service.trainer_rating ? `${service.trainer_rating.toFixed(1)}/5` : "Sin reviews"}
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
      <Box flexGrow={1} mb={4}>
        <Text fontSize={fontSizeCard}>
          <Image src="/dinero.webp" display="inline" boxSize="1.5rem" verticalAlign="-0.30rem" />{" "}
          ${Number(service.price).toFixed(2)}
        </Text>
        <Text fontSize={fontSizeCard}>
          <Image src="/reloj.png" display="inline" boxSize="1.5rem" verticalAlign="-0.30rem" />{" "}
          {service.duration} mins
        </Text>
        <Text fontSize={fontSizeCard}>
          <Image src="/locacion.png" display="inline" boxSize="1.5rem" verticalAlign="-0.30rem" />{" "}
          {service.location}
        </Text>
        <Text fontSize={fontSizeCard}>
          <Image src="/idioma.png" display="inline" boxSize="1.5rem" verticalAlign="-0.30rem" />{" "}
          {service.language}
        </Text>
        {/* Horarios disponibles */}
        <Text fontSize={fontSizeCard} mt={2} fontWeight="bold">Horarios disponibles:</Text>
        
        {/* Mostrar los horarios de `timeavailability` */}
        {service.timeavailability ? (
          <Box mt={2}>
            {Object.entries(service.timeavailability).map(([day, times]) => (
              <Text key={day} fontSize={fontSizeCard}>
                <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> {times.join(", ")}
              </Text>
            ))}
          </Box>
        ) : (
          <Text fontSize={fontSizeCard} color="gray.500">No hay horarios disponibles.</Text>
        )}
      </Box>
    </Box>
  ))}
</SimpleGrid>


        )}
      </Box>

      
      <Flex direction="column" mt={2} mb={2} gap={2}>
  <Text color="#fd6193" fontWeight="bold" fontSize="2xl">Calificaciones</Text>
  <Text color="gray.500" fontSize="sm" mb={2}>Calificaciones de usuarias reales.</Text>
</Flex>
<Box height="2px" width="100%" bg="#fd6193" borderRadius="full" mb={12} />
<SimpleGrid columns={{ base: 1, md: 2 }} gap={10} mb={12} mt={8}>
  {reviewsData.length > 0 ? (
    reviewsData.map((review, idx) => (
      <ReviewCard
        key={idx}
        user={{ name: review.name }}  
        date={review.createdAt}
        training={review.description}
        rating={review.rating}
        comment={review.comment}
      />
    ))
  ) : (
    <Text>No hay reseñas disponibles.</Text>
  )}
</SimpleGrid>



    </Box>
  );
};

export default TrainerProfile;

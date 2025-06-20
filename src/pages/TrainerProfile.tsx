import { Box, Text, Flex, SimpleGrid, Image } from '@chakra-ui/react';
import { Card, CardBody } from '@chakra-ui/card';
import { FaStar } from 'react-icons/fa';
import TrainingCard from '@/components/Card.entrenamiento';
import Header from '@/components/Header';
import ReviewCard from '@/components/ReviewCard';

// 👇 Componente de Info de Entrenadora
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
    gap={6}
    w="100%"
    mb={12}
    flexWrap="wrap"
    fontFamily="Poppins"
    color="gray.800"
  >
    <Card
  flex={1}
  minW="280px"
  border="1px solid #E2E8F0"
  borderRadius="lg"
  p={4}
  boxShadow="md"
>
  <CardBody>
    <Flex justify="space-between" align="center" gap={6} direction={{ base: 'column', md: 'row' }}>
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={2} fontFamily="Poppins">
          {name}
        </Text>
        <Text fontWeight="medium" mb={2} display="flex" alignItems="center" fontFamily="Poppins">
          <Text as="span" fontWeight="bold">
            {rating}/5
          </Text>
          <FaStar color="#ECC94B" style={{ marginLeft: 4 }} />
        </Text>
        <Text fontFamily="Poppins" lineHeight="tall">
          {trainingsCount} entrenamientos dictados
        </Text>
        <Text fontFamily="Poppins" lineHeight="tall">
          {activeStudents} alumnas activas
        </Text>
        <Text fontFamily="Poppins" lineHeight="tall">
          {yearsUsingApp} años usando FitAura
        </Text>
      </Box>

      {/* Imagen redonda */}
      <Box minW="140px">
        <Image
          src={avatarUrl}
          alt={`Foto de ${name}`}
          boxSize="140px"
          objectFit="cover"
          borderRadius="full"
          border="2px solid #fd6193"
        />
      </Box>
    </Flex>
  </CardBody>
</Card>

    <Card
      flex={1}
      minW="280px"
      border="1px solid #E2E8F0"
      borderRadius="lg"
      p={4}
      boxShadow="md"
    >
      <CardBody>
        <Text fontSize="lg" fontWeight="bold" mb={2}>Sobre mí</Text>
        <Text fontWeight="medium" color="gray.700" lineHeight="tall">
          {bio}
        </Text>
      </CardBody>
    </Card>
  </Flex>
);


// 👇 Simulación de datos de servicios
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

// 👇 Simulación de datos de reviews
const reviews = [
  {
    user: {
      name: "Hanna",
      avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    date: "Febrero 2025",
    training: "Pilates Cardio con María Paula",
    rating: 5,
    comment:
      "Me encantó la clase! María Paula es una excelente profesora y atendió perfectamente mis problemas de columna durante la clase.",
  },
  {
    user: {
      name: "Ana",
      avatarUrl: "https://randomuser.me/api/portraits/women/66.jpg",
    },
    date: "Marzo 2025",
    training: "Pilates Cardio con María Paula",
    rating: 5,
    comment:
      "Muy buena experiencia, la entrenadora es muy atenta y profesional.",
  },
];

const TrainerProfile = () => {
  return (
    <Box
      minH="100vh"
      w="100vw"
      bg="white"
      m={0}
      px={{ base: 4, md: 10 }}
      py={{ base: 4, md: 6 }}
      border="none"
      boxSizing="border-box"
    >
      <Header/>
      {/* Card de entrenadora */}
      <TrainerInfo
        name="María Paula"
        rating={4.7}
        trainingsCount={35}
        activeStudents={120}
        yearsUsingApp={2}
        bio="Soy entrenadora certificada en pilates y fuerza. Ayudo a personas a alcanzar sus metas desde cualquier lugar con entrenamientos accesibles."
        avatarUrl="https://c.superprof.com/i/a/25195381/11487093/600/20240701132042/entrenadora-personal-online-planificacion-rutina-entrenamiento-personalizada-posibilidad-entrenamientos-online-ponte.jpg"
      />

      {/* Primer header */}
      <Flex direction="column" mt={2} mb={2} gap={6}>
        <Text color="#fd6193" fontWeight="bold" fontSize="2xl">
          Servicios
        </Text>
        <Text color="gray.500" fontSize="sm" mb={2}>
          Servicios dictados por la entrenadora.
        </Text>
      </Flex>
      <Box
        height="2px"
        width="100%"
        bg="#fd6193"
        borderRadius="full"
        mb={12}
        m={0}
        p={0}
      />

      {/* Contenedor responsivo para las cards */}
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3 }}
        gap={6}
        mb={12}
        justifyItems={{ base: 'center', md: 'start' }}
        justifyContent={{ base: 'center', md: 'start' }}
      >
        {trainings.map((training, idx) => (
          <Box key={idx} borderRadius="2xl" overflow="hidden">
            <TrainingCard
              title={training.title}
              trainer={training.trainer}
              price={training.price}
              duration={training.duration}
              location={training.location}
              language={training.language}
            />
          </Box>
        ))}
      </SimpleGrid>

      {/* Segundo header */}
      <Flex direction="column" mt={2} mb={2} gap={6}>
        <Text color="#fd6193" fontWeight="bold" fontSize="2xl">
          Calificaciones
        </Text>
        <Text color="gray.500" fontSize="sm" mb={2}>
          Calificaciones realizadas por usuarias de la app que tomaron al menos 1 clase con la entrenadora.
        </Text>
      </Flex>
      <Box
        height="2px"
        width="100%"
        bg="#fd6193"
        borderRadius="full"
        mb={12}
        m={0}
        p={0}
      />

      {/* Reviews */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={12} mt={8}>
  {reviews.map((review, idx) => (
    <ReviewCard
      key={idx}
      user={review.user}
      date={review.date}
      training={review.training}
      rating={review.rating}
      comment={review.comment}
    />
  ))}
</SimpleGrid>


    </Box>
  );
};

export default TrainerProfile;
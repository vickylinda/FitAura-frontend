import {
  Box,
  Text,
  Heading,
  SimpleGrid,
  Image,
  Stack,
  useBreakpointValue
} from '@chakra-ui/react';
import Booking from '@/components/Booking';
import ReviewCard from '@/components/ReviewCard';

const dummyImages = [
  '/placeholder1.png',
  '/placeholder2.png',
  '/placeholder3.png',
];

const dummyReviews = [
  {
    user: {
      name: 'Hanna',
      avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    date: 'Febrero 2025',
    training: 'Pilates Cardio con María Paula',
    rating: 5,
    comment:
      'Me encantó la clase! María Paula es una excelente profesora y atendió perfectamente mis problemas de columna durante la clase.',
  },
];

const TrainingBookingPage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box px={{ base: 4, md: 10 }} py={8} bg="white">
      {/* Header con imagen y formulario */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} mb={12}>
        <Stack gap={4}>
          <Image
            src={dummyImages[0]}
            alt="Foto del entrenamiento"
            borderRadius="xl"
            objectFit="cover"
          />
          <SimpleGrid columns={{ base: 2, md: 2 }} gap={4}>
            <Image src={dummyImages[1]} alt="extra" borderRadius="xl" />
            <Image src={dummyImages[2]} alt="extra" borderRadius="xl" />
          </SimpleGrid>
        </Stack>

        <Booking pricePerClass={15} trainerName="María Paula" trainerRating={4.7} trainerAvatar="https://randomuser.me/api/portraits/women/65.jpg" />
      </SimpleGrid>

      {/* Descripción del servicio */}
      <Heading fontSize="xl" color="#fd6193" mb={2} fontWeight="bold">
        Descripción del servicio
      </Heading>
      <Box height="2px" width="100%" bg="#fd6193" borderRadius="full" mb={6} />
      <Text mb={6}>
        Pilates Cardio es una clase que combina la precisión y control del método Pilates con ejercicios cardiovasculares de bajo o moderado impacto. Esta
        fusión busca mejorar la resistencia cardiovascular mientras se fortalece el core, se mejora la postura y se incrementa la flexibilidad.
      </Text>

      {/* Días y horarios */}
      <Heading fontSize="xl" color="#fd6193" mb={2} fontWeight="bold">
        Días y horarios
      </Heading>
      <Box height="2px" width="100%" bg="#fd6193" borderRadius="full" mb={6} />
      <Text mb={6}>
        Lunes, Martes, Miércoles, Jueves y Viernes 18hs.
        <br /> Martes y Jueves 19hs.
        <br /> Sábados 10hs.
      </Text>

      {/* Más sobre la entrenadora */}
      <Heading fontSize="xl" color="#fd6193" mb={2} fontWeight="bold">
        Más sobre la entrenadora
      </Heading>
      <Box height="2px" width="100%" bg="#fd6193" borderRadius="full" mb={6} />

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        <Stack gap={4}>
          {dummyReviews.map((review, idx) => (
            <ReviewCard key={idx} {...review} />
          ))}
        </Stack>
      </SimpleGrid>
    </Box>
  );
};

export default TrainingBookingPage;
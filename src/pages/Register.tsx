import {
  Box,
  Text,
  SimpleGrid,
  Button,
  VStack,
} from '@chakra-ui/react';
import TrainingCard from '@/components/Card.entrenamiento';

const mockTrainings = [
  {
    title: 'Pilates Cardio 30/05/25 - 15hs',
    trainer: {
      name: 'María Paula',
      rating: 4.7,
      avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    price: '$15',
    duration: '45 mins',
    location: 'Palermo, CABA',
    language: 'Español',
    status: 'Aceptado',
  },
  {
    title: 'Pilates en casa 30/05/25 - 18hs',
    trainer: {
      name: 'Martina',
      rating: 4.5,
      avatarUrl: 'https://randomuser.me/api/portraits/women/66.jpg',
    },
    price: '$20',
    duration: '45 mins',
    location: 'Virtual por Zoom',
    language: 'Español',
    status: 'Pendiente',
  },
];

const commentableTrainings = [mockTrainings[0]];

const MisEntrenamientos = () => {
  return (
    <Box
      px={{ base: 4, md: 10 }}
      py={6}
      minH="100vh"
      bg="white"
      boxSizing="border-box"
    >
      {/* Estado de mis entrenamientos */}
      <Text color="#fd6193" fontWeight="bold" fontSize="2xl" mb={2}>
        Estado de mis entrenamientos
      </Text>

      <Box
        bg="white"
        p={2}
        mb={8}
        borderRadius="lg"
        boxShadow="md"
      >
        <SimpleGrid minChildWidth="280px" spacing={4}>
          {mockTrainings.map((training, idx) => (
            <TrainingCard
              key={idx}
              title={training.title}
              trainer={training.trainer}
              price={training.price}
              duration={training.duration}
              location={training.location}
              language={training.language}
              status={training.status as 'Aceptado' | 'Pendiente' | 'Realizado'}
            />
          ))}
        </SimpleGrid>
      </Box>

      {/* Comentar y puntuar */}
      <Text color="#fd6193" fontWeight="bold" fontSize="2xl" mb={2}>
        Comentar y puntuar
      </Text>

      <Box
        bg="white"
        p={2}
        borderRadius="lg"
        boxShadow="md"
      >
        <SimpleGrid minChildWidth="280px" spacing={4}>
          {commentableTrainings.map((training, idx) => (
            <Box
              key={idx}
              borderRadius="xl"
              boxShadow="lg"
              p={4}
              bg="white"
            >
              <VStack spacing={4}>
                <TrainingCard
                  title={training.title}
                  trainer={training.trainer}
                  price={training.price}
                  duration={training.duration}
                  location={training.location}
                  language={training.language}
                />
                <Button
                  bg="#fd6193"
                  color="white"
                  w="full"
                  borderRadius="lg"
                  fontWeight="bold"
                  _hover={{ bg: '#e45784' }}
                >
                  Elegir
                </Button>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default MisEntrenamientos;

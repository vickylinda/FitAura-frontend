import {
  Box,
  Heading,
  SimpleGrid,
  Button,
  Input,
  Textarea,
  Flex,
  IconButton,
  useBreakpointValue,
  Center,
  VStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import TrainingCard from '@/components/Card.entrenamiento';
import { Avatar } from '@chakra-ui/avatar';
import { MdEdit } from 'react-icons/md';
import Header from '@/components/Header';
import ReviewCard from '@/components/ReviewCard';
import TrainerStats from '@/components/TrainerStats';

const mockTrainer = {
  name: 'María Paula Gómez',
  description:
    'Soy María Paula, instructora de Pilates hace 15 años. Disfruto de enseñar a mis alumnas mi método personal, y me especializo en necesidades especiales.',
  avatarUrl:
    'https://c.superprof.com/i/a/25195381/11487093/600/20240701132042/entrenadora-personal-online-planificacion-rutina-entrenamiento-personalizada-posibilidad-entrenamientos-online-ponte.jpg',
};

const mockServices = [
  {
    title: 'Pilates Cardio',
    trainer: {
      name: 'María Paula',
      rating: 4.7,
      avatarUrl: mockTrainer.avatarUrl,
    },
    price: '$15',
    duration: '45 mins',
    location: 'Palermo, CABA',
    language: 'Español',
  },
];

const mockReviews = [
  {
    user: {
      name: 'Hanna',
      avatarUrl: '',
    },
    date: 'Febrero 2025',
    training: 'Pilates Cardio con María Paula',
    rating: 5,
    comment:
      'Me encantó la clase! María Paula es una excelente profesora y atendió perfectamente mis problemas de columna durante la clase.',
  },
  {
    user: {
      name: 'Hanna',
      avatarUrl: '',
    },
    date: 'Febrero 2025',
    training: 'Pilates Cardio con María Paula',
    rating: 5,
    comment:
      'Me encantó la clase! María Paula es una excelente profesora y atendió perfectamente mis problemas de columna durante la clase.',
  },
];

const TrainerPortal = () => {
  const [name, setName] = useState(mockTrainer.name);
  const [description, setDescription] = useState(mockTrainer.description);

  return (
    <Box bg="white" px={{ base: 4, md: 10 }} py={8}>
      <Header />

      <Heading fontSize="2xl" color="#fd6193" mb={4}>
        Mi Perfil
      </Heading>
      <Box height="2px" width="100%" bg="#fd6193" borderRadius="full" mb={6} />

      <SimpleGrid columns={{ base: 1, md: 1 }} gap={8} mb={8}>
        <VStack gap={4}>
          <Avatar
            boxSize="120px"
            src={mockTrainer.avatarUrl}
            name={name}
            border="4px solid #fd6193"
          />
          <Button variant="outline" colorScheme="pink" size="xs">
            Cambiar imagen
          </Button>

          <Box p={5} bg="gray.50" borderRadius="lg" position="relative">
            <Input
              fontWeight="bold"
              fontSize="2xl"
              mb={6}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fontSize="md"
              mb={8}
              minH="100px"
            />
            <IconButton
              position="absolute"
              right={2}
              top={2}
              aria-label="Editar perfil"
              size="sm"
              colorScheme="pink"
            >
              <MdEdit />
            </IconButton>
          </Box>
        </VStack>
      </SimpleGrid>

      <Flex justify="space-between" align="center" mb={3}>
        <Heading fontSize="2xl" color="#fd6193">
          Mis servicios
        </Heading>
        <Button size="sm" variant="ghost" color="#fd6193">
          editar
        </Button>
      </Flex>
      <Box height="2px" width="100%" bg="#fd6193" borderRadius="full" mb={6} />

      <Flex wrap="wrap" gap={8} mb={8}>
        {mockServices.map((service, idx) => (
          <Box key={idx} borderRadius="2xl" overflow="hidden" flex="0 0 270px" m={0} p={0}>
            <TrainingCard
              title={service.title}
              trainer={service.trainer}
              price={service.price}
              duration={service.duration}
              location={service.location}
              language={service.language}
              ctaLabel="Administrar clase"
            />
          </Box>
        ))}
      </Flex>

<Heading fontSize="2xl" color="#fd6193" mb={4}>
  Mis estadísticas y calificaciones
</Heading>

<Box height="2px" width="100%" bg="#fd6193" borderRadius="full" mb={6} />

<Flex
  direction={{ base: 'column', md: 'row' }}
  gap={8}
  align="flex-start"
  justify="space-between"
  wrap="wrap"
>
  {/* Stats section */}
  <Box
    minW={{ base: '100%', md: '500px' }}
    maxW="100%"
    maxH="500px"
    flex="1"
    border="1px solid #EDF2F7"
    borderRadius="xl"
    p={4}
    bg="white"
  >
    <TrainerStats />
  </Box>

  {/* Reviews section */}
  <Box
    flex="2"
    minW={{ base: '100%', md: '500px' }}
    maxW="100%"
    maxH="500px"
    px={1}
  >
    <VStack align="stretch" gap={4}>
      {mockReviews.map((review, idx) => (
        <ReviewCard key={idx} {...review} />
      ))}
    </VStack>
  </Box>
</Flex>
    </Box>
  );
};

export default TrainerPortal;
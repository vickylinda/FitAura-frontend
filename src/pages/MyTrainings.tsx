import {
  Box,
  Text,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import TrainingCard from '@/components/Card.entrenamiento';
import Header from '@/components/Header';

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
  {
    title: 'Yoga Flow 01/06/25 - 10hs',
    trainer: {
      name: 'Lucía',
      rating: 4.9,
      avatarUrl: 'https://randomuser.me/api/portraits/women/67.jpg',
    },
    price: '$18',
    duration: '60 mins',
    location: 'Belgrano, CABA',
    language: 'Español',
    status: 'Calificar',
  },
  {
    title: 'Funcional 02/06/25 - 19hs',
    trainer: {
      name: 'Sofía',
      rating: 4.8,
      avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    price: '$22',
    duration: '50 mins',
    location: 'Virtual por Zoom',
    language: 'Español',
    status: 'Realizado',
  },
];

const MisEntrenamientos = () => {
  const realizados = [
    ...mockTrainings.filter(t => t.status === 'Calificar'),
    ...mockTrainings.filter(t => t.status === 'Realizado'),
  ];

  return (
    <Box >
      <Header/>
      {/* Próximos entrenamientos */}
      <Text color="#fd6193" fontWeight="bold" fontSize="2xl" mb={2}>
        Próximos entrenamientos
      </Text>
      <Text color="gray.500" fontSize="sm" mb={2}>
          Entrenamientos que has reservado y están próximos a realizarse. Puedes ver detalles y consultar su estado.
        </Text>
      <Box height="2px" width="100%" bg="#fd6193" borderRadius="full" mb={6} />

      <Flex wrap="wrap" gap={6}>
        {mockTrainings
          .filter(t => t.status === 'Aceptado' || t.status === 'Pendiente')
          .map((training, idx) => (
            <Box key={idx} flex="0 0 270px" m={0} p={0}>
              <TrainingCard
                title={training.title}
                trainer={training.trainer}
                price={training.price}
                duration={training.duration}
                location={training.location}
                language={training.language}
                status={training.status as 'Aceptado' | 'Pendiente'}
              />
            </Box>
          ))}
      </Flex>

      {/* Entrenamientos realizados */}
      <Text color="#fd6193" fontWeight="bold" fontSize="2xl" mt={10} mb={2}>
        Entrenamientos realizados
      </Text>
      <Text color="gray.500" fontSize="sm" mb={2}>
          Entrenamientos a los cuales ya has asistido. Si todavía no lo hiciste, podrás calificarlos.
        </Text>
      <Box height="2px" width="100%" bg="#fd6193" borderRadius="full" mb={6} />

      <Flex wrap="wrap" gap={6}>
        {realizados.map((training, idx) => (
          <Box key={idx} flex="0 0 270px" m={0} p={0}>
            <TrainingCard
              title={training.title}
              trainer={training.trainer}
              price={training.price}
              duration={training.duration}
              location={training.location}
              language={training.language}
              status={training.status as 'Calificar' | 'Realizado'}
            />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default MisEntrenamientos;
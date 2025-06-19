import {
  Box,
  Text,
  Flex,
  Button,
  Image,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

interface Trainer {
  name: string;
  rating: number;
  avatarUrl: string;
}

interface TrainingCardProps {
  title: string;
  price: string;
  duration: string;
  location: string;
  language: string;
  trainer: Trainer;
  onTrainerClick?: () => void;
  status?: 'Aceptado' | 'Pendiente' | 'Realizado' | 'Calificar';
  ctaLabel?: string; 
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  title,
  price,
  duration,
  location,
  language,
  trainer,
  onTrainerClick,
  status,
  ctaLabel,
}) => {
  // CTA info según el status
  const ctaInfo = {
    Aceptado: {
      label: 'Aceptado',
      bg: 'green.300',
      color: 'white',
      border: 'none',
    },
    Pendiente: {
      label: 'Pendiente',
      bg: 'yellow.200',
      color: 'black',
      border: 'none',
    },
    Realizado: {
      label: 'Completado',
      bg: 'white',
      color: '#fd6193',
      border: '2px solid #fd6193',
    },
    Calificar: {
      label: 'Puntuar',
      bg: '#fd6193',
      color: 'white',
      border: 'none',
    },
  };

const { label, bg, color, border } = ctaLabel
  ? {
      label: ctaLabel,
      bg: '#fd6193',
      color: 'white',
      border: 'none',
    }
  : status
  ? ctaInfo[status]
  : {
      label: 'Reservar clase',
      bg: '#fd6193',
      color: 'white',
      border: 'none',
    };

  return (
    <Box pt="40px">
      <Box
        borderRadius="2xl"
        border="1px solid #E2E8F0"
        bg="white"
        p={6}
        m={0}
        maxW="400px"
        w="270px"
        mx="auto"
        position="relative"
      >
        {/* Botón con datos de entrenadora */}
        <Button
          position="absolute"
          top="-24px"
          left="auto"
          right="-76px"
          transform="translateX(-50%)"
          border="2px solid #fd6193"
          borderRadius="md"
          px={4}
          py={2}
          boxShadow="md"
          bg="white"
          color="black"
          fontWeight="bold"
          fontSize="sm"
          onClick={onTrainerClick}
          _hover={{ bg: 'gray.50' }}
          display="flex"
          gap={3}
          alignItems="center"
        >
          <Box textAlign="left">
            <Text color="#fd6193" fontWeight="bold">{trainer.name}</Text>
            <Flex align="center" gap={1}>
              <Text fontWeight="bold">{trainer.rating}/5</Text>
              <FaStar color="#ECC94B" size="0.75rem" />
            </Flex>
          </Box>

          <Image
            src={trainer.avatarUrl}
            alt={trainer.name}
            boxSize="40px"
            borderRadius="full"
            objectFit="cover"
          />
        </Button>

        {/* Título del entrenamiento */}
        <Text fontWeight="bold" fontSize="lg" mb={4} mt={4}>
          {title}
        </Text>

        {/* Detalles */}
        <Box mb={6}>
          <Text mb={1}>💰 {price}</Text>
          <Text mb={1}>⏱ {duration}</Text>
          <Text mb={1}>📍 {location}</Text>
          <Text mb={1}>🌐 {language}</Text>
        </Box>

        {/* CTA dinámico */}
        <Button
          bg={bg}
          color={color}
          border={border || 'none'}
          width="100%"
          borderRadius="lg"
          fontWeight="bold"
          cursor={status === 'Realizado' ? 'default' : 'pointer'}
          _hover={status === 'Realizado' ? { bg: 'white' } : { opacity: 0.9 }}
          onClick={status === 'Realizado' ? undefined : () => {}}
        >
          {label}
        </Button>
      </Box>
    </Box>
  );
};

export default TrainingCard;

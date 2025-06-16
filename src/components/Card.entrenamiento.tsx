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
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  title,
  price,
  duration,
  location,
  language,
  trainer,
  onTrainerClick,
}) => {
  return (
    <Box pt="40px">
      <Box
        borderRadius="2xl"
        border="1px solid #E2E8F0"
        bg="white"
        p={6}
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

        <Button
          bg="#fd6193"
          color="white"
          width="100%"
          borderRadius="lg"
          fontWeight="bold"
          _hover={{ bg: '#e45784' }}
        >
          Reservar clase
        </Button>
      </Box>
    </Box>
  );
};

export default TrainingCard;

import { AvatarRoot, AvatarFallback } from '@chakra-ui/react';
import { Box, Text, Flex } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);  // Convierte el string a un objeto Date
  const monthYear = new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'long' }).format(date); // Formato de mes y año
  // Capitaliza la primera letra del mes
  return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
}; //para formatear el timestamp


interface ReviewCardProps {
  user: {
    name: string;
  };
  date: string;
  training: string;
  rating: number;
  comment: string;
}


const ReviewCard: React.FC<ReviewCardProps> = ({ user, date, training, rating, comment }) => {
  return (
    <Box
      border="1px solid #E2E8F0"
      borderRadius="xl"
      p={4}
      boxShadow="md"
      bg="white"
      maxW="100%"
    >
      
      
      <Flex align="center" mb={2} gap={3}>
        <AvatarRoot colorPalette="pink" size="sm">
          <AvatarFallback></AvatarFallback> 
        </AvatarRoot>
        <Box>
          <Text fontWeight="bold">{user.name}</Text>
          <Text fontSize="sm" color="gray.500">{formatDate(date)}</Text>
        </Box>
      </Flex>

      <Text fontSize="sm" mb={1}><strong>Entrenamiento:</strong> {training}</Text>
      <Text fontSize="sm" mb={1}>
        <strong>Calificación:</strong> {rating}/5 <FaStar color="#ECC94B" style={{ display: 'inline' }} />
      </Text>
      <Text fontSize="sm"><strong>Comentario:</strong> {comment}</Text>
    </Box>
  );
};

export default ReviewCard;

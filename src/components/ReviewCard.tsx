import { Avatar } from '@chakra-ui/avatar';
import { Box, Text, Flex } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

interface ReviewCardProps {
  user: {
    name: string;
    avatarUrl: string;
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
        <Avatar
          name={user.name}
          src={user.avatarUrl}
          boxSize="40px"
/>
        <Box>
          <Text fontWeight="bold">{user.name}</Text>
          <Text fontSize="sm" color="gray.500">{date}</Text>
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

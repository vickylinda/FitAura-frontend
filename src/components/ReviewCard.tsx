import { AvatarRoot, AvatarFallback } from '@chakra-ui/react';
import { Box, Text, Flex } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { FaReply } from 'react-icons/fa6'; 
import { useState } from 'react';
import { Textarea, Button } from '@chakra-ui/react';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);  // Convierte el string a un objeto Date
  const monthYear = new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'long' }).format(date); // Formato de mes y año
  // Capitaliza la primera letra del mes
  return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
}; //para formatear el timestamp


interface ReviewCardProps {
  reviewId: number;
  user: {
    name: string;
  };
  date: string;
  training: string;
  rating: number;
  comment: string;
  reply ?: string;
  isOwner?: boolean;
  onReplySubmit?: (reviewId: number, replyText: string) => void;
}


const ReviewCard: React.FC<ReviewCardProps> = ({ reviewId, user, date, training, rating, comment, reply, isOwner, onReplySubmit }) => {
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      {reply && (
        <Box
          bg="pink.50"
          borderLeft="4px solid #fd6193"
          px={4}
          py={3}
          mt={4}
          borderRadius="md"
        >
          <Flex align="center" mb={1} gap={2}>
            <FaReply color="#fd6193" />
            <Text fontWeight="semibold" color="pink.600">
              Respuesta de la entrenadora
            </Text>
          </Flex>
          <Text fontSize="sm" color="gray.700">
            {reply}
          </Text>
        </Box>
      )}

      {!reply && isOwner && (
  <Box mt={4}>
    <Textarea
      placeholder="Escribí tu respuesta..."
      value={replyText}
      onChange={(e) => setReplyText(e.target.value)}
      size="sm"
      mb={2}
      bg="gray.50"
      _placeholder={{ color: "gray.400" }}
    />
    <Button
      size="sm"
      bg="#fd6193"
      color="white"
      _hover={{ bg: "#fc7faa" }}
      loading={isSubmitting}
      onClick={() => {
        if (replyText.trim()) {
          setIsSubmitting(true); 
          onReplySubmit?.(reviewId, replyText.trim());
          setReplyText("");
        }
      }}
      
    >
      Enviar
    </Button>
  </Box>
)}

    </Box>
  );
};

export default ReviewCard;

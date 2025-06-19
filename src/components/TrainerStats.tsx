import {
  Box,
  Text,
  Stack,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

const TrainerStats = () => {
  return (
      <Stack gap={4}>
        <Box p={4} border="1px solid #E2E8F0" borderRadius="xl">
          <Text fontWeight="bold">⭐ Calificación general</Text>
          <Flex align="center" gap={2}>
            <Text fontSize="2xl">4,7</Text>
            <FaStar color="#ECC94B" />
          </Flex>
        </Box>
        <Box p={4} border="1px solid #E2E8F0" borderRadius="xl">
          <Text fontWeight="bold">👁 Visualizaciones</Text>
          <Text fontSize="2xl">850</Text>
        </Box>
        <Box p={4} border="1px solid #E2E8F0" borderRadius="xl">
          <Text fontWeight="bold">📄 Contrataciones</Text>
          <Text fontSize="2xl">120</Text>
        </Box>
        <Box p={4} border="1px solid #E2E8F0" borderRadius="xl">
          <Text fontWeight="bold">📈 Tasa de conversión</Text>
          <Text fontSize="2xl">14%</Text>
        </Box>
      </Stack>
  );
};

export default TrainerStats;

import {
  Box,
  Text,
  Stack,
  Flex,
  HStack,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

const TrainerStats = ({ stats }) => {
  if (!stats) return <Text>No hay estadísticas disponibles.</Text>;

  const breakdown = stats.ratingsBreakdown || {};
  const total = stats.ratingCount || 0;

  return (
    <Stack spacing={6} w="100%">
      {/* Métricas básicas */}
      <Stack spacing={3} w="100%">
        <StyledStatBox icon="👁" label="Visualizaciones" value={stats.views ?? 0} />
        <StyledStatBox icon="📄" label="Contrataciones" value={stats.contracts ?? 0} />
        <StyledStatBox
          icon="📈"
          label="Tasa de conversión"
          value={stats.conversionRate != null ? `${stats.conversionRate}%` : "0%"}
        />
      </Stack>

      {/* Calificación promedio + distribución */}
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={4}
        align="stretch"
        justify="space-between"
        w="100%"
      >
        {/* Calificación general: más ancho y menos alto */}
        <Box
          flex="1"
          border="1px solid #E2E8F0"
          borderRadius="xl"
          p={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minH="130px"
        >
          {stats.ratingAverage !== null ? (
            <>
              <Text fontSize="3xl" fontWeight="bold">
                {stats.ratingAverage.toFixed(1)}
              </Text>
              <HStack spacing={1} mt={1} mb={2}>
                {Array(5).fill(0).map((_, i) => (
                  <FaStar
                    key={i}
                    color={i < Math.round(stats.ratingAverage) ? '#ECC94B' : '#CBD5E0'}
                  />
                ))}
              </HStack>
              <Text fontSize="sm" color="gray.600">
                {total} calificación{total !== 1 && 'es'}
              </Text>
            </>
          ) : (
            <Text fontStyle="italic" color="gray.500">
              Aún sin calificaciones...
            </Text>
          )}
        </Box>

        {/* Distribución */}
        <Box flex="2" border="1px solid #E2E8F0" borderRadius="xl" p={4}>
          <Text fontWeight="bold" mb={2}>📊 Distribución de calificaciones</Text>
          <Stack spacing={2}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = breakdown?.[rating] || 0;
              const percentage = total > 0 ? (count / total) * 100 : 0;

              return (
                <Flex key={rating} align="center" gap={2}>
                  <Text w="20px" fontWeight="bold">{rating}</Text>
                  <Box bg="gray.200" w="100%" h="10px" borderRadius="full" overflow="hidden">
                    <Box
                      h="10px"
                      bg="#fd6193"
                      w={`${percentage}%`}
                      transition="width 0.3s"
                    />
                  </Box>
                  <Text w="30px" fontSize="sm" color="gray.600">{count}</Text>
                </Flex>
              );
            })}
          </Stack>
        </Box>
      </Flex>
    </Stack>
  );
};

// Tarjeta básica
const StyledStatBox = ({ icon, label, value }) => (
  <Flex
    align="center"
    justify="space-between"
    border="1px solid #E2E8F0"
    borderRadius="xl"
    p={3}
    bg="white"
    w="100%"
    h="60px"
  >
    <Flex align="center" gap={2}>
      <Box fontSize="xl">{icon}</Box>
      <Text fontWeight="bold" fontSize="md">{label}</Text>
    </Flex>
    <Text fontSize="lg" fontWeight="bold">{value}</Text>
  </Flex>
);

export default TrainerStats;

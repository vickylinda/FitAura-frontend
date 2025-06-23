import { Box, Text, Stack, Flex, Image, RatingGroup } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

interface TrainerStatsProps {
  stats: {
    views: number;
    contracts: number;
    conversionRate: number | null;
    ratingAverage: number | null;
    ratingCount: number | null;
    ratingsBreakdown: Record<number, number>;
  };
}

interface StyledStatBoxProps {
  label: React.ReactNode;
  value: string | number;
}

const StyledStatBox: React.FC<StyledStatBoxProps> = ({ label, value }) => (
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
    <Box>{label}</Box>
    <Text fontSize="lg" fontWeight="bold">
      {value}
    </Text>
  </Flex>
);

const TrainerStats: React.FC<TrainerStatsProps> = ({ stats }) => {
  if (!stats) return <Text>No hay estadísticas disponibles.</Text>;

  const breakdown = stats.ratingsBreakdown || {};
  const total = stats.ratingCount || 0;

  return (
    <Stack gap={6} w="100%">
      <Stack gap={3} w="100%">
        <StyledStatBox
          label={
            <Flex align="center" gap={2}>
              <Image src="/5.png" boxSize="24px" objectFit="contain" />
              <Text>Visualizaciones</Text>
            </Flex>
          }
          value={stats.views ?? 0}
        />

        <StyledStatBox
          label={
            <Flex align="center" gap={2}>
              <Image src="/6.png" boxSize="24px" objectFit="contain" />
              <Text>Contrataciones</Text>
            </Flex>
          }
          value={stats.contracts ?? 0}
        />

        <StyledStatBox
          label={
            <Flex align="center" gap={2}>
              <Image src="/7.png" boxSize="24px" objectFit="contain" />
              <Text>Tasa de conversión</Text>
            </Flex>
          }
          value={
            stats.conversionRate != null ? `${stats.conversionRate}%` : "0%"
          }
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
        {/* Calificación general */}
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
              <RatingGroup.Root
                value={stats.ratingAverage || 0}
                allowHalf
                readOnly
                colorPalette="yellow"
              >
                <RatingGroup.Control>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RatingGroup.Item key={index} index={index + 1}>
                      <RatingGroup.ItemIndicator>
                        <FaStar color="#ECC94B" size="20px" />
                      </RatingGroup.ItemIndicator>
                    </RatingGroup.Item>
                  ))}
                </RatingGroup.Control>
              </RatingGroup.Root>

              <Text fontSize="sm" color="gray.600">
                {total} calificación{total !== 1 && "es"}
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
          <Flex align="center" gap={2} mb={2}>
            <Image src="/distrib.png" boxSize="24px" objectFit="contain" />
            <Text fontWeight="bold">Distribución de calificaciones</Text>
          </Flex>

          <Stack gap={2}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = breakdown?.[rating] || 0;
              const percentage = total > 0 ? (count / total) * 100 : 0;

              return (
                <Flex key={rating} align="center" gap={2}>
                  <Text w="20px" fontWeight="bold">
                    {rating}
                  </Text>
                  <Box
                    bg="gray.200"
                    w="100%"
                    h="10px"
                    borderRadius="full"
                    overflow="hidden"
                  >
                    <Box
                      h="10px"
                      bg="#fd6193"
                      w={`${percentage}%`}
                      transition="width 0.3s"
                    />
                  </Box>
                  <Text w="30px" fontSize="sm" color="gray.600">
                    {count}
                  </Text>
                </Flex>
              );
            })}
          </Stack>
        </Box>
      </Flex>
    </Stack>
  );
};

export default TrainerStats;

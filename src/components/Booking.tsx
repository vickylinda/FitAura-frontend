import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { Textarea } from '@chakra-ui/react';
import { Text } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import { Select } from "@chakra-ui/select";
import { FormControl } from "@chakra-ui/form-control";
import { FormLabel } from "@chakra-ui/form-control";

interface BookingSectionProps {
  pricePerClass: number;
  trainerName: string;
  trainerRating: number;
  trainerAvatar: string;
}

const availableDays = ['30/04/2025', '02/05/2025'];
const availableHours = ['18:00', '19:00'];

const BookingSection: React.FC<BookingSectionProps> = ({
  pricePerClass,
  //trainerName,
  //trainerRating,
  //trainerAvatar,
}) => {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [notes, setNotes] = useState('');

  const isDisabled = !selectedDay || !selectedHour;

  return (
    <Box
      borderRadius="xl"
      border="1px solid #E2E8F0"
      p={6}
      w="100%"
      maxW="350px"
      bg="white"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Pilates Cardio
      </Text>

      <VStack gap={4} align="stretch">
        <FormControl>
          <FormLabel fontSize="sm">Día</FormLabel>
          <Select
            placeholder="Seleccioná un día"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {availableDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">Hora</FormLabel>
          <Select
            placeholder="Seleccioná un horario"
            value={selectedHour}
            onChange={(e) => setSelectedHour(e.target.value)}
          >
            {availableHours.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">Comentarios / necesidades especiales</FormLabel>
          <Textarea
            placeholder="Ej: Tengo una lesión en la espalda"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            borderRadius="md"
          />
        </FormControl>

        <Box>
          <Text color="gray.600" fontSize="sm" mb={1}>
            Precio por clase
          </Text>
          <Text fontWeight="bold" mb={2}>
            ${pricePerClass}
          </Text>
          <Text fontWeight="semibold" mb={1}>
            Total a pagar
          </Text>
          <Text fontWeight="bold" mb={4}>
            ${pricePerClass}
          </Text>
        </Box>

       <Button
        bg={isDisabled ? "gray.200" : "#fd6193"}
        color={isDisabled ? "gray.500" : "white"}
        _hover={isDisabled ? {} : { bg: "#e45784" }}
        disabled={isDisabled}
        borderRadius="md"
        fontWeight="bold"
      >
        Reservar y Pagar
</Button>
      </VStack>
    </Box>
  );
};

export default BookingSection;
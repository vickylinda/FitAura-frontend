import {
  Box,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  VStack,
  Stack,
  Icon,
} from '@chakra-ui/react';
import { Radio, RadioGroup } from '@chakra-ui/radio';
import { Checkbox, CheckboxGroup } from '@chakra-ui/checkbox';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Select } from '@chakra-ui/select';
import Header from '@/components/Header';
import React, { useState } from 'react';

const daysOfWeek = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
];

const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

const categories = ["Yoga", "Fuerza", "Pilates", "Cardio", "Otros"];

const CreateService = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <Box p={6} color="white" bg="white" py={0}>
      <Header />
      <Heading fontSize="2xl" color="#fd6193" mb={1}>
        Modificar servicio
      </Heading>
      <Box height="1px" width="100%" bg="#fdc8da" mb={4} />
      <Text mb={8} color="gray.600" fontSize="md">
        Editá los campos que quieras modificar del servicio seleccionado:
      </Text>

      <VStack gap={6} align="stretch">
        <FormControl>
        <FormLabel fontWeight="bold" color="#fd6193">
          Categoría
        </FormLabel>
        <Select
        bg="lightgray"
        size= "sm"
          variant="filled"
          placeholder="Seleccioná una opción"
          color= "gray"
          _hover={{ bg: 'gray.200' }}
          _focus={{ bg: 'gray.100', borderColor: '#fd6193'}}
        >
          <option value="Yoga">Yoga</option>
          <option value="Fuerza">Fuerza</option>
          <option value="Pilates">Pilates</option>
          <option value="Cardio">Cardio</option>
          <option value="Otros">Otros</option>
        </Select>
      </FormControl>
    <VStack></VStack>

        <FormControl>
          <FormLabel fontWeight="bold" color="#fd6193">Descripción del servicio</FormLabel>
          <Textarea placeholder="Escribe aquí..." bg="gray.100" minH="160px" color="gray.800" />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold" color="#fd6193">
            Duración{' '}
            <Text as="span" fontWeight="normal" fontSize="sm" color="gray.600">
              (en minutos)
            </Text>
          </FormLabel>
          <Input placeholder="Escribe aquí..." bg="gray.100" color="gray.800" />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold" color="#fd6193">Precio{' '}  
            <Text as="span" fontWeight="normal" fontSize="sm" color="gray.600">
               (en ARS)
            </Text>
          </FormLabel>
          <Input placeholder="Escribe aquí..." bg="gray.100" color="gray.800" />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold" color="#fd6193">Días</FormLabel>
          <CheckboxGroup colorScheme="pink">
            <Stack direction="row" flexWrap="wrap" color="black">
              {daysOfWeek.map((day) => (
                <Checkbox key={day} value={day} color="gray.800" bg="gray.600" borderColor="gray.300" mr={2} mb={2}>
                  {day}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold" color="#fd6193">Horarios</FormLabel>
          <CheckboxGroup colorScheme="pink">
            <Stack direction="row" flexWrap="wrap" maxH="100px" overflowY="auto" color="black">
              {hours.map((hour) => (
                <Checkbox key={hour} value={hour} color="gray.600" bg="gray.100" borderColor="gray.300" mr={2} mb={2}>
                  {hour}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </FormControl>

        <Box textAlign="center" pt={4}>
          <Button colorScheme="pink" size="lg" px={10} bg="#fd6193" color="white" _hover={{ bg: '#fdc8da' }}>
            Guardar
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default CreateService;
import {
  Box,
  Button,
  Heading,
  Flex,
  AvatarRoot,
  AvatarFallback,
  Image,
  Checkbox,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Header from "@/components/Header";
import { useState } from "react";
import dayjs from "dayjs";
import Footer from "@/components/Footer";

export default function MyAccount() {
  const [endDate, setEndDate] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedHours, setSelectedHours] = useState<{ [key: string]: string[] }>({});
  const pricePerClass = 15;

  const calculateClasses = () => {
     if (!endDate) return 0;
    const today = dayjs().startOf("day");
    const end = dayjs(endDate).endOf("day");
    let total = 0;
    let current = today;
     while (current.isBefore(end)) {
    const dayName = current.format("dddd");
    const numHours = selectedHours[dayName]?.length || 0;
    total += numHours; // suma solo si hay horas (numHours > 0)
    current = current.add(1, "day");
  }
    return total;
  };

  const totalClasses = calculateClasses();
  const totalPrice = totalClasses * pricePerClass;

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const availableHours = ["08:00", "09:00", "10:00", "18:00", "19:00", "20:00"];

  return (
    <Box minH="100vh" bg="white">
      <Header />

      <Box px={{ base: 4, md: 10 }} pb={10}>
        <Box
          p={4}
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          display="flex"
          flexDirection="column"
          height="100%"
          maxW="1000px"
          mx="auto"
        >
          <Flex
            justify="space-between"
            align="center"
            mb={4}
            wrap="wrap"
            gap={2}
          >
            <Text
              fontWeight="semibold"
              fontSize={{ base: "md", md: "lg" }}
              fontFamily="Poppins"
              flex="1 1 100%"
              wordBreak="break-word"
            >
              entrenamiento de lindas
            </Text>
            <Flex
              as={RouterLink}
              to={""}
              _hover={{ transform: "scale(1.05)", boxShadow: "md" }}
              transition="all 0.2s ease-in-out"
              align="center"
              border="1px solid #fd6193"
              borderRadius="lg"
              px={3}
              py={2}
              bg="white"
              boxShadow="sm"
            >
              <Box mr={2}>
                <Text
                  fontWeight="extrabold"
                  color="#fd6193"
                  fontSize="md"
                  fontFamily="Poppins"
                  lineHeight="1"
                >
                  {"vicky y pau"}
                </Text>
                <Flex align="center" gap={1}>
                  <Text fontWeight="bold" fontSize="sm" color="black" mt={1}>
                    {5}
                  </Text>
                  <Image src="/estrella.png" boxSize="1rem" />
                </Flex>
              </Box>

              <AvatarRoot colorPalette="pink">
                <AvatarFallback />
              </AvatarRoot>
            </Flex>
          </Flex>

          {/* Fecha de finalización */}
          <VStack align="start" mb={4}>
            <Text fontWeight="bold">Fecha de finalización</Text>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </VStack>

          {/* Selección de días y horas */}
          <VStack align="start" mb={4}>
            <Text fontWeight="bold">Selecciona días y horarios</Text>
            {daysOfWeek.map((day) => (
              <Box
                key={day}
                border="1px solid #ddd"
                borderRadius="md"
                p={2}
                w="100%"
              >
                <Checkbox.Root
                  checked={selectedDays.includes(day)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedDays((prev) => Array.from(new Set([...prev, day])));
                    } else {
                      setSelectedDays(selectedDays.filter((d) => d !== day));
                      const updatedHours = { ...selectedHours };
                      delete updatedHours[day];
                      setSelectedHours(updatedHours);
                    }
                  }}
                >
                  {" "}
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>{day}</Checkbox.Label>
                </Checkbox.Root>

                {selectedDays.includes(day) && (
                  <Flex mt={2} wrap="wrap" gap={2}>
                    {availableHours.map((hour) => {
                      const isSelected =
                        selectedHours[day]?.includes(hour) || false;

                      return (
                        <Button
                          key={hour}
                          size="sm"
                          variant={isSelected ? "solid" : "outline"}
                          colorScheme="pink"
                          onClick={() => {
                            const currentHours = selectedHours[day] ?? []; // asegura array

                            const newHours = isSelected
                              ? currentHours.filter((h) => h !== hour)
                              : [...currentHours, hour];
                            setSelectedHours({
                              ...selectedHours,
                              [day]: newHours,
                            });
                          }}
                        >
                          {hour}
                        </Button>
                      );
                    })}
                  </Flex>
                )}
              </Box>
            ))}
          </VStack>

          <VStack align="start" mb={4} w="full">
            <Text fontWeight="bold">Resumen:</Text>
            {selectedDays.length > 0 && (
              <Text>
                Reservaste {totalClasses} clases:{" "}

                {selectedDays
                 .filter((day) => (selectedHours[day] ?? []).length > 0)
                  .map((day) => {
                    const hours = selectedHours[day] || [];
                    return `${day} a las [${hours.join(", ")}]`;
                  })
                  .join("; ")}
              </Text>
            )}
            <Text>Precio por clase: ${pricePerClass}</Text>
            <Text fontWeight="bold">Total a pagar: ${totalPrice}</Text>
          </VStack>

          {/* Botón */}
          <Button colorScheme="pink" w="full">
            Reservar y Pagar
          </Button>
        </Box>

        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          color="#fd6193"
          fontWeight="bold"
          mb={2}
          fontFamily={"Inter"}
          mt={10}
        >
          Descripción del servicio
        </Heading>
        <Box h="2px" w="100%" bg="#fd6193" mb={6} />

<Text> holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text>

        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          color="#fd6193"
          fontWeight="bold"
          mb={2}
          fontFamily={"Inter"}
          mt={10}
        >
          Disponibilidad horaria
        </Heading>
        <Box h="2px" w="100%" bg="#fd6193" mb={6} />
        <Text> ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⠀⠀⠀⠀⠀⣠⣴⣶⣿⣷⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⡿⣿⢿⣶⣄⣴⣿⠟⠋⠁⠀⠈⢿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣠⣾⣿⢳⡽⣎⡟⣾⣻⣯⠀⠀⠀⠀⠀⠀⠈⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⣶⣿⡿⢿⣿⣶⣶⣦⣤⣠⣤⣶⣾⣿⠿⠿⠟⢻⡿⣧⢟⣳⣿⣾⣷⣿⣿⡿⣷⣶⣄⣤⣶⣿⢿⡿⣿⣦⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣾⡟⠀⠀⠀⠀⠀⠈⠉⠛⠛⠋⠁⠀⠀⠀⠀⠀⣿⡿⣵⣫⢿⣿⢧⣿⣟⡳⣟⣧⣛⣿⣿⣿⣼⢏⣾⢳⣿⡆⠀⠀⠀⠀⠀
⠀⠀⠀⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣟⣶⢫⣟⣻⣿⣿⣯⢳⣛⡶⣛⣾⣿⣟⣿⡿⣎⣯⣿⠇⠀⠀⠀⠀⠀
⠀⠀⠀⠘⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣼⡿⣼⣣⣿⣿⣿⣟⣿⣣⣿⣿⣿⣿⣿⢿⣸⣻⡿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢿⣧⣠⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠛⠋⠉⠀⠀⠙⠛⠛⠉⢿⣾⣳⢭⣯⣷⣿⣧⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠈⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠛⠛⠉⠀⢻⣧⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣼⣿⡷⠶⠿⠛⠓
⠀⠀⠀⠀⣼⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠙⠉⠉⣿⡇⠀⠀⠀⠀
⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢺⣿⣿⡆⠀⠀⠀⠀⢠⣤⣿⣷⣤⣦⣤⡄
⠀⠀⠀⠀⢿⣧⠀⢀⡀⠀⠀⠀⠀⢠⣴⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⡿⠁⠀⠀⠀⠀⠀⢁⣿⡇⠀⠀⠀⠀
⢠⣴⣶⡾⢿⣿⡟⠛⠛⠀⠀⠀⠀⣿⣿⣿⠆⠀⠀⠀⠀⠀⠀⢠⣴⣶⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣼⣿⣀⡀⠀⠀⠀
⠈⠁⠀⠀⠀⢻⣧⡀⢀⡀⠀⠀⠀⠈⠉⠉⠀⠀⠀⠀⠀⠀⠀⢻⣧⣮⣼⠿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⡿⠋⠙⠛⡿⠷⠀
⠀⠀⠀⢀⣤⣶⢿⣿⡋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⢿⣿⣤⣀⡀⠀⠀⠀⠀
⠀⠀⠀⠙⠋⠀⠀⠙⢿⣦⣴⡾⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣾⡿⠁⠀⠈⠉⠙⢿⣦⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣴⡿⠛⠿⣿⣶⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣤⣤⣴⣾⡿⠿⠛⠉⢿⣧⠀⠀⠀⠀⠀⠈⣿⡇⠀⠀
⠀⠀⠀⠀⠀⠰⠟⠋⠀⠀⠀⢀⣬⣽⣿⣿⣿⣿⣿⣿⣾⡾⢿⠿⠿⠿⠟⠛⠛⣿⡿⢯⢿⣿⣄⠀⠀⠈⢻⣷⡄⠀⠀⠀⣸⣿⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣀⣤⣤⣾⣟⠋⠁⣠⣿⣿⡹⡽⣿⣇⠀⠀⠀⠀⠀⠀⠀⣸⣿⣻⢽⡺⣟⣿⣆⠀⠀⠀⠻⣿⣄⣠⣾⠟⠁⠀⠀⠀
⠀⠀⠀⠀⠀⢠⣾⠟⠉⠉⠘⢿⣷⣰⣿⣿⣼⣷⣟⣾⣻⣷⣤⣤⣀⣤⣤⣾⣿⢏⣷⣯⣷⣭⣿⣿⣧⣠⣤⣶⡿⠟⠋⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢈⣿⠇⠀⠀⠀⣠⣿⠿⠛⠉⠉⠉⠛⢿⣷⡽⣏⣿⣛⣯⢿⣹⣺⣿⠿⠛⠉⠉⠉⠙⠻⣿⣏⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⣿⠀⠀⠀⣾⡟⠁⠀⠀⠀⠀⠀⠀⠀⠙⣿⣯⣶⢻⣼⢳⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠈⢻⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢻⣷⣄⣸⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣞⣳⡽⣺⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣧⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⠛⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣷⢻⣜⢿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⡄⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⢯⣻⢼⣻⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⠇⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⡿⣏⡾⣭⠷⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡿⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣧⡀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣷⣿⣿⣿⣿⣾⣿⣿⣄⡀⠀⠀⠀⠀⠀⣠⣾⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣶⣤⣤⣤⣶⡿⠟⠋⠉⠁⠀⠀⠀⠀⠉⠉⠙⠻⠿⣷⣶⣤⣶⡾⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀</Text>
      
      <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          color="#fd6193"
          fontWeight="bold"
          mb={2}
          fontFamily={"Inter"}
        >
          Más sobre la entrenadora
        </Heading>
        <Box h="2px" w="100%" bg="#fd6193" mb={6} />
        <Box>⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡤⠤⠤⠤⠴⠶⠶⠒⠚⠋⠉⠉⠉⠉⣷⢀⣀⡤⠤⠶⠶⠒⠛⢶⡄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡀⠀⣿⠉⠀⠀⠀⠀⠀⠀⠀⠀⢿⡀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⣇⣾⠀⠀⠀⠀⣴⡄⢠⣿⣄⡀⣰⠏⠙⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣧⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠤⠶⠚⠉⠉⠙⢦⣄⣀⣀⡟⠙⠋⠁⠈⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠇⠀⠀⠀⠀⠀⠀⠀⠈⠉⠁⠀⠀⠀⠀⠀⢀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣇⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⢰⠋⢈⡷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣇⠀⠀⠀⠀⠀⠀⠀⠀⠠⣆⠀⠀⢿⠀⢸⡶⢿⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣤⣀⡼⠀⠀⠻⠀⠀⠙⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡖⠀⠀⠀⠀⠀⠀⠀⠀⠸⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠳⣦⡀⣼⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⣧
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠇⣿⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⡟⢳⣄⠀⠀⠀⠀⠙⣇⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⡿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡿⠀⢿⡀⠀⠀⠀⢀⡞⠁⠉⠓⠀⠀⠀⠀⣯⠴⠻⣆⠀⠀⠀⠀⢻⡆⠀⠀⠀⠻⠃⠀⠀⠀⠀⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠇⠀⢸⡇⠀⠀⠀⠘⣧⠀⠖⠚⣷⠀⠀⠀⣧⠀⠀⠘⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⠀⠀⠘⡇⠀⠀⠀⠀⠘⠷⣤⣠⠟⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠇⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠯⠇⠀⠘⠛⠃⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡾⠀⠀⠀⠀⢸⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠱⢖⣦⣴⠿⠷⠶⠶⠛⠃⠀⠀⠀⠀⠀⠀⢀⡠⠞⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠾⣦⠀⢸⡇⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⡤⠔⠚⠉⠀⠀⠀⠀
⠀⠀⣴⢦⣄⠀⠀⢀⣰⠏⠀⠘⣧⣿⠀⠀⠀⠀⢠⢾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⡤⠴⠶⠒⠋⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⡏⠀⠈⠛⠋⠉⢀⣴⣿⣟⢿⡏⠀⠀⢀⡴⠋⠀⣧⠀⠀⢀⣀⣠⣤⣤⠤⠴⠒⠚⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣧⢀⣴⣶⣶⡄⢾⣿⣿⡿⣸⠃⠀⢠⠞⠁⠀⠀⠈⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢿⣿⣿⣿⣿⣿⠘⢿⣭⡵⠋⠀⣰⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠈⠳⣬⣿⣭⠯⠖⠚⠁⠀⢀⡞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⠇⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣰⠏⠀⣀⠀⠀⠀⠀⠀⢸⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⡼⢃⡴⠚⡿⠀⠀⠀⣤⠀⠈⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢀⣾⠗⠋⠀⢠⡏⠀⠀⣸⠋⢷⡀⢹⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠋⠁⣄⠀⢠⡿⡇⠀⢰⡏⠀⠀⠻⣮⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠙⠛⠋⠀⡇⢠⡟⠀⠀⠀⠀⠈⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣧⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀</Box>
        </Box>
        <Footer/>
        
    </Box>
  );
}

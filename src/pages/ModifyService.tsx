import {
    Box,
    Heading,
    Text,
    Flex,
    Input,
    Textarea,
    Button,
    VStack,
    Stack,
    Icon,
    Spinner
  } from '@chakra-ui/react';
  import { Checkbox, CheckboxGroup } from '@chakra-ui/checkbox';
  import { FormControl, FormLabel } from '@chakra-ui/form-control';
  import { Select } from '@chakra-ui/select';
  import Header from '@/components/Header';
  import { ChevronDownIcon } from 'lucide-react';
  import React, { useState } from 'react';
  import { useFetchWithAuth } from '@/utils/fetchWithAuth';
  import { toaster } from "@/components/ui/toaster";
  import Footer from "@/components/Footer";
  import { useParams } from "react-router-dom";
  import { useEffect } from 'react';
  import { useNavigate } from "react-router-dom";

  const daysOfWeek = [
    "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
  ];
  
 
  
  const EditService = () => {
    const navigate = useNavigate();

    const { serviceId } = useParams();
    const numericId = Number(serviceId);
    const [isLoading, setIsLoading] = useState(true); 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSchedule, setSelectedSchedule] = useState<{
      [day: string]: string[];
    }>({});
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [price, setPrice] = useState("");
    const [language, setLanguage] = useState("");
    const [location, setLocation] = useState("");
    const [title, setTitle] = useState("");
    const [capacity, setCapacity] = useState("");
  
    const fetchWithAuth = useFetchWithAuth();

    useEffect(() => {
        if (!serviceId) return;
      
        const fetchService = async () => {
          setIsLoading(true);
          try {
            const res = await fetchWithAuth(`http://localhost:4000/api/v2/services/${serviceId}`);
            const data = await res.json();
      
            setTitle(data.title || "");
            setDescription(data.description || "");
            setSelectedCategory(data.category || "");
            setDuration(data.duration?.toString() || "");
            setPrice(data.price?.toString() || "");
            setCapacity(data.capacity?.toString() || "");
            setLanguage(data.language || "");
            setLocation(data.location || "");
            const formattedSchedule: { [day: string]: string[] } = {};

            for (const day in data.timeAvailability) {
                const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
                formattedSchedule[capitalizedDay] = data.timeAvailability[day].map((time: string) => time.slice(0, 5));
              }
              
            setSelectedSchedule(formattedSchedule);

          } catch (err) {
            console.error("Error al cargar el servicio", err);
            toaster.create({
              title: "Error al cargar",
              description: "No se pudo obtener la información del servicio.",
              type: "error",
              duration: 3000,
            });
          }
          finally {
            setIsLoading(false);
          }
        };
      
        fetchService();
      }, [serviceId]);
      
  
      const handleSubmit = async () => {
        // Normalizamos timeAvailability a lowercase para armar el payload
        setIsSubmitting(true);
        const normalizedSchedule: { [day: string]: string[] } = {};
        for (const day in selectedSchedule) {
          const lowerDay = day.charAt(0).toLowerCase() + day.slice(1);
          normalizedSchedule[lowerDay] = selectedSchedule[day];
        }
      
        const payload = {
          title,
          description,
          category: selectedCategory,
          duration: Number(duration),
          price: Number(price),
          capacity: Number(capacity),
          language,
          location,
          published: true,
          timeAvailability: normalizedSchedule,
        };
      
        try {
          const response = await fetchWithAuth(`http://localhost:4000/api/v2/services/${serviceId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
      
            switch (errorData?.internalErrorCode) {
              case 1001:
                toaster.create({
                  title: "Campos faltantes",
                  description: "Completá todos los campos requeridos.",
                  type: "error",
                  duration: 3000,
                });
                break;
      
              case 1002:
                toaster.create({
                  title: "Formato inválido",
                  description: errorData.message || "Revisá que el ID, duración, precio, capacidad y horarios sean correctos.",
                  type: "error",
                  duration: 3000,
                });
                break;
      
              case 1003:
                toaster.create({
                  title: "Acceso denegado o datos inválidos",
                  description: errorData.message || "No tenés permisos para editar este servicio o hay un problema con los horarios.",
                  type: "error",
                  duration: 3000,
                });
                break;
      
              case 1007:
                toaster.create({
                  title: "Servicio no encontrado",
                  description: "Este servicio no existe o fue eliminado.",
                  type: "error",
                  duration: 3000,
                });
                break;
      
              default:
                toaster.create({
                  title: "Error inesperado",
                  description: "Ocurrió un problema inesperado. Intentalo más tarde.",
                  type: "error",
                  duration: 3000,
                });
                break;
            }
      
            return;
          }
      
          toaster.create({
            title: "Servicio actualizado",
            description: "Los cambios fueron guardados correctamente.",
            type: "success",
            duration: 3000,
          });
        } catch (error) {
          console.error('Error al editar el servicio:', error);
          toaster.create({
            title: "Error de red",
            description: "No se pudo conectar al servidor. Verificá tu conexión.",
            type: "error",
            duration: 3000,
          });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                navigate("/my-account");
              }, 1000); 
        }
      };
      
    
  
  
      if (isLoading || isSubmitting) {
        return (
          <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="white">
            <Spinner size="xl" color="#fd6193" />
          </Box>
        );
      }
      
    return (
      <Box p={6} color="white" bg="white" py={0}>
        <Header />
        <Heading fontSize="2xl" color="#fd6193" mb={1}>
          Modificar servicio
        </Heading>
        <Box height="1px" width="100%" bg="#fdc8da" mb={4} />
        <Text mb={8} color="gray.600" fontSize="md">
          Para modificar este servicio, se requiere completar los siguientes campos:
        </Text>
  
        <VStack gap={6} align="stretch">
          
        <FormControl>
          <FormLabel fontWeight="bold" color="#fd6193">
            Categoría
          </FormLabel>
          <Box
            position="relative"
            width="100%"
            bg="gray.100"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            _focusWithin={{ borderColor: "#fd6193", boxShadow: "0 0 0 1px #fd6193" }}
            _hover={{ borderColor: "#fd6193" }}
          >
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                paddingRight: "40px",
                appearance: "none",
                backgroundColor: "transparent",
                border: "none",
                fontSize: "16px",
                color: "#1a202c",
                outline: "none",
                borderRadius: "md",
              }}
            >
              <option value="">Seleccioná una opción</option>
              <option value="Yoga">Yoga</option>
              <option value="Fuerza">Fuerza</option>
              <option value="Pilates">Pilates</option>
              <option value="Cardio">Cardio</option>
              <option value="Stretching">Stretching</option>
              <option value="Postura y Movilidad">Postura y Movilidad</option>
              <option value="Funcional">Funcional</option>
              <option value="GAP">GAP (Glúteos, Abdominales, Piernas)</option>
              <option value="Meditación">Meditación</option>
              <option value="Mindfulness">Mindfulness</option>
              <option value="Ritmos">Ritmos</option>
  
            </select>
            <Box position="absolute" right="12px" top="50%" transform="translateY(-50%)" pointerEvents="none">
              <ChevronDownIcon size={18} />
            </Box>
          </Box>
        </FormControl>
  
        <FormControl>
        <FormLabel fontWeight="bold" color="#fd6193">
          Título del servicio
        </FormLabel>
        <Input
          value={title} //primero rellenamos con los datos previos...
          placeholder="Ej. Clases de Yoga al atardecer"
          bg="gray.100"
          color="gray.800"
          onChange={(e) => setTitle(e.target.value)} //y despues la entrenadora los puede cambiar para el PUT...
        />
      </FormControl>
  
  
          <FormControl>
            <FormLabel fontWeight="bold" color="#fd6193">Descripción del servicio</FormLabel>
            <Textarea  value={description}  placeholder="Escribe aquí..." bg="gray.100" minH="160px" color="gray.800" onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
  
          <FormControl>
            <FormLabel fontWeight="bold" color="#fd6193">
              Duración{' '}
              <Text as="span" fontWeight="normal" fontSize="sm" color="gray.600">
                (en minutos)
              </Text>
            </FormLabel>
            <Input
              value={duration}
              type="number"
              min={0}
              placeholder="Duración en minutos"
              bg="gray.100"
              color="gray.800"
              onChange={(e) => setDuration(e.target.value)}
            />
  
          </FormControl>
  
          <FormControl>
            <FormLabel fontWeight="bold" color="#fd6193">Precio{' '}  
              <Text as="span" fontWeight="normal" fontSize="sm" color="gray.600" >
                 (en ARS)
              </Text>
            </FormLabel>
            <Input
              value={price}
              type="number"
              min={0}
              step="any"
              placeholder="Precio en ARS"
              bg="gray.100"
              color="gray.800"
              onChange={(e) => setPrice(e.target.value)}
            />
  
          </FormControl>
  
          <FormControl>
          <FormLabel fontWeight="bold" color="#fd6193">
            Capacidad{' '}
            <Text as="span" fontWeight="normal" fontSize="sm" color="gray.600">
              (cantidad máxima de alumnas en cada turno.)
            </Text>
          </FormLabel>
          <Input
            value={capacity}
            type="number"
            min={1}
            placeholder="Capacidad del servicio"
            bg="gray.100"
            color="gray.800"
            onChange={(e) => setCapacity(e.target.value)}
          />
        </FormControl>
  
  
          <FormControl>
          <FormLabel fontWeight="bold" color="#fd6193">Idioma</FormLabel>
          <Box
            position="relative"
            width="100%"
            bg="gray.100"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            _focusWithin={{ borderColor: "#fd6193", boxShadow: "0 0 0 1px #fd6193" }}
            _hover={{ borderColor: "#fd6193" }}
          >
            <select
             value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                paddingRight: "40px",
                appearance: "none",
                backgroundColor: "transparent",
                border: "none",
                fontSize: "16px",
                color: "#1a202c",
                outline: "none",
                borderRadius: "md",
              }}
            >
              <option value="">Seleccioná un idioma</option>
              <option value="Español">Español</option>
              <option value="English">English</option>
            </select>
            <Box position="absolute" right="12px" top="50%" transform="translateY(-50%)" pointerEvents="none">
              <ChevronDownIcon size={18} />
            </Box>
          </Box>
        </FormControl>
        
  
        <FormControl>
        <FormLabel fontWeight="bold" color="#fd6193">Ubicación</FormLabel>
        <Box
          position="relative"
          width="100%"
          bg="gray.100"
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          _focusWithin={{ borderColor: "#fd6193", boxShadow: "0 0 0 1px #fd6193" }}
          _hover={{ borderColor: "#fd6193" }}
        >
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              paddingRight: "40px",
              appearance: "none",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "16px",
              color: "#1a202c",
              outline: "none",
              borderRadius: "md",
            }}
          >
            <option value="">Seleccioná una ubicación</option>
            <option value="CABA">CABA</option>
            <option value="PBA">PBA</option>
            <option value="Catamarca">Catamarca</option>
            <option value="Chaco">Chaco</option>
            <option value="Chubut">Chubut</option>
            <option value="Córdoba">Córdoba</option>
            <option value="Corrientes">Corrientes</option>
            <option value="Entre Ríos">Entre Ríos</option>
            <option value="Formosa">Formosa</option>
            <option value="Jujuy">Jujuy</option>
            <option value="La Pampa">La Pampa</option>
            <option value="La Rioja">La Rioja</option>
            <option value="Mendoza">Mendoza</option>
            <option value="Misiones">Misiones</option>
            <option value="Neuquén">Neuquén</option>
            <option value="Río Negro">Río Negro</option>
            <option value="Salta">Salta</option>
            <option value="San Juan">San Juan</option>
            <option value="San Luis">San Luis</option>
            <option value="Santa Cruz">Santa Cruz</option>
            <option value="Santa Fe">Santa Fe</option>
            <option value="Santiago del Estero">Santiago del Estero</option>
            <option value="Tierra del Fuego">Tierra del Fuego</option>
            <option value="Tucumán">Tucumán</option>
          </select>
          <Box position="absolute" right="12px" top="50%" transform="translateY(-50%)" pointerEvents="none">
            <ChevronDownIcon size={18} />
          </Box>
        </Box>
      </FormControl>
  
        
  
  
  
    <FormControl>
    <FormLabel fontWeight="bold" color="#fd6193">
      Disponibilidad horaria
    </FormLabel>
    <Text color="gray.600" mb={2}>
      Agregá horarios para cada día que desees.
    </Text>
  
    <Flex wrap="wrap" gap={6}>
      {daysOfWeek.map((day) => (
        <Box key={day} minW="200px">
          <FormLabel color="#fd6193" fontWeight="semibold">{day}</FormLabel>
          <VStack align="start">
            {(selectedSchedule[day] || []).map((time, index) => (
              <Stack direction="row" key={index}>
                <Input
                  size="sm"
                  type="time"
                  value={time}
                  color="gray.800"
                  bg="gray.100"
                  borderColor="gray.300"
                  _hover={{
                    borderColor: "#fd6193",
                    bg: "#fff0f5"
                  }}
                  onChange={(e) => {
                    const updated = [...(selectedSchedule[day] || [])];
                    updated[index] = e.target.value;
                    setSelectedSchedule(prev => ({ ...prev, [day]: updated }));
                  }}
                />
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => {
                    const updated = [...(selectedSchedule[day] || [])];
                    updated.splice(index, 1);
                    setSelectedSchedule(prev => ({ ...prev, [day]: updated }));
                  }}
                >
                  Eliminar
                </Button>
              </Stack>
            ))}
  
            <Button
              size="sm"
              color="gray.800"
              bg="white"
              borderColor="gray.300"
              variant="outline"
              _hover={{
                bg: "#fff0f5",
                borderColor: "#fd6193",
                color: "#fd6193",
              }}
              onClick={() => {
                const updated = [...(selectedSchedule[day] || []), ""];
                setSelectedSchedule(prev => ({ ...prev, [day]: updated }));
              }}
            >
              + Agregar horario
            </Button>
          </VStack>
        </Box>
      ))}
    </Flex>
  </FormControl>
  
  
  
  
  
  
  
  
  
          
          <Box textAlign="center" pt={4}>
            <Button colorScheme="pink" size="lg" px={10} bg="#fd6193" color="white" _hover={{ bg: '#fdc8da' }}   onClick={handleSubmit}>
              Guardar
            </Button>
          </Box>
        </VStack>
  
        <br></br>
        <Footer />
  
      </Box>
  
    );
  };
  
  export default EditService;
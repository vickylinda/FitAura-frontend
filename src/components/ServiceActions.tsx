import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react';

const ServiceActions = () => {
  const actions = [
    { label: 'Crear', bg: '#fd6193' },
    { label: 'Modificar', bg: '#f87ca1' },
    { label: 'Publicar', bg: '#fca4bf' },
    { label: 'Despublicar', bg: '#fdd4e2' },
    { label: 'Eliminar', bg: '#ffeef4' },
  ];

  return (
    <Box mt={10}>
      <HStack gap={10} justify="center" wrap="wrap">
        {actions.map((action, idx) => (
          <Button
            key={idx}
            w="100px"
            h="100px"
            borderRadius="full"
            bg={action.bg}
            _hover={{ opacity: 0.8 }}
            fontWeight="bold"
            fontSize="md"
            color="black"
            boxShadow="sm"
          >
            {action.label}
          </Button>
        ))}
      </HStack>
    </Box>
  );
};

export default ServiceActions;
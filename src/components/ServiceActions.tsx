import {
  Box,
  HStack,
  Link
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const ServiceActions = () => {
  // Ahora cada acción tiene una ruta asociada 👇
  const actions = [
    { label: 'Crear', bg: '#fd6193', to: '/create-service' },
    { label: 'Modificar', bg: '#f87ca1', to: '/edit-service' },
    { label: 'Publicar', bg: '#fca4bf', to: '/publish-service' },
    { label: 'Despublicar', bg: '#fdd4e2', to: '/unpublish-service' },
    { label: 'Eliminar', bg: '#ffeef4', to: '/delete-service' },
  ];

return (
    <Box mt={10}>
      <HStack gap={10} justify="center" wrap="wrap">
        {actions.map((action, idx) => (
          <Link
            key={idx}
            as={RouterLink}
            to={action.to}
            _hover={{ textDecoration: "none", transform: "scale(1.05)" }}
            transition="all 0.2s ease-in-out"
          >
            <Box
              w="130px" // Agrandé un poco
              h="130px"
              borderRadius="full"
              bg={action.bg}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
              fontSize="md"
              color="black"
              boxShadow="lg"
            >
              {action.label}
            </Box>
          </Link>
        ))}
      </HStack>
    </Box>
  );
};

export default ServiceActions;
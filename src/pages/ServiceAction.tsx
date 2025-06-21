import React, { useState } from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
import { toaster } from '../components/successToaster';
import TrainingCard from '../components/Card.entrenamiento';
import Header from '@/components/Header';
import ConfirmDelete from '../components/ConfirmDelete';

// Tipos
interface Trainer {
  name: string;
  rating: number;
  avatarUrl: string;
}

interface Servicio {
  id: string;
  title: string;
  price: string;
  duration: string;
  location: string;
  language: string;
  trainer: Trainer;
}

export type Accion = 'modificar' | 'eliminar' | 'publicar' | 'despublicar';

interface ServiceActionProps {
  accion: Accion;
}

const servicios: Servicio[] = [
  {
    id: '1',
    title: 'Pilates Cardio',
    price: '$15',
    duration: '45 mins',
    location: 'Palermo, CABA',
    language: 'Español',
    trainer: {
      name: 'María Paula',
      rating: 4.7,
      avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
  },
];

const ServiceAction: React.FC<ServiceActionProps> = ({ accion }) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getLabel = (accion: Accion): string => {
    switch (accion) {
      case 'modificar':
        return 'Modificar';
      case 'eliminar':
        return 'Eliminar';
      case 'publicar':
        return 'Publicar';
      case 'despublicar':
        return 'Despublicar';
      default:
        return '';
    }
  };

  const getHeading = (accion: Accion): string => {
    switch (accion) {
      case 'modificar':
        return 'Seleccione un servicio para modificar';
      case 'eliminar':
        return 'Seleccione un servicio para eliminar';
      case 'publicar':
        return 'Seleccione un servicio para publicar';
      case 'despublicar':
        return 'Seleccione un servicio para despublicar';
      default:
        return 'Seleccione un servicio';
    }
  };

  const showSuccessToast = (accion: Accion) => {
    toaster.create({
      title: `Acción: ${accion}`,
      description: `La acción "${accion}" se realizó correctamente.`,
      type: 'success',
    });
  };

  return (
    <>
      <Box bg="white" p={0}>
        <Header />
        <Box p={8}>
          <Heading mb={6} color="#fd6193">
            {getHeading(accion)}
          </Heading>
          <Box height="2px" width="100%" bg="#fd6193" borderRadius="full" mb={6} />

          <Flex flexWrap="wrap" justify="flex-start" gap={6}>
            {servicios.map((servicio) => (
              <TrainingCard
                key={servicio.id}
                title={servicio.title}
                price={servicio.price}
                duration={servicio.duration}
                location={servicio.location}
                language={servicio.language}
                trainer={servicio.trainer}
                ctaLabel={getLabel(accion)}
                onCtaClick={() => {
                  if (accion === 'eliminar') {
                    setDeleteId(servicio.id);
                  } else {
                    showSuccessToast(accion);
                  }
                }}
              />
            ))}
          </Flex>
        </Box>
      </Box>

      {/* Modal completamente fuera del layout visual */}
      <ConfirmDelete
        isOpen={!!deleteId}
        onConfirm={() => {
          setDeleteId(null);
          showSuccessToast('eliminar');
        }}
        onClose={() => setDeleteId(null)}
      />
    </>
  );
};

export default ServiceAction;

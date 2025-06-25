import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetchWithAuth } from "@/utils/fetchWithAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toaster } from "@/components/ui/toaster";
import { PropagateLoader } from "react-spinners";

type StatusType = "aceptado" | "cancelado" | null;

interface Student {
  trainingId: number;
  clientId: number;
  studentName: string;
  hasAttachments: boolean;
  serviceTitle?: string;
  serviceDescription?: string;
  selectedSchedule?: Record<string, string[]>;
  servicePrice?: number;
}

interface StudentsResponse {
  pending: Student[];
  confirmed: Student[];
  cancelled: Student[];
}

interface Service {
  title: string;
  description: string;
  price: number;
}
const CLOUD_NAME = "dfvnyxs4i";
const UPLOAD_PRESET = "fitaura_files";

async function uploadAttachmentToCloudinary(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json();
  console.log(" Uploaded RAW:", data);
  return data;
}

export default function ManageClass() {
  const { serviceId } = useParams();
  const fetchWithAuth = useFetchWithAuth();
  const [statusSubmitting, setStatusSubmitting] = useState<Record<number, StatusType>>({});

  const [uploading, setUploading] = useState<Record<number, boolean>>({});

  const [students, setStudents] = useState<StudentsResponse>({
    pending: [],
    confirmed: [],
    cancelled: [],
  });
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setLoading] = useState(true);

  const fetchStudentsAndService = async () => {
    if (!serviceId) {
      toaster.create({
        title: "Error",
        description: "No se especificó el ID del servicio.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const statuses = ["pendiente", "aceptado", "cancelado"];
      const results = await Promise.all(
        statuses.map(async (status) => {
          const url = `http://localhost:4000/api/v1/trainers-trainings?serviceId=${serviceId}&status=${status}`;
          console.log(`[FETCH URL]: ${url}`);
          const res = await fetchWithAuth(url);
          const text = await res.text();
          // si la respuesta no es JSON válido, se lanza:
          try {
            const data = JSON.parse(text);
            return Array.isArray(data.trainings) ? data.trainings : [];
          } catch {
            console.error("Respuesta no es JSON:", text);
            throw new Error(`Respuesta inválida para status: ${status}`);
          }
        })
      );

      const normalize = (arr: any[]) =>
        arr.map((t) => ({
          trainingId: t.id,
          clientId: t.clientId,
          studentName: t.clientName,
          hasAttachments: !!t.hasAttachments,
          serviceTitle: t.title,
          serviceDescription: t.description,
          servicePrice: t.price,
          selectedSchedule: t.selectedSchedule || {},
        }));

      setStudents({
        pending: normalize(results[0]),
        confirmed: normalize(results[1]),
        cancelled: normalize(results[2]),
      });

      const all = [...results[0], ...results[1], ...results[2]];
      if (all.length > 0) {
        setService({
          title: all[0].title || "Sin título",
          description: all[0].description || "Sin descripción",
          price: all[0].price || 0,
        });
      } else {
        setService(null);
      }
    } catch (err: any) {
      console.error("[ManageClass] Error:", err);
      toaster.create({
        title: "Error",
        description:
          err.message || "No se pudieron cargar las alumnas o el servicio.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsAndService();
  }, [serviceId]);

  const updateStatus = async (trainingId: number, newStatus: string) => {
    try {
      setStatusSubmitting((prev) => ({ ...prev, [trainingId]: newStatus as StatusType }));

      const res = await fetchWithAuth(
        `http://localhost:4000/api/v1/trainings/${trainingId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newStatus }),
        }
      );
      if (!res.ok) throw new Error("No se pudo actualizar el estado.");
      toaster.create({
        title: "Estado actualizado",
        description: `La alumna pasó a ${newStatus}.`,
        type: "success",
        duration: 3000,
      });
      fetchStudentsAndService();
    } catch (err: any) {
      console.error("[ManageClass] Error al actualizar status:", err);
      toaster.create({
        title: "Error",
        description: err.message || "Error al actualizar estado.",
        type: "error",
        duration: 3000,
      });
    } finally {
       setStatusSubmitting((prev) => ({ ...prev, [trainingId]: null }));
    }
  };
  const handleUploadAttachment = async (trainingId: number, file: File) => {
    try {
      setUploading((prev) => ({ ...prev, [trainingId]: true }));
      // subo a cloudinary
      const cloudRes = await uploadAttachmentToCloudinary(file);
      console.log(" SUBIDO A CLOUDINARY:", cloudRes);
      // infiero en tipo seguro desde el nombre del archivo
      const ext = file.name.split(".").pop()?.toLowerCase() || "raw";
      let attachmentType: string;
      if (ext === "pdf") {
        attachmentType = "pdf";
      } else if (ext === "zip") {
        attachmentType = "zip";
      } else {
        attachmentType = "raw"; // fallback por si es otro tipo
      }
      await fetchWithAuth(
        `http://localhost:4000/api/v1/trainings/${trainingId}/attachments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attachmentName: file.name,
            attachmentType: attachmentType,
            attachmentSize: cloudRes.bytes,
            attachmentUrl: cloudRes.secure_url,
          }),
        }
      );

      toaster.create({
        title: "Archivo enviado",
        description: "Se subió y guardó correctamente.",
        type: "success",
      });

      fetchStudentsAndService();
    } catch (err) {
      console.error("ERROR SUBIENDO:", err);
      toaster.create({
        title: "Error",
        description: "No se pudo subir.",
        type: "error",
      });
    } finally {
      setUploading((prev) => ({ ...prev, [trainingId]: false }));
    }
  };

  if (isLoading) {
    return (
      <VStack justify="center" align="center" minH="50vh">
        <Text mb={6} fontSize="lg" color="#fd6193" fontWeight="medium">
          Cargando clase...
        </Text>
        <PropagateLoader size="15" color="#fd6193" speedMultiplier={1} />
      </VStack>
    );
  }

  return (
    <Box minH="100vh" bg="white" overflowX="hidden">
      <Header />

      <Box px={{ base: 4, md: 12 }} py={6} maxW="100%" mx="auto">
        <Heading
          as="h1"
          fontSize="2xl"
          color="#fd6193"
          mb={2}
          fontWeight="bold"
        >
          Sobre este servicio
        </Heading>
        <Box h="2px" bg="#fd6193" mb={10} />

        {service && (
          <Box mb={8} p={4} bg="white" borderRadius="xl" boxShadow="md">
            <Text fontSize="2xl" mb={0} fontWeight="semibold">
              {service.title}
            </Text>
            <Text mb={1}>{service.description}</Text>
          </Box>
        )}

        {["pending", "confirmed", "cancelled"].map((key) => {
          const studentList = students[key as keyof StudentsResponse];
          const count = studentList.length;

          return (
            <Box key={key}>
              <Heading
                as="h1"
                fontSize="2xl"
                color="#fd6193"
                fontWeight="bold"
                mb={2}
              >
                {key === "pending"
                  ? `Alumnas pendientes de confirmación (${count})`
                  : key === "confirmed"
                    ? `Alumnas confirmadas (${count})`
                    : `Alumnas canceladas (${count})`}
              </Heading>
              {key === "confirmed" && (
                <Text fontSize="sm" color="gray.600" mb={2}>
                  NOTA: al subir un archivo, el mismo se enviará
                  automáticamente.
                </Text>
              )}
              <Box h="2px" bg="#fd6193" mb={10} />
              <StudentsGrid
                students={students[key as keyof StudentsResponse]}
                showActions={key === "pending"}
                onAction={updateStatus}
                onUpload={
                  key === "confirmed" ? handleUploadAttachment : undefined
                }
                statusSubmitting={statusSubmitting}
                uploading={uploading}
              />
            </Box>
          );
        })}
      </Box>
      <Footer />
    </Box>
  );
}

interface StudentsGridProps {
  students: Student[];
  showActions?: boolean;
  onAction?: (trainingId: number, newStatus: string) => void;
  onUpload?: (trainingId: number, file: File) => void;
  statusSubmitting?: Record<number, "aceptado" | "cancelado" | null>;
  uploading?: Record<number, boolean>;
}

function StudentsGrid({
  students,
  showActions,
  onAction,
  onUpload,
  statusSubmitting,
  uploading
}: StudentsGridProps) {
  if (!students.length) {
    return <Text mb={8}>No hay alumnas en este estado.</Text>;
  }

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={6} mb={12}>
      {students.map((student) => (
        <Box
          key={student.trainingId}
          p={4}
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          maxW="3000px"
          w="100%"
        >
          <Text fontWeight="bold" mb={2}>
            {student.studentName}
          </Text>
          {student.selectedSchedule &&
            Object.entries(student.selectedSchedule).map(([day, times]) => (
              <Text key={day} fontSize="sm" color="gray.700">
                <strong>{day}:</strong> {times.join(", ")}
              </Text>
            ))}

          {student.hasAttachments && (
            <Text fontSize="sm" color="gray.500" mb={2}>
              Subió archivos adjuntos.
            </Text>
          )}

          {showActions && onAction && (
            <Flex gap={2} mt={2}>
              <Button
                size="sm"
                bg="#7ed957"
                _hover={{ bg: "#9af574" }}
                onClick={() => onAction(student.trainingId, "aceptado")}
                loading={statusSubmitting?.[student.trainingId] === "aceptado"}
                loadingText={"Confirmando..."}
              >
                Confirmar
              </Button>
              <Button
                size="sm"
                bg="#ff3131"
                _hover={{ bg: "#f86767" }}
                onClick={() => onAction(student.trainingId, "cancelado")}
                loading={statusSubmitting?.[student.trainingId] === "cancelado"}
                loadingText={"Cancelando..."}
              >
                Cancelar
              </Button>
            </Flex>
          )}
          {onUpload && (
            <Flex mt={2} direction="column" gap={1} w="100%">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUpload(student.trainingId, file);
                  }
                }}
              />
              {uploading?.[student.trainingId] && (
  <Text fontSize="sm" color="#fd6193" mt={1}>
    Enviando archivo...
  </Text>
)}

            </Flex>
          )}
        </Box>
      ))}
    </SimpleGrid>
  );
}

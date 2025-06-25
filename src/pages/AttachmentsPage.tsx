import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Image,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useFetchWithAuth } from "@/utils/fetchWithAuth";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PropagateLoader } from "react-spinners";

interface Attachment {
  id: number;
  attachmentName: string;
  attachmentUrl: string;
}

export default function AttachmentsPage() {
  const { trainingId } = useParams();
  const fetchWithAuth = useFetchWithAuth();

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttachments = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:4000/api/v1/trainings/${trainingId}/attachments`
      );
      const data = await res.json();
      console.log("DATA CRUDA DEL BACK:", data);

      const fixed = (
        Array.isArray(data.attachments) ? data.attachments : []
      ).map((att) => ({
        id: att.id || att._id || Math.random(),
        attachmentUrl: att.attachmenturl || att.url || att.secure_url || "",
        attachmentName:
          att.attachmentname ||
          att.name ||
          att.originalname ||
          "Archivo sin nombre",
      }));

      console.log(" Attachments normalizados:", fixed);

      setAttachments(fixed);
    } catch (err) {
      console.error("[AttachmentsPage] Error:", err);
      setAttachments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trainingId) {
      fetchAttachments();
    }
  }, [trainingId]);

  if (loading) {
    return (
      <VStack justify="center" align="center" minH="50vh">
        <Text mb={6} fontSize="lg" color="#fd6193" fontWeight="medium">
          Cargando archivos...
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
          fontSize={{ base: "2xl", md: "3xl" }}
          color="#fd6193"
          fontWeight="bold"
          mt={8}
          mb={2}
          fontFamily={"Inter"}
        >
          Archivos de la clase
        </Heading>
        <Box h="2px" w="100%" bg="#fd6193" mb={6} />
        {attachments.length === 0 ? (
          <Text>No hay archivos adjuntos para esta clase.</Text>
        ) : (
          <Stack gap={4}>
            {attachments.map((file) => (
              <Flex
                key={file.id}
                p={4}
                border="1px solid #fd6193"
                borderRadius="md"
                direction={{ base: "column", md: "row" }}
                align={{ base: "flex-start", md: "center" }}
                justify="space-between"
                gap={{ base: 4, md: 6 }}
              >
                <Flex align="center" gap={4} flex="1">
                  <Image
                    src="/file-type-pdf.svg"
                    alt="PDF"
                    boxSize={{ base: "40px", md: "50px" }}
                  />
                  <Text
                    fontWeight="bold"
                    fontSize={{ base: "sm", md: "md" }}
                    wordBreak="break-word"
                  >
                    {file.attachmentName || "Archivo sin nombre"}
                  </Text>
                </Flex>

                <Box>
                  <a
                    href={file.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      bg="#fd6193"
                      color="white"
                      _hover={{ bg: "#fc7faa" }}
                      w={{ base: "100%", md: "auto" }}
                    >
                      Ver o Descargar archivo
                    </Button>
                  </a>
                </Box>
              </Flex>
            ))}
          </Stack>
        )}
      </Box>

      <Footer />
    </Box>
  );
}

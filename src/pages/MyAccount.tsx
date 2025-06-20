import {
  Box,
  Button,
  Input,
  Stack,
  Heading,
  Flex,
  Field,
  Text,
} from "@chakra-ui/react";

import { toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";


export default function MyAccount() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    birthDate: "",
    isTrainer: false,
    joiningDate: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener perfil");
        const data = await res.json();
        const birthDateFormatted = data.birthDate
          ? new Date(data.birthDate * 1000).toLocaleDateString("es-AR") // dd/mm/aaaa para español
          : "";
        const joiningDateFormatted = data.joiningDate
          ? new Date(data.joiningDate * 1000).toLocaleDateString("es-AR")
          : "";

        setProfile({
          name: data.name,
          email: data.email,
          birthDate: birthDateFormatted,
          joiningDate: joiningDateFormatted,
          isTrainer: data.isTrainer,
        });
      } catch (err) {
        toaster.create({
          title: "Error",
          description: "No se pudo cargar el perfil.",
          type: "error",
          duration: 3000,
        });
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
  try {
    const [day, month, year] = profile.birthDate.split("/");
    const birthDateTimestamp = Math.floor(
      new Date(`${year}-${month}-${day}`).getTime() / 1000
    );

    const res = await fetch("http://localhost:4000/api/v1/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: profile.name,
        email: profile.email,
        birthDate: birthDateTimestamp,
      }),
    });

    if (!res.ok) throw new Error("No se pudo actualizar");

    const updatedUser = {
      id: user?.id || 0,
      name: profile.name.split(" ")[0] || "Usuaria",
    };
    setUser(updatedUser);
    localStorage.setItem("fitauraUser", JSON.stringify(updatedUser));

    toaster.create({
      title: "Guardado",
      description: "Tus datos se actualizaron correctamente.",
      type: "success",
      duration: 3000,
    });
    setIsEditing(false);

  } catch (err) {
    toaster.create({
      title: "Error",
      description: "Ocurrió un error al guardar.",
      type: "error",
      duration: 3000,
    });
  }
};

  

  return (
    <Box minH="100vh" bg="pink.100">
      <Header />
      <Box px={{ base: 4, md: 12 }} py={6} maxW="100%" mx="auto">
        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          color="#fd6193"
          fontWeight="bold"
          mb={2}
          fontFamily={"Inter"}
        >
          Mi cuenta
        </Heading>
        <Box h="2px" w="100%" maxW="100%" bg="#fd6193" mb={10} />
      </Box>

      <Flex maxW="500px" mx="auto" mt={{ base: -2, md: -14 }} borderRadius="lg">
        <Box 
        bg="white"
        p={{ base: 6, md: 8 }}
        borderRadius="lg"
        boxShadow="xl"
        w="full"
      >
        <Stack gap={4} w="full">
          {isEditing ? (
            <Field.Root>
              <Field.Label>Nombre</Field.Label>
              <Input name="name" value={profile.name} onChange={handleChange} />
            </Field.Root>
          ) : (
            <Box>
              <Text fontWeight="semibold" mb={1}>
                Nombre
              </Text>
              <Text>{profile.name}</Text>
            </Box>
          )}

          {isEditing ? (
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Input
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </Field.Root>
          ) : (
            <Box>
              <Text fontWeight="semibold" mb={1}>
                Email
              </Text>
              <Text>{profile.email}</Text>
            </Box>
          )}

          {isEditing ? (
            <Field.Root>
              <Field.Label>Fecha de nacimiento</Field.Label>
              <Input
                name="birthDate"
                type="text"
                value={profile.birthDate}
                onChange={handleChange}
              />
            </Field.Root>
          ) : (
            <Box>
              <Text fontWeight="semibold" mb={1}>
                Fecha de nacimiento
              </Text>
              <Text>{profile.birthDate}</Text>
            </Box>
          )}

          {isEditing ? (
            <Field.Root disabled>
              <Field.Label>Rol</Field.Label>
              <Input value={profile.isTrainer ? "Entrenadora" : "Alumna"} />
            </Field.Root>
          ) : (
            <Box>
              <Text fontWeight="semibold" mb={1}>
                Rol
              </Text>
              <Text>{profile.isTrainer ? "Entrenadora" : "Alumna"}</Text>
            </Box>
          )}

          {isEditing ? (
            <Field.Root disabled>
              <Field.Label>Fecha de registro</Field.Label>
              <Input value={profile.joiningDate} />
            </Field.Root>
          ) : (
            <Box>
              <Text fontWeight="semibold" mb={1}>
                Fecha de registro
              </Text>
              <Text>{profile.joiningDate}</Text>
            </Box>
          )}

          {!isEditing ? (
            <Box>
            <Button bg={"#fd6193"} _hover={{bg: "#fc7faa"}} color={"white"} onClick={() => setIsEditing(true)}>
              Editar mis datos
            </Button>

            <Button variant="outline" bg={"#dcd3f0"} _hover={{bg: "#d9c9fc", color:"#474bca"}} color={"#474bca"} onClick={() => navigate("/home")} ml={4}>
            Volver al Home
          </Button>
          </Box>
            
          ) : (
            <Stack direction="row">
              <Button bg={"#7ed957"} _hover={{bg: "#9af574"}} color={"white"} onClick={handleSave}>
                Guardar cambios
              </Button>
              <Button bg={"#ff3131"} _hover={{bg: "#f86767"}} color={"white"} onClick={() => setIsEditing(false)}>Cancelar</Button>
            </Stack>
          )}

          
        </Stack>
        </Box>
      </Flex>
    </Box>
    
  );
}

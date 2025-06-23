import {
  Box,
  Button,
  Flex,
  Image,
  SimpleGrid,
  Text,
  useBreakpointValue,
  AvatarRoot,
  AvatarFallback,
  Stack,
  Checkbox,
  Input,
  Slider,
  RadioGroup,
  Separator,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSearchParams } from "react-router-dom";

const Services = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialDurations = searchParams.get("durations");

  const [category, setCategory] = useState<string | null>(
    initialCategory ?? null
  );
  const [durations, setDurations] = useState<string[]>(
    initialDurations ? [initialDurations] : []
  );

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [locations, setLocations] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [ratingMin, setRatingMin] = useState<boolean>(false); 
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);
  const [minInput, setMinInput] = useState("0");
  const [maxInput, setMaxInput] = useState("");
  const [globalMaxPrice, setGlobalMaxPrice] = useState<number>(1000);
  const [hasFetchedGlobalMax, setHasFetchedGlobalMax] =
    useState<boolean>(false);

  useEffect(() => {
    setMinInput(priceRange[0].toString());
    setMaxInput(priceRange[1] === Infinity ? "" : priceRange[1].toString());
  }, [priceRange]);

  const [search, setSearch] = useState<string>("");

  const fontSizeCard = useBreakpointValue({ base: "sm", md: "md" }) || "md";

  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category && category !== "Ver todos")
        params.append("category", category);
      if (locations.length > 0) params.append("locations", locations.join(","));
      if (languages.length > 0) params.append("languages", languages.join(","));
      if (durations.length > 0) params.append("durations", durations.join(","));
      if (ratingMin) params.append("ratingMin", "4.5");
      if (priceRange[0]) params.append("priceMin", priceRange[0].toString());
      if (priceRange[1] !== Infinity)
        params.append("priceMax", priceRange[1].toString());

      params.append("published", "true");

      const url = `http://localhost:4000/api/v2/services?${params.toString()}`;
      //console.log("URL generada:", url); para debugging

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        if (data.internalErrorCode === 1007) {
          setServices([]);
          return;
        }
        setError(data.message || "Error interno en el servidor.");
        return;
      }

      const fetchedServices = data.services || [];
      setServices(fetchedServices);
    } catch (err) {
      console.error("Error al cargar servicios:", err);
      setError("Error interno en el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchGlobalMax = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/v2/services?published=true"
        );
        const data = await response.json();
        const prices = (data.services || []).map(
          (s: any) => Number(s.price) || 0
        );
        const highest = prices.length > 0 ? Math.max(...prices) : 1000;
        setGlobalMaxPrice(highest);
        setMaxPrice(highest); 
        setPriceRange([0, highest]);
        setHasFetchedGlobalMax(true);
      } catch (e) {
        console.error("Error obteniendo precio máximo global", e);
      }
    };

    fetchGlobalMax();
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  const toggleLocation = (loc: string) => {
    setLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleDuration = (dur: string) => {
    setDurations((prev) =>
      prev.includes(dur) ? prev.filter((d) => d !== dur) : [...prev, dur]
    );
  };

  return (
    <Box>
      <Header />

      <Flex
        px={{ base: 4, md: 12 }}
        py={8}
        bg="white"
        gap={10}
        direction={{ base: "column", md: "row" }}
      >
        <Box w={{ base: "100%", md: "250px" }} flexShrink={0}>
          <Text fontWeight="bold" mb={4}>
            Filtros
          </Text>

          {/* Buscador */}
          <Input
            placeholder="Buscar..."
            mb={4}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Categoría */}
          <Text fontWeight="semibold" mb={2}>
            Tipo de entrenamiento
          </Text>

          <Stack mb={4} gap={2}>
            <Button
              variant={category === null ? "solid" : "ghost"}
              colorScheme="pink"
              size="sm"
              onClick={() => setCategory(null)}
              width="100%"
              justifyContent="flex-start"
              bg={category === null ? "#fc7faa" : "transparent"}
              color="black"
              _hover={{ bg: category === null ? "#fc7faa" : "#ffd3e5" }}
            >
              Ver todos
            </Button>
            {["Yoga", "Fuerza", "Pilates", "Cardio", "Otros"].map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "solid" : "ghost"}
                colorScheme="pink"
                size="sm"
                onClick={() => setCategory(cat)}
                width="100%"
                justifyContent="flex-start"
                bg={category === cat ? "#fc7faa" : "transparent"}
                color="black"
                _hover={{ bg: category === cat ? "#fc7faa" : "#ffd3e5" }}
              >
                {cat}
              </Button>
            ))}
          </Stack>
          <Separator color={"#fc7faa"} mb={2} />

          {/* Ubicación */}
          <Text fontWeight="semibold" mb={2}>
            Ubicación
          </Text>
          <Stack mb={4}>
            {["Virtual por Zoom", "CABA", "PBA", "Otras"].map((loc) => (
              <Checkbox.Root
                key={loc}
                checked={locations.includes(loc)}
                onCheckedChange={() => toggleLocation(loc)}
                colorPalette="pink"
                variant="subtle"
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>{loc}</Checkbox.Label>
              </Checkbox.Root>
            ))}
          </Stack>
          <Separator color={"#fc7faa"} mb={2} />

          {/* Duración */}
          <Text fontWeight="semibold" mb={2}>
            Duración
          </Text>
          <Stack mb={4}>
            {[
              ["gt60", "+60 mins"],
              ["btw45and60", "45–60 mins"],
              ["btw30and45", "30–45 mins"],
              ["lt30", "-30 mins"],
              ["solo15", "-15 mins"],
            ].map(([value, label]) => (
              <Checkbox.Root
                key={value}
                checked={durations.includes(value)}
                onCheckedChange={() => toggleDuration(value)}
                colorPalette="pink"
                variant="subtle"
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>{label}</Checkbox.Label>
              </Checkbox.Root>
            ))}
          </Stack>
          <Separator color={"#fc7faa"} mb={2} />

          {/* Idioma */}
          <Text fontWeight="semibold" mb={2}>
            Idioma
          </Text>
          <Stack mb={4}>
            {["Español", "English"].map((lang) => (
              <Checkbox.Root
                key={lang}
                checked={languages.includes(lang)}
                onCheckedChange={() => toggleLanguage(lang)}
                colorPalette="pink"
                variant="subtle"
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>{lang}</Checkbox.Label>
              </Checkbox.Root>
            ))}
          </Stack>
          <Separator color={"#fc7faa"} mb={2} />

          {/* Rating Min */}
          <Text fontWeight="semibold" mb={2}>
            Calificación de la entrenadora
          </Text>
          <RadioGroup.Root
            mb={4}
            value={ratingMin ? "best" : "all"}
            onValueChange={(details) => {
              const selected =
                typeof details === "string" ? details : details.value;
              setRatingMin(selected === "best");
            }}
            colorPalette="pink"
            variant="subtle"
          >
            <Stack direction="column" gap={2}>
              <RadioGroup.Item value="best">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>
                  Sólo mejor puntuadas (4.5–5 ⭐)
                </RadioGroup.ItemText>
              </RadioGroup.Item>

              <RadioGroup.Item value="all">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>Todas</RadioGroup.ItemText>
              </RadioGroup.Item>
            </Stack>
          </RadioGroup.Root>
          <Separator color={"#fc7faa"} mb={2} />

          {/* Slider de precio */}
          <Text fontWeight="semibold" mb={2}>
            Precio: ${priceRange[0]} -{" "}
            {priceRange[1] === Infinity ? "∞" : `$${priceRange[1]}`}
          </Text>

          <Slider.Root
            mb={4}
            maxW="md"
            min={0}
            max={maxPrice}
            value={priceRange}
            onValueChange={(details) =>
              setPriceRange(details.value as [number, number])
            }
            minStepsBetweenThumbs={1}
            step={10}
            colorScheme="pink"
          >
            <Slider.Control>
              <Slider.Track bg="gray.200">
                <Slider.Range bg="pink.400" />
              </Slider.Track>
              <Slider.Thumbs
                bg="pink.600"
                border="2px solid white"
                cursor={"grab"}
                _active={{ cursor: "grabbing" }}
              />
            </Slider.Control>
          </Slider.Root>

          {/* Inputs sincronizados */}
          <Flex gap={2} mb={4}>
            <Input
              type="number"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              onBlur={() => {
                const val = Number(minInput);
                const safeVal = Math.max(0, Math.min(val, priceRange[1]));
                setPriceRange([safeVal, priceRange[1]]);
              }}
            />

            <Input
              type="number"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              onBlur={() => {
                const val = Number(maxInput);
                if (isNaN(val) || maxInput.trim() === "") {
                  setPriceRange([priceRange[0], Infinity]);
                } else {
                  const safeVal = Math.min(
                    Math.max(val, priceRange[0]),
                    maxPrice
                  );
                  setPriceRange([priceRange[0], safeVal]);
                }
              }}
            />
          </Flex>

          <Button
            w="100%"
            bg="#fc7faa"
            color={"black"}
            _hover={{ bg: "#fd99bf" }}
            onClick={fetchServices}
            isLoading={loading}
            loadingText="Cargando..."
          >
            Aplicar filtros
          </Button>
        </Box>

        {/* Cards */}
        <Box flex="1">
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3 }}
            gap={{ base: 6, md: 8 }}
          >
            {loading ? (
              <VStack justify="center" align="center" minH="100px">
                <Spinner size="xl" color="#fd6193" />

                <Text>Cargando entrenamientos...</Text>
              </VStack>
            ) : error ? (
              <Text color="red">{error}</Text>
            ) : services.length === 0 ? (
              <Text>No hay entrenamientos disponibles.</Text>
            ) : (
              services.map((clase, index) => (
                <Box
                  key={index}
                  p={4}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="md"
                  display="flex"
                  flexDirection="column"
                  height="100%"
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
                      {clase.title}
                    </Text>

                    <Flex
                      as={RouterLink}
                      to={`/trainer/${clase.trainerid}`}
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
                          {clase.trainer_name}
                        </Text>
                        <Flex align="center" gap={1}>
                          <Text
                            fontWeight="bold"
                            fontSize="sm"
                            color="black"
                            mt={1}
                          >
                            {clase.trainer_rating
                              ? `${clase.trainer_rating.toFixed(1)}/5`
                              : "Sin reviews"}
                          </Text>
                          <Image src="/estrella.png" boxSize="1rem" />
                        </Flex>
                      </Box>

                      {clase.profile_pic ? (
                        <Image
                          src={clase.profile_pic}
                          alt={clase.trainer_name}
                          boxSize={{ base: "40px", md: "50px" }}
                          borderRadius="full"
                          objectFit="cover"
                          flexShrink={0}
                        />
                      ) : (
                        <AvatarRoot colorPalette="pink">
                          <AvatarFallback />
                        </AvatarRoot>
                      )}
                    </Flex>
                  </Flex>

                  <Box flexGrow={1} mb={4}>
                    <Text fontSize={fontSizeCard}>
                      <Image
                        src="/dinero.webp"
                        display="inline"
                        boxSize="1.5rem"
                        verticalAlign="-0.30rem"
                      />{" "}
                      ${Number(clase.price).toFixed(2)}
                    </Text>
                    <Text fontSize={fontSizeCard}>
                      <Image
                        src="/reloj.png"
                        display="inline"
                        boxSize="1.5rem"
                        verticalAlign="-0.30rem"
                      />{" "}
                      {clase.duration} mins
                    </Text>
                    <Text fontSize={fontSizeCard}>
                      {" "}
                      <Image
                        src="/locacion.png"
                        display="inline"
                        boxSize="1.5rem"
                        verticalAlign="-0.30rem"
                      />{" "}
                      {clase.location}
                    </Text>
                    <Text fontSize={fontSizeCard}>
                      <Image
                        src="/idioma.png"
                        display="inline"
                        boxSize="1.5rem"
                        verticalAlign="-0.30rem"
                      />{" "}
                      {clase.language}
                    </Text>
                  </Box>

                  <Button
                    mt="auto"
                    as={RouterLink}
                    to={`/booking/${clase.id}`}
                    mb={1}
                    bg="#fd6193"
                    w="full"
                    borderRadius="xl"
                    color="white"
                    _hover={{
                      color: "white",
                      boxShadow: "0 8px 14px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    Reservar clase
                  </Button>
                </Box>
              ))
            )}
          </SimpleGrid>
        </Box>
      </Flex>

      <Footer />
    </Box>
  );
};

export default Services;

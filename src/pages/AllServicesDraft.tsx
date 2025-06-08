import React, { useEffect, useState } from "react";

interface Service {
    id: number;
    category: string;
    description: string;
    duration: number;
    price: number;
    location: string;
    language: string;
    published: boolean;
    trainerid: number;
    trainer_name?: string;
    trainer_rating?: number;
  }
  

const AllServicesDraft: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para filtros
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // solo uno
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [onlyBestRated, setOnlyBestRated] = useState<boolean>(false);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (selectedCategory && selectedCategory !== "Ver todos") {
        params.append("category", selectedCategory);
      }
      if (selectedLocations.length > 0) {
        params.append("locations", selectedLocations.join(","));
      }
      if (selectedDurations.length > 0) {
        params.append("durations", selectedDurations.join(","));
      }
      if (selectedLanguages.length > 0) {
        params.append("languages", selectedLanguages.join(","));
      }
      if (priceMin) {
        params.append("priceMin", priceMin);
      }
      if (priceMax) {
        params.append("priceMax", priceMax);
      }
      if (onlyBestRated) {
        params.append("ratingMin", "4.5");
      }

      const url = `http://localhost:4000/api/v2/services?${params.toString()}`;
      console.log("Llamando a:", url);

      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        switch (data.internalErrorCode) {
          case 1007:
            setError("No se encontraron servicios que cumplan con los filtros.");
            break;
          case 1002:
            setError("Formato de dato inválido en los filtros.");
            break;
          default:
            setError("Error interno en el servidor. Por favor, intenta más tarde.");
            break;
        }
        return;  // importante para cortar la ejecución y no seguir procesando data.services
      }
      
      
  
      if (data.statusCode === 200 && data.services) {
        setServices(data.services);
      } else {
        setError("No se encontraron servicios.");
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Ocurrió un error al cargar los servicios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(); // Cargar todos al inicio
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "Ver todos") {
      setSelectedCategory("");
    } else {
      setSelectedCategory(value);
    }
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelected([...selected, value]);
    } else {
      setSelected(selected.filter((item) => item !== value));
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#2c1250", color: "white", padding: "20px", textAlign: "center" }}>
        <h1 style={{ margin: 0 }}>Todos los entrenamientos</h1>
      </header>

      <main style={{ display: "flex", flexDirection: "row", padding: "20px" }}>
        {/* Sidebar Filters */}
        <aside
          style={{
            width: "250px",
            backgroundColor: "white",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          {/* Tipo de entrenamiento */}
          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "14px", marginBottom: "5px" }}>Tipo de entrenamiento</h3>
            {["Ver todos", "Yoga", "Fuerza", "Pilates", "Cardio", "Otros"].map((type) => (
              <label key={type} style={{ display: "block" }}>
                <input
                  type="radio"
                  name="category"
                  value={type}
                  checked={type === "Ver todos" ? selectedCategory === "" : selectedCategory === type}
                  onChange={handleCategoryChange}
                />{" "}
                {type}
              </label>
            ))}
          </div>

          {/* Ubicación */}
          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "14px", marginBottom: "5px" }}>Ubicación</h3>
            {["Virtual por Zoom", "CABA", "PBA", "Otras"].map((loc) => (
              <label key={loc} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  value={loc}
                  checked={selectedLocations.includes(loc)}
                  onChange={(e) => handleCheckboxChange(e, selectedLocations, setSelectedLocations)}
                />{" "}
                {loc}
              </label>
            ))}
          </div>

          {/* Duración */}
          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "14px", marginBottom: "5px" }}>Duración</h3>
            {[
              { label: "-30mins", value: "lt30" },
              { label: "30-45mins", value: "btw30and45" },
              { label: "46-60mins", value: "btw45and60" },
              { label: "+60mins", value: "gt60" },
              { label: "Solo 15'", value: "solo15" }
            ].map((dur) => (
              <label key={dur.value} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  value={dur.value}
                  checked={selectedDurations.includes(dur.value)}
                  onChange={(e) => handleCheckboxChange(e, selectedDurations, setSelectedDurations)}
                />{" "}
                {dur.label}
              </label>
            ))}
          </div>

          {/* Idioma */}
          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "14px", marginBottom: "5px" }}>Idioma</h3>
            {["Español", "English"].map((lang) => (
              <label key={lang} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  value={lang}
                  checked={selectedLanguages.includes(lang)}
                  onChange={(e) => handleCheckboxChange(e, selectedLanguages, setSelectedLanguages)}
                />{" "}
                {lang}
              </label>
            ))}
          </div>

          {/* Solo mejores puntuadas */}
         {/* Calificación de la entrenadora */}
<div style={{ marginBottom: "15px" }}>
  <h3 style={{ fontSize: "14px", marginBottom: "5px" }}>Calificación de la entrenadora</h3>
  <label style={{ display: "block" }}>
    <input
      type="radio"
      name="ratingFilter"
      checked={onlyBestRated}
      onChange={() => setOnlyBestRated(true)}
    />{" "}
    Sólo mejor puntuadas (4.5-5.5 ⭐️)
  </label>
  <label style={{ display: "block" }}>
    <input
      type="radio"
      name="ratingFilter"
      checked={!onlyBestRated}
      onChange={() => setOnlyBestRated(false)}
    />{" "}
    Todas
  </label>
</div>


          {/* Precio */}
          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "14px", marginBottom: "5px" }}>Precio</h3>
            <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
              <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                style={{ flex: 1, padding: "5px" }}
              />
              <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                style={{ flex: 1, padding: "5px" }}
              />
            </div>
          </div>

          <button
            onClick={fetchServices}
            style={{
              width: "100%",
              padding: "5px",
              backgroundColor: "#fc7faa",
              border: "none",
              color: "white",
              cursor: "pointer",
              borderRadius: "4px",
              marginTop: "10px"
            }}
          >
            Filtrar
          </button>
        </aside>

        {/* Services Grid */}
        <section
          style={{
            display: "grid",
            flex: 1,
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            marginLeft: "20px"
          }}
        >
          {loading ? (
            <p>Cargando servicios...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.id}
                style={{
                  backgroundColor: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                <h4 style={{ margin: "0 0 5px 0", fontSize: "16px", fontWeight: "bold" }}>
                  {service.category}
                </h4>
                <div
  style={{
    backgroundColor: "#fc7faa",
    color: "white",
    padding: "3px 8px",
    borderRadius: "4px",
    display: "inline-block",
    marginBottom: "5px",
    fontSize: "13px"
  }}
>  {service.trainer_name}{" "}

{
    
  typeof service.trainer_rating === "number" && !isNaN(service.trainer_rating) && service.trainer_rating >= 1
    ? `${service.trainer_rating.toFixed(1)}/5 ⭐️`
    : "Aún sin reviews ⭐️"
}


</div>



                <ul style={{ listStyle: "none", padding: 0, fontSize: "14px", margin: "10px 0" }}>
                  <li>💰 ${Number(service.price).toFixed(2)}</li>
                  <li>⏱️ {service.duration} mins</li>
                  <li>📍 {service.location}</li>
                  <li>🇪🇸 {service.language}</li>
                </ul>
                <button
                  style={{
                    width: "100%",
                    padding: "6px",
                    backgroundColor: "#fc7faa",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    borderRadius: "4px"
                  }}
                >
                  Reservar clase
                </button>
              </div>
            ))
          ) : (
            <p>No se encontraron servicios.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default AllServicesDraft;

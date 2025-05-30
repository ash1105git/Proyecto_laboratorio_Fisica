import { useEffect, useState } from "react";
import { useEquipments } from "../context/EquipmentsContext"; // Hook personalizado para acceder a funciones y datos de equipos
import EquipmentCard from "../components/EquipmentCard/EquipmentCard"; // Componente para mostrar la información de cada equipo

function EquipmentPage() {
  // Obtiene la función para traer los equipos y el array de equipos desde el contexto
  const { getEquipments, equipments } = useEquipments();

  // Estado para el término de búsqueda ingresado por el usuario
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para filtrar por disponibilidad (todos, disponibles, no disponibles)
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  // Al montar el componente, se llama a la función para obtener los equipos desde el backend
  useEffect(() => {
    getEquipments();
  }, []);

  // Efecto de depuración para ver los equipos filtrados cada vez que cambian
  useEffect(() => {
    console.log("Filtered Equipments:", equipments);
  }, [equipments]);

  // Filtra los equipos según el nombre y el estado de disponibilidad
  const filteredEquipments = equipments.filter((equipment) => {
    // Filtrado por nombre (insensible a mayúsculas/minúsculas)
    const matchesName = equipment.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filtrado por disponibilidad
    const matchesAvailability =
      availabilityFilter === "all"
        ? true
        : availabilityFilter === "available"
        ? equipment.status === "available"
        : equipment.status !== "available";

    return matchesName && matchesAvailability;
  });

  return (
    <div className="container mx-auto p-4">
      {/* Filtros: búsqueda por nombre y filtro por disponibilidad */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-md bg-zinc-800 text-white w-full md:w-1/2"
        />

        {/* Select para filtrar por estado */}
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="px-4 py-2 rounded-md bg-zinc-800 text-white w-full md:w-1/2"
        >
          <option value="all">Todos</option>
          <option value="available">Disponibles</option>
          <option value="unavailable">No disponibles</option>
        </select>
      </div>

      {/* Grid de equipos filtrados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Si hay equipos filtrados, se muestran en tarjetas */}
        {filteredEquipments.length > 0 ? (
          filteredEquipments.map((equipment) => (
            <EquipmentCard equipment={equipment} key={equipment._id} />
          ))
        ) : (
          // Mensaje si no hay equipos que coincidan con los filtros
          <p className="text-white col-span-full text-center">
            No se encontraron equipos con esos filtros.
          </p>
        )}
      </div>
    </div>
  );
}

export default EquipmentPage;

import { useEffect, useState } from "react";
import { useEquipments } from "../context/EquipmentsContext";
import EquipmentCard from "../components/EquipmentCard/EquipmentCard";

function EquipmentPage() {
  const { getEquipments, equipments } = useEquipments();

  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  useEffect(() => {
    getEquipments();
  }, []);

  useEffect(() => {
    console.log("Filtered Equipments:",equipments);
  }, [equipments]);

  const filteredEquipments = equipments.filter((equipment) => {
    const matchesName = equipment.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

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
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-md bg-zinc-800 text-white w-full md:w-1/2"
        />

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredEquipments.length > 0 ? (
          filteredEquipments.map((equipment) => (
            <EquipmentCard equipment={equipment} key={equipment._id} />
          ))
        ) : (
          <p className="text-white col-span-full text-center">
            No se encontraron equipos con esos filtros.
          </p>
        )}
      </div>
    </div>
  );
}

export default EquipmentPage;

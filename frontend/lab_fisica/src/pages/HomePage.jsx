import { useEffect } from "react";
import { useEquipments } from "../context/EquipmentsContext"; // Hook personalizado para acceder al contexto de equipos
import EquipmentCard from "../components/EquipmentCard/EquipmentCard"; // Componente que representa visualmente un equipo

function HomePage() {
  // Obtiene el array de equipos y la función para traer los equipos del backend
  const { equipments, getEquipments } = useEquipments();

  // Efecto que se ejecuta al montar el componente para cargar los equipos
  useEffect(() => {
    getEquipments(); // Llama a la función del contexto para obtener los datos de los equipos
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Grid responsiva para mostrar los equipos */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {/* Itera sobre el array de equipos y renderiza un componente por cada uno */}
          {equipments.map((equipment) => (
            <EquipmentCard equipment={equipment} key={equipment._id} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomePage;


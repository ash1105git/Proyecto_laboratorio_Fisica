import { useEffect } from "react";
import { useEquipments } from "../context/EquipmentsContext";
import EquipmentCard from "../components/EquipmentCard/EquipmentCard";

function HomePage() {
  const { equipments, getEquipments } = useEquipments();

  useEffect(() => {
    getEquipments();
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
       
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {equipments.map((equipment) => (
            <EquipmentCard equipment={equipment} key={equipment._id} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomePage;

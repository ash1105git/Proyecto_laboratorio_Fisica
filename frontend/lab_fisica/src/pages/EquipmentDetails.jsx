import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEquipments } from "../context/EquipmentsContext";
import { useLoanCart } from "../context/loanContext";

function EquipmentDetailPage() {
  const { id } = useParams();
  const { equipments } = useEquipments();
  const [equipment, setEquipment] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useLoanCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (equipments.length > 0) {
      const found = equipments.find(eq => eq._id === id);
      if (found) setEquipment(found);
      setLoading(false);
    }
  }, [equipments, id]);

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= equipment.quantity) {
      addToCart(equipment, quantity);
      alert(`Añadido ${quantity} unidad(es) de ${equipment.name} al préstamo.`);
    } else {
      alert(`Cantidad inválida. Debe ser entre 1 y ${equipment.quantity}`);
    }
  };

  if (loading) 
    return (
      <div className="flex justify-center items-center h-64 text-[#013B48] font-semibold animate-pulse">
        Cargando equipo...
      </div>
    );

  if (!equipment) 
    return (
      <div className="text-center text-red-600 font-semibold mt-10">
        Equipo no encontrado.
      </div>
    );

  const baseURL = "http://localhost:4000/";
  const cleanImageUrl = equipment.imageUrl ? equipment.imageUrl.replace(/\\/g, "/") : "";
  const imageSrc = cleanImageUrl ? baseURL + cleanImageUrl : "https://cdn.tailgrids.com/assets/images/application/cards/card-01/image-01.jpg";

  return (
    <div className="container mx-auto p-6 bg-[#D9D9D9] rounded shadow my-6 max-w-3xl text-[#003B49] font-sans">
      <h2 className="text-4xl font-bold mb-6 text-center text-[#013B48]">{equipment.name}</h2>

      <div className="flex flex-col items-center">
        <img 
          src={imageSrc} 
          alt={equipment.name} 
          className="w-full max-w-md rounded-lg shadow-md mb-6 border border-[#BFA8F3]"
          loading="lazy"
        />

        <p className="mb-2"><strong>Descripción:</strong> {equipment.description}</p>
        <p className="mb-2">
          <strong>Estado:</strong> {equipment.status === "available" ? (
            <span className="text-green-600 font-semibold">Disponible</span>
          ) : (
            <span className="text-red-600 font-semibold">No disponible</span>
          )}
        </p>
        <p className="mb-6"><strong>Cantidad disponible:</strong> {equipment.quantity}</p>

        <label className="block mb-4 w-40">
          <span className="block mb-1 font-semibold">Cantidad a añadir:</span>
          <input
            type="number"
            min="1"
            max={equipment.quantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-[#013B48] rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#3CDB85]"
          />
        </label>

        <button
          onClick={handleAddToCart}
          className="bg-[#3CDB85] text-[#013B48] font-bold px-6 py-3 rounded shadow-md hover:bg-[#BFA8F3] transition-colors duration-300"
        >
          Añadir al préstamo
        </button>
      </div>
    </div>
  );
}

export default EquipmentDetailPage;

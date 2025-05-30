import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEquipments } from "../context/EquipmentsContext"; // Hook personalizado para acceder a los equipos
import { useLoanCart } from "../context/loanContext"; // Hook personalizado para manejar el carrito de préstamos

function EquipmentDetailPage() {
  // Extrae el ID del equipo desde la URL
  const { id } = useParams();

  // Obtiene la lista de equipos desde el contexto global
  const { equipments } = useEquipments();

  // Estado para el equipo actual seleccionado
  const [equipment, setEquipment] = useState(null);
  // Estado para la cantidad que se quiere añadir al préstamo
  const [quantity, setQuantity] = useState(1);
  // Función para añadir al carrito desde el contexto
  const { addToCart } = useLoanCart();
  // Estado de carga para mostrar mensaje mientras se obtiene el equipo
  const [loading, setLoading] = useState(true);

  // Efecto que se ejecuta cuando se carga la lista de equipos o cambia el ID
  useEffect(() => {
    if (equipments.length > 0) {
      // Busca el equipo por su ID
      const found = equipments.find(eq => eq._id === id);
      if (found) setEquipment(found); // Si lo encuentra, lo guarda en el estado
      setLoading(false); // Desactiva la carga
    }
  }, [equipments, id]);

  // Maneja el clic en el botón para añadir al carrito
  const handleAddToCart = () => {
    // Validación: solo se permite añadir cantidades entre 1 y el máximo disponible
    if (quantity > 0 && quantity <= equipment.quantity) {
      addToCart(equipment, quantity); // Añade el equipo y cantidad al carrito
      alert(`Añadido ${quantity} unidad(es) de ${equipment.name} al préstamo.`);
    } else {
      alert(`Cantidad inválida. Debe ser entre 1 y ${equipment.quantity}`);
    }
  };

  // Muestra mensaje de carga si los datos aún no están disponibles
  if (loading) 
    return (
      <div className="flex justify-center items-center h-64 text-[#013B48] font-semibold animate-pulse">
        Cargando equipo...
      </div>
    );

  // Muestra mensaje de error si el equipo no fue encontrado
  if (!equipment) 
    return (
      <div className="text-center text-red-600 font-semibold mt-10">
        Equipo no encontrado.
      </div>
    );

  // Construye la URL de la imagen desde el servidor
  const baseURL = "http://localhost:4000/";
  const cleanImageUrl = equipment.imageUrl ? equipment.imageUrl.replace(/\\/g, "/") : "";
  const imageSrc = cleanImageUrl ? baseURL + cleanImageUrl : "https://cdn.tailgrids.com/assets/images/application/cards/card-01/image-01.jpg";

  return (
    <div className="container mx-auto p-6 bg-[#D9D9D9] rounded shadow my-6 max-w-3xl text-[#003B49] font-sans">
      {/* Nombre del equipo */}
      <h2 className="text-4xl font-bold mb-6 text-center text-[#013B48]">{equipment.name}</h2>

      <div className="flex flex-col items-center">
        {/* Imagen del equipo */}
        <img 
          src={imageSrc} 
          alt={equipment.name} 
          className="w-full max-w-md rounded-lg shadow-md mb-6 border border-[#BFA8F3]"
          loading="lazy"
        />

        {/* Descripción del equipo */}
        <p className="mb-2"><strong>Descripción:</strong> {equipment.description}</p>

        {/* Estado del equipo */}
        <p className="mb-2">
          <strong>Estado:</strong> {equipment.status === "available" ? (
            <span className="text-green-600 font-semibold">Disponible</span>
          ) : (
            <span className="text-red-600 font-semibold">No disponible</span>
          )}
        </p>

        {/* Cantidad disponible */}
        <p className="mb-6"><strong>Cantidad disponible:</strong> {equipment.quantity}</p>

        {/* Input para seleccionar cuántas unidades añadir al préstamo */}
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

        {/* Botón para añadir al carrito */}
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

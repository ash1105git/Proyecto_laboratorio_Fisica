import { useEquipments } from "../../context/EquipmentsContext";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


function EquipmentCard({ equipment }) {
  const { deleteEquipment } = useEquipments();
  const { user } = useAuth();

   const cleanImageUrl = equipment.imageUrl ? equipment.imageUrl.replace(/\\/g, "/") : "";
  const baseURL = "http://localhost:4000/";
  const imageSrc = cleanImageUrl ? baseURL + cleanImageUrl : "https://cdn.tailgrids.com/assets/images/application/cards/card-01/image-01.jpg";

  return (
    <div className="mb-10 overflow-hidden rounded-3xl bg-white shadow-1 duration-300 hover:shadow-3 dark:bg-dark-2 dark:shadow-card dark:hover:shadow-3">
      {/* Imagen genérica, puedes personalizarla por tipo de equipo si quieres */}
      <img
        src={imageSrc}
        alt={equipment.name}
        className="w-full"
      />
      <div className="p-8 text-center sm:p-9 md:p-7 xl:p-9">
        <h3>
            <Link to={`/equipment/${equipment._id}`} >  
      <h2 className=" font-bold text-black mb-2">{equipment.name}</h2>
    </Link>
        </h3>
       
       
        <p
          className={`text-sm font-medium mt-1 ${
            equipment.status === "available" ? "text-green-500" : "text-red-500"
          }`}
        >
          Estado: {equipment.status === "available" ? "Disponible" : "No disponible"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Cantidad: {equipment.quantity}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Creado: {new Date(equipment.createdAt).toLocaleDateString()}
        </p>

        { /* Botones de acción para editar y eliminar el equipo */}
        {user?.typeUser === "admin" &&(

        <div className="mt-6 flex justify-center gap-4">
          <Link
            to={`/equipments/${equipment._id}`}
            className="inline-block rounded-full border border-gray-3 px-5 py-2 text-sm font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-white"
          >
            Editar
          </Link>

          <button
            onClick={() => deleteEquipment(equipment._id)}
            className="inline-block rounded-full border border-red-500 px-5 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
          >
            Eliminar
          </button>
        </div>
        )}
      </div>
    </div>
  );
}

export default EquipmentCard;

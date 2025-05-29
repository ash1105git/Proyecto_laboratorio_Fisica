import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useEquipments } from "../context/EquipmentsContext";
import { useNavigate, useParams } from "react-router-dom";

function CreateEquipment() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const { addEquipment, getEquipment, updateEquipment } = useEquipments();
  const navigate = useNavigate();
  const params = useParams();

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    async function loadEquipment() {
      if (params.id) {
        const equipment = await getEquipment(params.id);
        setValue("name", equipment.name);
        setValue("description", equipment.description);
        setValue("code_equipment", equipment.code_equipment);
        setValue("status", equipment.status);
        setValue("quantity", equipment.quantity);
        setValue("imageUrl", equipment.imageUrl || "");
        if (equipment.imageUrl) setImagePreview(equipment.imageUrl);
      }
    }
    loadEquipment();
  }, [params.id, setValue]);

  const imageFile = watch("imageFile");

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("code_equipment", data.code_equipment);
    formData.append("status", data.status);
    formData.append("quantity", data.quantity);

    if (data.imageFile && data.imageFile.length > 0) {
      formData.append("image", data.imageFile[0]);
    }

    try {
      console.log("FormData content:");
for (let pair of formData.entries()) {
  console.log(pair[0] + ':', pair[1]);
}

      if (params.id) {
        await updateEquipment(params.id, formData);
      } else {
        await addEquipment(formData);
      }
      navigate("/equipments");
    } catch (error) {
      console.error("Error al crear/actualizar equipo:", error);
    }
  });

  return (
    <div className="container mx-auto p-6 bg-[#D9D9D9] shadow-lg rounded-lg max-w-xl my-2">
      <h1 className="text-3xl font-bold mb-6 text-[#013B48] select-none">Crear Equipo</h1>
      <form onSubmit={onSubmit} encType="multipart/form-data" className="space-y-4">
        <label className="block text-[#013B48] font-semibold" htmlFor="name">
          Nombre del equipo
        </label>
        <input
          type="text"
          placeholder="Nombre del equipo"
          {...register("name")}
          className="w-full p-3 border border-[#013B48] rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-[#3CDB85] transition"
          autoFocus
        />

        <label className="block text-[#013B48] font-semibold" htmlFor="description">
          Descripción del equipo
        </label>
        <textarea
          placeholder="Descripción del equipo"
          {...register("description")}
          className="w-full p-3 border border-[#013B48] rounded-md mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#3CDB85] transition"
          rows={4}
        />

        <label className="block text-[#013B48] font-semibold" htmlFor="code_equipment">
          Código del equipo
        </label>
        <input
          type="text"
          placeholder="Código del equipo"
          {...register("code_equipment")}
          className="w-full p-3 border border-[#013B48] rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-[#3CDB85] transition"
        />

        <label className="block text-[#013B48] font-semibold" htmlFor="status">
          Estado del equipo
        </label>
        <select
          {...register("status")}
          className="w-full p-3 border border-[#013B48] rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-[#3CDB85] transition"
        >
          <option value="available">Disponible</option>
          <option value="unavailable">No disponible</option>
        </select>

        <label className="block text-[#013B48] font-semibold" htmlFor="quantity">
          Cantidad
        </label>
        <input
  type="number"
  placeholder="Cantidad"
  {...register("quantity", {
    valueAsNumber: true,
    min: {
      value: 0,
      message: "La cantidad no puede ser negativa",
    },
    required: "La cantidad es obligatoria",
  })}
  className="w-full p-2 border border-gray-300 rounded-md mb-4"
/>


        <input
          type="file"
          id="file-input"
          accept="image/*"
          className="hidden"
          {...register("imageFile")}
        />

        <button
          type="button"
          onClick={() => document.getElementById("file-input").click()}
          className="bg-[#3CDB85] text-[#013B48] font-semibold px-6 py-2 rounded-md mb-4 hover:bg-[#2bb06c] transition duration-300 ease-in-out shadow-md"
        >
          Cargar Imagen 📷 
        </button>

        {imagePreview && (
          <div className="my-4 border border-[#013B48] rounded-md p-2 bg-[#F2F2F2] shadow-inner transition-opacity duration-500 ease-in-out">
            <p className="font-semibold text-[#013B48] mb-2 select-none">Imagen seleccionada:</p>
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-xs max-h-48 rounded-md object-contain mx-auto shadow-lg"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#013B48] text-[#F2F2F2] font-bold p-3 rounded-md hover:bg-[#3CDB85] hover:text-[#013B48] transition duration-300 ease-in-out shadow-lg"
        >
          {params.id ? "Actualizar Equipo" : "Crear Equipo"}
        </button>
      </form>
    </div>
  );
}

export default CreateEquipment;

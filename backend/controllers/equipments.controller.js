import Equipment from "../models/equipment.model.js";


export const getEquipments = async (req, res) => {
  try {
    let equipments;
    
    // Si hay usuario autenticado, filtra por usuario
    if (req.user) {
      equipments = await Equipment.find({ user: req.user.id });
    } else {
      // Si no hay usuario, muestra todos
      equipments = await Equipment.find();
    }

    res.json(equipments);
  } catch (error) {
    console.error("Error al obtener equipos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

import multer from "multer";
const upload = multer({ dest: "uploads/" }); // o configuración que uses

export const createEquipment = async (req, res) => {
  console.log("Creating equipment with data:", req.body);
  console.log("Uploaded file:", req.file);
  try {
    const { name, description, code_equipment, status, quantity } = req.body;

    if (!name || !description || !code_equipment || !status || !quantity === undefined || !quantity === "") {      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const imageUrl = req.file ? req.file.path : "";

    const newEquipment = new Equipment({
      name,
      description,
      code_equipment,
      status,
      quantity: Number(quantity), // conviene asegurar que es número
      user: req.user.id,
      imageUrl,
    });

    const savedEquipment = await newEquipment.save();
    res.status(201).json(savedEquipment);
  } catch (error) {
    console.error("Error creating equipment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, code_equipment, status, quantity, imageUrl } = req.body;

    if (!name || !description || !code_equipment || !status || quantity === undefined || quantity === "  ") {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const updatedEquipment = await Equipment.findByIdAndUpdate(
      id,
      { name, description, code_equipment, status, quantity, user, imageUrl },
      { new: true }
    );

    if (!updatedEquipment) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    res.json(updatedEquipment);
  } catch (error) {
    console.error("Error actualizando equipo:", error);
    res.status(500).json({ message: "Equipment update failed" });
  }
};

export const deleteEquipment = async (req, res) => {
   try {
     const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
    }
    res.json({ message: "Equipment deleted successfully" });
   } catch (error) {
       console.error("Error deleting equipment:", error);
       res.status(500).json({ message: "Internal server error" });
   }
}

export const getEquipmentById = async (req, res) => {
   const equipment = await Equipment.findById(req.params.id);
   if (!equipment) {
       return res.status(404).json({ message: "Equipment not found" });
   }
   res.json(equipment);
}
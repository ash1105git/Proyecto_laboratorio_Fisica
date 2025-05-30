import Equipment from "../models/equipment.model.js";
import multer from "multer";

// Configuración de multer para subir archivos (imágenes, por ejemplo)
const upload = multer({ dest: "uploads/" });

/**
 * Obtener todos los equipos registrados.
 * Si el usuario está autenticado, devuelve solo sus equipos.
 * De lo contrario, devuelve todos los equipos del sistema.
 */
export const getEquipments = async (req, res) => {
  try {
    let equipments;

    // Verifica si hay un usuario autenticado
    if (req.user) {
      equipments = await Equipment.find({ user: req.user.id });
    } else {
      equipments = await Equipment.find();
    }

    res.json(equipments);
  } catch (error) {
    console.error("Error al obtener equipos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Crear un nuevo equipo.
 * Requiere: name, description, code_equipment, status, quantity.
 * También puede incluir una imagen mediante `req.file`.
 */
export const createEquipment = async (req, res) => {
  console.log("Creating equipment with data:", req.body);
  console.log("Uploaded file:", req.file);

  try {
    const { name, description, code_equipment, status, quantity } = req.body;

    // Validar campos obligatorios
    if (!name || !description || !code_equipment || !status || quantity === undefined || quantity === "") {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Ruta de la imagen cargada (si existe)
    const imageUrl = req.file ? req.file.path : "";

    // Crear instancia del equipo
    const newEquipment = new Equipment({
      name,
      description,
      code_equipment,
      status,
      quantity: Number(quantity), // Asegura que quantity sea numérico
      user: req.user.id,
      imageUrl,
    });

    // Guardar en la base de datos
    const savedEquipment = await newEquipment.save();
    res.status(201).json(savedEquipment);
  } catch (error) {
    console.error("Error creating equipment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Actualizar un equipo existente por su ID.
 * Requiere: name, description, code_equipment, status, quantity.
 */
export const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, code_equipment, status, quantity, imageUrl } = req.body;

    // Validación de campos requeridos
    if (!name || !description || !code_equipment || !status || quantity === undefined || quantity.trim() === "") {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Falta: asegurar que `user` esté definido si se quiere actualizar
    // Nota: En esta línea falta pasar el campo `user`, pero no está definido en este contexto
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      id,
      { name, description, code_equipment, status, quantity, imageUrl },
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

/**
 * Eliminar un equipo por su ID.
 */
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
};

/**
 * Obtener un equipo específico por su ID.
 */
export const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

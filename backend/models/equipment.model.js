import mongoose from "mongoose";

/**
 * Esquema para representar un equipo en el sistema.
 * 
 * Campos:
 * - name: Nombre del equipo. Obligatorio.
 * - description: Descripción del equipo. Obligatorio.
 * - code_equipment: Código único que identifica el equipo. Obligatorio y único.
 * - status: Estado del equipo, puede ser 'available' o 'unavailable'. Por defecto es 'available'.
 * - quantity: Cantidad disponible del equipo. Obligatorio, por defecto 0.
 * - user: Referencia al usuario (objeto ObjectId) que registra o posee el equipo. Obligatorio.
 * - imageUrl: URL de la imagen asociada al equipo. Opcional.
 * 
 * El esquema incluye timestamps para registrar fechas de creación y modificación.
 */
const equipmentSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code_equipment: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        enum: ['available', 'unavailable'],
        default: 'available'
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    imageUrl: {
      type: String,
    },

  },
  { timestamps: true }
);

export default mongoose.model("Equipment", equipmentSchema);

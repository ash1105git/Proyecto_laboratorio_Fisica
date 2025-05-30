import mongoose from "mongoose";
import Loan from "./loan.model.js"; // Relación con el préstamo

/**
 * Esquema para representar un recibo asociado a un préstamo.
 * 
 * Campos:
 * - id_loan: Referencia al préstamo para el cual se genera el recibo. Obligatorio.
 * - date_generated: Fecha en la que se generó el recibo. Obligatorio.
 * - total_equipment: Número total de equipos prestados en este préstamo. Obligatorio.
 * 
 * Incluye timestamps para las fechas de creación y actualización del documento.
 */
const receiptSchema = new mongoose.Schema(
  {
    id_loan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan",
        required: true
    },
    date_generated: {
        type: Date,
        required: true
    },
    total_equipment: {
        type: Number,
        required: true
    },
  },
  { timestamps: true }
);

const Receipt = mongoose.model("Receipt", receiptSchema);
export default Receipt;

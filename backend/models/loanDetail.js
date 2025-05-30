import mongoose from "mongoose";
import Loan from "./loan.model.js"; // Relación con el préstamo
import Equipment from "./equipment.model.js"; // Relación con el equipo

/**
 * Esquema para representar los detalles específicos de un préstamo.
 * 
 * Cada documento indica qué equipo y en qué cantidad forma parte de un préstamo.
 * 
 * Campos:
 * - id_loan: Referencia al préstamo asociado. Obligatorio.
 * - id_equipment: Referencia al equipo prestado. Obligatorio.
 * - quantity: Cantidad de unidades de ese equipo que se están prestando. Obligatorio.
 * 
 * El esquema incluye timestamps para registrar fechas de creación y actualización.
 */
const loanDetailSchema = new mongoose.Schema(
  {
    id_loan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan",
        required: true
    },
    id_equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Equipment",
        required: true
    },
    quantity: { 
        type: Number,
        required: true
    },
  },
  { timestamps: true }
);

const LoanDetail = mongoose.model("LoanDetail", loanDetailSchema);
export default LoanDetail;

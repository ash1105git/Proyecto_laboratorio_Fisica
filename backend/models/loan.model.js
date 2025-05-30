import mongoose from "mongoose";
import User from "./user.model.js"; // Relación con el usuario
import Equipment from "./equipment.model.js"; // Relación con el equipo

/**
 * Esquema para representar un préstamo de equipos.
 * 
 * Campos:
 * - id_user: Referencia al usuario que realiza el préstamo. Obligatorio.
 * - date_loan: Fecha en que se realiza el préstamo. Obligatorio.
 * - date_due: Fecha límite para la devolución del equipo. Obligatorio.
 * - date_returned: Fecha en que se devolvió el equipo. Opcional.
 * - status: Estado del préstamo, puede ser:
 *    - 'pending' (pendiente),
 *    - 'approved' (aprobado),
 *    - 'rejected' (rechazado),
 *    - 'returned' (devuelto).
 *   Por defecto es 'pending'.
 * - details: Arreglo con referencias a los detalles del préstamo (por ejemplo, qué equipos y cantidades). 
 * - evidenceImage: Ruta o URL de la imagen que evidencia el préstamo. Opcional.
 * 
 * El esquema incluye timestamps para registrar fechas de creación y actualización.
 */
const loanSchema = new mongoose.Schema(
  {
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date_loan: {
        type: Date,
        required: true
    },
    date_due: {
        type: Date,
        required: true
    },
    
    date_returned: {
        type: Date
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'returned'],
      default: 'pending',
    },
 
    details: [  
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LoanDetail"
      }
    ],
    evidenceImage: String,
  },
  { timestamps: true }
);

const Loan = mongoose.model("Loan", loanSchema);
export default Loan;

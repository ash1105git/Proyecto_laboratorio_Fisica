import mongoose from "mongoose";
import Loan from "./loan.model.js"; // Relación con el préstamo
import Equipment from "./equipment.model.js"; // Relación con el equipo

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

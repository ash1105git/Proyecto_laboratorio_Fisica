import mongoose from "mongoose";
import Loan from "./loan.model.js"; // Relación con el préstamo

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

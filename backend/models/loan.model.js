import mongoose from "mongoose";
import User from "./user.model.js"; // Relación con el usuario
import Equipment from "./equipment.model.js"; // Relación con el equipo

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

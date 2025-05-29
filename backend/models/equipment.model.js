import mongoose from "mongoose";

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

import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    documento: {
        type: String,
        required: true
    },
    programa: {
    type: String,
    required: function () {
      return this.typeUser === 'student';
    }
  },
    typeUser: {
        type: String,
        required: true,
        enum: ['admin', 'student', 'professor'],
        default: 'student'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model("User", userSchema)
// export default mongoose.model("User", userSchema);
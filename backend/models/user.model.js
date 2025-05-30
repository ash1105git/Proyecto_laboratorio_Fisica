import mongoose from "mongoose";

/**
 * Esquema para representar un usuario en el sistema.
 * 
 * Campos:
 * - username: Nombre de usuario único y obligatorio, sin espacios al inicio o final.
 * - lastName: Apellido del usuario, obligatorio y sin espacios al inicio o final.
 * - documento: Documento de identificación obligatorio.
 * - programa: Programa académico obligatorio solo si el tipo de usuario es 'student'.
 * - typeUser: Tipo de usuario, obligatorio, solo puede ser 'admin', 'student' o 'professor'. Por defecto es 'student'.
 * - email: Correo electrónico único, obligatorio, sin espacios al inicio o final.
 * - password: Contraseña del usuario, obligatoria.
 * 
 * Incluye timestamps para registrar fecha de creación y actualización.
 */
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
});

export default mongoose.model("User", userSchema);

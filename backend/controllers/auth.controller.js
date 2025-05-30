import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

/**
 * Registra un nuevo usuario en la base de datos.
 * - Valida si el correo ya está en uso.
 * - Verifica si el usuario es estudiante y requiere el campo `programa`.
 * - Cifra la contraseña.
 * - Guarda el usuario y crea un token JWT.
 * - Devuelve los datos del usuario creado.
 *
 * @param {import('express').Request} req - Objeto de solicitud con los datos del usuario.
 * @param {import('express').Response} res - Objeto de respuesta para enviar la respuesta al cliente.
 */
export const register = async (req, res) => {
    const { username, lastName, documento, typeUser, programa, email, password } = req.body;

    try {
        const userFound = await User.findOne({ email });
        if (userFound) 
            return res.status(400).json({ errors: ["this email is already in use"] });

        if (typeUser === "student" && !programa) {
            return res.status(400).json({ message: "El programa es obligatorio para estudiantes." });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            lastName,
            documento,
            typeUser,
            programa: typeUser === "student" ? programa : null,
            email,
            password: passwordHash
        });

        const userSaved = await newUser.save();

        const token = await createAccessToken({
            id: userSaved._id,
            typeUser: userSaved.typeUser
        });

        res.cookie('token', token);
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            lastName: userSaved.lastName,
            documento: userSaved.documento,
            typeUser: userSaved.typeUser,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
        });

    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).json({
            message: "Error al registrar el usuario",
            error: error.message,
        });
    }
};

/**
 * Inicia sesión de usuario.
 * - Verifica si el usuario existe.
 * - Compara la contraseña proporcionada con la almacenada.
 * - Crea y envía un token JWT.
 *
 * @param {import('express').Request} req - Solicitud HTTP con email y contraseña.
 * @param {import('express').Response} res - Respuesta HTTP con token y datos del usuario.
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch)
            return res.status(401).json({ message: "Incorrect password" });

        const token = await createAccessToken({
            id: userFound._id,
            typeUser: userFound.typeUser,
        });

        res.cookie('token', token);
        res.json({
            id: userFound._id,
            username: userFound.username,
            lastName: userFound.lastName,
            typeUser: userFound.typeUser,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error logging in",
            error: error.message,
        });
    }
};

/**
 * Cierra la sesión del usuario.
 * - Elimina la cookie del token.
 *
 * @param {import('express').Request} req - Solicitud HTTP.
 * @param {import('express').Response} res - Respuesta HTTP con estado 200.
 */
export const logout = async (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0),
    });
    return res.sendStatus(200);
};

/**
 * Obtiene el perfil del usuario autenticado.
 * - Requiere que `req.user` esté presente.
 * - Devuelve los datos públicos del usuario.
 *
 * @param {import('express').Request} req - Solicitud HTTP con el ID del usuario autenticado.
 * @param {import('express').Response} res - Respuesta HTTP con datos del perfil del usuario.
 */
export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id);

    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
    });
};

/**
 * Verifica la validez del token JWT desde la cookie.
 * - Si el token es válido y el usuario existe, devuelve los datos del usuario.
 * - Si es inválido o el usuario no existe, responde con error.
 *
 * @param {import('express').Request} req - Solicitud HTTP con cookie de token.
 * @param {import('express').Response} res - Respuesta HTTP con los datos del usuario autenticado.
 */
export const verifyToken = async (req, res) => {
    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });

        const userFound = await User.findById(user.id);
        if (!userFound) return res.status(400).json({ message: "Unauthorized" });

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            typeUser: userFound.typeUser
        });
    });
};

import { Router } from "express";
import { 
    login, 
    register, 
    logout, 
    profile,
    verifyToken
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import validateRequest from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router();

/**
 * Rutas de autenticación para el sistema:
 * 
 * POST /register
 * - Registra un nuevo usuario.
 * - Valida los datos con registerSchema.
 * - Usa validateRequest para manejar errores de validación.
 * - Llama al controlador register para procesar el registro.
 * 
 * POST /login
 * - Inicia sesión con usuario y contraseña.
 * - Valida los datos con loginSchema.
 * - Usa validateRequest para manejar errores de validación.
 * - Llama al controlador login para procesar el inicio de sesión.
 * 
 * POST /logout
 * - Cierra sesión del usuario actual.
 * - Llama al controlador logout.
 * 
 * GET /verify
 * - Verifica la validez del token JWT.
 * - Llama al controlador verifyToken.
 * 
 * GET /profile
 * - Obtiene los datos del perfil del usuario autenticado.
 * - Ruta protegida con authRequired (requiere token válido).
 * - Llama al controlador profile.
 */

router.post("/register", registerSchema, validateRequest, register);

router.post("/login", loginSchema, validateRequest, login);

router.post("/logout", logout);

router.get("/verify", verifyToken);

router.get("/profile", authRequired, profile);

export default router;

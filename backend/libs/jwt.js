import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

/**
 * Crea un token JWT con el payload dado que expira en 1 día.
 * @param {Object} payload - Datos a incluir en el token (ej. id de usuario, rol).
 * @returns {Promise<string>} - Promise que resuelve con el token JWT generado.
 * @throws {Error} - Si ocurre un error durante la generación del token.
 */
export function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            TOKEN_SECRET,
            {
                expiresIn: "1d",  // Duración del token: 1 día
            },
            (err, token) => {
                if (err) reject(err);
                else resolve(token);
            }
        );
    });
}

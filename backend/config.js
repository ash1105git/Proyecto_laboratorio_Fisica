// Archivo: config.js

/**
 * TOKEN_SECRET
 * 
 * Clave secreta utilizada para firmar y verificar los tokens JWT.
 * Es recomendable que esta clave sea larga, aleatoria y almacenada
 * de forma segura (por ejemplo, en variables de entorno).
 * 
 * Para producción, NO hardcodear la clave aquí, sino usar:
 * process.env.TOKEN_SECRET
 */
export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const PORT = process.env.PORT || 4000;


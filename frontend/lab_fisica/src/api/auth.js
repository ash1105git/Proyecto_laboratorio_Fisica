import axios from './axios'; 

/**
 * Envía una solicitud para registrar un nuevo usuario.
 * @param {Object} user - Objeto con los datos del usuario a registrar.
 * @returns {Promise} Respuesta de la solicitud HTTP POST a 'register'.
 */
export const registerUser = user => axios.post(`register`, user);

/**
 * Envía una solicitud para iniciar sesión con un usuario existente.
 * @param {Object} user - Objeto con los datos del usuario para login.
 * @returns {Promise} Respuesta de la solicitud HTTP POST a 'login'.
 */
export const loginUser = user => axios.post(`login`, user);

/**
 * Envía una solicitud para verificar la validez del token de autenticación.
 * @returns {Promise} Respuesta de la solicitud HTTP GET a '/verify'.
 */
export const verifyTokenRequest = () => axios.get(`/verify`);

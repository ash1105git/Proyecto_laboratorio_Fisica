import axios from "./axios";

/**
 * Obtiene la lista completa de equipos.
 */
export const getEquipmentsRequest = () => axios.get("/equipments");

/**
 * Obtiene un equipo específico por su ID.
 */
export const getEquipmentRequest = (id) => axios.get(`/equipments/${id}`);

/**
 * Crea un nuevo equipo.
 */
export const createEquipmentRequest = (equipment) => axios.post("/equipments", equipment);

/**
 * Actualiza un equipo existente por su ID.
 */
export const updateEquipmentRequest = (id, equipment) => axios.put(`/equipments/${id}`, equipment);

/**
 * Elimina un equipo por su ID.
 * @param {string} id - ID del equipo a eliminar.
 * @returns {Promise} Promise que resuelve con la respuesta de la API.
 */
export const deleteEquipmentRequest = (id) => axios.delete(`/equipments/${id}`);


import axios from "./axios";

export const getEquipmentsRequest = () => axios.get("/equipments");

export const getEquipmentRequest = (id) => axios.get(`/equipments/${id}`);

export const createEquipmentRequest = (equipment) => axios.post("/equipments", equipment)

export const updateEquipmentRequest = (id, equipment) => axios.put(`/equipments/${id}`, equipment);

export const deleteEquipmentRequest = (id) => axios.delete(`/equipments/${id}`);


import axios from './axios'; 



export const registerUser = user => axios.post(`register`, user);

export const loginUser = user => axios.post(`login`, user);

export const verifyTokenRequest = () => axios.get(`/verify`);

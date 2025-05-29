import axios from "../api/axios";


// Crear un préstamo con equipos
export const createLoanRequest = (loanData) => axios.post("/loans", loanData);

export const updateLoanStatusRequest = (Id, data) => 
  axios.patch(`/admin/loans/${loanId}`, { data });


// Más adelante podrías agregar:
// export const getLoansRequest = () => axios.get("/loans");
// export const getLoanRequest = (id) => axios.get(`/loans/${id}`);

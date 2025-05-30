import axios from "../api/axios";


// Crear un préstamo con equipos
export const createLoanRequest = (loanData) => axios.post("/loans", loanData);

export const updateLoanStatusRequest = (loanId, data) => 
  axios.patch(`/admin/loans/${loanId}`, { data });


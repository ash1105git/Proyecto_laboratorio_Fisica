import React, { useState } from "react";
import { useLoanCart } from "../context/loanContext";
import { createLoanRequest } from "../api/loan";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios"; 


const LoanPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useLoanCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateDue, setDateDue] = useState("2025-06-10"); 
  const navigate = useNavigate();

  const handleQuantityChange = (id, value) => {
    const quantity = Number(value);
    if (quantity > 0) {
      updateQuantity(id, quantity);
    }
  };

  const handleConfirmLoan = async () => {
    if (cartItems.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    // Prepara detalles para el backend
    const loanDetails = cartItems.map((item) => ({
      id_equipment: item._id,
      quantity: item.quantity,
    }));

    const loanData = {
      date_loan: new Date().toISOString(),
      date_due: dateDue,
      details: loanDetails,
    };

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/loans', loanData);
    const loanId = response.data.id;

    navigate(`/loans/${loanId}/receipt`);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al crear el préstamo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Carrito de préstamo</h2>
      {cartItems.length === 0 && <p>No hay equipos en el carrito.</p>}

      {cartItems.map((item) => (
        <div key={item._id} style={{ marginBottom: 10 }}>
          <strong>{item.name}</strong> - Stock: {item.quantity} {/* Esto es stock? */}
          <br />
          Cantidad a pedir:{" "}
          <input
            type="number"
            min="1"
            max={item.quantity}
            value={item.quantity}
            onChange={(e) => handleQuantityChange(item._id, e.target.value)}
            style={{ width: 60 }}
          />
          <button onClick={() => removeFromCart(item._id)}>Eliminar</button>
        </div>
      ))}

      <div style={{ marginTop: 20 }}>
        <label>
          Fecha de devolución:{" "}
          <input
            type="date"
            value={dateDue}
            onChange={(e) => setDateDue(e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleConfirmLoan} disabled={loading || cartItems.length === 0} style={{ marginTop: 20 }}>
        {loading ? "Creando préstamo..." : "Confirmar préstamo"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoanPage;

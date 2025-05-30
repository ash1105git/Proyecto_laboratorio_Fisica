import React, { useState } from "react";
import { useLoanCart } from "../context/loanContext"; // Hook personalizado que gestiona el carrito de préstamos
import { createLoanRequest } from "../api/loan"; // (Importación no utilizada actualmente)
import { useNavigate } from "react-router-dom"; // Para redireccionar después de crear el préstamo
import axios from "../api/axios"; // Instancia de Axios con configuración predefinida

const LoanPage = () => {
  // Hook del contexto que provee los equipos del carrito y funciones para manipularlo
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useLoanCart();

  // Estado para controlar carga, errores y fecha de devolución
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateDue, setDateDue] = useState("2025-06-10"); // Fecha predeterminada
  const navigate = useNavigate(); // Hook para navegación programática

  // Cambiar cantidad de un equipo en el carrito
  const handleQuantityChange = (id, value) => {
    const quantity = Number(value);
    if (quantity > 0) {
      updateQuantity(id, quantity);
    }
  };

  // Confirmar y enviar el préstamo
  const handleConfirmLoan = async () => {
    if (cartItems.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    // Preparar los detalles del préstamo
    const loanDetails = cartItems.map((item) => ({
      id_equipment: item._id,
      quantity: item.quantity,
    }));

    // Datos a enviar al backend
    const loanData = {
      date_loan: new Date().toISOString(),
      date_due: dateDue,
      details: loanDetails,
    };

    try {
      setLoading(true);
      setError(null);

      // Enviar solicitud de préstamo al backend
      const response = await axios.post('/loans', loanData);
      const loanId = response.data.id; // ID del préstamo creado

      navigate(`/loans/${loanId}/receipt`); // Redirigir al recibo del préstamo
      clearCart(); // Vaciar el carrito después de crear el préstamo
    } catch (err) {
      // Mostrar errores si falla la solicitud
      setError(err.response?.data?.message || err.message || "Error al crear el préstamo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Carrito de préstamo</h2>

      {/* Mostrar mensaje si no hay equipos en el carrito */}
      {cartItems.length === 0 && <p>No hay equipos en el carrito.</p>}

      {/* Listar equipos en el carrito */}
      {cartItems.map((item) => (
        <div key={item._id} style={{ marginBottom: 10 }}>
          <strong>{item.name}</strong> - Stock: {item.quantity} {/* Este campo puede estar mal interpretado si se refiere a stock */}
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

      {/* Fecha de devolución */}
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

      {/* Botón para confirmar préstamo */}
      <button
        onClick={handleConfirmLoan}
        disabled={loading || cartItems.length === 0}
        style={{ marginTop: 20 }}
      >
        {loading ? "Creando préstamo..." : "Confirmar préstamo"}
      </button>

      {/* Mostrar errores si existen */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoanPage;


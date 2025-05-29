import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";  // Ajusta la ruta según tu estructura

function AcceptLoan() {
  const { id } = useParams(); // id del préstamo
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!photo) {
    setError("Por favor selecciona una foto");
    return;
  }

  const formData = new FormData();
formData.append("photo", file); // donde `file` es el archivo seleccionado
await axios.patch(`/loans/${loanId}/approve`, formData, {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  },
});

  }



  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Aceptar Préstamo #{id}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="photo" className="block font-semibold mb-1">Foto de los equipos prestados:</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Subiendo..." : "Aceptar préstamo"}
        </button>
      </form>
    </div>
  );
}

export default AcceptLoan;

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios"; // Instancia personalizada de Axios para peticiones al backend

function AcceptLoan() {
  // Extrae el ID del préstamo desde la URL
  const { id } = useParams(); 
  const navigate = useNavigate(); // Hook para redirigir al usuario después de aceptar el préstamo

  // Estado para guardar la imagen seleccionada
  const [photo, setPhoto] = useState(null);
  // Estado para manejar mensajes de error
  const [error, setError] = useState(null);
  // Estado para indicar si se está subiendo la imagen
  const [loading, setLoading] = useState(false);

  // Maneja el cambio de archivo cuando el usuario selecciona una imagen
  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  // Maneja el envío del formulario para aceptar el préstamo
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación: se debe seleccionar una foto antes de enviar
    if (!photo) {
      setError("Por favor selecciona una foto");
      return;
    }

    setLoading(true); // Activa el estado de carga
    setError(null);   // Limpia cualquier error anterior

    try {
      // Crea un FormData para enviar la imagen
      const formData = new FormData();
      formData.append("photo", photo); // Agrega la imagen seleccionada al cuerpo de la petición

      // Recupera el token del localStorage o donde lo tengas almacenado
      const token = localStorage.getItem("token");

      // Envía una solicitud PATCH al backend para aprobar el préstamo con la imagen
      await axios.patch(`/loans/${id}/approve`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Autenticación con token JWT
        },
      });

      // Redirige al usuario a la lista de préstamos tras éxito
      navigate("/loans");

    } catch (err) {
      // Captura errores y muestra un mensaje al usuario
      setError("Error al subir la foto. Intenta nuevamente.");
    } finally {
      setLoading(false); // Termina el estado de carga sin importar el resultado
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Título de la página con el número de préstamo */}
      <h2 className="text-2xl font-bold mb-4">Aceptar Préstamo #{id}</h2>

      {/* Formulario para subir la foto */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="photo" className="block font-semibold mb-1">
            Foto de los equipos prestados:
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*" // Acepta solo imágenes
            onChange={handleFileChange}
          />
        </div>

        {/* Muestra el mensaje de error si existe */}
        {error && <p className="text-red-600">{error}</p>}

        {/* Botón de envío, se desactiva mientras carga */}
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


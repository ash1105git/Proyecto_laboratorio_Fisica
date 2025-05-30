import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Contexto que contiene la información del usuario autenticado
import axios from "axios"; // Cliente HTTP para realizar solicitudes al backend
import { motion } from "framer-motion"; // Librería para animaciones

function LoanHistory() {
  const [loans, setLoans] = useState([]); // Estado para almacenar los préstamos
  const [loading, setLoading] = useState(true); // Estado para controlar la carga de datos

  const { user } = useContext(AuthContext); // Obtener el usuario actual desde el contexto de autenticación

  // Efecto que se ejecuta al montar el componente para obtener el historial de préstamos
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        // Realiza la solicitud GET al backend para obtener los préstamos
        const res = await axios.get("http://localhost:4000/api/loans", {
          withCredentials: true, // Incluye cookies de sesión si existen
        });
        setLoans(res.data); // Actualiza el estado con los préstamos recibidos
      } catch (err) {
        console.error("Error al obtener los préstamos:", err);
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchLoans();
  }, []);

  // Muestra un mensaje de carga mientras se obtienen los datos
  if (loading)
    return (
      <div className="text-center text-[#013B48] font-semibold p-8 animate-pulse">
        Cargando historial...
      </div>
    );

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-[#013B48] mb-6 text-center">
        Historial de Préstamos
      </h1>

      {/* Si no hay préstamos registrados, se muestra un mensaje */}
      {loans.length === 0 ? (
        <p className="text-center text-gray-600">
          No hay préstamos registrados.
        </p>
      ) : (
        // Si hay préstamos, se renderiza la lista
        <div className="space-y-6">
          {loans.map((loan, index) => (
            <motion.div
              key={loan._id}
              className="bg-white border border-[#D8D8D9] rounded-2xl p-6 shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }} // Animación escalonada
            >
              {/* Información del préstamo */}
              <p className="text-sm text-gray-600">
                <strong className="text-[#013B48]">Fecha de Préstamo:</strong>{" "}
                {new Date(loan.date_loan).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="text-[#013B48]">Fecha de Devolución:</strong>{" "}
                {new Date(loan.date_due).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <strong className="text-[#013B48]">Estado:</strong>{" "}
                <span
                  className={`font-medium ${
                    loan.status === "devuelto"
                      ? "text-[#3CDB85]"
                      : "text-[#BFA8F3]"
                  }`}
                >
                  {loan.status}
                </span>
              </p>

              {/* Lista de equipos prestados */}
              <h4 className="mt-4 font-semibold text-[#013B48]">
                Equipos Prestados:
              </h4>
              <ul className="list-disc ml-6 text-sm text-gray-700">
                {loan.details.map((detail) => (
                  <li key={detail._id}>
                    {detail.id_equipment?.name || "Equipo desconocido"} (
                    {detail.quantity})
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LoanHistory;

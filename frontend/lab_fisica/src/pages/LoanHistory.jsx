import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";

function LoanHistory() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/loans", {
          withCredentials: true,
        });
        setLoans(res.data);
      } catch (err) {
        console.error("Error al obtener los préstamos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  if (loading)
    return (
      <div className="text-center text-[#013B48] font-semibold p-8 animate-pulse">
        Cargando historial...
      </div>
    );

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-2xl font-bold text-[#013B48] mb-6 text-center">
        Historial de Préstamos
      </h1>

      {loans.length === 0 ? (
        <p className="text-center text-gray-600">
          No hay préstamos registrados.
        </p>
      ) : (
        <div className="space-y-6">
          {loans.map((loan, index) => (
            <motion.div
              key={loan._id}
              className="bg-white border border-[#D8D8D9] rounded-2xl p-6 shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
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

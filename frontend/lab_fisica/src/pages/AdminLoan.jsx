import { useEffect, useState } from "react";
import axios from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function AdminLoan() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // Estado para filtro

  // Estado para la imagen del modal
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await axios.get("/admin/loans", { withCredentials: true });
        if (Array.isArray(res.data)) {
          setLoans(res.data);
        } else {
          setLoans([]);
        }
      } catch (err) {
        setError("No se pudo cargar los préstamos");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const handleUploadEvidence = async (loanId, file) => {
    try {
      const formData = new FormData();
      formData.append("evidence", file);

      const res = await axios.post(
        `/upload/loan/${loanId}/upload-evidence`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan._id === loanId ? { ...loan, ...res.data.loan } : loan
        )
      );

      toast.success("Evidencia cargada correctamente.");
    } catch (err) {
      console.error("Error al subir evidencia:", err);
      toast.error("Error al subir evidencia");
    }
  };

  const handleUpdateStatus = async (loanId, newStatus) => {
    try {
      await axios.patch(
        `/loans/${loanId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan._id === loanId ? { ...loan, status: newStatus } : loan
        )
      );
      toast.info(`Estado actualizado a "${newStatus}"`);
    } catch (err) {
      toast.error("Error al actualizar el estado del préstamo");
    }
  };

  // Abrir modal con la imagen
const openModal = (imgName) => {
  // Reemplaza las barras invertidas por barras normales
  const cleanName = imgName.replace(/\\/g, '/');
  // Evita duplicar 'uploads/'
  const path = cleanName.startsWith('uploads/') ? cleanName : `uploads/${cleanName}`;
  // Genera URL limpia y codificada para espacios y caracteres especiales
  const url = `http://localhost:4000/${path}`;
  setModalImage(encodeURI(url));
};
 

  // Cerrar modal
  const closeModal = () => {
    setModalImage(null);
  };

  if (loading) return <p>Cargando préstamos...</p>;
  if (error) return <p>{error}</p>;

  // Filtrar préstamos según el estado seleccionado
  const filteredLoans = filterStatus === "all"
    ? loans
    : loans.filter((loan) => loan.status === filterStatus);

  return (
    <div className="container mx-auto p-6 bg-[#D9D9D9] rounded shadow my-2">
      <h1 className="text-2xl font-bold mb-4 text-center">Solicitudes de Préstamo</h1>

      {/* Filtro de estado */}
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2 font-semibold">Filtrar por estado:</label>
        <select
          id="filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-2 py-1 rounded bg-[#3DDA85] text-[#003B49] border-[#003B49]"
        >
          <option value="all">Todos</option>
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobados</option>
          <option value="rejected">Rechazados</option>
          <option value="returned">Devueltos</option>
        </select>
      </div>

      {filteredLoans.length === 0 ? (
        <p>No hay préstamos registrados para este filtro.</p>
      ) : (
        filteredLoans.map((loan) => (
          <div key={loan._id} className="loan-item border p-4 my-3 rounded shadow bg-[#BEA9F3] text-[#003B49]">
            <p><strong>Usuario:</strong> {loan.id_user?.username || "Desconocido"}</p>
            <p><strong>Tipo de usuario:</strong> {loan.id_user?.typeUser || "Desconocido"}</p>
            <p><strong>Estado:</strong> {loan.status}</p>
            <p><strong>Fecha préstamo:</strong> {new Date(loan.date_loan).toLocaleDateString()}</p>
            <p><strong>Fecha devolución:</strong> {new Date(loan.date_due).toLocaleDateString()}</p>

            {loan.evidenceImage && (
              <div className="my-2">
                <p><strong>Evidencia subida:</strong></p>               
                <button
                  onClick={() => openModal(loan.evidenceImage)}
                  aria-label="Mostrar imagen de evidencia"
                  className=" bg-[#003B49] text-white px-4 py-1 rounded hover:bg-[#1A1A1A] transition duration-200"
                >
                  Ver imagen 📷 
                </button>
              </div>
            )}

            <p><strong>Equipos:</strong></p>
            <ul>
              {loan.details.map((detail, index) => (
                <li key={detail._id || `${loan._id}-${index}`}>
                  {detail.id_equipment?.name || "Equipo desconocido"} (Cantidad: {detail.quantity})
                </li>
              ))}
            </ul>

            {loan.status === "pending" && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id={`file-input-${loan._id}`}
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      handleUploadEvidence(loan._id, e.target.files[0]);
                    }
                  }}
                />
                <button
                  onClick={() => document.getElementById(`file-input-${loan._id}`).click()}
                  className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Cargar Evidencia
                </button>
                <button
                  onClick={() => handleUpdateStatus(loan._id, "approved")}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => handleUpdateStatus(loan._id, "rejected")}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 ml-2"
                >
                  Rechazar
                </button>
              </>
            )}

            {loan.status === "approved" && (
              <button
                onClick={() => handleUpdateStatus(loan._id, "returned")}
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mt-2"
              >
                Marcar como devuelto
              </button>
            )}
          </div>
        ))
      )}

      {/* Modal simple para imagen */}
      {modalImage && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()} // evitar que cierre al click dentro del modal
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 8,
              maxWidth: "90%",
              maxHeight: "90%",
              overflow: "auto",
            }}
          >
            <img
              src={modalImage}
              alt="Evidencia ampliada"
              style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 8 }}
            />
            <button
              onClick={closeModal}
              style={{
                marginTop: 10,
                padding: "6px 12px",
                backgroundColor: "#333",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default AdminLoan;

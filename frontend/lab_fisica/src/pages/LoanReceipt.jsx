// Importamos el hook useParams para acceder a los parámetros de la URL
import { useParams } from "react-router-dom";

function LoanReceipt() {
  // Extraemos el parámetro `id` desde la URL (corresponde al ID del préstamo)
  const { id } = useParams();

  // Función que abre el recibo del préstamo en una nueva pestaña
  const handleViewReceipt = () => {
    // Abre la URL del backend que genera el PDF del recibo
    window.open(`http://localhost:4000/api/loans/${id}/receipt`, "_blank");
  };

  return (
    <div className="container mx-auto p-4 text-center">
      {/* Mensaje de éxito */}
      <h1 className="text-2xl font-bold mb-4">¡Préstamo enviado con éxito!</h1>
      <p className="mb-6">
        Puedes ver tu recibo haciendo clic en el botón de abajo.
      </p>

      {/* Botón que permite ver el recibo en PDF */}
      <button
        onClick={handleViewReceipt}
        className="bg-[#013B48] text-white px-6 py-3 rounded hover:bg-[#3CDB85]"
      >
        Ver recibo en PDF
      </button>
    </div>
  );
}

export default LoanReceipt;
// Este componente muestra un mensaje de éxito al usuario tras enviar un préstamo
// y le permite descargar el recibo en formato PDF.
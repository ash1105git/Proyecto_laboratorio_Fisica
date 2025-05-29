import { useParams } from "react-router-dom";

function LoanReceipt() {
  const { id } = useParams();

  const handleViewReceipt = () => {
    window.open(`http://localhost:4000/api/loans/${id}/receipt`, "_blank");
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">¡Préstamo enviado con éxito!</h1>
      <p className="mb-6">Puedes ver tu recibo haciendo clic en el botón de abajo.</p>
      <button
        onClick={handleViewReceipt}
        className="bg-[#013B48] text-white px-6 py-3 rounded hover:bg-[#3CDB85]"
      >
        Ver recibo en PDF
      </button>
    </div>
  );
}

export default LoanReceipt  ;

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLoanCart } from "../../context/loanContext";  // <-- importar contexto carrito
import logo from "../../assets/logo.png"

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { cartItems } = useLoanCart(); // <-- obtener items del carrito

  return (
    <nav className="bg-[#D8D8D9] text-white p-4  flex justify-between py-5 px-10 rounded-lg">
      <Link to="/" className="flex item">
        <img src={logo} alt="Logo Lab Física" className="h-16 w-auto max-w-[150px] object-contain"  />
      </Link>
      <ul className="flex gap-x-4 items-center gap-2">
        {isAuthenticated && (
          <li className="text-lg text-[#013A40] font-bold">Bienvenido, {user.username}</li>
        )}

        {isAuthenticated && user.typeUser === "admin" && (
          <>
            <li>
              <Link to="/dashboard" className="bg-[#013A40] text-[#F2F2F2] hover:text-[#3CDB85] flex items-center px-4 py-1 rounded-xl">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/equipments" className="bg-[#013A40] text-[#F2F2F2] hover:text-[#3CDB85] flex items-center px-4 py-1 rounded-xl">
                Lista de Equipos
              </Link>
            </li>
            <li>
              <Link to="/add-equipment" className="bg-[#013A40] text-[#F2F2F2] hover:text-[#3CDB85] flex items-center px-4 py-1 rounded-xl">
                Añadir Equipo
              </Link>
            </li>
            <li>
              <Link
                to="/admin/loans"
                className="bg-[#013A40] text-[#F2F2F2] hover:text-[#3CDB85] flex items-center px-4 py-1 rounded-xl"
              >
                Gestionar Préstamos
              </Link>
            </li>
          </>
        )}

        {isAuthenticated && (user.typeUser === "student" || user.typeUser === "professor") && (
          <>
            <li>
              <Link to="/equipments" className="bg-[#013A40] text-[#F2F2F2] hover:text-[#3CDB85] flex items-center px-4 py-1 rounded-xl">
                Equipos
              </Link>
            </li>
            <li>
              <Link to="/loan-history" className="bg-[#013A40] text-[#F2F2F2] hover:text-[#3CDB85] flex items-center px-4 py-1 rounded-xl ">
                Historial de Préstamos
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/loan"
                className="bg-[#013A40] text-[#F2F2F2] hover:text-[#3CDB85] px-4 py-1 rounded-xl flex items-center"
              >
                Ver Prestamo
                {cartItems.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-[#013B48] bg-[#BFA8F3] rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </li>
          </>
        )}

        {isAuthenticated ? (
          <li>
            <button onClick={logout} className="bg-[#013A40] text-[#F2F2F2] hover:text-[#3CDB85] px-4 py-1 rounded-xl">
              Cerrar sesión
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login" className="bg-[#013A40] text-[#F2F2F2] px-4 py-1 rounded-xl hover:text-[#3CDB85]">
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link to="/register" className="bg-[#013A40] text-[#F2F2F2] px-4 py-1 rounded-xl hover:text-[#3CDB85]">
                Registrarse
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

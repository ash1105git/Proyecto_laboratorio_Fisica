// Importamos los hooks y utilidades necesarias
import { useForm } from "react-hook-form"; // Para el manejo de formularios
import { useAuth } from "../context/AuthContext"; // Contexto de autenticación
import { Link, useNavigate } from "react-router-dom"; // Navegación y enlaces
import { useEffect } from "react";

function LoginPage() {
  // Configuramos useForm para manejar campos y errores del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Extraemos funciones y estados del contexto de autenticación
  const { signin, errors: signinErrors, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Función que se ejecuta al enviar el formulario
  const onSubmit = handleSubmit(async (data) => {
    await signin(data); // Llamamos a la función para iniciar sesión
  });

  // Redirige según el tipo de usuario cuando está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.typeUser === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/equipments");
      }
    }
  }, [isAuthenticated, user]);

  return (
    <div className="bg-[#D8D8D9] border-[#013A40] max-w-md p-10 rounded-3xl shadow-lg w-full flex flex-col gap-4 mx-auto my-10">
      
      {/* Mensajes de error al iniciar sesión */}
      {signinErrors.map((error, i) => (
        <div key={i} className="bg-red-500 text-white p-2 rounded mb-2">
          {typeof error === "string" ? error : error.message}
        </div>
      ))}

      {/* Logo */}
      <img
        src="https://miaulavirtual.ucp.edu.co/assets/logocie.png"
        alt="Login Icon"
        className="h-16 mx-auto mb-4"
      />

      {/* Título */}
      <h1 className="text-2xl font-bold text-center text-[#013A40]">Login</h1>

      {/* Formulario de login */}
      <form onSubmit={onSubmit}>
        {/* Campo de email */}
        <input
          type="email"
          {...register("email", { required: true })}
          className="w-full bg-[#D8D8D9] text-[#013A40] px-4 py-2 rounded-md my-2 border-[3px] border-[#013A40]"
          placeholder="Email"
        />
        {errors.email && <p className="text-red-500">Este campo es requerido</p>}

        {/* Campo de contraseña */}
        <input
          type="password"
          {...register("password", { required: true })}
          className="w-full bg-[#D8D8D9] text-[#013A40] px-4 py-2 rounded-md my-2 border-[3px] border-[#013A40]"
          placeholder="Password"
        />
        {errors.password && <p className="text-red-500">Este campo es requerido</p>}

        {/* Botón para enviar el formulario */}
        <button
          type="submit"
          className="w-full bg-[#013A40] text-[#F2F2F2] hover:text-[#2ec66c] px-4 py-2 rounded-md"
        >
          Ingresa
        </button>
      </form>

      {/* Enlace a la página de registro */}
      <p className="gap-x-2 text-center text-[#013A40] mt-2">
        ¿No tienes una cuenta?{" "}
        <Link to="/register" className="text-[#013A40] font-bold">
          Registrar
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;

import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signup(values);
      await Swal.fire({
        title: "Registro exitoso",
        icon: "success",
        confirmButtonText: "Ir a iniciar sesión",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      Swal.fire({
        title: "Error al registrarse",
        text: "Por favor, verifica los datos ingresados.",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
    }
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/equipments");
  }, [isAuthenticated]);

  return (
    <div className="bg-[#D8D8D9] border-[#013A40] max-w-md p-10 rounded-3xl shadow-lg w-full flex flex-col gap-4 mx-auto my-10">
      <img src="https://miaulavirtual.ucp.edu.co/assets/logocie.png" alt="Login Icon" className=" h-16 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-center text-[#013A40]">Registro</h1>

        {registerErrors.length > 0 && (
          <div className="mb-4">
            {registerErrors.map((error, i) => (
              <div key={i} className="bg-red-100 text-red-700 p-2 rounded mb-1 text-sm">
                {typeof error === "string" ? error : error.message}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nombre de usuario</label>
            <input
              type="text"
              {...register("username", { required: true })}
              className="w-full  text-[#013A40] px-4 py-2 rounded-md my-2 border-[3px] border-[#013A40]"
              placeholder="Usuario"
            />
            {errors.username && <p className="error-text text-red-700">Este campo es obligatorio</p>}
          </div>

          <div>
            <label className="block text-gray-700">Apellido</label>
            <input
              type="text"
              {...register("lastName", { required: true })}
              className="w-full  text-[#013A40] px-4 py-2 rounded-md my-2 border-[3px] border-[#013A40]"
              placeholder="Apellido"
            />
            {errors.lastName && <p className="error-text text-red-700">Este campo es obligatorio</p>}
          </div>

           <div>
            <label className="block text-gray-700">Documento</label>
            <input
              type="text"
              {...register("documento", { required: true })}
              className="w-full text-[#013A40] px-4 py-2 rounded-md my-2 border-[3px] border-[#013A40]"
              placeholder="Número de documento"
            />
            {errors.document && <p className="error-text text-red-700">Este campo es obligatorio</p>}
          </div>

          <div>
            <label className="block text-gray-700">Tipo de usuario</label>
            <select
              {...register("typeUser", { required: true })}
              className="w-full  text-[#013A40] px-4 py-2 rounded-md my-2 border-[3px] border-[#013A40]"
            >
              <option value="" hidden>Selecciona el tipo</option>
              <option value="student">Estudiante</option>
              <option value="professor">Profesor</option>
              <option value="admin">Administrador</option>
            </select>
            {errors.typeUser && <p className="error-text text-red-700">Selecciona un tipo</p>}
          </div>

            

          {watch("typeUser") === "student" && (
            <div>
              <label className="block text-gray-700">Programa académico</label>
              <input
                type="text"
                {...register("programa", { required: true })}
                className="w-full text-[#013A40] px-4 py-2 rounded-md my-2 border-[3px] border-[#013A40]"
                placeholder="Ej: Ingeniería Física"
              />
              {errors.programa && <p className="error-text text-red-700">Este campo es obligatorio</p>}
            </div>
          )}

          <div>
            <label className="block text-gray-700">Correo electrónico</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full  text-[#013A40] px-4 py-2 rounded-md my-2 border-[3px] border-[#013A40]"
              placeholder="correo@ejemplo.com"
            />
            {errors.email && <p className="error-text text-red-700">Este campo es obligatorio</p>}
          </div>

          <div>
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="w-full  text-[#013A40] px-4 py-2 rounded-md my-2 border-[3px] border-[#013A40]"
              placeholder="********"
            />
            {errors.password && <p className="error-text text-red-700">Este campo es obligatorio</p>}
          </div>

          <div>
            <label className="block text-gray-700">Confirmar contraseña</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: true,
                validate: (value) => value === watch("password") || "Las contraseñas no coinciden"
              })}
              className="w-full  text-[#013A40] px-4 py-2 rounded-md my-2 border-[3px] border-[#013A40]"
              placeholder="********"
            />
            {errors.confirmPassword && (
              <p className="error-text text-red-700">
                {errors.confirmPassword.message || "Este campo es obligatorio "}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#013a40] text-[#F2F2F2] hover:text-[#2ec66c] font-semibold py-2 rounded-md transition duration-300"
          >
            Registrarme
          </button>
        </form>

        <p className="text-center text-sm text-[#013A40] mt-4">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-[#013A40] font-bold">
            Inicia sesión
          </Link>
        </p>
      </div>
 
  );
}

export default RegisterPage;

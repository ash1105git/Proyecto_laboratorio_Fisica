import { validationResult } from "express-validator";

/**
 * Middleware para validar las solicitudes HTTP usando express-validator.
 * 
 * Verifica si hay errores de validación en la solicitud. Si existen errores,
 * responde con un estado 400 y un JSON con los detalles de los errores.
 * Si no hay errores, continúa con el siguiente middleware o controlador.
 * 
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware.
 * 
 * @returns {void|import('express').Response} Devuelve la respuesta con errores si la validación falla.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
      })),
    });
  }
  next();
};

export default validateRequest;


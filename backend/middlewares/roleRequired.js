/**
 * Middleware para restringir acceso según roles permitidos.
 * 
 * @param {...string} allowedRoles - Lista de roles permitidos para acceder a la ruta.
 * @returns {function} Middleware que valida el rol del usuario en `req.user.typeUser`.
 * 
 * @example
 * // Permitir solo a usuarios con rol 'admin' o 'professor'
 * app.get('/admin', roleRequired('admin', 'professor'), (req, res) => {
 *   res.send('Acceso permitido');
 * });
 */
export function roleRequired(...allowedRoles) {
  return (req, res, next) => {
    const { typeUser } = req.user;

    if (!allowedRoles.includes(typeUser)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}

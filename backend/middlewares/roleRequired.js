
export function roleRequired(...allowedRoles) {
  return (req, res, next) => {
    const { typeUser } = req.user;
    if (!allowedRoles.includes(typeUser)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

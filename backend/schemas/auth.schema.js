import { body } from "express-validator";

export const registerSchema = [
body("username")
  .notEmpty().withMessage("Username is required")
  .isLength({ min: 3, max: 50 }).withMessage("Username must be between 3 and 50 characters")
  .trim().escape()
  .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/).withMessage("Username must contain only letters and spaces"),

body("lastName")
    .notEmpty().withMessage("Last name is required")
    .isLength({ min: 3, max: 50 }).withMessage("Last name must be between 3 and 50 characters")
    .trim().escape()
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/).withMessage("Last name must contain only letters and spaces"),

body("documento")
    .notEmpty().withMessage("Document number is required")
    .isLength({ min: 5, max: 20 }).withMessage("Document number must be between 5 and 20 characters")
    .trim().escape()
    .matches(/^[0-9]+$/).withMessage("Document number must contain only numbers"),

body("typeUser")
    .notEmpty().withMessage("User type is required")
    .isIn(['admin', 'student', 'professor']).withMessage("Invalid user type"),

body("programa")
    .optional()
    .isLength({ min: 3, max: 100 }).withMessage("Program name must be between 3 and 100 characters")
    .trim().escape()
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/).withMessage("Program name must contain only letters and spaces"),

    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format")
      .normalizeEmail()
      .isLength({ min: 5, max: 50 }).withMessage("Email must be between 5 and 50 characters")
      .trim().escape()
      .custom((value) => {
    if (!value.endsWith("@ucp.edu.co")) {
      throw new Error("El email debe ser de la UCP");
    }
    return true;
  }),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8, max: 50 }).withMessage("Password must be between 8 and 50 characters")
    .trim().escape(),

];

export const loginSchema = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail()
    .isLength({ min: 5, max: 50 }).withMessage("Incorrect email")
    .trim().escape(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8, max: 50 }).withMessage("Incorrect password")
    .trim().escape()
];

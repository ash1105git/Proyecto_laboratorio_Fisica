import { body } from 'express-validator';

/**
 * Esquema de validación para crear un equipo (Equipment)
 * Campos validados:
 * - name: obligatorio, 3-50 caracteres, solo letras, números y espacios
 * - description: obligatorio, 3-200 caracteres, texto limpio
 * - code_equipment: obligatorio, 1-20 caracteres, solo letras, números y espacios
 * - status: obligatorio, debe ser 'available' o 'unavailable'
 * - quantity: obligatorio, número entero >= 0
 */
export const createEquipmentSchema = [
  body('name')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres')
    .trim()
    .escape()
    .isAlphanumeric('es-ES', { ignore: ' ' }).withMessage('El nombre solo puede contener letras, números y espacios'),

  body('description')
    .notEmpty().withMessage('La descripción es requerida')
    .isLength({ min: 3, max: 200 }).withMessage('La descripción debe tener entre 3 y 200 caracteres')
    .trim()
    .escape(),

  body('code_equipment')
    .notEmpty().withMessage('El código del equipo es requerido')
    .isLength({ min: 1, max: 20 }).withMessage('El código del equipo debe tener entre 1 y 20 caracteres')
    .trim()
    .escape()
    .isAlphanumeric('es-ES', { ignore: ' ' }).withMessage('El código del equipo solo puede contener letras, números y espacios'),

  body('status')
    .notEmpty().withMessage('El estado es requerido')
    .isIn(['available', 'unavailable']).withMessage('El estado debe ser "available" o "unavailable"'),

  body('quantity')
    .notEmpty().withMessage('La cantidad es requerida')
    .isInt({ min: 0 }).withMessage('La cantidad debe ser un número entero mayor o igual a 0')
    .toInt(),
];

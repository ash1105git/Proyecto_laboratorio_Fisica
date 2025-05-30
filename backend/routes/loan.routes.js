import { Router } from 'express';
import {
  getLoanById,
  updateLoanStatus,
  returnLoan,
  createLoan,
  getLoansByUser,
  generateLoanReceipt,
  getAllLoans
} from '../controllers/loan.controller.js';

import { authRequired } from '../middlewares/validateToken.js';
import { roleRequired } from '../middlewares/roleRequired.js';

const router = Router();

/**
 * Crear un nuevo préstamo
 * POST /loans
 * - Requiere autenticación
 * - Solo roles: student, professor
 */
router.post('/loans', authRequired, roleRequired('student', 'professor'), createLoan);

/**
 * Obtener préstamos del usuario autenticado
 * GET /loans
 * - Requiere autenticación
 */
router.get('/loans', authRequired, getLoansByUser);

/**
 * Obtener préstamo por ID
 * GET /loans/:id
 * - Requiere autenticación
 */
router.get('/loans/:id', authRequired, getLoanById);

/**
 * Actualizar estado del préstamo (ej: aprobar, rechazar)
 * PATCH /loans/:id/status
 * - Requiere autenticación
 * - Solo rol admin
 */
router.patch('/loans/:id/status', authRequired, roleRequired('admin'), updateLoanStatus);

/**
 * Marcar préstamo como retornado
 * PATCH /loans/:id/return
 * - Requiere autenticación
 * - Roles: student, professor
 */
router.patch('/loans/:id/return', authRequired, roleRequired('student', 'professor'), returnLoan);

/**
 * Generar recibo del préstamo
 * GET /loans/:id/receipt
 * - Requiere autenticación
 */
router.get('/loans/:id/receipt', authRequired, generateLoanReceipt);

/**
 * Obtener todos los préstamos (admin)
 * GET /admin/loans
 * - Requiere autenticación
 * - Solo rol admin
 */
router.get('/admin/loans', authRequired, roleRequired('admin'), getAllLoans);

/**
 * Retornar préstamo como admin
 * PATCH /admin/loans/:id/return
 * - Requiere autenticación
 * - Solo rol admin
 */
router.patch('/admin/loans/:id/return', authRequired, roleRequired('admin'), returnLoan);

export default router;

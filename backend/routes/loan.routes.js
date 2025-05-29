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

router.post('/loans', authRequired, roleRequired('student', 'professor'), createLoan);

router.get('/loans', authRequired, getLoansByUser);

router.get('/loans/:id', authRequired, getLoanById);

router.patch('/loans/:id/status', authRequired, roleRequired('admin'), updateLoanStatus);

router.patch('/loans/:id/return', authRequired, roleRequired('student', 'professor'), returnLoan);

router.get('/loans/:id/receipt', authRequired, generateLoanReceipt);

router.get('/admin/loans', authRequired, roleRequired('admin'), getAllLoans);

router.patch('/admin/loans/:id/return', authRequired, roleRequired('admin'), returnLoan);


export default router;

import express from 'express';
import { getDashboardStats } from '../controllers/Dashboard.controller.js'; 
import { authRequired } from "../middlewares/validateToken.js";

const router = express.Router();

/**
 * Ruta para obtener estadísticas del dashboard.
 * 
 * GET /dashboard
 * - Ruta protegida que requiere token válido (authRequired).
 * - Llama al controlador getDashboardStats para obtener los datos estadísticos.
 */

router.get('/dashboard', authRequired, getDashboardStats);

export default router;


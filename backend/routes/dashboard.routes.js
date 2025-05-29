import express from 'express';
import { getDashboardStats } from '../controllers/Dashboard.controller.js'; 
import { authRequired } from "../middlewares/validateToken.js";

const router = express.Router();

router.get('/dashboard', authRequired, getDashboardStats);

export default router;

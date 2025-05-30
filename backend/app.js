import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();


import authRoutes from "./routes/auth.routes.js";
import equipmentsRoutes from "./routes/equipments.routes.js";
import loansRoutes from "./routes/loan.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import uploadRoutes from "./routes/upload.routes.js"; 
import path from "path";
import { fileURLToPath } from "url";

// Configuración para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware para habilitar CORS solo para frontends permitidos y con credenciales (cookies)
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));

// Middleware para registrar peticiones HTTP en consola (modo desarrollo)
app.use(morgan("dev"));

// Middleware para parsear JSON en los cuerpos de las peticiones
app.use(express.json());

// Middleware para parsear cookies en las peticiones
app.use(cookieParser());

// Rutas principales agrupadas bajo /api
app.use("/api", authRoutes);
app.use("/api", equipmentsRoutes);
app.use("/api", loansRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/upload", uploadRoutes);

// Carpeta pública para servir archivos estáticos (imágenes subidas)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

export default app;

// Para iniciar el servidor (desde otro archivo, por ejemplo server.js):
// import app from './app.js';
// app.listen(4000, () => console.log("Servidor corriendo en puerto 4000"));

// Para probar en navegador o cliente HTTP:
// http://localhost:4000

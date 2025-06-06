import express from 'express';
import multer from 'multer';
import Loan from '../models/loan.model.js';
import Equipment from '../models/equipment.model.js';
import { authRequired } from '../middlewares/validateToken.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Crear carpeta 'uploads' si no existe
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

// Filtro y límite para subida de archivos
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // límite 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Solo se permiten imágenes'), false);
  }
});

/**
 * POST /loan/:id/upload-evidence
 * Middleware para subir una imagen de evidencia asociada a un préstamo.
 * - Requiere autenticación.
 * - Guarda la ruta de la imagen en el campo `evidenceImage` del préstamo.
 */
router.post(
  '/loan/:id/upload-evidence',
  authRequired,
  (req, res, next) => {
    upload.single('evidence')(req, res, err => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  async (req, res) => {
    try {
      const loanId = req.params.id;
      if (!req.file) return res.status(400).json({ message: 'Archivo no proporcionado' });

      const loan = await Loan.findById(loanId);
      if (!loan) return res.status(404).json({ message: 'Préstamo no encontrado' });

      loan.evidenceImage = req.file.path;
      await loan.save();

      res.json({ message: 'Evidencia cargada correctamente', loan });
    } catch (error) {
      res.status(500).json({ message: 'Error al subir evidencia', error: error.message });
    }
  }
);

/**
 * POST /equipment/:id/upload-image
 * Middleware para subir una imagen asociada a un equipo.
 * - Requiere autenticación.
 * - Guarda la ruta de la imagen en el campo `imageUrl` del equipo.
 */
router.post(
  '/equipment/:id/upload-image',
  authRequired,
  (req, res, next) => {
    upload.single('image')(req, res, err => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  async (req, res) => {
    try {
      const equipmentId = req.params.id;
      if (!req.file) return res.status(400).json({ message: 'Archivo no proporcionado' });

      const equipment = await Equipment.findById(equipmentId);
      if (!equipment) return res.status(404).json({ message: 'Equipo no encontrado' });

      equipment.imageUrl = req.file.path;
      await equipment.save();

      res.json({ message: 'Imagen del equipo cargada correctamente', equipment });
    } catch (error) {
      res.status(500).json({ message: 'Error al subir imagen', error: error.message });
    }
  }
);

export { upload };
export default router;

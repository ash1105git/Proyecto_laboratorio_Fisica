import express from 'express';
const router = express.Router(); 

import multer from 'multer';
import Loan from '../models/loan.model.js';

// Config multer para guardar archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });

// Ruta para subir evidencia de préstamo
router.post('/loan/:id/upload-evidence', upload.single('evidence'), async (req, res) => {
  try {
    const loanId = req.params.id;
    const filePath = req.file.path;

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: 'Préstamo no encontrado' });

    loan.evidenceImage = filePath;
    await loan.save();

    res.json({ message: 'Evidencia cargada correctamente', loan });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir evidencia', error: error.message });
  }
});

export default router;

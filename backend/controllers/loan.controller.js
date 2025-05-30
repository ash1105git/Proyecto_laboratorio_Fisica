import PDFDocument from "pdfkit";
import Loan from "../models/loan.model.js";
import LoanDetail from "../models/loanDetail.js";
import Equipment from "../models/equipment.model.js";
import patch from "path";
import fs from "fs";
import mongoose from 'mongoose';
import multer from 'multer';

/**
 * Crea un nuevo préstamo con detalles y actualiza las cantidades de los equipos.
 * Valida que existan equipos seleccionados y que haya suficiente cantidad disponible.
 * @param {Request} req - request con datos del préstamo y usuario autenticado (req.user).
 * @param {Response} res - respuesta con el préstamo creado o error.
 */
export const createLoan = async (req, res) => {
  try {
    const { date_loan, date_due, details } = req.body;
    const id_user = req.user.id;    

    if (!details || details.length === 0) {
      return res.status(400).json({ message: "No hay equipos seleccionados" });
    }

    // Validar cantidades disponibles
    for (const item of details) {
      const equipment = await Equipment.findById(item.id_equipment);
      if (!equipment) {
        return res.status(400).json({ message: `Equipo no encontrado: ${item.id_equipment}` });
      }
      if (equipment.quantity < item.quantity) {
        return res.status(400).json({ message: `No hay suficiente cantidad disponible para el equipo ${equipment.name}` });
      }
    }

    // Crear préstamo
    const loan = new Loan({ id_user, date_loan, date_due, status: "pending", details: [] });

    await loan.save();

    // Crear detalles y restar cantidades
    for (const item of details) {
      const equipment = await Equipment.findById(item.id_equipment);

      // Crear detalle
      const loanDetail = new LoanDetail({
        id_loan: loan._id,
        id_equipment: item.id_equipment,
        quantity: item.quantity,
      });
      await loanDetail.save();

      // Actualizar cantidad equipo
      equipment.quantity -= item.quantity;
      await equipment.save();

      // Agregar detalle al préstamo
      loan.details.push(loanDetail._id);
    }

    await loan.save();

    res.status(201).json({id: loan._id, message: "Préstamo creado exitosamente", loan });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el préstamo", error: error.message });
  }
};

/**
 * Obtiene todos los préstamos del usuario autenticado con sus detalles y equipos.
 * @param {Request} req - request con usuario autenticado (req.user).
 * @param {Response} res - respuesta con lista de préstamos o error.
 */
export const getLoansByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener los préstamos del usuario
    const loans = await Loan.find({ id_user: userId }).lean();

    if (!loans || loans.length === 0) {
      return res.status(404).json({ message: "No se encontraron préstamos para este usuario." });
    }

    // Obtener detalles y equipos para cada préstamo
    const loansWithDetails = await Promise.all(
      loans.map(async (loan) => {
        const details = await LoanDetail.find({ id_loan: loan._id })
          .populate("id_equipment", "name description")
          .lean();

        return {
          ...loan,
          details
        };
      })
    );

    res.json(loansWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los préstamos.", error: error.message });
  }
};

/**
 * Obtiene un préstamo específico por su ID junto con sus detalles y equipos.
 * Valida que el usuario tenga permisos para ver el préstamo.
 * @param {Request} req - request con parámetro id (req.params.id) y usuario autenticado.
 * @param {Response} res - respuesta con préstamo detallado o error.
 */
export const getLoanById = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await Loan.findById(id).lean();
    if (!loan) return res.status(404).json({ message: "Préstamo no encontrado" });

    if (req.user.typeUser !== 'admin' && loan.id_user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const details = await LoanDetail.find({ id_loan: id })
      .populate("id_equipment", "name description status quantity")
      .lean();

    res.json({ loan, details });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el préstamo", error: error.message });
  }
};

/**
 * Actualiza el estado de un préstamo.
 * Solo acepta estados válidos: pending, approved, returned, rejected.
 * @param {Request} req - request con parámetro id y body con nuevo estado.
 * @param {Response} res - respuesta con préstamo actualizado o error.
 */
export const updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'returned', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedLoan) return res.status(404).json({ message: "Préstamo no encontrado" });

    res.json({ message: "Estado actualizado", loan: updatedLoan });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el estado", error: error.message });
  }
};

/**
 * Marca un préstamo como devuelto, actualiza cantidades de equipos y fecha de retorno.
 * Solo puede hacerlo el dueño del préstamo o un admin.
 * @param {Request} req - request con parámetro id y usuario autenticado.
 * @param {Response} res - respuesta con confirmación o error.
 */
export const returnLoan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de préstamo no válido" });
    }

    const loan = await Loan.findById(id).populate('details');
    if (!loan) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }

    if (req.user.typeUser !== 'admin' && loan.id_user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    if (loan.status === 'returned') {
      return res.status(400).json({ message: "El préstamo ya fue devuelto" });
    }

    loan.status = 'returned';
    loan.date_returned = new Date();
    await loan.save();

    // Actualizar cantidades de equipos
    for (const detail of loan.details) {
      const equipment = await Equipment.findById(detail.id_equipment);
      if (equipment) {
        equipment.quantity += detail.quantity;
        await equipment.save();
      }
    }

    return res.json({ message: "Préstamo devuelto correctamente", loan });

  } catch (error) {
    return res.status(500).json({
      message: "Error al devolver el préstamo",
      error: error.message
    });
  }
};

/**
 * Genera un recibo PDF del préstamo con detalles, equipo y usuario.
 * Permite descargar o visualizar el PDF en línea.
 * Solo el usuario dueño o admin puede acceder.
 * @param {Request} req - request con parámetro id y usuario autenticado.
 * @param {Response} res - respuesta con PDF o error.
 */
export const generateLoanReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await Loan.findById(id)
      .populate('id_user', 'username typeUser')
      .lean();

    if (!loan) return res.status(404).json({ message: "Préstamo no encontrado" });

    const details = await LoanDetail.find({ id_loan: id })
      .populate('id_equipment', 'name description')
      .lean();

    if (req.user.typeUser !== 'admin' && loan.id_user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=recibo_prestamo_${id}.pdf`);

    doc.pipe(res);

    doc.on('error', (err) => {
      console.error('Error en PDF:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error generando PDF', error: err.message });
      }
    });

    const logoPath = patch.resolve('utils/logo.png');
    doc.image(logoPath, 50, 45, { width: 100 });
    doc.moveDown(3);

    doc.fontSize(16).text('Recibo de Préstamo de Equipos', { align: 'center', underline: true });
    doc.moveDown(1);
    doc.fontSize(12).text(`Nombre del usuario: ${loan.id_user.username}`);
    doc.text(`Rol del usuario: ${loan.id_user.typeUser}`);
    doc.moveDown(1);

    doc.text(`Fecha del préstamo: ${new Date(loan.date_loan).toLocaleDateString()}`);
    doc.text(`Fecha de devolución: ${new Date(loan.date_due).toLocaleDateString()}`);
    doc.text(`Estado: ${loan.status}`);
    if (loan.date_returned) {
      doc.text(`Fecha de retorno: ${new Date(loan.date_returned).toLocaleDateString()}`);
    }
    doc.moveDown();

    doc.fontSize(14).text('Equipos prestados:', { underline: true });
    doc.moveDown(0.5);

    details.forEach((detail, index) => {
      const { id_equipment, quantity } = detail;
      doc.fontSize(12).text(`${index + 1}. ${id_equipment.name} (${quantity})`);
      doc.text(`   Descripción: ${id_equipment.description}`);
      doc.moveDown(0.5);
    });

    doc.moveDown(2);
    doc.fontSize(12).text('Gracias por utilizar el sistema de préstamo del laboratorio.', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error al generar el recibo", error: error.message });
    }
  }
};

/**
 * Obtiene todos los préstamos con detalles y datos del usuario (solo admins).
 * @param {Request} req - request con usuario autenticado.
 * @param {Response} res - respuesta con lista de préstamos o error.
 */
export const getAllLoans = async (req, res) => {
  try {
    if (req.user.typeUser !== 'admin') {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const loans = await Loan.find()
      .populate('id_user', 'username email typeUser')
      .lean();

    const loansWithDetails = await Promise.all(
      loans.map(async (loan) => {
        const details = await LoanDetail.find({ id_loan: loan._id })
          .populate('id_equipment', 'name description')
          .lean();
        return {
          ...loan,
          details
        };
      })
    );

    res.json(loansWithDetails);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los préstamos", error: error.message });
  }
};

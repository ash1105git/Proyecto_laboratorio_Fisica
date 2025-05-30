import Loan from '../models/loan.model.js';
import LoanDetail from '../models/loanDetail.js';
import Equipment from '../models/equipment.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

/**
 * Controlador para obtener estadísticas del dashboard.
 * Retorna:
 * 1. Número de préstamos por estado.
 * 2. Número de préstamos por mes (últimos 6 meses).
 * 3. Cantidad total de equipos prestados por tipo.
 * 4. Usuarios más activos en cuanto a préstamos.
 */
export const getDashboardStats = async (req, res) => {
  try {
    // 1) Agrupar préstamos por estado y contar cada grupo
    const loansByStatusAgg = await Loan.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const loansByStatus = loansByStatusAgg.map(s => ({
      status: s._id,
      count: s.count
    }));

    // 2) Agrupar préstamos por mes de los últimos 6 meses
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Primer día del mes

    const loansByMonthAgg = await Loan.aggregate([
      {
        $match: {
          date_loan: { $gte: sixMonthsAgo } // Filtrar por fecha de préstamo reciente
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date_loan" },
            month: { $month: "$date_loan" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Formatear los datos de mes como "YYYY-MM"
    const loansByMonth = loansByMonthAgg.map(item => {
      const m = item._id.month.toString().padStart(2, "0");
      return {
        month: `${item._id.year}-${m}`,
        count: item.count
      };
    });

    // 3) Contar cantidad total prestada por tipo de equipo
    const equipmentCountAgg = await LoanDetail.aggregate([
      {
        $group: {
          _id: "$id_equipment", // Agrupar por equipo
          totalQuantity: { $sum: "$quantity" } // Sumar cantidades prestadas
        }
      },
      {
        $lookup: {
          from: "equipment", // Relacionar con la colección de equipos
          localField: "_id",
          foreignField: "_id",
          as: "equipment"
        }
      },
      { $unwind: "$equipment" }, // Extraer objeto del array
      {
        $project: {
          _id: 0,
          type: "$equipment.name", // Obtener nombre del equipo
          count: "$totalQuantity"
        }
      },
      { $sort: { totalQuantity: -1 } } // Ordenar por cantidad descendente
    ]);

    // 4) Identificar los 5 usuarios con más préstamos
    const activeUsersAgg = await Loan.aggregate([
      {
        $group: {
          _id: "$id_user", // Agrupar por usuario
          loansCount: { $sum: 1 } // Contar sus préstamos
        }
      },
      {
        $lookup: {
          from: "users", // Relacionar con colección de usuarios
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" }, // Extraer objeto del array
      {
        $project: {
          _id: 0,
          username: "$user.username", // Mostrar nombre de usuario
          count: "$loansCount"
        }
      },
      { $sort: { loansCount: -1 } }, // Ordenar por cantidad de préstamos
      { $limit: 5 } // Limitar a los 5 más activos
    ]);

    // Respuesta con todas las estadísticas recolectadas
    res.json({
      loansByStatus,
      loansByMonth,
      equipmentByType: equipmentCountAgg,
      activeUsers: activeUsersAgg,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener estadísticas", error: error.message });
  }
};

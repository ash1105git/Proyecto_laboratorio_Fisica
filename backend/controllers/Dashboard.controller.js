import Loan from '../models/loan.model.js';
import LoanDetail from '../models/loanDetail.js';
import Equipment from '../models/equipment.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';


export const getDashboardStats = async (req, res) => {
  try {
    // 1) Préstamos por estado
    const loansByStatusAgg = await Loan.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const loansByStatus = loansByStatusAgg.map(s => ({
  status: s._id,
  count: s.count
}));

    // 2) Préstamos por mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    const loansByMonthAgg = await Loan.aggregate([
      {
        $match: {
          date_loan: { $gte: sixMonthsAgo }
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

    // Formatear como [{ month: "YYYY-MM", count }]
    const loansByMonth = loansByMonthAgg.map(item => {
      const m = item._id.month.toString().padStart(2, "0");
      return {
        month: `${item._id.year}-${m}`,
        count: item.count
      };
    });

    // 3) Cantidad de equipos prestados por tipo
    // Sumamos cantidades de LoanDetail agrupados por equipo
    const equipmentCountAgg = await LoanDetail.aggregate([
      {
        $group: {
          _id: "$id_equipment",
          totalQuantity: { $sum: "$quantity" }
        }
      },
      {
        $lookup: {
          from: "equipment",
          localField: "_id",
          foreignField: "_id",
          as: "equipment"
        }
      },
      { $unwind: "$equipment" },
      {
        $project: {
          _id: 0,
            type: "$equipment.name",
           count: "$totalQuantity"
        }
      },
      { $sort: { totalQuantity: -1 } }
    ]);

    // 4) Usuarios más activos (préstamos realizados)
    const activeUsersAgg = await Loan.aggregate([
      {
        $group: {
          _id: "$id_user",
          loansCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          username: "$user.username",
          count: "$loansCount"
        }
      },
      { $sort: { loansCount: -1 } },
      { $limit: 5 }
    ]);

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

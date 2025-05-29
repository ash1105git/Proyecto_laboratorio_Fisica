import React, { useEffect, useState } from "react";
import axios from "../../api/axios"; 
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [activeIndexEquipos, setActiveIndexEquipos] = useState(null);
  const [activeIndexUsuarios, setActiveIndexUsuarios] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/dashboard");
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Error cargando estadísticas");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Cargando estadísticas...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!stats) return null;

  // Payload personalizado para leyenda "Equipos prestados por tipo"
  const legendPayloadEquipos = stats.equipmentByType.map((entry, index) => ({
    value: entry.type,
    type: "square",
    color: COLORS[index % COLORS.length],
  }));

  // Payload personalizado para leyenda "Usuarios más activos"
  const legendPayloadUsuarios = stats.activeUsers.map((entry, index) => ({
    value: entry.username,
    type: "square",
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="container mx-auto p-6 space-y-10 bg-[#D9D9D9] rounded-lg shadow-md my-2 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Préstamos por estado (PieChart) */}
      <div>
        <h2 className="text-xl font-bold mb-4">Préstamos por estado</h2>
        <PieChart width={400} height={300}>
          <Pie
            data={stats.loansByStatus}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {stats.loansByStatus.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Préstamos por mes (LineChart) */}
      <div>
        <h2 className="text-xl font-bold mb-4">Préstamos por mes</h2>
        <LineChart width={600} height={300} data={stats.loansByMonth}>
          <CartesianGrid strokeDasharray="3 3" stroke="#000" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Préstamos" />
        </LineChart>
      </div>

      {/* Cantidad de equipos prestados por tipo (BarChart) */}
      <div>
        <h2 className="text-xl font-bold mb-4">Equipos prestados por tipo</h2>
        <BarChart width={600} height={300} data={stats.equipmentByType}>
          <CartesianGrid strokeDasharray="3 3" stroke="#000" />
          <XAxis dataKey="type" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend payload={legendPayloadEquipos} />
          <Line type="monotone" dataKey="count" stroke="#8884d8" name="Cantidad" />
          <Bar dataKey="count">
            {stats.equipmentByType.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </div>

      {/* Usuarios más activos (BarChart) */}
      <div>
        <h2 className="text-xl font-bold mb-4">Usuarios más activos</h2>
        <BarChart width={600} height={300} data={stats.activeUsers}>
          <CartesianGrid strokeDasharray="3 3" stroke="#000" />
          <XAxis dataKey="username" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend payload={legendPayloadUsuarios} />
          <Bar dataKey="count">
            {stats.activeUsers.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </div>
    </div>
  );
}

export default Dashboard;

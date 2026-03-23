/**
 * Agency Hub — Reports Page
 * Design: Dark Luxury — gráficas de ingresos, tabla de pagos, resumen financiero
 */

import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Diamond,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";

const MONTHLY_DATA = [
  { month: "Oct", diamonds: 1840000, earnings: 9200, commission: 1840 },
  { month: "Nov", diamonds: 2120000, earnings: 10600, commission: 2120 },
  { month: "Dic", diamonds: 2680000, earnings: 13400, commission: 2680 },
  { month: "Ene", diamonds: 2340000, earnings: 11700, commission: 2340 },
  { month: "Feb", diamonds: 2520000, earnings: 12600, commission: 2520 },
  { month: "Mar", diamonds: 2847405, earnings: 14237, commission: 2847 },
];

const PIE_DATA = [
  { name: "Sofía Vargas", value: 312500, color: "#f59e0b" },
  { name: "Valentina Ríos", value: 284740, color: "#e8294c" },
  { name: "Mariana López", value: 156800, color: "#4f6ef7" },
  { name: "Carlos Mendoza", value: 198320, color: "#22c55e" },
  { name: "Diego Herrera", value: 87400, color: "#8b5cf6" },
  { name: "Andrés Castillo", value: 45200, color: "#06b6d4" },
];

const PAYMENT_HISTORY = [
  { id: "p1", streamer: "Sofía Vargas", period: "1-7 Mar 2026", diamonds: 78400, amount: 392.00, commission: 78.40, status: "pagado" },
  { id: "p2", streamer: "Valentina Ríos", period: "1-7 Mar 2026", diamonds: 71200, amount: 356.00, commission: 71.20, status: "pagado" },
  { id: "p3", streamer: "Carlos Mendoza", period: "1-7 Mar 2026", diamonds: 49600, amount: 248.00, commission: 49.60, status: "pagado" },
  { id: "p4", streamer: "Mariana López", period: "1-7 Mar 2026", diamonds: 39200, amount: 196.00, commission: 39.20, status: "pendiente" },
  { id: "p5", streamer: "Diego Herrera", period: "1-7 Mar 2026", diamonds: 21850, amount: 109.25, commission: 21.85, status: "pendiente" },
  { id: "p6", streamer: "Andrés Castillo", period: "1-7 Mar 2026", diamonds: 11300, amount: 56.50, commission: 11.30, status: "pendiente" },
];

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg px-3 py-2 text-sm" style={{ background: "oklch(0.22 0.02 265)", border: "1px solid oklch(1 0 0 / 15%)" }}>
        <p className="text-white/60 text-xs mb-1">{label}</p>
        <p className="text-white font-semibold">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const { streamers } = useApp();
  const [period, setPeriod] = useState("month");

  const totalEarnings = streamers.reduce((acc, s) => acc + s.earnings, 0);
  const totalCommission = streamers.reduce((acc, s) => acc + s.commission, 0);
  const totalDiamonds = streamers.reduce((acc, s) => acc + s.diamonds, 0);

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Ingresos Totales",
            value: `$${totalEarnings.toFixed(2)}`,
            sub: "USD este mes",
            change: "+13.5%",
            positive: true,
            icon: <DollarSign className="w-4 h-4" />,
            color: "#22c55e",
          },
          {
            title: "Comisión Agencia",
            value: `$${totalCommission.toFixed(2)}`,
            sub: "20% de ingresos",
            change: "+13.5%",
            positive: true,
            icon: <TrendingUp className="w-4 h-4" />,
            color: "#4f6ef7",
          },
          {
            title: "Diamantes Totales",
            value: totalDiamonds.toLocaleString(),
            sub: "Acumulados este mes",
            change: "+13.5%",
            positive: true,
            icon: <Diamond className="w-4 h-4" />,
            color: "#e8294c",
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl p-5"
            style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "oklch(0.60 0.01 265)" }}>
                {card.title}
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${card.color}20`, color: card.color }}>
                {card.icon}
              </div>
            </div>
            <div className="text-2xl font-bold text-white ah-number mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {card.value}
            </div>
            <div className="text-xs mb-2" style={{ color: "oklch(0.50 0.01 265)" }}>{card.sub}</div>
            <div className={`flex items-center gap-1 text-xs font-medium ${card.positive ? "text-green-400" : "text-red-400"}`}>
              {card.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {card.change} vs mes anterior
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Bar chart — monthly earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 rounded-xl p-5"
          style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Ingresos Mensuales
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "oklch(0.60 0.01 265)" }}>Últimos 6 meses (USD)</p>
            </div>
            <button
              onClick={() => toast.info("Exportando reporte...")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white transition-all"
              style={{ background: "oklch(0.22 0.02 265)" }}
            >
              <Download className="w-3 h-3" />
              Exportar
            </button>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "oklch(0.50 0.01 265)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.50 0.01 265)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="earnings" fill="#e8294c" radius={[4, 4, 0, 0]} />
              <Bar dataKey="commission" fill="#4f6ef7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>
              <span className="w-3 h-3 rounded-sm" style={{ background: "#e8294c" }} />
              Ingresos totales
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>
              <span className="w-3 h-3 rounded-sm" style={{ background: "#4f6ef7" }} />
              Comisión agencia
            </div>
          </div>
        </motion.div>

        {/* Pie chart — distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl p-5"
          style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <h3 className="font-semibold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Distribución
          </h3>
          <p className="text-xs mb-4" style={{ color: "oklch(0.60 0.01 265)" }}>Diamantes por streamer</p>

          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {PIE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${value.toLocaleString()} 💎`, ""]}
                contentStyle={{ background: "oklch(0.22 0.02 265)", border: "1px solid oklch(1 0 0 / 15%)", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "white" }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-1.5 mt-2">
            {PIE_DATA.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-xs text-white/70 flex-1 truncate">{item.name}</span>
                <span className="text-xs font-medium ah-number" style={{ color: item.color }}>
                  {(item.value / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Payment Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl overflow-hidden"
        style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Historial de Pagos
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>
            <Calendar className="w-3 h-3" />
            Semana 1-7 Mar 2026
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid oklch(1 0 0 / 6%)" }}>
                {["Streamer", "Período", "Diamantes", "Monto USD", "Comisión", "Estado"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "oklch(0.50 0.01 265)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAYMENT_HISTORY.map((payment, i) => (
                <tr
                  key={payment.id}
                  className="hover:bg-white/3 transition-colors"
                  style={{ borderBottom: i < PAYMENT_HISTORY.length - 1 ? "1px solid oklch(1 0 0 / 4%)" : "none" }}
                >
                  <td className="px-5 py-3 text-sm font-medium text-white">{payment.streamer}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "oklch(0.60 0.01 265)" }}>{payment.period}</td>
                  <td className="px-5 py-3 text-sm ah-number" style={{ color: "#f59e0b" }}>
                    {payment.diamonds.toLocaleString()} 💎
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold ah-number text-green-400">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-sm ah-number" style={{ color: "#4f6ef7" }}>
                    ${payment.commission.toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      payment.status === "pagado" ? "text-green-400" : "text-yellow-400"
                    }`} style={{
                      background: payment.status === "pagado" ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)"
                    }}>
                      {payment.status === "pagado" ? "Pagado" : "Pendiente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals row */}
        <div className="flex items-center justify-between px-5 py-4 border-t" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
          <span className="text-sm font-semibold text-white">Total Semana</span>
          <div className="flex items-center gap-6">
            <span className="text-sm ah-number" style={{ color: "#f59e0b" }}>
              {PAYMENT_HISTORY.reduce((a, p) => a + p.diamonds, 0).toLocaleString()} 💎
            </span>
            <span className="text-sm font-bold ah-number text-green-400">
              ${PAYMENT_HISTORY.reduce((a, p) => a + p.amount, 0).toFixed(2)}
            </span>
            <span className="text-sm font-bold ah-number" style={{ color: "#4f6ef7" }}>
              ${PAYMENT_HISTORY.reduce((a, p) => a + p.commission, 0).toFixed(2)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

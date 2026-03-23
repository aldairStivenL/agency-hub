/**
 * Agency Hub — Dashboard Page
 * Design: Dark Luxury — métricas en cards, gráfica de área roja, actividad reciente
 * Recharts para la gráfica de diamantes 24h
 */

import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import {
  Diamond,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Swords,
  Trophy,
  Radio,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data para la gráfica de 24 horas
const CHART_DATA = [
  { time: "0h", diamonds: 12400 },
  { time: "1h", diamonds: 18200 },
  { time: "2h", diamonds: 15800 },
  { time: "3h", diamonds: 22100 },
  { time: "4h", diamonds: 19500 },
  { time: "5h", diamonds: 28400 },
  { time: "6h", diamonds: 35200 },
  { time: "7h", diamonds: 42800 },
  { time: "8h", diamonds: 38600 },
  { time: "9h", diamonds: 55200 },
  { time: "10h", diamonds: 62400 },
  { time: "11h", diamonds: 58900 },
  { time: "12h", diamonds: 71200 },
  { time: "13h", diamonds: 68400 },
  { time: "14h", diamonds: 75800 },
  { time: "15h", diamonds: 72100 },
  { time: "16h", diamonds: 68900 },
  { time: "17h", diamonds: 78400 },
  { time: "18h", diamonds: 82100 },
  { time: "19h", diamonds: 79600 },
  { time: "20h", diamonds: 85200 },
  { time: "21h", diamonds: 78400 },
  { time: "22h", diamonds: 72100 },
  { time: "23h", diamonds: 65800 },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "battle_win", text: "Valentina Ríos ganó batalla vs MusicKing99", time: "hace 2h", color: "#22c55e" },
  { id: 2, type: "live", text: "Sofía Vargas entró en vivo — 1,240 espectadores", time: "hace 3h", color: "#4f6ef7" },
  { id: 3, type: "battle_loss", text: "Carlos Mendoza perdió batalla vs GameMaster_TK", time: "hace 5h", color: "#e8294c" },
  { id: 4, type: "diamond", text: "Nuevo récord: Sofía Vargas — 78,400 diamantes en batalla", time: "hace 1d", color: "#f59e0b" },
  { id: 5, type: "join", text: "Andrés Castillo se unió a la agencia", time: "hace 2d", color: "#8b5cf6" },
];

const TOP_STREAMERS = [
  { name: "Sofía Vargas", diamonds: 312500, rank: "Elite", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia&backgroundColor=c0aede" },
  { name: "Valentina Ríos", diamonds: 284740, rank: "Diamond", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=valentina&backgroundColor=b6e3f4" },
  { name: "Mariana López", diamonds: 156800, rank: "Gold", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mariana&backgroundColor=b6e3f4" },
];

const RANK_COLORS: Record<string, string> = {
  Elite: "#f59e0b",
  Diamond: "#60a5fa",
  Gold: "#fbbf24",
  Silver: "#94a3b8",
  Bronze: "#cd7f32",
};

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  accent: string;
  delay: number;
  subtitle?: string;
}

function MetricCard({ title, value, change, positive, icon, accent, delay, subtitle }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-xl p-5 relative overflow-hidden"
      style={{
        background: "oklch(0.16 0.015 265)",
        border: "1px solid oklch(1 0 0 / 8%)",
      }}
    >
      {/* Accent glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between mb-3">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "oklch(0.60 0.01 265)" }}>
          {title}
        </div>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}20` }}>
          <div style={{ color: accent }}>{icon}</div>
        </div>
      </div>

      <div className="ah-number text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {value}
      </div>

      {subtitle && (
        <div className="text-xs mb-2" style={{ color: "oklch(0.60 0.01 265)" }}>{subtitle}</div>
      )}

      <div className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-green-400" : "text-red-400"}`}>
        {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {change}
      </div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg px-3 py-2 text-sm" style={{ background: "oklch(0.22 0.02 265)", border: "1px solid oklch(1 0 0 / 15%)" }}>
        <p className="text-white/60 text-xs mb-1">{label}</p>
        <p className="text-white font-semibold ah-number">{payload[0].value.toLocaleString()} 💎</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { streamers, battles } = useApp();

  const totalDiamonds = streamers.reduce((acc, s) => acc + s.diamonds, 0);
  const prevDiamonds = streamers.reduce((acc, s) => acc + s.diamondsPrev, 0);
  const diamondChange = ((totalDiamonds - prevDiamonds) / prevDiamonds * 100).toFixed(1);
  const liveCount = streamers.filter(s => s.isLive).length;
  const totalEarnings = streamers.reduce((acc, s) => acc + s.earnings, 0);
  const totalCommission = streamers.reduce((acc, s) => acc + s.commission, 0);
  const pendingBattles = battles.filter(b => b.result === "pending").length;
  const wonBattles = battles.filter(b => b.result === "win").length;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Diamantes de Agencia"
          value={totalDiamonds.toLocaleString()}
          change={`+${diamondChange}% del mes pasado`}
          positive={true}
          icon={<Diamond className="w-4 h-4" />}
          accent="#e8294c"
          delay={0.05}
        />
        <MetricCard
          title="Streamers Activos"
          value={streamers.length.toString()}
          change={`${liveCount} en vivo ahora`}
          positive={true}
          icon={<Radio className="w-4 h-4" />}
          accent="#4f6ef7"
          delay={0.1}
          subtitle={`${liveCount} en vivo`}
        />
        <MetricCard
          title="Ingresos Totales (USD)"
          value={`$${totalEarnings.toFixed(2)}`}
          change="Diamantes × 80/05"
          positive={true}
          icon={<DollarSign className="w-4 h-4" />}
          accent="#22c55e"
          delay={0.15}
        />
        <MetricCard
          title="Comisión de Agencia"
          value={`$${totalCommission.toFixed(2)}`}
          change="20% de ingresos totales"
          positive={true}
          icon={<TrendingUp className="w-4 h-4" />}
          accent="#f59e0b"
          delay={0.2}
        />
      </div>

      {/* Chart + Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="xl:col-span-2 rounded-xl p-5"
          style={{
            background: "oklch(0.16 0.015 265)",
            border: "1px solid oklch(1 0 0 / 8%)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Rendimiento 24 Horas
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "oklch(0.60 0.01 265)" }}>
                Acumulación de diamantes y streamers activos
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: "oklch(0.60 0.01 265)" }}>
              <span className="w-3 h-3 rounded-full" style={{ background: "#e8294c" }} />
              Diamantes
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={CHART_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="diamondGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e8294c" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#e8294c" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: "oklch(0.50 0.01 265)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={3}
              />
              <YAxis
                tick={{ fill: "oklch(0.50 0.01 265)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="diamonds"
                stroke="#e8294c"
                strokeWidth={2}
                fill="url(#diamondGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Streamers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-xl p-5"
          style={{
            background: "oklch(0.16 0.015 265)",
            border: "1px solid oklch(1 0 0 / 8%)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <h3 className="text-white font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Top Streamers
            </h3>
          </div>

          <div className="space-y-3">
            {TOP_STREAMERS.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="text-xs font-bold w-5 text-center" style={{ color: i === 0 ? "#f59e0b" : "oklch(0.50 0.01 265)" }}>
                  #{i + 1}
                </div>
                <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{s.name}</div>
                  <div className="text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>
                    {s.diamonds.toLocaleString()} 💎
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${RANK_COLORS[s.rank]}20`, color: RANK_COLORS[s.rank] }}>
                  {s.rank}
                </span>
              </div>
            ))}
          </div>

          {/* Battle stats */}
          <div className="mt-5 pt-4 border-t" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Swords className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Batallas
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg p-3 text-center" style={{ background: "oklch(0.20 0.015 265)" }}>
                <div className="text-xl font-bold text-green-400 ah-number">{wonBattles}</div>
                <div className="text-xs mt-0.5" style={{ color: "oklch(0.50 0.01 265)" }}>Ganadas</div>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ background: "oklch(0.20 0.015 265)" }}>
                <div className="text-xl font-bold text-yellow-400 ah-number">{pendingBattles}</div>
                <div className="text-xs mt-0.5" style={{ color: "oklch(0.50 0.01 265)" }}>Pendientes</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Activity + Live Streamers */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="rounded-xl p-5"
          style={{
            background: "oklch(0.16 0.015 265)",
            border: "1px solid oklch(1 0 0 / 8%)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Actividad Reciente
            </h3>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 leading-snug">{item.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: "oklch(0.50 0.01 265)" }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live Streamers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-xl p-5"
          style={{
            background: "oklch(0.16 0.015 265)",
            border: "1px solid oklch(1 0 0 / 8%)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Radio className="w-4 h-4 text-red-400" />
            <h3 className="text-white font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              En Vivo Ahora
            </h3>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: "rgba(232,41,76,0.15)", color: "#e8294c" }}>
              {liveCount} activos
            </span>
          </div>
          <div className="space-y-3">
            {streamers.filter(s => s.isLive).map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "oklch(0.20 0.015 265)" }}>
                <div className="relative">
                  <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-red-500 border-2"
                    style={{ borderColor: "oklch(0.20 0.015 265)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{s.name}</div>
                  <div className="text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>{s.tiktokUser}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold ah-number" style={{ color: "#e8294c" }}>
                    {s.diamonds.toLocaleString()}
                  </div>
                  <div className="text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>💎 hoy</div>
                </div>
              </div>
            ))}
            {streamers.filter(s => !s.isLive).slice(0, 2).map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg opacity-50" style={{ background: "oklch(0.20 0.015 265)" }}>
                <div className="relative">
                  <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full grayscale" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-gray-500 border-2"
                    style={{ borderColor: "oklch(0.20 0.015 265)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{s.name}</div>
                  <div className="text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>Offline</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

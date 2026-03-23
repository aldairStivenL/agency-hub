/**
 * Agency Hub — StreamerView Page
 * Design: Dark Luxury — vista personal del streamer con stats, pagos y batallas
 * Accesible desde el selector de perfil como "Streamer"
 */

import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Diamond,
  Trophy,
  Swords,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Radio,
  Calendar,
  LogOut,
  Star,
  Clock,
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

const LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663455864775/gVC6y5Q2wpNYr4v7JmuSu6/agency-hub-logo-D42x3YiMh7exopMvRVDsmF.webp";

const RANK_COLORS: Record<string, string> = {
  Elite: "#f59e0b",
  Diamond: "#60a5fa",
  Gold: "#fbbf24",
  Silver: "#94a3b8",
  Bronze: "#cd7f32",
};

const WEEKLY_DATA = [
  { day: "Lun", diamonds: 18400 },
  { day: "Mar", diamonds: 24200 },
  { day: "Mié", diamonds: 19800 },
  { day: "Jue", diamonds: 31200 },
  { day: "Vie", diamonds: 28400 },
  { day: "Sáb", diamonds: 42100 },
  { day: "Dom", diamonds: 38600 },
];

const PAYMENT_HISTORY = [
  { period: "1-7 Mar 2026", diamonds: 78400, amount: 392.00, status: "pagado" },
  { period: "22-28 Feb 2026", diamonds: 71200, amount: 356.00, status: "pagado" },
  { period: "15-21 Feb 2026", diamonds: 65800, amount: 329.00, status: "pagado" },
  { period: "8-14 Feb 2026", diamonds: 58900, amount: 294.50, status: "pagado" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg px-3 py-2 text-sm" style={{ background: "oklch(0.22 0.02 265)", border: "1px solid oklch(1 0 0 / 15%)" }}>
        <p className="text-white/60 text-xs mb-1">{label}</p>
        <p className="text-white font-semibold">{payload[0].value.toLocaleString()} 💎</p>
      </div>
    );
  }
  return null;
};

export default function StreamerView() {
  const { streamers, battles, setRole } = useApp();
  // Show the top streamer as the "logged in" streamer
  const streamer = streamers[0];
  const myBattles = battles.filter(b => b.streamerId === streamer.id);

  const diamondChange = ((streamer.diamonds - streamer.diamondsPrev) / streamer.diamondsPrev * 100).toFixed(1);
  const positive = streamer.diamonds >= streamer.diamondsPrev;
  const winRate = streamer.battles > 0 ? ((streamer.wins / streamer.battles) * 100).toFixed(0) : "0";

  return (
    <div className="min-h-screen" style={{ background: "#0f1117" }}>
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b" style={{ borderColor: "oklch(1 0 0 / 6%)", background: "oklch(0.14 0.015 265)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden">
            <img src={LOGO} alt="AH" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-white font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Agency Hub</div>
            <div className="text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>Vista Streamer</div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {streamer.isLive && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 px-2.5 py-1 rounded-full animate-pulse"
              style={{ background: "rgba(232,41,76,0.15)" }}>
              <Radio className="w-3 h-3" />
              EN VIVO
            </span>
          )}
          <button
            onClick={() => setRole(null)}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-all px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Salir
          </button>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl"
            style={{ background: RANK_COLORS[streamer.rank] }} />

          <div className="flex items-center gap-5">
            <div className="relative">
              <img src={streamer.avatar} alt={streamer.name} className="w-20 h-20 rounded-2xl" />
              {streamer.isLive && (
                <span className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full font-bold text-white animate-pulse"
                  style={{ background: "#e8294c" }}>
                  LIVE
                </span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {streamer.name}
              </h1>
              <div className="text-sm mb-2" style={{ color: "oklch(0.60 0.01 265)" }}>{streamer.tiktokUser}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm px-3 py-1 rounded-full font-semibold"
                  style={{ background: `${RANK_COLORS[streamer.rank]}20`, color: RANK_COLORS[streamer.rank] }}>
                  <Star className="w-3 h-3 inline mr-1" />
                  {streamer.rank}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "oklch(0.22 0.02 265)", color: "oklch(0.60 0.01 265)" }}>
                  Miembro desde {streamer.joinDate}
                </span>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-3xl font-bold text-white ah-number" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {streamer.followers.toLocaleString()}
              </div>
              <div className="text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>seguidores</div>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Diamantes Totales",
              value: streamer.diamonds.toLocaleString(),
              suffix: "💎",
              change: `${positive ? "+" : ""}${diamondChange}%`,
              positive,
              color: "#e8294c",
            },
            {
              label: "Mis Ingresos",
              value: `$${(streamer.earnings * 0.8).toFixed(2)}`,
              suffix: "",
              change: "80% de ganancias",
              positive: true,
              color: "#22c55e",
            },
            {
              label: "Batallas",
              value: `${streamer.wins}/${streamer.battles}`,
              suffix: "",
              change: `${winRate}% victorias`,
              positive: true,
              color: "#4f6ef7",
            },
            {
              label: "Próximo Pago",
              value: "$392.00",
              suffix: "",
              change: "Lunes próximo",
              positive: true,
              color: "#f59e0b",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl p-4"
              style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
            >
              <div className="text-xs mb-2" style={{ color: "oklch(0.50 0.01 265)" }}>{stat.label}</div>
              <div className="text-xl font-bold ah-number" style={{ color: stat.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.value} {stat.suffix}
              </div>
              <div className={`flex items-center gap-1 text-xs mt-1 ${stat.positive ? "text-green-400" : "text-red-400"}`}>
                {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Weekly chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl p-5"
          style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <h3 className="font-semibold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Diamantes esta Semana
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={WEEKLY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e8294c" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#e8294c" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "oklch(0.50 0.01 265)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.50 0.01 265)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="diamonds" stroke="#e8294c" strokeWidth={2} fill="url(#weekGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* My battles + Payment history */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* My battles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl p-5"
            style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Swords className="w-4 h-4 text-red-400" />
              <h3 className="font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Mis Batallas
              </h3>
            </div>
            <div className="space-y-2">
              {myBattles.length > 0 ? myBattles.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "oklch(0.20 0.015 265)" }}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${b.result === "win" ? "bg-green-400" : b.result === "loss" ? "bg-red-400" : "bg-yellow-400"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">vs {b.rivalName}</div>
                    <div className="text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>{b.date}</div>
                  </div>
                  <span className={`text-xs font-semibold ${b.result === "win" ? "text-green-400" : b.result === "loss" ? "text-red-400" : "text-yellow-400"}`}>
                    {b.result === "win" ? "Victoria" : b.result === "loss" ? "Derrota" : "Pendiente"}
                  </span>
                </div>
              )) : (
                <div className="text-center py-6 text-sm" style={{ color: "oklch(0.50 0.01 265)" }}>
                  No hay batallas registradas
                </div>
              )}
            </div>
          </motion.div>

          {/* Payment history */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl p-5"
            style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-green-400" />
              <h3 className="font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Historial de Pagos
              </h3>
            </div>
            <div className="space-y-2">
              {PAYMENT_HISTORY.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "oklch(0.20 0.015 265)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(34,197,94,0.15)" }}>
                    <DollarSign className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white">{p.period}</div>
                    <div className="text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>{p.diamonds.toLocaleString()} 💎</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-400 ah-number">${p.amount.toFixed(2)}</div>
                    <div className="text-xs text-green-400/60">Pagado</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

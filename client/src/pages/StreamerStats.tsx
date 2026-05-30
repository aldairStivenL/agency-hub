/**
 * StreamerStats — Panel de estadísticas de un streamer
 * Usado por:
 *   - StreamerPublicView (acceso público por link)
 *   - Streamers.tsx admin (al hacer clic en "Ver stats")
 */

import { motion } from "framer-motion";
import { Trophy, Swords, Diamond, TrendingUp, TrendingDown, Radio, Star, Calendar } from "lucide-react";

const RANK_COLORS: Record<string, string> = {
  Bronze:  "#cd7f32",
  Silver:  "#c0c0c0",
  Gold:    "#ffd700",
  Diamond: "#b9f2ff",
  Elite:   "#e8294c",
};

export interface StreamerStatsData {
  id: string;
  tiktok_user: string;
  nickname: string;
  avatar: string | null;
  bio: string | null;
  rank: string;
  diamonds: number;
  diamonds_prev: number;
  seguidores: number | null;
  verificado: boolean;
  is_live: boolean;
  commission: number;
  earnings: number;
  joined_at: string;
  battle_wins: number;
  battle_losses: number;
  battle_pending: number;
  battle_cancelled: number;
  diamonds_from_battles: number;
}

function formatNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es", { day: "2-digit", month: "long", year: "numeric" });
}

export default function StreamerStats({ data }: { data: StreamerStatsData }) {
  const totalBattles  = data.battle_wins + data.battle_losses + data.battle_pending + data.battle_cancelled;
  const winRate       = totalBattles > 0 ? ((data.battle_wins / (data.battle_wins + data.battle_losses || 1)) * 100).toFixed(0) : "—";
  const diamondChange = data.diamonds_prev > 0
    ? ((data.diamonds - data.diamonds_prev) / data.diamonds_prev * 100).toFixed(1)
    : null;
  const positive      = data.diamonds >= data.diamonds_prev;
  const rankColor     = RANK_COLORS[data.rank] ?? "#fff";

  return (
    <div className="space-y-5">

      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}>

        {/* Glow bg */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at top left, ${rankColor}10, transparent 60%)` }} />

        <div className="relative flex items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-[-3px] rounded-2xl"
              style={{ background: `linear-gradient(135deg, ${rankColor}, transparent)`, opacity: 0.6 }} />
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden"
              style={{ border: `2px solid ${rankColor}40` }}>
              {data.avatar
                ? <img src={data.avatar} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/50"
                    style={{ background: "oklch(0.20 0.015 265)" }}>
                    {data.nickname.charAt(0).toUpperCase()}
                  </div>}
            </div>
            {data.is_live && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-px rounded-full text-[10px] font-bold text-white whitespace-nowrap"
                style={{ background: "#e8294c", boxShadow: "0 0 8px rgba(232,41,76,0.6)" }}>
                <Radio className="w-2.5 h-2.5" /> LIVE
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {data.nickname}
              </h2>
              {data.verificado && <span className="text-blue-400 text-sm">✓</span>}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{ background: `${rankColor}20`, color: rankColor, border: `1px solid ${rankColor}40` }}>
                {data.rank}
              </span>
            </div>
            <div className="font-mono text-sm mt-0.5" style={{ color: "oklch(0.50 0.01 265)" }}>
              @{data.tiktok_user}
            </div>
            {data.bio && (
              <p className="text-sm mt-2 line-clamp-2" style={{ color: "oklch(0.60 0.01 265)" }}>{data.bio}</p>
            )}
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono" style={{ color: "oklch(0.45 0.01 265)" }}>
              <Calendar className="w-3 h-3" />
              Desde {formatDate(data.joined_at)}
            </div>
          </div>

          {/* Seguidores (si disponible) */}
          {data.seguidores !== null && data.seguidores > 0 && (
            <div className="hidden md:block text-right flex-shrink-0">
              <div className="font-mono font-bold text-2xl text-white">{formatNum(data.seguidores)}</div>
              <div className="text-xs uppercase tracking-wide mt-0.5" style={{ color: "oklch(0.45 0.01 265)" }}>Seguidores</div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            icon: Diamond,
            label: "Diamantes",
            value: formatNum(data.diamonds),
            sub: diamondChange
              ? <span className={`flex items-center gap-0.5 text-xs font-mono ${positive ? "text-green-400" : "text-red-400"}`}>
                  {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {positive ? "+" : ""}{diamondChange}%
                </span>
              : null,
            color: "#b9f2ff",
          },
          {
            icon: Trophy,
            label: "Victorias",
            value: data.battle_wins,
            sub: <span className="text-xs font-mono" style={{ color: "oklch(0.45 0.01 265)" }}>{winRate}% win rate</span>,
            color: "#22c55e",
          },
          {
            icon: Swords,
            label: "Batallas",
            value: totalBattles,
            sub: <span className="text-xs font-mono" style={{ color: "oklch(0.45 0.01 265)" }}>{data.battle_pending} pendientes</span>,
            color: "#e8294c",
          },
          {
            icon: Star,
            label: "Ganancias",
            value: `$${data.earnings.toFixed(2)}`,
            sub: <span className="text-xs font-mono" style={{ color: "oklch(0.45 0.01 265)" }}>{data.commission}% comisión</span>,
            color: "#f59e0b",
          },
        ].map((m, i) => (
          <motion.div key={m.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.05 }}
            className="rounded-xl p-4"
            style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}>
            <div className="flex items-center gap-2 mb-2">
              <m.icon className="w-4 h-4" style={{ color: m.color }} />
              <span className="text-xs uppercase tracking-wide" style={{ color: "oklch(0.50 0.01 265)" }}>{m.label}</span>
            </div>
            <div className="font-bold text-2xl text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {m.value}
            </div>
            {m.sub && <div className="mt-1">{m.sub}</div>}
          </motion.div>
        ))}
      </div>

      {/* Batallas breakdown */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}>

        <div className="px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest"
          style={{ borderBottom: "1px solid oklch(1 0 0 / 6%)", color: "oklch(0.50 0.01 265)" }}>
          ⚔️ Historial de Batallas
        </div>

        <div className="grid grid-cols-4 divide-x" style={{ borderColor: "oklch(1 0 0 / 6%)" }}>
          {[
            { label: "Victorias",  value: data.battle_wins,      color: "#22c55e" },
            { label: "Derrotas",   value: data.battle_losses,    color: "#e8294c" },
            { label: "Pendientes", value: data.battle_pending,   color: "#f59e0b" },
            { label: "Canceladas", value: data.battle_cancelled, color: "#6b7280" },
          ].map(s => (
            <div key={s.label} className="py-4 text-center" style={{ borderColor: "oklch(1 0 0 / 6%)" }}>
              <div className="font-bold text-2xl" style={{ color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                {s.value}
              </div>
              <div className="text-xs mt-1 uppercase tracking-wide" style={{ color: "oklch(0.45 0.01 265)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Win rate bar */}
        {(data.battle_wins + data.battle_losses) > 0 && (
          <div className="px-5 pb-4">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "oklch(0.12 0.015 265)" }}>
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${(data.battle_wins / (data.battle_wins + data.battle_losses)) * 100}%`,
                  background: "linear-gradient(90deg, #22c55e, #16a34a)",
                }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs font-mono text-green-400">{winRate}% victorias</span>
              <span className="text-xs font-mono" style={{ color: "oklch(0.45 0.01 265)" }}>
                💎 {formatNum(data.diamonds_from_battles)} en batallas
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
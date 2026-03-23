/**
 * Agency Hub — Streamers Page
 * Design: Dark Luxury — tabla de streamers con filtros, badges de rango, modal de detalle
 */

import { useApp } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Search,
  Plus,
  Diamond,
  Radio,
  Phone,
  Mail,
  X,
  Trophy,
  Swords,
  TrendingUp,
  TrendingDown,
  Star,
  ExternalLink,
  MessageCircle,
  Users,
} from "lucide-react";
import type { Streamer } from "@/contexts/AppContext";
import { toast } from "sonner";

const RANK_COLORS: Record<string, string> = {
  Elite: "#f59e0b",
  Diamond: "#60a5fa",
  Gold: "#fbbf24",
  Silver: "#94a3b8",
  Bronze: "#cd7f32",
};

const RANK_ORDER = ["Elite", "Diamond", "Gold", "Silver", "Bronze"];

function StreamerModal({ streamer, onClose }: { streamer: Streamer; onClose: () => void }) {
  const diamondChange = ((streamer.diamonds - streamer.diamondsPrev) / streamer.diamondsPrev * 100).toFixed(1);
  const positive = streamer.diamonds >= streamer.diamondsPrev;
  const winRate = streamer.battles > 0 ? ((streamer.wins / streamer.battles) * 100).toFixed(0) : "0";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: "oklch(0.16 0.015 265)",
          border: "1px solid oklch(1 0 0 / 10%)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 pb-4">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl"
            style={{ background: RANK_COLORS[streamer.rank] }} />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={streamer.avatar} alt={streamer.name} className="w-16 h-16 rounded-2xl" />
              {streamer.isLive && (
                <span className="absolute -bottom-1 -right-1 text-xs px-1.5 py-0.5 rounded-full font-bold text-white"
                  style={{ background: "#e8294c" }}>
                  LIVE
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {streamer.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm" style={{ color: "oklch(0.60 0.01 265)" }}>{streamer.tiktokUser}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: `${RANK_COLORS[streamer.rank]}20`, color: RANK_COLORS[streamer.rank] }}>
                  {streamer.rank}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-6 pb-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3" style={{ background: "oklch(0.20 0.015 265)" }}>
            <div className="text-xs mb-1" style={{ color: "oklch(0.50 0.01 265)" }}>Diamantes Totales</div>
            <div className="text-lg font-bold text-white ah-number">{streamer.diamonds.toLocaleString()} 💎</div>
            <div className={`flex items-center gap-1 text-xs mt-1 ${positive ? "text-green-400" : "text-red-400"}`}>
              {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {positive ? "+" : ""}{diamondChange}% vs mes anterior
            </div>
          </div>
          <div className="rounded-xl p-3" style={{ background: "oklch(0.20 0.015 265)" }}>
            <div className="text-xs mb-1" style={{ color: "oklch(0.50 0.01 265)" }}>Seguidores</div>
            <div className="text-lg font-bold text-white ah-number">{streamer.followers.toLocaleString()}</div>
            <div className="text-xs mt-1" style={{ color: "oklch(0.50 0.01 265)" }}>Seguidores en TikTok</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: "oklch(0.20 0.015 265)" }}>
            <div className="text-xs mb-1" style={{ color: "oklch(0.50 0.01 265)" }}>Ingresos Totales</div>
            <div className="text-lg font-bold text-green-400 ah-number">${streamer.earnings.toFixed(2)}</div>
            <div className="text-xs mt-1" style={{ color: "oklch(0.50 0.01 265)" }}>USD generados</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: "oklch(0.20 0.015 265)" }}>
            <div className="text-xs mb-1" style={{ color: "oklch(0.50 0.01 265)" }}>Batallas</div>
            <div className="text-lg font-bold text-white ah-number">{streamer.wins}/{streamer.battles}</div>
            <div className="text-xs mt-1 text-yellow-400">{winRate}% tasa de victoria</div>
          </div>
        </div>

        {/* Contact */}
        <div className="px-6 pb-4">
          <div className="rounded-xl p-4 space-y-2" style={{ background: "oklch(0.20 0.015 265)" }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "oklch(0.50 0.01 265)" }}>
              Contacto
            </div>
            {streamer.phone && (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="w-4 h-4 text-green-400" />
                {streamer.phone}
              </div>
            )}
            {streamer.email && (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="w-4 h-4 text-blue-400" />
                {streamer.email}
              </div>
            )}
            {streamer.notes && (
              <div className="flex items-start gap-2 text-sm text-white/70 mt-2">
                <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>{streamer.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-2">
          <button
            onClick={() => { toast.success("Abriendo WhatsApp..."); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #25d366, #128c7e)" }}
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
          <button
            onClick={() => { toast.success("Abriendo perfil de TikTok..."); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}
          >
            <ExternalLink className="w-4 h-4" />
            Ver TikTok
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function StreamersPage() {
  const { streamers } = useApp();
  const [search, setSearch] = useState("");
  const [filterRank, setFilterRank] = useState<string>("all");
  const [filterLive, setFilterLive] = useState(false);
  const [selectedStreamer, setSelectedStreamer] = useState<Streamer | null>(null);

  const filtered = streamers.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.tiktokUser.toLowerCase().includes(search.toLowerCase());
    const matchRank = filterRank === "all" || s.rank === filterRank;
    const matchLive = !filterLive || s.isLive;
    return matchSearch && matchRank && matchLive;
  });

  return (
    <div className="space-y-5">
      {/* Header controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "oklch(0.50 0.01 265)" }} />
          <input
            type="text"
            placeholder="Buscar streamer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:ring-1 focus:ring-red-500/50 transition-all"
            style={{ background: "oklch(0.20 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
          />
        </div>

        {/* Rank filter */}
        <div className="flex items-center gap-1.5">
          {["all", ...RANK_ORDER].map((rank) => (
            <button
              key={rank}
              onClick={() => setFilterRank(rank)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterRank === rank ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
              style={filterRank === rank ? {
                background: rank === "all" ? "rgba(232,41,76,0.2)" : `${RANK_COLORS[rank]}20`,
                color: rank === "all" ? "#e8294c" : RANK_COLORS[rank],
              } : { background: "oklch(0.20 0.015 265)" }}
            >
              {rank === "all" ? "Todos" : rank}
            </button>
          ))}
        </div>

        {/* Live filter */}
        <button
          onClick={() => setFilterLive(!filterLive)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filterLive ? "text-red-400" : "text-white/40 hover:text-white/70"
          }`}
          style={{ background: filterLive ? "rgba(232,41,76,0.15)" : "oklch(0.20 0.015 265)" }}
        >
          <Radio className="w-3 h-3" />
          Solo en vivo
        </button>

        {/* Add streamer */}
        <button
          onClick={() => toast.info("Función de agregar streamer próximamente")}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 ml-auto"
          style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </motion.div>

      {/* Streamers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((streamer, i) => {
          const diamondChange = ((streamer.diamonds - streamer.diamondsPrev) / streamer.diamondsPrev * 100).toFixed(1);
          const positive = streamer.diamonds >= streamer.diamondsPrev;
          const winRate = streamer.battles > 0 ? ((streamer.wins / streamer.battles) * 100).toFixed(0) : "0";

          return (
            <motion.div
              key={streamer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedStreamer(streamer)}
              className="rounded-xl p-5 cursor-pointer group hover:border-white/20 transition-all duration-300"
              style={{
                background: "oklch(0.16 0.015 265)",
                border: "1px solid oklch(1 0 0 / 8%)",
              }}
            >
              {/* Card header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="relative">
                  <img src={streamer.avatar} alt={streamer.name} className="w-12 h-12 rounded-xl" />
                  {streamer.isLive && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2"
                      style={{ borderColor: "oklch(0.16 0.015 265)" }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {streamer.name}
                    </h3>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "oklch(0.50 0.01 265)" }}>{streamer.tiktokUser}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: `${RANK_COLORS[streamer.rank]}20`, color: RANK_COLORS[streamer.rank] }}>
                      {streamer.rank}
                    </span>
                    {streamer.isLive && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white animate-pulse"
                        style={{ background: "rgba(232,41,76,0.3)" }}>
                        LIVE
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg p-2 text-center" style={{ background: "oklch(0.20 0.015 265)" }}>
                  <Diamond className="w-3 h-3 mx-auto mb-1 text-red-400" />
                  <div className="text-xs font-bold text-white ah-number">{(streamer.diamonds / 1000).toFixed(0)}k</div>
                  <div className="text-xs" style={{ color: "oklch(0.45 0.01 265)" }}>Diamantes</div>
                </div>
                <div className="rounded-lg p-2 text-center" style={{ background: "oklch(0.20 0.015 265)" }}>
                  <Swords className="w-3 h-3 mx-auto mb-1 text-blue-400" />
                  <div className="text-xs font-bold text-white ah-number">{winRate}%</div>
                  <div className="text-xs" style={{ color: "oklch(0.45 0.01 265)" }}>Victorias</div>
                </div>
                <div className="rounded-lg p-2 text-center" style={{ background: "oklch(0.20 0.015 265)" }}>
                  <Trophy className="w-3 h-3 mx-auto mb-1 text-yellow-400" />
                  <div className="text-xs font-bold text-green-400 ah-number">${(streamer.earnings / 1000).toFixed(1)}k</div>
                  <div className="text-xs" style={{ color: "oklch(0.45 0.01 265)" }}>USD</div>
                </div>
              </div>

              {/* Change indicator */}
              <div className={`flex items-center gap-1 text-xs mt-3 ${positive ? "text-green-400" : "text-red-400"}`}>
                {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {positive ? "+" : ""}{diamondChange}% vs mes anterior
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: "oklch(0.50 0.01 265)" }}>
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No se encontraron streamers</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedStreamer && (
          <StreamerModal streamer={selectedStreamer} onClose={() => setSelectedStreamer(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

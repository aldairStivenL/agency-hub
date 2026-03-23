/**
 * Agency Hub — Battles Page
 * Design: Dark Luxury — lista de batallas, generador de flyers, visualización de rivales
 * Generación de flyer: canvas HTML con diseño VS
 */

import { useApp } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import {
  Swords,
  Plus,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Download,
  Eye,
  Calendar,
  Building2,
  X,
  Sparkles,
  Share2,
} from "lucide-react";
import type { Battle } from "@/contexts/AppContext";
import { toast } from "sonner";

const BATTLE_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663455864775/gVC6y5Q2wpNYr4v7JmuSu6/agency-hub-battle-banner-Gd5ECkyB3Sx2o4hUhGHkpe.webp";

const RESULT_CONFIG = {
  win: { label: "Victoria", color: "#22c55e", icon: Trophy },
  loss: { label: "Derrota", color: "#e8294c", icon: XCircle },
  pending: { label: "Pendiente", color: "#f59e0b", icon: Clock },
};

interface FlyerModalProps {
  battle: Battle;
  onClose: () => void;
}

function FlyerModal({ battle, onClose }: FlyerModalProps) {
  const { streamers } = useApp();
  const streamer = streamers.find(s => s.id === battle.streamerId);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      toast.success("¡Flyer generado exitosamente!");
    }, 2000);
  };

  const handleDownload = () => {
    toast.success("Descargando flyer...");
  };

  const handleShare = () => {
    toast.success("Compartiendo flyer...");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{
          background: "oklch(0.16 0.015 265)",
          border: "1px solid oklch(1 0 0 / 10%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Generador de Flyer
            </h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Flyer Preview */}
        <div className="p-6">
          <div
            className="relative rounded-xl overflow-hidden aspect-video flex items-center justify-center"
            style={{ background: "#0a0a14" }}
          >
            <img
              src={BATTLE_BG}
              alt="Battle background"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(232,41,76,0.3), transparent, rgba(79,110,247,0.3))" }} />

            {/* Content overlay */}
            <div className="relative z-10 w-full px-8 py-6">
              {/* Title */}
              <div className="text-center mb-4">
                <div className="text-xs font-bold tracking-widest text-white/60 uppercase mb-1">Batalla Oficial TikTok LIVE</div>
                <div className="text-white/40 text-xs">{battle.date} — {battle.time}</div>
              </div>

              {/* VS layout */}
              <div className="flex items-center justify-between">
                {/* Our streamer */}
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden border-2 border-red-500"
                    style={{ boxShadow: "0 0 20px rgba(232,41,76,0.6)" }}>
                    <img src={streamer?.avatar} alt={streamer?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-white font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {battle.streamerName}
                  </div>
                  <div className="text-red-400 text-xs">Agency Hub</div>
                </div>

                {/* VS */}
                <div className="px-4">
                  <div className="text-4xl font-black text-white" style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    textShadow: "0 0 30px rgba(255,255,255,0.5)",
                    WebkitTextStroke: "1px rgba(255,255,255,0.3)"
                  }}>
                    VS
                  </div>
                </div>

                {/* Rival */}
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden border-2 border-blue-500"
                    style={{ boxShadow: "0 0 20px rgba(79,110,247,0.6)", background: "linear-gradient(135deg, #4f6ef7, #2563eb)" }}>
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                      {battle.rivalName.charAt(0)}
                    </div>
                  </div>
                  <div className="text-white font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {battle.rivalName}
                  </div>
                  <div className="text-blue-400 text-xs">{battle.rivalAgency}</div>
                </div>
              </div>

              {/* Agency Hub watermark */}
              <div className="text-center mt-4">
                <div className="text-white/30 text-xs tracking-widest uppercase">Agency Hub • TikTok LIVE</div>
              </div>
            </div>
          </div>

          {/* Battle info */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3" style={{ background: "oklch(0.20 0.015 265)" }}>
              <div className="text-xs mb-1" style={{ color: "oklch(0.50 0.01 265)" }}>Nuestro Streamer</div>
              <div className="text-sm font-semibold text-white">{battle.streamerName}</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: "oklch(0.20 0.015 265)" }}>
              <div className="text-xs mb-1" style={{ color: "oklch(0.50 0.01 265)" }}>Rival</div>
              <div className="text-sm font-semibold text-white">{battle.rivalName}</div>
              <div className="text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>{battle.rivalAgency}</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: "oklch(0.20 0.015 265)" }}>
              <div className="text-xs mb-1" style={{ color: "oklch(0.50 0.01 265)" }}>Fecha y Hora</div>
              <div className="text-sm font-semibold text-white">{battle.date}</div>
              <div className="text-xs text-blue-400">{battle.time}</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: "oklch(0.20 0.015 265)" }}>
              <div className="text-xs mb-1" style={{ color: "oklch(0.50 0.01 265)" }}>Tipo</div>
              <div className="text-sm font-semibold text-white capitalize">{battle.type === "official" ? "Oficial" : "Amistosa"}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            {!generated ? (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generar Flyer
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
                >
                  <Download className="w-4 h-4" />
                  Descargar
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #4f6ef7, #3b5bdb)" }}
                >
                  <Share2 className="w-4 h-4" />
                  Compartir
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface NewBattleModalProps {
  onClose: () => void;
}

function NewBattleModal({ onClose }: NewBattleModalProps) {
  const { streamers } = useApp();
  const [form, setForm] = useState({
    streamerId: "",
    rivalName: "",
    rivalAgency: "",
    date: "",
    time: "",
    type: "official",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Batalla programada exitosamente");
    onClose();
  };

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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 10%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
          <h3 className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Nueva Batalla
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "oklch(0.60 0.01 265)" }}>
              Streamer
            </label>
            <select
              value={form.streamerId}
              onChange={(e) => setForm({ ...form, streamerId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
              style={{ background: "oklch(0.20 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
              required
            >
              <option value="">Seleccionar streamer...</option>
              {streamers.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.tiktokUser})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "oklch(0.60 0.01 265)" }}>
                Nombre del Rival
              </label>
              <input
                type="text"
                value={form.rivalName}
                onChange={(e) => setForm({ ...form, rivalName: e.target.value })}
                placeholder="@rival_tiktok"
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                style={{ background: "oklch(0.20 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "oklch(0.60 0.01 265)" }}>
                Agencia Rival
              </label>
              <input
                type="text"
                value={form.rivalAgency}
                onChange={(e) => setForm({ ...form, rivalAgency: e.target.value })}
                placeholder="Nombre de agencia"
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                style={{ background: "oklch(0.20 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "oklch(0.60 0.01 265)" }}>
                Fecha
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                style={{ background: "oklch(0.20 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)", colorScheme: "dark" }}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "oklch(0.60 0.01 265)" }}>
                Hora
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                style={{ background: "oklch(0.20 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)", colorScheme: "dark" }}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "oklch(0.60 0.01 265)" }}>
              Tipo de Batalla
            </label>
            <div className="flex gap-2">
              {["official", "friendly"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, type })}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${form.type === type ? "text-white" : "text-white/40"}`}
                  style={form.type === type ? { background: "linear-gradient(135deg, #e8294c, #c41e3a)" } : { background: "oklch(0.20 0.015 265)" }}
                >
                  {type === "official" ? "Oficial" : "Amistosa"}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 mt-2"
            style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}
          >
            Programar Batalla
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function BattlesPage() {
  const { battles, streamers } = useApp();
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "win" | "loss">("all");

  const filtered = battles.filter(b => filter === "all" || b.result === filter);

  const stats = {
    total: battles.length,
    wins: battles.filter(b => b.result === "win").length,
    losses: battles.filter(b => b.result === "loss").length,
    pending: battles.filter(b => b.result === "pending").length,
  };

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Batallas", value: stats.total, color: "#4f6ef7" },
          { label: "Victorias", value: stats.wins, color: "#22c55e" },
          { label: "Derrotas", value: stats.losses, color: "#e8294c" },
          { label: "Pendientes", value: stats.pending, color: "#f59e0b" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl p-4 text-center"
            style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
          >
            <div className="text-2xl font-bold ah-number" style={{ color: stat.color, fontFamily: "'Space Grotesk', sans-serif" }}>
              {stat.value}
            </div>
            <div className="text-xs mt-1" style={{ color: "oklch(0.50 0.01 265)" }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          {[
            { key: "all", label: "Todas" },
            { key: "pending", label: "Pendientes" },
            { key: "win", label: "Victorias" },
            { key: "loss", label: "Derrotas" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === key ? "text-white" : "text-white/40 hover:text-white/70"}`}
              style={filter === key ? { background: "rgba(232,41,76,0.2)", color: "#e8294c" } : { background: "oklch(0.20 0.015 265)" }}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="ml-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}
        >
          <Plus className="w-4 h-4" />
          Nueva Batalla
        </button>
      </div>

      {/* Battles List */}
      <div className="space-y-3">
        {filtered.map((battle, i) => {
          const result = RESULT_CONFIG[battle.result];
          const ResultIcon = result.icon;
          const streamer = streamers.find(s => s.id === battle.streamerId);

          return (
            <motion.div
              key={battle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl p-4 flex items-center gap-4 hover:border-white/15 transition-all"
              style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
            >
              {/* Result indicator */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${result.color}20` }}>
                <ResultIcon className="w-5 h-5" style={{ color: result.color }} />
              </div>

              {/* Battle info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {battle.streamerName}
                  </span>
                  <span className="text-white/30 text-xs">vs</span>
                  <span className="font-semibold text-sm" style={{ color: "#4f6ef7" }}>
                    {battle.rivalName}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "oklch(0.22 0.02 265)", color: "oklch(0.60 0.01 265)" }}>
                    {battle.rivalAgency}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>
                    <Calendar className="w-3 h-3" />
                    {battle.date} {battle.time}
                  </div>
                  {battle.diamonds > 0 && (
                    <div className="text-xs font-medium" style={{ color: "#f59e0b" }}>
                      {battle.diamonds.toLocaleString()} 💎
                    </div>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${result.color}15`, color: result.color }}>
                    {result.label}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setSelectedBattle(battle)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white transition-all"
                  style={{ background: "oklch(0.22 0.02 265)" }}
                >
                  <Sparkles className="w-3 h-3" />
                  Flyer
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: "oklch(0.50 0.01 265)" }}>
          <Swords className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No hay batallas en esta categoría</p>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedBattle && (
          <FlyerModal battle={selectedBattle} onClose={() => setSelectedBattle(null)} />
        )}
        {showNewModal && (
          <NewBattleModal onClose={() => setShowNewModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

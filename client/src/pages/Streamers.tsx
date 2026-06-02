/**
 * Agency Hub — Streamers Page
 * Design: Dark Luxury — tabla de streamers con filtros, badges de rango, modal de detalle
 */

import { useApp } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Search, Plus, Diamond, Radio, Phone, Mail, X, Trophy,
  Swords, TrendingUp, TrendingDown, Star, ExternalLink,
  MessageCircle, Users, Loader2, CheckCircle, BarChart2, Link,
} from "lucide-react";
import type { Streamer } from "@/contexts/AppContext";
import { toast } from "sonner";
import { supabase } from "./supabaseClient";
import StreamerStats, { type StreamerStatsData } from "@/pages/StreamerStats";

const API     = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_KEY = import.meta.env.VITE_API_KEY || "";

function apiFetch(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(API_KEY ? { "X-Api-Key": API_KEY } : {}),
    },
  });
}

const RANK_COLORS: Record<string, string> = {
  Elite: "#f59e0b",
  Diamond: "#60a5fa",
  Gold: "#fbbf24",
  Silver: "#94a3b8",
  Bronze: "#cd7f32",
};

const RANK_ORDER = ["Elite", "Diamond", "Gold", "Silver", "Bronze"];

// ── Modal: Añadir Creador ──────────────────────────────────────────────────
interface ProfilePreview {
  usuario: string;
  nickname: string;
  avatar: string | null;
  bio: string;
  seguidores: number;
  siguiendo: number;
  likes: number;
  verificado: boolean;
  is_live: boolean;
}

function AddStreamerModal({ onClose, onAdded }: { onClose: () => void; onAdded: (s: Streamer) => void }) {
  const [input, setInput]           = useState("");
  const [buscando, setBuscando]     = useState(false);
  const [guardando, setGuardando]   = useState(false);
  const [preview, setPreview]       = useState<ProfilePreview | null>(null);
  const [errorMsg, setErrorMsg]     = useState("");

  const buscar = async () => {
    const user = input.trim().replace(/^@/, "");
    if (!user) return;
    setBuscando(true);
    setErrorMsg("");
    setPreview(null);
    try {
      const res  = await apiFetch(`${API}/api/perfil/${encodeURIComponent(user)}`);
      const data = await res.json();
      if (!data.ok) throw new Error(data.mensaje || "Usuario no encontrado");
      setPreview(data);
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setBuscando(false);
    }
  };

  const guardar = async () => {
    if (!preview) return;
    setGuardando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión activa");

      // Diamantes random para demo (entre 10k y 500k)
      const randomDiamonds     = Math.floor(Math.random() * 490_000) + 10_000;
      const randomDiamondsPrev = Math.floor(randomDiamonds * (0.7 + Math.random() * 0.5));

      const { data, error } = await supabase
        .from("streamers")
        .insert({
          agency_id:   user.id,
          tiktok_user: preview.usuario,
          nickname:    preview.nickname,
          avatar:      preview.avatar,
          bio:         preview.bio,
          seguidores:  preview.seguidores,
          siguiendo:   preview.siguiendo,
          likes:       preview.likes,
          verificado:  preview.verificado,
          is_live:     preview.is_live,
          diamonds:     randomDiamonds,
          diamonds_prev: randomDiamondsPrev,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          // Verificar si el streamer está en ESTA agencia u otra
          const { data: existing } = await supabase
            .from("streamers")
            .select("agency_id")
            .eq("tiktok_user", preview.usuario)
            .single();

          if (existing?.agency_id === user.id) {
            throw new Error("Este creador ya está en tu agencia");
          } else {
            throw new Error(`@${preview.usuario} ya pertenece a otra agencia y no puede ser añadido`);
          }
        }
        throw new Error(error.message);
      }

      const nuevo: Streamer = {
        id:           data.id,
        name:         data.nickname,
        tiktokUser:   data.tiktok_user,
        avatar:       data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.tiktok_user}`,
        diamonds:     data.diamonds     ?? randomDiamonds,
        diamondsPrev: data.diamonds_prev ?? randomDiamondsPrev,
        followers:    data.seguidores   ?? 0,
        isLive:       data.is_live      ?? false,
        rank:         "Bronze",
        joinDate:     new Date().toISOString().split("T")[0],
        earnings:     0,
        commission:   20,
        battles:      0,
        wins:         0,
      };

      toast.success(`@${preview.usuario} añadido a la agencia`);
      onAdded(nuevo);
      onClose();
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setGuardando(false);
    }
  };

  const formatNum = (n: number | null) => {
    if (n === null || n === undefined) return "—";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
    return n.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 22 }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 10%)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid oklch(1 0 0 / 8%)" }}>
          <h2 className="font-bold text-white text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Añadir Creador
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Input búsqueda */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-sm" style={{ color: "#e8294c" }}>@</span>
              <input
                className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm text-white outline-none transition-all"
                style={{ background: "oklch(0.12 0.015 265)", border: "1px solid oklch(1 0 0 / 12%)" }}
                placeholder="usuario de TikTok"
                value={input}
                onChange={e => { setInput(e.target.value); setPreview(null); setErrorMsg(""); }}
                onKeyDown={e => e.key === "Enter" && buscar()}
                onFocus={e  => (e.target.style.borderColor = "#e8294c")}
                onBlur={e   => (e.target.style.borderColor = "oklch(1 0 0 / 12%)")}
              />
            </div>
            <button
              onClick={buscar}
              disabled={buscando || !input.trim()}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}
            >
              {buscando ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
            </button>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="px-4 py-3 rounded-xl text-sm font-mono"
              style={{ background: "rgba(255,45,120,0.07)", border: "1px solid rgba(255,45,120,0.25)", color: "#ff2d78" }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Preview card */}
          {preview && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl overflow-hidden"
              style={{ background: "oklch(0.20 0.015 265)", border: "1px solid oklch(1 0 0 / 10%)" }}
            >
              {/* Profile row */}
              <div className="flex items-center gap-3 p-4">
                <div className="relative flex-shrink-0">
                  {preview.avatar
                    ? <img src={preview.avatar} className="w-14 h-14 rounded-xl object-cover" />
                    : <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-2xl font-bold text-white/50">
                        {preview.nickname.charAt(0).toUpperCase()}
                      </div>
                  }
                  {preview.is_live && (
                    <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-px rounded-full font-bold text-white"
                      style={{ background: "#e8294c" }}>LIVE</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {preview.nickname}
                    </span>
                    {preview.verificado && <span className="text-blue-400 text-xs">✓</span>}
                  </div>
                  <div className="text-sm mt-0.5" style={{ color: "oklch(0.50 0.01 265)" }}>@{preview.usuario}</div>
                  {preview.bio && (
                    <div className="text-xs mt-1 line-clamp-2" style={{ color: "oklch(0.55 0.01 265)" }}>{preview.bio}</div>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x" style={{ borderTop: "1px solid oklch(1 0 0 / 8%)", borderColor: "oklch(1 0 0 / 8%)" }}>
                {[
                  { label: "Seguidores", value: formatNum(preview.seguidores) },
                  { label: "Siguiendo",  value: formatNum(preview.siguiendo)  },
                  { label: "Likes",      value: formatNum(preview.likes)      },
                ].map(s => (
                  <div key={s.label} className="py-3 text-center" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
                    <div className="font-mono font-bold text-sm text-white">{s.value}</div>
                    <div className="text-[10px] uppercase tracking-wide mt-0.5" style={{ color: "oklch(0.45 0.01 265)" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Confirm button */}
              <div className="p-4" style={{ borderTop: "1px solid oklch(1 0 0 / 8%)" }}>
                <button
                  onClick={guardar}
                  disabled={guardando}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}
                >
                  {guardando
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                    : <><CheckCircle className="w-4 h-4" /> Añadir a la agencia</>
                  }
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Modal: Detalle Streamer ────────────────────────────────────────────────
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
  const { streamers, setStreamers, loadingStreamers } = useApp();
  const [search, setSearch]                 = useState("");
  const [filterRank, setFilterRank]         = useState<string>("all");
  const [filterLive, setFilterLive]         = useState(false);
  const [selectedStreamer, setSelectedStreamer] = useState<Streamer | null>(null);
  const [showAddModal, setShowAddModal]     = useState(false);
  const [statsStreamer, setStatsStreamer]   = useState<StreamerStatsData | null>(null);
  const [loadingStats, setLoadingStats]     = useState(false);

  const filtered = streamers.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.tiktokUser.toLowerCase().includes(search.toLowerCase());
    const matchRank = filterRank === "all" || s.rank === filterRank;
    const matchLive = !filterLive || s.isLive;
    return matchSearch && matchRank && matchLive;
  });

  const openStats = async (streamer: Streamer) => {
    setLoadingStats(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("streamer_public_stats")
      .select("*")
      .eq("agency_id", user?.id)
      .eq("tiktok_user", streamer.tiktokUser)
      .single();
    setLoadingStats(false);
    if (error || !data) { toast.error("No se pudieron cargar las stats"); return; }
    setStatsStreamer(data as StreamerStatsData);
  };

  const copyInviteLink = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const url = `${window.location.origin}/streamer/${user.id}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link de invitación copiado");
  };

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
          onClick={copyInviteLink}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style={{ background: "oklch(0.22 0.02 265)", color: "oklch(0.60 0.01 265)", border: "1px solid oklch(1 0 0 / 10%)" }}>
          <Link className="w-4 h-4" />
          Link invitación
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </motion.div>

      {/* Loading */}
      {loadingStreamers && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#e8294c" }} />
        </div>
      )}

      {/* Streamers Grid */}
      {!loadingStreamers && (<>
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
                  <Users className="w-3 h-3 mx-auto mb-1 text-purple-400" />
                  <div className="text-xs font-bold text-white ah-number">{streamer.followers > 0 ? (streamer.followers / 1000).toFixed(0) + "k" : "—"}</div>
                  <div className="text-xs" style={{ color: "oklch(0.45 0.01 265)" }}>Seguidores</div>
                </div>
              </div>

              {/* Change indicator */}
              <div className={`flex items-center gap-1 text-xs mt-3 ${positive ? "text-green-400" : "text-red-400"}`}>
                {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {positive ? "+" : ""}{diamondChange}% vs mes anterior
              </div>

              {/* Ver stats */}
              <button
                onClick={e => { e.stopPropagation(); openStats(streamer); }}
                className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                style={{ background: "rgba(79,110,247,0.12)", color: "#4f6ef7", border: "1px solid rgba(79,110,247,0.2)" }}>
                {loadingStats ? <Loader2 className="w-3 h-3 animate-spin" /> : <BarChart2 className="w-3 h-3" />}
                Ver estadísticas
              </button>
            </motion.div>
          );
          })}
        </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: "oklch(0.50 0.01 265)" }}>
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{streamers.length === 0 ? "Aún no tienes creadores. ¡Añade el primero!" : "No se encontraron streamers"}</p>
        </div>
      )}
      </>)}

      {/* Modales */}
      <AnimatePresence>
        {showAddModal && (
          <AddStreamerModal
            onClose={() => setShowAddModal(false)}
            onAdded={(s) => setStreamers(prev => [s, ...prev])}
          />
        )}
        {statsStreamer && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.80)" }}
            onClick={() => setStatsStreamer(null)}>
            <motion.div
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 22 }}
              className="w-full max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{ background: "oklch(0.13 0.015 265)", border: "1px solid oklch(1 0 0 / 10%)" }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
                style={{ background: "oklch(0.13 0.015 265)", borderBottom: "1px solid oklch(1 0 0 / 8%)" }}>
                <h3 className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Estadísticas del Streamer
                </h3>
                <button onClick={() => setStatsStreamer(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                <StreamerStats data={statsStreamer} />
              </div>
            </motion.div>
          </motion.div>
        )}
        {selectedStreamer && (
          <StreamerModal streamer={selectedStreamer} onClose={() => setSelectedStreamer(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
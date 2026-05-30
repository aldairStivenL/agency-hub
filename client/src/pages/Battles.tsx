/**
 * Agency Hub — Battles
 * Matchmaking automático por diamantes ± margen configurable
 * Estado manual: pending → win / loss / cancelled
 * Generador de flyer con canvas
 */

import { useApp } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  Swords, Trophy, Clock, XCircle, Zap, Download,
  X, Sparkles, Share2, Settings, AlertTriangle,
  ChevronDown, Loader2, RefreshCw, Diamond,
} from "lucide-react";
import type { Streamer } from "@/contexts/AppContext";
import { toast } from "sonner";
import { supabase } from "./supabaseClient";

// ── Constantes ──────────────────────────────────────────────────────────────
const BATTLE_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663455864775/gVC6y5Q2wpNYr4v7JmuSu6/agency-hub-battle-banner-Gd5ECkyB3Sx2o4hUhGHkpe.webp";
const DEFAULT_MARGIN = 10;
const RANK_ORDER = ["Bronze", "Silver", "Gold", "Diamond", "Elite"] as const;

const RESULT_CONFIG = {
  pending:   { label: "Pendiente",  color: "#f59e0b", icon: Clock     },
  win:       { label: "Victoria",   color: "#22c55e", icon: Trophy    },
  loss:      { label: "Derrota",    color: "#e8294c", icon: XCircle   },
  cancelled: { label: "Cancelada",  color: "#6b7280", icon: XCircle   },
};

// ── Tipos ───────────────────────────────────────────────────────────────────
interface PublicStreamer {
  id: string;
  streamer_id: string;
  agency_id: string;
  tiktok_user: string;
  nickname: string;
  avatar: string | null;
  rank: string;
  diamonds: number;
  is_available: boolean;
}

interface BattleRow {
  id: string;
  streamer_id: string;
  streamer_nickname: string;
  streamer_tiktok: string;
  streamer_avatar: string | null;
  streamer_diamonds: number;
  rival_streamer_id: string;
  rival_agency_id: string;
  rival_nickname: string;
  rival_tiktok: string;
  rival_avatar: string | null;
  rival_diamonds: number;
  scheduled_at: string;
  result: "pending" | "win" | "loss" | "cancelled";
  diamonds_earned: number;
  notes: string | null;
  flyer_generated: boolean;
  created_at: string;
  created_by: string;
}

interface MatchProposal {
  streamer: Streamer;
  rival: PublicStreamer | null;
  noMatchReason?: string;
  scheduledAt: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function rankIndex(r: string) {
  return RANK_ORDER.indexOf(r as any);
}

function suggestTime(baseHour = 20, offsetMinutes = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(baseHour, offsetMinutes, 0, 0);
  return d.toISOString();
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
}

function formatNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1)     + "K";
  return n.toString();
}

// ── Matchmaking ──────────────────────────────────────────────────────────────
function buildMatchups(
  myStreamers: Streamer[],
  rivals: PublicStreamer[],
  margin: number,
): MatchProposal[] {
  const available = rivals.filter(r => r.is_available);
  const usedRivals = new Set<string>();

  return myStreamers.map((s, i) => {
    const scheduled = suggestTime(20, i * 30);

    // Intento 1: match por diamantes ± margen
    if (s.diamonds > 0) {
      const min = s.diamonds * (1 - margin / 100);
      const max = s.diamonds * (1 + margin / 100);

      const candidates = available
        .filter(r => !usedRivals.has(r.id) && r.diamonds >= min && r.diamonds <= max)
        .sort((a, b) => Math.abs(a.diamonds - s.diamonds) - Math.abs(b.diamonds - s.diamonds));

      if (candidates.length > 0) {
        usedRivals.add(candidates[0].id);
        return { streamer: s, rival: candidates[0], scheduledAt: scheduled };
      }
    }

    // Intento 2: fallback por rank (mismo rank o adyacente)
    const myRankIdx = rankIndex(s.rank);
    const rankCandidates = available
      .filter(r => !usedRivals.has(r.id) && Math.abs(rankIndex(r.rank) - myRankIdx) <= 1);

    if (rankCandidates.length > 0) {
      // Elegir el más cercano en diamantes si hay varios
      const best = rankCandidates.sort((a, b) =>
        Math.abs(a.diamonds - s.diamonds) - Math.abs(b.diamonds - s.diamonds)
      )[0];
      usedRivals.add(best.id);
      return {
        streamer: s, rival: best, scheduledAt: scheduled,
        noMatchReason: s.diamonds === 0
          ? "Sin historial de diamantes — match por rango"
          : `Sin rival en ±${margin}% — match por rango`,
      };
    }

    // Sin match
    return {
      streamer: s, rival: null, scheduledAt: scheduled,
      noMatchReason: "Sin rival disponible con criterios compatibles",
    };
  });
}

// ── Modal: Flyer ─────────────────────────────────────────────────────────────
function FlyerModal({ battle, onClose }: { battle: BattleRow; onClose: () => void }) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated]   = useState(battle.flyer_generated);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
    await supabase.from("battles").update({ flyer_generated: true }).eq("id", battle.id);
    setGenerated(true);
    setGenerating(false);
    toast.success("¡Flyer generado!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 10%)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid oklch(1 0 0 / 8%)" }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Generador de Flyer</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Preview */}
          <div className="relative rounded-xl overflow-hidden aspect-video flex items-center justify-center" style={{ background: "#0a0a14" }}>
            <img src={BATTLE_BG} className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(232,41,76,0.3), transparent, rgba(79,110,247,0.3))" }} />
            <div className="relative z-10 w-full px-8 py-6">
              <div className="text-center mb-4">
                <div className="text-xs font-bold tracking-widest text-white/60 uppercase mb-1">Batalla Oficial TikTok LIVE</div>
                <div className="text-white/40 text-xs">{fmtDate(battle.scheduled_at)} — {fmtTime(battle.scheduled_at)}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden border-2 border-red-500" style={{ boxShadow: "0 0 20px rgba(232,41,76,0.6)" }}>
                    {battle.streamer_avatar
                      ? <img src={battle.streamer_avatar} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold bg-red-900">{battle.streamer_nickname.charAt(0)}</div>}
                  </div>
                  <div className="text-white font-bold text-sm">{battle.streamer_nickname}</div>
                  <div className="text-red-400 text-xs">@{battle.streamer_tiktok}</div>
                </div>
                <div className="px-4 text-4xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif", textShadow: "0 0 30px rgba(255,255,255,0.5)" }}>VS</div>
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden border-2 border-blue-500" style={{ boxShadow: "0 0 20px rgba(79,110,247,0.6)" }}>
                    {battle.rival_avatar
                      ? <img src={battle.rival_avatar} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold bg-blue-900">{battle.rival_nickname.charAt(0)}</div>}
                  </div>
                  <div className="text-white font-bold text-sm">{battle.rival_nickname}</div>
                  <div className="text-blue-400 text-xs">@{battle.rival_tiktok}</div>
                </div>
              </div>
              <div className="text-center mt-4">
                <div className="text-white/30 text-xs tracking-widest uppercase">Agency Hub • TikTok LIVE</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!generated ? (
              <button onClick={handleGenerate} disabled={generating}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}>
                {generating ? <><Loader2 className="w-4 h-4 animate-spin" />Generando...</> : <><Sparkles className="w-4 h-4" />Generar Flyer</>}
              </button>
            ) : (
              <>
                <button onClick={() => toast.success("Descargando...")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
                  <Download className="w-4 h-4" />Descargar
                </button>
                <button onClick={() => toast.success("Compartiendo...")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #4f6ef7, #3b5bdb)" }}>
                  <Share2 className="w-4 h-4" />Compartir
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Modal: Preview de matchups antes de confirmar ───────────────────────────
function MatchupPreviewModal({
  proposals, margin, onConfirm, onClose, saving,
}: {
  proposals: MatchProposal[];
  margin: number;
  onConfirm: (accepted: MatchProposal[]) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [accepted, setAccepted] = useState<Set<number>>(
    () => new Set(proposals.map((p, i) => p.rival ? i : -1).filter(i => i >= 0))
  );

  const toggle = (i: number) => setAccepted(prev => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });

  const validProposals = proposals.filter((p, i) => accepted.has(i) && p.rival);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 22 }}
        className="w-full max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 10%)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid oklch(1 0 0 / 8%)" }}>
          <div>
            <h3 className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Preview de Matchups</h3>
            <p className="text-xs mt-0.5" style={{ color: "oklch(0.50 0.01 265)" }}>
              Margen: ±{margin}% en diamantes · {validProposals.length} batalla{validProposals.length !== 1 ? "s" : ""} seleccionada{validProposals.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {proposals.map((p, i) => {
            const isAccepted = accepted.has(i);
            const hasRival   = !!p.rival;

            return (
              <div key={p.streamer.id}
                className={`rounded-xl p-4 border transition-all ${!hasRival ? "opacity-60" : ""}`}
                style={{
                  background: isAccepted && hasRival ? "oklch(0.20 0.015 265)" : "oklch(0.13 0.015 265)",
                  border: isAccepted && hasRival
                    ? "1px solid rgba(232,41,76,0.3)"
                    : "1px solid oklch(1 0 0 / 8%)",
                }}>

                {/* No match warning */}
                {!hasRival && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
                    style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "#f59e0b" }} />
                    <span className="text-xs" style={{ color: "#f59e0b" }}>{p.noMatchReason}</span>
                  </div>
                )}

                {/* Fallback warning */}
                {hasRival && p.noMatchReason && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
                    style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.15)" }}>
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#f59e0b" }} />
                    <span className="text-xs" style={{ color: "#f59e0b" }}>{p.noMatchReason}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {/* My streamer */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {p.streamer.avatar
                      ? <img src={p.streamer.avatar} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      : <div className="w-9 h-9 rounded-lg bg-red-900/40 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">{p.streamer.name.charAt(0)}</div>}
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-white truncate">{p.streamer.name}</div>
                      <div className="text-xs font-mono" style={{ color: "oklch(0.50 0.01 265)" }}>
                        💎 {formatNum(p.streamer.diamonds)}
                      </div>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-white/30 font-black text-sm flex-shrink-0 px-1">VS</div>

                  {/* Rival */}
                  {hasRival ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {p.rival!.avatar
                        ? <img src={p.rival!.avatar} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                        : <div className="w-9 h-9 rounded-lg bg-blue-900/40 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">{p.rival!.nickname.charAt(0)}</div>}
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-white truncate">{p.rival!.nickname}</div>
                        <div className="text-xs font-mono" style={{ color: "oklch(0.50 0.01 265)" }}>
                          💎 {formatNum(p.rival!.diamonds)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 text-center text-xs" style={{ color: "oklch(0.40 0.01 265)" }}>Sin rival</div>
                  )}

                  {/* Toggle */}
                  {hasRival && (
                    <button onClick={() => toggle(i)}
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={{
                        background: isAccepted ? "rgba(232,41,76,0.2)" : "oklch(0.22 0.02 265)",
                        border: isAccepted ? "1px solid rgba(232,41,76,0.4)" : "1px solid oklch(1 0 0 / 8%)",
                        color: isAccepted ? "#e8294c" : "oklch(0.40 0.01 265)",
                      }}>
                      {isAccepted ? "✓" : "—"}
                    </button>
                  )}
                </div>

                {/* Hora sugerida */}
                {hasRival && (
                  <div className="mt-2 text-xs font-mono" style={{ color: "oklch(0.45 0.01 265)" }}>
                    📅 {fmtDate(p.scheduledAt)} · {fmtTime(p.scheduledAt)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex gap-3 flex-shrink-0" style={{ borderTop: "1px solid oklch(1 0 0 / 8%)" }}>
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: "oklch(0.22 0.02 265)", color: "oklch(0.60 0.01 265)" }}>
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(proposals.filter((p, i) => accepted.has(i) && p.rival))}
            disabled={saving || validProposals.length === 0}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-all"
            style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}>
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</>
              : <><Swords className="w-4 h-4" />Confirmar {validProposals.length} batalla{validProposals.length !== 1 ? "s" : ""}</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Selector de resultado inline ─────────────────────────────────────────────
function ResultSelector({ battle, onUpdate }: { battle: BattleRow; onUpdate: (id: string, result: BattleRow["result"], diamonds: number) => void }) {
  const [open, setOpen]         = useState(false);
  const [diamonds, setDiamonds] = useState(battle.diamonds_earned);
  const [saving, setSaving]     = useState(false);
  const current = RESULT_CONFIG[battle.result];

  const apply = async (result: BattleRow["result"]) => {
    setSaving(true);
    const { error } = await supabase
      .from("battles")
      .update({ result, diamonds_earned: diamonds })
      .eq("id", battle.id);
    setSaving(false);
    if (error) { toast.error("Error al actualizar"); return; }
    onUpdate(battle.id, result, diamonds);
    setOpen(false);
    toast.success(`Batalla marcada como ${RESULT_CONFIG[result].label}`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        style={{ background: `${current.color}15`, color: current.color, border: `1px solid ${current.color}30` }}>
        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <current.icon className="w-3 h-3" />}
        {current.label}
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            className="absolute right-0 top-full mt-1.5 z-30 rounded-xl overflow-hidden shadow-2xl"
            style={{ background: "oklch(0.18 0.015 265)", border: "1px solid oklch(1 0 0 / 15%)", minWidth: 200 }}>

            {/* Diamantes earned (para win/loss) */}
            <div className="px-3 pt-3 pb-2">
              <div className="text-xs mb-1.5 font-mono" style={{ color: "oklch(0.50 0.01 265)" }}>Diamantes obtenidos</div>
              <input
                type="number"
                min={0}
                value={diamonds}
                onChange={e => setDiamonds(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg text-sm text-white font-mono outline-none"
                style={{ background: "oklch(0.13 0.015 265)", border: "1px solid oklch(1 0 0 / 12%)" }}
              />
            </div>

            <div className="px-2 pb-2 space-y-0.5">
              {(["pending", "win", "loss", "cancelled"] as const).map(r => {
                const cfg = RESULT_CONFIG[r];
                return (
                  <button key={r} onClick={() => apply(r)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5 text-left"
                    style={{ color: battle.result === r ? cfg.color : "oklch(0.70 0.01 265)" }}>
                    <cfg.icon className="w-4 h-4 flex-shrink-0" style={{ color: cfg.color }} />
                    {cfg.label}
                    {battle.result === r && <span className="ml-auto text-xs opacity-60">actual</span>}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function BattlesPage() {
  const { streamers } = useApp();

  const [battles, setBattles]         = useState<BattleRow[]>([]);
  const [userId, setUserId]           = useState<string>("");
  const [loading, setLoading]         = useState(true);
  const [generating, setGenerating]   = useState(false);
  const [saving, setSaving]           = useState(false);
  const [margin, setMargin]           = useState(DEFAULT_MARGIN);
  const [editingMargin, setEditingMargin] = useState(false);
  const [proposals, setProposals]     = useState<MatchProposal[] | null>(null);
  const [filter, setFilter]           = useState<"all" | "pending" | "win" | "loss" | "cancelled">("all");
  const [flyerBattle, setFlyerBattle] = useState<BattleRow | null>(null);

  // ── Cargar configuración y batallas ────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("agency_settings")
      .select("battle_margin")
      .eq("agency_id", user.id)
      .single();
    if (data) setMargin(data.battle_margin);
  }, []);

  const fetchBattles = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
    const { data, error } = await supabase
      .from("battles")
      .select("*")
      .order("scheduled_at", { ascending: false });
    if (!error && data) setBattles(data as BattleRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchBattles();
  }, [fetchSettings, fetchBattles]);

  // ── Guardar margen ─────────────────────────────────────────────────────────
  const saveMargin = async (val: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("agency_settings").upsert({ agency_id: user.id, battle_margin: val });
    setMargin(val);
    setEditingMargin(false);
    toast.success(`Margen actualizado a ±${val}%`);
  };

  // ── Generar proposals ──────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (streamers.length === 0) { toast.error("No tienes streamers registrados"); return; }
    setGenerating(true);

    const { data: { user } } = await supabase.auth.getUser();
    const { data: rivals, error } = await supabase
      .from("public_streamers")
      .select("*")
      .neq("agency_id", user?.id)
      .eq("is_available", true);

    if (error) { toast.error("Error al cargar rivales"); setGenerating(false); return; }
    if (!rivals || rivals.length === 0) {
      toast.error("No hay streamers de otras agencias disponibles aún");
      setGenerating(false);
      return;
    }

    const props = buildMatchups(streamers, rivals as PublicStreamer[], margin);
    setProposals(props);
    setGenerating(false);
  };

  // ── Confirmar y guardar batallas ───────────────────────────────────────────
  const handleConfirm = async (accepted: MatchProposal[]) => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    const rows = accepted.map(p => ({
      created_by:         user!.id,
      streamer_id:        p.streamer.id,
      streamer_nickname:  p.streamer.name,
      streamer_tiktok:    p.streamer.tiktokUser,
      streamer_avatar:    p.streamer.avatar,
      streamer_diamonds:  p.streamer.diamonds,
      rival_streamer_id:  p.rival!.id,
      rival_agency_id:    p.rival!.agency_id,
      rival_nickname:     p.rival!.nickname,
      rival_tiktok:       p.rival!.tiktok_user,
      rival_avatar:       p.rival!.avatar,
      rival_diamonds:     p.rival!.diamonds,
      scheduled_at:       p.scheduledAt,
      result:             "pending",
    }));

    const { error } = await supabase.from("battles").insert(rows);
    setSaving(false);

    if (error) { toast.error("Error al guardar batallas: " + error.message); return; }

    toast.success(`${rows.length} batalla${rows.length !== 1 ? "s" : ""} programada${rows.length !== 1 ? "s" : ""}`);
    setProposals(null);
    fetchBattles();
  };

  // ── Actualizar resultado ───────────────────────────────────────────────────
  const handleUpdate = (id: string, result: BattleRow["result"], diamonds: number) => {
    setBattles(prev => prev.map(b => b.id === id ? { ...b, result, diamonds_earned: diamonds } : b));
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = {
    total:     battles.length,
    wins:      battles.filter(b => b.result === "win").length,
    losses:    battles.filter(b => b.result === "loss").length,
    pending:   battles.filter(b => b.result === "pending").length,
    cancelled: battles.filter(b => b.result === "cancelled").length,
  };

  const filtered = filter === "all" ? battles : battles.filter(b => b.result === filter);

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total",      value: stats.total,     color: "#4f6ef7" },
          { label: "Victorias",  value: stats.wins,      color: "#22c55e" },
          { label: "Derrotas",   value: stats.losses,    color: "#e8294c" },
          { label: "Pendientes", value: stats.pending,   color: "#f59e0b" },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl p-4 text-center"
            style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}>
            <div className="text-2xl font-bold" style={{ color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: "oklch(0.50 0.01 265)" }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filtros */}
        <div className="flex items-center gap-1.5">
          {(["all","pending","win","loss","cancelled"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
              style={filter === f
                ? { background: "rgba(232,41,76,0.2)", color: "#e8294c" }
                : { background: "oklch(0.20 0.015 265)", color: "oklch(0.50 0.01 265)" }}>
              {f === "all" ? "Todas" : RESULT_CONFIG[f].label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Margen config */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "oklch(0.20 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}>
            <Settings className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "oklch(0.50 0.01 265)" }} />
            <span className="text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>Margen:</span>
            {editingMargin ? (
              <input type="number" min={1} max={100} defaultValue={margin}
                className="w-12 bg-transparent text-xs text-white font-mono outline-none"
                autoFocus
                onBlur={e  => saveMargin(parseInt(e.target.value) || DEFAULT_MARGIN)}
                onKeyDown={e => e.key === "Enter" && saveMargin(parseInt((e.target as HTMLInputElement).value) || DEFAULT_MARGIN)}
              />
            ) : (
              <button onClick={() => setEditingMargin(true)}
                className="text-xs font-mono font-bold hover:text-white transition-colors"
                style={{ color: "#e8294c" }}>
                ±{margin}%
              </button>
            )}
            <Diamond className="w-3 h-3" style={{ color: "oklch(0.40 0.01 265)" }} />
          </div>

          {/* Generar batallas */}
          <button onClick={handleGenerate} disabled={generating}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}>
            {generating
              ? <><Loader2 className="w-4 h-4 animate-spin" />Calculando...</>
              : <><Zap className="w-4 h-4" />Generar Batallas</>}
          </button>

          <button onClick={fetchBattles}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
            style={{ background: "oklch(0.20 0.015 265)", color: "oklch(0.50 0.01 265)" }}>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lista de batallas */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#e8294c" }} />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((battle, i) => {
            const result   = RESULT_CONFIG[battle.result];
            const isRival  = battle.created_by !== userId;

            // Desde la perspectiva del rival, izquierda=rival, derecha=yo
            const leftNick   = isRival ? battle.rival_nickname   : battle.streamer_nickname;
            const leftTiktok = isRival ? battle.rival_tiktok     : battle.streamer_tiktok;
            const leftAvatar = isRival ? battle.rival_avatar     : battle.streamer_avatar;
            const leftBg     = isRival ? "bg-blue-900/40"        : "bg-red-900/40";

            const rightNick   = isRival ? battle.streamer_nickname : battle.rival_nickname;
            const rightTiktok = isRival ? battle.streamer_tiktok   : battle.rival_tiktok;
            const rightAvatar = isRival ? battle.streamer_avatar   : battle.rival_avatar;
            const rightBg     = isRival ? "bg-red-900/40"          : "bg-blue-900/40";

            return (
              <motion.div key={battle.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl p-4 transition-all"
                style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}>

                <div className="flex items-center gap-4">
                  {/* Indicator */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${result.color}20` }}>
                    <result.icon className="w-5 h-5" style={{ color: result.color }} />
                  </div>

                  {/* Combatants */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Left (yo o rival según perspectiva) */}
                    <div className="flex items-center gap-2 min-w-0">
                      {leftAvatar
                        ? <img src={leftAvatar} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                        : <div className={`w-8 h-8 rounded-lg ${leftBg} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>{leftNick.charAt(0)}</div>}
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{leftNick}</div>
                        <div className="text-xs font-mono" style={{ color: "oklch(0.45 0.01 265)" }}>@{leftTiktok}</div>
                      </div>
                    </div>

                    <div className="text-white/25 font-black text-xs flex-shrink-0">VS</div>

                    {/* Right */}
                    <div className="flex items-center gap-2 min-w-0">
                      {rightAvatar
                        ? <img src={rightAvatar} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                        : <div className={`w-8 h-8 rounded-lg ${rightBg} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>{rightNick.charAt(0)}</div>}
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{rightNick}</div>
                        <div className="text-xs font-mono" style={{ color: "oklch(0.45 0.01 265)" }}>@{rightTiktok}</div>
                      </div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="hidden md:flex flex-col items-end gap-0.5 flex-shrink-0">
                    {isRival && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-1"
                        style={{ background: "rgba(79,110,247,0.15)", color: "#4f6ef7", border: "1px solid rgba(79,110,247,0.3)" }}>
                        Retador
                      </span>
                    )}
                    <div className="text-xs font-mono" style={{ color: "oklch(0.50 0.01 265)" }}>
                      📅 {fmtDate(battle.scheduled_at)} · {fmtTime(battle.scheduled_at)}
                    </div>
                    {battle.diamonds_earned > 0 && (
                      <div className="text-xs font-mono font-semibold" style={{ color: "#f59e0b" }}>
                        💎 {formatNum(battle.diamonds_earned)}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setFlyerBattle(battle)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{ background: "oklch(0.22 0.02 265)", color: "oklch(0.60 0.01 265)" }}>
                      <Sparkles className="w-3 h-3" />
                      {battle.flyer_generated ? "Ver" : "Flyer"}
                    </button>
                    {/* Solo el creador puede cambiar el resultado */}
                    {!isRival
                      ? <ResultSelector battle={battle} onUpdate={handleUpdate} />
                      : (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{ background: `${result.color}15`, color: result.color, border: `1px solid ${result.color}30` }}>
                          <result.icon className="w-3 h-3" />
                          {result.label}
                        </span>
                      )
                    }
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filtered.length === 0 && !loading && (
            <div className="text-center py-16" style={{ color: "oklch(0.50 0.01 265)" }}>
              <Swords className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="mb-2">{battles.length === 0 ? "No hay batallas aún" : "No hay batallas en esta categoría"}</p>
              {battles.length === 0 && (
                <p className="text-xs" style={{ color: "oklch(0.40 0.01 265)" }}>
                  Presiona "Generar Batallas" para crear matchups automáticos
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      <AnimatePresence>
        {proposals && (
          <MatchupPreviewModal
            proposals={proposals}
            margin={margin}
            onConfirm={handleConfirm}
            onClose={() => setProposals(null)}
            saving={saving}
          />
        )}
        {flyerBattle && (
          <FlyerModal battle={flyerBattle} onClose={() => setFlyerBattle(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
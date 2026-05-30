/**
 * StreamerPublicView — /streamer/:agencyId
 * Acceso sin sesión: el streamer ingresa su @usuario y ve sus stats
 */

import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "./supabaseClient";
import StreamerStats, { type StreamerStatsData } from "@/pages/StreamerStats";

export default function StreamerPublicView() {
  const { agencyId } = useParams<{ agencyId: string }>();

  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [data, setData]       = useState<StreamerStatsData | null>(null);

  const buscar = async () => {
    const user = input.trim().replace(/^@/, "");
    if (!user || !agencyId) return;

    setLoading(true);
    setError("");
    setData(null);

    const { data: rows, error: err } = await supabase
      .from("streamer_public_stats")
      .select("*")
      .eq("agency_id", agencyId)
      .ilike("tiktok_user", user)
      .limit(1);

    setLoading(false);

    if (err) { setError("Error al consultar. Intenta de nuevo."); return; }
    if (!rows || rows.length === 0) {
      setError(`No se encontró @${user} en esta agencia. Verifica el usuario e intenta de nuevo.`);
      return;
    }

    setData(rows[0] as StreamerStatsData);
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.11 0.015 265)" }}>
      {/* Top glow */}
      <div className="fixed top-0 left-0 right-0 h-px z-10"
        style={{ background: "linear-gradient(90deg, transparent, #e8294c, transparent)" }} />

      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-mono font-bold uppercase tracking-widest"
            style={{ background: "rgba(232,41,76,0.1)", border: "1px solid rgba(232,41,76,0.2)", color: "#e8294c" }}>
            Agency Hub
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Mis Estadísticas
          </h1>
          <p className="text-sm" style={{ color: "oklch(0.50 0.01 265)" }}>
            Ingresa tu usuario de TikTok para ver tu panel
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 mb-6 relative overflow-hidden"
          style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}>

          <div className="absolute top-0 left-[20%] right-[20%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, #e8294c40, transparent)" }} />

          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold"
                style={{ color: "#e8294c" }}>@</span>
              <input
                className="w-full pl-8 pr-3 py-3 rounded-xl text-sm text-white outline-none transition-all"
                style={{ background: "oklch(0.12 0.015 265)", border: "1px solid oklch(1 0 0 / 12%)" }}
                placeholder="tu usuario de TikTok"
                value={input}
                onChange={e => { setInput(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && buscar()}
                onFocus={e  => (e.target.style.borderColor = "#e8294c")}
                onBlur={e   => (e.target.style.borderColor = "oklch(1 0 0 / 12%)")}
              />
            </div>
            <button
              onClick={buscar}
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40 flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}>
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Search className="w-4 h-4" />}
              Buscar
            </button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-2 mt-3 px-4 py-3 rounded-xl text-sm"
                style={{ background: "rgba(232,41,76,0.07)", border: "1px solid rgba(232,41,76,0.2)", color: "#ff6b6b" }}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}>
              <StreamerStats data={data} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center mt-10">
          <span className="text-xs font-mono" style={{ color: "oklch(0.30 0.01 265)" }}>
            Agency Hub · TikTok LIVE Management
          </span>
        </div>
      </div>
    </div>
  );
}
/**
 * Agency Hub — Consultar Streamer
 * Monitor TikTok LIVE en tiempo real vía FastAPI + WebSocket
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ── Tipos ──────────────────────────────────────────────────────────────────
interface UsuarioInfo {
  nickname?: string;
  unique_id?: string;
  avatar?: string;
  user_id?: string;
}

interface Comentario {
  texto?: string;
  fecha?: string;
  usuario?: UsuarioInfo;
}

interface Regalo {
  regalo?: string;
  cantidad?: number;
  valor_diamantes?: number;
  usuario?: UsuarioInfo;
}

interface RankingEntry {
  unique_id?: string;
  nickname?: string;
  avatar?: string;
  diamantes: number;
  cantidad_regalos: number;
}

interface UsuarioData {
  info: UsuarioInfo;
  motivos: string[];
  ultima_interaccion?: string;
}

interface Metricas {
  likes_total_recibidos?: number;
  regalos?: number;
  diamantes_estimados?: number;
  comentarios?: number;
  shares?: number;
  joins?: number;
}

interface LiveState {
  conectado?: boolean;
  viewer_count?: number;
  room_id?: string;
}

interface CreadorState {
  unique_id?: string;
  nickname?: string;
  room_id?: string;
  room_info?: { owner?: { nickname?: string; avatar_thumb?: { url_list: string[] }; avatar_medium?: { url_list: string[] } } };
}

// ── Helpers ────────────────────────────────────────────────────────────────
const API     = import.meta.env.VITE_API_URL     || "http://localhost:8000";
const API_KEY = import.meta.env.VITE_API_KEY     || "";

/** fetch con X-Api-Key automático */
function apiFetch(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(API_KEY ? { "X-Api-Key": API_KEY } : {}),
    },
  });
}

function formatNum(n: number | undefined) {
  const v = parseInt(String(n ?? 0)) || 0;
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (v >= 10_000)    return (v / 1_000).toFixed(1) + "K";
  return v.toLocaleString();
}

function formatHora(iso?: string) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); }
  catch { return ""; }
}

function limpiarUsuario(u: string) {
  u = u.trim().replace(/\/$/, "");
  if (u.includes("/@")) u = u.split("/@")[1].split("/")[0];
  return u.replace(/^@/, "");
}

// ── Sub-componentes ────────────────────────────────────────────────────────
function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 px-4 text-center">
      <span className="text-3xl opacity-30">{icon}</span>
      <span className="font-mono text-xs text-white/20" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}

function ComentarioItem({ c, isNew }: { c: Comentario; isNew: boolean }) {
  const nick = c.usuario?.nickname || c.usuario?.unique_id || "?";
  const uid  = c.usuario?.unique_id;
  return (
    <div className={`flex gap-2 items-start p-2 rounded-xl border transition-colors ${isNew ? "border-cyan-500/20 bg-cyan-500/4" : "border-transparent bg-white/5"}`}>
      <div className="w-7 h-7 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white/50 overflow-hidden">
        {c.usuario?.avatar
          ? <img src={c.usuario.avatar} className="w-full h-full object-cover rounded-full" loading="lazy" />
          : nick.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[11px] font-bold text-cyan-400">
          {nick}
          {uid && <span className="text-white/25 font-normal ml-1 text-[10px]">@{uid}</span>}
        </div>
        <div className="text-sm text-white/80 leading-snug break-words">{c.texto}</div>
      </div>
      <div className="font-mono text-[10px] text-white/20 flex-shrink-0 mt-0.5">{formatHora(c.fecha)}</div>
    </div>
  );
}

function RegaloItem({ r }: { r: Regalo }) {
  const nick     = r.usuario?.nickname || r.usuario?.unique_id || "?";
  const diamonds = r.valor_diamantes || 0;
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-transparent hover:border-white/10">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: "rgba(255,200,67,0.12)", border: "1px solid rgba(255,200,67,0.25)" }}>🎁</div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[11px] font-bold text-cyan-400">{nick}</div>
        <div className="text-sm text-white/80">{r.regalo} × {r.cantidad || 1}</div>
      </div>
      <div className="text-right">
        <div className="font-mono font-bold text-sm" style={{ color: "#ffc843" }}>💎 {formatNum(diamonds)}</div>
        <div className="font-mono text-[10px] text-white/25 uppercase">diamantes</div>
      </div>
    </div>
  );
}

function RankingItem({ entry, pos }: { entry: RankingEntry; pos: number }) {
  const medals    = ["🥇","🥈","🥉"];
  const posLabel  = pos < 3 ? medals[pos] : `#${pos + 1}`;
  const topColors = ["border-yellow-400/40 bg-yellow-400/5","border-gray-300/30","border-amber-600/30"];
  const posColors = ["text-yellow-400","text-gray-300","text-amber-600"];
  const nick      = entry.nickname || entry.unique_id || "?";
  const handle    = entry.unique_id && entry.unique_id !== nick ? entry.unique_id : "";
  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${pos < 3 ? topColors[pos] : "border-transparent bg-white/5"}`}>
      <span className={`font-mono font-bold text-base w-7 text-center flex-shrink-0 ${pos < 3 ? posColors[pos] : "text-white/25"}`}>{posLabel}</span>
      <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white/50 overflow-hidden">
        {entry.avatar
          ? <img src={entry.avatar} className="w-full h-full object-cover rounded-full" loading="lazy" />
          : nick.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-sm font-bold text-white/90 truncate">
          {nick}{handle && <span className="text-cyan-400 text-[10px] font-normal ml-1">@{handle}</span>}
        </div>
        <div className="font-mono text-[10px] text-white/25">{entry.cantidad_regalos} regalo{entry.cantidad_regalos !== 1 ? "s" : ""}</div>
      </div>
      <div className="text-right">
        <div className="font-mono font-bold text-sm" style={{ color: "#ffc843" }}>💎 {formatNum(entry.diamantes)}</div>
        <div className="font-mono text-[10px] text-white/25 uppercase">diamantes</div>
      </div>
    </div>
  );
}

function UsuarioItem({ data }: { data: UsuarioData }) {
  const nick   = data.info.nickname || data.info.unique_id || "?";
  const handle = data.info.unique_id && data.info.unique_id !== nick ? data.info.unique_id : "";
  return (
    <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-transparent hover:border-white/10">
      <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white/50 overflow-hidden">
        {data.info.avatar
          ? <img src={data.info.avatar} className="w-full h-full object-cover rounded-full" loading="lazy" />
          : nick.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-sm font-bold text-white/90 truncate">
          {nick}{handle && <span className="text-white/25 font-normal text-[10px] ml-1">@{handle}</span>}
        </div>
        <div className="flex gap-1 flex-wrap mt-0.5">
          {data.motivos.map(m => (
            <span key={m} className="font-mono text-[10px] text-white/30 bg-white/5 border border-white/10 rounded px-1.5 py-px">{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────
export default function FlowChartPage() {
  const [screen, setScreen]           = useState<"search"|"monitor">("search");
  const [inputVal, setInputVal]       = useState("");
  const [conectando, setConectando]   = useState(false);
  const [usuario, setUsuario]         = useState("");
  const [activeTab, setActiveTab]     = useState("comentarios");

  // Estado del monitor
  const [isLive, setIsLive]           = useState(false);
  const [viewers, setViewers]         = useState(0);
  const [roomId, setRoomId]           = useState("");
  const [creador, setCreador]         = useState<CreadorState>({});
  const [avatarUrl, setAvatarUrl]     = useState("");
  const [metricas, setMetricas]       = useState<Metricas>({});
  const [wsStatus, setWsStatus]       = useState<"off"|"connecting"|"on">("off");
  const [errorMsg, setErrorMsg]       = useState("");

  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [newComIdx, setNewComIdx]     = useState<number>(-1);
  const [regalos, setRegalos]         = useState<Regalo[]>([]);
  const [ranking, setRanking]         = useState<Record<string, RankingEntry>>({});
  const [usuarios, setUsuarios]       = useState<Record<string, UsuarioData>>({});

  const [toasts, setToasts]           = useState<{ id: number; msg: string; tipo: string }[]>([]);
  const toastId                       = useRef(0);

  const wsRef                         = useRef<WebSocket | null>(null);
  const commentsEndRef                = useRef<HTMLDivElement>(null);

  // ── Toast ──────────────────────────────────────────────────────────────
  const addToast = useCallback((msg: string, tipo: string) => {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, msg, tipo }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3300);
  }, []);

  // ── Reset ──────────────────────────────────────────────────────────────
  const resetState = useCallback(() => {
    setIsLive(false); setViewers(0); setRoomId(""); setCreador({});
    setAvatarUrl(""); setMetricas({}); setErrorMsg("");
    setComentarios([]); setRegalos([]); setRanking({}); setUsuarios({});
  }, []);

  // ── WebSocket ──────────────────────────────────────────────────────────
  const conectarWS = useCallback((user: string) => {
    const wsUrl  = API.replace(/^http/, "ws");
    const wsKey  = API_KEY ? `?api_key=${encodeURIComponent(API_KEY)}` : "";
    const sock   = new WebSocket(`${wsUrl}/ws/${encodeURIComponent(user)}${wsKey}`);
    wsRef.current = sock;
    setWsStatus("connecting");

    sock.onopen  = () => setWsStatus("on");
    sock.onclose = () => {
      setWsStatus("off");
      // Reconexión si seguimos en monitor
      setScreen(s => {
        if (s === "monitor") setTimeout(() => conectarWS(user), 3000);
        return s;
      });
    };
    sock.onerror = () => setWsStatus("off");

    sock.onmessage = (e) => {
      try { handleMsg(JSON.parse(e.data)); } catch {}
    };
  }, []);  // eslint-disable-line

  const handleMsg = useCallback((msg: any) => {
    const { tipo, estado: est } = msg;

    if (est) {
      if (est.creador) {
        setCreador(est.creador);
        const ri = est.creador.room_info;
        if (ri?.owner?.avatar_thumb?.url_list?.[0]) setAvatarUrl(ri.owner.avatar_thumb.url_list[0]);
        else if (ri?.owner?.avatar_medium?.url_list?.[0]) setAvatarUrl(ri.owner.avatar_medium.url_list[0]);
      }
      if (est.live) {
        setIsLive(!!est.live.conectado);
        if (est.live.viewer_count != null) setViewers(est.live.viewer_count);
        if (est.live.room_id) setRoomId(est.live.room_id);
      }
      if (est.metricas) setMetricas(est.metricas);
      if (est.usuarios_interesantes) setUsuarios(u => ({ ...u, ...est.usuarios_interesantes }));
      if (est.ranking_regalos)        setRanking(r => ({ ...r, ...est.ranking_regalos }));

      if (tipo === "estado_inicial") {
        if (est.ultimos_comentarios) setComentarios(est.ultimos_comentarios.slice(-100));
        if (est.ultimos_regalos)     setRegalos(est.ultimos_regalos.slice(-50));
      }
    }

    if (tipo === "comentario" && msg.comentario) {
      setComentarios(c => {
        const next = [...c, msg.comentario].slice(-101);
        setNewComIdx(next.length - 1);
        return next;
      });
    }

    if (tipo === "regalo" && msg.regalo) {
      setRegalos(r => [msg.regalo, ...r].slice(0, 51));
      if (est?.ranking_regalos) setRanking(r => ({ ...r, ...est.ranking_regalos }));
      addToast(`🎁 ${msg.regalo.usuario?.nickname || "?"} envió ${msg.regalo.regalo}`, "gift");
    }

    if (tipo === "viewers" && msg.viewer_count != null) setViewers(msg.viewer_count);
    if (tipo === "join" && msg.metricas) {
      setMetricas(msg.metricas);
      if (msg.usuario) {
        const uid = msg.usuario.unique_id || msg.usuario.user_id;
        if (uid) setUsuarios(u => {
          const prev = u[uid] || { info: msg.usuario, motivos: [] };
          if (!prev.motivos.includes("entró al live")) prev.motivos = [...prev.motivos, "entró al live"];
          return { ...u, [uid]: { ...prev, info: msg.usuario } };
        });
      }
    }
    if ((tipo === "like" || tipo === "share") && msg.metricas) setMetricas(msg.metricas);
    if (tipo === "conectado")    setIsLive(true);
    if (tipo === "desconectado") setIsLive(false);
    if (tipo === "error")        setErrorMsg(msg.mensaje || "Error desconocido");
  }, [addToast]);

  // Scroll automático en comentarios
  useEffect(() => {
    if (activeTab === "comentarios") commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comentarios, activeTab]);

  // ── Acciones ───────────────────────────────────────────────────────────
  const iniciar = async () => {
    if (!inputVal.trim()) return;
    const user = limpiarUsuario(inputVal);
    if (!user) return;
    setConectando(true);
    try {
      const res  = await apiFetch(`${API}/api/monitorear/${encodeURIComponent(user)}`, { method: "POST" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.mensaje || "Error al iniciar");
      setUsuario(user);
      resetState();
      setScreen("monitor");
      conectarWS(user);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setConectando(false);
    }
  };

  const detener = async () => {
    if (!usuario) return;
    await apiFetch(`${API}/api/detener/${encodeURIComponent(usuario)}`, { method: "POST" });
    wsRef.current?.close();
    setIsLive(false);
  };

  const volver = () => {
    wsRef.current?.close();
    wsRef.current = null;
    setScreen("search");
    setInputVal("");
  };

  const rankingList = Object.values(ranking).sort((a, b) => b.diamantes - a.diamantes);
  const usuariosList = Object.values(usuarios).slice(0, 100);

  const TABS = [
    { id: "comentarios", label: "Comentarios", badge: comentarios.length,  icon: "💬" },
    { id: "regalos",     label: "Regalos",     badge: regalos.length,       icon: "🎁" },
    { id: "ranking",     label: "Ranking",     badge: rankingList.length,   icon: "🏆" },
    { id: "usuarios",    label: "Usuarios",    badge: usuariosList.length,  icon: "👥" },
  ];

  const wsColors = { off: "bg-white/25", connecting: "bg-yellow-400", on: "bg-green-400" };

  // ── SEARCH SCREEN ──────────────────────────────────────────────────────
  if (screen === "search") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-md rounded-2xl p-8 relative overflow-hidden"
          style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}>
          {/* top glow line */}
          <div className="absolute top-0 left-[20%] right-[20%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, #00e5ff, transparent)" }} />

          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Consultar Streamer
          </h2>
          <p className="font-mono text-xs mb-6" style={{ color: "oklch(0.50 0.01 265)" }}>
            Monitor TikTok LIVE en tiempo real
          </p>

          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg flex-shrink-0" style={{ color: "#00e5ff" }}>@</span>
            <input
              className="flex-1 rounded-xl px-3 py-3 font-mono text-sm text-white outline-none transition-all"
              style={{ background: "oklch(0.12 0.015 265)", border: "1px solid oklch(1 0 0 / 12%)" }}
              placeholder="usuario o URL de TikTok"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && iniciar()}
              onFocus={e => (e.target.style.borderColor = "#00e5ff")}
              onBlur={e  => (e.target.style.borderColor = "oklch(1 0 0 / 12%)")}
            />
            <button
              onClick={iniciar}
              disabled={conectando}
              className="flex-shrink-0 px-4 py-3 rounded-xl font-semibold text-sm text-black transition-all disabled:opacity-40"
              style={{ background: "#00e5ff" }}
            >
              {conectando ? "..." : "Conectar"}
            </button>
          </div>
          <p className="font-mono text-[11px] text-center mt-4" style={{ color: "oklch(0.35 0.01 265)" }}>
            Puedes pegar la URL completa del perfil
          </p>
        </div>
      </div>
    );
  }

  // ── MONITOR SCREEN ─────────────────────────────────────────────────────
  const creadorNick = creador.nickname || creador.room_info?.owner?.nickname || usuario;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={volver}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs transition-all"
          style={{ background: "oklch(0.18 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)", color: "oklch(0.60 0.01 265)" }}>
          ← Volver
        </button>

        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <span className="font-bold text-xl text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            @{usuario}
          </span>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs font-bold ${isLive ? "text-red-400" : "text-white/40"}`}
            style={{ background: isLive ? "rgba(255,45,120,0.12)" : "rgba(122,136,153,0.1)", border: `1px solid ${isLive ? "rgba(255,45,120,0.3)" : "oklch(1 0 0 / 8%)"}` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: isLive ? "#ff2d78" : "oklch(0.40 0.01 265)", animation: isLive ? "pulse 1.2s infinite" : "none" }} />
            {isLive ? "EN VIVO" : "Sin conexión"}
          </div>
          {/* WS status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs"
            style={{ background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.1)", color: "oklch(0.60 0.01 265)" }}>
            <span className={`w-1.5 h-1.5 rounded-full ${wsColors[wsStatus]}`} />
            {wsStatus === "on" ? "conectado" : wsStatus === "connecting" ? "conectando..." : "desconectado"}
          </div>
        </div>

        <button onClick={detener}
          className="px-3 py-2 rounded-lg font-mono text-xs transition-all"
          style={{ background: "rgba(255,45,120,0.1)", border: "1px solid rgba(255,45,120,0.3)", color: "#ff2d78" }}>
          ⬛ Detener
        </button>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-xs"
          style={{ background: "rgba(255,45,120,0.06)", border: "1px solid rgba(255,45,120,0.2)", color: "#ff2d78" }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Main grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "280px 1fr" }}>

        {/* Creator panel */}
        <div className="rounded-2xl overflow-hidden flex flex-col"
          style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}>
          <div className="px-4 py-3 font-mono text-xs font-bold uppercase tracking-widest"
            style={{ borderBottom: "1px solid oklch(1 0 0 / 6%)", color: "oklch(0.50 0.01 265)" }}>
            📡 Creador
          </div>
          <div className="flex flex-col items-center gap-4 p-5 flex-1">
            {/* Avatar */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-[-3px] rounded-full" style={{
                background: isLive ? "conic-gradient(#ff2d78, #7c3aed, #00e5ff, #ff2d78)" : "oklch(0.25 0.01 265)",
                animation: isLive ? "spin 3s linear infinite" : "none"
              }} />
              <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center text-2xl"
                style={{ background: "oklch(0.20 0.015 265)", border: "3px solid oklch(0.16 0.015 265)", zIndex: 1 }}>
                {avatarUrl
                  ? <img src={avatarUrl} className="w-full h-full object-cover" />
                  : "🎭"}
              </div>
            </div>

            <div className="text-center">
              <div className="font-bold text-white text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {creadorNick || usuario}
              </div>
              <div className="font-mono text-xs mt-0.5" style={{ color: "oklch(0.50 0.01 265)" }}>
                <span style={{ color: "#00e5ff" }}>@</span>{creador.unique_id || usuario}
              </div>
            </div>

            {/* Viewers */}
            <div className="w-full rounded-xl p-3 text-center"
              style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.15)" }}>
              <span className="font-mono font-bold text-3xl block leading-none" style={{ color: "#00e5ff" }}>
                {formatNum(viewers)}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest mt-1 block" style={{ color: "oklch(0.50 0.01 265)" }}>
                espectadores
              </span>
            </div>

            {/* Stats mini */}
            <div className="w-full grid grid-cols-2 gap-2">
              {[
                { id: "joins",       val: metricas.joins,       label: "Joins" },
                { id: "shares",      val: metricas.shares,      label: "Shares" },
                { id: "comentarios", val: metricas.comentarios, label: "Comentarios" },
                { id: "regalos_m",   val: metricas.regalos,     label: "Regalos" },
              ].map(s => (
                <div key={s.id} className="rounded-xl p-2.5 text-center"
                  style={{ background: "oklch(0.12 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}>
                  <span className="font-mono font-bold text-base text-white block">{formatNum(s.val)}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "oklch(0.40 0.01 265)" }}>{s.label}</span>
                </div>
              ))}
            </div>

            {roomId && (
              <div className="font-mono text-[10px] text-center" style={{ color: "oklch(0.35 0.01 265)" }}>
                Room: {roomId}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Metrics */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}>
            <div className="grid grid-cols-3 divide-x" style={{ borderColor: "oklch(1 0 0 / 6%)" }}>
              {[
                { icon: "❤️",  label: "Likes",      val: metricas.likes_total_recibidos },
                { icon: "💎",  label: "Diamantes",  val: metricas.diamantes_estimados },
                { icon: "🎁",  label: "Regalos",    val: metricas.regalos },
              ].map(m => (
                <div key={m.label} className="p-4 text-center" style={{ borderColor: "oklch(1 0 0 / 6%)" }}>
                  <span className="text-lg block mb-1">{m.icon}</span>
                  <span className="font-mono font-bold text-2xl text-white block">{formatNum(m.val)}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "oklch(0.40 0.01 265)" }}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="rounded-2xl overflow-hidden flex flex-col flex-1"
            style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}>
            {/* Tab bar */}
            <div className="flex px-3" style={{ borderBottom: "1px solid oklch(1 0 0 / 6%)" }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className="flex items-center gap-1.5 px-3 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-colors relative"
                  style={{
                    color: activeTab === t.id ? "#00e5ff" : "oklch(0.50 0.01 265)",
                    borderBottom: activeTab === t.id ? "2px solid #00e5ff" : "2px solid transparent",
                    top: "1px"
                  }}>
                  <span>{t.label}</span>
                  <span className="rounded-lg px-1.5 py-px text-[10px]"
                    style={{ background: "rgba(0,229,255,0.12)", color: "#00e5ff" }}>
                    {t.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="overflow-y-auto p-2 space-y-1.5" style={{ maxHeight: 420 }}>
              {activeTab === "comentarios" && (
                comentarios.length === 0
                  ? <EmptyState icon="💬" text="Los comentarios aparecerán aquí<br>cuando el LIVE inicie" />
                  : <>
                      {comentarios.map((c, i) => <ComentarioItem key={i} c={c} isNew={i === newComIdx} />)}
                      <div ref={commentsEndRef} />
                    </>
              )}
              {activeTab === "regalos" && (
                regalos.length === 0
                  ? <EmptyState icon="🎁" text="Los regalos aparecerán aquí" />
                  : regalos.map((r, i) => <RegaloItem key={i} r={r} />)
              )}
              {activeTab === "ranking" && (
                rankingList.length === 0
                  ? <EmptyState icon="🏆" text="El ranking aparecerá<br>cuando se reciban regalos" />
                  : rankingList.map((e, i) => <RankingItem key={e.unique_id || i} entry={e} pos={i} />)
              )}
              {activeTab === "usuarios" && (
                usuariosList.length === 0
                  ? <EmptyState icon="👥" text="Los usuarios que interactúen<br>aparecerán aquí" />
                  : usuariosList.map((u, i) => <UsuarioItem key={i} data={u} />)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="rounded-xl px-3.5 py-2.5 font-mono text-sm pointer-events-auto max-w-xs"
            style={{
              background: t.tipo === "gift" ? "rgba(255,200,67,0.08)" : "oklch(0.20 0.015 265)",
              border: t.tipo === "gift" ? "1px solid rgba(255,200,67,0.3)" : "1px solid oklch(1 0 0 / 12%)",
              color: t.tipo === "gift" ? "#ffc843" : "white",
              animation: "slideIn 0.3s ease"
            }}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
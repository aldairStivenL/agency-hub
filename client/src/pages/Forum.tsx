/**
 * Agency Hub — Forum Page
 * Design: Dark Luxury — foro comunitario + sección de soluciones rápidas a problemas comunes
 */

import { useApp } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Megaphone,
  HelpCircle,
  Lightbulb,
  Plus,
  Search,
  ChevronRight,
  X,
  ThumbsUp,
  Clock,
  Zap,
  BookOpen,
  Wifi,
  CreditCard,
  Shield,
  Settings,
} from "lucide-react";
import type { ForumPost } from "@/contexts/AppContext";
import { toast } from "sonner";

const CATEGORY_CONFIG = {
  problema: { label: "Problema", color: "#e8294c", icon: AlertCircle },
  consejo: { label: "Consejo", color: "#22c55e", icon: Lightbulb },
  anuncio: { label: "Anuncio", color: "#4f6ef7", icon: Megaphone },
  pregunta: { label: "Pregunta", color: "#f59e0b", icon: HelpCircle },
};

const QUICK_SOLUTIONS = [
  {
    id: "qs1",
    icon: Wifi,
    title: "Error al entrar al LIVE",
    color: "#e8294c",
    steps: [
      "Verifica que tu cuenta tenga más de 1,000 seguidores",
      "Asegúrate de tener la app actualizada a la última versión",
      "Comprueba que no tengas restricciones de cuenta activas",
      "Intenta cerrar sesión y volver a iniciar",
      "Si persiste, contacta al soporte de TikTok desde Configuración > Soporte",
    ],
  },
  {
    id: "qs2",
    icon: CreditCard,
    title: "Diamantes no acreditados",
    color: "#f59e0b",
    steps: [
      "Los diamantes pueden tardar hasta 24h en reflejarse",
      "Verifica que la batalla haya finalizado correctamente",
      "Revisa el historial de transacciones en TikTok Studio",
      "Si han pasado más de 48h, crea un ticket de soporte",
      "Guarda capturas de pantalla de la batalla como evidencia",
    ],
  },
  {
    id: "qs3",
    icon: Shield,
    title: "Cuenta suspendida temporalmente",
    color: "#8b5cf6",
    steps: [
      "Lee el correo de TikTok para conocer la razón específica",
      "Evita contenido que viole las políticas de la comunidad",
      "Espera el período indicado (generalmente 24-72h)",
      "Puedes apelar desde Configuración > Privacidad > Apelaciones",
      "Contacta a tu manager de agencia para asistencia adicional",
    ],
  },
  {
    id: "qs4",
    icon: Settings,
    title: "Problema con la configuración de batalla",
    color: "#06b6d4",
    steps: [
      "Ambos streamers deben tener el modo batalla habilitado",
      "Verifica que el rival también esté en vivo en ese momento",
      "La solicitud de batalla debe enviarse durante el LIVE activo",
      "Asegúrate de tener suficiente audiencia (mínimo 50 espectadores)",
      "Si el rival no acepta en 60 segundos, la solicitud expira",
    ],
  },
];

interface PostModalProps {
  post: ForumPost;
  onClose: () => void;
}

function PostModal({ post, onClose }: PostModalProps) {
  const cat = CATEGORY_CONFIG[post.category];
  const CatIcon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 10%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
          <div className="flex items-center gap-2">
            <CatIcon className="w-4 h-4" style={{ color: cat.color }} />
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${cat.color}20`, color: cat.color }}>
              {cat.label}
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {post.title}
          </h2>
          <div className="flex items-center gap-3 mb-4 text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.replies} respuestas</span>
            {post.solved && (
              <span className="flex items-center gap-1 text-green-400">
                <CheckCircle className="w-3 h-3" />
                Resuelto
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(0.75 0.01 265)" }}>
            {post.content}
          </p>

          <div className="mt-6 pt-4 border-t" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Escribe una respuesta..."
                className="flex-1 px-3 py-2 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                style={{ background: "oklch(0.20 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
              />
              <button
                onClick={() => { toast.success("Respuesta enviada"); onClose(); }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface QuickSolutionCardProps {
  solution: typeof QUICK_SOLUTIONS[0];
}

function QuickSolutionCard({ solution }: QuickSolutionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = solution.icon;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/3 transition-all"
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${solution.color}20` }}>
          <Icon className="w-4 h-4" style={{ color: solution.color }} />
        </div>
        <span className="flex-1 text-sm font-medium text-white">{solution.title}</span>
        <ChevronRight
          className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-90" : ""}`}
          style={{ color: "oklch(0.50 0.01 265)" }}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              <div className="border-t mb-3" style={{ borderColor: "oklch(1 0 0 / 6%)" }} />
              <ol className="space-y-2">
                {solution.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "oklch(0.75 0.01 265)" }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ background: `${solution.color}20`, color: solution.color }}>
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <button
                onClick={() => toast.success("Marcado como resuelto")}
                className="mt-3 flex items-center gap-1.5 text-xs font-medium text-green-400 hover:text-green-300 transition-colors"
              >
                <CheckCircle className="w-3 h-3" />
                Marcar como resuelto
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ForumPage() {
  const { forumPosts } = useApp();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [activeTab, setActiveTab] = useState<"forum" | "solutions">("forum");

  const filtered = forumPosts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: "oklch(0.20 0.015 265)" }}>
        <button
          onClick={() => setActiveTab("forum")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "forum" ? "text-white" : "text-white/40 hover:text-white/70"}`}
          style={activeTab === "forum" ? { background: "oklch(0.16 0.015 265)" } : {}}
        >
          <MessageSquare className="w-4 h-4" />
          Foro Comunitario
        </button>
        <button
          onClick={() => setActiveTab("solutions")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "solutions" ? "text-white" : "text-white/40 hover:text-white/70"}`}
          style={activeTab === "solutions" ? { background: "oklch(0.16 0.015 265)" } : {}}
        >
          <Zap className="w-4 h-4" />
          Soluciones Rápidas
        </button>
      </div>

      {activeTab === "forum" ? (
        <>
          {/* Forum controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "oklch(0.50 0.01 265)" }} />
              <input
                type="text"
                placeholder="Buscar en el foro..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                style={{ background: "oklch(0.20 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
              />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilterCat("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCat === "all" ? "text-white" : "text-white/40 hover:text-white/70"}`}
                style={filterCat === "all" ? { background: "rgba(232,41,76,0.2)", color: "#e8294c" } : { background: "oklch(0.20 0.015 265)" }}
              >
                Todos
              </button>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setFilterCat(key)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCat === key ? "text-white" : "text-white/40 hover:text-white/70"}`}
                    style={filterCat === key ? { background: `${config.color}20`, color: config.color } : { background: "oklch(0.20 0.015 265)" }}
                  >
                    <Icon className="w-3 h-3" />
                    {config.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => toast.info("Crear nuevo post próximamente")}
              className="ml-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}
            >
              <Plus className="w-4 h-4" />
              Nuevo Post
            </button>
          </div>

          {/* Posts list */}
          <div className="space-y-3">
            {filtered.map((post, i) => {
              const cat = CATEGORY_CONFIG[post.category];
              const CatIcon = cat.icon;

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedPost(post)}
                  className="rounded-xl p-4 cursor-pointer hover:border-white/15 transition-all"
                  style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${cat.color}20` }}>
                      <CatIcon className="w-4 h-4" style={{ color: cat.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-white flex-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {post.title}
                        </h3>
                        {post.solved && (
                          <span className="flex items-center gap-1 text-xs text-green-400 flex-shrink-0">
                            <CheckCircle className="w-3 h-3" />
                            Resuelto
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-1 line-clamp-1" style={{ color: "oklch(0.60 0.01 265)" }}>
                        {post.content}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${cat.color}15`, color: cat.color }}>
                          {cat.label}
                        </span>
                        <span className="text-xs" style={{ color: "oklch(0.45 0.01 265)" }}>
                          por {post.author}
                        </span>
                        <span className="text-xs" style={{ color: "oklch(0.45 0.01 265)" }}>
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1 text-xs ml-auto" style={{ color: "oklch(0.45 0.01 265)" }}>
                          <MessageSquare className="w-3 h-3" />
                          {post.replies}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Quick Solutions */}
          <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(79,110,247,0.1)", border: "1px solid rgba(79,110,247,0.2)" }}>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-white">Base de Conocimiento</span>
            </div>
            <p className="text-xs" style={{ color: "oklch(0.60 0.01 265)" }}>
              Soluciones paso a paso para los problemas más frecuentes de las agencias TikTok LIVE.
              Haz clic en cada problema para expandir la solución.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {QUICK_SOLUTIONS.map((solution, i) => (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <QuickSolutionCard solution={solution} />
              </motion.div>
            ))}
          </div>

          {/* Contact support */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl p-5 flex items-center gap-4"
            style={{ background: "linear-gradient(135deg, rgba(232,41,76,0.1), rgba(79,110,247,0.1))", border: "1px solid oklch(1 0 0 / 8%)" }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}>
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                ¿No encontraste solución?
              </h3>
              <p className="text-xs" style={{ color: "oklch(0.60 0.01 265)" }}>
                Contacta directamente a tu manager de agencia o crea un post en el foro.
              </p>
            </div>
            <button
              onClick={() => toast.success("Abriendo chat de soporte...")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}
            >
              Contactar
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </>
      )}

      {/* Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Agency Hub — ProfileSelector Page
 * Design: Dark Luxury — fondo oscuro con imagen de TikTok, cards de selección de rol
 * Colores: bg #0f1117, primary rojo #e8294c, secondary azul índigo
 */

import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { Shield, User, ChevronRight } from "lucide-react";

const LOGIN_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663455864775/gVC6y5Q2wpNYr4v7JmuSu6/agency-hub-login-bg-m89PU4UoGMpfkQbMXrbJuE.webp";
const LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663455864775/gVC6y5Q2wpNYr4v7JmuSu6/agency-hub-logo-D42x3YiMh7exopMvRVDsmF.webp";

export default function ProfileSelector() {
  const { setRole } = useApp();

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${LOGIN_BG})` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg px-6">
        {/* Logo + Brand */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center mb-10"
        >
          <div className="w-24 h-24 mb-4 rounded-2xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 0 40px rgba(232,41,76,0.4)" }}>
            <img src={LOGO} alt="Agency Hub Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Agency Hub
          </h1>
          <p className="text-white/60 text-sm mt-1 tracking-wide">Plataforma de Gestión TikTok</p>
        </motion.div>

        {/* Selector label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center text-white/70 text-sm mb-6 tracking-wide"
        >
          Selecciona tu perfil para continuar
        </motion.p>

        {/* Role Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Admin Card */}
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onClick={() => setRole("admin")}
            className="group relative flex flex-col items-center p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-red-500/50 transition-all duration-300"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)", boxShadow: "0 0 20px rgba(232,41,76,0.4)" }}>
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Administrador
            </h3>
            <p className="text-white/50 text-xs text-center leading-relaxed mb-4">
              Acceso completo a todas las funciones de gestión de la agencia
            </p>
            <div className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold text-white transition-all duration-300 group-hover:gap-2"
              style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}>
              Continuar como Admin
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.button>

          {/* Streamer Card */}
          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onClick={() => setRole("streamer")}
            className="group relative flex flex-col items-center p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, #00b4d8, #0077b6)", boxShadow: "0 0 20px rgba(0,180,216,0.4)" }}>
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Streamer
            </h3>
            <p className="text-white/50 text-xs text-center leading-relaxed mb-4">
              Visualiza tus estadísticas personales y pagos
            </p>
            <div className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold text-white transition-all duration-300 group-hover:gap-2"
              style={{ background: "linear-gradient(135deg, #00b4d8, #0077b6)" }}>
              Continuar como Streamer
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.button>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center text-white/30 text-xs mt-8"
        >
          Agency Hub v2.0 — Plataforma exclusiva para agencias certificadas
        </motion.p>
      </div>
    </div>
  );
}

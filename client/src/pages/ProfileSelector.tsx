/**
 * Agency Hub — ProfileSelector Page
 * Design: Dark Luxury — fondo oscuro con imagen de TikTok, cards de selección de rol
 * Colores: bg #0f1117, primary rojo #e8294c, secondary azul índigo
 */

import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { Shield, User, ChevronRight, LogOut } from "lucide-react";
import { supabase } from "./supabaseClient";

const LOGIN_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663455864775/gVC6y5Q2wpNYr4v7JmuSu6/agency-hub-login-bg-m89PU4UoGMpfkQbMXrbJuE.webp";
const LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663455864775/gVC6y5Q2wpNYr4v7JmuSu6/agency-hub-logo-D42x3YiMh7exopMvRVDsmF.webp";

export default function ProfileSelector() {
  const { setRole } = useApp();

  // --- 1. FUNCIÓN PARA GUARDAR EL ROL EN SUPABASE ---
  const handleRoleSelection = async (selectedRole: 'admin' | 'streamer') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error("No hay usuario autenticado");
      return;
    }

    // Usamos upsert para asegurar que la fila se cree o actualice
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        role: selectedRole,
        updated_at: new Date().toISOString() 
      });

    if (error) {
      // Si hay error de Supabase, lo mostramos aquí
      console.error("Error de Supabase:", error.message);
      alert("Supabase dice: " + error.message);
      return;
    }

    // Si todo sale bien, cambiamos el estado
    console.log("¡Éxito! Rol guardado:", selectedRole);
    setRole(selectedRole);

  } catch (err: any) {
    console.error("Error inesperado en el código:", err);
  }
};

  // --- 2. FUNCIÓN DE LOGOUT CORREGIDA ---
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Limpiamos el rol en el estado local para que no intente volver aquí
      setRole(null); 
      // Redirigir al inicio o recargar
      window.location.href = "/"; 
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      
      {/* BOTÓN CERRAR SESIÓN  */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={handleLogout}
        className="absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
      >
        <LogOut className="w-4 h-4" />
        Cerrar Sesión
      </motion.button>

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${LOGIN_BG})` }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg px-6">
        {/* Logo + Brand */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="w-24 h-24 mb-4 rounded-2xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 0 40px rgba(232,41,76,0.4)" }}>
            <img src={LOGO} alt="Agency Hub Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-bold text-white">Agency Hub</h1>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Admin Card */}
          <motion.button
            onClick={() => handleRoleSelection("admin")}
            className="group relative flex flex-col items-center p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-red-500/50 transition-all"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}>
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg">Administrador</h3>
            <div className="mt-4 flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #e8294c, #c41e3a)" }}>
              Continuar <ChevronRight className="w-3 h-3" />
            </div>
          </motion.button>

          {/* Streamer Card */}
          <motion.button
            onClick={() => handleRoleSelection("streamer")}
            className="group relative flex flex-col items-center p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-cyan-500/50 transition-all"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #00b4d8, #0077b6)" }}>
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg">Streamer</h3>
            <div className="mt-4 flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #00b4d8, #0077b6)" }}>
              Continuar <ChevronRight className="w-3 h-3" />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
/**
 * Agency Hub — DashboardLayout
 * Design: Dark Luxury — sidebar oscura, header con breadcrumb
 * Sidebar: 240px fija, colapsable en mobile
 */

import { useApp } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Swords,
  BarChart3,
  MessageSquare,
  GitBranch,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
} from "lucide-react";
import { useState, ReactNode } from "react";

const LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663455864775/gVC6y5Q2wpNYr4v7JmuSu6/agency-hub-logo-D42x3YiMh7exopMvRVDsmF.webp";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "streamers", label: "Streamers", icon: Users },
  { id: "battles", label: "Batallas Automáticas", icon: Swords },
  { id: "reports", label: "Reportes Financieros", icon: BarChart3 },
  { id: "forum", label: "Foro Comunitario", icon: MessageSquare },
  { id: "flowchart", label: "Diagrama de Flujo", icon: GitBranch },
];

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Panel de Control",
  streamers: "Streamers",
  battles: "Batallas Automáticas",
  reports: "Reportes Financieros",
  forum: "Foro Comunitario",
  flowchart: "Diagrama de Flujo",
  streamer_profile: "Perfil de Streamer",
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { currentPage, setCurrentPage, setRole } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0f1117" }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : undefined }}
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-60 flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300 lg:transition-none
        `}
        style={{
          background: "oklch(0.14 0.015 265)",
          borderRight: "1px solid oklch(1 0 0 / 6%)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "oklch(1 0 0 / 6%)" }}>
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
            style={{ boxShadow: "0 0 12px rgba(232,41,76,0.3)" }}>
            <img src={LOGO} alt="AH" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-white font-bold text-base leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Agency Hub
            </div>
            <div className="text-xs" style={{ color: "oklch(0.60 0.01 265)" }}>
              Panel Admin
            </div>
          </div>
          <button
            className="ml-auto lg:hidden text-white/40 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {NAV_ITEMS.map((item, i) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? "text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }
                `}
                style={isActive ? {
                  background: "oklch(0.55 0.22 15 / 15%)",
                  borderLeft: "3px solid oklch(0.55 0.22 15)",
                  paddingLeft: "calc(0.75rem - 3px)",
                } : {}}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-red-400" : ""}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 text-red-400 opacity-60" />}
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom: logout */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "oklch(1 0 0 / 6%)" }}>
          <button
            onClick={() => setRole(null)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header
          className="flex items-center gap-4 px-6 py-4 flex-shrink-0"
          style={{
            background: "oklch(0.14 0.015 265)",
            borderBottom: "1px solid oklch(1 0 0 / 6%)",
          }}
        >
          <button
            className="lg:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {PAGE_TITLES[currentPage] || "Panel de Control"}
            </h1>
            <p className="text-xs" style={{ color: "oklch(0.60 0.01 265)" }}>
              Resumen del rendimiento de la agencia en tiempo real
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* Time */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: "oklch(0.20 0.015 265)", color: "oklch(0.60 0.01 265)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Última actualización: {timeStr}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

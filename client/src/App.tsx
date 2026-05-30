/**
 * Agency Hub — App.tsx
 * Routing: / → Home | /app → Dashboard (admin) | /streamer/:agencyId → vista pública
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider, useApp } from "./contexts/AppContext";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages
import Home               from "./pages/Home";
import Dashboard          from "./pages/Dashboard";
import StreamersPage      from "./pages/Streamers";
import BattlesPage        from "./pages/Battles";
import ReportsPage        from "./pages/Reports";
import ForumPage          from "./pages/Forum";
import FlowChartPage      from "./pages/FlowChart";
import StreamerPublicView from "./pages/StreamerPublicView";
import DashboardLayout    from "./components/DashboardLayout";

import { useState, useEffect } from "react";
import { supabase } from "./pages/supabaseClient";

// ── Admin app ─────────────────────────────────────────────────────────────
function AdminApp() {
  const { role, setRole, currentPage } = useApp();
  const [showLanding, setShowLanding]  = useState(true);
  const [checking, setChecking]        = useState(true);

  // Al montar: detectar si ya hay sesión activa de Supabase
  useEffect(() => {
    // Al detectar sesión activa, asignar rol admin directamente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setShowLanding(false);
        setRole("admin");
      }
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setShowLanding(false);
        setRole("admin");
      }
      if (event === "SIGNED_OUT") {
        setShowLanding(true);
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setRole]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.11 0.015 265)" }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#e8294c", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (showLanding) {
    return (
      <Home
        onEnter={() => { setShowLanding(false); setRole("admin"); }}
        setRole={setRole}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":  return <Dashboard />;
      case "streamers":  return <StreamersPage />;
      case "battles":    return <BattlesPage />;
      case "reports":    return <ReportsPage />;
      case "forum":      return <ForumPage />;
      case "flowchart":  return <FlowChartPage />;
      default:           return <Dashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderPage()}
    </DashboardLayout>
  );
}

// ── Root con rutas ────────────────────────────────────────────────────────
function AppContent() {
  return (
    <Routes>
      {/* Ruta pública del streamer — no requiere sesión */}
      <Route path="/streamer/:agencyId" element={<StreamerPublicView />} />

      {/* App principal (admin) */}
      <Route path="/app" element={<AdminApp />} />

      {/* Redirigir / → /app */}
      <Route path="/" element={<Navigate to="/app" replace />} />

      {/* Cualquier otra ruta → /app */}
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AppProvider>
          <TooltipProvider>
            <Toaster
              theme="dark"
              toastOptions={{
                style: {
                  background: "oklch(0.22 0.02 265)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                  color: "white",
                },
              }}
            />
            <AppContent />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
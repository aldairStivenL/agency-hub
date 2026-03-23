/**
 * Agency Hub — App.tsx
 * Design: Dark Luxury — siempre dark theme
 * Routing: ProfileSelector → Admin (DashboardLayout) | Streamer (StreamerView)
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider, useApp } from "./contexts/AppContext";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages
import Home from './pages/Home';
import ProfileSelector from "./pages/ProfileSelector";
import Dashboard from "./pages/Dashboard";
import StreamersPage from "./pages/Streamers";
import BattlesPage from "./pages/Battles";
import ReportsPage from "./pages/Reports";
import ForumPage from "./pages/Forum";
import FlowChartPage from "./pages/FlowChart";
import StreamerView from "./pages/StreamerView";
import DashboardLayout from "./components/DashboardLayout";

import { useState } from "react";

function AppContent() {
  const { role, currentPage } = useApp();
  const [showLanding, setShowLanding] = useState(true);
  if (showLanding) {
  return <Home onEnter={() => setShowLanding(false)} />;
}

  // Not logged in — show profile selector
  if (!role) {
    return <ProfileSelector />;
  }

  // Streamer view
  if (role === "streamer") {
    return <StreamerView />;
  }

  // Admin view — render current page inside layout
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <Dashboard />;
      case "streamers": return <StreamersPage />;
      case "battles": return <BattlesPage />;
      case "reports": return <ReportsPage />;
      case "forum": return <ForumPage />;
      case "flowchart": return <FlowChartPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderPage()}
    </DashboardLayout>
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

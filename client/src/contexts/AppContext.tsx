import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "streamer" | null;

export interface Streamer {
  id: string;
  name: string;
  tiktokUser: string;
  avatar: string;
  diamonds: number;
  diamondsPrev: number;
  followers: number;
  isLive: boolean;
  rank: "Bronze" | "Silver" | "Gold" | "Diamond" | "Elite";
  joinDate: string;
  earnings: number;
  commission: number;
  battles: number;
  wins: number;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface Battle {
  id: string;
  streamerId: string;
  streamerName: string;
  rivalName: string;
  rivalAgency: string;
  date: string;
  time: string;
  diamonds: number;
  result: "win" | "loss" | "pending";
  flyerGenerated: boolean;
  type: "official" | "friendly";
}

export interface ForumPost {
  id: string;
  title: string;
  category: "problema" | "consejo" | "anuncio" | "pregunta";
  author: string;
  date: string;
  content: string;
  replies: number;
  solved: boolean;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  streamers: Streamer[];
  battles: Battle[];
  forumPosts: ForumPost[];
  selectedStreamerId: string | null;
  setSelectedStreamerId: (id: string | null) => void;
}

const MOCK_STREAMERS: Streamer[] = [
  {
    id: "1",
    name: "Valentina Ríos",
    tiktokUser: "@vale_live",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=valentina&backgroundColor=b6e3f4",
    diamonds: 284740,
    diamondsPrev: 251200,
    followers: 125400,
    isLive: true,
    rank: "Diamond",
    joinDate: "2024-01-15",
    earnings: 1423.70,
    commission: 284.74,
    battles: 48,
    wins: 31,
    phone: "+57 300 123 4567",
    email: "vale@example.com",
    notes: "Especialista en música y baile. Horario: 8pm-12am"
  },
  {
    id: "2",
    name: "Carlos Mendoza",
    tiktokUser: "@carlosmendoza_tk",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos&backgroundColor=ffd5dc",
    diamonds: 198320,
    diamondsPrev: 210000,
    followers: 89200,
    isLive: false,
    rank: "Gold",
    joinDate: "2024-02-20",
    earnings: 991.60,
    commission: 198.32,
    battles: 32,
    wins: 18,
    phone: "+57 311 234 5678",
    email: "carlos@example.com",
    notes: "Gaming y entretenimiento. Horario: 7pm-11pm"
  },
  {
    id: "3",
    name: "Sofía Vargas",
    tiktokUser: "@sofi_vargas",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia&backgroundColor=c0aede",
    diamonds: 312500,
    diamondsPrev: 290000,
    followers: 198700,
    isLive: true,
    rank: "Elite",
    joinDate: "2023-11-10",
    earnings: 1562.50,
    commission: 312.50,
    battles: 67,
    wins: 45,
    phone: "+57 315 345 6789",
    email: "sofia@example.com",
    notes: "Top performer. Cocina y lifestyle."
  },
  {
    id: "4",
    name: "Diego Herrera",
    tiktokUser: "@diegoherrera_live",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=diego&backgroundColor=d1d4f9",
    diamonds: 87400,
    diamondsPrev: 75000,
    followers: 42300,
    isLive: false,
    rank: "Silver",
    joinDate: "2024-05-01",
    earnings: 437.00,
    commission: 87.40,
    battles: 15,
    wins: 8,
    phone: "+57 320 456 7890",
    email: "diego@example.com",
    notes: "Nuevo en la agencia. Mucho potencial."
  },
  {
    id: "5",
    name: "Mariana López",
    tiktokUser: "@mari_lopez_tk",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mariana&backgroundColor=b6e3f4",
    diamonds: 156800,
    diamondsPrev: 148000,
    followers: 73500,
    isLive: true,
    rank: "Gold",
    joinDate: "2024-03-15",
    earnings: 784.00,
    commission: 156.80,
    battles: 28,
    wins: 17,
    phone: "+57 325 567 8901",
    email: "mariana@example.com",
    notes: "Moda y belleza. Muy activa en batallas."
  },
  {
    id: "6",
    name: "Andrés Castillo",
    tiktokUser: "@andres_castillo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=andres&backgroundColor=ffd5dc",
    diamonds: 45200,
    diamondsPrev: 38000,
    followers: 21800,
    isLive: false,
    rank: "Bronze",
    joinDate: "2024-07-20",
    earnings: 226.00,
    commission: 45.20,
    battles: 8,
    wins: 3,
    phone: "+57 330 678 9012",
    email: "andres@example.com",
    notes: "En entrenamiento. Humor y entretenimiento."
  }
];

const MOCK_BATTLES: Battle[] = [
  {
    id: "b1",
    streamerId: "3",
    streamerName: "Sofía Vargas",
    rivalName: "Luna_Star",
    rivalAgency: "StarAgency",
    date: "2026-03-20",
    time: "20:00",
    diamonds: 0,
    result: "pending",
    flyerGenerated: true,
    type: "official"
  },
  {
    id: "b2",
    streamerId: "1",
    streamerName: "Valentina Ríos",
    rivalName: "MusicKing99",
    rivalAgency: "MusicPro Agency",
    date: "2026-03-19",
    time: "21:30",
    diamonds: 45200,
    result: "win",
    flyerGenerated: true,
    type: "official"
  },
  {
    id: "b3",
    streamerId: "2",
    streamerName: "Carlos Mendoza",
    rivalName: "GameMaster_TK",
    rivalAgency: "GamersHub",
    date: "2026-03-18",
    time: "19:00",
    diamonds: 32100,
    result: "loss",
    flyerGenerated: true,
    type: "official"
  },
  {
    id: "b4",
    streamerId: "5",
    streamerName: "Mariana López",
    rivalName: "FashionQueen",
    rivalAgency: "StyleAgency",
    date: "2026-03-21",
    time: "22:00",
    diamonds: 0,
    result: "pending",
    flyerGenerated: false,
    type: "official"
  },
  {
    id: "b5",
    streamerId: "3",
    streamerName: "Sofía Vargas",
    rivalName: "TopStreamer_X",
    rivalAgency: "EliteHub",
    date: "2026-03-17",
    time: "20:30",
    diamonds: 78400,
    result: "win",
    flyerGenerated: true,
    type: "official"
  }
];

const MOCK_FORUM: ForumPost[] = [
  {
    id: "f1",
    title: "¿Cómo solicitar una batalla oficial en TikTok LIVE?",
    category: "pregunta",
    author: "Admin",
    date: "2026-03-18",
    content: "Para solicitar una batalla oficial debes ir a la sección de Batallas en la app de TikTok LIVE Studio...",
    replies: 5,
    solved: true
  },
  {
    id: "f2",
    title: "Mi streamer no puede entrar al LIVE — Error de verificación",
    category: "problema",
    author: "Carlos M.",
    date: "2026-03-17",
    content: "El error de verificación generalmente ocurre cuando la cuenta no tiene los requisitos mínimos...",
    replies: 3,
    solved: true
  },
  {
    id: "f3",
    title: "Nuevo bono de diamantes para agencias — Marzo 2026",
    category: "anuncio",
    author: "Admin",
    date: "2026-03-15",
    content: "TikTok ha anunciado un bono especial del 15% adicional en diamantes para agencias certificadas...",
    replies: 12,
    solved: false
  },
  {
    id: "f4",
    title: "Consejos para aumentar diamantes en batallas",
    category: "consejo",
    author: "Sofía V.",
    date: "2026-03-14",
    content: "Después de 67 batallas he aprendido que la clave está en la preparación previa...",
    replies: 8,
    solved: false
  },
  {
    id: "f5",
    title: "¿Cuándo se procesan los pagos semanales?",
    category: "pregunta",
    author: "Diego H.",
    date: "2026-03-13",
    content: "Los pagos se procesan todos los lunes antes de las 12pm...",
    replies: 2,
    solved: true
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedStreamerId, setSelectedStreamerId] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentPage,
        setCurrentPage,
        streamers: MOCK_STREAMERS,
        battles: MOCK_BATTLES,
        forumPosts: MOCK_FORUM,
        selectedStreamerId,
        setSelectedStreamerId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

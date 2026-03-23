# Ideas de Diseño — Agency Hub

## Concepto General
Plataforma de gestión para agencias de TikTok. Diseño oscuro, profesional, con acentos de color que reflejen la energía de TikTok (rojo/rosa neón) y la solidez de una herramienta de negocios.

---

<response>
<text>
## Opción A — "Neon Noir" (Cyberpunk Minimalista)
**Design Movement:** Neo-Brutalism Dark / Cyberpunk Dashboard
**Core Principles:**
- Contraste extremo: fondos casi negros (#0a0a0f) con acentos neón vibrantes
- Tipografía técnica y precisa (Rajdhani + Inter)
- Bordes con glow effect en elementos activos
- Datos como protagonistas visuales

**Color Philosophy:**
- Fondo base: #0d0d14 (casi negro con tinte azul)
- Acento primario: #ff2d55 (rojo TikTok)
- Acento secundario: #00f2ea (cyan TikTok)
- Cards: #161622 con borde sutil
- Texto principal: #e8e8f0

**Layout Paradigm:**
- Sidebar fija izquierda (240px) con iconos + labels
- Content area con grid asimétrico
- Cards con bordes luminosos en hover

**Signature Elements:**
- Líneas de acento neón en elementos activos
- Gráficas con gradiente rojo-rosa
- Avatares con ring de color según estado

**Interaction Philosophy:**
- Hover: borde glow + ligero scale
- Transiciones rápidas (150ms)
- Feedback visual inmediato

**Animation:**
- Entrada de cards: fade + slide desde abajo (200ms)
- Números: count-up animation
- Sidebar items: slide-in con delay escalonado

**Typography System:**
- Display: Rajdhani Bold (títulos, métricas grandes)
- Body: Inter Regular/Medium
- Monospace: JetBrains Mono (datos numéricos)
</text>
<probability>0.08</probability>
</response>

<response>
<text>
## Opción B — "Dark Luxury" (Elegante Profesional) ← SELECCIONADA
**Design Movement:** Dark Mode Premium SaaS / Material Dark
**Core Principles:**
- Profundidad por capas: background → surface → elevated surface
- Acentos cálidos (rojo/rosa) sobre fondos fríos (azul-gris oscuro)
- Jerarquía visual clara sin ruido
- Sensación de herramienta profesional de alto valor

**Color Philosophy:**
- Background: #0f1117 (azul-gris muy oscuro)
- Surface: #1a1d27 (cards y panels)
- Elevated: #222636 (modales, dropdowns)
- Primary accent: #e8294c (rojo TikTok refinado)
- Secondary accent: #4f6ef7 (azul índigo)
- Success: #22c55e
- Text primary: #f0f0f8
- Text muted: #8b8fa8

**Layout Paradigm:**
- Sidebar colapsable izquierda con logo en top
- Header con breadcrumb + acciones contextuales
- Grid de 12 columnas para dashboard
- Secciones con separación por whitespace, no por bordes

**Signature Elements:**
- Gradiente sutil en cards de métricas (surface → elevated)
- Gráficas con área rellena en gradiente rojo transparente
- Badges de estado con color semántico

**Interaction Philosophy:**
- Hover suave con background shift
- Active state con borde izquierdo rojo
- Transiciones fluidas (200ms ease)

**Animation:**
- Dashboard load: stagger de cards (50ms delay entre cada una)
- Gráficas: draw animation al entrar
- Números: spring animation en cambios

**Typography System:**
- Display: Space Grotesk Bold (títulos y métricas)
- Body: Inter 400/500
- Datos: Tabular nums con Inter
</text>
<probability>0.09</probability>
</response>

<response>
<text>
## Opción C — "Tactical Dark" (Militar/Operacional)
**Design Movement:** Tactical UI / HUD-inspired Dashboard
**Core Principles:**
- Estética de sala de operaciones / centro de control
- Información densa pero organizada
- Verde terminal + rojo alerta como acentos

**Color Philosophy:**
- Fondo: #080c10
- Surface: #0f1520
- Accent: #00ff88 (verde terminal)
- Alert: #ff4444
- Text: #c8d8e8

**Layout Paradigm:**
- Panel dividido en zonas funcionales
- Bordes con líneas finas tipo blueprint
- Indicadores de estado tipo LED

**Signature Elements:**
- Líneas de grid tipo papel milimetrado en backgrounds
- Iconos con estilo outline técnico
- Barras de progreso tipo carga de sistema

**Interaction Philosophy:**
- Click con efecto ripple verde
- Tooltips con estilo terminal
- Animaciones tipo "scan" en carga

**Animation:**
- Typing effect en títulos
- Scan line en carga de datos
- Blink en indicadores de estado

**Typography System:**
- Display: Share Tech Mono (monospace)
- Body: IBM Plex Sans
</text>
<probability>0.07</probability>
</response>

---

## DECISIÓN FINAL: Opción B — "Dark Luxury"

Razón: Equilibra la energía de TikTok (acentos rojo/rosa) con la seriedad de una herramienta de negocio profesional. El diseño por capas crea profundidad sin distracción, y la tipografía Space Grotesk + Inter da personalidad sin perder legibilidad.

import { useState } from "react";

import {
  AlertCircle,
  TrendingDown,
  Users,
  Zap,
  BarChart3,
  Brain,
  CheckCircle2,
  TrendingUp,
  Clock,
  Target,
  Activity,
  Cpu,
  Bell,
  Star,
  Twitter,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  Sparkles,
  ArrowRight
} from "lucide-react";

// ......


export default function Home({ onEnter }: { onEnter: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  // ── data ──────────────────────────────────────────────────────────────────

  const navLinks = [
    { label: 'Producto', href: '#' },
    { label: 'Características', href: '#' },
    { label: 'Precios', href: '#' },
    { label: 'Documentación', href: '#' },
  ];

  const problems = [
    {
      icon: AlertCircle,
      title: 'Caos Manual',
      description: 'Gestión por WhatsApp, screenshots desorganizados y sin estructura',
      color: 'from-[#ff0080] to-[#ff0080]/50',
    },
    {
      icon: TrendingDown,
      title: 'Sin Datos',
      description: 'No hay métricas reales, decisiones basadas en intuición',
      color: 'from-[#ff8800] to-[#ff8800]/50',
    },
    {
      icon: Users,
      title: 'Desorden Operativo',
      description: 'Imposible escalar, pérdida de oportunidades de crecimiento',
      color: 'from-[#0080ff] to-[#0080ff]/50',
    },
    {
      icon: Zap,
      title: 'Ingresos Limitados',
      description: 'Sin optimización, dejas dinero en la mesa cada día',
      color: 'from-[#00ffff] to-[#00ffff]/50',
    },
  ];

  const solutionFeatures = [
    {
      icon: BarChart3,
      title: 'Dashboard Centralizado',
      description: 'Toda la información de tus streamers en un solo lugar. Acceso instantáneo a métricas críticas.',
      color: '#00ffff',
    },
    {
      icon: Brain,
      title: 'IA Inteligente',
      description: 'Algoritmo avanzado que recomienda batallas óptimas para maximizar ingresos automáticamente.',
      color: '#ff0080',
    },
    {
      icon: Zap,
      title: 'Automatización',
      description: 'Reduce trabajo manual en un 80%. Monitoreo 24/7 sin intervención humana constante.',
      color: '#0080ff',
    },
    {
      icon: CheckCircle2,
      title: 'Análisis en Tiempo Real',
      description: 'Datos actualizados al instante para tomar decisiones informadas al momento.',
      color: '#00ff88',
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Más Ingresos',
      description: 'Aumenta tus ganancias hasta 300% con recomendaciones de batallas inteligentes.',
      stat: '+300%',
      color: '#ff0080',
    },
    {
      icon: Clock,
      title: 'Ahorro de Tiempo',
      description: 'Reduce trabajo manual en 80%. Dedica tu tiempo a crecer, no a gestionar.',
      stat: '-80%',
      color: '#00ffff',
    },
    {
      icon: Target,
      title: 'Mejores Decisiones',
      description: 'Datos en tiempo real para decisiones estratégicas respaldadas por IA.',
      stat: '24/7',
      color: '#0080ff',
    },
    {
      icon: Zap,
      title: 'Crecimiento Escalable',
      description: 'Gestiona 10, 100 o 1000 streamers sin aumentar tu carga operativa.',
      stat: '∞',
      color: '#00ff88',
    },
  ];

  const comparisonRows = [
    { metric: 'Tiempo de gestión semanal', before: '40 horas', after: '8 horas' },
    { metric: 'Ingresos mensuales', before: '$10,000', after: '$40,000+' },
    { metric: 'Streamers bajo gestión', before: '5-10', after: '50+' },
    { metric: 'Precisión en decisiones', before: '60%', after: '96%+' },
  ];

  const featureCards = [
    {
      icon: Users,
      title: 'Dashboard de Streamers',
      description: 'Gestiona todos tus streamers en un único dashboard. Ve performance, ganancias y estadísticas en tiempo real.',
      color: '#ff0080',
    },
    {
      icon: Activity,
      title: 'Análisis en Vivo',
      description: 'Monitorea batallas en tiempo real. Recibe alertas cuando hay oportunidades para optimizar.',
      color: '#00ffff',
    },
    {
      icon: Zap,
      title: 'Recomendaciones de Batallas',
      description: 'El algoritmo sugiere matchups óptimos basado en histórico, horarios y tendencias actuales.',
      color: '#0080ff',
    },
    {
      icon: BarChart3,
      title: 'Análisis Detallados',
      description: 'Reportes profundos sobre desempeño, ingresos, tasas de ganancia y métricas clave de cada streamer.',
      color: '#00ff88',
    },
    {
      icon: Cpu,
      title: 'Automatización IA',
      description: 'La inteligencia artificial trabaja 24/7 optimizando estrategias sin intervención manual constante.',
      color: '#ff8800',
    },
    {
      icon: Bell,
      title: 'Notificaciones Inteligentes',
      description: 'Recibe alertas cuando hay oportunidades críticas. Nunca pierdas una batalla importante.',
      color: '#ff00ff',
    },
  ];

  const stats = [
    { number: '50+', label: 'Agencias Activas', color: '#ff0080', icon: Users },
    { number: '1,000+', label: 'Streamers Gestionados', color: '#00ffff', icon: TrendingUp },
    { number: '$10M+', label: 'En Ganancias Generadas', color: '#0080ff', icon: Star },
  ];

  const testimonials = [
    {
      name: 'Carlos Mendez',
      role: 'Fundador, TikTok Pros Latam',
      content: 'Agency Hub cambió completamente mi operación. Pasé de gestionar 5 streamers a 50 sin aumentar mi equipo.',
      color: '#ff0080',
    },
    {
      name: 'Sofia Rodriguez',
      role: 'Manager, Latino Streamers Agency',
      content: 'Las recomendaciones de batallas son increíbles. Aumentamos ingresos 300% en solo 3 meses.',
      color: '#00ffff',
    },
    {
      name: 'Juan Pablo Vega',
      role: 'CEO, TikTok Live Masters',
      content: 'Es como tener un analista de datos 24/7 trabajando sin costo. Inversión que se paga sola.',
      color: '#0080ff',
    },
  ];

  const footerLinks = {
    Producto: ['Características', 'Precios', 'Seguridad', 'Roadmap'],
    Empresa: ['Sobre Nosotros', 'Blog', 'Carreras', 'Contacto'],
    Recursos: ['Documentación', 'Guías', 'API Reference', 'Status'],
    Legal: ['Privacidad', 'Términos', 'Cookies', 'Cumplimiento'],
  };

  const hoverColors: Record<string, string> = {
    Producto: 'hover:text-[#00ffff]',
    Empresa: 'hover:text-[#ff0080]',
    Recursos: 'hover:text-[#0080ff]',
    Legal: 'hover:text-[#ff0080]',
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#0a0e27] text-white">

      {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#2d3247]/50 bg-[#0a0e27]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#ff0080] to-[#00ffff]">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="bg-gradient-to-r from-[#ff0080] to-[#00ffff] text-transparent bg-clip-text">Agency</span>
                <span className="text-white">Hub</span>
              </span>
            </div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA + hamburger */}
            <div className="flex items-center gap-4">
              <button className="hidden sm:inline-flex px-6 py-2 rounded-lg font-semibold text-sm text-white bg-[#ff0080] hover:shadow-[0_0_20px_rgba(255,0,128,0.5)] transition-all">
                Empieza Ahora
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-[#1a1f3a] transition-colors">
                {menuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden border-t border-[#2d3247]/50 bg-[#1a1f3a]/50 backdrop-blur">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <a key={link.label} href={link.href} className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#2d3247]/50 transition-colors">
                    {link.label}
                  </a>
                ))}
            <button
  onClick={onEnter}
  className="w-full mt-2 px-4 py-2 rounded-lg bg-[#ff0080] text-white font-semibold hover:bg-[#ff0080]/80 transition"
>
  Empieza Ahora
</button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff0080]/10 via-transparent to-[#0080ff]/10 pointer-events-none" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#ff0080]/20 rounded-full filter blur-3xl opacity-50 animate-pulse pointer-events-none" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-[#0080ff]/20 rounded-full filter blur-3xl opacity-50 animate-pulse pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#00ffff]/20 rounded-full filter blur-3xl opacity-30 animate-pulse pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-[#1a1f3a]/80 border border-[#00ffff]/30 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#00ffff]" />
            <span className="text-sm text-[#00ffff] font-medium">Impulsado por IA</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight text-balance">
            Domina tu Agencia de{' '}
            <span className="bg-gradient-to-r from-[#ff0080] via-[#00ffff] to-[#0080ff] text-transparent bg-clip-text">
              TikTok Live
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Centraliza la gestión de tus streamers, optimiza batallas inteligentes y maximiza ingresos.
            Todo en una plataforma diseñada para agencias modernas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
           <button
  onClick={onEnter}
  className="group relative px-8 py-4 font-semibold text-white text-lg rounded-lg overflow-hidden"
>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff0080] to-[#ff0080] group-hover:blur-lg transition-all duration-300 opacity-75 group-hover:opacity-100" />
              <div className="absolute inset-[2px] bg-[#0a0e27] rounded-[6px]" />
              <span className="relative flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                Empieza Ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="px-8 py-4 font-semibold text-white text-lg rounded-lg bg-[#1a1f3a]/50 border border-[#00ffff]/50 hover:border-[#00ffff] hover:bg-[#1a1f3a]/80 backdrop-blur transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]">
              Solicitar Demo
            </button>
          </div>

          {/* Mock dashboard */}
          <div className="relative rounded-2xl overflow-hidden border border-[#00ffff]/20 backdrop-blur-md bg-[#1a1f3a]/30 p-8 shadow-2xl group hover:shadow-[0_0_40px_rgba(0,255,255,0.2)] transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/10 via-transparent to-[#ff0080]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { val: '50+', label: 'Agencias', color: '#00ffff' },
                  { val: '1000+', label: 'Streamers', color: '#ff0080' },
                  { val: '$10M+', label: 'En ganancias', color: '#0080ff' },
                ].map((s) => (
                  <div key={s.label} className="h-20 bg-[#2d3247]/50 rounded-lg flex items-center justify-center" style={{ border: `1px solid ${s.color}33` }}>
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
                      <div className="text-xs text-gray-400">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="h-3 bg-[#2d3247]/50 rounded-full w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-3 bg-[#2d3247]/50 rounded-full w-3/4" />
                  <div className="h-3 bg-[#2d3247]/50 rounded-full w-2/3" />
                </div>
                <div className="h-3 bg-[#2d3247]/50 rounded-full w-5/6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
            <div className="text-center"><div className="text-3xl font-bold text-[#00ffff] mb-2">300%</div><p className="text-gray-400 text-sm">Incremento en eficiencia</p></div>
            <div className="text-center"><div className="text-3xl font-bold text-[#ff0080] mb-2">24/7</div><p className="text-gray-400 text-sm">Monitoreo inteligente</p></div>
            <div className="text-center"><div className="text-3xl font-bold text-[#0080ff] mb-2">Real-time</div><p className="text-gray-400 text-sm">Datos en vivo</p></div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PROBLEMA ═══════════════════════ */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff0080]/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white text-balance">
              El Problema de las <span className="text-[#ff0080]">Agencias Modernas</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Las agencias de TikTok Live enfrentan caos operativo, falta de datos y pérdida de ingresos potenciales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {problems.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="group relative p-8 rounded-xl border border-[#2d3247] bg-[#1a1f3a]/40 backdrop-blur hover:bg-[#1a1f3a]/60 transition-all duration-300">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${p.color} opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none`} />
                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${p.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{p.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 p-8 rounded-xl border border-[#ff0080]/30 bg-[#ff0080]/5 backdrop-blur text-center">
            <p className="text-2xl font-bold text-white mb-3">
              Resultado: <span className="text-[#ff0080]">Pérdida de ingresos y oportunidades</span>
            </p>
            <p className="text-gray-300">Las agencias pierden hasta un 40% de ingresos potenciales por falta de optimización inteligente.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SOLUCIÓN ═══════════════════════ */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0080ff]/5 to-transparent pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-[#0080ff]/20 rounded-full filter blur-3xl opacity-40 animate-pulse pointer-events-none" />
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-[#00ffff]/20 rounded-full filter blur-3xl opacity-40 animate-pulse pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white text-balance">
              La Solución: <span className="text-[#0080ff]">Agency Hub</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Una plataforma completa diseñada específicamente para agencias de TikTok Live que necesitan crecer y escalar rápidamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {solutionFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="group p-8 rounded-xl border border-[#2d3247] bg-[#1a1f3a]/40 backdrop-blur hover:bg-[#1a1f3a]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 rounded-lg" style={{ backgroundColor: f.color + '20' }}>
                      <Icon className="w-6 h-6" style={{ color: f.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Algorithm highlight */}
          <div className="relative rounded-2xl overflow-hidden border border-[#00ffff]/30 bg-gradient-to-br from-[#1a1f3a]/60 via-[#0080ff]/10 to-[#1a1f3a]/60 backdrop-blur p-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ffff]/30 rounded-full filter blur-3xl opacity-20 pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-8 h-8 text-[#00ffff]" />
                <h3 className="text-2xl font-bold text-white">Algoritmo de Batallas Inteligente</h3>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">Nuestro motor de IA analiza en tiempo real:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Rendimiento', desc: 'Historial completo de cada streamer', color: '#00ffff' },
                  { label: 'Compatibilidad', desc: 'Matchups óptimos entre rivales', color: '#ff0080' },
                  { label: 'ROI', desc: 'Maximización de ingresos esperados', color: '#0080ff' },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-lg bg-[#1a1f3a]/50" style={{ border: `1px solid ${item.color}33` }}>
                    <p className="font-semibold mb-2" style={{ color: item.color }}>{item.label}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-center text-[#00ffff] font-semibold text-lg">
                Resultado: +300% más ingresos con las recomendaciones correctas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ BENEFICIOS ═══════════════════════ */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff0080]/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white text-balance">
              Beneficios que <span className="text-[#ff0080]">Transforman</span> tu Negocio
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">Los resultados que nuestros clientes experimentan en los primeros meses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="group relative p-8 rounded-xl border border-[#2d3247] bg-[#1a1f3a]/40 backdrop-blur hover:bg-[#1a1f3a]/60 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" style={{ backgroundColor: b.color }} />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg" style={{ backgroundColor: b.color + '20' }}>
                        <Icon className="w-6 h-6" style={{ color: b.color }} />
                      </div>
                      <div className="text-3xl font-bold" style={{ color: b.color }}>{b.stat}</div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{b.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{b.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison table */}
          <div className="mt-16 sm:mt-20 rounded-xl border border-[#2d3247] bg-[#1a1f3a]/40 backdrop-blur overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Antes vs Después de Agency Hub</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2d3247]">
                      <th className="text-left py-4 px-4 font-bold text-white">Métrica</th>
                      <th className="text-center py-4 px-4 font-bold text-[#ff0080]">Antes</th>
                      <th className="text-center py-4 px-4 font-bold text-[#00ffff]">Después</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.metric} className="border-b border-[#2d3247]/50 hover:bg-[#2d3247]/20">
                        <td className="py-4 px-4 text-gray-300">{row.metric}</td>
                        <td className="text-center py-4 px-4 text-[#ff0080] font-semibold">{row.before}</td>
                        <td className="text-center py-4 px-4 text-[#00ffff] font-semibold">{row.after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CARACTERÍSTICAS ═══════════════════════ */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0080ff]/5 to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-[#ff0080]/20 rounded-full filter blur-3xl opacity-40 animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#0080ff]/20 rounded-full filter blur-3xl opacity-40 animate-pulse pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white text-balance">
              Características que te <span className="text-[#00ffff]">Empoderan</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Todas las herramientas que necesitas para gestionar, optimizar y crecer tu agencia de TikTok Live.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="group relative p-8 rounded-xl border border-[#2d3247] bg-[#1a1f3a]/40 backdrop-blur hover:bg-[#1a1f3a]/60 transition-all duration-300">
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none blur-xl" style={{ backgroundColor: f.color }} />
                  <div className="relative z-10">
                    <div className="p-4 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: f.color + '20' }}>
                      <Icon className="w-6 h-6" style={{ color: f.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{f.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
                      <span style={{ color: f.color }}>Disponible ahora</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Integrations */}
          <div className="mt-16 p-12 rounded-xl border border-[#00ffff]/30 bg-gradient-to-br from-[#1a1f3a]/60 via-[#0080ff]/10 to-[#1a1f3a]/60 backdrop-blur">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Integración Perfecta</h3>
              <p className="text-gray-300">Conecta con tus herramientas favoritas</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {['TikTok API', 'Stripe', 'Discord', 'Telegram', 'Google Analytics'].map((tool) => (
                <div key={tool} className="p-4 rounded-lg border border-[#2d3247] bg-[#1a1f3a]/50 text-center hover:border-[#00ffff]/50 transition-colors">
                  <p className="text-sm font-medium text-gray-300">{tool}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SOCIAL PROOF ═══════════════════════ */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ffff]/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">

          {/* Stats */}
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-white text-balance">
            Números que <span className="text-[#00ffff]">Hablan Solos</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 sm:mb-24">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="group relative p-10 rounded-xl border border-[#2d3247] bg-[#1a1f3a]/40 backdrop-blur hover:bg-[#1a1f3a]/60 transition-all duration-300 text-center">
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" style={{ backgroundColor: s.color }} />
                  <div className="relative z-10">
                    <div className="p-4 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: s.color + '20' }}>
                      <Icon className="w-6 h-6" style={{ color: s.color }} />
                    </div>
                    <div className="text-4xl font-bold mb-2" style={{ color: s.color }}>{s.number}</div>
                    <p className="text-gray-300 font-medium">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Testimonials */}
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-white text-balance">
            Lo que dicen nuestros <span className="text-[#ff0080]">Clientes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="group relative p-8 rounded-xl border border-[#2d3247] bg-[#1a1f3a]/40 backdrop-blur hover:bg-[#1a1f3a]/60 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl group-hover:h-2 transition-all" style={{ backgroundColor: t.color }} />
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: t.color }} />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed italic">"{t.content}"</p>
                <div>
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-sm" style={{ color: t.color }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-20 p-8 rounded-xl border border-[#2d3247] bg-[#1a1f3a]/40 backdrop-blur">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div><div className="text-3xl font-bold text-[#00ffff] mb-2">4.9/5</div><p className="text-gray-400 text-sm">Calificación promedio de usuarios</p></div>
              <div><div className="text-3xl font-bold text-[#ff0080] mb-2">99.9%</div><p className="text-gray-400 text-sm">Uptime de la plataforma</p></div>
              <div><div className="text-3xl font-bold text-[#0080ff] mb-2">24/7</div><p className="text-gray-400 text-sm">Soporte técnico disponible</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CTA FINAL ═══════════════════════ */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff0080]/10 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#ff0080]/30 via-[#00ffff]/30 to-[#0080ff]/30 rounded-full filter blur-3xl opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight text-balance">
            ¿Listo para{' '}
            <span className="bg-gradient-to-r from-[#ff0080] via-[#00ffff] to-[#0080ff] text-transparent bg-clip-text">
              Transformar
            </span>{' '}
            tu Agencia?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
            Únete a más de 50 agencias que ya están usando Agency Hub para crecer exponencialmente.
            Empieza tu prueba gratuita hoy mismo, sin necesidad de tarjeta de crédito.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="group relative px-10 py-5 font-semibold text-white text-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff0080] via-[#00ffff] to-[#0080ff] group-hover:blur-lg transition-all duration-300 opacity-75 group-hover:opacity-100" />
              <div className="absolute inset-[2px] bg-[#0a0e27] rounded-[6px]" />
              <span className="relative flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                Empezar Ahora Gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="px-10 py-5 font-semibold text-white text-lg rounded-lg bg-[#1a1f3a]/50 border border-[#00ffff]/50 hover:border-[#00ffff] hover:bg-[#1a1f3a]/80 backdrop-blur transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              Solicitar Demo Personalizada
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400">
            {[
              { dot: '#00ffff', text: 'Prueba gratuita de 14 días' },
              { dot: '#ff0080', text: 'Sin tarjeta de crédito' },
              { dot: '#0080ff', text: 'Soporte en español' },
            ].map((item, i) => (
              <div key={item.text} className="flex items-center gap-2">
                {i > 0 && <div className="hidden sm:block w-px h-6 bg-[#2d3247]" />}
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.dot }} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-16 sm:mt-20 p-8 rounded-xl border border-[#2d3247] bg-[#1a1f3a]/40 backdrop-blur">
            <h3 className="text-2xl font-bold text-white mb-8">Preguntas Comunes</h3>
            <div className="space-y-6 text-left">
              {[
                {
                  q: '¿Cuánto cuesta Agency Hub?',
                  a: 'Ofrecemos planes flexibles desde $99/mes para agencias pequeñas hasta soluciones empresariales personalizadas. Comienza con 14 días gratis para explorar todas las funciones.',
                },
                {
                  q: '¿Qué tipo de soporte ofrecen?',
                  a: 'Ofrecemos soporte 24/7 en español vía chat, email y llamadas. Además contamos con documentación detallada y webinars semanales para maximizar tu uso de la plataforma.',
                },
                {
                  q: '¿Puedo integrar mis herramientas existentes?',
                  a: 'Sí, Agency Hub se integra con TikTok API, Stripe, Discord, Telegram y más. También ofrecemos API personalizada para integraciones adicionales según tus necesidades.',
                },
              ].map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-white font-semibold hover:text-[#00ffff] transition-colors">
                    <span>{faq.q}</span>
                    <span className="text-[#00ffff] group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="relative border-t border-[#2d3247] bg-[#0a0e27] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff0080]/5 via-transparent to-[#0080ff]/5 pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-1">
              <h3 className="text-2xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-[#ff0080] to-[#00ffff] text-transparent bg-clip-text">Agency</span>
                <span>Hub</span>
              </h3>
              <p className="text-gray-400 text-sm mb-6">La plataforma definitiva para agencias de TikTok Live en Latinoamérica.</p>
              <div className="flex gap-4">
                {socialLinks.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a key={s.label} href={s.href} aria-label={s.label} className="p-2 rounded-lg bg-[#1a1f3a]/50 border border-[#2d3247] hover:border-[#00ffff]/50 hover:bg-[#1a1f3a]/80 transition-all text-gray-400 hover:text-[#00ffff]">
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([heading, items]) => (
              <div key={heading}>
                <h4 className="font-semibold text-white mb-4">{heading}</h4>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item}>
                      <a href="#" className={`text-gray-400 transition-colors text-sm ${hoverColors[heading]}`}>{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-[#2d3247] pt-8 mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">© {currentYear} Agency Hub. Todos los derechos reservados.</p>
            <p className="text-gray-400 text-sm">Hecho con amor para agencias latinas</p>
          </div>

          <div className="mt-12 p-6 rounded-lg border border-[#2d3247] bg-[#1a1f3a]/40 backdrop-blur text-center">
            <p className="text-white font-semibold mb-2">¿Quieres las últimas actualizaciones?</p>
            <p className="text-gray-400 text-sm">Suscríbete a nuestro newsletter para recibir tips, actualizaciones y ofertas especiales.</p>
          </div>
        </div>
      </footer>

    </main>
  );
}

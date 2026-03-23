/**
 * Agency Hub — FlowChart Page
 * Design: Dark Luxury — diagrama de flujo del proceso de la agencia
 */

import { motion } from "framer-motion";
import {
  UserPlus,
  BookOpen,
  Radio,
  Swords,
  Diamond,
  DollarSign,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

const FLOW_STEPS = [
  {
    id: 1,
    icon: UserPlus,
    title: "Incorporación del Streamer",
    color: "#4f6ef7",
    description: "El streamer se une a la agencia, firma contrato y configura su cuenta TikTok vinculada.",
    sub: ["Verificación de cuenta", "Firma de contrato", "Configuración inicial"],
  },
  {
    id: 2,
    icon: BookOpen,
    title: "Entrenamiento y Onboarding",
    color: "#8b5cf6",
    description: "Capacitación en mejores prácticas de streaming, uso de la plataforma y estrategias de crecimiento.",
    sub: ["Guía de la plataforma", "Estrategias de contenido", "Reglas de la agencia"],
  },
  {
    id: 3,
    icon: Radio,
    title: "Inicio de Transmisiones",
    color: "#22c55e",
    description: "El streamer comienza sus transmisiones en vivo según el horario acordado con la agencia.",
    sub: ["Horario fijo semanal", "Mínimo 4h diarias", "Reporte de actividad"],
  },
  {
    id: 4,
    icon: Swords,
    title: "Participación en Batallas",
    color: "#e8294c",
    description: "La agencia gestiona y programa batallas oficiales para maximizar la acumulación de diamantes.",
    sub: ["Generación de flyers", "Coordinación con rivales", "Seguimiento de resultados"],
  },
  {
    id: 5,
    icon: Diamond,
    title: "Acumulación de Diamantes",
    color: "#f59e0b",
    description: "Los diamantes recibidos durante transmisiones y batallas se acumulan y convierten a USD.",
    sub: ["Tasa: 80 diamantes = $0.05", "Reporte semanal", "Verificación de saldo"],
  },
  {
    id: 6,
    icon: DollarSign,
    title: "Liquidación de Pagos",
    color: "#06b6d4",
    description: "Cada semana se procesan los pagos: 80% para el streamer, 20% de comisión para la agencia.",
    sub: ["Pago cada lunes", "Comisión 20%", "Transferencia bancaria"],
  },
  {
    id: 7,
    icon: TrendingUp,
    title: "Crecimiento y Escalamiento",
    color: "#22c55e",
    description: "Basado en el rendimiento, se ajustan estrategias para aumentar ingresos y ranking del streamer.",
    sub: ["Revisión mensual", "Nuevas metas", "Ascenso de rango"],
  },
];

export default function FlowChartPage() {
  return (
    <div className="space-y-6">
      {/* Header info */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-5"
        style={{ background: "linear-gradient(135deg, rgba(232,41,76,0.08), rgba(79,110,247,0.08))", border: "1px solid oklch(1 0 0 / 8%)" }}
      >
        <h2 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Proceso Operativo de la Agencia
        </h2>
        <p className="text-sm" style={{ color: "oklch(0.60 0.01 265)" }}>
          Flujo completo desde la incorporación del streamer hasta la liquidación de pagos semanales.
        </p>
      </motion.div>

      {/* Flow diagram */}
      <div className="flex flex-col items-center gap-0">
        {FLOW_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="w-full max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex items-start gap-4 rounded-xl p-5"
                style={{
                  background: "oklch(0.16 0.015 265)",
                  border: `1px solid ${step.color}30`,
                }}
              >
                {/* Step number + icon */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `${step.color}20`, border: `1px solid ${step.color}40` }}>
                    <Icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>
                  <div className="text-xs font-bold mt-1.5" style={{ color: step.color }}>
                    #{step.id}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: "oklch(0.65 0.01 265)" }}>
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.sub.map((s) => (
                      <span key={s} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                        style={{ background: `${step.color}15`, color: step.color }}>
                        <CheckCircle className="w-3 h-3" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Connector arrow */}
              {i < FLOW_STEPS.length - 1 && (
                <div className="flex justify-center py-2">
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-0.5 h-4" style={{ background: "oklch(1 0 0 / 15%)" }} />
                    <ChevronDown className="w-4 h-4" style={{ color: "oklch(0.40 0.01 265)" }} />
                  </motion.div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="rounded-xl p-5"
        style={{ background: "oklch(0.16 0.015 265)", border: "1px solid oklch(1 0 0 / 8%)" }}
      >
        <h3 className="font-semibold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Resumen del Modelo de Negocio
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Tasa de conversión", value: "80 💎 = $0.05", color: "#f59e0b" },
            { label: "Comisión agencia", value: "20%", color: "#e8294c" },
            { label: "Pago streamer", value: "80%", color: "#22c55e" },
            { label: "Ciclo de pago", value: "Semanal", color: "#4f6ef7" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl p-3 text-center" style={{ background: "oklch(0.20 0.015 265)" }}>
              <div className="text-base font-bold ah-number mb-1" style={{ color: item.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                {item.value}
              </div>
              <div className="text-xs" style={{ color: "oklch(0.50 0.01 265)" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

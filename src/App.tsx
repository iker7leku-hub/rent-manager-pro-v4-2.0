import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const APP_STATE_ID = "main";

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

async function cargarEstadoOnline() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("app_state")
    .select("data")
    .eq("id", APP_STATE_ID)
    .maybeSingle();

  if (error) {
    console.warn("No se pudo cargar Supabase", error);
    return null;
  }

  return data?.data || null;
}

async function guardarEstadoOnline(estado) {
  if (!supabase) return false;
  const { error } = await supabase
    .from("app_state")
    .upsert(
      { id: APP_STATE_ID, data: estado, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );

  if (error) {
    console.warn("No se pudo guardar Supabase", error);
    return false;
  }

  return true;
}

/* ══════════════════════════════════════════
   STORAGE
══════════════════════════════════════════ */
const STORAGE_KEYS = {
  pisos: "rm_pisos",
  habitaciones: "rm_habs",
  inquilinos: "rm_inqs",
  propietarios: "rm_props",
  gastos: "rm_gastos",
  incidencias: "rm_incids",
  mensajes: "rm_msgs",
  historico: "rm_hist",
};

async function guardar(key, value) {
  try {
    const serialized = JSON.stringify(value);
    if (window.storage?.set) await window.storage.set(key, serialized);
    else localStorage.setItem(key, serialized);
  } catch (error) {
    console.warn("No se pudo guardar", key, error);
  }
}

async function cargar(key, fallback) {
  try {
    if (window.storage?.get) {
      const result = await window.storage.get(key);
      return result ? JSON.parse(result.value) : fallback;
    }
    const result = localStorage.getItem(key);
    return result ? JSON.parse(result) : fallback;
  } catch (error) {
    console.warn("No se pudo cargar", key, error);
    return fallback;
  }
}

/* ══════════════════════════════════════════
   DATOS INICIALES
══════════════════════════════════════════ */
const PISOS_INIT = [
  { id: 1, nombre: "Piso Centro", direccion: "C/ Gran Vía 12, Madrid", propietarioId: 1, alquilerTotal: 1400, notas: "3 habitaciones" },
  { id: 2, nombre: "Apartamento Norte", direccion: "Av. América 45, Madrid", propietarioId: 2, alquilerTotal: 950, notas: "2 habitaciones" },
  { id: 3, nombre: "Casa Sur", direccion: "C/ Toledo 8, Madrid", propietarioId: 3, alquilerTotal: 800, notas: "1 estudio" },
];

const HABITACIONES_INIT = [
  { id: 1, pisoId: 1, nombre: "Habitación 1", m2: 12, planta: "1ª", precio: 700, notas: "" },
  { id: 2, pisoId: 1, nombre: "Habitación 2", m2: 10, planta: "1ª", precio: 680, notas: "" },
  { id: 3, pisoId: 1, nombre: "Habitación 3", m2: 14, planta: "2ª", precio: 720, notas: "Disponible junio" },
  { id: 4, pisoId: 2, nombre: "Habitación 1", m2: 11, planta: "3ª", precio: 600, notas: "" },
  { id: 5, pisoId: 2, nombre: "Habitación 2", m2: 13, planta: "3ª", precio: 610, notas: "" },
  { id: 6, pisoId: 3, nombre: "Estudio A", m2: 28, planta: "PB", precio: 850, notas: "" },
];

const INQUILINOS_INIT = [
  { id: 1, habitacionId: 1, nombre: "Carlos Méndez", telefono: "612345678", email: "carlos@email.com", dni: "12345678A", desde: "2024-11-01", hasta: "2025-11-01", deposito: 700, pagado: true, notas: "Renovado" },
  { id: 2, habitacionId: 2, nombre: "Laura Sánchez", telefono: "623456789", email: "laura@email.com", dni: "87654321B", desde: "2025-01-15", hasta: "2026-01-15", deposito: 680, pagado: false, notas: "" },
  { id: 4, habitacionId: 4, nombre: "Ahmed Khalil", telefono: "634567890", email: "ahmed@email.com", dni: "11223344C", desde: "2025-03-01", hasta: "2026-03-01", deposito: 600, pagado: true, notas: "" },
  { id: 5, habitacionId: 5, nombre: "María Torres", telefono: "645678901", email: "maria@email.com", dni: "55667788D", desde: "2025-02-01", hasta: "2026-02-01", deposito: 610, pagado: false, notas: "Solicita reparación grifo" },
  { id: 6, habitacionId: 6, nombre: "Javier Ruiz", telefono: "656789012", email: "javier@email.com", dni: "99887766E", desde: "2024-09-01", hasta: "2025-09-01", deposito: 1700, pagado: true, notas: "" },
];

const PROPIETARIOS_INIT = [
  { id: 1, nombre: "Antonio García", telefono: "699000001", email: "antonio@email.com", dni: "11111111A", iban: "ES76 0049 0001 5121 3456 7890", comision: 0, notas: "" },
  { id: 2, nombre: "Rosa Martínez", telefono: "699000002", email: "rosa@email.com", dni: "22222222B", iban: "ES80 2100 0418 4502 0005 1332", comision: 10, notas: "10% comisión" },
  { id: 3, nombre: "Luis Fernández", telefono: "699000003", email: "luis@email.com", dni: "33333333C", iban: "ES91 2100 0418 4502 0005 1332", comision: 0, notas: "" },
];

const GASTOS_INIT = [
  { id: 1, concepto: "Alquiler Piso Centro", importe: 1400, fecha: "2025-05-01", tipo: "alquiler_piso", pisoId: 1 },
  { id: 2, concepto: "Alquiler Apartamento Norte", importe: 950, fecha: "2025-05-01", tipo: "alquiler_piso", pisoId: 2 },
  { id: 3, concepto: "Reparación fontanería", importe: 120, fecha: "2025-04-18", tipo: "mantenimiento", pisoId: 1 },
  { id: 4, concepto: "Seguro hogar Casa Sur", importe: 65, fecha: "2025-04-01", tipo: "seguros", pisoId: 3 },
];

const INCIDENCIAS_INIT = [
  { id: 1, pisoId: 2, habitacionId: 5, inquilinoId: 5, titulo: "Grifo averiado baño", descripcion: "Gotea constantemente.", prioridad: "alta", estado: "pendiente", fecha: "2025-05-01", resolucion: "" },
  { id: 2, pisoId: 1, habitacionId: 1, inquilinoId: 1, titulo: "Bombilla fundida pasillo", descripcion: "Bombilla pasillo fundida.", prioridad: "baja", estado: "resuelta", fecha: "2025-04-20", resolucion: "Reemplazada el 22/04" },
];

const MENSAJES_INIT = [
  { id: 1, inquilinoId: 1, canal: "whatsapp", asunto: "Pago recibido", mensaje: "Hola Carlos, hemos recibido tu pago de mayo. ¡Gracias!", fecha: "2025-05-01", enviado: true },
  { id: 2, inquilinoId: 2, canal: "email", asunto: "Pago pendiente mayo", mensaje: "Hola Laura, tu pago de 680€ está pendiente.", fecha: "2025-05-02", enviado: false },
];

const HISTORICO_INIT = [
  { id: 1, pisoId: 1, habitacionId: 1, nombre: "Pedro González", desde: "2023-06-01", hasta: "2024-10-31", precio: 650, motivo: "Fin de contrato" },
];

const DEFAULT_STATE = {
  pisos: PISOS_INIT,
  habitaciones: HABITACIONES_INIT,
  inquilinos: INQUILINOS_INIT,
  propietarios: PROPIETARIOS_INIT,
  gastos: GASTOS_INIT,
  incidencias: INCIDENCIAS_INIT,
  mensajes: MENSAJES_INIT,
  historico: HISTORICO_INIT,
};

const PLANTILLAS = [
  { id: 1, nombre: "Recordatorio pago", canal: "whatsapp", asunto: "", texto: "Hola {nombre}, te recordamos que el pago de {mes} de {importe}€ está pendiente. Por favor, realiza la transferencia antes del día 5. ¡Gracias!" },
  { id: 2, nombre: "Pago recibido", canal: "whatsapp", asunto: "", texto: "¡Hola {nombre}! Hemos recibido tu pago de {mes}. ¡Gracias!" },
  { id: 3, nombre: "Renovación contrato", canal: "email", asunto: "Renovación contrato", texto: "Estimado/a {nombre},\n\nLe informamos que su contrato vence el {fecha}. Si desea renovarlo, contacte con nosotros.\n\nAtentamente,\nGestión de Propiedades" },
  { id: 4, nombre: "Fin de contrato", canal: "email", asunto: "Aviso fin contrato", texto: "Estimado/a {nombre},\n\nLe comunicamos que su contrato finaliza el {fecha}. Recuerde dejar la habitación en las mismas condiciones.\n\nAtentamente,\nGestión de Propiedades" },
  { id: 5, nombre: "Bienvenida", canal: "whatsapp", asunto: "", texto: "¡Bienvenido/a {nombre}! Es un placer tenerte con nosotros. Cualquier consulta no dudes en contactarnos. ¡Que te encuentres muy bien!" },
];

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
const fEur = (n = 0) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(n) || 0);
const hoy = () => new Date().toISOString().slice(0, 10);
const normalizePhone = phone => String(phone || "").replace(/\D/g, "");
const diasHasta = fecha => fecha ? Math.ceil((new Date(fecha) - new Date()) / 864e5) : null;
const nextId = () => Date.now() + Math.floor(Math.random() * 1000);

function downloadText(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map(row => headers.map(h => esc(row[h])).join(","))].join("\n");
}

function useMetrics(pisos, habitaciones, inquilinos, gastos, incidencias) {
  return useMemo(() => {
    const totalHabs = habitaciones.length;
    const ocupadas = habitaciones.filter(h => inquilinos.some(i => i.habitacionId === h.id)).length;
    const ingresos = habitaciones.reduce((sum, h) => sum + (inquilinos.some(i => i.habitacionId === h.id) ? Number(h.precio) || 0 : 0), 0);
    const cobrado = habitaciones.reduce((sum, h) => {
      const tenant = inquilinos.find(i => i.habitacionId === h.id);
      return sum + (tenant?.pagado ? Number(h.precio) || 0 : 0);
    }, 0);
    const totalGastos = gastos.reduce((sum, g) => sum + (Number(g.importe) || 0), 0);
    const margen = cobrado - totalGastos;
    const sinPagar = inquilinos.filter(i => !i.pagado);
    const proxVencer = inquilinos
      .filter(i => {
        const d = diasHasta(i.hasta);
        return d !== null && d > 0 && d <= 60;
      })
      .sort((a, b) => diasHasta(a.hasta) - diasHasta(b.hasta));
    const incAbiertas = incidencias.filter(i => i.estado !== "resuelta");

    return { totalHabs, ocupadas, ingresos, cobrado, totalGastos, margen, sinPagar, proxVencer, incAbiertas };
  }, [pisos, habitaciones, inquilinos, gastos, incidencias]);
}

/* ══════════════════════════════════════════
   ESTILOS Y COMPONENTES BASE
══════════════════════════════════════════ */
const S = {
  page: { minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Sora','Segoe UI',sans-serif", color: "#0f172a" },
  card: { background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1.5px solid #eef0f6", boxShadow: "0 2px 8px #00000008" },
  input: { border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 11px", fontSize: 13, width: "100%", boxSizing: "border-box", fontFamily: "inherit", outline: "none", background: "#fff" },
  lbl: { fontSize: 11, fontWeight: 800, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" },
};

function btnStyle(variant = "primary") {
  return {
    border: "none",
    borderRadius: 9,
    padding: "8px 16px",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    transition: "transform 120ms ease, opacity 120ms ease",
    background: variant === "blue" ? "#2563eb" : variant === "green" ? "#16a34a" : variant === "red" ? "#fee2e2" : variant === "orange" ? "#fff7ed" : variant === "purple" ? "#7c3aed" : variant === "ghost" ? "#f1f5f9" : "#0f172a",
    color: variant === "red" ? "#dc2626" : variant === "orange" ? "#ea580c" : variant === "ghost" ? "#374151" : "#fff",
  };
}

const badgeColors = {
  green: { bg: "#dcfce7", tx: "#166534" },
  red: { bg: "#fee2e2", tx: "#991b1b" },
  amber: { bg: "#fef9c3", tx: "#854d0e" },
  blue: { bg: "#dbeafe", tx: "#1e40af" },
  gray: { bg: "#f1f5f9", tx: "#475569" },
  purple: { bg: "#ede9fe", tx: "#5b21b6" },
  orange: { bg: "#ffedd5", tx: "#9a3412" },
};

function Button({ variant = "primary", style, children, ...props }) {
  return <button {...props} style={{ ...btnStyle(variant), ...style }}>{children}</button>;
}

function Badge({ color = "gray", children }) {
  const { bg, tx } = badgeColors[color] || badgeColors.gray;
  return <span style={{ background: bg, color: tx, padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 800, display: "inline-block", whiteSpace: "nowrap" }}>{children}</span>;
}

function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000090", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 18, padding: 26, width: "100%", maxWidth: width, maxHeight: "93vh", overflowY: "auto", boxShadow: "0 32px 80px #0004" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontWeight: 900, fontSize: 17 }}>{title}</div>
          <Button variant="ghost" onClick={onClose} style={{ padding: "4px 10px" }}>✕</Button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children, col }) {
  return <div style={{ gridColumn: col || "span 1" }}><label style={S.lbl}>{label}</label>{children}</div>;
}

function EmptyState({ icon = "📭", title, text, action }) {
  return (
    <div style={{ ...S.card, textAlign: "center", padding: 42, color: "#94a3b8", gridColumn: "1/-1" }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontWeight: 900, fontSize: 16, color: "#475569", marginBottom: 4 }}>{title}</div>
      {text && <div style={{ fontSize: 13, marginBottom: action ? 16 : 0 }}>{text}</div>}
      {action}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color = "#0f172a" }) {
  return (
    <div style={{ ...S.card, display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ fontSize: 18 }}>{icon}</div>
      <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: "#94a3b8" }}>{sub}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */
function Dashboard({ pisos, habitaciones, inquilinos, gastos, incidencias }) {
  const metrics = useMetrics(pisos, habitaciones, inquilinos, gastos, incidencias);
  const { totalHabs, ocupadas, ingresos, cobrado, totalGastos, margen, sinPagar, proxVencer, incAbiertas } = metrics;
  const urgentes = incAbiertas.filter(i => i.prioridad === "alta");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: "linear-gradient(135deg,#0f172a,#1e40af)", borderRadius: 16, padding: "22px 26px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 22 }}>🔑 RentManager PRO</div>
          <div style={{ opacity: 0.75, fontSize: 13, marginTop: 3 }}>{new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 30, fontWeight: 900 }}>{fEur(margen)}</div>
          <div style={{ opacity: 0.75, fontSize: 12 }}>Beneficio neto este mes</div>
        </div>
      </div>

      {(sinPagar.length > 0 || urgentes.length > 0) && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {sinPagar.length > 0 && (
            <div style={{ flex: 1, background: "#fee2e2", border: "1.5px solid #fca5a5", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 800, color: "#991b1b" }}>
              ⚠️ {sinPagar.length} inquilino{sinPagar.length > 1 ? "s" : ""} sin pagar - {fEur(sinPagar.reduce((sum, inq) => {
                const hab = habitaciones.find(h => h.id === inq.habitacionId);
                return sum + (Number(hab?.precio) || 0);
              }, 0))}
            </div>
          )}
          {urgentes.length > 0 && (
            <div style={{ flex: 1, background: "#fef3c7", border: "1.5px solid #fbbf24", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 800, color: "#92400e" }}>
              🔥 {urgentes.length} incidencia{urgentes.length > 1 ? "s" : ""} urgente{urgentes.length > 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
        <StatCard icon="🏠" label="Ocupación" value={`${ocupadas}/${totalHabs}`} sub={`${totalHabs > 0 ? Math.round((ocupadas / totalHabs) * 100) : 0}%`} />
        <StatCard icon="📈" label="Ingresos" value={fEur(ingresos)} sub="Potencial mes" color="#16a34a" />
        <StatCard icon="✅" label="Cobrado" value={fEur(cobrado)} sub={`${fEur(ingresos - cobrado)} por cobrar`} color="#2563eb" />
        <StatCard icon="💸" label="Gastos" value={fEur(totalGastos)} sub="Este mes" color="#dc2626" />
        <StatCard icon="💰" label="Beneficio" value={fEur(margen)} sub="Neto mes" color={margen >= 0 ? "#059669" : "#dc2626"} />
        <StatCard icon="🔮" label="Proyección" value={fEur(margen * 12)} sub="Anual estimada" color="#7c3aed" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(260px,1fr)", gap: 14 }} className="two-col">
        <div style={S.card}>
          <div style={{ fontWeight: 900, marginBottom: 14 }}>📊 Rendimiento por piso</div>
          {pisos.map(piso => {
            const habs = habitaciones.filter(h => h.pisoId === piso.id);
            const occ = habs.filter(h => inquilinos.some(i => i.habitacionId === h.id)).length;
            const ing = habs.reduce((sum, h) => sum + (inquilinos.some(i => i.habitacionId === h.id) ? Number(h.precio) || 0 : 0), 0);
            const pct = habs.length > 0 ? Math.round((occ / habs.length) * 100) : 0;
            const margenPiso = ing - Number(piso.alquilerTotal || 0);
            return (
              <div key={piso.id} style={{ marginBottom: 14, padding: "10px 12px", background: "#f8fafc", borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, gap: 8 }}>
                  <span style={{ fontWeight: 900, fontSize: 13 }}>{piso.nombre}</span>
                  <span style={{ fontWeight: 800, color: margenPiso >= 0 ? "#059669" : "#dc2626", fontSize: 13 }}>{fEur(margenPiso)}/mes</span>
                </div>
                <div style={{ background: "#e2e8f0", borderRadius: 99, height: 7, marginBottom: 4 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "#059669" : pct >= 70 ? "#2563eb" : "#f59e0b", borderRadius: 99 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8" }}>
                  <span>{occ}/{habs.length} hab · {pct}%</span>
                  <span>▲ {fEur(ing)} ▼ {fEur(piso.alquilerTotal)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={S.card}>
            <div style={{ fontWeight: 900, marginBottom: 10, fontSize: 14 }}>⚡ Estado rápido</div>
            {[
              ["Habitaciones libres", totalHabs - ocupadas, "gray"],
              ["Pagos pendientes", sinPagar.length, sinPagar.length ? "red" : "green"],
              ["Contratos ≤60d", proxVencer.length, proxVencer.length ? "amber" : "green"],
              ["Incidencias abiertas", incAbiertas.length, incAbiertas.length ? "orange" : "green"],
            ].map(([label, value, color]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #f1f5f9", fontSize: 12 }}>
                <span style={{ color: "#64748b" }}>{label}</span><Badge color={color}>{value}</Badge>
              </div>
            ))}
          </div>
          <div style={{ ...S.card, background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
            <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 4 }}>Margen / habitación</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#059669" }}>{fEur(Math.round(margen / Math.max(ocupadas, 1)))}</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Promedio por hab. ocupada</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="two-col">
        <div style={S.card}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>🔴 Pagos pendientes</div>
          {sinPagar.length === 0 ? <div style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: "10px 0" }}>¡Todo cobrado!</div> : sinPagar.map(inq => {
            const hab = habitaciones.find(h => h.id === inq.habitacionId);
            const piso = pisos.find(p => p.id === hab?.pisoId);
            return (
              <div key={inq.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f8fafc" }}>
                <div><div style={{ fontWeight: 800, fontSize: 13 }}>{inq.nombre}</div><div style={{ fontSize: 11, color: "#94a3b8" }}>{piso?.nombre} · {hab?.nombre}</div></div>
                <Badge color="red">{fEur(hab?.precio || 0)}</Badge>
              </div>
            );
          })}
        </div>
        <div style={S.card}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>⏳ Contratos por vencer</div>
          {proxVencer.length === 0 ? <div style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: "10px 0" }}>Ninguno en 60 días</div> : proxVencer.map(inq => {
            const d = diasHasta(inq.hasta);
            const hab = habitaciones.find(h => h.id === inq.habitacionId);
            const piso = pisos.find(p => p.id === hab?.pisoId);
            return (
              <div key={inq.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f8fafc" }}>
                <div><div style={{ fontWeight: 800, fontSize: 13 }}>{inq.nombre}</div><div style={{ fontSize: 11, color: "#94a3b8" }}>{piso?.nombre} · {inq.hasta}</div></div>
                <Badge color={d <= 30 ? "red" : "amber"}>{d}d</Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PISOS E INQUILINOS
══════════════════════════════════════════ */
function PisosInquilinos({ pisos, setPisos, habitaciones, setHabitaciones, inquilinos, setInquilinos, propietarios, setHistorico }) {
  const [pisoModal, setPisoModal] = useState(false);
  const [pisoForm, setPisoForm] = useState({});
  const [habModal, setHabModal] = useState(false);
  const [habForm, setHabForm] = useState({});
  const [inqModal, setInqModal] = useState(false);
  const [inqForm, setInqForm] = useState({});
  const [pisoAbierto, setPisoAbierto] = useState(pisos[0]?.id ?? null);

  const emptyPiso = { id: null, nombre: "", direccion: "", propietarioId: "", alquilerTotal: "", notas: "" };
  const emptyHab = { id: null, pisoId: null, nombre: "", m2: "", planta: "", precio: "", notas: "" };
  const emptyInq = { id: null, habitacionId: null, nombre: "", telefono: "", email: "", dni: "", desde: hoy(), hasta: "", deposito: "", pagado: false, notas: "" };

  function savePiso() {
    const item = { ...pisoForm, id: pisoForm.id || nextId(), propietarioId: pisoForm.propietarioId ? Number(pisoForm.propietarioId) : null, alquilerTotal: Number(pisoForm.alquilerTotal) || 0 };
    setPisos(prev => pisoForm.id ? prev.map(p => p.id === item.id ? item : p) : [...prev, item]);
    setPisoAbierto(item.id);
    setPisoModal(false);
  }

  function saveHab() {
    const item = { ...habForm, id: habForm.id || nextId(), pisoId: Number(habForm.pisoId), m2: Number(habForm.m2) || 0, precio: Number(habForm.precio) || 0 };
    setHabitaciones(prev => habForm.id ? prev.map(h => h.id === item.id ? item : h) : [...prev, item]);
    setHabModal(false);
  }

  function saveInq() {
    const item = { ...inqForm, id: inqForm.id || nextId(), habitacionId: Number(inqForm.habitacionId), deposito: Number(inqForm.deposito) || 0, pagado: Boolean(inqForm.pagado) };
    setInquilinos(prev => inqForm.id ? prev.map(i => i.id === item.id ? item : i) : [...prev, item]);
    setInqModal(false);
  }

  function deletePiso(piso) {
    if (!confirm("¿Eliminar piso? Se eliminarán también sus habitaciones e inquilinos.")) return;
    const ids = habitaciones.filter(h => h.pisoId === piso.id).map(h => h.id);
    setPisos(prev => prev.filter(p => p.id !== piso.id));
    setHabitaciones(prev => prev.filter(h => h.pisoId !== piso.id));
    setInquilinos(prev => prev.filter(i => !ids.includes(i.habitacionId)));
  }

  function deleteHab(habitacion) {
    if (!confirm("¿Eliminar habitación? También se eliminará el inquilino asignado.")) return;
    setHabitaciones(prev => prev.filter(h => h.id !== habitacion.id));
    setInquilinos(prev => prev.filter(i => i.habitacionId !== habitacion.id));
  }

  function liberarInq(inq) {
    if (!confirm(`¿Registrar salida de ${inq.nombre}?`)) return;
    const hab = habitaciones.find(h => h.id === inq.habitacionId);
    const piso = pisos.find(p => p.id === hab?.pisoId);
    setHistorico(prev => [...prev, { id: nextId(), pisoId: hab?.pisoId, habitacionId: inq.habitacionId, nombre: inq.nombre, desde: inq.desde, hasta: hoy(), precio: hab?.precio || 0, motivo: "Salida registrada", pisoNombre: piso?.nombre, habNombre: hab?.nombre }]);
    setInquilinos(prev => prev.filter(i => i.id !== inq.id));
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 8, flexWrap: "wrap" }}>
        <div style={{ fontWeight: 900, fontSize: 16 }}>Mis pisos y habitaciones</div>
        <Button variant="blue" onClick={() => { setPisoForm(emptyPiso); setPisoModal(true); }}>+ Nuevo piso</Button>
      </div>

      {pisos.map(piso => {
        const habs = habitaciones.filter(h => h.pisoId === piso.id);
        const prop = propietarios.find(p => p.id === piso.propietarioId);
        const totalIngresos = habs.reduce((sum, h) => sum + (inquilinos.some(i => i.habitacionId === h.id) ? Number(h.precio) || 0 : 0), 0);
        const margenPiso = totalIngresos - Number(piso.alquilerTotal || 0);
        const ocupadas = habs.filter(h => inquilinos.some(i => i.habitacionId === h.id)).length;
        const abierto = pisoAbierto === piso.id;

        return (
          <div key={piso.id} style={{ marginBottom: 18, borderRadius: 16, border: "2px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 12px #0000000a" }}>
            <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", flexWrap: "wrap", gap: 10 }} onClick={() => setPisoAbierto(abierto ? null : piso.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ background: "#2563eb", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏠</div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 16, color: "#fff" }}>{piso.nombre}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>{piso.direccion}{prop ? ` · ${prop.nombre}` : ""}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Margen mensual</div>
                  <div style={{ fontWeight: 900, fontSize: 18, color: margenPiso >= 0 ? "#4ade80" : "#f87171" }}>{fEur(margenPiso)}</div>
                </div>
                <Badge color={ocupadas === habs.length && habs.length > 0 ? "green" : ocupadas > 0 ? "amber" : "gray"}>{ocupadas}/{habs.length} ocupadas</Badge>
                <div style={{ display: "flex", gap: 5 }} onClick={e => e.stopPropagation()}>
                  <Button variant="ghost" onClick={() => { setPisoForm({ ...piso, propietarioId: piso.propietarioId || "" }); setPisoModal(true); }} style={{ fontSize: 11, padding: "5px 10px" }}>Editar</Button>
                  <Button variant="red" onClick={() => deletePiso(piso)} style={{ fontSize: 11, padding: "5px 8px" }}>Eliminar</Button>
                </div>
                <div style={{ color: "#64748b", fontSize: 18, paddingLeft: 4 }}>{abierto ? "▲" : "▼"}</div>
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "10px 20px", display: "flex", gap: 16, flexWrap: "wrap", borderBottom: "1px solid #e2e8f0", fontSize: 12 }}>
              <span>Alquiler piso: <b style={{ color: "#dc2626" }}>{fEur(piso.alquilerTotal)}/mes</b></span>
              <span>Ingresos: <b style={{ color: "#059669" }}>{fEur(totalIngresos)}/mes</b></span>
              <span>Margen: <b style={{ color: margenPiso >= 0 ? "#2563eb" : "#dc2626" }}>{fEur(margenPiso)}/mes</b></span>
              {piso.notas && <span style={{ color: "#94a3b8" }}>📝 {piso.notas}</span>}
            </div>

            {abierto && (
              <div style={{ background: "#fff", padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 8, flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>Habitaciones ({habs.length})</div>
                  <Button variant="ghost" onClick={() => { setHabForm({ ...emptyHab, pisoId: piso.id }); setHabModal(true); }} style={{ fontSize: 12, border: "1.5px dashed #cbd5e1" }}>+ Añadir habitación</Button>
                </div>
                {habs.length === 0 && <EmptyState icon="🛏️" title="Sin habitaciones" text="Añade la primera habitación de este piso." />}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {habs.map(hab => {
                    const inq = inquilinos.find(i => i.habitacionId === hab.id);
                    const d = diasHasta(inq?.hasta);
                    return (
                      <div key={hab.id} style={{ borderRadius: 12, border: `2px solid ${!inq ? "#e2e8f0" : inq.pagado ? "#bbf7d0" : "#fecaca"}`, overflow: "hidden" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: !inq ? "#f8fafc" : inq.pagado ? "#f0fdf4" : "#fff5f5", flexWrap: "wrap", gap: 8 }}>
                          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <div style={{ background: !inq ? "#e2e8f0" : inq.pagado ? "#bbf7d0" : "#fecaca", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛏️</div>
                            <div>
                              <div style={{ fontWeight: 900, fontSize: 14 }}>{hab.nombre}</div>
                              <div style={{ fontSize: 11, color: "#64748b" }}>{hab.planta || "—"} · {hab.m2}m² · <b style={{ color: "#2563eb" }}>{fEur(hab.precio)}/mes</b></div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                            <Badge color={!inq ? "gray" : inq.pagado ? "green" : "red"}>{!inq ? "Libre" : inq.pagado ? "Pagado" : "Pendiente"}</Badge>
                            <Button variant="ghost" onClick={() => { setHabForm({ ...hab }); setHabModal(true); }} style={{ fontSize: 11, padding: "5px 8px" }}>Editar</Button>
                            <Button variant="red" onClick={() => deleteHab(hab)} style={{ fontSize: 11, padding: "5px 7px" }}>✕</Button>
                          </div>
                        </div>
                        {inq ? (
                          <div style={{ padding: "12px 16px", background: "#fff", borderTop: "1px solid #f0f0f0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                              <div>
                                <div style={{ fontWeight: 900, fontSize: 14 }}>👤 {inq.nombre}</div>
                                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{inq.telefono || "Sin teléfono"}{inq.email && <> · {inq.email}</>}</div>
                                <div style={{ fontSize: 12, color: "#64748b" }}>{inq.desde} → {inq.hasta}{d !== null && d <= 60 && <span style={{ color: d <= 30 ? "#dc2626" : "#d97706", fontWeight: 800 }}> ({d}d para vencer)</span>}</div>
                                <div style={{ fontSize: 12, color: "#64748b" }}>Depósito: {fEur(inq.deposito)} · DNI: {inq.dni || "—"}</div>
                                {inq.notas && <div style={{ fontSize: 11, color: "#92400e", background: "#fef3c7", padding: "4px 8px", borderRadius: 6, marginTop: 4, display: "inline-block" }}>📝 {inq.notas}</div>}
                              </div>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                <Button variant={inq.pagado ? "red" : "green"} onClick={() => setInquilinos(prev => prev.map(i => i.id === inq.id ? { ...i, pagado: !i.pagado } : i))} style={{ fontSize: 11, padding: "6px 12px" }}>{inq.pagado ? "Quitar pago" : "Marcar pagado"}</Button>
                                {inq.telefono && <a href={`https://wa.me/34${normalizePhone(inq.telefono)}`} target="_blank" rel="noreferrer" style={{ ...btnStyle("ghost"), textDecoration: "none", fontSize: 11, padding: "6px 10px" }}>WhatsApp</a>}
                                <Button variant="ghost" onClick={() => { setInqForm({ ...inq }); setInqModal(true); }} style={{ fontSize: 11, padding: "6px 10px" }}>Editar</Button>
                                <Button variant="orange" onClick={() => liberarInq(inq)} style={{ fontSize: 11, padding: "6px 10px" }}>Dar de baja</Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ padding: "12px 16px", background: "#fff", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 13, color: "#94a3b8" }}>Sin inquilino - habitación libre</span>
                            <Button variant="blue" onClick={() => { setInqForm({ ...emptyInq, habitacionId: hab.id, deposito: hab.precio }); setInqModal(true); }} style={{ fontSize: 12 }}>+ Añadir inquilino</Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {pisos.length === 0 && <EmptyState icon="🏠" title="No tienes pisos aún" text="Empieza añadiendo tu primer piso." action={<Button variant="blue" onClick={() => { setPisoForm(emptyPiso); setPisoModal(true); }}>+ Añadir primer piso</Button>} />}

      <Modal open={pisoModal} onClose={() => setPisoModal(false)} title={pisoForm.id ? "Editar piso" : "Nuevo piso"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Nombre del piso" col="span 2"><input style={S.input} value={pisoForm.nombre || ""} onChange={e => setPisoForm(p => ({ ...p, nombre: e.target.value }))} /></Field>
          <Field label="Dirección" col="span 2"><input style={S.input} value={pisoForm.direccion || ""} onChange={e => setPisoForm(p => ({ ...p, direccion: e.target.value }))} /></Field>
          <Field label="Propietario"><select style={S.input} value={pisoForm.propietarioId || ""} onChange={e => setPisoForm(p => ({ ...p, propietarioId: e.target.value }))}><option value="">Sin asignar</option>{propietarios.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select></Field>
          <Field label="Alquiler que pagas"><input type="number" style={S.input} value={pisoForm.alquilerTotal || ""} onChange={e => setPisoForm(p => ({ ...p, alquilerTotal: e.target.value }))} /></Field>
          <Field label="Notas" col="span 2"><textarea style={{ ...S.input, minHeight: 60, resize: "vertical" }} value={pisoForm.notas || ""} onChange={e => setPisoForm(p => ({ ...p, notas: e.target.value }))} /></Field>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}><Button onClick={savePiso} style={{ flex: 1, padding: 11 }}>Guardar</Button><Button variant="ghost" onClick={() => setPisoModal(false)} style={{ flex: 1, padding: 11 }}>Cancelar</Button></div>
      </Modal>

      <Modal open={habModal} onClose={() => setHabModal(false)} title={habForm.id ? "Editar habitación" : "Nueva habitación"} width={460}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Nombre" col="span 2"><input style={S.input} value={habForm.nombre || ""} onChange={e => setHabForm(p => ({ ...p, nombre: e.target.value }))} /></Field>
          <Field label="Planta"><input style={S.input} value={habForm.planta || ""} onChange={e => setHabForm(p => ({ ...p, planta: e.target.value }))} /></Field>
          <Field label="Superficie m²"><input type="number" style={S.input} value={habForm.m2 || ""} onChange={e => setHabForm(p => ({ ...p, m2: e.target.value }))} /></Field>
          <Field label="Precio que cobras" col="span 2"><input type="number" style={S.input} value={habForm.precio || ""} onChange={e => setHabForm(p => ({ ...p, precio: e.target.value }))} /></Field>
          <Field label="Notas" col="span 2"><textarea style={{ ...S.input, minHeight: 55, resize: "vertical" }} value={habForm.notas || ""} onChange={e => setHabForm(p => ({ ...p, notas: e.target.value }))} /></Field>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}><Button onClick={saveHab} style={{ flex: 1, padding: 11 }}>Guardar</Button><Button variant="ghost" onClick={() => setHabModal(false)} style={{ flex: 1, padding: 11 }}>Cancelar</Button></div>
      </Modal>

      <Modal open={inqModal} onClose={() => setInqModal(false)} title={inqForm.id ? "Editar inquilino" : "Añadir inquilino"} width={560}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Nombre completo" col="span 2"><input style={S.input} value={inqForm.nombre || ""} onChange={e => setInqForm(p => ({ ...p, nombre: e.target.value }))} /></Field>
          <Field label="DNI / NIE"><input style={S.input} value={inqForm.dni || ""} onChange={e => setInqForm(p => ({ ...p, dni: e.target.value }))} /></Field>
          <Field label="Teléfono"><input style={S.input} value={inqForm.telefono || ""} onChange={e => setInqForm(p => ({ ...p, telefono: e.target.value }))} /></Field>
          <Field label="Email" col="span 2"><input type="email" style={S.input} value={inqForm.email || ""} onChange={e => setInqForm(p => ({ ...p, email: e.target.value }))} /></Field>
          <Field label="Depósito €"><input type="number" style={S.input} value={inqForm.deposito || ""} onChange={e => setInqForm(p => ({ ...p, deposito: e.target.value }))} /></Field>
          <Field label="Fecha de entrada"><input type="date" style={S.input} value={inqForm.desde || ""} onChange={e => setInqForm(p => ({ ...p, desde: e.target.value }))} /></Field>
          <Field label="Fin de contrato"><input type="date" style={S.input} value={inqForm.hasta || ""} onChange={e => setInqForm(p => ({ ...p, hasta: e.target.value }))} /></Field>
          <Field label="Notas" col="span 2"><textarea style={{ ...S.input, minHeight: 55, resize: "vertical" }} value={inqForm.notas || ""} onChange={e => setInqForm(p => ({ ...p, notas: e.target.value }))} /></Field>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0" }}>
          <input type="checkbox" id="pagado" checked={Boolean(inqForm.pagado)} onChange={e => setInqForm(p => ({ ...p, pagado: e.target.checked }))} />
          <label htmlFor="pagado" style={{ fontSize: 13, fontWeight: 700 }}>Pago del mes recibido</label>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}><Button onClick={saveInq} style={{ flex: 1, padding: 11 }}>Guardar inquilino</Button><Button variant="ghost" onClick={() => setInqModal(false)} style={{ flex: 1, padding: 11 }}>Cancelar</Button></div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════
   PROPIETARIOS
══════════════════════════════════════════ */
function Propietarios({ propietarios, setPropietarios, pisos }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const empty = { id: null, nombre: "", telefono: "", email: "", dni: "", iban: "", comision: 0, notas: "" };

  function save() {
    const item = { ...form, id: form.id || nextId(), comision: Number(form.comision) || 0 };
    setPropietarios(prev => form.id ? prev.map(p => p.id === item.id ? item : p) : [...prev, item]);
    setModal(false);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}><Button variant="blue" onClick={() => { setForm(empty); setModal(true); }}>+ Nuevo propietario</Button></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
        {propietarios.map(prop => {
          const susPisos = pisos.filter(p => p.propietarioId === prop.id);
          return (
            <div key={prop.id} style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 8 }}>
                <div><div style={{ fontWeight: 900, fontSize: 15 }}>👤 {prop.nombre}</div><div style={{ fontSize: 11, color: "#64748b" }}>{prop.dni || "—"}</div></div>
                {Number(prop.comision) > 0 && <Badge color="purple">Comisión {prop.comision}%</Badge>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12, marginBottom: 10 }}>
                <div style={{ background: "#f8fafc", borderRadius: 8, padding: "7px 10px" }}>📞 <b>{prop.telefono || "—"}</b></div>
                <div style={{ background: "#f8fafc", borderRadius: 8, padding: "7px 10px" }}>✉️ <b>{prop.email || "—"}</b></div>
                <div style={{ background: "#f8fafc", borderRadius: 8, padding: "7px 10px", gridColumn: "span 2" }}>🏦 <b>{prop.iban || "—"}</b></div>
                <div style={{ background: "#f8fafc", borderRadius: 8, padding: "7px 10px", gridColumn: "span 2" }}>🏠 <b>{susPisos.map(p => p.nombre).join(", ") || "Sin pisos"}</b></div>
              </div>
              {prop.notas && <div style={{ fontSize: 11, background: "#fef3c7", padding: "5px 8px", borderRadius: 7, marginBottom: 8 }}>📝 {prop.notas}</div>}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {prop.telefono && <a href={`https://wa.me/34${normalizePhone(prop.telefono)}`} target="_blank" rel="noreferrer" style={{ ...btnStyle("green"), textDecoration: "none", fontSize: 11, padding: "6px 10px" }}>WhatsApp</a>}
                {prop.email && <a href={`mailto:${prop.email}`} style={{ ...btnStyle("blue"), textDecoration: "none", fontSize: 11, padding: "6px 10px" }}>Email</a>}
                <Button variant="ghost" onClick={() => { setForm({ ...prop }); setModal(true); }} style={{ flex: 1, fontSize: 11 }}>Editar</Button>
                <Button variant="red" onClick={() => { if (confirm("¿Eliminar propietario?")) setPropietarios(prev => prev.filter(p => p.id !== prop.id)); }} style={{ fontSize: 11, padding: "6px 8px" }}>Eliminar</Button>
              </div>
            </div>
          );
        })}
        {propietarios.length === 0 && <EmptyState title="Sin propietarios" text="Añade el primero." />}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={form.id ? "Editar propietario" : "Nuevo propietario"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Nombre" col="span 2"><input style={S.input} value={form.nombre || ""} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} /></Field>
          <Field label="DNI/NIE"><input style={S.input} value={form.dni || ""} onChange={e => setForm(p => ({ ...p, dni: e.target.value }))} /></Field>
          <Field label="Teléfono"><input style={S.input} value={form.telefono || ""} onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))} /></Field>
          <Field label="Email" col="span 2"><input type="email" style={S.input} value={form.email || ""} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></Field>
          <Field label="IBAN" col="span 2"><input style={S.input} value={form.iban || ""} onChange={e => setForm(p => ({ ...p, iban: e.target.value }))} /></Field>
          <Field label="Comisión %"><input type="number" style={S.input} value={form.comision ?? 0} onChange={e => setForm(p => ({ ...p, comision: e.target.value }))} /></Field>
          <Field label="Notas"><input style={S.input} value={form.notas || ""} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} /></Field>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}><Button onClick={save} style={{ flex: 1, padding: 11 }}>Guardar</Button><Button variant="ghost" onClick={() => setModal(false)} style={{ flex: 1, padding: 11 }}>Cancelar</Button></div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════
   FINANZAS
══════════════════════════════════════════ */
function Finanzas({ pisos, habitaciones, inquilinos, gastos, setGastos }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ concepto: "", importe: "", fecha: hoy(), tipo: "mantenimiento", pisoId: "" });
  const metrics = useMetrics(pisos, habitaciones, inquilinos, gastos, []);
  const porTipo = gastos.reduce((acc, g) => ({ ...acc, [g.tipo]: (acc[g.tipo] || 0) + (Number(g.importe) || 0) }), {});

  function save() {
    if (!form.concepto || !form.importe) return alert("Completa el concepto y el importe.");
    setGastos(prev => [{ ...form, id: nextId(), importe: Number(form.importe) || 0, pisoId: form.pisoId ? Number(form.pisoId) : null }, ...prev]);
    setForm({ concepto: "", importe: "", fecha: hoy(), tipo: "mantenimiento", pisoId: "" });
    setModal(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
        <StatCard icon="📈" label="Potencial" value={fEur(metrics.ingresos)} color="#16a34a" />
        <StatCard icon="✅" label="Cobrado" value={fEur(metrics.cobrado)} color="#2563eb" />
        <StatCard icon="⏳" label="Por cobrar" value={fEur(metrics.ingresos - metrics.cobrado)} color="#d97706" />
        <StatCard icon="💸" label="Gastos" value={fEur(metrics.totalGastos)} color="#dc2626" />
        <StatCard icon="💰" label="Beneficio" value={fEur(metrics.margen)} color={metrics.margen >= 0 ? "#059669" : "#dc2626"} />
        <StatCard icon="🔮" label="Proyección anual" value={fEur(metrics.margen * 12)} color="#7c3aed" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="two-col">
        <div style={S.card}>
          <div style={{ fontWeight: 900, marginBottom: 12 }}>🏠 Por piso</div>
          {pisos.map(piso => {
            const habs = habitaciones.filter(h => h.pisoId === piso.id);
            const ingresos = habs.reduce((sum, h) => sum + (inquilinos.some(i => i.habitacionId === h.id) ? Number(h.precio) || 0 : 0), 0);
            const gastosPiso = gastos.filter(g => g.pisoId === piso.id).reduce((sum, g) => sum + (Number(g.importe) || 0), 0);
            const margen = ingresos - Number(piso.alquilerTotal || 0) - gastosPiso;
            return (
              <div key={piso.id} style={{ background: "#f8fafc", borderRadius: 9, padding: 10, marginBottom: 8 }}>
                <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 5 }}>{piso.nombre}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, fontSize: 12 }}>
                  <div><div style={{ color: "#94a3b8", fontSize: 9, fontWeight: 800 }}>INGRESOS</div><div style={{ fontWeight: 800, color: "#059669" }}>{fEur(ingresos)}</div></div>
                  <div><div style={{ color: "#94a3b8", fontSize: 9, fontWeight: 800 }}>GASTOS</div><div style={{ fontWeight: 800, color: "#dc2626" }}>{fEur(Number(piso.alquilerTotal || 0) + gastosPiso)}</div></div>
                  <div><div style={{ color: "#94a3b8", fontSize: 9, fontWeight: 800 }}>MARGEN</div><div style={{ fontWeight: 800, color: margen >= 0 ? "#2563eb" : "#dc2626" }}>{fEur(margen)}</div></div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={S.card}>
          <div style={{ fontWeight: 900, marginBottom: 12 }}>🏷️ Por categoría</div>
          {Object.entries(porTipo).sort((a, b) => b[1] - a[1]).map(([tipo, total]) => {
            const pct = metrics.totalGastos ? Math.round((total / metrics.totalGastos) * 100) : 0;
            return (
              <div key={tipo} style={{ marginBottom: 9 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span style={{ textTransform: "capitalize", fontWeight: 700 }}>{tipo.replace(/_/g, " ")}</span>
                  <span style={{ fontWeight: 800 }}>{fEur(total)} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({pct}%)</span></span>
                </div>
                <div style={{ background: "#f1f5f9", borderRadius: 99, height: 5 }}><div style={{ width: `${pct}%`, height: "100%", background: "#2563eb", borderRadius: 99 }} /></div>
              </div>
            );
          })}
          {Object.keys(porTipo).length === 0 && <div style={{ color: "#94a3b8", fontSize: 13 }}>Sin gastos registrados.</div>}
        </div>
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 8, flexWrap: "wrap" }}>
          <div style={{ fontWeight: 900 }}>📋 Registro de gastos</div>
          <Button variant="blue" onClick={() => setModal(true)}>+ Añadir gasto</Button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ borderBottom: "2px solid #f1f5f9" }}>{["Concepto", "Piso", "Fecha", "Tipo", "Importe", ""].map(h => <th key={h} style={{ textAlign: "left", padding: 8, color: "#64748b", fontWeight: 800, fontSize: 11, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
            <tbody>{[...gastos].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha))).map(g => {
              const piso = pisos.find(p => p.id === g.pisoId);
              return (
                <tr key={g.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "9px 8px", fontWeight: 800 }}>{g.concepto}</td>
                  <td style={{ padding: "9px 8px", color: "#64748b" }}>{piso?.nombre || "General"}</td>
                  <td style={{ padding: "9px 8px", color: "#64748b" }}>{g.fecha}</td>
                  <td style={{ padding: "9px 8px" }}><Badge color="blue">{String(g.tipo).replace(/_/g, " ")}</Badge></td>
                  <td style={{ padding: "9px 8px", fontWeight: 900, color: "#dc2626" }}>{fEur(g.importe)}</td>
                  <td style={{ padding: "9px 8px" }}><button onClick={() => setGastos(prev => prev.filter(x => x.id !== g.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 15 }}>✕</button></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Añadir gasto" width={430}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label="Concepto"><input style={S.input} value={form.concepto} onChange={e => setForm(p => ({ ...p, concepto: e.target.value }))} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><Field label="Importe €"><input type="number" style={S.input} value={form.importe} onChange={e => setForm(p => ({ ...p, importe: e.target.value }))} /></Field><Field label="Fecha"><input type="date" style={S.input} value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} /></Field></div>
          <Field label="Piso"><select style={S.input} value={form.pisoId} onChange={e => setForm(p => ({ ...p, pisoId: e.target.value }))}><option value="">General</option>{pisos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select></Field>
          <Field label="Tipo"><select style={S.input} value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}>{["alquiler_piso", "mantenimiento", "seguros", "suministros", "gestoría", "limpieza", "impuestos", "otros"].map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}</select></Field>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}><Button onClick={save} style={{ flex: 1, padding: 11 }}>Guardar</Button><Button variant="ghost" onClick={() => setModal(false)} style={{ flex: 1, padding: 11 }}>Cancelar</Button></div>
        </div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════
   CALENDARIO
══════════════════════════════════════════ */
function Calendario({ pisos, habitaciones, inquilinos, incidencias }) {
  const eventos = useMemo(() => {
    const contractEvents = inquilinos.map(inq => {
      const hab = habitaciones.find(h => h.id === inq.habitacionId);
      const piso = pisos.find(p => p.id === hab?.pisoId);
      return { id: `contrato-${inq.id}`, fecha: inq.hasta, tipo: "Contrato", titulo: `Fin contrato: ${inq.nombre}`, detalle: `${piso?.nombre || ""} · ${hab?.nombre || ""}`, color: diasHasta(inq.hasta) <= 30 ? "red" : "amber" };
    });
    const incidenceEvents = incidencias.filter(i => i.estado !== "resuelta").map(i => {
      const piso = pisos.find(p => p.id === i.pisoId);
      return { id: `inc-${i.id}`, fecha: i.fecha, tipo: "Incidencia", titulo: i.titulo, detalle: piso?.nombre || "General", color: i.prioridad === "alta" ? "red" : i.prioridad === "media" ? "amber" : "gray" };
    });
    const paymentEvents = inquilinos.filter(i => !i.pagado).map(i => {
      const hab = habitaciones.find(h => h.id === i.habitacionId);
      const piso = pisos.find(p => p.id === hab?.pisoId);
      return { id: `pago-${i.id}`, fecha: hoy(), tipo: "Pago", titulo: `Pago pendiente: ${i.nombre}`, detalle: `${piso?.nombre || ""} · ${fEur(hab?.precio || 0)}`, color: "red" };
    });
    return [...paymentEvents, ...contractEvents, ...incidenceEvents].filter(e => e.fecha).sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [pisos, habitaciones, inquilinos, incidencias]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="two-col">
      <div style={S.card}>
        <div style={{ fontWeight: 900, marginBottom: 12 }}>📅 Próximos eventos</div>
        {eventos.length === 0 ? <div style={{ color: "#94a3b8", fontSize: 13 }}>No hay eventos próximos.</div> : eventos.map(e => (
          <div key={e.id} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ minWidth: 84, textAlign: "center", background: "#f8fafc", borderRadius: 9, padding: "7px 6px" }}><div style={{ fontWeight: 900 }}>{new Date(e.fecha).getDate()}</div><div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase" }}>{new Date(e.fecha).toLocaleDateString("es-ES", { month: "short" })}</div></div>
            <div style={{ flex: 1 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><b style={{ fontSize: 13 }}>{e.titulo}</b><Badge color={e.color}>{e.tipo}</Badge></div><div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{e.detalle}</div></div>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div style={{ fontWeight: 900, marginBottom: 12 }}>⏰ Contratos por vencer</div>
        {inquilinos.filter(i => diasHasta(i.hasta) !== null).sort((a, b) => diasHasta(a.hasta) - diasHasta(b.hasta)).map(inq => {
          const d = diasHasta(inq.hasta);
          const hab = habitaciones.find(h => h.id === inq.habitacionId);
          const piso = pisos.find(p => p.id === hab?.pisoId);
          return (
            <div key={inq.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #f1f5f9", gap: 8 }}>
              <div><div style={{ fontWeight: 800, fontSize: 13 }}>{inq.nombre}</div><div style={{ color: "#64748b", fontSize: 11 }}>{piso?.nombre} · {hab?.nombre} · {inq.hasta}</div></div>
              <Badge color={d <= 30 ? "red" : d <= 60 ? "amber" : "gray"}>{d > 0 ? `${d}d` : "vencido"}</Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   INCIDENCIAS
══════════════════════════════════════════ */
function Incidencias({ incidencias, setIncidencias, pisos, habitaciones, inquilinos }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [filtro, setFiltro] = useState("todas");
  const empty = { titulo: "", descripcion: "", pisoId: "", habitacionId: "", inquilinoId: "", prioridad: "media", estado: "pendiente", resolucion: "", fecha: hoy() };
  const filtered = incidencias.filter(i => filtro === "todas" ? true : i.estado === filtro);
  const prioC = { alta: "red", media: "amber", baja: "gray" };
  const estC = { pendiente: "amber", en_proceso: "blue", resuelta: "green" };

  function save() {
    const item = { ...form, id: form.id || nextId(), pisoId: form.pisoId ? Number(form.pisoId) : null, habitacionId: form.habitacionId ? Number(form.habitacionId) : null, inquilinoId: form.inquilinoId ? Number(form.inquilinoId) : null };
    setIncidencias(prev => form.id ? prev.map(i => i.id === item.id ? item : i) : [item, ...prev]);
    setModal(false);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{["todas", "pendiente", "en_proceso", "resuelta"].map(f => <Button key={f} variant={filtro === f ? "primary" : "ghost"} onClick={() => setFiltro(f)} style={{ fontSize: 11, padding: "5px 11px" }}>{f === "todas" ? "Todas" : f === "en_proceso" ? "En proceso" : f.charAt(0).toUpperCase() + f.slice(1)}</Button>)}</div>
        <Button variant="blue" onClick={() => { setForm(empty); setModal(true); }}>+ Nueva incidencia</Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
        {filtered.map(i => {
          const piso = pisos.find(p => p.id === i.pisoId);
          const hab = habitaciones.find(h => h.id === i.habitacionId);
          const inq = inquilinos.find(x => x.id === i.inquilinoId);
          return (
            <div key={i.id} style={{ ...S.card, borderLeft: `4px solid ${badgeColors[prioC[i.prioridad]]?.tx || "#e2e8f0"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 8 }}><div style={{ fontWeight: 900, fontSize: 14 }}>{i.titulo}</div><Badge color={prioC[i.prioridad]}>{i.prioridad}</Badge></div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{piso?.nombre || "General"}{hab ? ` · ${hab.nombre}` : ""}</div>
              {inq && <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 5 }}>👤 {inq.nombre}</div>}
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>📅 {i.fecha}</div>
              <div style={{ fontSize: 12, background: "#f8fafc", borderRadius: 7, padding: "7px 9px", marginBottom: 6 }}>{i.descripcion}</div>
              {i.resolucion && <div style={{ fontSize: 11, color: "#166534", background: "#dcfce7", padding: "5px 9px", borderRadius: 7, marginBottom: 6 }}>✅ {i.resolucion}</div>}
              <div style={{ display: "flex", gap: 5, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                <Badge color={estC[i.estado] || "gray"}>{String(i.estado).replace("_", " ")}</Badge>
                <div style={{ display: "flex", gap: 5 }}>
                  {i.estado === "pendiente" && <Button variant="ghost" onClick={() => setIncidencias(prev => prev.map(x => x.id === i.id ? { ...x, estado: "en_proceso" } : x))} style={{ fontSize: 10, padding: "4px 8px" }}>▶</Button>}
                  {i.estado !== "resuelta" && <Button variant="green" onClick={() => { const r = prompt("Resolución:"); if (r) setIncidencias(prev => prev.map(x => x.id === i.id ? { ...x, estado: "resuelta", resolucion: r } : x)); }} style={{ fontSize: 10, padding: "4px 8px" }}>✓</Button>}
                  <Button variant="ghost" onClick={() => { setForm({ ...i }); setModal(true); }} style={{ fontSize: 10, padding: "4px 7px" }}>Editar</Button>
                  <Button variant="red" onClick={() => { if (confirm("¿Eliminar?")) setIncidencias(prev => prev.filter(x => x.id !== i.id)); }} style={{ fontSize: 10, padding: "4px 7px" }}>✕</Button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <EmptyState title="Sin incidencias" text="No hay incidencias en este estado." />}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Incidencia">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Field label="Título"><input style={S.input} value={form.titulo || ""} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Piso"><select style={S.input} value={form.pisoId || ""} onChange={e => setForm(p => ({ ...p, pisoId: e.target.value, habitacionId: "", inquilinoId: "" }))}><option value="">Seleccionar</option>{pisos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select></Field>
            <Field label="Habitación"><select style={S.input} value={form.habitacionId || ""} onChange={e => { const inq = inquilinos.find(i => i.habitacionId === Number(e.target.value)); setForm(p => ({ ...p, habitacionId: e.target.value, inquilinoId: inq?.id || "" })); }}><option value="">Seleccionar</option>{habitaciones.filter(h => String(h.pisoId) === String(form.pisoId)).map(h => <option key={h.id} value={h.id}>{h.nombre}</option>)}</select></Field>
          </div>
          <Field label="Prioridad"><select style={S.input} value={form.prioridad || "media"} onChange={e => setForm(p => ({ ...p, prioridad: e.target.value }))}>{["alta", "media", "baja"].map(v => <option key={v} value={v}>{v}</option>)}</select></Field>
          <Field label="Descripción"><textarea style={{ ...S.input, minHeight: 70, resize: "vertical" }} value={form.descripcion || ""} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} /></Field>
          <Field label="Estado"><select style={S.input} value={form.estado || "pendiente"} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>{["pendiente", "en_proceso", "resuelta"].map(v => <option key={v} value={v}>{v.replace("_", " ")}</option>)}</select></Field>
          {form.estado === "resuelta" && <Field label="Resolución"><textarea style={{ ...S.input, minHeight: 55, resize: "vertical" }} value={form.resolucion || ""} onChange={e => setForm(p => ({ ...p, resolucion: e.target.value }))} /></Field>}
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}><Button onClick={save} style={{ flex: 1, padding: 11 }}>Guardar</Button><Button variant="ghost" onClick={() => setModal(false)} style={{ flex: 1, padding: 11 }}>Cancelar</Button></div>
        </div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════
   COMUNICACIONES
══════════════════════════════════════════ */
function Comunicaciones({ inquilinos, habitaciones, pisos, mensajes, setMensajes }) {
  const [tab, setTab] = useState("nuevo");
  const [form, setForm] = useState({ inquilinoId: "", canal: "whatsapp", asunto: "", mensaje: "", plantillaId: "" });

  function aplicarPlantilla(id, tenantId = form.inquilinoId) {
    const plantilla = PLANTILLAS.find(p => p.id === Number(id));
    if (!plantilla) return;
    const inq = inquilinos.find(i => i.id === Number(tenantId)) || {};
    const hab = habitaciones.find(h => h.id === inq.habitacionId) || {};
    const texto = plantilla.texto
      .replace(/{nombre}/g, inq.nombre || "[Inquilino]")
      .replace(/{mes}/g, new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" }))
      .replace(/{importe}/g, hab.precio || "[Importe]")
      .replace(/{fecha}/g, inq.hasta || "[Fecha]");
    setForm(prev => ({ ...prev, canal: plantilla.canal, asunto: plantilla.asunto, mensaje: texto, plantillaId: id }));
  }

  function guardarMensaje() {
    if (!form.inquilinoId || !form.mensaje) return alert("Selecciona inquilino y escribe un mensaje.");
    setMensajes(prev => [{ ...form, id: nextId(), inquilinoId: Number(form.inquilinoId), fecha: hoy(), enviado: false }, ...prev]);
    setForm({ inquilinoId: "", canal: "whatsapp", asunto: "", mensaje: "", plantillaId: "" });
    setTab("historial");
  }

  function linkEnvio(msg) {
    const inq = inquilinos.find(i => i.id === Number(msg.inquilinoId));
    if (!inq) return "#";
    if (msg.canal === "email") return `mailto:${inq.email}?subject=${encodeURIComponent(msg.asunto || "")}&body=${encodeURIComponent(msg.mensaje || "")}`;
    return `https://wa.me/34${normalizePhone(inq.telefono)}?text=${encodeURIComponent(msg.mensaje || "")}`;
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>{["nuevo", "historial", "plantillas"].map(t => <Button key={t} variant={tab === t ? "primary" : "ghost"} onClick={() => setTab(t)} style={{ fontSize: 12 }}>{t === "nuevo" ? "Nuevo" : t === "historial" ? `Historial (${mensajes.length})` : "Plantillas"}</Button>)}</div>
      {tab === "nuevo" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="two-col">
          <div style={{ ...S.card, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontWeight: 900, fontSize: 15 }}>✉️ Redactar mensaje</div>
            <Field label="Para"><select style={S.input} value={form.inquilinoId} onChange={e => { const id = e.target.value; setForm(p => ({ ...p, inquilinoId: id })); if (form.plantillaId) aplicarPlantilla(form.plantillaId, id); }}><option value="">Seleccionar inquilino</option>{inquilinos.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}</select></Field>
            <Field label="Plantilla"><select style={S.input} value={form.plantillaId} onChange={e => aplicarPlantilla(e.target.value)}><option value="">Sin plantilla</option>{PLANTILLAS.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select></Field>
            <Field label="Canal"><select style={S.input} value={form.canal} onChange={e => setForm(p => ({ ...p, canal: e.target.value }))}><option value="whatsapp">WhatsApp</option><option value="email">Email</option></select></Field>
            {form.canal === "email" && <Field label="Asunto"><input style={S.input} value={form.asunto} onChange={e => setForm(p => ({ ...p, asunto: e.target.value }))} /></Field>}
            <Field label="Mensaje"><textarea style={{ ...S.input, minHeight: 160, resize: "vertical" }} value={form.mensaje} onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))} /></Field>
            <Button onClick={guardarMensaje}>Guardar en historial</Button>
          </div>
          <div style={S.card}>
            <div style={{ fontWeight: 900, marginBottom: 12 }}>👁️ Vista previa</div>
            <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16, minHeight: 180, whiteSpace: "pre-wrap", fontSize: 13 }}>{form.mensaje || "El mensaje aparecerá aquí."}</div>
          </div>
        </div>
      )}
      {tab === "historial" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mensajes.map(msg => {
            const inq = inquilinos.find(i => i.id === Number(msg.inquilinoId));
            const hab = habitaciones.find(h => h.id === inq?.habitacionId);
            const piso = pisos.find(p => p.id === hab?.pisoId);
            return (
              <div key={msg.id} style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}><div><b>{inq?.nombre || "Inquilino"}</b><div style={{ color: "#64748b", fontSize: 12 }}>{piso?.nombre} · {msg.fecha}</div></div><Badge color={msg.enviado ? "green" : "amber"}>{msg.enviado ? "Enviado" : "Pendiente"}</Badge></div>
                {msg.asunto && <div style={{ marginTop: 8, fontWeight: 800 }}>{msg.asunto}</div>}
                <div style={{ marginTop: 8, fontSize: 13, whiteSpace: "pre-wrap", background: "#f8fafc", padding: 10, borderRadius: 8 }}>{msg.mensaje}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  <a href={linkEnvio(msg)} target="_blank" rel="noreferrer" style={{ ...btnStyle("blue"), textDecoration: "none", fontSize: 12 }}>Abrir {msg.canal}</a>
                  <Button variant="green" onClick={() => setMensajes(prev => prev.map(m => m.id === msg.id ? { ...m, enviado: true } : m))} style={{ fontSize: 12 }}>Marcar enviado</Button>
                  <Button variant="red" onClick={() => setMensajes(prev => prev.filter(m => m.id !== msg.id))} style={{ fontSize: 12 }}>Eliminar</Button>
                </div>
              </div>
            );
          })}
          {mensajes.length === 0 && <EmptyState title="Sin mensajes" text="Guarda un mensaje para verlo aquí." />}
        </div>
      )}
      {tab === "plantillas" && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>{PLANTILLAS.map(p => <div key={p.id} style={S.card}><div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><b>{p.nombre}</b><Badge color={p.canal === "email" ? "blue" : "green"}>{p.canal}</Badge></div><div style={{ marginTop: 8, whiteSpace: "pre-wrap", fontSize: 12, color: "#64748b" }}>{p.texto}</div></div>)}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════
   EXPORTACIÓN
══════════════════════════════════════════ */
function Exportacion({ pisos, habitaciones, inquilinos, propietarios, gastos, incidencias, mensajes, historico, setPisos, setHabitaciones, setInquilinos, setPropietarios, setGastos, setIncidencias, setMensajes, setHistorico }) {
  const metrics = useMetrics(pisos, habitaciones, inquilinos, gastos, incidencias);

  const backupData = { pisos, habitaciones, inquilinos, propietarios, gastos, incidencias, mensajes, historico, exportado: new Date().toISOString() };

  function csv(rows, name) {
    downloadText(`${name}-${hoy()}.csv`, toCsv(rows), "text/csv;charset=utf-8");
  }

  function backup() {
    downloadText(`rent-manager-backup-${hoy()}.json`, JSON.stringify(backupData, null, 2), "application/json;charset=utf-8");
  }

  function importar(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!confirm("¿Importar backup? Esto reemplazará los datos actuales.")) return;
        if (Array.isArray(data.pisos)) setPisos(data.pisos);
        if (Array.isArray(data.habitaciones)) setHabitaciones(data.habitaciones);
        if (Array.isArray(data.inquilinos)) setInquilinos(data.inquilinos);
        if (Array.isArray(data.propietarios)) setPropietarios(data.propietarios);
        if (Array.isArray(data.gastos)) setGastos(data.gastos);
        if (Array.isArray(data.incidencias)) setIncidencias(data.incidencias);
        if (Array.isArray(data.mensajes)) setMensajes(data.mensajes);
        if (Array.isArray(data.historico)) setHistorico(data.historico);
        alert("Backup importado correctamente.");
      } catch {
        alert("No se pudo importar el archivo JSON.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="two-col">
      <div style={S.card}>
        <div style={{ fontWeight: 900, marginBottom: 12 }}>📊 Resumen</div>
        {[
          ["Pisos", pisos.length],
          ["Habitaciones", habitaciones.length],
          ["Inquilinos", inquilinos.length],
          ["Ocupación", `${metrics.ocupadas}/${metrics.totalHabs}`],
          ["Cobrado este mes", fEur(metrics.cobrado)],
          ["Total gastos", fEur(metrics.totalGastos)],
          ["Beneficio neto", fEur(metrics.margen)],
          ["Proyección anual", fEur(metrics.margen * 12)],
        ].map(([label, value]) => <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}><span style={{ color: "#64748b" }}>{label}</span><b>{value}</b></div>)}
      </div>
      <div style={S.card}>
        <div style={{ fontWeight: 900, marginBottom: 12 }}>⬇️ Exportar datos</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <Button variant="ghost" onClick={() => csv(pisos.map(p => ({ Nombre: p.nombre, Direccion: p.direccion, AlquilerTotal: p.alquilerTotal, Notas: p.notas || "" })), "pisos")} style={{ textAlign: "left" }}>🏠 Pisos CSV</Button>
          <Button variant="ghost" onClick={() => csv(habitaciones.map(h => ({ Habitacion: h.nombre, Piso: pisos.find(p => p.id === h.pisoId)?.nombre || "", Planta: h.planta, M2: h.m2, Precio: h.precio, Notas: h.notas || "" })), "habitaciones")} style={{ textAlign: "left" }}>🛏️ Habitaciones CSV</Button>
          <Button variant="ghost" onClick={() => csv(inquilinos.map(i => ({ Nombre: i.nombre, DNI: i.dni || "", Telefono: i.telefono || "", Email: i.email || "", Deposito: i.deposito, Desde: i.desde || "", Hasta: i.hasta || "", Pagado: i.pagado ? "Sí" : "No", Notas: i.notas || "", Habitacion: habitaciones.find(h => h.id === i.habitacionId)?.nombre || "", Piso: pisos.find(p => p.id === habitaciones.find(h => h.id === i.habitacionId)?.pisoId)?.nombre || "" })), "inquilinos")} style={{ textAlign: "left" }}>👥 Inquilinos CSV</Button>
          <Button variant="ghost" onClick={() => csv(gastos.map(g => ({ Concepto: g.concepto, Importe: g.importe, Fecha: g.fecha, Tipo: g.tipo, Piso: pisos.find(p => p.id === g.pisoId)?.nombre || "General" })), "gastos")} style={{ textAlign: "left" }}>💸 Gastos CSV</Button>
          <Button variant="ghost" onClick={() => csv(incidencias.map(i => ({ Titulo: i.titulo, Piso: pisos.find(p => p.id === i.pisoId)?.nombre || "", Prioridad: i.prioridad, Estado: i.estado, Fecha: i.fecha, Descripcion: i.descripcion, Resolucion: i.resolucion || "" })), "incidencias")} style={{ textAlign: "left" }}>🛠️ Incidencias CSV</Button>
          <Button onClick={backup} style={{ textAlign: "left" }}>💾 Backup completo JSON</Button>
          <label style={{ ...btnStyle("purple"), display: "block", textAlign: "left" }}>📥 Importar backup JSON<input type="file" accept="application/json" onChange={importar} style={{ display: "none" }} /></label>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   APP
══════════════════════════════════════════ */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [pisos, setPisos] = useState(PISOS_INIT);
  const [habitaciones, setHabitaciones] = useState(HABITACIONES_INIT);
  const [inquilinos, setInquilinos] = useState(INQUILINOS_INIT);
  const [propietarios, setPropietarios] = useState(PROPIETARIOS_INIT);
  const [gastos, setGastos] = useState(GASTOS_INIT);
  const [incidencias, setIncidencias] = useState(INCIDENCIAS_INIT);
  const [mensajes, setMensajes] = useState(MENSAJES_INIT);
  const [historico, setHistorico] = useState(HISTORICO_INIT);
  const [syncStatus, setSyncStatus] = useState(supabase ? "Conectando a Supabase..." : "Guardado local");
  const skipSaveRef = useRef(false);
  const lastStateJsonRef = useRef("");

  function aplicarEstado(estado, vieneDeSupabase = false) {
    if (!estado) return;
    if (vieneDeSupabase) skipSaveRef.current = true;
    setPisos(Array.isArray(estado.pisos) ? estado.pisos : PISOS_INIT);
    setHabitaciones(Array.isArray(estado.habitaciones) ? estado.habitaciones : HABITACIONES_INIT);
    setInquilinos(Array.isArray(estado.inquilinos) ? estado.inquilinos : INQUILINOS_INIT);
    setPropietarios(Array.isArray(estado.propietarios) ? estado.propietarios : PROPIETARIOS_INIT);
    setGastos(Array.isArray(estado.gastos) ? estado.gastos : GASTOS_INIT);
    setIncidencias(Array.isArray(estado.incidencias) ? estado.incidencias : INCIDENCIAS_INIT);
    setMensajes(Array.isArray(estado.mensajes) ? estado.mensajes : MENSAJES_INIT);
    setHistorico(Array.isArray(estado.historico) ? estado.historico : HISTORICO_INIT);
  }

  async function cargarEstadoLocal() {
    const [p, h, i, pr, g, inc, m, hi] = await Promise.all([
      cargar(STORAGE_KEYS.pisos, PISOS_INIT),
      cargar(STORAGE_KEYS.habitaciones, HABITACIONES_INIT),
      cargar(STORAGE_KEYS.inquilinos, INQUILINOS_INIT),
      cargar(STORAGE_KEYS.propietarios, PROPIETARIOS_INIT),
      cargar(STORAGE_KEYS.gastos, GASTOS_INIT),
      cargar(STORAGE_KEYS.incidencias, INCIDENCIAS_INIT),
      cargar(STORAGE_KEYS.mensajes, MENSAJES_INIT),
      cargar(STORAGE_KEYS.historico, HISTORICO_INIT),
    ]);
    return { pisos: p, habitaciones: h, inquilinos: i, propietarios: pr, gastos: g, incidencias: inc, mensajes: m, historico: hi };
  }

  useEffect(() => {
    (async () => {
      const onlineState = await cargarEstadoOnline();
      const hasOnlineData = onlineState && Array.isArray(onlineState.pisos);

      if (hasOnlineData) {
        lastStateJsonRef.current = JSON.stringify(onlineState);
        aplicarEstado(onlineState, true);
        setSyncStatus("Datos online sincronizados");
      } else {
        const localState = await cargarEstadoLocal();
        const initialState = localState || DEFAULT_STATE;
        lastStateJsonRef.current = JSON.stringify(initialState);
        aplicarEstado(initialState);
        if (supabase) {
          await guardarEstadoOnline(initialState);
          setSyncStatus("Datos online creados");
        }
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;

    const channel = supabase
      .channel("app_state_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_state", filter: `id=eq.${APP_STATE_ID}` },
        payload => {
          const nuevoEstado = payload.new?.data;
          if (!nuevoEstado) return;
          const nuevoJson = JSON.stringify(nuevoEstado);
          if (nuevoJson === lastStateJsonRef.current) return;
          lastStateJsonRef.current = nuevoJson;
          aplicarEstado(nuevoEstado, true);
          setSyncStatus("Actualizado desde otro dispositivo");
        }
      )
      .subscribe(status => {
        if (status === "SUBSCRIBED") setSyncStatus("Sincronización en tiempo real activa");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return undefined;

    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return undefined;
    }

    const estado = { pisos, habitaciones, inquilinos, propietarios, gastos, incidencias, mensajes, historico };
    const estadoJson = JSON.stringify(estado);
    if (estadoJson === lastStateJsonRef.current) return undefined;
    lastStateJsonRef.current = estadoJson;

    const timer = setTimeout(async () => {
      await Promise.all([
        guardar(STORAGE_KEYS.pisos, pisos),
        guardar(STORAGE_KEYS.habitaciones, habitaciones),
        guardar(STORAGE_KEYS.inquilinos, inquilinos),
        guardar(STORAGE_KEYS.propietarios, propietarios),
        guardar(STORAGE_KEYS.gastos, gastos),
        guardar(STORAGE_KEYS.incidencias, incidencias),
        guardar(STORAGE_KEYS.mensajes, mensajes),
        guardar(STORAGE_KEYS.historico, historico),
      ]);

      if (supabase) {
        setSyncStatus("Guardando online...");
        const ok = await guardarEstadoOnline(estado);
        setSyncStatus(ok ? "Guardado online" : "Error guardando online");
      } else {
        setSyncStatus("Guardado local");
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [pisos, habitaciones, inquilinos, propietarios, gastos, incidencias, mensajes, historico, loaded]);

  if (!loaded) {
    return <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 48, marginBottom: 10 }}>🔑</div><div style={{ fontWeight: 900, fontSize: 18 }}>Cargando...</div></div></div>;
  }

  const pendingPayments = inquilinos.filter(i => !i.pagado).length;
  const urgentIssues = incidencias.filter(i => i.estado !== "resuelta" && i.prioridad === "alta").length;
  const tabs = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "pisos", icon: "🏢", label: "Pisos e Inquilinos" },
    { id: "propietarios", icon: "👤", label: "Propietarios" },
    { id: "finanzas", icon: "💶", label: "Finanzas" },
    { id: "calendario", icon: "📅", label: "Calendario" },
    { id: "incidencias", icon: "🛠️", label: "Incidencias", badge: incidencias.filter(i => i.estado !== "resuelta").length },
    { id: "comunicaciones", icon: "💬", label: "Mensajes", badge: mensajes.filter(m => !m.enviado).length },
    { id: "exportacion", icon: "📤", label: "Exportar" },
  ];

  return (
    <div style={S.page}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ background: "#0f172a", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 4px 20px #0005" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 50, borderBottom: "1px solid #1e293b", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 20 }}>🔑</span><span style={{ fontWeight: 900, fontSize: 15, color: "#fff" }}>RentManager</span><span style={{ background: "#2563eb", fontSize: 9, fontWeight: 900, padding: "2px 6px", borderRadius: 99, color: "#fff" }}>PRO</span></div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>{pendingPayments > 0 && <div style={{ background: "#dc2626", color: "#fff", padding: "3px 8px", borderRadius: 99, fontWeight: 800, fontSize: 11 }}>⚠️ {pendingPayments} pagos</div>}{urgentIssues > 0 && <div style={{ background: "#f97316", color: "#fff", padding: "3px 8px", borderRadius: 99, fontWeight: 800, fontSize: 11 }}>🔥 {urgentIssues} urgente</div>}<div style={{ background: supabase ? "#166534" : "#334155", color: "#fff", padding: "3px 8px", borderRadius: 99, fontWeight: 800, fontSize: 11 }}>☁️ {syncStatus}</div></div>
          </div>
          <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingTop: 8 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "#0f172a" : "#94a3b8", border: "none", padding: "10px 12px", borderRadius: "10px 10px 0 0", cursor: "pointer", fontWeight: 800, fontSize: 12, whiteSpace: "nowrap", position: "relative" }}>
                <span style={{ marginRight: 5 }}>{t.icon}</span>{t.label}{t.badge > 0 && <span style={{ marginLeft: 5, background: tab === t.id ? "#fee2e2" : "#334155", color: tab === t.id ? "#dc2626" : "#fff", borderRadius: 99, padding: "1px 6px", fontSize: 10 }}>{t.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "22px 16px 48px" }}>
        {tab === "dashboard" && <Dashboard pisos={pisos} habitaciones={habitaciones} inquilinos={inquilinos} gastos={gastos} incidencias={incidencias} />}
        {tab === "pisos" && <PisosInquilinos pisos={pisos} setPisos={setPisos} habitaciones={habitaciones} setHabitaciones={setHabitaciones} inquilinos={inquilinos} setInquilinos={setInquilinos} propietarios={propietarios} setHistorico={setHistorico} />}
        {tab === "propietarios" && <Propietarios propietarios={propietarios} setPropietarios={setPropietarios} pisos={pisos} />}
        {tab === "finanzas" && <Finanzas pisos={pisos} habitaciones={habitaciones} inquilinos={inquilinos} gastos={gastos} setGastos={setGastos} />}
        {tab === "calendario" && <Calendario pisos={pisos} habitaciones={habitaciones} inquilinos={inquilinos} incidencias={incidencias} />}
        {tab === "incidencias" && <Incidencias incidencias={incidencias} setIncidencias={setIncidencias} pisos={pisos} habitaciones={habitaciones} inquilinos={inquilinos} />}
        {tab === "comunicaciones" && <Comunicaciones inquilinos={inquilinos} habitaciones={habitaciones} pisos={pisos} mensajes={mensajes} setMensajes={setMensajes} />}
        {tab === "exportacion" && <Exportacion pisos={pisos} habitaciones={habitaciones} inquilinos={inquilinos} propietarios={propietarios} gastos={gastos} incidencias={incidencias} mensajes={mensajes} historico={historico} setPisos={setPisos} setHabitaciones={setHabitaciones} setInquilinos={setInquilinos} setPropietarios={setPropietarios} setGastos={setGastos} setIncidencias={setIncidencias} setMensajes={setMensajes} setHistorico={setHistorico} />}
      </main>
    </div>
  );
}


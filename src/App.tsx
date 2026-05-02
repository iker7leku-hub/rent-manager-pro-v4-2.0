import { useState, useEffect, useCallback } from 'react';

/* ══════════════════════════════════════════
   PERSISTENCIA localStorage (Desktop)
══════════════════════════════════════════ */
function guardar(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}
function cargar(key, fallback) {
  try {
    const r = localStorage.getItem(key);
    return r ? JSON.parse(r) : fallback;
  } catch {
    return fallback;
  }
}

/* ══════════════════════════════════════════
   DATOS INICIALES
══════════════════════════════════════════ */
const PISOS_INIT = [
  {
    id: 1,
    nombre: 'Piso Centro',
    direccion: 'C/ Gran Vía 12, Madrid',
    propietarioId: 1,
    alquilerTotal: 1400,
    notas: '',
  },
  {
    id: 2,
    nombre: 'Apartamento Norte',
    direccion: 'Av. América 45, Madrid',
    propietarioId: 2,
    alquilerTotal: 950,
    notas: '',
  },
  {
    id: 3,
    nombre: 'Casa Sur',
    direccion: 'C/ Toledo 8, Madrid',
    propietarioId: 3,
    alquilerTotal: 750,
    notas: '',
  },
];
const HABITACIONES_INIT = [
  {
    id: 1,
    pisoId: 1,
    nombre: 'Habitación 1',
    m2: 12,
    planta: '1ª',
    precio: 700,
    notas: '',
  },
  {
    id: 2,
    pisoId: 1,
    nombre: 'Habitación 2',
    m2: 10,
    planta: '1ª',
    precio: 680,
    notas: '',
  },
  {
    id: 3,
    pisoId: 1,
    nombre: 'Habitación 3',
    m2: 14,
    planta: '2ª',
    precio: 720,
    notas: 'Disponible desde junio',
  },
  {
    id: 4,
    pisoId: 2,
    nombre: 'Habitación 1',
    m2: 11,
    planta: '3ª',
    precio: 600,
    notas: '',
  },
  {
    id: 5,
    pisoId: 2,
    nombre: 'Habitación 2',
    m2: 13,
    planta: '3ª',
    precio: 610,
    notas: '',
  },
  {
    id: 6,
    pisoId: 3,
    nombre: 'Estudio A',
    m2: 28,
    planta: 'PB',
    precio: 850,
    notas: '',
  },
];
const INQUILINOS_INIT = [
  {
    id: 1,
    habitacionId: 1,
    nombre: 'Carlos Méndez',
    telefono: '612345678',
    email: 'carlos@email.com',
    dni: '12345678A',
    desde: '2024-01-01',
    hasta: '2025-12-31',
    deposito: 700,
    pagado: true,
    notas: '',
  },
  {
    id: 2,
    habitacionId: 2,
    nombre: 'Laura Sánchez',
    telefono: '623456789',
    email: 'laura@email.com',
    dni: '23456789B',
    desde: '2024-03-01',
    hasta: '2025-08-31',
    deposito: 680,
    pagado: false,
    notas: '',
  },
  {
    id: 4,
    habitacionId: 4,
    nombre: 'Ahmed Khalil',
    telefono: '634567890',
    email: 'ahmed@email.com',
    dni: '34567890C',
    desde: '2024-02-01',
    hasta: '2025-07-31',
    deposito: 600,
    pagado: true,
    notas: '',
  },
  {
    id: 5,
    habitacionId: 5,
    nombre: 'María Torres',
    telefono: '645678901',
    email: 'maria@email.com',
    dni: '45678901D',
    desde: '2024-04-01',
    hasta: '2025-09-30',
    deposito: 610,
    pagado: true,
    notas: '',
  },
  {
    id: 6,
    habitacionId: 6,
    nombre: 'Javier Ruiz',
    telefono: '656789012',
    email: 'javier@email.com',
    dni: '56789012E',
    desde: '2024-01-15',
    hasta: '2025-11-30',
    deposito: 850,
    pagado: false,
    notas: '',
  },
];
const PROPIETARIOS_INIT = [
  {
    id: 1,
    nombre: 'Antonio García',
    telefono: '699000001',
    email: 'antonio@email.com',
    dni: '11111111A',
    iban: 'ES12 3456 7890 1234 5678 9012',
    comision: 0,
    notas: '',
  },
  {
    id: 2,
    nombre: 'Rosa Martínez',
    telefono: '699000002',
    email: 'rosa@email.com',
    dni: '22222222B',
    iban: 'ES98 7654 3210 9876 5432 1098',
    comision: 5,
    notas: '',
  },
  {
    id: 3,
    nombre: 'Luis Fernández',
    telefono: '699000003',
    email: 'luis@email.com',
    dni: '33333333C',
    iban: 'ES11 2233 4455 6677 8899 0011',
    comision: 0,
    notas: '',
  },
];
const GASTOS_INIT = [
  {
    id: 1,
    concepto: 'Alquiler Piso Centro',
    importe: 1400,
    fecha: '2025-05-01',
    tipo: 'alquiler_piso',
    pisoId: 1,
  },
  {
    id: 2,
    concepto: 'Alquiler Apartamento Norte',
    importe: 950,
    fecha: '2025-05-01',
    tipo: 'alquiler_piso',
    pisoId: 2,
  },
  {
    id: 3,
    concepto: 'Reparación fontanería',
    importe: 120,
    fecha: '2025-04-18',
    tipo: 'mantenimiento',
    pisoId: 1,
  },
  {
    id: 4,
    concepto: 'Seguro hogar Casa Sur',
    importe: 65,
    fecha: '2025-04-01',
    tipo: 'seguros',
    pisoId: 3,
  },
];
const INCIDENCIAS_INIT = [
  {
    id: 1,
    pisoId: 2,
    habitacionId: 5,
    inquilinoId: 5,
    titulo: 'Grifo averiado baño',
    descripcion: 'El grifo del baño principal no cierra bien.',
    prioridad: 'alta',
    estado: 'pendiente',
    fecha: '2025-05-01',
    resolucion: '',
  },
  {
    id: 2,
    pisoId: 1,
    habitacionId: 1,
    inquilinoId: 1,
    titulo: 'Bombilla fundida pasillo',
    descripcion: 'La bombilla del pasillo está fundida.',
    prioridad: 'baja',
    estado: 'resuelta',
    fecha: '2025-04-20',
    resolucion: 'Reemplazada el 22/04',
  },
];
const MENSAJES_INIT = [
  {
    id: 1,
    inquilinoId: 1,
    canal: 'whatsapp',
    asunto: 'Pago recibido',
    mensaje: 'Hola Carlos, hemos recibido tu pago de mayo. ¡Gracias!',
    fecha: '2025-05-01',
    enviado: true,
    nombreInq: 'Carlos Méndez',
  },
  {
    id: 2,
    inquilinoId: 2,
    canal: 'email',
    asunto: 'Pago pendiente mayo',
    mensaje: 'Hola Laura, tu pago de mayo sigue pendiente.',
    fecha: '2025-05-02',
    enviado: false,
    nombreInq: 'Laura Sánchez',
  },
];
const HISTORICO_INIT = [
  {
    id: 1,
    pisoId: 1,
    habitacionId: 1,
    nombre: 'Pedro González',
    desde: '2023-06-01',
    hasta: '2024-01-01',
  },
];

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
const fEur = (n) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n || 0);
const diasHasta = (f) =>
  f ? Math.ceil((new Date(f) - new Date()) / 864e5) : null;
const hoy = () => new Date().toISOString().slice(0, 10);

/* ══════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════ */
const C = {
  bg: '#0d1117',
  surface: '#161b22',
  surface2: '#1c2128',
  border: '#30363d',
  blue: '#2f81f7',
  blueDark: '#1f6feb',
  green: '#3fb950',
  red: '#f85149',
  amber: '#d29922',
  purple: '#bc8cff',
  text: '#e6edf3',
  textMuted: '#8b949e',
  textFaint: '#484f58',
};

const S = {
  card: {
    background: C.surface,
    borderRadius: 12,
    padding: '20px 22px',
    border: `1px solid ${C.border}`,
  },
  btn: (v) => {
    const map = {
      blue: { bg: C.blue, color: '#fff' },
      primary: { bg: C.blue, color: '#fff' },
      green: { bg: C.green, color: '#fff' },
      red: {
        bg: 'rgba(248,81,73,0.15)',
        color: C.red,
        border: `1px solid rgba(248,81,73,0.4)`,
      },
      orange: {
        bg: 'rgba(210,153,34,0.15)',
        color: C.amber,
        border: `1px solid rgba(210,153,34,0.4)`,
      },
      ghost: {
        bg: 'rgba(139,148,158,0.1)',
        color: C.textMuted,
        border: `1px solid ${C.border}`,
      },
      danger: {
        bg: 'rgba(248,81,73,0.15)',
        color: C.red,
        border: `1px solid rgba(248,81,73,0.4)`,
      },
    };
    const m = map[v] || map.ghost;
    return {
      border: m.border || 'none',
      borderRadius: 8,
      padding: '7px 15px',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: 13,
      fontFamily: 'inherit',
      background: m.bg,
      color: m.color,
      transition: 'opacity 0.15s',
      whiteSpace: 'nowrap',
    };
  },
  input: {
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    width: '100%',
    boxSizing: 'border-box',
    background: C.bg,
    color: C.text,
    fontFamily: 'inherit',
    outline: 'none',
  },
  lbl: {
    fontSize: 11,
    fontWeight: 700,
    color: C.textMuted,
    display: 'block',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
};

const BM = {
  green: { bg: 'rgba(63,185,80,0.15)', tx: C.green },
  red: { bg: 'rgba(248,81,73,0.15)', tx: C.red },
  amber: { bg: 'rgba(210,153,34,0.15)', tx: C.amber },
  blue: { bg: 'rgba(47,129,247,0.15)', tx: C.blue },
  purple: { bg: 'rgba(188,140,255,0.15)', tx: C.purple },
  gray: { bg: 'rgba(139,148,158,0.12)', tx: C.textMuted },
  orange: { bg: 'rgba(210,153,34,0.15)', tx: C.amber },
};

const Badge = ({ c = 'gray', children }) => {
  const { bg, tx } = BM[c] || BM.gray;
  return (
    <span
      style={{
        background: bg,
        color: tx,
        borderRadius: 20,
        padding: '3px 10px',
        fontSize: 11,
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
};

function Modal({ open, onClose, title, children, width = 560 }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          background: C.surface,
          borderRadius: 16,
          padding: 28,
          width: '100%',
          maxWidth: width,
          maxHeight: '90vh',
          overflowY: 'auto',
          border: `1px solid ${C.border}`,
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>
            {title}
          </div>
          <button
            onClick={onClose}
            style={{ ...S.btn('ghost'), padding: '4px 10px', fontSize: 16 }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Fld({ label, children, col }) {
  return (
    <div style={{ gridColumn: col || 'span 1' }}>
      <label style={S.lbl}>{label}</label>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   SIDEBAR NAV
══════════════════════════════════════════ */
function Sidebar({ tab, setTab, pendPago, incUrg, mensajesPend }) {
  const TABS = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'pisos', icon: '🏠', label: 'Pisos e Inquilinos' },
    { id: 'propietarios', icon: '👤', label: 'Propietarios' },
    { id: 'finanzas', icon: '💶', label: 'Finanzas' },
    { id: 'calendario', icon: '📅', label: 'Calendario' },
    { id: 'incidencias', icon: '🔧', label: 'Incidencias', badge: incUrg },
    {
      id: 'comunicaciones',
      icon: '💬',
      label: 'Mensajes',
      badge: mensajesPend,
    },
    { id: 'exportacion', icon: '📤', label: 'Exportar' },
  ];

  return (
    <div
      style={{
        width: 240,
        minWidth: 240,
        background: C.surface,
        borderRight: `1px solid ${C.border}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '22px 20px 16px',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            🏢
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, color: C.text }}>
              RentManager
            </div>
            <div
              style={{
                fontSize: 10,
                color: C.blue,
                fontWeight: 700,
                letterSpacing: '0.1em',
              }}
            >
              PRO
            </div>
          </div>
        </div>
        {/* Alertas rápidas */}
        {(pendPago > 0 || incUrg > 0) && (
          <div
            style={{
              marginTop: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
          >
            {pendPago > 0 && (
              <div
                style={{
                  background: 'rgba(248,81,73,0.12)',
                  border: '1px solid rgba(248,81,73,0.3)',
                  borderRadius: 7,
                  padding: '5px 10px',
                  fontSize: 11,
                  color: C.red,
                  fontWeight: 600,
                }}
              >
                ⚠ {pendPago} pago{pendPago > 1 ? 's' : ''} pendiente
                {pendPago > 1 ? 's' : ''}
              </div>
            )}
            {incUrg > 0 && (
              <div
                style={{
                  background: 'rgba(210,153,34,0.12)',
                  border: '1px solid rgba(210,153,34,0.3)',
                  borderRadius: 7,
                  padding: '5px 10px',
                  fontSize: 11,
                  color: C.amber,
                  fontWeight: 600,
                }}
              >
                🔧 {incUrg} incidencia{incUrg > 1 ? 's' : ''} urgente
                {incUrg > 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                marginBottom: 2,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontFamily: 'inherit',
                fontWeight: active ? 700 : 500,
                background: active ? `rgba(47,129,247,0.15)` : 'transparent',
                color: active ? C.blue : C.textMuted,
                textAlign: 'left',
                transition: 'all 0.15s',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <span style={{ flex: 1 }}>{t.label}</span>
              {t.badge > 0 && (
                <span
                  style={{
                    background: C.red,
                    color: '#fff',
                    borderRadius: 10,
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '1px 6px',
                  }}
                >
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '12px 14px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10, color: C.textFaint, textAlign: 'center' }}>
          {new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */
function Dashboard({ pisos, habitaciones, inquilinos, gastos, incidencias }) {
  const totalHabs = habitaciones.length;
  const ocupadas = habitaciones.filter((h) =>
    inquilinos.find((i) => i.habitacionId === h.id)
  ).length;
  const ingresos = habitaciones.reduce((s, h) => {
    const inq = inquilinos.find((i) => i.habitacionId === h.id);
    return s + (inq ? h.precio : 0);
  }, 0);
  const cobrado = habitaciones.reduce((s, h) => {
    const inq = inquilinos.find((i) => i.habitacionId === h.id);
    return s + (inq && inq.pagado ? h.precio : 0);
  }, 0);
  const totalGastos = gastos.reduce((s, g) => s + g.importe, 0);
  const margen = cobrado - totalGastos;
  const sinPagar = inquilinos.filter((i) => !i.pagado);
  const proxVencer = inquilinos.filter((i) => {
    const d = diasHasta(i.hasta);
    return d !== null && d > 0 && d <= 60;
  });
  const incAbiertas = incidencias.filter((i) => i.estado !== 'resuelta');

  const kpis = [
    {
      icon: '🏠',
      l: 'Ocupación',
      v: `${ocupadas}/${totalHabs}`,
      s: `${
        totalHabs > 0 ? Math.round((ocupadas / totalHabs) * 100) : 0
      }% ocupado`,
      c: C.blue,
    },
    {
      icon: '💶',
      l: 'Ingresos',
      v: fEur(ingresos),
      s: 'Potencial mes',
      c: C.green,
    },
    {
      icon: '✅',
      l: 'Cobrado',
      v: fEur(cobrado),
      s: `${fEur(ingresos - cobrado)} por cobrar`,
      c: C.blue,
    },
    { icon: '📉', l: 'Gastos', v: fEur(totalGastos), s: 'Este mes', c: C.red },
    {
      icon: '💰',
      l: 'Beneficio',
      v: fEur(margen),
      s: 'Neto mes',
      c: margen >= 0 ? C.green : C.red,
    },
    {
      icon: '📈',
      l: 'Proyección',
      v: fEur(margen * 12),
      s: 'Anual estimada',
      c: C.purple,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, #0d1b2a, #1a3a5c)`,
          borderRadius: 14,
          padding: '22px 26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: `1px solid rgba(47,129,247,0.2)`,
        }}
      >
        <div>
          <div style={{ fontWeight: 900, fontSize: 24, color: C.text }}>
            🏢 RentManager PRO
          </div>
          <div style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: margen >= 0 ? C.green : C.red,
            }}
          >
            {fEur(margen)}
          </div>
          <div style={{ color: C.textMuted, fontSize: 12 }}>
            Beneficio neto este mes
          </div>
        </div>
      </div>

      {/* Alertas */}
      {(sinPagar.length > 0 ||
        incAbiertas.filter((i) => i.prioridad === 'alta').length > 0) && (
        <div style={{ display: 'flex', gap: 12 }}>
          {sinPagar.length > 0 && (
            <div
              style={{
                flex: 1,
                background: 'rgba(248,81,73,0.08)',
                border: '1px solid rgba(248,81,73,0.3)',
                borderRadius: 10,
                padding: '12px 16px',
              }}
            >
              <div style={{ fontWeight: 700, color: C.red, fontSize: 13 }}>
                ⚠ {sinPagar.length} inquilino{sinPagar.length > 1 ? 's' : ''}{' '}
                sin pagar
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
                {sinPagar.map((i) => i.nombre).join(', ')}
              </div>
            </div>
          )}
          {incAbiertas.filter((i) => i.prioridad === 'alta').length > 0 && (
            <div
              style={{
                flex: 1,
                background: 'rgba(210,153,34,0.08)',
                border: '1px solid rgba(210,153,34,0.3)',
                borderRadius: 10,
                padding: '12px 16px',
              }}
            >
              <div style={{ fontWeight: 700, color: C.amber, fontSize: 13 }}>
                🔧 {incAbiertas.filter((i) => i.prioridad === 'alta').length}{' '}
                incidencia
                {incAbiertas.filter((i) => i.prioridad === 'alta').length > 1
                  ? 's'
                  : ''}{' '}
                de alta prioridad
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
                {incAbiertas
                  .filter((i) => i.prioridad === 'alta')
                  .map((i) => i.titulo)
                  .join(', ')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 12,
        }}
      >
        {kpis.map((k) => (
          <div
            key={k.l}
            style={{
              ...S.card,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div style={{ fontSize: 20 }}>{k.icon}</div>
            <div
              style={{
                fontSize: 10,
                color: C.textMuted,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {k.l}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                color: k.c,
                lineHeight: 1.1,
              }}
            >
              {k.v}
            </div>
            <div style={{ fontSize: 10, color: C.textFaint }}>{k.s}</div>
          </div>
        ))}
      </div>

      {/* Contenido principal */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Rendimiento por piso */}
        <div style={S.card}>
          <div
            style={{
              fontWeight: 800,
              marginBottom: 16,
              color: C.text,
              fontSize: 14,
            }}
          >
            📊 Rendimiento por piso
          </div>
          {pisos.map((p) => {
            const habs = habitaciones.filter((h) => h.pisoId === p.id);
            const occ = habs.filter((h) =>
              inquilinos.find((i) => i.habitacionId === h.id)
            ).length;
            const ing = habs.reduce((s, h) => {
              const inq = inquilinos.find((i) => i.habitacionId === h.id);
              return s + (inq ? h.precio : 0);
            }, 0);
            const pct =
              habs.length > 0 ? Math.round((occ / habs.length) * 100) : 0;
            return (
              <div
                key={p.id}
                style={{
                  marginBottom: 14,
                  padding: '12px 14px',
                  background: C.bg,
                  borderRadius: 10,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 7,
                  }}
                >
                  <span
                    style={{ fontWeight: 800, fontSize: 13, color: C.text }}
                  >
                    {p.nombre}
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: ing - p.alquilerTotal >= 0 ? C.green : C.red,
                      fontSize: 13,
                    }}
                  >
                    {fEur(ing - p.alquilerTotal)}/mes
                  </span>
                </div>
                <div
                  style={{
                    background: C.border,
                    borderRadius: 99,
                    height: 6,
                    marginBottom: 5,
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background:
                        pct === 100 ? C.green : pct > 50 ? C.blue : C.amber,
                      borderRadius: 99,
                      transition: 'width 0.5s',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    color: C.textMuted,
                  }}
                >
                  <span>
                    {occ}/{habs.length} hab · {pct}%
                  </span>
                  <span>
                    ▲{fEur(ing)} ▼{fEur(p.alquilerTotal)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Panel derecho */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={S.card}>
            <div
              style={{
                fontWeight: 800,
                marginBottom: 12,
                fontSize: 13,
                color: C.text,
              }}
            >
              ⚡ Estado rápido
            </div>
            {[
              { l: 'Habitaciones libres', v: totalHabs - ocupadas, c: 'gray' },
              {
                l: 'Pagos pendientes',
                v: sinPagar.length,
                c: sinPagar.length > 0 ? 'red' : 'green',
              },
              {
                l: 'Contratos ≤60d',
                v: proxVencer.length,
                c: proxVencer.length > 0 ? 'amber' : 'green',
              },
              {
                l: 'Incidencias abiertas',
                v: incAbiertas.length,
                c: incAbiertas.length > 0 ? 'orange' : 'green',
              },
            ].map((r) => (
              <div
                key={r.l}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '7px 0',
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <span style={{ color: C.textMuted, fontSize: 13 }}>{r.l}</span>
                <Badge c={r.c}>{r.v}</Badge>
              </div>
            ))}
          </div>

          <div
            style={{
              ...S.card,
              background:
                'linear-gradient(135deg, rgba(63,185,80,0.08), rgba(47,129,247,0.08))',
              border: `1px solid rgba(63,185,80,0.2)`,
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: 12,
                marginBottom: 5,
                color: C.textMuted,
              }}
            >
              💡 Margen / habitación
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.green }}>
              {fEur(Math.round(margen / (ocupadas || 1)))}
            </div>
            <div style={{ fontSize: 11, color: C.textMuted }}>
              Promedio por hab. ocupada
            </div>
          </div>
        </div>
      </div>

      {/* Tablas inferiores */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={S.card}>
          <div style={{ fontWeight: 800, marginBottom: 12, color: C.text }}>
            ⚠ Pagos pendientes
          </div>
          {sinPagar.length === 0 ? (
            <div
              style={{
                color: C.textMuted,
                fontSize: 13,
                textAlign: 'center',
                padding: '20px 0',
              }}
            >
              ✅ Todos al día
            </div>
          ) : (
            sinPagar.map((inq) => {
              const hab = habitaciones.find((h) => h.id === inq.habitacionId);
              const piso = pisos.find((p) => p.id === hab?.pisoId);
              return (
                <div
                  key={inq.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <div>
                    <div
                      style={{ fontWeight: 700, fontSize: 13, color: C.text }}
                    >
                      {inq.nombre}
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>
                      {piso?.nombre} · {hab?.nombre}
                    </div>
                  </div>
                  <Badge c="red">{fEur(hab?.precio || 0)}</Badge>
                </div>
              );
            })
          )}
        </div>

        <div style={S.card}>
          <div style={{ fontWeight: 800, marginBottom: 12, color: C.text }}>
            📅 Contratos por vencer
          </div>
          {proxVencer.length === 0 ? (
            <div
              style={{
                color: C.textMuted,
                fontSize: 13,
                textAlign: 'center',
                padding: '20px 0',
              }}
            >
              ✅ Sin vencimientos próximos
            </div>
          ) : (
            proxVencer.map((inq) => {
              const d = diasHasta(inq.hasta);
              const hab = habitaciones.find((h) => h.id === inq.habitacionId);
              const piso = pisos.find((p) => p.id === hab?.pisoId);
              return (
                <div
                  key={inq.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <div>
                    <div
                      style={{ fontWeight: 700, fontSize: 13, color: C.text }}
                    >
                      {inq.nombre}
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>
                      {piso?.nombre} · {hab?.nombre}
                    </div>
                  </div>
                  <Badge c={d <= 30 ? 'red' : 'amber'}>{d}d</Badge>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PISOS E INQUILINOS
══════════════════════════════════════════ */
function PisosInquilinos({
  pisos,
  setPisos,
  habitaciones,
  setHabitaciones,
  inquilinos,
  setInquilinos,
  propietarios,
  setHistorico,
}) {
  const [pisoModal, setPisoModal] = useState(false);
  const [pisoForm, setPisoForm] = useState({});
  const [habModal, setHabModal] = useState(null);
  const [habForm, setHabForm] = useState({});
  const [inqModal, setInqModal] = useState(null);
  const [inqForm, setInqForm] = useState({});
  const [pisoAbierto, setPisoAbierto] = useState(null);

  const emptyPiso = {
    id: null,
    nombre: '',
    direccion: '',
    propietarioId: '',
    alquilerTotal: '',
    notas: '',
  };
  const emptyHab = {
    id: null,
    pisoId: null,
    nombre: '',
    m2: '',
    planta: '',
    precio: '',
    notas: '',
  };
  const emptyInq = {
    id: null,
    habitacionId: null,
    nombre: '',
    telefono: '',
    email: '',
    dni: '',
    desde: hoy(),
    hasta: '',
    deposito: '',
    pagado: false,
    notas: '',
  };

  function savePiso() {
    const p = {
      ...pisoForm,
      id: pisoForm.id || Date.now(),
      alquilerTotal: +pisoForm.alquilerTotal,
    };
    setPisos((prev) =>
      pisoForm.id ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, p]
    );
    setPisoModal(false);
  }
  function saveHab() {
    const h = {
      ...habForm,
      id: habForm.id || Date.now(),
      m2: +habForm.m2,
      precio: +habForm.precio,
    };
    setHabitaciones((prev) =>
      habForm.id ? prev.map((x) => (x.id === h.id ? h : x)) : [...prev, h]
    );
    setHabModal(null);
  }
  function saveInq() {
    const i = {
      ...inqForm,
      id: inqForm.id || Date.now(),
      deposito: +inqForm.deposito,
    };
    setInquilinos((prev) =>
      inqForm.id ? prev.map((x) => (x.id === i.id ? i : x)) : [...prev, i]
    );
    setInqModal(null);
  }
  function liberarInq(inq) {
    if (!confirm(`¿Registrar salida de ${inq.nombre}?`)) return;
    const hab = habitaciones.find((h) => h.id === inq.habitacionId);
    setHistorico((prev) => [
      ...prev,
      {
        id: Date.now(),
        pisoId: hab?.pisoId,
        habitacionId: inq.habitacionId,
        nombre: inq.nombre,
        desde: inq.desde,
        hasta: hoy(),
      },
    ]);
    setInquilinos((prev) => prev.filter((x) => x.id !== inq.id));
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>
          Mis pisos y habitaciones
        </div>
        <button
          onClick={() => {
            setPisoForm(emptyPiso);
            setPisoModal(true);
          }}
          style={S.btn('blue')}
        >
          + Nuevo piso
        </button>
      </div>

      {pisos.map((piso) => {
        const habs = habitaciones.filter((h) => h.pisoId === piso.id);
        const prop = propietarios.find((p) => p.id === piso.propietarioId);
        const totalIngresos = habs.reduce((s, h) => {
          const inq = inquilinos.find((i) => i.habitacionId === h.id);
          return s + (inq ? h.precio : 0);
        }, 0);
        const margenPiso = totalIngresos - piso.alquilerTotal;
        const habsConInq = habs.filter((h) =>
          inquilinos.find((i) => i.habitacionId === h.id)
        ).length;
        const abierto = pisoAbierto === piso.id;

        return (
          <div
            key={piso.id}
            style={{
              marginBottom: 16,
              borderRadius: 14,
              border: `1px solid ${C.border}`,
              overflow: 'hidden',
            }}
          >
            {/* Cabecera */}
            <div
              onClick={() => setPisoAbierto(abierto ? null : piso.id)}
              style={{
                background: `linear-gradient(135deg, #0d1b2a, #1a2e4a)`,
                padding: '16px 22px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    background: C.blue,
                    borderRadius: 10,
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                  }}
                >
                  🏠
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 16, color: C.text }}>
                    {piso.nombre}
                  </div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>
                    {piso.direccion}
                    {prop ? ` · ${prop.nombre}` : ''}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: C.textMuted }}>
                    Margen mensual
                  </div>
                  <div
                    style={{
                      fontWeight: 900,
                      fontSize: 20,
                      color: margenPiso >= 0 ? C.green : C.red,
                    }}
                  >
                    {fEur(margenPiso)}
                  </div>
                </div>
                <Badge
                  c={
                    habsConInq === habs.length && habs.length > 0
                      ? 'green'
                      : habsConInq > 0
                      ? 'amber'
                      : 'gray'
                  }
                >
                  {habsConInq}/{habs.length} hab
                </Badge>
                <div
                  style={{ display: 'flex', gap: 5 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setPisoForm({ ...piso });
                      setPisoModal(true);
                    }}
                    style={S.btn('ghost')}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('¿Eliminar piso?')) {
                        setPisos((p) => p.filter((x) => x.id !== piso.id));
                        setHabitaciones((h) =>
                          h.filter((x) => x.pisoId !== piso.id)
                        );
                      }
                    }}
                    style={S.btn('danger')}
                  >
                    🗑
                  </button>
                </div>
                <div style={{ color: C.textMuted, fontSize: 18 }}>
                  {abierto ? '▲' : '▼'}
                </div>
              </div>
            </div>

            {/* Resumen financiero */}
            <div
              style={{
                background: C.surface2,
                padding: '10px 22px',
                display: 'flex',
                gap: 20,
                fontSize: 13,
                flexWrap: 'wrap',
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <span style={{ color: C.textMuted }}>
                💸 Alquiler:{' '}
                <b style={{ color: C.red }}>{fEur(piso.alquilerTotal)}</b>
              </span>
              <span style={{ color: C.textMuted }}>
                💶 Ingresos:{' '}
                <b style={{ color: C.green }}>{fEur(totalIngresos)}/mes</b>
              </span>
              <span style={{ color: C.textMuted }}>
                💰 Margen:{' '}
                <b style={{ color: margenPiso >= 0 ? C.blue : C.red }}>
                  {fEur(margenPiso)}
                </b>
              </span>
              {piso.notas && (
                <span style={{ color: C.textMuted }}>📝 {piso.notas}</span>
              )}
            </div>

            {/* Habitaciones */}
            {abierto && (
              <div style={{ background: C.bg, padding: '16px 22px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>
                    Habitaciones ({habs.length})
                  </div>
                  <button
                    onClick={() => {
                      setHabForm({ ...emptyHab, pisoId: piso.id });
                      setHabModal(piso.id);
                    }}
                    style={S.btn('blue')}
                  >
                    + Habitación
                  </button>
                </div>

                {habs.length === 0 && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '24px',
                      color: C.textMuted,
                      fontSize: 13,
                      background: C.surface,
                      borderRadius: 10,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    Sin habitaciones aún. Añade la primera 👆
                  </div>
                )}

                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  {habs.map((hab) => {
                    const inq = inquilinos.find(
                      (i) => i.habitacionId === hab.id
                    );
                    const d = diasHasta(inq?.hasta);
                    return (
                      <div
                        key={hab.id}
                        style={{
                          borderRadius: 10,
                          border: `2px solid ${
                            !inq
                              ? C.border
                              : inq.pagado
                              ? 'rgba(63,185,80,0.4)'
                              : 'rgba(248,81,73,0.4)'
                          }`,
                          overflow: 'hidden',
                        }}
                      >
                        {/* Fila habitación */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            background: C.surface,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              gap: 12,
                              alignItems: 'center',
                            }}
                          >
                            <div
                              style={{
                                background: !inq
                                  ? C.border
                                  : inq.pagado
                                  ? 'rgba(63,185,80,0.3)'
                                  : 'rgba(248,81,73,0.3)',
                                borderRadius: 8,
                                width: 38,
                                height: 38,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 18,
                              }}
                            >
                              {!inq ? '🔓' : inq.pagado ? '✅' : '⚠️'}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontWeight: 800,
                                  fontSize: 14,
                                  color: C.text,
                                }}
                              >
                                {hab.nombre}
                              </div>
                              <div style={{ fontSize: 11, color: C.textMuted }}>
                                {hab.planta} · {hab.m2}m² ·{' '}
                                <b style={{ color: C.blue }}>
                                  {fEur(hab.precio)}/mes
                                </b>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              gap: 6,
                              alignItems: 'center',
                            }}
                          >
                            <Badge
                              c={!inq ? 'gray' : inq.pagado ? 'green' : 'red'}
                            >
                              {!inq
                                ? 'Libre'
                                : inq.pagado
                                ? 'Pagado'
                                : 'Sin pagar'}
                            </Badge>
                            <button
                              onClick={() => {
                                setHabForm({ ...hab });
                                setHabModal(piso.id);
                              }}
                              style={S.btn('ghost')}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('¿Eliminar habitación?')) {
                                  setHabitaciones((p) =>
                                    p.filter((x) => x.id !== hab.id)
                                  );
                                  setInquilinos((p) =>
                                    p.filter((x) => x.habitacionId !== hab.id)
                                  );
                                }
                              }}
                              style={S.btn('danger')}
                            >
                              🗑
                            </button>
                          </div>
                        </div>

                        {/* Inquilino */}
                        {inq ? (
                          <div
                            style={{
                              padding: '12px 16px',
                              background: C.surface2,
                              borderTop: `1px solid ${C.border}`,
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    fontWeight: 800,
                                    fontSize: 14,
                                    color: C.text,
                                  }}
                                >
                                  👤 {inq.nombre}
                                </div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: C.textMuted,
                                    marginTop: 2,
                                  }}
                                >
                                  📱 {inq.telefono}
                                  {inq.email && <> · 📧 {inq.email}</>}
                                </div>
                                <div
                                  style={{ fontSize: 12, color: C.textMuted }}
                                >
                                  📅 {inq.desde} → {inq.hasta}
                                  {d !== null && d <= 60 && (
                                    <span
                                      style={{
                                        color: d <= 30 ? C.red : C.amber,
                                        fontWeight: 700,
                                      }}
                                    >
                                      {' '}
                                      · Vence en {d}d
                                    </span>
                                  )}
                                </div>
                                <div
                                  style={{ fontSize: 12, color: C.textMuted }}
                                >
                                  💰 Depósito: {fEur(inq.deposito)}
                                </div>
                                {inq.notas && (
                                  <div
                                    style={{
                                      fontSize: 11,
                                      color: C.amber,
                                      background: 'rgba(210,153,34,0.1)',
                                      borderRadius: 6,
                                      padding: '3px 8px',
                                      marginTop: 4,
                                      display: 'inline-block',
                                    }}
                                  >
                                    {inq.notas}
                                  </div>
                                )}
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  gap: 6,
                                  flexWrap: 'wrap',
                                  justifyContent: 'flex-end',
                                }}
                              >
                                <button
                                  onClick={() =>
                                    setInquilinos((p) =>
                                      p.map((x) =>
                                        x.id === inq.id
                                          ? { ...x, pagado: !x.pagado }
                                          : x
                                      )
                                    )
                                  }
                                  style={S.btn(inq.pagado ? 'orange' : 'green')}
                                >
                                  {inq.pagado
                                    ? '✗ Quitar pago'
                                    : '✓ Marcar pagado'}
                                </button>
                                {inq.telefono && (
                                  <a
                                    href={`https://wa.me/34${inq.telefono.replace(
                                      /\s/g,
                                      ''
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      ...S.btn('green'),
                                      textDecoration: 'none',
                                    }}
                                  >
                                    💬 WA
                                  </a>
                                )}
                                <button
                                  onClick={() => {
                                    setInqForm({ ...inq });
                                    setInqModal(hab.id);
                                  }}
                                  style={S.btn('ghost')}
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => liberarInq(inq)}
                                  style={S.btn('orange')}
                                >
                                  📤 Liberar
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              padding: '10px 16px',
                              background: C.surface2,
                              borderTop: `1px solid ${C.border}`,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span style={{ fontSize: 13, color: C.textMuted }}>
                              Sin inquilino — habitación libre
                            </span>
                            <button
                              onClick={() => {
                                setInqForm({
                                  ...emptyInq,
                                  habitacionId: hab.id,
                                });
                                setInqModal(hab.id);
                              }}
                              style={S.btn('blue')}
                            >
                              + Añadir inquilino
                            </button>
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

      {pisos.length === 0 && (
        <div
          style={{
            ...S.card,
            textAlign: 'center',
            padding: 60,
            color: C.textMuted,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 16,
              marginBottom: 6,
              color: C.text,
            }}
          >
            No tienes pisos aún
          </div>
          <div style={{ fontSize: 13, marginBottom: 16 }}>
            Empieza añadiendo tu primer piso
          </div>
          <button
            onClick={() => {
              setPisoForm(emptyPiso);
              setPisoModal(true);
            }}
            style={S.btn('blue')}
          >
            + Nuevo piso
          </button>
        </div>
      )}

      {/* Modal Piso */}
      <Modal
        open={pisoModal}
        onClose={() => setPisoModal(false)}
        title={pisoForm.id ? 'Editar piso' : 'Nuevo piso'}
      >
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
        >
          <Fld label="Nombre del piso" col="span 2">
            <input
              style={S.input}
              value={pisoForm.nombre || ''}
              onChange={(e) =>
                setPisoForm((p) => ({ ...p, nombre: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Dirección" col="span 2">
            <input
              style={S.input}
              value={pisoForm.direccion || ''}
              onChange={(e) =>
                setPisoForm((p) => ({ ...p, direccion: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Propietario">
            <select
              style={S.input}
              value={pisoForm.propietarioId || ''}
              onChange={(e) =>
                setPisoForm((p) => ({
                  ...p,
                  propietarioId: +e.target.value || '',
                }))
              }
            >
              <option value="">Sin asignar</option>
              {propietarios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </Fld>
          <Fld label="Alquiler que pagas (€/mes)">
            <input
              type="number"
              style={S.input}
              value={pisoForm.alquilerTotal || ''}
              onChange={(e) =>
                setPisoForm((p) => ({ ...p, alquilerTotal: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Notas" col="span 2">
            <textarea
              style={{ ...S.input, minHeight: 60, resize: 'vertical' }}
              value={pisoForm.notas || ''}
              onChange={(e) =>
                setPisoForm((p) => ({ ...p, notas: e.target.value }))
              }
            />
          </Fld>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            onClick={savePiso}
            style={{ ...S.btn('blue'), flex: 1, padding: '11px' }}
          >
            Guardar
          </button>
          <button
            onClick={() => setPisoModal(false)}
            style={{ ...S.btn('ghost'), flex: 1, padding: '11px' }}
          >
            Cancelar
          </button>
        </div>
      </Modal>

      {/* Modal Habitación */}
      <Modal
        open={habModal !== null}
        onClose={() => setHabModal(null)}
        title={habForm.id ? 'Editar habitación' : 'Nueva habitación'}
      >
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
        >
          <Fld label="Nombre" col="span 2">
            <input
              style={S.input}
              value={habForm.nombre || ''}
              onChange={(e) =>
                setHabForm((p) => ({ ...p, nombre: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Planta">
            <input
              style={S.input}
              value={habForm.planta || ''}
              onChange={(e) =>
                setHabForm((p) => ({ ...p, planta: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Superficie m²">
            <input
              type="number"
              style={S.input}
              value={habForm.m2 || ''}
              onChange={(e) =>
                setHabForm((p) => ({ ...p, m2: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Precio que cobras (€/mes)" col="span 2">
            <input
              type="number"
              style={S.input}
              value={habForm.precio || ''}
              onChange={(e) =>
                setHabForm((p) => ({ ...p, precio: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Notas" col="span 2">
            <textarea
              style={{ ...S.input, minHeight: 50, resize: 'vertical' }}
              value={habForm.notas || ''}
              onChange={(e) =>
                setHabForm((p) => ({ ...p, notas: e.target.value }))
              }
            />
          </Fld>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            onClick={saveHab}
            style={{ ...S.btn('blue'), flex: 1, padding: '11px' }}
          >
            Guardar
          </button>
          <button
            onClick={() => setHabModal(null)}
            style={{ ...S.btn('ghost'), flex: 1, padding: '11px' }}
          >
            Cancelar
          </button>
        </div>
      </Modal>

      {/* Modal Inquilino */}
      <Modal
        open={inqModal !== null}
        onClose={() => setInqModal(null)}
        title={inqForm.id ? 'Editar inquilino' : 'Nuevo inquilino'}
        width={600}
      >
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
        >
          <Fld label="Nombre completo" col="span 2">
            <input
              style={S.input}
              value={inqForm.nombre || ''}
              onChange={(e) =>
                setInqForm((p) => ({ ...p, nombre: e.target.value }))
              }
            />
          </Fld>
          <Fld label="DNI / NIE">
            <input
              style={S.input}
              value={inqForm.dni || ''}
              onChange={(e) =>
                setInqForm((p) => ({ ...p, dni: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Teléfono">
            <input
              style={S.input}
              value={inqForm.telefono || ''}
              onChange={(e) =>
                setInqForm((p) => ({ ...p, telefono: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Email" col="span 2">
            <input
              style={S.input}
              value={inqForm.email || ''}
              onChange={(e) =>
                setInqForm((p) => ({ ...p, email: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Depósito €">
            <input
              type="number"
              style={S.input}
              value={inqForm.deposito || ''}
              onChange={(e) =>
                setInqForm((p) => ({ ...p, deposito: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Fecha de entrada">
            <input
              type="date"
              style={S.input}
              value={inqForm.desde || ''}
              onChange={(e) =>
                setInqForm((p) => ({ ...p, desde: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Fin de contrato">
            <input
              type="date"
              style={S.input}
              value={inqForm.hasta || ''}
              onChange={(e) =>
                setInqForm((p) => ({ ...p, hasta: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Notas" col="span 2">
            <textarea
              style={{ ...S.input, minHeight: 50, resize: 'vertical' }}
              value={inqForm.notas || ''}
              onChange={(e) =>
                setInqForm((p) => ({ ...p, notas: e.target.value }))
              }
            />
          </Fld>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            margin: '12px 0',
          }}
        >
          <input
            type="checkbox"
            id="pag"
            checked={!!inqForm.pagado}
            onChange={(e) =>
              setInqForm((p) => ({ ...p, pagado: e.target.checked }))
            }
          />
          <label
            htmlFor="pag"
            style={{ fontSize: 13, fontWeight: 600, color: C.text }}
          >
            Pago del mes recibido
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={saveInq}
            style={{ ...S.btn('blue'), flex: 1, padding: '11px' }}
          >
            Guardar
          </button>
          <button
            onClick={() => setInqModal(null)}
            style={{ ...S.btn('ghost'), flex: 1, padding: '11px' }}
          >
            Cancelar
          </button>
        </div>
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
  const empty = {
    id: null,
    nombre: '',
    telefono: '',
    email: '',
    dni: '',
    iban: '',
    comision: 0,
    notas: '',
  };

  function save() {
    const p = { ...form, id: form.id || Date.now(), comision: +form.comision };
    setPropietarios((prev) =>
      form.id ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, p]
    );
    setModal(false);
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>
          Propietarios
        </div>
        <button
          onClick={() => {
            setForm(empty);
            setModal(true);
          }}
          style={S.btn('blue')}
        >
          + Nuevo propietario
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 14,
        }}
      >
        {propietarios.map((p) => {
          const susP = pisos.filter((ps) => ps.propietarioId === p.id);
          return (
            <div key={p.id} style={S.card}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 900, fontSize: 15, color: C.text }}>
                    👤 {p.nombre}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>
                    {p.dni || '—'}
                  </div>
                </div>
                {p.comision > 0 && (
                  <Badge c="purple">Comisión {p.comision}%</Badge>
                )}
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  fontSize: 12,
                  marginBottom: 12,
                }}
              >
                {[
                  ['📱', p.telefono || '—'],
                  ['📧', p.email || '—'],
                  ['🏦', p.iban || '—'],
                  ['🏠', `${susP.length} piso${susP.length !== 1 ? 's' : ''}`],
                ].map(([ic, val], idx) => (
                  <div
                    key={idx}
                    style={{
                      background: C.bg,
                      borderRadius: 8,
                      padding: '7px 10px',
                      color: C.textMuted,
                      display: 'flex',
                      gap: 6,
                    }}
                  >
                    <span>{ic}</span>
                    <span style={{ wordBreak: 'break-all' }}>{val}</span>
                  </div>
                ))}
              </div>
              {p.notas && (
                <div
                  style={{
                    fontSize: 11,
                    background: 'rgba(210,153,34,0.1)',
                    padding: '5px 8px',
                    borderRadius: 6,
                    color: C.amber,
                    marginBottom: 10,
                  }}
                >
                  {p.notas}
                </div>
              )}
              <div style={{ display: 'flex', gap: 6 }}>
                {p.telefono && (
                  <a
                    href={`https://wa.me/34${p.telefono.replace(/\s/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ ...S.btn('green'), textDecoration: 'none' }}
                  >
                    💬
                  </a>
                )}
                {p.email && (
                  <a
                    href={`mailto:${p.email}`}
                    style={{ ...S.btn('blue'), textDecoration: 'none' }}
                  >
                    📧
                  </a>
                )}
                <button
                  onClick={() => {
                    setForm({ ...p });
                    setModal(true);
                  }}
                  style={S.btn('ghost')}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Eliminar propietario?'))
                      setPropietarios((prev) =>
                        prev.filter((x) => x.id !== p.id)
                      );
                  }}
                  style={S.btn('danger')}
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })}
        {propietarios.length === 0 && (
          <div
            style={{
              ...S.card,
              color: C.textMuted,
              textAlign: 'center',
              padding: 40,
            }}
          >
            No hay propietarios registrados
          </div>
        )}
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={form.id ? 'Editar propietario' : 'Nuevo propietario'}
      >
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
        >
          <Fld label="Nombre" col="span 2">
            <input
              style={S.input}
              value={form.nombre || ''}
              onChange={(e) =>
                setForm((p) => ({ ...p, nombre: e.target.value }))
              }
            />
          </Fld>
          <Fld label="DNI/NIE">
            <input
              style={S.input}
              value={form.dni || ''}
              onChange={(e) => setForm((p) => ({ ...p, dni: e.target.value }))}
            />
          </Fld>
          <Fld label="Teléfono">
            <input
              style={S.input}
              value={form.telefono || ''}
              onChange={(e) =>
                setForm((p) => ({ ...p, telefono: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Email" col="span 2">
            <input
              style={S.input}
              value={form.email || ''}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
            />
          </Fld>
          <Fld label="IBAN" col="span 2">
            <input
              style={S.input}
              value={form.iban || ''}
              onChange={(e) => setForm((p) => ({ ...p, iban: e.target.value }))}
            />
          </Fld>
          <Fld label="Comisión % (0 = sin comisión)">
            <input
              type="number"
              style={S.input}
              value={form.comision || 0}
              onChange={(e) =>
                setForm((p) => ({ ...p, comision: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Notas">
            <input
              style={S.input}
              value={form.notas || ''}
              onChange={(e) =>
                setForm((p) => ({ ...p, notas: e.target.value }))
              }
            />
          </Fld>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            onClick={save}
            style={{ ...S.btn('blue'), flex: 1, padding: '11px' }}
          >
            Guardar
          </button>
          <button
            onClick={() => setModal(false)}
            style={{ ...S.btn('ghost'), flex: 1, padding: '11px' }}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════
   FINANZAS
══════════════════════════════════════════ */
function Finanzas({ pisos, habitaciones, inquilinos, gastos, setGastos }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    concepto: '',
    importe: '',
    fecha: hoy(),
    tipo: 'mantenimiento',
    pisoId: '',
  });

  const ingresos = habitaciones.reduce((s, h) => {
    const i = inquilinos.find((x) => x.habitacionId === h.id);
    return s + (i ? h.precio : 0);
  }, 0);
  const cobrado = habitaciones.reduce((s, h) => {
    const i = inquilinos.find((x) => x.habitacionId === h.id);
    return s + (i && i.pagado ? h.precio : 0);
  }, 0);
  const totalG = gastos.reduce((s, g) => s + g.importe, 0);
  const beneficio = cobrado - totalG;
  const porTipo = gastos.reduce((a, g) => {
    a[g.tipo] = (a[g.tipo] || 0) + g.importe;
    return a;
  }, {});

  const kpis = [
    { icon: '💶', l: 'Potencial', v: fEur(ingresos), c: C.green },
    { icon: '✅', l: 'Cobrado', v: fEur(cobrado), c: C.blue },
    { icon: '📉', l: 'Gastos', v: fEur(totalG), c: C.red },
    {
      icon: '💰',
      l: 'Beneficio',
      v: fEur(beneficio),
      c: beneficio >= 0 ? C.green : C.red,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
        }}
      >
        {kpis.map((k) => (
          <div key={k.l} style={S.card}>
            <div style={{ fontSize: 20 }}>{k.icon}</div>
            <div
              style={{
                fontSize: 10,
                color: C.textMuted,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginTop: 4,
              }}
            >
              {k.l}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: k.c }}>
              {k.v}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Por piso */}
        <div style={S.card}>
          <div style={{ fontWeight: 800, marginBottom: 14, color: C.text }}>
            🏠 Por piso
          </div>
          {pisos.map((p) => {
            const habs = habitaciones.filter((h) => h.pisoId === p.id);
            const ing = habs.reduce((s, h) => {
              const i = inquilinos.find((x) => x.habitacionId === h.id);
              return s + (i ? h.precio : 0);
            }, 0);
            const gast = gastos
              .filter((g) => g.pisoId === p.id)
              .reduce((s, g) => s + g.importe, 0);
            const ben = ing - p.alquilerTotal - gast;
            return (
              <div
                key={p.id}
                style={{
                  background: C.bg,
                  borderRadius: 9,
                  padding: '12px',
                  marginBottom: 10,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 13,
                    marginBottom: 8,
                    color: C.text,
                  }}
                >
                  {p.nombre}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: 8,
                    fontSize: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: C.textMuted,
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      INGRESOS
                    </div>
                    <div style={{ color: C.green, fontWeight: 700 }}>
                      {fEur(ing)}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: C.textMuted,
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      GASTOS
                    </div>
                    <div style={{ color: C.red, fontWeight: 700 }}>
                      {fEur(p.alquilerTotal + gast)}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: C.textMuted,
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      MARGEN
                    </div>
                    <div
                      style={{
                        color: ben >= 0 ? C.green : C.red,
                        fontWeight: 700,
                      }}
                    >
                      {fEur(ben)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Por categoría */}
        <div style={S.card}>
          <div style={{ fontWeight: 800, marginBottom: 14, color: C.text }}>
            📂 Por categoría
          </div>
          {Object.entries(porTipo)
            .sort((a, b) => b[1] - a[1])
            .map(([tipo, total]) => {
              const pct = Math.round((total / totalG) * 100);
              return (
                <div key={tipo} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      marginBottom: 5,
                    }}
                  >
                    <span
                      style={{
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        color: C.text,
                      }}
                    >
                      {tipo.replace(/_/g, ' ')}
                    </span>
                    <span style={{ fontWeight: 700, color: C.text }}>
                      {fEur(total)}{' '}
                      <span style={{ color: C.textMuted }}>({pct}%)</span>
                    </span>
                  </div>
                  <div
                    style={{
                      background: C.border,
                      borderRadius: 99,
                      height: 5,
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: C.blue,
                        borderRadius: 99,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          {Object.keys(porTipo).length === 0 && (
            <div
              style={{
                color: C.textMuted,
                textAlign: 'center',
                padding: '20px 0',
              }}
            >
              Sin gastos registrados
            </div>
          )}
        </div>
      </div>

      {/* Tabla gastos */}
      <div style={S.card}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <div style={{ fontWeight: 800, color: C.text }}>
            📋 Registro de gastos
          </div>
          <button onClick={() => setModal(true)} style={S.btn('blue')}>
            + Añadir gasto
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}
          >
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {['Concepto', 'Piso', 'Fecha', 'Tipo', 'Importe', ''].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '8px 10px',
                        color: C.textMuted,
                        fontWeight: 700,
                        fontSize: 11,
                        textTransform: 'uppercase',
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {gastos
                .sort((a, b) => b.fecha.localeCompare(a.fecha))
                .map((g) => {
                  const p = pisos.find((x) => x.id === g.pisoId);
                  return (
                    <tr
                      key={g.id}
                      style={{ borderBottom: `1px solid ${C.border}` }}
                    >
                      <td
                        style={{
                          padding: '10px 10px',
                          fontWeight: 700,
                          color: C.text,
                        }}
                      >
                        {g.concepto}
                      </td>
                      <td style={{ padding: '10px 10px', color: C.textMuted }}>
                        {p?.nombre || '—'}
                      </td>
                      <td style={{ padding: '10px 10px', color: C.textMuted }}>
                        {g.fecha}
                      </td>
                      <td style={{ padding: '10px 10px' }}>
                        <Badge c="blue">{g.tipo.replace(/_/g, ' ')}</Badge>
                      </td>
                      <td
                        style={{
                          padding: '10px 10px',
                          fontWeight: 800,
                          color: C.red,
                        }}
                      >
                        {fEur(g.importe)}
                      </td>
                      <td style={{ padding: '10px 10px' }}>
                        <button
                          onClick={() =>
                            setGastos((p) => p.filter((x) => x.id !== g.id))
                          }
                          style={S.btn('danger')}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {gastos.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '30px',
                color: C.textMuted,
              }}
            >
              Sin gastos registrados
            </div>
          )}
        </div>
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Añadir gasto"
        width={440}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Fld label="Concepto">
            <input
              style={S.input}
              value={form.concepto}
              onChange={(e) =>
                setForm((p) => ({ ...p, concepto: e.target.value }))
              }
            />
          </Fld>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
          >
            <Fld label="Importe €">
              <input
                type="number"
                style={S.input}
                value={form.importe}
                onChange={(e) =>
                  setForm((p) => ({ ...p, importe: e.target.value }))
                }
              />
            </Fld>
            <Fld label="Fecha">
              <input
                type="date"
                style={S.input}
                value={form.fecha}
                onChange={(e) =>
                  setForm((p) => ({ ...p, fecha: e.target.value }))
                }
              />
            </Fld>
          </div>
          <Fld label="Piso">
            <select
              style={S.input}
              value={form.pisoId}
              onChange={(e) =>
                setForm((p) => ({ ...p, pisoId: +e.target.value || '' }))
              }
            >
              <option value="">General</option>
              {pisos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </Fld>
          <Fld label="Tipo">
            <select
              style={S.input}
              value={form.tipo}
              onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
            >
              {[
                'alquiler_piso',
                'mantenimiento',
                'seguros',
                'suministros',
                'gestoría',
                'limpieza',
                'otros',
              ].map((v) => (
                <option key={v} value={v}>
                  {v.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </Fld>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button
              onClick={() => {
                setGastos((p) => [
                  ...p,
                  { ...form, id: Date.now(), importe: +form.importe },
                ]);
                setModal(false);
                setForm({
                  concepto: '',
                  importe: '',
                  fecha: hoy(),
                  tipo: 'mantenimiento',
                  pisoId: '',
                });
              }}
              style={{ ...S.btn('blue'), flex: 1, padding: '11px' }}
            >
              Guardar
            </button>
            <button
              onClick={() => setModal(false)}
              style={{ ...S.btn('ghost'), flex: 1, padding: '11px' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════
   INCIDENCIAS
══════════════════════════════════════════ */
function Incidencias({
  incidencias,
  setIncidencias,
  pisos,
  habitaciones,
  inquilinos,
}) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [filtro, setFiltro] = useState('todas');
  const empty = {
    titulo: '',
    descripcion: '',
    pisoId: '',
    habitacionId: '',
    inquilinoId: '',
    prioridad: 'media',
    estado: 'pendiente',
    fecha: hoy(),
    resolucion: '',
  };
  const filtered = incidencias.filter((i) =>
    filtro === 'todas' ? true : i.estado === filtro
  );
  const prioC = { alta: 'red', media: 'amber', baja: 'gray' };
  const estC = { pendiente: 'amber', en_proceso: 'blue', resuelta: 'green' };

  function save() {
    const inc = { ...form, id: form.id || Date.now() };
    setIncidencias((p) =>
      form.id ? p.map((x) => (x.id === inc.id ? inc : x)) : [...p, inc]
    );
    setModal(false);
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          {['todas', 'pendiente', 'en_proceso', 'resuelta'].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              style={{
                ...S.btn(filtro === f ? 'blue' : 'ghost'),
                fontSize: 12,
              }}
            >
              {f === 'todas'
                ? 'Todas'
                : f === 'en_proceso'
                ? 'En proceso'
                : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setForm(empty);
            setModal(true);
          }}
          style={S.btn('blue')}
        >
          + Nueva incidencia
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 14,
        }}
      >
        {filtered.map((i) => {
          const piso = pisos.find((p) => p.id === i.pisoId);
          const hab = habitaciones.find((h) => h.id === i.habitacionId);
          const inq = inquilinos.find((x) => x.id === i.inquilinoId);
          return (
            <div
              key={i.id}
              style={{
                ...S.card,
                borderLeft: `4px solid ${
                  BM[prioC[i.prioridad]]?.tx || C.border
                }`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 8,
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 14, color: C.text }}>
                  {i.titulo}
                </div>
                <Badge c={prioC[i.prioridad]}>{i.prioridad}</Badge>
              </div>
              <div
                style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}
              >
                {piso?.nombre}
                {hab ? ` · ${hab.nombre}` : ''}
              </div>
              {inq && (
                <div
                  style={{ fontSize: 11, color: C.textMuted, marginBottom: 5 }}
                >
                  👤 {inq.nombre}
                </div>
              )}
              <div
                style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}
              >
                📅 {i.fecha}
              </div>
              <div
                style={{
                  fontSize: 12,
                  background: C.bg,
                  borderRadius: 7,
                  padding: '8px 10px',
                  marginBottom: 8,
                  color: C.text,
                  border: `1px solid ${C.border}`,
                }}
              >
                {i.descripcion}
              </div>
              {i.resolucion && (
                <div
                  style={{
                    fontSize: 11,
                    color: C.green,
                    background: 'rgba(63,185,80,0.1)',
                    padding: '5px 8px',
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                >
                  ✅ {i.resolucion}
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  gap: 5,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Badge c={estC[i.estado] || 'gray'}>
                  {i.estado.replace('_', ' ')}
                </Badge>
                <div style={{ display: 'flex', gap: 5 }}>
                  {i.estado === 'pendiente' && (
                    <button
                      onClick={() =>
                        setIncidencias((p) =>
                          p.map((x) =>
                            x.id === i.id ? { ...x, estado: 'en_proceso' } : x
                          )
                        )
                      }
                      style={S.btn('blue')}
                    >
                      ▶ Proceso
                    </button>
                  )}
                  {i.estado !== 'resuelta' && (
                    <button
                      onClick={() => {
                        const r = prompt('Resolución:');
                        if (r)
                          setIncidencias((p) =>
                            p.map((x) =>
                              x.id === i.id
                                ? { ...x, estado: 'resuelta', resolucion: r }
                                : x
                            )
                          );
                      }}
                      style={S.btn('green')}
                    >
                      ✓ Resolver
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setForm({ ...i });
                      setModal(true);
                    }}
                    style={S.btn('ghost')}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('¿Eliminar?'))
                        setIncidencias((p) => p.filter((x) => x.id !== i.id));
                    }}
                    style={S.btn('danger')}
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div
            style={{
              ...S.card,
              color: C.textMuted,
              textAlign: 'center',
              padding: 40,
            }}
          >
            Sin incidencias en esta categoría
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Incidencia">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Fld label="Título">
            <input
              style={S.input}
              value={form.titulo || ''}
              onChange={(e) =>
                setForm((p) => ({ ...p, titulo: e.target.value }))
              }
            />
          </Fld>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
          >
            <Fld label="Piso">
              <select
                style={S.input}
                value={form.pisoId || ''}
                onChange={(e) =>
                  setForm((p) => ({ ...p, pisoId: +e.target.value || '' }))
                }
              >
                <option value="">Seleccionar</option>
                {pisos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </Fld>
            <Fld label="Habitación">
              <select
                style={S.input}
                value={form.habitacionId || ''}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    habitacionId: +e.target.value || '',
                  }))
                }
              >
                <option value="">Seleccionar</option>
                {habitaciones
                  .filter((h) => h.pisoId === form.pisoId)
                  .map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.nombre}
                    </option>
                  ))}
              </select>
            </Fld>
          </div>
          <Fld label="Prioridad">
            <select
              style={S.input}
              value={form.prioridad || 'media'}
              onChange={(e) =>
                setForm((p) => ({ ...p, prioridad: e.target.value }))
              }
            >
              {['alta', 'media', 'baja'].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </Fld>
          <Fld label="Descripción">
            <textarea
              style={{ ...S.input, minHeight: 70, resize: 'vertical' }}
              value={form.descripcion || ''}
              onChange={(e) =>
                setForm((p) => ({ ...p, descripcion: e.target.value }))
              }
            />
          </Fld>
          <Fld label="Estado">
            <select
              style={S.input}
              value={form.estado || 'pendiente'}
              onChange={(e) =>
                setForm((p) => ({ ...p, estado: e.target.value }))
              }
            >
              {['pendiente', 'en_proceso', 'resuelta'].map((v) => (
                <option key={v} value={v}>
                  {v.replace('_', ' ')}
                </option>
              ))}
            </select>
          </Fld>
          {form.estado === 'resuelta' && (
            <Fld label="Resolución">
              <textarea
                style={{ ...S.input, minHeight: 50, resize: 'vertical' }}
                value={form.resolucion || ''}
                onChange={(e) =>
                  setForm((p) => ({ ...p, resolucion: e.target.value }))
                }
              />
            </Fld>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button
              onClick={save}
              style={{ ...S.btn('blue'), flex: 1, padding: '11px' }}
            >
              Guardar
            </button>
            <button
              onClick={() => setModal(false)}
              style={{ ...S.btn('ghost'), flex: 1, padding: '11px' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════
   COMUNICACIONES
══════════════════════════════════════════ */
const PLANTILLAS = [
  {
    id: 1,
    nombre: 'Recordatorio pago',
    canal: 'whatsapp',
    asunto: '',
    texto:
      'Hola {nombre}, te recordamos que el pago de {mes} por importe de {importe}€ está pendiente. Por favor, realiza la transferencia antes del día 5. Gracias.',
  },
  {
    id: 2,
    nombre: 'Pago recibido',
    canal: 'whatsapp',
    asunto: '',
    texto:
      '¡Hola {nombre}! Hemos recibido correctamente tu pago de {mes}. ¡Gracias! 😊',
  },
  {
    id: 3,
    nombre: 'Renovación contrato',
    canal: 'email',
    asunto: 'Renovación de contrato',
    texto:
      'Estimado/a {nombre},\n\nSu contrato vence el {fecha}. Nos ponemos en contacto para iniciar el proceso de renovación.\n\nEsperamos su respuesta.\n\nSaludos.',
  },
  {
    id: 4,
    nombre: 'Fin de contrato',
    canal: 'email',
    asunto: 'Aviso fin de contrato',
    texto:
      'Estimado/a {nombre},\n\nLe informamos que su contrato finaliza el {fecha}. Por favor, contacte con nosotros para gestionar la salida.\n\nGracias.',
  },
  {
    id: 5,
    nombre: 'Bienvenida',
    canal: 'whatsapp',
    asunto: '',
    texto:
      '¡Bienvenido/a {nombre}! Es un placer tenerte como inquilino/a. Cualquier duda estamos a tu disposición. 🏠',
  },
];

function Comunicaciones({
  inquilinos,
  habitaciones,
  pisos,
  mensajes,
  setMensajes,
}) {
  const [tab, setTab] = useState('nuevo');
  const [form, setForm] = useState({
    inqId: '',
    canal: 'whatsapp',
    asunto: '',
    mensaje: '',
    plantillaId: '',
  });
  const [preview, setPreview] = useState(null);

  function aplicarPlantilla(id) {
    const pl = PLANTILLAS.find((p) => p.id === +id);
    if (!pl) return;
    const inq = inquilinos.find((i) => i.id === +form.inqId) || {};
    const hab = habitaciones.find((h) => h.id === inq.habitacionId) || {};
    const txt = pl.texto
      .replace(/{nombre}/g, inq.nombre || '[Inquilino]')
      .replace(
        /{mes}/g,
        new Date().toLocaleDateString('es-ES', {
          month: 'long',
          year: 'numeric',
        })
      )
      .replace(/{importe}/g, hab.precio || '[Importe]')
      .replace(/{fecha}/g, inq.hasta || '[Fecha]');
    setForm((p) => ({
      ...p,
      canal: pl.canal,
      asunto: pl.asunto,
      mensaje: txt,
      plantillaId: id,
    }));
  }

  function guardar() {
    const inq = inquilinos.find((i) => i.id === +form.inqId);
    const msg = {
      ...form,
      id: Date.now(),
      fecha: hoy(),
      enviado: false,
      nombreInq: inq?.nombre || 'Todos',
    };
    setMensajes((p) => [msg, ...p]);
    setPreview(msg);
    setForm({
      inqId: '',
      canal: 'whatsapp',
      asunto: '',
      mensaje: '',
      plantillaId: '',
    });
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {['nuevo', 'historial', 'plantillas'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={S.btn(tab === t ? 'blue' : 'ghost')}
          >
            {t === 'nuevo'
              ? '✏️ Nuevo'
              : t === 'historial'
              ? `📨 Historial (${mensajes.length})`
              : '📋 Plantillas'}
          </button>
        ))}
      </div>

      {tab === 'nuevo' && (
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
        >
          <div
            style={{
              ...S.card,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 15, color: C.text }}>
              Redactar mensaje
            </div>
            <Fld label="Plantilla">
              <select
                style={S.input}
                value={form.plantillaId}
                onChange={(e) => {
                  setForm((p) => ({ ...p, plantillaId: e.target.value }));
                  aplicarPlantilla(e.target.value);
                }}
              >
                <option value="">Sin plantilla</option>
                {PLANTILLAS.map((p) => (
                  <option key={p.id} value={p.id}>
                    📋 {p.nombre}
                  </option>
                ))}
              </select>
            </Fld>
            <Fld label="Para (inquilino)">
              <select
                style={S.input}
                value={form.inqId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, inqId: e.target.value }))
                }
              >
                <option value="">Seleccionar</option>
                {inquilinos.map((i) => {
                  const h = habitaciones.find((x) => x.id === i.habitacionId);
                  const p = pisos.find((x) => x.id === h?.pisoId);
                  return (
                    <option key={i.id} value={i.id}>
                      {i.nombre} — {p?.nombre} / {h?.nombre}
                    </option>
                  );
                })}
                <option value="TODOS">📢 Todos los inquilinos</option>
              </select>
            </Fld>
            <Fld label="Canal">
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  ['whatsapp', '💬 WhatsApp'],
                  ['email', '📧 Email'],
                  ['sms', '📱 SMS'],
                ].map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setForm((p) => ({ ...p, canal: v }))}
                    style={{
                      ...S.btn(form.canal === v ? 'green' : 'ghost'),
                      flex: 1,
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Fld>
            {form.canal === 'email' && (
              <Fld label="Asunto">
                <input
                  style={S.input}
                  value={form.asunto}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, asunto: e.target.value }))
                  }
                />
              </Fld>
            )}
            <Fld label="Mensaje">
              <textarea
                style={{ ...S.input, minHeight: 140, resize: 'vertical' }}
                value={form.mensaje}
                onChange={(e) =>
                  setForm((p) => ({ ...p, mensaje: e.target.value }))
                }
              />
            </Fld>
            <button
              onClick={guardar}
              style={{ ...S.btn('blue'), padding: '11px' }}
            >
              💾 Guardar mensaje
            </button>
          </div>

          <div style={{ ...S.card, background: C.surface2 }}>
            <div style={{ fontWeight: 800, marginBottom: 12, color: C.text }}>
              Vista previa
            </div>
            {preview ? (
              <div>
                <div
                  style={{
                    display: 'flex',
                    gap: 6,
                    marginBottom: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <Badge c={preview.canal === 'whatsapp' ? 'green' : 'blue'}>
                    {preview.canal}
                  </Badge>
                  {preview.nombreInq && (
                    <Badge c="gray">→ {preview.nombreInq}</Badge>
                  )}
                </div>
                {preview.asunto && (
                  <div
                    style={{
                      fontWeight: 700,
                      marginBottom: 8,
                      fontSize: 13,
                      color: C.text,
                    }}
                  >
                    📌 {preview.asunto}
                  </div>
                )}
                <div
                  style={{
                    background: C.bg,
                    borderRadius: 10,
                    padding: 14,
                    fontSize: 13,
                    whiteSpace: 'pre-wrap',
                    color: C.text,
                    border: `1px solid ${C.border}`,
                    lineHeight: 1.6,
                  }}
                >
                  {preview.mensaje}
                </div>
                {preview.canal === 'whatsapp' &&
                  (() => {
                    const inq = inquilinos.find((i) => i.id === +preview.inqId);
                    return inq?.telefono ? (
                      <a
                        href={`https://wa.me/34${inq.telefono.replace(
                          /\s/g,
                          ''
                        )}?text=${encodeURIComponent(preview.mensaje)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          ...S.btn('green'),
                          textDecoration: 'none',
                          display: 'inline-block',
                          marginTop: 10,
                        }}
                      >
                        💬 Abrir en WhatsApp
                      </a>
                    ) : null;
                  })()}
                {preview.canal === 'email' &&
                  (() => {
                    const inq = inquilinos.find((i) => i.id === +preview.inqId);
                    return inq?.email ? (
                      <a
                        href={`mailto:${inq.email}?subject=${encodeURIComponent(
                          preview.asunto
                        )}&body=${encodeURIComponent(preview.mensaje)}`}
                        style={{
                          ...S.btn('blue'),
                          textDecoration: 'none',
                          display: 'inline-block',
                          marginTop: 10,
                        }}
                      >
                        📧 Abrir en Email
                      </a>
                    ) : null;
                  })()}
              </div>
            ) : (
              <div
                style={{
                  color: C.textMuted,
                  textAlign: 'center',
                  padding: '50px 20px',
                }}
              >
                <div style={{ fontSize: 36 }}>✉️</div>
                <div style={{ marginTop: 8 }}>
                  Redacta un mensaje para ver la vista previa
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'historial' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {mensajes.length === 0 && (
            <div
              style={{
                ...S.card,
                color: C.textMuted,
                textAlign: 'center',
                padding: 40,
              }}
            >
              Sin mensajes registrados
            </div>
          )}
          {mensajes.map((m) => (
            <div
              key={m.id}
              style={{
                ...S.card,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    gap: 6,
                    marginBottom: 6,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Badge c={m.canal === 'whatsapp' ? 'green' : 'blue'}>
                    {m.canal}
                  </Badge>
                  <span
                    style={{ fontWeight: 700, fontSize: 13, color: C.text }}
                  >
                    → {m.nombreInq || '—'}
                  </span>
                  <Badge c={m.enviado ? 'green' : 'amber'}>
                    {m.enviado ? 'Enviado' : 'Pendiente'}
                  </Badge>
                  <span style={{ color: C.textMuted, fontSize: 11 }}>
                    📅 {m.fecha}
                  </span>
                </div>
                {m.asunto && (
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 12,
                      marginBottom: 4,
                      color: C.text,
                    }}
                  >
                    📌 {m.asunto}
                  </div>
                )}
                <div
                  style={{
                    fontSize: 12,
                    color: C.textMuted,
                    maxHeight: 48,
                    overflow: 'hidden',
                  }}
                >
                  {m.mensaje}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 5,
                  flexShrink: 0,
                  marginLeft: 12,
                }}
              >
                {!m.enviado && (
                  <button
                    onClick={() =>
                      setMensajes((p) =>
                        p.map((x) =>
                          x.id === m.id ? { ...x, enviado: true } : x
                        )
                      )
                    }
                    style={S.btn('green')}
                  >
                    ✓ Enviado
                  </button>
                )}
                <button
                  onClick={() =>
                    setMensajes((p) => p.filter((x) => x.id !== m.id))
                  }
                  style={S.btn('danger')}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'plantillas' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
          }}
        >
          {PLANTILLAS.map((p) => (
            <div key={p.id} style={S.card}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <div style={{ fontWeight: 800, color: C.text }}>{p.nombre}</div>
                <Badge c={p.canal === 'whatsapp' ? 'green' : 'blue'}>
                  {p.canal}
                </Badge>
              </div>
              <div
                style={{
                  fontSize: 11,
                  background: C.bg,
                  padding: '8px',
                  borderRadius: 7,
                  maxHeight: 80,
                  overflow: 'hidden',
                  color: C.textMuted,
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}
              >
                {p.texto}
              </div>
              <button
                onClick={() => setTab('nuevo')}
                style={{ ...S.btn('ghost'), width: '100%', fontSize: 12 }}
              >
                Usar plantilla →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   CALENDARIO
══════════════════════════════════════════ */
function Calendario({ habitaciones, inquilinos, incidencias, gastos }) {
  const [mes, setMes] = useState(new Date().getMonth());
  const [anio, setAnio] = useState(new Date().getFullYear());
  const MESES = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  const primerDia = new Date(anio, mes, 1).getDay();
  const diasMes = new Date(anio, mes + 1, 0).getDate();
  const offset = primerDia === 0 ? 6 : primerDia - 1;

  function getEvs(dia) {
    const f = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(
      dia
    ).padStart(2, '0')}`;
    const evs = [];
    inquilinos.forEach((i) => {
      if (i.hasta === f) evs.push({ txt: `📅 Fin: ${i.nombre}`, c: C.red });
      if (i.desde === f)
        evs.push({ txt: `🏠 Entrada: ${i.nombre}`, c: C.green });
    });
    incidencias.forEach((i) => {
      if (i.fecha === f)
        evs.push({
          txt: `🔧 ${i.titulo}`,
          c: i.prioridad === 'alta' ? C.red : C.amber,
        });
    });
    gastos.forEach((g) => {
      if (g.fecha === f) evs.push({ txt: `💶 ${g.concepto}`, c: C.blue });
    });
    return evs;
  }

  const hoyFull = new Date();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => {
              if (mes === 0) {
                setMes(11);
                setAnio((a) => a - 1);
              } else setMes((m) => m - 1);
            }}
            style={S.btn('ghost')}
          >
            ◀
          </button>
          <div
            style={{
              fontWeight: 900,
              fontSize: 20,
              minWidth: 200,
              textAlign: 'center',
              color: C.text,
            }}
          >
            {MESES[mes]} {anio}
          </div>
          <button
            onClick={() => {
              if (mes === 11) {
                setMes(0);
                setAnio((a) => a + 1);
              } else setMes((m) => m + 1);
            }}
            style={S.btn('ghost')}
          >
            ▶
          </button>
        </div>
        <button
          onClick={() => {
            setMes(new Date().getMonth());
            setAnio(new Date().getFullYear());
          }}
          style={S.btn('ghost')}
        >
          Hoy
        </button>
      </div>

      <div style={S.card}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 3,
            marginBottom: 6,
          }}
        >
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
            <div
              key={d}
              style={{
                textAlign: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: C.textMuted,
                padding: '4px 0',
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 3,
          }}
        >
          {Array(offset)
            .fill(null)
            .map((_, i) => (
              <div key={`e${i}`} />
            ))}
          {Array.from({ length: diasMes }, (_, i) => i + 1).map((dia) => {
            const evs = getEvs(dia);
            const esHoy =
              dia === hoyFull.getDate() &&
              mes === hoyFull.getMonth() &&
              anio === hoyFull.getFullYear();
            return (
              <div
                key={dia}
                style={{
                  minHeight: 72,
                  border: `1.5px solid ${esHoy ? C.blue : C.border}`,
                  borderRadius: 8,
                  padding: '4px 5px',
                  background: esHoy ? 'rgba(47,129,247,0.08)' : C.bg,
                }}
              >
                <div
                  style={{
                    fontWeight: esHoy ? 900 : 500,
                    fontSize: 12,
                    color: esHoy ? C.blue : C.textMuted,
                    marginBottom: 3,
                  }}
                >
                  {dia}
                </div>
                {evs.slice(0, 3).map((ev, i) => (
                  <div
                    key={i}
                    title={ev.txt}
                    style={{
                      fontSize: 9,
                      padding: '2px 4px',
                      borderRadius: 4,
                      marginBottom: 2,
                      background: `${ev.c}22`,
                      color: ev.c,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {ev.txt}
                  </div>
                ))}
                {evs.length > 3 && (
                  <div style={{ fontSize: 9, color: C.textFaint }}>
                    +{evs.length - 3} más
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   EXPORTACIÓN
══════════════════════════════════════════ */
function Exportacion({
  pisos,
  habitaciones,
  inquilinos,
  gastos,
  incidencias,
  mensajes,
  historico,
}) {
  const [ok, setOk] = useState('');

  function csv(data, nombre) {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const blob = new Blob(
      [
        [
          keys.join(','),
          ...data.map((r) =>
            keys.map((k) => JSON.stringify(r[k] ?? '')).join(',')
          ),
        ].join('\n'),
      ],
      { type: 'text/csv;charset=utf-8;' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${nombre}_${hoy()}.csv`;
    a.click();
    setOk(nombre);
    setTimeout(() => setOk(''), 2000);
  }

  function backup() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            pisos,
            habitaciones,
            inquilinos,
            gastos,
            incidencias,
            mensajes,
            historico,
          },
          null,
          2
        ),
      ],
      { type: 'application/json' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `rentmanager_backup_${hoy()}.json`;
    a.click();
    setOk('Backup completo');
    setTimeout(() => setOk(''), 2000);
  }

  function restaurar(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.pisos) {
          localStorage.setItem('rm_pisos', JSON.stringify(data.pisos));
        }
        if (data.habitaciones) {
          localStorage.setItem('rm_habs', JSON.stringify(data.habitaciones));
        }
        if (data.inquilinos) {
          localStorage.setItem('rm_inqs', JSON.stringify(data.inquilinos));
        }
        if (data.gastos) {
          localStorage.setItem('rm_gastos', JSON.stringify(data.gastos));
        }
        if (data.incidencias) {
          localStorage.setItem('rm_incids', JSON.stringify(data.incidencias));
        }
        if (data.mensajes) {
          localStorage.setItem('rm_msgs', JSON.stringify(data.mensajes));
        }
        if (data.historico) {
          localStorage.setItem('rm_hist', JSON.stringify(data.historico));
        }
        if (data.propietarios) {
          localStorage.setItem('rm_props', JSON.stringify(data.propietarios));
        }
        alert('✅ Backup restaurado. Recarga la página para ver los cambios.');
      } catch {
        alert('❌ Error al restaurar el backup.');
      }
    };
    reader.readAsText(file);
  }

  const cobrado = habitaciones.reduce((s, h) => {
    const i = inquilinos.find((x) => x.habitacionId === h.id);
    return s + (i && i.pagado ? h.precio : 0);
  }, 0);
  const totalG = gastos.reduce((s, g) => s + g.importe, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {ok && (
        <div
          style={{
            background: 'rgba(63,185,80,0.1)',
            border: '1px solid rgba(63,185,80,0.4)',
            borderRadius: 10,
            padding: '12px 16px',
            color: C.green,
            fontWeight: 700,
          }}
        >
          ✅ {ok} exportado correctamente
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Resumen */}
        <div style={S.card}>
          <div style={{ fontWeight: 800, marginBottom: 14, color: C.text }}>
            📊 Resumen ejecutivo
          </div>
          {[
            ['Pisos', pisos.length],
            ['Habitaciones totales', habitaciones.length],
            ['Inquilinos activos', inquilinos.length],
            ['Habitaciones libres', habitaciones.length - inquilinos.length],
            [
              'Ingresos posibles',
              fEur(
                habitaciones.reduce((s, h) => {
                  const i = inquilinos.find((x) => x.habitacionId === h.id);
                  return s + (i ? h.precio : 0);
                }, 0)
              ),
            ],
            ['Cobrado este mes', fEur(cobrado)],
            ['Total gastos', fEur(totalG)],
            ['Beneficio neto', fEur(cobrado - totalG)],
            ['Proyección anual', fEur((cobrado - totalG) * 12)],
          ].map(([l, v]) => (
            <div
              key={l}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <span style={{ color: C.textMuted, fontSize: 13 }}>{l}</span>
              <span style={{ fontWeight: 800, color: C.text }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Exportar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontWeight: 800, marginBottom: 4, color: C.text }}>
            📤 Exportar datos
          </div>
          {[
            [
              '🏠 Pisos CSV',
              () =>
                csv(
                  pisos.map((p) => ({
                    Nombre: p.nombre,
                    Direccion: p.direccion,
                    AlquilerTotal: p.alquilerTotal,
                    Notas: p.notas,
                  })),
                  'pisos'
                ),
            ],
            [
              '🛏 Habitaciones CSV',
              () =>
                csv(
                  habitaciones.map((h) => ({
                    Habitacion: h.nombre,
                    Piso: pisos.find((p) => p.id === h.pisoId)?.nombre || '',
                    Planta: h.planta,
                    M2: h.m2,
                    Precio: h.precio,
                  })),
                  'habitaciones'
                ),
            ],
            [
              '👤 Inquilinos CSV',
              () =>
                csv(
                  inquilinos.map((i) => ({
                    Nombre: i.nombre,
                    DNI: i.dni || '',
                    Telefono: i.telefono,
                    Email: i.email,
                    Desde: i.desde,
                    Hasta: i.hasta,
                    Deposito: i.deposito,
                    Pagado: i.pagado ? 'Sí' : 'No',
                  })),
                  'inquilinos'
                ),
            ],
            [
              '💶 Gastos CSV',
              () =>
                csv(
                  gastos.map((g) => ({
                    Concepto: g.concepto,
                    Importe: g.importe,
                    Fecha: g.fecha,
                    Tipo: g.tipo,
                    Piso:
                      pisos.find((p) => p.id === g.pisoId)?.nombre || 'General',
                  })),
                  'gastos'
                ),
            ],
            [
              '🔧 Incidencias CSV',
              () =>
                csv(
                  incidencias.map((i) => ({
                    Titulo: i.titulo,
                    Piso: pisos.find((p) => p.id === i.pisoId)?.nombre || '',
                    Prioridad: i.prioridad,
                    Estado: i.estado,
                    Fecha: i.fecha,
                  })),
                  'incidencias'
                ),
            ],
            ['💾 Backup completo JSON', backup],
          ].map(([l, fn]) => (
            <button
              key={l}
              onClick={fn}
              style={{
                ...S.btn(l.includes('JSON') ? 'blue' : 'ghost'),
                textAlign: 'left',
                padding: '12px 16px',
                fontSize: 13,
              }}
            >
              {l}
            </button>
          ))}

          <div
            style={{
              marginTop: 8,
              padding: '14px 16px',
              background: C.bg,
              borderRadius: 10,
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: C.text,
                marginBottom: 8,
              }}
            >
              📥 Restaurar backup
            </div>
            <input
              type="file"
              accept=".json"
              onChange={restaurar}
              style={{ fontSize: 12, color: C.textMuted }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   APP PRINCIPAL
══════════════════════════════════════════ */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [pisos, setPisos] = useState(PISOS_INIT);
  const [habitaciones, setHabitaciones] = useState(HABITACIONES_INIT);
  const [inquilinos, setInquilinos] = useState(INQUILINOS_INIT);
  const [propietarios, setPropietarios] = useState(PROPIETARIOS_INIT);
  const [gastos, setGastos] = useState(GASTOS_INIT);
  const [incidencias, setIncidencias] = useState(INCIDENCIAS_INIT);
  const [mensajes, setMensajes] = useState(MENSAJES_INIT);
  const [historico, setHistorico] = useState(HISTORICO_INIT);

  // Cargar desde localStorage al inicio
  useEffect(() => {
    setPisos(cargar('rm_pisos', PISOS_INIT));
    setHabitaciones(cargar('rm_habs', HABITACIONES_INIT));
    setInquilinos(cargar('rm_inqs', INQUILINOS_INIT));
    setPropietarios(cargar('rm_props', PROPIETARIOS_INIT));
    setGastos(cargar('rm_gastos', GASTOS_INIT));
    setIncidencias(cargar('rm_incids', INCIDENCIAS_INIT));
    setMensajes(cargar('rm_msgs', MENSAJES_INIT));
    setHistorico(cargar('rm_hist', HISTORICO_INIT));
    setLoaded(true);
  }, []);

  // Guardar en localStorage cuando cambia el estado
  useEffect(() => {
    if (loaded) guardar('rm_pisos', pisos);
  }, [pisos, loaded]);
  useEffect(() => {
    if (loaded) guardar('rm_habs', habitaciones);
  }, [habitaciones, loaded]);
  useEffect(() => {
    if (loaded) guardar('rm_inqs', inquilinos);
  }, [inquilinos, loaded]);
  useEffect(() => {
    if (loaded) guardar('rm_props', propietarios);
  }, [propietarios, loaded]);
  useEffect(() => {
    if (loaded) guardar('rm_gastos', gastos);
  }, [gastos, loaded]);
  useEffect(() => {
    if (loaded) guardar('rm_incids', incidencias);
  }, [incidencias, loaded]);
  useEffect(() => {
    if (loaded) guardar('rm_msgs', mensajes);
  }, [mensajes, loaded]);
  useEffect(() => {
    if (loaded) guardar('rm_hist', historico);
  }, [historico, loaded]);

  if (!loaded)
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: C.bg,
        }}
      >
        <div style={{ textAlign: 'center', color: C.text }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🏢</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            Cargando RentManager PRO...
          </div>
        </div>
      </div>
    );

  const pendPago = inquilinos.filter((i) => !i.pagado).length;
  const incUrg = incidencias.filter(
    (i) => i.estado !== 'resuelta' && i.prioridad === 'alta'
  ).length;
  const mensajesPend = mensajes.filter((m) => !m.enviado).length;

  const TITLES = {
    dashboard: 'Dashboard',
    pisos: 'Pisos e Inquilinos',
    propietarios: 'Propietarios',
    finanzas: 'Finanzas',
    calendario: 'Calendario',
    incidencias: 'Incidencias',
    comunicaciones: 'Comunicaciones',
    exportacion: 'Exportar',
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: C.bg,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        color: C.text,
      }}
    >
      <Sidebar
        tab={tab}
        setTab={setTab}
        pendPago={pendPago}
        incUrg={incUrg}
        mensajesPend={mensajesPend}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        {/* Topbar */}
        <div
          style={{
            background: C.surface,
            borderBottom: `1px solid ${C.border}`,
            padding: '14px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>
            {TITLES[tab]}
          </div>
          <div style={{ fontSize: 12, color: C.textMuted }}>
            💾 Datos guardados automáticamente
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px', flex: 1 }}>
          {tab === 'dashboard' && (
            <Dashboard
              pisos={pisos}
              habitaciones={habitaciones}
              inquilinos={inquilinos}
              gastos={gastos}
              incidencias={incidencias}
            />
          )}
          {tab === 'pisos' && (
            <PisosInquilinos
              pisos={pisos}
              setPisos={setPisos}
              habitaciones={habitaciones}
              setHabitaciones={setHabitaciones}
              inquilinos={inquilinos}
              setInquilinos={setInquilinos}
              propietarios={propietarios}
              setHistorico={setHistorico}
            />
          )}
          {tab === 'propietarios' && (
            <Propietarios
              propietarios={propietarios}
              setPropietarios={setPropietarios}
              pisos={pisos}
            />
          )}
          {tab === 'finanzas' && (
            <Finanzas
              pisos={pisos}
              habitaciones={habitaciones}
              inquilinos={inquilinos}
              gastos={gastos}
              setGastos={setGastos}
            />
          )}
          {tab === 'calendario' && (
            <Calendario
              pisos={pisos}
              habitaciones={habitaciones}
              inquilinos={inquilinos}
              incidencias={incidencias}
              gastos={gastos}
            />
          )}
          {tab === 'incidencias' && (
            <Incidencias
              incidencias={incidencias}
              setIncidencias={setIncidencias}
              pisos={pisos}
              habitaciones={habitaciones}
              inquilinos={inquilinos}
            />
          )}
          {tab === 'comunicaciones' && (
            <Comunicaciones
              inquilinos={inquilinos}
              habitaciones={habitaciones}
              pisos={pisos}
              mensajes={mensajes}
              setMensajes={setMensajes}
            />
          )}
          {tab === 'exportacion' && (
            <Exportacion
              pisos={pisos}
              habitaciones={habitaciones}
              inquilinos={inquilinos}
              gastos={gastos}
              incidencias={incidencias}
              mensajes={mensajes}
              historico={historico}
            />
          )}
        </div>
      </div>
    </div>
  );
}

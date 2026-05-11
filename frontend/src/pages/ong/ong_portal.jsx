import { useState, useEffect, useRef, createContext, useContext, ReactNode } from "react";
import { login, logout, register } from '../../services/api';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM — Kindly Portal da ONG
// ═══════════════════════════════════════════════════════════════════════════════
// Paleta e CSS idênticos ao app do voluntário para consistência de marca.
// Design: Portal Profissional com Gamificação Sutil
// Fonte: Syne 800 para headings, DM Sans 300/400/500 para corpo
// Layout: Top nav fixo + sidebar colapsável + conteúdo em grid responsivo

const G = {
  emerald: "#00C896",
  emeraldDark: "#009E78",
  emeraldLight: "#D0F5EB",
  navy: "#0D1F2D",
  navyMid: "#152636",
  slate: "#4A6275",
  silver: "#E8F0F5",
  white: "#FFFFFF",
  amber: "#FFB547",
  coral: "#FF5F5F",
  purple: "#7B61FF",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: ${G.navy};
    color: ${G.white};
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${G.navyMid}; }
  ::-webkit-scrollbar-thumb { background: ${G.emerald}; border-radius: 2px; }

  .syne { font-family: 'Syne', sans-serif; }

  /* ── Noise overlay ── */
  .noise::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 9999;
  }

  /* ── Glow blobs ── */
  .blob {
    position: fixed; border-radius: 50%;
    filter: blur(80px); opacity: 0.15; pointer-events: none; z-index: 0;
  }

  /* ── Card ── */
  .card {
    background: ${G.navyMid};
    border: 1px solid rgba(0,200,150,.12);
    border-radius: 16px;
    transition: border-color .2s, transform .2s, box-shadow .2s;
  }
  .card:hover { border-color: rgba(0,200,150,.35); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,200,150,.08); }
  .card-static { background: ${G.navyMid}; border: 1px solid rgba(0,200,150,.12); border-radius: 16px; }

  /* ── Buttons ── */
  .btn-primary {
    background: ${G.emerald};
    color: ${G.navy};
    border: none;
    border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    padding: 12px 28px;
    cursor: pointer;
    transition: background .2s, transform .15s, box-shadow .2s;
    letter-spacing: .02em;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-primary:hover { background: ${G.emeraldDark}; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,200,150,.3); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }

  .btn-ghost {
    background: transparent;
    color: ${G.emerald};
    border: 1.5px solid ${G.emerald};
    border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    padding: 11px 24px;
    cursor: pointer;
    transition: background .2s, transform .15s;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-ghost:hover { background: rgba(0,200,150,.08); transform: translateY(-1px); }

  .btn-danger {
    background: ${G.coral};
    color: ${G.white};
    border: none;
    border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    padding: 12px 28px;
    cursor: pointer;
    transition: background .2s, transform .15s;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-danger:hover { background: #e04444; transform: translateY(-1px); }

  .btn-sm {
    padding: 8px 16px;
    font-size: 13px;
    border-radius: 8px;
  }

  /* ── Input ── */
  .input {
    background: rgba(255,255,255,.04);
    border: 1.5px solid rgba(255,255,255,.1);
    border-radius: 10px;
    color: ${G.white};
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    padding: 12px 16px;
    width: 100%;
    transition: border-color .2s, background .2s;
    outline: none;
  }
  .input:focus { border-color: ${G.emerald}; background: rgba(0,200,150,.04); }
  .input::placeholder { color: ${G.slate}; }
  .input option { background: ${G.navyMid}; }
  textarea.input { resize: vertical; min-height: 100px; }

  /* ── Label ── */
  .label {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: ${G.slate};
    margin-bottom: 6px;
    display: block;
  }

  /* ── Badge ── */
  .badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: .04em;
  }
  .badge-green { background: rgba(0,200,150,.15); color: ${G.emerald}; }
  .badge-amber { background: rgba(255,181,71,.15); color: ${G.amber}; }
  .badge-purple { background: rgba(123,97,255,.15); color: ${G.purple}; }
  .badge-coral { background: rgba(255,95,95,.15); color: ${G.coral}; }
  .badge-slate { background: rgba(74,98,117,.2); color: ${G.slate}; }

  /* ── Top Nav ── */
  .top-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(13,31,45,.9);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,200,150,.1);
    height: 60px;
    display: flex; align-items: center; padding: 0 24px; gap: 16px;
  }

  /* ── Sidebar ── */
  .sidebar {
    position: fixed; top: 60px; left: 0; bottom: 0; z-index: 90;
    width: 220px;
    background: rgba(13,31,45,.95);
    backdrop-filter: blur(16px);
    border-right: 1px solid rgba(0,200,150,.1);
    display: flex; flex-direction: column;
    padding: 20px 0;
    transition: transform .3s ease;
  }
  .sidebar.collapsed { transform: translateX(-220px); }

  .sidebar-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 20px;
    cursor: pointer;
    color: ${G.slate};
    outline: none;
    border: none;
    font-size: 14px; font-weight: 500;
    border-left: 3px solid transparent;
    transition: color .2s, background .2s, border-color .2s;
    text-decoration: none;
    background: transparent;
  }
  .sidebar-item:hover { color: ${G.white}; background: rgba(0,200,150,.12); }
  .sidebar-item.active { color: ${G.emerald}; background: rgba(0,200,150,.15); border-left-color: ${G.emerald}; }

  /* ── Main content ── */
  .main-content {
    margin-top: 60px;
    margin-left: 220px;
    padding: 32px;
    min-height: calc(100vh - 60px);
    transition: margin-left .3s ease;
  }
  .main-content.full { margin-left: 0; }

  /* ── Progress bar ── */
  .progress-bar {
    height: 6px; border-radius: 3px;
    background: rgba(255,255,255,.08);
    overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, ${G.emerald}, ${G.emeraldDark});
    transition: width .6s ease;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes flicker {
    0%,100% { transform: scaleY(1) rotate(-2deg); }
    50% { transform: scaleY(1.08) rotate(2deg); }
  }
  .fade-up  { animation: fadeUp .45s ease both; }
  .fade-in  { animation: fadeIn .4s ease both; }
  .flame { display: inline-block; animation: flicker 1.2s ease-in-out infinite; }

  /* ── Modal overlay ── */
  .modal-bg {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(13,31,45,.75);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: fadeIn .2s ease;
  }
  .modal-box {
    background: ${G.navyMid};
    border: 1px solid rgba(0,200,150,.18);
    border-radius: 20px;
    padding: 32px;
    width: 100%; max-width: 520px;
    animation: fadeUp .3s ease;
    max-height: 90vh;
    overflow-y: auto;
  }

  /* ── Checkbox ── */
  input[type=checkbox] { accent-color: ${G.emerald}; width: 16px; height: 16px; cursor: pointer; }

  /* ── Radio card ── */
  .radio-card {
    border: 1.5px solid rgba(255,255,255,.1);
    border-radius: 12px; padding: 14px 16px;
    cursor: pointer; transition: border-color .2s, background .2s;
    display: flex; align-items: flex-start; gap: 12px;
  }
  .radio-card.selected { border-color: ${G.emerald}; background: rgba(0,200,150,.06); }
  .radio-card:hover { border-color: rgba(0,200,150,.4); }

  /* ── Toast ── */
  @keyframes slideIn { from { transform: translateX(120%); } to { transform: translateX(0); } }
  .toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 500;
    background: ${G.navyMid};
    border: 1px solid ${G.emerald};
    border-radius: 12px;
    padding: 14px 20px;
    display: flex; align-items: center; gap: 10px;
    font-size: 14px; font-weight: 500;
    animation: slideIn .3s ease;
    box-shadow: 0 4px 24px rgba(0,200,150,.2);
    max-width: 320px;
  }

  /* ── Table ── */
  .table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid rgba(0,200,150,.1); }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: rgba(0,200,150,.06); }
  th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: ${G.slate}; }
  td { padding: 14px 16px; font-size: 14px; border-top: 1px solid rgba(255,255,255,.04); }
  tr:hover td { background: rgba(0,200,150,.03); }

  /* ── Stat card ── */
  .stat-card {
    background: ${G.navyMid};
    border: 1px solid rgba(0,200,150,.12);
    border-radius: 16px;
    padding: 20px 24px;
  }

  /* ── Form group ── */
  .form-group { margin-bottom: 18px; }

  /* ── Divider ── */
  .divider { height: 1px; background: rgba(255,255,255,.06); margin: 24px 0; }

  /* ── Empty state ── */
  .empty-state {
    text-align: center;
    padding: 48px 24px;
    color: ${G.slate};
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-220px); }
    .sidebar.mobile-open { transform: translateX(0); }
    .main-content { margin-left: 0; padding: 20px 16px; }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════════

const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const paths = {
    home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    search: "M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    check: "M20 6L9 17l-5-5",
    map: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
    clock: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2",
    calendar: "M3 9h18M16 3v4M8 3v4M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z",
    gift: "M20 12v10H4V12 M22 7H2v5h20V7z M12 22V7 M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z",
    arrow: "M19 12H5 M12 19l-7-7 7-7",
    bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
    logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
    plus: "M12 5v14M5 12h14",
    x: "M18 6L6 18M6 6l12 12",
    chevron: "M9 18l6-6-6-6",
    "chevron-down": "M6 9l6 6 6-6",
    "chevron-left": "M15 18l-6-6 6-6",
    edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    trash: "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12a3 3 0 100-6 3 3 0 000 6z",
    "eye-off": "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94 M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19 M1 1l22 22",
    building: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10 M3 9h18",
    users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75 M9 11a4 4 0 100-8 4 4 0 000 8z",
    "bar-chart": "M18 20V10 M12 20V4 M6 20v-6",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    menu: "M3 12h18 M3 6h18 M3 18h18",
    "check-circle": "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3",
    "alert-circle": "M12 22a10 10 0 100-20 10 10 0 000 20z M12 8v4 M12 16h.01",
    "file-text": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
    download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
    filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    "more-vertical": "M12 5h.01 M12 12h.01 M12 19h.01",
    trophy: "M6 9H3V4h18v5h-3 M12 16v5m-4 0h8 M12 16a7 7 0 100-14 7 7 0 000 14z",
    location: "M12 22s-8-9-8-14a8 8 0 1116 0c0 5-8 14-8 14z M12 12a2 2 0 100-4 2 2 0 000 4z",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
    phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
    globe: "M12 22a10 10 0 100-20 10 10 0 000 20z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
    "external-link": "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6 M15 3h6v6 M10 14L21 3",
  };
  const d = paths[name] || paths["x"];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      {d.split(" M").map((seg, i) => (
        <path key={i} d={i === 0 ? seg : "M" + seg} />
      ))}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

const MOCK_ONG = {
  id: 1,
  name: "Mão Amiga ONG",
  cnpj: "12.345.678/0001-90",
  email: "contato@maoamiga.org.br",
  phone: "(11) 98765-4321",
  website: "https://maoamiga.org.br",
  city: "São Paulo",
  state: "SP",
  category: "Social",
  desc: "Trabalhamos para garantir alimentação e dignidade para famílias em situação de vulnerabilidade social no centro de São Paulo.",
  founded: "2015",
  volunteers: 248,
  hoursImpacted: 3840,
  actionsCompleted: 127,
};

const MOCK_OPPORTUNITIES = [
  {
    id: 1,
    title: "Distribuição de Refeições",
    category: "Social",
    date: "12 Mai",
    time: "08h–12h",
    location: "Centro, SP",
    hours: 4,
    spots: 12,
    filled: 9,
    badge: "amber",
    desc: "Participe da distribuição de marmitas para pessoas em situação de rua. Importante e urgente! Venha com roupa confortável.",
    skills: ["Trabalho em equipe", "Empatia", "Pontualidade"],
    status: "active",
  },
  {
    id: 2,
    title: "Tutoria em Matemática",
    category: "Educação",
    date: "15 Mai",
    time: "14h–16h",
    location: "Pinheiros, SP",
    hours: 2,
    spots: 8,
    filled: 3,
    badge: "green",
    desc: "Ajude crianças e adolescentes em situação de vulnerabilidade a superarem dificuldades em matemática.",
    skills: ["Paciência", "Matemática", "Comunicação"],
    status: "active",
  },
  {
    id: 3,
    title: "Oficina de Artesanato",
    category: "Cultura",
    date: "20 Mai",
    time: "10h–13h",
    location: "Vila Madalena, SP",
    hours: 3,
    spots: 15,
    filled: 15,
    badge: "purple",
    desc: "Oficina de artesanato para idosos em asilo parceiro. Traga criatividade e boa vontade!",
    skills: ["Criatividade", "Paciência", "Empatia"],
    status: "closed",
  },
  {
    id: 4,
    title: "Mutirão de Limpeza",
    category: "Meio Ambiente",
    date: "25 Mai",
    time: "07h–10h",
    location: "Parque Estadual, SP",
    hours: 3,
    spots: 20,
    filled: 5,
    badge: "green",
    desc: "Mutirão de limpeza do parque estadual. Traga protetor solar e luvas (fornecemos sacos e ferramentas).",
    skills: ["Consciência ambiental", "Trabalho em equipe"],
    status: "draft",
  },
];

const MOCK_ENROLLEES = [
  { id: 1, opportunityId: 1, name: "Maria Silva", email: "maria@email.com", phone: "(11) 99999-1111", city: "São Paulo", enrolledAt: "2 Mai", status: "confirmed", checkedIn: true },
  { id: 2, opportunityId: 1, name: "João Santos", email: "joao@email.com", phone: "(11) 99999-2222", city: "São Paulo", enrolledAt: "3 Mai", status: "confirmed", checkedIn: false },
  { id: 3, opportunityId: 1, name: "Ana Oliveira", email: "ana@email.com", phone: "(11) 99999-3333", city: "Guarulhos", enrolledAt: "4 Mai", status: "pending", checkedIn: false },
  { id: 4, opportunityId: 1, name: "Carlos Pereira", email: "carlos@email.com", phone: "(11) 99999-4444", city: "São Paulo", enrolledAt: "4 Mai", status: "confirmed", checkedIn: true },
  { id: 5, opportunityId: 1, name: "Fernanda Costa", email: "fernanda@email.com", phone: "(11) 99999-5555", city: "Santo André", enrolledAt: "5 Mai", status: "cancelled", checkedIn: false },
  { id: 6, opportunityId: 2, name: "Lucas Mendes", email: "lucas@email.com", phone: "(11) 99999-6666", city: "São Paulo", enrolledAt: "3 Mai", status: "confirmed", checkedIn: false },
  { id: 7, opportunityId: 2, name: "Beatriz Lima", email: "beatriz@email.com", phone: "(11) 99999-7777", city: "São Paulo", enrolledAt: "5 Mai", status: "confirmed", checkedIn: false },
  { id: 8, opportunityId: 2, name: "Rafael Souza", email: "rafael@email.com", phone: "(11) 99999-8888", city: "Osasco", enrolledAt: "6 Mai", status: "pending", checkedIn: false },
];

const CATEGORIES = ["Social", "Educação", "Saúde", "Meio Ambiente", "Cultura", "Esporte", "Tecnologia", "Outro"];
const STATES = ["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "PE", "CE", "GO", "DF"];

const BADGE_MAP = {
  "Social": "amber",
  "Educação": "green",
  "Saúde": "purple",
  "Meio Ambiente": "green",
  "Cultura": "purple",
  "Esporte": "amber",
  "Tecnologia": "green",
  "Outro": "amber",
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT & HOOKS (ATUALIZADO)
// ═══════════════════════════════════════════════════════════════════════════════

const OngContext = createContext(null);

function OngProvider({ children }) {
  const [screen, setScreen] = useState("login");
  const [ong, setOng] = useState(MOCK_ONG);
  const [opportunities, setOpportunities] = useState(MOCK_OPPORTUNITIES);
  const [enrollees] = useState(MOCK_ENROLLEES);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true); // ← NOVO

  const showToast = (msg, icon = "✅") => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 3200);
  };

  // ← NOVO: Verificar autenticação ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        setScreen("portal");
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const addOpportunity = (op) => {
    const newOp = { ...op, id: Date.now(), filled: 0 };
    setOpportunities(prev => [newOp, ...prev]);
  };

  const updateOpportunity = (op) => {
    setOpportunities(prev => prev.map(o => o.id === op.id ? op : o));
  };

  const deleteOpportunity = (id) => {
    setOpportunities(prev => prev.filter(o => o.id !== id));
  };

  return (
    <OngContext.Provider value={{
      screen, setScreen, ong, setOng, opportunities, addOpportunity, updateOpportunity, deleteOpportunity,
      enrollees, toast, showToast, activeTab, setActiveTab, loading,
    }}>
      {children}
    </OngContext.Provider>
  );
}

function useOng() {
  const ctx = useContext(OngContext);
  if (!ctx) throw new Error("useOng must be used within OngProvider");
  return ctx;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN (ATUALIZADO COM API)
// ═══════════════════════════════════════════════════════════════════════════════

const LoginScreen = () => {
  const { setScreen, showToast } = useOng();
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false); // ← NOVO

  // ← ATUALIZADO: Agora chama a API
  const handleLogin = async (e) => {
    e?.preventDefault();
    
    if (!usuario || !pass) {
      showToast("Preencha todos os campos", "⚠️");
      return;
    }

    setLoading(true);
    try {
      const result = await login(usuario, pass);
      console.log("Login bem-sucedido:", result);
      showToast("Login realizado com sucesso! 🎉", "✅");
      setScreen("portal");
    } catch (error) {
      showToast(`Erro: ${error.message}`, "❌");
      console.error("Erro no login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: "center", padding: 24, position: "relative", overflow: "hidden",
    }}>
      <Blobs />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }} className="fade-up">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: `linear-gradient(135deg, ${G.emerald}, ${G.emeraldDark})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", boxShadow: `0 8px 32px rgba(0,200,150,.35)`,
          }}>
            <span style={{ fontSize: 28 }}>🌱</span>
          </div>
          <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.02em" }}>Kindly</h1>
          <p style={{ color: G.slate, fontSize: 14, marginTop: 6 }}>Portal da ONG — Plataforma de voluntariado gamificada</p>
        </div>

        <div className="card-static" style={{ padding: 28 }}>
          <h2 className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Entrar na sua ONG</h2>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="label">Usuário</label>
              <input 
                className="input" 
                type="text" 
                placeholder="seu_usuario" 
                value={usuario} 
                onChange={e => setUsuario(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="label">Senha</label>
              <div style={{ position: "relative" }}>
                <input 
                  className="input" 
                  type={showPass ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={pass} 
                  onChange={e => setPass(e.target.value)}
                  disabled={loading}
                  style={{ paddingRight: 44 }} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(s => !s)} 
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: G.slate, display: "flex", alignItems: "center" }}
                >
                  <Icon name={showPass ? "eye-off" : "eye"} size={16} color={G.slate} />
                </button>
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: "100%", fontSize: 15, opacity: loading ? 0.5 : 1 }} 
              disabled={loading}
            >
              <Icon name="building" size={16} color={G.navy} />
              {loading ? "Entrando..." : "Acessar Portal"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: G.slate }}>
            Ainda não tem cadastro? <span style={{ color: G.emerald, cursor: "pointer", fontWeight: 600 }} onClick={() => setScreen("register")}>Cadastrar ONG</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 24 }}>
          {[["580", "ONGs cadastradas"], ["12.4k", "Voluntários ativos"], ["84k h", "Horas doadas"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div className="syne" style={{ fontSize: 18, fontWeight: 700, color: G.emerald }}>{n}</div>
              <div style={{ fontSize: 11, color: G.slate, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {toast && <Toast msg={toast.msg} icon={toast.icon} onDone={() => {}} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTER SCREEN (ATUALIZADO COM API)
// ═══════════════════════════════════════════════════════════════════════════════

const RegisterScreen = () => {
  const { setScreen, showToast } = useOng();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false); // ← NOVO
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    usuario: "",
    senha: "",
    senhaConfirm: "",
    terms: false,
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ← ATUALIZADO: Agora chama a API
  const handleDone = async () => {
    if (!form.nome || !form.cpf || !form.usuario || !form.senha) {
      showToast("Preencha todos os campos", "⚠️");
      return;
    }

    if (form.senha !== form.senhaConfirm) {
      showToast("Senhas não conferem", "❌");
      return;
    }

    if (!form.terms) {
      showToast("Aceite os termos de uso", "⚠️");
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        nome: form.nome,
        cpf: form.cpf,
        usuario: form.usuario,
        senha: form.senha,
        motor: "C", // Padrão
      });
      console.log("Registro bem-sucedido:", result);
      showToast("ONG cadastrada com sucesso! Bem-vinda ao Kindly 🎉", "🌱");
      setScreen("portal");
    } catch (error) {
      showToast(`Erro: ${error.message}`, "❌");
      console.error("Erro no registro:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    <div key="0" className="fade-up">
      <h2 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Dados Pessoais 👤</h2>
      <p style={{ color: G.slate, fontSize: 14, marginBottom: 24 }}>Informações do responsável pela ONG.</p>
      <div className="form-group">
        <label className="label">Nome Completo</label>
        <input className="input" type="text" placeholder="João Silva" value={form.nome} onChange={e => upd("nome", e.target.value)} disabled={loading} />
      </div>
      <div className="form-group">
        <label className="label">CPF</label>
        <input className="input" type="text" placeholder="123.456.789-00" value={form.cpf} onChange={e => upd("cpf", e.target.value)} disabled={loading} />
      </div>
    </div>,

    <div key="1" className="fade-up">
      <h2 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Acesso 🔐</h2>
      <p style={{ color: G.slate, fontSize: 14, marginBottom: 24 }}>Crie suas credenciais de acesso.</p>
      <div className="form-group">
        <label className="label">Usuário</label>
        <input className="input" type="text" placeholder="seu_usuario" value={form.usuario} onChange={e => upd("usuario", e.target.value)} disabled={loading} />
      </div>
      <div className="form-group">
        <label className="label">Senha</label>
        <input className="input" type="password" placeholder="••••••••" value={form.senha} onChange={e => upd("senha", e.target.value)} disabled={loading} />
      </div>
      <div className="form-group">
        <label className="label">Confirmar Senha</label>
        <input className="input" type="password" placeholder="••••••••" value={form.senhaConfirm} onChange={e => upd("senhaConfirm", e.target.value)} disabled={loading} />
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 8 }}>
        <input type="checkbox" id="terms" checked={form.terms} onChange={e => upd("terms", e.target.checked)} disabled={loading} />
        <label htmlFor="terms" style={{ fontSize: 13, color: G.slate, lineHeight: 1.5, cursor: "pointer" }}>
          Concordo com os <span style={{ color: G.emerald }}>Termos de Uso</span> e <span style={{ color: G.emerald }}>Política de Privacidade</span>
        </label>
      </div>
    </div>,
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <Blobs />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, width: "100%", margin: "0 auto", padding: "80px 24px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <button 
            onClick={() => step === 0 ? setScreen("login") : setStep(s => s - 1)} 
            style={{ background: "none", border: "none", color: G.white, cursor: "pointer", padding: 4 }}
            disabled={loading}
          >
            <Icon name="arrow" size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((step + 1) / 2) * 100}%` }} />
            </div>
          </div>
          <span style={{ fontSize: 12, color: G.slate, fontWeight: 600 }}>{step + 1}/2</span>
        </div>

        <div className="card-static" style={{ padding: 28 }}>
          {steps[step]}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          {step > 0 && <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)} disabled={loading}>Voltar</button>}
          <button 
            className="btn-primary" 
            style={{ flex: 2, opacity: loading ? 0.5 : 1 }} 
            onClick={() => step < 1 ? setStep(s => s + 1) : handleDone()}
            disabled={loading}
          >
            {loading ? "Cadastrando..." : step < 1 ? "Continuar" : "Cadastrar ONG"}
          </button>
        </div>

        {step === 0 && (
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: G.slate }}>
            Já tem cadastro? <span style={{ color: G.emerald, cursor: "pointer", fontWeight: 600 }} onClick={() => setScreen("login")}>Entrar</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PORTAL SHELL (COM LOGOUT ATUALIZADO)
// ═══════════════════════════════════════════════════════════════════════════════

const PortalShell = ({ children }) => {
  const { setScreen, showToast } = useOng();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false); // ← NOVO

  // ← ATUALIZADO: Agora chama a API
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      showToast("Logout realizado com sucesso! 👋", "✅");
      setScreen("login");
    } catch (error) {
      showToast(`Erro: ${error.message}`, "❌");
      console.error("Erro no logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* TopNav */}
      <div className="top-nav">
        <button onClick={() => setSidebarOpen(s => !s)} style={{ background: "none", border: "none", color: G.white, cursor: "pointer", display: "flex", alignItems: "center" }}>
          <Icon name="menu" size={20} />
        </button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
          <span className="syne" style={{ fontSize: 16, fontWeight: 800, color: G.emerald }}>Kindly</span>
        </div>
        <button 
          onClick={handleLogout} 
          style={{ background: "none", border: "none", color: G.slate, cursor: "pointer", display: "flex", alignItems: "center", opacity: loading ? 0.5 : 1 }}
          disabled={loading}
        >
          <Icon name="logout" size={18} />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${!sidebarOpen ? "collapsed" : ""}`}>
        {/* Sidebar items */}
      </div>

      {/* Main content */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  return (
    <OngProvider>
      <style>{css}</style>
      <div className="noise" />
      <AppContent />
    </OngProvider>
  );
}

function AppContent() {
  const { screen, loading } = useOng();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: G.navy }}>
        <div style={{ textAlign: "center" }}>
          <div className="syne" style={{ fontSize: 24, fontWeight: 800, color: G.emerald }}>Kindly</div>
          <p style={{ color: G.slate, marginTop: 8 }}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (screen === "login") return <LoginScreen />;
  if (screen === "register") return <RegisterScreen />;
  
  return (
    <PortalShell>
      {/* Adicione aqui as outras telas (Dashboard, Oportunidades, etc) */}
      <div style={{ textAlign: "center", padding: 40 }}>
        <h1 className="syne" style={{ fontSize: 32, fontWeight: 800, color: G.emerald }}>Portal da ONG</h1>
        <p style={{ color: G.slate, marginTop: 8 }}>Bem-vindo! Integração com API ativada ✅</p>
      </div>
    </PortalShell>
  );
}

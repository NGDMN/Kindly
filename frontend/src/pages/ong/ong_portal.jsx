import { useState, useEffect, createContext, useContext, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix do ícone padrão do Leaflet que quebra com bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
import { login, registrar, logout, listarOportunidades, listarCategorias, listarMinhasOngs, listarInscricoesDaOportunidade, criarOportunidade, atualizarOportunidade, atualizarOng, } from "../../services/api";
import { salvarOngAtiva, getOngAtiva, limparOngAtiva } from "../../services/auth";

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
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
  body { font-family: 'DM Sans', sans-serif; background: ${G.navy}; color: ${G.white}; min-height: 100vh; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${G.navyMid}; }
  ::-webkit-scrollbar-thumb { background: ${G.emerald}; border-radius: 2px; }
  .syne { font-family: 'Syne', sans-serif; }
  .noise::before { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E"); pointer-events: none; z-index: 9999; }
  .blob { position: fixed; border-radius: 50%; filter: blur(80px); opacity: 0.15; pointer-events: none; z-index: 0; }
  .card { background: ${G.navyMid}; border: 1px solid rgba(0,200,150,.12); border-radius: 16px; transition: border-color .2s, transform .2s, box-shadow .2s; }
  .card:hover { border-color: rgba(0,200,150,.35); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,200,150,.08); }
  .card-static { background: ${G.navyMid}; border: 1px solid rgba(0,200,150,.12); border-radius: 16px; }
  .btn-primary { background: ${G.emerald}; color: ${G.navy}; border: none; border-radius: 10px; font-family: 'Syne', sans-serif; font-weight: 700; padding: 12px 28px; cursor: pointer; transition: background .2s, transform .15s, box-shadow .2s; letter-spacing: .02em; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
  .btn-primary:hover { background: ${G.emeraldDark}; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,200,150,.3); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
  .btn-ghost { background: transparent; color: ${G.emerald}; border: 1.5px solid ${G.emerald}; border-radius: 10px; font-family: 'Syne', sans-serif; font-weight: 600; padding: 11px 24px; cursor: pointer; transition: background .2s, transform .15s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
  .btn-ghost:hover { background: rgba(0,200,150,.08); transform: translateY(-1px); }
  .btn-danger { background: ${G.coral}; color: ${G.white}; border: none; border-radius: 10px; font-family: 'Syne', sans-serif; font-weight: 700; padding: 12px 28px; cursor: pointer; transition: background .2s, transform .15s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
  .btn-danger:hover { background: #e04444; transform: translateY(-1px); }
  .btn-sm { padding: 8px 16px; font-size: 13px; border-radius: 8px; }
  .input { background: rgba(255,255,255,.04); border: 1.5px solid rgba(255,255,255,.1); border-radius: 10px; color: ${G.white}; font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 12px 16px; width: 100%; transition: border-color .2s, background .2s; outline: none; }
  .input:focus { border-color: ${G.emerald}; background: rgba(0,200,150,.04); }
  .input::placeholder { color: ${G.slate}; }
  .input option { background: ${G.navyMid}; }
  textarea.input { resize: vertical; min-height: 100px; }
  .label { font-size: 12px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: ${G.slate}; margin-bottom: 6px; display: block; }
  .badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; letter-spacing: .04em; }
  .badge-green { background: rgba(0,200,150,.15); color: ${G.emerald}; }
  .badge-amber { background: rgba(255,181,71,.15); color: ${G.amber}; }
  .badge-purple { background: rgba(123,97,255,.15); color: ${G.purple}; }
  .badge-coral { background: rgba(255,95,95,.15); color: ${G.coral}; }
  .badge-slate { background: rgba(74,98,117,.2); color: ${G.slate}; }
  .top-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(13,31,45,.9); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0,200,150,.1); height: 60px; display: flex; align-items: center; padding: 0 24px; gap: 16px; }
  .sidebar { position: fixed; top: 60px; left: 0; bottom: 0; z-index: 90; width: 220px; background: rgba(13,31,45,.95); backdrop-filter: blur(16px); border-right: 1px solid rgba(0,200,150,.1); display: flex; flex-direction: column; padding: 20px 0; transition: transform .3s ease; }
  .sidebar.collapsed { transform: translateX(-220px); }
  .sidebar-item { display: flex; align-items: center; gap: 12px; padding: 12px 20px; cursor: pointer; color: ${G.slate}; outline: none; border: none; font-size: 14px; font-weight: 500; border-left: 3px solid transparent; transition: color .2s, background .2s, border-color .2s; text-decoration: none; background: transparent; }
  .sidebar-item:hover { color: ${G.white}; background: rgba(0,200,150,.12); }
  .sidebar-item.active { color: ${G.emerald}; background: rgba(0,200,150,.15); border-left-color: ${G.emerald}; }
  .main-content { margin-top: 60px; margin-left: 220px; padding: 32px; min-height: calc(100vh - 60px); transition: margin-left .3s ease; }
  .main-content.full { margin-left: 0; }
  .progress-bar { height: 6px; border-radius: 3px; background: rgba(255,255,255,.08); overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, ${G.emerald}, ${G.emeraldDark}); transition: width .6s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes flicker { 0%,100% { transform: scaleY(1) rotate(-2deg); } 50% { transform: scaleY(1.08) rotate(2deg); } }
  .fade-up { animation: fadeUp .45s ease both; }
  .fade-in { animation: fadeIn .4s ease both; }
  .flame { display: inline-block; animation: flicker 1.2s ease-in-out infinite; }
  .modal-bg { position: fixed; inset: 0; z-index: 200; background: rgba(13,31,45,.75); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn .2s ease; }
  .modal-box { background: ${G.navyMid}; border: 1px solid rgba(0,200,150,.18); border-radius: 20px; padding: 32px; width: 100%; max-width: 520px; animation: fadeUp .3s ease; max-height: 90vh; overflow-y: auto; }
  input[type=checkbox] { accent-color: ${G.emerald}; width: 16px; height: 16px; cursor: pointer; }
  .radio-card { border: 1.5px solid rgba(255,255,255,.1); border-radius: 12px; padding: 14px 16px; cursor: pointer; transition: border-color .2s, background .2s; display: flex; align-items: flex-start; gap: 12px; }
  .radio-card.selected { border-color: ${G.emerald}; background: rgba(0,200,150,.06); }
  .radio-card:hover { border-color: rgba(0,200,150,.4); }
  @keyframes slideIn { from { transform: translateX(120%); } to { transform: translateX(0); } }
  .toast { position: fixed; bottom: 24px; right: 24px; z-index: 500; background: ${G.navyMid}; border: 1px solid ${G.emerald}; border-radius: 12px; padding: 14px 20px; display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; animation: slideIn .3s ease; box-shadow: 0 4px 24px rgba(0,200,150,.2); max-width: 320px; }
  .table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid rgba(0,200,150,.1); }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: rgba(0,200,150,.06); }
  th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: ${G.slate}; }
  td { padding: 14px 16px; font-size: 14px; border-top: 1px solid rgba(255,255,255,.04); }
  tr:hover td { background: rgba(0,200,150,.03); }
  .stat-card { background: ${G.navyMid}; border: 1px solid rgba(0,200,150,.12); border-radius: 16px; padding: 20px 24px; }
  .form-group { margin-bottom: 18px; }
  .divider { height: 1px; background: rgba(255,255,255,.06); margin: 24px 0; }
  .empty-state { text-align: center; padding: 48px 24px; color: ${G.slate}; }
  @media (max-width: 768px) { .sidebar { transform: translateX(-220px); } .sidebar.mobile-open { transform: translateX(0); } .main-content { margin-left: 0; padding: 20px 16px; } }
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
    filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    trophy: "M6 9H3V4h18v5h-3 M12 16v5m-4 0h8 M12 16a7 7 0 100-14 7 7 0 000 14z",
    location: "M12 22s-8-9-8-14a8 8 0 1116 0c0 5-8 14-8 14z M12 12a2 2 0 100-4 2 2 0 000 4z",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
    globe: "M12 22a10 10 0 100-20 10 10 0 000 20z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  };
  const d = paths[name] || paths["x"];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {d.split(" M").map((seg, i) => (
        <path key={i} d={i === 0 ? seg : "M" + seg} />
      ))}
    </svg>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════
const OngContext = createContext(null);

function OngProvider({ children }) {
  const [screen, setScreen] = useState("login");
  const [ongAtiva, setOngAtivaState] = useState(() => getOngAtiva());
  const [minhasOngs, setMinhasOngs] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [enrollees, setEnrollees] = useState([]);
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const showToast = (msg, icon = "✅") => { setToast({ msg, icon }); setTimeout(() => setToast(null), 3200); };

  const selecionarOng = (ong) => {
    salvarOngAtiva(ong);
    setOngAtivaState(ong);
    setScreen("portal");
  };

  const recarregarDados = async () => {
    if (!ongAtiva) return;
    setCarregandoDados(true);
    try {
      const ongs = await listarMinhasOngs();
      setMinhasOngs(ongs);

      const todasOps = await listarOportunidades();
      const minhasOps = todasOps.filter(op => op.idOng === ongAtiva.id);
      setOpportunities(minhasOps);

      const inscPorOp = await Promise.all(
        minhasOps.map(op =>
          listarInscricoesDaOportunidade(op.id)
            .then(lista => lista.map(i => ({ ...i, idOportunidade: op.id })))
            .catch(() => [])
        )
      );
      setEnrollees(inscPorOp.flat());
    } catch {
      setMinhasOngs([]);
      setOpportunities([]);
      setEnrollees([]);
    }
    setCarregandoDados(false);
  };

  useEffect(() => {
    if (screen === "portal") {
      recarregarDados();
    }
  }, [screen]);

  return (
    <OngContext.Provider value={{
      screen, setScreen,
      ongAtiva, selecionarOng,
      minhasOngs, setMinhasOngs,
      opportunities,
      enrollees,
      carregandoDados,
      recarregarDados,
      toast, showToast,
      activeTab, setActiveTab,
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
// COMPONENTES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════════
const Toast = ({ msg, icon = "✅", onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return <div className="toast"><span>{icon}</span><span>{msg}</span></div>;
};

const Blobs = () => (
  <>
    <div className="blob" style={{ width: 400, height: 400, background: G.emerald, top: -100, right: -100 }} />
    <div className="blob" style={{ width: 300, height: 300, background: G.purple, bottom: 100, left: -80, opacity: 0.1 }} />
  </>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. LoginScreen
// ═══════════════════════════════════════════════════════════════════════════════
const LoginScreen = () => {
  const { setScreen, selecionarOng, setMinhasOngs } = useOng();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!usuario.trim() || !senha.trim()) { setErro("Preencha usuário e senha."); return; }
    setCarregando(true);
    setErro("");
    try {
      await login({ usuario, senha });
      const ongs = await listarMinhasOngs();
      if (ongs.length === 0) {
        setErro("Seu usuário não está vinculado a nenhuma ONG.");
        setCarregando(false);
        return;
      }
      if (ongs.length === 1) {
        selecionarOng(ongs[0]);
      } else {
        setMinhasOngs(ongs);
        setScreen("selector");
      }
    } catch {
      setErro("Usuário ou senha inválidos.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <Blobs />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }} className="fade-up">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${G.emerald}, ${G.emeraldDark})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: `0 8px 32px rgba(0,200,150,.35)` }}>
            <span style={{ fontSize: 28 }}>🌱</span>
          </div>
          <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.02em" }}>Kindly</h1>
          <p style={{ color: G.slate, fontSize: 14, marginTop: 6 }}>Portal da ONG — Plataforma de voluntariado gamificada</p>
        </div>

        <div className="card-static" style={{ padding: 28 }}>
          <h2 className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Entrar na sua ONG</h2>

          <div className="form-group">
            <label className="label">Usuário</label>
            <input className="input" type="text" placeholder="usuario_da_ong" value={usuario} onChange={e => setUsuario(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>

          <div className="form-group" style={{ marginBottom: erro ? 12 : 24 }}>
            <label className="label">Senha</label>
            <div style={{ position: "relative" }}>
              <input className="input" type={showPass ? "text" : "password"} placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ paddingRight: 44 }} />
              <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: G.slate, display: "flex", alignItems: "center" }}>
                <Icon name={showPass ? "eye-off" : "eye"} size={16} color={G.slate} />
              </button>
            </div>
          </div>

          {erro && <p style={{ fontSize: 13, color: G.coral, marginBottom: 16 }}>{erro}</p>}

          <button className="btn-primary" style={{ width: "100%", fontSize: 15 }} onClick={handleLogin} disabled={carregando}>
            <Icon name="building" size={16} color={G.navy} />
            {carregando ? "Entrando…" : "Acessar Portal"}
          </button>

          

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 24 }}>
          {[["580", "ONGs cadastradas"], ["12.4k", "Voluntários ativos"], ["84k h", "Horas doadas"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div className="syne" style={{ fontSize: 18, fontWeight: 700, color: G.emerald }}>{n}</div>
              <div style={{ fontSize: 11, color: G.slate, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. RegisterScreen
// ═══════════════════════════════════════════════════════════════════════════════
const RegisterScreen = () => {
  const { setScreen, showToast } = useOng();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ orgName: "", cnpj: "", category: "", desc: "", city: "", state: "", phone: "", email: "", website: "", respNome: "", cpf: "", usuario: "", pass: "", passConfirm: "", terms: false });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleDone = async () => {
    if (form.pass !== form.passConfirm) { setErro("As senhas não coincidem."); return; }
    if (!form.terms) { setErro("Aceite os termos para continuar."); return; }
    if (form.cpf.replace(/\D/g, "").length !== 11) { setErro("CPF deve ter 11 dígitos."); return; }
    setCarregando(true);
    setErro("");
    try {
      await registrar({ nome: form.respNome, cpf: form.cpf.replace(/\D/g, ""), usuario: form.usuario, senha: form.pass, motor: null });
      showToast("ONG cadastrada com sucesso! Bem-vinda ao Kindly 🎉", "🌱");
      setScreen("portal");
    } catch (e) {
      const msg = e?.response?.data;
      setErro(typeof msg === "string" ? msg : "Erro ao criar conta. Verifique os dados.");
    } finally {
      setCarregando(false);
    }
  };

  const steps = [
    <div key="0" className="fade-up">
      <h2 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Dados da ONG 🏢</h2>
      <p style={{ color: G.slate, fontSize: 14, marginBottom: 24 }}>Informações básicas da sua organização.</p>
      <div className="form-group"><label className="label">Nome da ONG</label><input className="input" type="text" placeholder="Ex: Instituto Futuro" value={form.orgName} onChange={e => upd("orgName", e.target.value)} /></div>
      <div className="form-group"><label className="label">CNPJ</label><input className="input" type="text" placeholder="00.000.000/0001-00" value={form.cnpj} onChange={e => upd("cnpj", e.target.value)} /></div>
      <div className="form-group"><label className="label">Área de atuação</label><select className="input" value={form.category} onChange={e => upd("category", e.target.value)}><option value="">Selecione uma categoria</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
      <div className="form-group"><label className="label">Descrição</label><textarea className="input" placeholder="Descreva brevemente a missão da sua ONG..." value={form.desc} onChange={e => upd("desc", e.target.value)} /></div>
    </div>,

    <div key="1" className="fade-up">
      <h2 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Localização & Contato 📍</h2>
      <p style={{ color: G.slate, fontSize: 14, marginBottom: 24 }}>Como os voluntários vão te encontrar?</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12 }}>
        <div className="form-group"><label className="label">Cidade</label><input className="input" type="text" placeholder="São Paulo" value={form.city} onChange={e => upd("city", e.target.value)} /></div>
        <div className="form-group"><label className="label">Estado</label><select className="input" value={form.state} onChange={e => upd("state", e.target.value)} style={{ width: 80 }}><option value="">UF</option>{STATES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
      </div>
      <div className="form-group"><label className="label">Telefone</label><input className="input" type="tel" placeholder="(11) 99999-9999" value={form.phone} onChange={e => upd("phone", e.target.value)} /></div>
      <div className="form-group"><label className="label">E-mail institucional</label><input className="input" type="email" placeholder="contato@suaong.org.br" value={form.email} onChange={e => upd("email", e.target.value)} /></div>
      <div className="form-group"><label className="label">Website (opcional)</label><input className="input" type="url" placeholder="https://suaong.org.br" value={form.website} onChange={e => upd("website", e.target.value)} /></div>
    </div>,

    <div key="2" className="fade-up">
      <h2 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Responsável & Acesso 🔐</h2>
      <p style={{ color: G.slate, fontSize: 14, marginBottom: 24 }}>Quem vai gerenciar o portal?</p>
      <div className="form-group"><label className="label">Nome completo</label><input className="input" type="text" placeholder="Ana Souza" value={form.respNome} onChange={e => upd("respNome", e.target.value)} /></div>
      <div className="form-group"><label className="label">CPF (só números)</label><input className="input" type="text" placeholder="00000000000" value={form.cpf} onChange={e => upd("cpf", e.target.value)} /></div>
      <div className="form-group"><label className="label">Nome de usuário</label><input className="input" type="text" placeholder="ana_souza" value={form.usuario} onChange={e => upd("usuario", e.target.value)} /></div>
      <div className="form-group"><label className="label">Senha</label><input className="input" type="password" placeholder="••••••••" value={form.pass} onChange={e => upd("pass", e.target.value)} /></div>
      <div className="form-group"><label className="label">Confirmar senha</label><input className="input" type="password" placeholder="••••••••" value={form.passConfirm} onChange={e => upd("passConfirm", e.target.value)} /></div>
      {erro && <p style={{ fontSize: 13, color: G.coral, marginBottom: 12 }}>{erro}</p>}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 8 }}>
        <input type="checkbox" id="terms" checked={form.terms} onChange={e => upd("terms", e.target.checked)} />
        <label htmlFor="terms" style={{ fontSize: 13, color: G.slate, lineHeight: 1.5, cursor: "pointer" }}>
          Concordo com os <span style={{ color: G.emerald }}>Termos de Uso</span> e <span style={{ color: G.emerald }}>Política de Privacidade</span> da plataforma Kindly
        </label>
      </div>
    </div>,
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <Blobs />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, width: "100%", margin: "0 auto", padding: "80px 24px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <button onClick={() => step === 0 ? setScreen("login") : setStep(s => s - 1)} style={{ background: "none", border: "none", color: G.white, cursor: "pointer", padding: 4 }}>
            <Icon name="arrow" size={20} />
          </button>
          <div style={{ flex: 1 }}><div className="progress-bar"><div className="progress-fill" style={{ width: `${((step + 1) / 3) * 100}%` }} /></div></div>
          <span style={{ fontSize: 12, color: G.slate, fontWeight: 600 }}>{step + 1}/3</span>
        </div>
        <div className="card-static" style={{ padding: 28 }}>{steps[step]}</div>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          {step > 0 && <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>Voltar</button>}
          <button className="btn-primary" style={{ flex: 2 }} onClick={() => step < 2 ? setStep(s => s + 1) : handleDone()} disabled={carregando}>
            {step < 2 ? "Continuar" : carregando ? "Cadastrando…" : "Cadastrar ONG"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2.5. OngSelectorScreen
// ═══════════════════════════════════════════════════════════════════════════════
const OngSelectorScreen = ({ onVoltar }) => {
  const { minhasOngs, selecionarOng } = useOng();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <Blobs />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }} className="fade-up">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${G.emerald}, ${G.emeraldDark})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: `0 8px 32px rgba(0,200,150,.35)` }}>
            <span style={{ fontSize: 28 }}>🤝</span>
          </div>
          <h2 className="syne" style={{ fontSize: 22, fontWeight: 800 }}>Qual ONG você quer gerenciar?</h2>
          <p style={{ color: G.slate, fontSize: 14, marginTop: 6 }}>Você está vinculado a mais de uma organização.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {minhasOngs.map(o => (
            <button key={o.id} onClick={() => selecionarOng(o)} style={{ background: G.navyMid, border: `1.5px solid rgba(0,200,150,.18)`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", textAlign: "left", transition: "border-color .2s, transform .15s", color: G.white, fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = G.emerald; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,200,150,.18)"; e.currentTarget.style.transform = "none"; }}>
              <div className="syne" style={{ fontSize: 16, fontWeight: 700 }}>{o.nomeFantasia}</div>
              <div style={{ fontSize: 12, color: G.slate, marginTop: 4 }}>{o.razaoSocial}</div>
              <div style={{ fontSize: 11, marginTop: 6 }}>
                <span className="badge badge-green">{o.role}</span>
              </div>
            </button>
          ))}
        </div>

        <button onClick={onVoltar} style={{ background: "none", border: "none", color: G.slate, cursor: "pointer", marginTop: 24, fontSize: 13, width: "100%", textAlign: "center" }}>
          ← Voltar ao login
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3. DashboardTab
// ═══════════════════════════════════════════════════════════════════════════════
const DashboardTab = () => {
  const { ongAtiva, opportunities, enrollees, setActiveTab } = useOng();

  const totalInscritos = enrollees.length;
  const realizados = enrollees.filter(e => (e.statusInscricao?.name || e.statusInscricao) === "Realizado").length;
  const ativas = opportunities.length;

  const stats = [
    { icon: "calendar", label: "Oportunidades Ativas", value: ativas, color: G.emerald, sub: "cadastradas e ativas" },
    { icon: "users", label: "Total de Inscritos", value: totalInscritos, color: G.purple, sub: "em todas as oportunidades" },
    { icon: "check-circle", label: "Ações Realizadas", value: realizados, color: G.amber, sub: "presença confirmada" },
  ];

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 28 }}>
        <p style={{ color: G.slate, fontSize: 13 }}>Bem-vinda de volta 👋</p>
        <h2 className="syne" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em" }}>
          {ongAtiva?.nomeFantasia || "—"}
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={s.label} className="stat-card fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={s.icon} size={18} color={s.color} />
              </div>
              <span style={{ fontSize: 12, color: G.slate, fontWeight: 500 }}>{s.label}</span>
            </div>
            <div className="syne" style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: G.slate, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card-static fade-up" style={{ padding: 20, animationDelay: ".18s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 className="syne" style={{ fontSize: 15, fontWeight: 700 }}>Oportunidades Recentes</h3>
            <button onClick={() => setActiveTab("opportunities")} style={{ background: "none", border: "none", color: G.emerald, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Ver todas →</button>
          </div>
          {opportunities.length === 0 ? (
            <p style={{ fontSize: 13, color: G.slate }}>Nenhuma oportunidade cadastrada.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {opportunities.slice(0, 3).map(op => (
                <div key={op.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: "rgba(0,200,150,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="calendar" size={16} color={G.emerald} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{op.titulo}</div>
                    <div style={{ fontSize: 11, color: G.slate, marginTop: 2 }}>
                      {op.dataEvento ? new Date(op.dataEvento).toLocaleDateString("pt-BR") : "—"} · {op.vagasPresente || 0}/{op.vagasTotal} vagas
                    </div>
                  </div>
                  <span className="badge badge-green">Ativa</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-static fade-up" style={{ padding: 20, animationDelay: ".24s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 className="syne" style={{ fontSize: 15, fontWeight: 700 }}>Inscrições Recentes</h3>
            <button onClick={() => setActiveTab("enrollees")} style={{ background: "none", border: "none", color: G.emerald, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Ver todas →</button>
          </div>
          {enrollees.length === 0 ? (
            <p style={{ fontSize: 13, color: G.slate }}>Nenhuma inscrição ainda.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {enrollees.slice(0, 5).map(e => {
                const statusName = e.statusInscricao?.name || e.statusInscricao;
                const badgeClass = statusName === "Realizado" ? "badge-green" : statusName === "Inscrito" ? "badge-amber" : "badge-slate";
                return (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${G.emerald}40, ${G.purple}40)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: G.emerald }}>
                      #{e.idUsuario}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>Usuário #{e.idUsuario}</div>
                    </div>
                    <span className={`badge ${badgeClass}`}>{statusName}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4. OpportunitiesTab
// ═══════════════════════════════════════════════════════════════════════════════
const OpportunitiesTab = () => {
  const { opportunities, carregandoDados, setActiveTab, enrollees } = useOng();
  const [filter, setFilter] = useState("all");

  // Backend só persiste oportunidades ativas, mas mantemos o filtro de UI
  // Toda oportunidade vinda do backend é considerada "active"
  const opsComStatus = opportunities.map(op => ({ ...op, statusUI: "active" }));
  const filtered = filter === "all" ? opsComStatus : opsComStatus.filter(o => o.statusUI === filter);

  const getEnrolleeCount = (opId) => enrollees.filter(e => e.idOportunidade === opId).length;

  if (carregandoDados) {
    return <div className="empty-state"><p>Carregando oportunidades…</p></div>;
  }

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 className="syne" style={{ fontSize: 22, fontWeight: 800 }}>Minhas Oportunidades</h2>
          <p style={{ color: G.slate, fontSize: 13, marginTop: 4 }}>{opportunities.length} oportunidade{opportunities.length !== 1 ? "s" : ""} cadastrada{opportunities.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="btn-primary btn-sm" onClick={() => setActiveTab("create")}><Icon name="plus" size={14} color={G.navy} />Nova</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["all", "active"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? G.emerald : "rgba(255,255,255,.05)", color: filter === f ? G.navy : G.white, border: "none", borderRadius: 20, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Syne', sans-serif", transition: "all .2s" }}>
            {f === "all" ? "Todas" : "Ativa"}
            <span style={{ marginLeft: 6, fontSize: 11, background: filter === f ? "rgba(13,31,45,.2)" : "rgba(255,255,255,.08)", padding: "1px 6px", borderRadius: 10 }}>
              {f === "all" ? opsComStatus.length : opsComStatus.filter(o => o.statusUI === f).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: G.white, marginBottom: 8 }}>Nenhuma oportunidade cadastrada</p>
          <button className="btn-primary" onClick={() => setActiveTab("create")}><Icon name="plus" size={16} color={G.navy} />Criar Oportunidade</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map((op, i) => (
            <div key={op.id} className="card fade-up" style={{ padding: 20, animationDelay: `${i * 0.06}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <span className="badge badge-green">{op.nomeCategoria}</span>
                  <span className="badge badge-green">Ativa</span>
                </div>
              </div>
              <h3 className="syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{op.titulo}</h3>
              <p style={{ fontSize: 13, color: G.slate, marginBottom: 14, lineHeight: 1.5 }}>{(op.descricao || "").slice(0, 100)}{op.descricao && op.descricao.length > 100 ? "…" : ""}</p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: G.slate }}>
                  <Icon name="calendar" size={13} color={G.slate} />
                  {op.dataEvento ? new Date(op.dataEvento).toLocaleDateString("pt-BR") : "—"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: G.slate }}>
                  <Icon name="trophy" size={13} color={G.slate} />
                  {Math.round(Number(op.pontuacao) || 0)} pts
                </div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: G.slate, marginBottom: 6 }}>
                  <span>Vagas preenchidas</span>
                  <span style={{ color: G.emerald }}>{op.vagasPresente || 0}/{op.vagasTotal}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(((op.vagasPresente || 0) / op.vagasTotal) * 100, 100)}%` }} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: G.slate }}>
                <Icon name="users" size={13} color={G.slate} />
                {getEnrolleeCount(op.id)} inscrito{getEnrolleeCount(op.id) !== 1 ? "s" : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5. CreateOpportunityTab
// ═══════════════════════════════════════════════════════════════════════════════
// Captura cliques no mapa e move o marker
function MarkerMovivel({ posicao, onChange }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return posicao ? <Marker position={posicao} /> : null;
}

const Field = ({ label, error, children }) => (
  <div className="form-group">
    <label className="label">{label}</label>
    {children}
    {error && <span style={{ fontSize: 11, color: G.coral, marginTop: 4, display: "block" }}>{error}</span>}
  </div>
);
const CreateOpportunityTab = () => {
  const { ongAtiva, setActiveTab, showToast, recarregarDados } = useOng();
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    dataEvento: "",
    endereco: "",
    localLat: "",
    localLong: "",
    vagasTotal: "",
    idOng: "",
    idCategoria: "",
  });
  const [markerPos, setMarkerPos] = useState(null);
  const [geocodificando, setGeocodificando] = useState(false);
  const [errors, setErrors] = useState({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    listarCategorias().then(setCategorias).catch(() => setCategorias([]));
  }, []);

  useEffect(() => {
    if (ongAtiva && !form.idOng) {
      setForm(f => ({ ...f, idOng: String(ongAtiva.id) }));
    }
  }, [ongAtiva]);

  const upd = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const geocodificar = async () => {
    if (!form.endereco.trim()) return;
    setGeocodificando(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.endereco)}&limit=1`,
        { headers: { "Accept-Language": "pt-BR" } }
      );
      const data = await res.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setMarkerPos([lat, lon]);
        setForm(f => ({ ...f, localLat: String(lat), localLong: String(lon) }));
        setErrors(e => ({ ...e, endereco: "", localLat: "", localLong: "" }));
      } else {
        setErrors(e => ({ ...e, endereco: "Endereço não encontrado. Tente ser mais específico." }));
      }
    } catch {
      setErrors(e => ({ ...e, endereco: "Erro ao buscar endereço." }));
    }
    setGeocodificando(false);
  };

  const onMapClick = (lat, lng) => {
    setMarkerPos([lat, lng]);
    setForm(f => ({ ...f, localLat: String(lat), localLong: String(lng) }));
    setErrors(e => ({ ...e, localLat: "", localLong: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.titulo.trim()) e.titulo = "Obrigatório";
    if (!form.descricao.trim()) e.descricao = "Obrigatório";
    if (!form.dataEvento) e.dataEvento = "Obrigatório";
    if (!form.endereco.trim()) e.endereco = "Obrigatório";
    if (!form.localLat || !form.localLong) e.endereco = "Confirme o endereço no mapa.";
    if (!form.vagasTotal || isNaN(Number(form.vagasTotal)) || Number(form.vagasTotal) <= 0) e.vagasTotal = "Inválido";
    if (!form.idCategoria) e.idCategoria = "Selecione a categoria";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setEnviando(true);
    try {
      await criarOportunidade({
        titulo: form.titulo,
        descricao: form.descricao,
        dataEvento: form.dataEvento,
        endereco: form.endereco,
        localLat: Number(form.localLat),
        localLong: Number(form.localLong),
        vagasTotal: Number(form.vagasTotal),
        idOng: Number(form.idOng),
        idCategoria: Number(form.idCategoria),
      });
      showToast("Oportunidade publicada! 🎉", "✅");
      await recarregarDados();
      setActiveTab("opportunities");
    } catch (e) {
      const msg = e?.response?.data;
      showToast(typeof msg === "string" ? msg : "Erro ao publicar.", "⚠️");
    }
    setEnviando(false);
  };

  // Centro padrão: São Paulo
  const centroInicial = markerPos || [-23.5505, -46.6333];

  return (
    <div className="fade-up" style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 className="syne" style={{ fontSize: 22, fontWeight: 800 }}>Nova Oportunidade</h2>
        <p style={{ color: G.slate, fontSize: 13, marginTop: 4 }}>Preencha os detalhes para mobilizar voluntários.</p>
      </div>
      <div className="card-static" style={{ padding: 28 }}>
        <Field label="Título" error={errors.titulo}>
          <input className="input" type="text" placeholder="Ex: Tutoria em Matemática" value={form.titulo} onChange={e => upd("titulo", e.target.value)} style={errors.titulo ? { borderColor: G.coral } : {}} />
        </Field>

        <div className="form-group">
          <label className="label">ONG responsável</label>
          <div style={{ fontSize: 14, color: G.white, padding: "12px 16px", background: "rgba(255,255,255,.04)", borderRadius: 10, border: "1.5px solid rgba(255,255,255,.06)" }}>
            {ongAtiva?.nomeFantasia || "—"}
          </div>
        </div>

        <Field label="Categoria" error={errors.idCategoria}>
          <select className="input" value={form.idCategoria} onChange={e => upd("idCategoria", e.target.value)} style={errors.idCategoria ? { borderColor: G.coral } : {}}>
            <option value="">Selecione</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </Field>

        <Field label="Descrição" error={errors.descricao}>
          <textarea className="input" placeholder="Descreva a atividade…" value={form.descricao} onChange={e => upd("descricao", e.target.value)} style={{ minHeight: 110, ...(errors.descricao ? { borderColor: G.coral } : {}) }} />
        </Field>

        <div className="divider" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Data do evento" error={errors.dataEvento}>
            <input className="input" type="date" value={form.dataEvento} onChange={e => upd("dataEvento", e.target.value)} style={errors.dataEvento ? { borderColor: G.coral } : {}} />
          </Field>
          <Field label="Vagas" error={errors.vagasTotal}>
            <input className="input" type="number" placeholder="10" min="1" value={form.vagasTotal} onChange={e => upd("vagasTotal", e.target.value)} style={errors.vagasTotal ? { borderColor: G.coral } : {}} />
          </Field>
        </div>

        <div className="divider" />

        <Field label="Endereço" error={errors.endereco}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="input"
              type="text"
              placeholder="Ex: Av. Paulista, 1578, São Paulo"
              value={form.endereco}
              onChange={e => upd("endereco", e.target.value)}
              onKeyDown={e => e.key === "Enter" && geocodificar()}
              style={errors.endereco ? { borderColor: G.coral } : {}}
            />
            <button
              type="button"
              className="btn-ghost"
              style={{ flexShrink: 0, padding: "0 16px", fontSize: 13 }}
              onClick={geocodificar}
              disabled={geocodificando}
            >
              {geocodificando ? "…" : "Buscar"}
            </button>
          </div>
          {form.localLat && form.localLong && (
            <div style={{ fontSize: 11, color: G.emerald, marginTop: 6 }}>
              📍 {Number(form.localLat).toFixed(5)}, {Number(form.localLong).toFixed(5)} — ou clique no mapa para ajustar
            </div>
          )}
        </Field>

        <div style={{ borderRadius: 12, overflow: "hidden", border: "1.5px solid rgba(0,200,150,.15)", marginTop: 4 }}>
          <MapContainer
            center={centroInicial}
            zoom={markerPos ? 15 : 12}
            style={{ height: 260, width: "100%" }}
            key={markerPos ? markerPos.join(",") : "default"}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <MarkerMovivel posicao={markerPos} onChange={onMapClick} />
          </MapContainer>
        </div>
        <p style={{ fontSize: 11, color: G.slate, marginTop: 6 }}>Clique no mapa para ajustar a localização manualmente.</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setActiveTab("opportunities")}>Cancelar</button>
        <button className="btn-primary" style={{ flex: 2 }} onClick={handleSubmit} disabled={enviando}>
          <Icon name="check" size={16} color={G.navy} />
          {enviando ? "Publicando…" : "Publicar Oportunidade"}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6. EnrolleesTab
// ═══════════════════════════════════════════════════════════════════════════════
const EnrolleesTab = () => {
  const { enrollees, opportunities, carregandoDados } = useOng();
  const [filterOp, setFilterOp] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = enrollees.filter(e => {
    const matchOp = filterOp === "all" || e.idOportunidade === Number(filterOp);
    const statusName = e.statusInscricao?.name || e.statusInscricao;
    const matchStatus = filterStatus === "all" || statusName === filterStatus;
    const matchSearch = !search || String(e.idUsuario).includes(search);
    return matchOp && matchStatus && matchSearch;
  });

  const statusBadge = (status) => {
    const s = status?.name || status;
    if (s === "Inscrito") return "badge-amber";
    if (s === "Realizado") return "badge-green";
    if (s === "Cancelado") return "badge-coral";
    return "badge-slate";
  };

  const getOpTitle = (id) => opportunities.find(o => o.id === id)?.titulo || `Oportunidade #${id}`;

  const stats = {
    total: enrollees.length,
    inscrito: enrollees.filter(e => (e.statusInscricao?.name || e.statusInscricao) === "Inscrito").length,
    realizado: enrollees.filter(e => (e.statusInscricao?.name || e.statusInscricao) === "Realizado").length,
    cancelado: enrollees.filter(e => (e.statusInscricao?.name || e.statusInscricao) === "Cancelado").length,
  };

  if (carregandoDados) {
    return <div className="empty-state"><p>Carregando inscritos…</p></div>;
  }

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 24 }}>
        <h2 className="syne" style={{ fontSize: 22, fontWeight: 800 }}>Inscritos</h2>
        <p style={{ color: G.slate, fontSize: 13, marginTop: 4 }}>Voluntários inscritos nas oportunidades da sua ONG.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[[stats.total, "Total", G.white], [stats.inscrito, "Inscritos", G.amber], [stats.realizado, "Realizados", G.emerald], [stats.cancelado, "Cancelados", G.coral]].map(([v, l, c]) => (
          <div key={String(l)} className="stat-card" style={{ padding: "14px 16px" }}>
            <div className="syne" style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div>
            <div style={{ fontSize: 11, color: G.slate, marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <input className="input" type="text" placeholder="Buscar por ID do usuário…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36, height: 40, fontSize: 13 }} />
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <Icon name="search" size={15} color={G.slate} />
          </div>
        </div>
        <select className="input" value={filterOp} onChange={e => setFilterOp(e.target.value)} style={{ flex: "0 0 auto", width: "auto", minWidth: 180, height: 40, fontSize: 13, color: G.white }}>
          <option value="all">Todas as oportunidades</option>
          {opportunities.map(o => <option key={o.id} value={o.id}>{o.titulo}</option>)}
        </select>
        <select className="input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ flex: "0 0 auto", width: "auto", minWidth: 140, height: 40, fontSize: 13, color: G.white }}>
          <option value="all">Todos os status</option>
          <option value="Inscrito">Inscritos</option>
          <option value="Realizado">Realizados</option>
          <option value="Expirado">Expirados</option>
          <option value="Cancelado">Cancelados</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: G.white, marginBottom: 8 }}>Nenhum inscrito encontrado</p>
          <p style={{ fontSize: 13 }}>{enrollees.length === 0 ? "Quando voluntários se inscreverem, aparecerão aqui." : "Tente ajustar os filtros."}</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Voluntário (ID)</th><th>Oportunidade</th><th>Pontos snap</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(e => {
                const statusName = e.statusInscricao?.name || e.statusInscricao;
                const pts = Math.round(Number(e.pontuacaoSnap) * Number(e.modificadorSnap)) || 0;
                return (
                  <tr key={e.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${G.emerald}40, ${G.purple}40)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: G.emerald }}>
                          #{e.idUsuario}
                        </div>
                        <span style={{ fontSize: 13, color: G.slate }}>Usuário #{e.idUsuario}</span>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 13, color: G.slate }}>{getOpTitle(e.idOportunidade)}</span></td>
                    <td><span style={{ fontSize: 13, color: G.emerald, fontWeight: 600 }}>{pts}</span></td>
                    <td><span className={`badge ${statusBadge(e.statusInscricao)}`}>{statusName}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 7. ProfileTab
// ═══════════════════════════════════════════════════════════════════════════════
const ProfileTab = () => {
  const { ongAtiva, selecionarOng, showToast } = useOng();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    razaoSocial: ongAtiva?.razaoSocial || "",
    nomeFantasia: ongAtiva?.nomeFantasia || "",
  });
  const [salvando, setSalvando] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.razaoSocial.trim() || !form.nomeFantasia.trim()) {
      showToast("Preencha todos os campos.", "⚠️");
      return;
    }
    setSalvando(true);
    try {
      await atualizarOng(ongAtiva.id, {
        razaoSocial: form.razaoSocial,
        nomeFantasia: form.nomeFantasia,
      });
      // Atualiza a ONG ativa no contexto e no localStorage
      selecionarOng({ ...ongAtiva, razaoSocial: form.razaoSocial, nomeFantasia: form.nomeFantasia });
      setEditing(false);
      showToast("Perfil atualizado!", "✅");
    } catch {
      showToast("Erro ao salvar. Tente novamente.", "⚠️");
    }
    setSalvando(false);
  };

  const handleCancel = () => {
    setForm({ razaoSocial: ongAtiva?.razaoSocial || "", nomeFantasia: ongAtiva?.nomeFantasia || "" });
    setEditing(false);
  };

  return (
    <div className="fade-up" style={{ maxWidth: 580 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 className="syne" style={{ fontSize: 22, fontWeight: 800 }}>Perfil da ONG</h2>
          <p style={{ color: G.slate, fontSize: 13, marginTop: 4 }}>Informações da sua organização.</p>
        </div>
        {!editing ? (
          <button className="btn-ghost btn-sm" onClick={() => setEditing(true)}>
            <Icon name="edit" size={14} color={G.emerald} />Editar
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost btn-sm" onClick={handleCancel}>Cancelar</button>
            <button className="btn-primary btn-sm" onClick={handleSave} disabled={salvando}>
              <Icon name="check" size={14} color={G.navy} />
              {salvando ? "Salvando…" : "Salvar"}
            </button>
          </div>
        )}
      </div>

      <div className="card-static" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, flexShrink: 0, background: `linear-gradient(135deg, ${G.emerald}, ${G.emeraldDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🤝</div>
          <div>
            <h3 className="syne" style={{ fontSize: 20, fontWeight: 800 }}>
              {ongAtiva?.nomeFantasia || "—"}
            </h3>
            <p style={{ fontSize: 13, color: G.slate, marginTop: 4 }}>{ongAtiva?.razaoSocial || "—"}</p>
          </div>
        </div>

        <div className="form-group">
          <label className="label">Nome Fantasia</label>
          {editing ? (
            <input className="input" type="text" value={form.nomeFantasia} onChange={e => upd("nomeFantasia", e.target.value)} />
          ) : (
            <div style={{ fontSize: 14, color: G.white }}>{ongAtiva?.nomeFantasia || "—"}</div>
          )}
        </div>

        <div className="form-group" style={{ marginTop: 16 }}>
          <label className="label">Razão Social</label>
          {editing ? (
            <input className="input" type="text" value={form.razaoSocial} onChange={e => upd("razaoSocial", e.target.value)} />
          ) : (
            <div style={{ fontSize: 14, color: G.white }}>{ongAtiva?.razaoSocial || "—"}</div>
          )}
        </div>

        <div className="form-group" style={{ marginTop: 16 }}>
          <label className="label">CNPJ</label>
          <div style={{ fontSize: 14, color: G.slate }}>{ongAtiva?.cnpj || "—"}</div>
          <div style={{ fontSize: 11, color: G.slate, marginTop: 4 }}>Não editável</div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR + TOPNAV + PORTAL SHELL
// ═══════════════════════════════════════════════════════════════════════════════
const Sidebar = ({ mobileOpen, onClose }) => {
  const { activeTab, setActiveTab, ongAtiva, setScreen } = useOng();
  const NAV_ITEMS = [
    { id: "dashboard", icon: "bar-chart", label: "Dashboard" },
    { id: "opportunities", icon: "calendar", label: "Oportunidades" },
    { id: "create", icon: "plus", label: "Nova Oportunidade" },
    { id: "enrollees", icon: "users", label: "Inscritos" },
    { id: "profile", icon: "building", label: "Perfil da ONG" },
  ];
  const handleNav = (id) => { setActiveTab(id); onClose?.(); };

  // logout chama o backend antes de mudar de tela
  const handleLogout = async () => {
    await logout();
    // Redireciona para o portal voluntário (onde está o login principal e o toggle entre portais)
    limparOngAtiva();
    window.location.href = "/";
  };

  return (
    <>
      {mobileOpen && <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 89, background: "rgba(13,31,45,.6)", backdropFilter: "blur(4px)" }} />}
      <aside className={`sidebar${mobileOpen ? " mobile-open" : ""}`}>
        <div style={{ padding: "0 20px 20px", borderBottom: "1px solid rgba(255,255,255,.06)", marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${G.emerald}, ${G.emeraldDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 10 }}>🤝</div>
          <div className="syne" style={{ fontSize: 13, fontWeight: 700 }}>{ongAtiva?.nomeFantasia || "—"}</div>
          <div style={{ fontSize: 11, color: G.slate, marginTop: 2 }}>{ongAtiva?.razaoSocial || ""}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: G.emerald }} />
            <span style={{ fontSize: 11, color: G.emerald }}>Ativa</span>
          </div>
        </div>
        <nav style={{ flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} className={`sidebar-item${activeTab === item.id ? " active" : ""}`} onClick={() => handleNav(item.id)} style={{ width: "100%", textAlign: "left" }}>
              <Icon name={item.icon} size={17} color={activeTab === item.id ? G.emerald : G.slate} />
              {item.label}
              {item.id === "create" && <span style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: "50%", background: G.emerald, color: G.navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>+</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 0", borderTop: "1px solid rgba(255,255,255,.06)" }}>
          <button className="sidebar-item" style={{ width: "100%", textAlign: "left" }} onClick={handleLogout}>
            <Icon name="logout" size={17} color={G.slate} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
};

const TopNav = ({ onMenuToggle }) => {
  const { activeTab, ongAtiva, setActiveTab } = useOng();
  const TAB_LABELS = { dashboard: "Dashboard", opportunities: "Minhas Oportunidades", create: "Nova Oportunidade", enrollees: "Inscritos", profile: "Perfil da ONG" };
  return (
    <header className="top-nav">
      <button onClick={onMenuToggle} style={{ background: "none", border: "none", cursor: "pointer", color: G.white, display: "flex", alignItems: "center", padding: 4 }}>
        <Icon name="menu" size={20} />
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${G.emerald}, ${G.emeraldDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🌱</div>
        <span className="syne" style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-.01em" }}>Kindly</span>
        <span style={{ color: G.slate, fontSize: 13 }}>/ Portal ONG</span>
      </div>
      <div style={{ flex: 1, paddingLeft: 16 }}>
        <span className="syne" style={{ fontSize: 14, fontWeight: 700 }}>{TAB_LABELS[activeTab] || ""}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn-primary btn-sm" onClick={() => setActiveTab("create")} style={{ padding: "8px 14px", fontSize: 13 }}>
          <Icon name="plus" size={14} color={G.navy} />Nova Oportunidade
        </button>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${G.emerald}, ${G.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: G.navy, cursor: "pointer", flexShrink: 0 }} title={ongAtiva?.nomeFantasia || ""}>
          {ongAtiva?.nomeFantasia?.[0] || "?"}
        </div>
      </div>
    </header>
  );
};

const PortalShell = () => {
  const { activeTab } = useOng();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "opportunities": return <OpportunitiesTab />;
      case "create": return <CreateOpportunityTab />;
      case "enrollees": return <EnrolleesTab />;
      case "profile": return <ProfileTab />;
      default: return <DashboardTab />;
    }
  };
  return (
    <>
      <TopNav onMenuToggle={() => setMobileMenuOpen(o => !o)} />
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className="main-content">{renderTab()}</main>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════════
function AppContent() {
  const { screen, toast, showToast } = useOng();
  return (
    <>
      <style>{css}</style>
      <div className="noise">
        {screen === "login" && <LoginScreen />}
        {screen === "register" && <RegisterScreen />}
        {screen === "selector" && <OngSelectorScreen onVoltar={() => setScreen("login")} />}
        {screen === "portal" && <PortalShell />}
        {toast && <Toast msg={toast.msg} icon={toast.icon} onDone={() => showToast("", "")} />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <OngProvider>
      <AppContent />
    </OngProvider>
  );
}
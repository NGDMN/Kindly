import { useState, useEffect, useRef } from "react";

// ── Palette & global styles ──────────────────────────────────────────────────
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
  }
  .btn-primary:hover { background: ${G.emeraldDark}; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,200,150,.3); }
  .btn-primary:active { transform: translateY(0); }

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
  }
  .btn-danger:hover { background: #e04444; transform: translateY(-1px); }

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

  /* ── Nav ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(13,31,45,.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,200,150,.1);
    height: 60px;
    display: flex; align-items: center; padding: 0 24px;
  }

  /* ── Bottom nav ── */
  .bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
    background: rgba(13,31,45,.9);
    backdrop-filter: blur(16px);
    border-top: 1px solid rgba(0,200,150,.1);
    display: flex; align-items: center; justify-content: space-around;
    height: 64px;
  }

  .bottom-nav-btn {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    background: none; border: none; cursor: pointer;
    color: ${G.slate}; font-size: 10px; font-family: 'DM Sans', sans-serif;
    font-weight: 500; letter-spacing: .04em;
    padding: 8px 16px;
    border-radius: 12px;
    transition: color .2s, background .2s;
  }
  .bottom-nav-btn.active { color: ${G.emerald}; }
  .bottom-nav-btn:hover { background: rgba(0,200,150,.06); }

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

  /* ── Streak flame ── */
  @keyframes flicker {
    0%,100% { transform: scaleY(1) rotate(-2deg); }
    50% { transform: scaleY(1.08) rotate(2deg); }
  }
  .flame { display: inline-block; animation: flicker 1.2s ease-in-out infinite; }

  /* ── QR scanner ── */
  .qr-frame {
    width: 220px; height: 220px;
    border: 3px solid ${G.emerald};
    border-radius: 16px;
    position: relative;
    box-shadow: 0 0 0 4px rgba(0,200,150,.15), inset 0 0 40px rgba(0,200,150,.05);
  }
  .qr-corner {
    position: absolute; width: 24px; height: 24px;
    border-color: ${G.emerald}; border-style: solid;
  }
  @keyframes scan {
    0% { top: 8px; opacity: 1; }
    95% { top: calc(100% - 12px); opacity: 1; }
    100% { top: 8px; opacity: 0; }
  }
  .scan-line {
    position: absolute; left: 8px; right: 8px; height: 2px;
    background: linear-gradient(90deg, transparent, ${G.emerald}, transparent);
    box-shadow: 0 0 8px ${G.emerald};
    animation: scan 2s linear infinite;
  }

  /* ── Donation ── */
  .donation-card {
    background: linear-gradient(135deg, rgba(0,200,150,.12), rgba(123,97,255,.08));
    border: 1px solid rgba(0,200,150,.2);
    border-radius: 16px;
    padding: 24px;
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
  .fade-up  { animation: fadeUp .45s ease both; }
  .fade-in  { animation: fadeIn .4s ease both; }

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
    width: 100%; max-width: 440px;
    animation: fadeUp .3s ease;
  }

  /* ── Checkbox ── */
  input[type=checkbox] { accent-color: ${G.emerald}; width: 16px; height: 16px; cursor: pointer; }

  /* ── Radio ── */
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
    position: fixed; bottom: 80px; right: 20px; z-index: 500;
    background: ${G.navyMid};
    border: 1px solid ${G.emerald};
    border-radius: 12px;
    padding: 14px 20px;
    display: flex; align-items: center; gap: 10px;
    font-size: 14px; font-weight: 500;
    animation: slideIn .3s ease;
    box-shadow: 0 4px 24px rgba(0,200,150,.2);
    max-width: 300px;
  }

  /* ── Scrollable content ── */
  .page { padding: 80px 20px 90px; max-width: 480px; margin: 0 auto; }
  .page-full { padding: 80px 20px 90px; max-width: 600px; margin: 0 auto; }
`;

// ── Icons (inline SVG) ────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const paths = {
    home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    search: "M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    qr: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM20 14h1v1h-1zM17 17h3v1h-3zM14 18h1v3h-1zM17 20h3v3h-3z",
    heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    check: "M20 6L9 17l-5-5",
    flame: "M12 2c0 0-6 5.5-6 11a6 6 0 0012 0c0-5.5-6-11-6-11z M9 17c0-2 1.5-4 3-4s3 2 3 4",
    map: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
    clock: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2",
    calendar: "M3 9h18M16 3v4M8 3v4M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z",
    gift: "M20 12v10H4V12 M22 7H2v5h20V7z M12 22V7 M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z",
    arrow: "M19 12H5 M12 5l-7 7 7 7",
    logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
    camera: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z",
    location: "M12 22s-8-9-8-14a8 8 0 1116 0c0 5-8 14-8 14z M12 12a2 2 0 100-4 2 2 0 000 4z",
    trophy: "M6 9H3V4h18v5h-3 M12 16v5m-4 0h8 M12 16a7 7 0 100-14 7 7 0 000 14z",
    plus: "M12 5v14M5 12h14",
    x: "M18 6L6 18M6 6l12 12",
    chevron: "M9 18l6-6-6-6",
    bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]?.split(" M").map((d, i) => (
        <path key={i} d={i === 0 ? d : "M" + d} />
      ))}
    </svg>
  );
};

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg, icon = "✅", onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return <div className="toast"><span>{icon}</span><span>{msg}</span></div>;
};

// ── Blob background ───────────────────────────────────────────────────────────
const Blobs = () => (
  <>
    <div className="blob" style={{ width: 400, height: 400, background: G.emerald, top: -100, right: -100 }} />
    <div className="blob" style={{ width: 300, height: 300, background: G.purple, bottom: 100, left: -80, opacity: .1 }} />
  </>
);

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════
const OPPORTUNITIES = [
  { id: 1, title: "Tutoria em Matemática", org: "Instituto Futuro", category: "Educação", date: "10 Mai", time: "14h–16h", location: "São Paulo, SP", hours: 2, spots: 5, badge: "green", desc: "Ajude estudantes do ensino médio a superarem dificuldades em matemática. Experiência prévia em ensino é um diferencial.", skills: ["Paciência", "Matemática", "Comunicação"] },
  { id: 2, title: "Distribuição de Refeições", org: "Mão Amiga ONG", category: "Social", date: "12 Mai", time: "08h–12h", location: "Centro, SP", hours: 4, spots: 12, badge: "amber", desc: "Participe da distribuição de marmitas para pessoas em situação de rua. Importante e urgente!", skills: ["Trabalho em equipe", "Empatia"] },
  { id: 3, title: "Limpeza de Praia", org: "Oceano Vivo", category: "Meio Ambiente", date: "17 Mai", time: "07h–10h", location: "Santos, SP", hours: 3, spots: 20, badge: "green", desc: "Mutirão de limpeza da orla da Praia Grande. Traga protetor solar e luvas (fornecemos sacos).", skills: ["Consciência ambiental"] },
  { id: 4, title: "Visita a Idosos", org: "Lar Esperança", category: "Saúde", date: "15 Mai", time: "10h–12h", location: "Pinheiros, SP", hours: 2, spots: 6, badge: "purple", desc: "Faça companhia a idosos em asilo. Leve boa vontade, histórias e um sorriso.", skills: ["Empatia", "Comunicação", "Escuta ativa"] },
];

const ENGINES = [
  { id: "impact", icon: "🌍", title: "Impacto Social", desc: "Quero ver o mundo melhorar de verdade" },
  { id: "skills", icon: "🚀", title: "Desenvolver Habilidades", desc: "Aprender e crescer enquanto ajudo" },
  { id: "community", icon: "🤝", title: "Comunidade", desc: "Conectar-me com pessoas incríveis" },
  { id: "purpose", icon: "✨", title: "Propósito Pessoal", desc: "Sentir que faço parte de algo maior" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

// ── 1. Login / Home ───────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <Blobs />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400 }} className="fade-up">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${G.emerald}, ${G.emeraldDark})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: `0 8px 32px rgba(0,200,150,.35)` }}>
            <span style={{ fontSize: 28 }}>🌱</span>
          </div>
          <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.02em" }}>Kindly</h1>
          <p style={{ color: G.slate, fontSize: 14, marginTop: 6 }}>Transforme seu tempo em impacto real</p>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ marginBottom: 18 }}>
            <label className="label">E-mail</label>
            <input className="input" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="label">Senha</label>
            <input className="input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
          </div>
          <button className="btn-primary" style={{ width: "100%", fontSize: 15 }} onClick={onLogin}>Entrar</button>
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: G.slate }}>
            Ainda não tem conta?{" "}
            <span style={{ color: G.emerald, cursor: "pointer", fontWeight: 600 }} onClick={onRegister}>Cadastre-se</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 24 }}>
          {[["12.4k", "Voluntários"], ["580", "ONGs"], ["84k h", "Doadas"]].map(([n, l]) => (
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

// ── 2. Cadastro (multi-step) ──────────────────────────────────────────────────
const RegisterScreen = ({ onBack, onDone }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", engine: "", pass: "" });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const steps = [
    // Step 0 — Motor de engajamento
    <div key="0" className="fade-up">
      <h2 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>O que te move? 💡</h2>
      <p style={{ color: G.slate, fontSize: 14, marginBottom: 24 }}>Sua resposta nos ajuda a personalizar as melhores oportunidades para você.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ENGINES.map(e => (
          <div key={e.id} className={`radio-card ${form.engine === e.id ? "selected" : ""}`} onClick={() => upd("engine", e.id)}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{e.icon}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{e.title}</div>
              <div style={{ fontSize: 12, color: G.slate, marginTop: 2 }}>{e.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // Step 1 — Dados pessoais
    <div key="1" className="fade-up">
      <h2 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Seus dados 📋</h2>
      <p style={{ color: G.slate, fontSize: 14, marginBottom: 24 }}>Preencha suas informações básicas.</p>
      {[["name", "Nome completo", "text", "Maria Silva"], ["email", "E-mail", "email", "maria@email.com"], ["phone", "Telefone", "tel", "(11) 99999-9999"], ["city", "Cidade", "text", "São Paulo"]].map(([k, lbl, t, ph]) => (
        <div key={k} style={{ marginBottom: 16 }}>
          <label className="label">{lbl}</label>
          <input className="input" type={t} placeholder={ph} value={form[k]} onChange={e => upd(k, e.target.value)} />
        </div>
      ))}
    </div>,

    // Step 2 — Senha
    <div key="2" className="fade-up">
      <h2 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Crie sua senha 🔐</h2>
      <p style={{ color: G.slate, fontSize: 14, marginBottom: 24 }}>Use pelo menos 8 caracteres.</p>
      <div style={{ marginBottom: 16 }}>
        <label className="label">Senha</label>
        <input className="input" type="password" placeholder="••••••••" value={form.pass} onChange={e => upd("pass", e.target.value)} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label className="label">Confirmar Senha</label>
        <input className="input" type="password" placeholder="••••••••" />
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 16 }}>
        <input type="checkbox" id="terms" />
        <label htmlFor="terms" style={{ fontSize: 13, color: G.slate, lineHeight: 1.5 }}>
          Concordo com os <span style={{ color: G.emerald }}>Termos de Uso</span> e <span style={{ color: G.emerald }}>Política de Privacidade</span>
        </label>
      </div>
    </div>,
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <Blobs />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, width: "100%", margin: "0 auto", padding: "80px 24px 40px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: G.white, cursor: "pointer", padding: 4 }}>
            <Icon name="arrow" size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((step + 1) / 3) * 100}%` }} />
            </div>
          </div>
          <span style={{ fontSize: 12, color: G.slate }}>{step + 1}/3</span>
        </div>

        {steps[step]}

        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          {step > 0 && <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>Voltar</button>}
          <button className="btn-primary" style={{ flex: 2 }} onClick={() => step < 2 ? setStep(s => s + 1) : onDone()}>
            {step < 2 ? "Continuar" : "Criar Conta"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── 3. Home (Oportunidades) ────────────────────────────────────────────────────
const HomeTab = ({ user, onOpportunity }) => {
  const [filter, setFilter] = useState("Todos");
  const cats = ["Todos", "Educação", "Social", "Meio Ambiente", "Saúde"];
  const filtered = filter === "Todos" ? OPPORTUNITIES : OPPORTUNITIES.filter(o => o.category === filter);

  return (
    <div className="page-full">
      {/* Greeting */}
      <div className="fade-up" style={{ marginBottom: 24 }}>
        <p style={{ color: G.slate, fontSize: 13 }}>Bem-vindo de volta 👋</p>
        <h2 className="syne" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em" }}>{user.name}</h2>
      </div>

      {/* Streak banner */}
      <div className="fade-up card" style={{ padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16, animationDelay: ".05s" }}>
        <div style={{ fontSize: 36 }} className="flame">🔥</div>
        <div style={{ flex: 1 }}>
          <div className="syne" style={{ fontSize: 16, fontWeight: 700 }}>{user.streak} dias seguidos!</div>
          <div style={{ fontSize: 12, color: G.slate, marginTop: 2 }}>Continue assim — você está voando!</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: G.slate }}>Próx. marco</div>
          <div className="syne" style={{ fontSize: 15, fontWeight: 700, color: G.amber }}>30 🏆</div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 20, paddingBottom: 4 }} className="fade-up">
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            background: filter === c ? G.emerald : "rgba(255,255,255,.05)",
            color: filter === c ? G.navy : G.slate,
            border: "none", borderRadius: 20, padding: "7px 16px", cursor: "pointer",
            fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
            fontFamily: "'Syne', sans-serif", transition: "all .2s"
          }}>{c}</button>
        ))}
      </div>

      {/* Opportunity cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map((op, i) => (
          <div key={op.id} className="card fade-up" style={{ padding: 20, cursor: "pointer", animationDelay: `${.08 * i}s` }} onClick={() => onOpportunity(op)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span className={`badge badge-${op.badge}`}>{op.category}</span>
              <span style={{ fontSize: 12, color: G.slate }}>{op.spots} vagas</span>
            </div>
            <h3 className="syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{op.title}</h3>
            <p style={{ fontSize: 13, color: G.slate, marginBottom: 14 }}>{op.org}</p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[["calendar", op.date], ["clock", op.time], ["map", op.location]].map(([ic, val]) => (
                <div key={ic} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: G.slate }}>
                  <Icon name={ic} size={13} color={G.slate} /> {val}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── 4. Oportunidade detail + inscrição ────────────────────────────────────────
const OpportunityModal = ({ op, onClose, onConfirm }) => {
  const [enrolled, setEnrolled] = useState(false);
  const confirm = () => { setEnrolled(true); setTimeout(() => { onConfirm(op); onClose(); }, 1200); };
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span className={`badge badge-${op.badge}`}>{op.category}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: G.slate, cursor: "pointer" }}><Icon name="x" size={20} /></button>
        </div>
        <h2 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{op.title}</h2>
        <p style={{ color: G.emerald, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>{op.org}</p>
        <p style={{ color: G.slate, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{op.desc}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[["📅", op.date], ["⏰", op.time], ["📍", op.location], ["⏳", `${op.hours}h de dedicação`]].map(([ic, v]) => (
            <div key={v} style={{ background: "rgba(255,255,255,.04)", borderRadius: 10, padding: "10px 12px", fontSize: 13 }}>
              <span style={{ marginRight: 6 }}>{ic}</span>{v}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: G.slate, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>Habilidades úteis</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {op.skills.map(s => <span key={s} className="badge badge-green">{s}</span>)}
          </div>
        </div>

        {enrolled
          ? <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 40 }}>🎉</div>
            <p className="syne" style={{ fontWeight: 700, marginTop: 8 }}>Inscrição confirmada!</p>
          </div>
          : <button className="btn-primary" style={{ width: "100%", fontSize: 15 }} onClick={confirm}>Quero me inscrever!</button>
        }
      </div>
    </div>
  );
};

// ── 5. Minha Conta + Streak ───────────────────────────────────────────────────
const AccountTab = ({ user, onLogout }) => {
  const achievements = [
    { icon: "🌱", label: "Primeiro Passo", done: true },
    { icon: "🔥", label: "7 dias", done: true },
    { icon: "🏆", label: "30 dias", done: false },
    { icon: "⭐", label: "10 ações", done: false },
  ];
  return (
    <div className="page">
      {/* Profile */}
      <div className="fade-up" style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${G.emerald}, ${G.purple})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 28 }}>
          {user.name[0]}
        </div>
        <h2 className="syne" style={{ fontSize: 22, fontWeight: 800 }}>{user.name}</h2>
        <p style={{ color: G.slate, fontSize: 13, marginTop: 4 }}>{user.email}</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, background: "rgba(0,200,150,.08)", padding: "6px 14px", borderRadius: 20, border: `1px solid rgba(0,200,150,.2)` }}>
          <span style={{ fontSize: 14 }}>💡</span>
          <span style={{ fontSize: 13, color: G.emerald, fontWeight: 600 }}>Motor: {ENGINES.find(e => e.id === user.engine)?.title || "Impacto Social"}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="card fade-up" style={{ padding: 20, marginBottom: 16, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, animationDelay: ".05s" }}>
        {[[user.hours + "h", "Doadas"], [user.actions, "Ações"], [user.streak, "Streak"]].map(([v, l], i) => (
          <div key={l} style={{ textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
            <div className="syne" style={{ fontSize: 22, fontWeight: 800, color: G.emerald }}>{v}</div>
            <div style={{ fontSize: 11, color: G.slate, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Streak visual */}
      <div className="card fade-up" style={{ padding: 20, marginBottom: 16, animationDelay: ".1s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span className="flame" style={{ fontSize: 20 }}>🔥</span>
          <span className="syne" style={{ fontWeight: 700 }}>Streak — {user.streak} dias</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 28, borderRadius: 6, background: i < user.streak ? `rgba(0,200,150,${.5 + i * .03})` : "rgba(255,255,255,.06)", transition: "background .3s" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: G.slate }}>
          <span>14 dias atrás</span><span>Hoje</span>
        </div>
      </div>

      {/* Conquistas */}
      <div className="card fade-up" style={{ padding: 20, marginBottom: 16, animationDelay: ".15s" }}>
        <h3 className="syne" style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🏅 Conquistas</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {achievements.map(a => (
            <div key={a.label} style={{ textAlign: "center", opacity: a.done ? 1 : .35 }}>
              <div style={{ fontSize: 28 }}>{a.icon}</div>
              <div style={{ fontSize: 10, color: a.done ? G.emerald : G.slate, marginTop: 4 }}>{a.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="card fade-up" style={{ padding: 4, marginBottom: 16, animationDelay: ".2s" }}>
        {[["bell", "Notificações"], ["calendar", "Minhas Inscrições"], ["gift", "Programa de Pontos"]].map(([ic, lbl]) => (
          <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,.04)", cursor: "pointer" }}>
            <Icon name={ic} size={18} color={G.slate} />
            <span style={{ fontSize: 14, flex: 1 }}>{lbl}</span>
            <Icon name="chevron" size={16} color={G.slate} />
          </div>
        ))}
      </div>

      <button className="btn-danger" style={{ width: "100%" }} onClick={onLogout}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Icon name="logout" size={16} /> Sair da conta
        </span>
      </button>
    </div>
  );
};

// ── 6. QR Scan + Geolocalização ───────────────────────────────────────────────
const QRTab = ({ onScan }) => {
  const [phase, setPhase] = useState("idle"); // idle | scanning | geo | done
  const [geo, setGeo] = useState(null);

  const startScan = () => {
    setPhase("scanning");
    setTimeout(() => setPhase("geo"), 3000);
  };
  const captureGeo = () => {
    setPhase("loading");
    navigator.geolocation?.getCurrentPosition(
      pos => { setGeo({ lat: pos.coords.latitude.toFixed(5), lng: pos.coords.longitude.toFixed(5) }); setPhase("done"); onScan(); },
      () => { setGeo({ lat: "-23.55052", lng: "-46.63330" }); setPhase("done"); onScan(); }
    );
  };

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="fade-up" style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 className="syne" style={{ fontSize: 24, fontWeight: 800 }}>Check-in</h2>
        <p style={{ color: G.slate, fontSize: 14, marginTop: 6 }}>Confirme sua presença na ação voluntária</p>
      </div>

      {phase === "idle" && (
        <div className="fade-up" style={{ textAlign: "center" }}>
          <div style={{ width: 180, height: 180, borderRadius: 20, background: "rgba(0,200,150,.06)", border: `2px dashed rgba(0,200,150,.3)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
            <Icon name="qr" size={64} color={G.emerald} />
          </div>
          <button className="btn-primary" style={{ fontSize: 15, padding: "14px 40px" }} onClick={startScan}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="camera" size={18} color={G.navy} /> Escanear QR Code</span>
          </button>
        </div>
      )}

      {phase === "scanning" && (
        <div className="fade-in" style={{ textAlign: "center" }}>
          <div style={{ position: "relative", margin: "0 auto 32px" }}>
            <div className="qr-frame">
              <div className="scan-line" />
              {[{ top: 0, left: 0, bt: "3px 0 0 3px" }, { top: 0, right: 0, bt: "3px 3px 0 0" }, { bottom: 0, left: 0, bt: "0 0 3px 3px" }, { bottom: 0, right: 0, bt: "0 3px 3px 0" }].map((s, i) => (
                <div key={i} className="qr-corner" style={{ ...s, borderWidth: 3 }} />
              ))}
            </div>
          </div>
          <p style={{ color: G.slate, fontSize: 14 }}>Aponte para o QR Code da organização…</p>
        </div>
      )}

      {phase === "geo" && (
        <div className="fade-up" style={{ textAlign: "center", width: "100%" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h3 className="syne" style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>QR Lido com sucesso!</h3>
          <p style={{ color: G.slate, fontSize: 13, marginBottom: 28 }}>Agora precisamos confirmar sua localização</p>
          <div className="card" style={{ padding: 20, marginBottom: 24, textAlign: "left" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Icon name="location" size={24} color={G.emerald} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Liberar geolocalização</p>
                <p style={{ fontSize: 12, color: G.slate, marginTop: 4, lineHeight: 1.5 }}>Usaremos sua localização apenas para confirmar que você está no local da ação. Não guardamos histórico.</p>
              </div>
            </div>
          </div>
          <button className="btn-primary" style={{ width: "100%", fontSize: 15 }} onClick={captureGeo}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Icon name="location" size={18} color={G.navy} /> Confirmar localização</span>
          </button>
        </div>
      )}

      {phase === "loading" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📍</div>
          <p style={{ color: G.slate }}>Obtendo localização…</p>
        </div>
      )}

      {phase === "done" && (
        <div className="fade-up" style={{ textAlign: "center", width: "100%" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h3 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Check-in feito!</h3>
          <p style={{ color: G.slate, fontSize: 14, marginBottom: 24 }}>Sua presença foi registrada. Obrigado!</p>
          {geo && (
            <div className="card" style={{ padding: 16, marginBottom: 20, fontSize: 13 }}>
              <div style={{ color: G.slate, marginBottom: 4 }}>Coordenadas capturadas</div>
              <div style={{ color: G.emerald, fontFamily: "monospace" }}>{geo.lat}, {geo.lng}</div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <span className="badge badge-green">+2h registradas</span>
            <span className="badge badge-amber">🔥 Streak +1</span>
          </div>
          <button className="btn-ghost" style={{ marginTop: 24, width: "100%" }} onClick={() => setPhase("idle")}>Novo Check-in</button>
        </div>
      )}
    </div>
  );
};

// ── 7. Doação (mockada) ───────────────────────────────────────────────────────
const DonateTab = () => {
  const [amount, setAmount] = useState(null);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState(null);
  const [done, setDone] = useState(false);

  const amounts = [10, 25, 50, 100];
  const methods = [{ id: "pix", label: "PIX", icon: "⚡" }, { id: "card", label: "Cartão", icon: "💳" }, { id: "boleto", label: "Boleto", icon: "📄" }];

  if (done) return (
    <div className="page" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>💚</div>
      <h2 className="syne" style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Doação recebida!</h2>
      <p style={{ color: G.slate, fontSize: 14, marginBottom: 24, maxWidth: 280, lineHeight: 1.6 }}>Seu apoio faz a diferença. Uma confirmação foi enviada ao seu e-mail.</p>
      <div className="donation-card" style={{ width: "100%", maxWidth: 300, marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: G.slate }}>Valor doado</div>
        <div className="syne" style={{ fontSize: 32, fontWeight: 800, color: G.emerald, marginTop: 4 }}>R$ {amount || custom}</div>
        <div style={{ fontSize: 13, color: G.slate, marginTop: 8 }}>via {methods.find(m => m.id === method)?.label}</div>
      </div>
      <button className="btn-ghost" onClick={() => { setDone(false); setAmount(null); setCustom(""); setMethod(null); }}>Nova doação</button>
    </div>
  );

  return (
    <div className="page">
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h2 className="syne" style={{ fontSize: 24, fontWeight: 800 }}>Fazer uma doação 💚</h2>
        <p style={{ color: G.slate, fontSize: 14, marginTop: 6 }}>Apoie as organizações que você acredita</p>
      </div>

      {/* Featured org */}
      <div className="donation-card fade-up" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `rgba(0,200,150,.15)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤝</div>
          <div>
            <div className="syne" style={{ fontWeight: 700 }}>Mão Amiga ONG</div>
            <div style={{ fontSize: 12, color: G.slate, marginTop: 2 }}>Alimentação para 500 famílias/mês</div>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: G.slate, marginBottom: 6 }}>
            <span>Meta mensal</span><span>R$ 6.800 / R$ 10.000</span>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: "68%" }} /></div>
        </div>
      </div>

      {/* Amount */}
      <div className="fade-up" style={{ marginBottom: 20 }}>
        <label className="label">Valor</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}>
          {amounts.map(a => (
            <button key={a} onClick={() => { setAmount(a); setCustom(""); }} style={{
              background: amount === a ? G.emerald : "rgba(255,255,255,.05)",
              color: amount === a ? G.navy : G.white,
              border: amount === a ? "none" : "1.5px solid rgba(255,255,255,.1)",
              borderRadius: 10, padding: "12px 0", cursor: "pointer",
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
              transition: "all .2s"
            }}>R${a}</button>
          ))}
        </div>
        <input className="input" type="number" placeholder="Outro valor (R$)" value={custom} onChange={e => { setCustom(e.target.value); setAmount(null); }} />
      </div>

      {/* Method */}
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <label className="label">Forma de pagamento</label>
        <div style={{ display: "flex", gap: 8 }}>
          {methods.map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)} style={{
              flex: 1, background: method === m.id ? G.emerald : "rgba(255,255,255,.05)",
              color: method === m.id ? G.navy : G.white,
              border: method === m.id ? "none" : "1.5px solid rgba(255,255,255,.1)",
              borderRadius: 10, padding: "12px 0", cursor: "pointer",
              fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13,
              transition: "all .2s"
            }}>{m.icon}<br />{m.label}</button>
          ))}
        </div>
      </div>

      <button className="btn-primary" style={{ width: "100%", fontSize: 15 }} onClick={() => (amount || custom) && method && setDone(true)}>
        Confirmar Doação {(amount || custom) ? `de R$${amount || custom}` : ""}
      </button>

      <p style={{ textAlign: "center", fontSize: 11, color: G.slate, marginTop: 16 }}>🔒 Pagamento mockado — nenhuma cobrança real será efetuada</p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("login"); // login | register | app
  const [tab, setTab] = useState("home");
  const [selectedOp, setSelectedOp] = useState(null);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState({ name: "Maria Silva", email: "maria@email.com", streak: 7, hours: 14, actions: 5, engine: "impact" });

  const showToast = (msg, icon) => { setToast({ msg, icon }); };

  const onLogin = () => { setScreen("app"); };
  const onRegister = () => { setScreen("register"); };
  const onRegDone = () => { setScreen("app"); showToast("Conta criada com sucesso!", "🎉"); };
  const onLogout = () => { setScreen("login"); setTab("home"); };
  const onEnroll = (op) => { setUser(u => ({ ...u, actions: u.actions + 1 })); showToast(`Inscrito em "${op.title}"!`, "✅"); };
  const onScan = () => { setUser(u => ({ ...u, streak: u.streak + 1, hours: u.hours + 2 })); showToast("Check-in registrado! +2h 🔥", "📍"); };

  const navItems = [
    { id: "home", icon: "home", label: "Início" },
    { id: "qr", icon: "qr", label: "Check-in" },
    { id: "donate", icon: "heart", label: "Doação" },
    { id: "account", icon: "user", label: "Minha Conta" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="noise">
        {screen === "login" && <LoginScreen onLogin={onLogin} onRegister={onRegister} />}
        {screen === "register" && <RegisterScreen onBack={() => setScreen("login")} onDone={onRegDone} />}

        {screen === "app" && (
          <>
            {/* Top nav */}
            <div className="nav">
              <span style={{ fontSize: 20 }}>🌱</span>
              <span className="syne" style={{ fontWeight: 800, fontSize: 16, marginLeft: 8, flex: 1 }}>Kindly</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,200,150,.08)", padding: "5px 12px", borderRadius: 20, border: `1px solid rgba(0,200,150,.15)` }}>
                <span className="flame" style={{ fontSize: 14 }}>🔥</span>
                <span className="syne" style={{ fontSize: 13, fontWeight: 700, color: G.emerald }}>{user.streak}</span>
              </div>
            </div>

            {/* Content */}
            {tab === "home" && <HomeTab user={user} onOpportunity={setSelectedOp} />}
            {tab === "qr" && <QRTab onScan={onScan} />}
            {tab === "donate" && <DonateTab />}
            {tab === "account" && <AccountTab user={user} onLogout={onLogout} />}

            {/* Bottom nav */}
            <div className="bottom-nav">
              {navItems.map(n => (
                <button key={n.id} className={`bottom-nav-btn ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
                  <Icon name={n.icon} size={20} color={tab === n.id ? G.emerald : G.slate} />
                  {n.label}
                </button>
              ))}
            </div>

            {/* Opportunity modal */}
            {selectedOp && <OpportunityModal op={selectedOp} onClose={() => setSelectedOp(null)} onConfirm={onEnroll} />}
          </>
        )}

        {toast && <Toast msg={toast.msg} icon={toast.icon} onDone={() => setToast(null)} />}
      </div>
    </>
  );
}

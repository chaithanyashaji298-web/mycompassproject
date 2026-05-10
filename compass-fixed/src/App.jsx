import { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Compass, BookOpen, Brain, Calendar, BarChart2, Target, Settings,
  LogOut, Send, X, ChevronDown, ChevronRight, CheckCircle, Circle,
  Zap, Clock, Award, TrendingUp, MessageCircle, Play, RotateCcw,
  Sun, Moon, Star, Cpu, Wifi, Shield, Layers, PlusCircle, User,
  ArrowRight, Menu, ChevronUp, Sparkles, HelpCircle, FlaskConical,
  Atom, Calculator, Palette, Code2, Building2, Lightbulb, Trophy,
  RefreshCw, Check, AlertCircle
} from "lucide-react";

// ─── THEME CONFIG ───────────────────────────────────────────────
const EXAM_THEMES = {
  NEET:     { primary: "#0f4c2e", accent: "#10b981", surface: "#0d3b24", text: "#d1fae5", name: "NEET", label: "Medical Entrance" },
  JEE:      { primary: "#0f172a", accent: "#06b6d4", surface: "#0c1222", text: "#cffafe", name: "JEE Mains", label: "Engineering" },
  JEEAD:    { primary: "#1e1b4b", accent: "#7c3aed", surface: "#16133a", text: "#ede9fe", name: "JEE Advanced", label: "IIT Entrance" },
  GATE:     { primary: "#1c1917", accent: "#f59e0b", surface: "#141210", text: "#fef3c7", name: "GATE", label: "Post-Graduate Engineering" },
  NATA:     { primary: "#1e2a3b", accent: "#e879a0", surface: "#16202e", text: "#fce7f3", name: "NATA", label: "Architecture Aptitude" },
  CUSTOM:   { primary: "#1a1a2e", accent: "#f97316", surface: "#13132a", text: "#fed7aa", name: "Custom Exam", label: "Your Path" },
};

// ─── SYLLABUS DATA ───────────────────────────────────────────────
const SYLLABUS = {
  NEET: {
    Physics: ["Physical World & Measurement","Kinematics","Laws of Motion","Work, Energy & Power","Rotational Motion","Gravitation","Properties of Solids & Liquids","Thermodynamics","Kinetic Theory of Gases","Oscillations","Waves","Electrostatics","Current Electricity","Magnetic Effects","Electromagnetic Induction","Optics","Dual Nature of Matter","Atoms & Nuclei","Electronic Devices"],
    Chemistry: ["Basic Concepts","Atomic Structure","Chemical Bonding","States of Matter","Thermodynamics","Equilibrium","Redox Reactions","Hydrogen","s-Block Elements","p-Block Elements","Organic Chemistry Basics","Hydrocarbons","Environmental Chemistry","Solid State","Solutions","Electrochemistry","Chemical Kinetics","Surface Chemistry","d & f Block","Coordination Compounds","Aldehydes & Ketones","Carboxylic Acids","Amines","Polymers","Biomolecules"],
    Biology: ["Diversity of Living Organisms","Structural Organisation","Cell Structure","Plant Physiology","Human Physiology","Reproduction","Genetics & Evolution","Biology in Human Welfare","Biotechnology","Ecology","Cell Division","Biomolecules","Digestion","Breathing & Respiration","Neural Control","Chemical Coordination","Locomotion","Body Fluids","Excretion","Reproductive Health"],
  },
  JEE: {
    Physics: ["Units & Measurement","Kinematics","Newton's Laws","Work & Energy","Rotational Motion","Gravitation","SHM","Waves","Thermodynamics","Electrostatics","Current Electricity","Magnetic Effects","EMI & AC","Optics","Modern Physics","Semiconductors"],
    Chemistry: ["Mole Concept","Atomic Structure","Chemical Bonding","Thermodynamics","Chemical Equilibrium","Electrochemistry","Chemical Kinetics","Organic Nomenclature","Hydrocarbons","Haloalkanes","Alcohols","Carbonyl Compounds","Nitrogen Compounds","Polymers","Coordination Chemistry","p-Block","d-Block"],
    Mathematics: ["Sets & Relations","Trigonometry","Complex Numbers","Matrices","Permutations","Binomial Theorem","Sequences","Limits & Derivatives","Integration","Differential Equations","Coordinate Geometry","Circles","Conics","Vectors","3D Geometry","Probability","Statistics"],
  },
  JEEAD: {
    Physics: ["Mechanics","Thermal Physics","Electricity & Magnetism","Optics & Modern Physics","Experimental Physics"],
    Chemistry: ["Physical Chemistry","Inorganic Chemistry","Organic Chemistry","Analytical Chemistry"],
    Mathematics: ["Algebra","Trigonometry","Analytical Geometry","Differential Calculus","Integral Calculus","Vectors & 3D"],
  },
  GATE: {
    "Engineering Mathematics": ["Linear Algebra","Calculus","Probability","Discrete Mathematics","Graph Theory","Numerical Methods"],
    "Computer Science": ["Algorithms","Data Structures","Operating Systems","DBMS","Computer Networks","Theory of Computation","Compiler Design","Digital Logic","Computer Organization","Programming Languages"],
    "General Aptitude": ["Verbal Ability","Numerical Ability","Logical Reasoning","Data Interpretation"],
  },
  NATA: {
    Mathematics: ["Algebra","Trigonometry","Coordinate Geometry","3D Geometry","Calculus","Statistics"],
    Physics: ["Electrostatics","Current Electricity","Optics","Wave Motion","Modern Physics"],
    "General Aptitude": ["Diagrammatic Reasoning","Numerical Reasoning","Verbal Reasoning","Inductive Logic","Situational Judgment"],
    "Aesthetic Sensitivity": ["Texture & Colour","Proportion & Scale","Building Forms","Architectural Styles","Art History","Perspective Drawing"],
  },
  CUSTOM: {},
};

const STUDY_TIPS = [
  { icon: "🧠", title: "Spaced Repetition", body: "Review material at increasing intervals — after 1 day, 3 days, 1 week, and 1 month. This encodes information into long-term memory more effectively than cramming." },
  { icon: "⏱️", title: "Pomodoro Technique", body: "Study in 25-minute focused sessions followed by a 5-minute break. After 4 sessions, take a longer 15-30 minute break to recharge." },
  { icon: "📝", title: "Active Recall", body: "Instead of re-reading notes, close them and try to recall the key points. This process of retrieval strengthens neural pathways significantly." },
  { icon: "🗺️", title: "Mind Mapping", body: "Create visual diagrams connecting concepts. Start with a central idea and branch out. This helps you see relationships and remember structures." },
  { icon: "🌙", title: "Sleep & Memory", body: "Sleep is when your brain consolidates memories. Aim for 7-8 hours. A short nap after studying can improve retention by up to 40%." },
  { icon: "💧", title: "Hydration Matters", body: "Even mild dehydration can reduce cognitive performance by 10-15%. Keep water nearby and drink regularly throughout your study sessions." },
  { icon: "🎯", title: "Feynman Technique", body: "Explain a concept in simple terms as if teaching a child. If you can't explain it simply, you don't understand it well enough yet." },
  { icon: "📊", title: "Track Your Progress", body: "Regularly assess which topics you know vs. which need work. Focus 80% of effort on weak areas. Don't over-study what you already know." },
];

const MOTIVATIONAL_QUOTES = [
  { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "Education is the most powerful weapon to change the world.", author: "Nelson Mandela" },
];

// ─── HELPERS ────────────────────────────────────────────────────
const getInitials = (name) => name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) || "??";
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

// ─── MAIN APP ────────────────────────────────────────────────────
export default function CompassApp() {
  const [screen, setScreen] = useState("onboard"); // onboard | examSelect | connecting | dashboard
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [theme, setTheme] = useState(EXAM_THEMES.NEET);
  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarSection, setSidebarSection] = useState("dashboard");
  const [connectStep, setConnectStep] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Syllabus completion state: { examKey: { subject: { topic: bool } } }
  const [syllabusState, setSyllabusState] = useState({});

  // Practice state
  const [practiceFilter, setPracticeFilter] = useState({ subject: "", chapter: "", difficulty: "Medium" });
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });

  // Study plan
  const [studyPlan, setStudyPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [manualSessions, setManualSessions] = useState([]);

  // Settings
  const [editSettings, setEditSettings] = useState(false);

  // Progress chart data (mock, 7 days)
  const [chartData] = useState([
    {day:"Mon",progress:12},{day:"Tue",progress:18},{day:"Wed",progress:25},{day:"Thu",progress:31},
    {day:"Fri",progress:38},{day:"Sat",progress:45},{day:"Sun",progress:52},
  ]);

  // Apply theme via CSS vars
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--surface", theme.surface);
    root.style.setProperty("--text-color", theme.text);
  }, [theme]);

  // Tip rotation
  useEffect(() => {
    const t = setInterval(() => {
      setTipIndex(i => (i + 1) % STUDY_TIPS.length);
      setQuoteIndex(i => (i + 1) % MOTIVATIONAL_QUOTES.length);
    }, 10000);
    return () => clearInterval(t);
  }, []);

  // Connecting animation
  useEffect(() => {
    if (screen !== "connecting") return;
    setConnectStep(0);
    const steps = [0,1,2,3,4,5,6];
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setConnectStep(idx);
      if (idx >= 6) {
        clearInterval(interval);
        setTimeout(() => setScreen("dashboard"), 800);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [screen]);

  const handleOnboard = (data) => {
    const newAcc = { ...data, id: Date.now() };
    setAccounts(prev => [...prev, newAcc]);
    setActiveAccount(newAcc);
    setScreen("examSelect");
  };

  const handleExamSelect = (examKey, customName) => {
    const t = EXAM_THEMES[examKey];
    const updatedAccount = { ...activeAccount, exam: examKey, examName: customName || t.name };
    setActiveAccount(updatedAccount);
    setAccounts(prev => prev.map(a => a.id === updatedAccount.id ? updatedAccount : a));
    setTheme(t);
    // Init syllabus state
    const subjects = SYLLABUS[examKey] || {};
    const init = {};
    Object.entries(subjects).forEach(([sub, topics]) => {
      init[sub] = {};
      topics.forEach(t => { init[sub][t] = false; });
    });
    setSyllabusState(init);
    setScreen("connecting");
  };

  const switchAccount = (acc) => {
    setActiveAccount(acc);
    if (acc.exam) {
      setTheme(EXAM_THEMES[acc.exam] || EXAM_THEMES.CUSTOM);
      setScreen("dashboard");
    } else {
      setScreen("examSelect");
    }
  };

  const overallProgress = () => {
    const all = Object.values(syllabusState).flatMap(s => Object.values(s));
    if (!all.length) return 0;
    return Math.round((all.filter(Boolean).length / all.length) * 100);
  };

  const subjectProgress = (sub) => {
    const topics = Object.values(syllabusState[sub] || {});
    if (!topics.length) return 0;
    return Math.round((topics.filter(Boolean).length / topics.length) * 100);
  };

  const toggleTopic = (sub, topic) => {
    setSyllabusState(prev => ({
      ...prev,
      [sub]: { ...prev[sub], [topic]: !prev[sub]?.[topic] }
    }));
  };

  const accentStyle = { color: theme.accent };
  const accentBg = { backgroundColor: theme.accent };
  const surfaceBg = { backgroundColor: theme.surface };
  const primaryBg = { backgroundColor: theme.primary };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: theme.primary, color: "#f1f5f9", minHeight: "100vh", transition: "all 0.5s ease", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }
        .glass { background: rgba(255,255,255,0.04); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08); }
        .glass-strong { background: rgba(255,255,255,0.07); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.12); }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .fade-in { animation: fadeIn 0.6s ease both; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px);} to { opacity:1; transform:translateY(0);} }
        .spin-slow { animation: spinSlow 8s linear infinite; }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        .pulse-ring { animation: pulseRing 2s ease-in-out infinite; }
        @keyframes pulseRing { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.7;transform:scale(1.05);} }
        .blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 50%{opacity:0;} }
        .slide-up { animation: slideUp 0.5s ease both; }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:translateY(0);} }
        .robot-blink { animation: robotBlink 3s ease-in-out infinite; }
        @keyframes robotBlink { 0%,90%,100%{transform:scaleY(1);} 95%{transform:scaleY(0.1);} }
        .antenna-wiggle { animation: antennaWiggle 2s ease-in-out infinite; transform-origin: bottom center; }
        @keyframes antennaWiggle { 0%,100%{transform:rotate(-5deg);} 50%{transform:rotate(5deg);} }
        .particle { animation: floatParticle linear infinite; position:absolute; border-radius:50%; pointer-events:none; }
        @keyframes floatParticle { 0%{transform:translateY(100vh) rotate(0deg);opacity:0;} 10%{opacity:0.6;} 90%{opacity:0.3;} 100%{transform:translateY(-10vh) rotate(360deg);opacity:0;} }
        .progress-ring { transition: stroke-dashoffset 1s ease; }
        .typing-dot { animation: typingDot 1.4s ease-in-out infinite; }
        @keyframes typingDot { 0%,80%,100%{transform:scale(0);opacity:0;} 40%{transform:scale(1);opacity:1;} }
        .grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"); }
        .nav-item { transition: all 0.2s ease; cursor:pointer; border-radius: 10px; padding: 10px 14px; display:flex; align-items:center; gap:10px; }
        .nav-item:hover { background: rgba(255,255,255,0.06); }
        .nav-item.active { background: rgba(255,255,255,0.10); }
        .tab-btn { transition: all 0.2s ease; border-radius:8px; padding:8px 18px; font-size:14px; font-weight:500; border:1px solid transparent; cursor:pointer; }
        .exam-card { transition: all 0.4s ease; cursor:pointer; border-radius:16px; padding:24px; position:relative; overflow:hidden; }
        .exam-card:hover { transform:translateY(-6px) scale(1.02); }
        .message-bubble { animation: messagePop 0.3s cubic-bezier(0.175,0.885,0.32,1.275) both; }
        @keyframes messagePop { from{opacity:0;transform:scale(0.8);} to{opacity:1;transform:scale(1);} }
      `}</style>

      {/* Particle background */}
      <Particles color={theme.accent} />

      {/* Grain overlay */}
      <div className="grain" style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, opacity:0.4 }} />

      {/* Screens */}
      {screen === "onboard"    && <OnboardScreen theme={theme} onSubmit={handleOnboard} />}
      {screen === "examSelect" && <ExamSelectScreen theme={theme} onSelect={handleExamSelect} />}
      {screen === "connecting" && <ConnectingScreen theme={theme} step={connectStep} examName={activeAccount?.examName || "Your Exam"} />}
      {screen === "dashboard"  && (
        <DashboardScreen
          theme={theme} account={activeAccount} accounts={accounts}
          sidebarSection={sidebarSection} setSidebarSection={setSidebarSection}
          syllabusState={syllabusState} toggleTopic={toggleTopic}
          subjectProgress={subjectProgress} overallProgress={overallProgress}
          tipIndex={tipIndex} quoteIndex={quoteIndex}
          chartData={chartData}
          practiceFilter={practiceFilter} setPracticeFilter={setPracticeFilter}
          currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion}
          questionLoading={questionLoading} setQuestionLoading={setQuestionLoading}
          selectedAnswer={selectedAnswer} setSelectedAnswer={setSelectedAnswer}
          sessionScore={sessionScore} setSessionScore={setSessionScore}
          studyPlan={studyPlan} setStudyPlan={setStudyPlan}
          planLoading={planLoading} setPlanLoading={setPlanLoading}
          manualSessions={manualSessions} setManualSessions={setManualSessions}
          onExamChange={(examKey) => { handleExamSelect(examKey); }}
          onAddAccount={() => setScreen("onboard")}
          onSwitchAccount={switchAccount}
          accentStyle={accentStyle} accentBg={accentBg} surfaceBg={surfaceBg} primaryBg={primaryBg}
        />
      )}

      {/* Chatbot */}
      {screen === "dashboard" && (
        <ChatbotWidget
          theme={theme} account={activeAccount}
          chatOpen={chatOpen} setChatOpen={setChatOpen}
          accentStyle={accentStyle} accentBg={accentBg}
        />
      )}
    </div>
  );
}

// ─── PARTICLES ───────────────────────────────────────────────────
function Particles({ color }) {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i, size: 2 + Math.random() * 4,
    left: Math.random() * 100, delay: Math.random() * 15,
    duration: 12 + Math.random() * 20,
  }));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size, left: `${p.left}%`, bottom:0,
          backgroundColor: color, opacity: 0.15,
          animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

// ─── ONBOARD SCREEN ──────────────────────────────────────────────
function OnboardScreen({ theme, onSubmit }) {
  const [form, setForm] = useState({ name:"", email:"", resourceLang:"English", commLang:"English" });
  const [errors, setErrors] = useState({});
  const [spinning, setSpinning] = useState(true);
  const langs = ["English","Hindi","Tamil","Telugu","Malayalam","Bengali","Marathi","Kannada","Gujarati"];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (!Object.keys(e).length) onSubmit(form);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", position:"relative", zIndex:1 }}>
      <div className="fade-in" style={{ width:"100%", maxWidth:480 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:80, height:80, borderRadius:"50%", background:`rgba(255,255,255,0.06)`, border:`2px solid ${theme.accent}`, marginBottom:20, position:"relative" }}>
            <CompassRoseSVG color={theme.accent} size={48} spinning />
          </div>
          <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:36, fontWeight:800, color:"#fff", margin:0, letterSpacing:"-1px" }}>
            COMPASS <span style={{ color: theme.accent }}>for Study</span>
          </h1>
          <p style={{ color:"#94a3b8", marginTop:8, fontSize:15 }}>Navigate your path to success.</p>
        </div>

        {/* Form */}
        <div className="glass-strong" style={{ borderRadius:20, padding:32 }}>
          <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:700, marginBottom:24, color:"#fff" }}>Begin Your Journey</h2>

          {[
            { key:"name", label:"Full Name", type:"text", placeholder:"Enter your full name" },
            { key:"email", label:"Email Address", type:"email", placeholder:"your@email.com" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom:18 }}>
              <label style={{ fontSize:13, color:"#94a3b8", display:"block", marginBottom:6, fontWeight:500 }}>{f.label}</label>
              <input
                type={f.type} placeholder={f.placeholder} value={form[f.key]}
                onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
                style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:`1px solid ${errors[f.key] ? "#ef4444" : "rgba(255,255,255,0.1)"}`, borderRadius:10, padding:"12px 16px", color:"#fff", fontSize:15, outline:"none", transition:"all 0.2s" }}
              />
              {errors[f.key] && <p style={{ color:"#ef4444", fontSize:12, marginTop:4 }}>{errors[f.key]}</p>}
            </div>
          ))}

          {[
            { key:"resourceLang", label:"Language for Resources" },
            { key:"commLang", label:"Language for Communication (Chatbot)" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom:18 }}>
              <label style={{ fontSize:13, color:"#94a3b8", display:"block", marginBottom:6, fontWeight:500 }}>{f.label}</label>
              <select
                value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
                style={{ width:"100%", background:theme.surface, border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 16px", color:"#fff", fontSize:15, outline:"none", cursor:"pointer" }}
              >
                {langs.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          ))}

          <button onClick={handleSubmit} style={{ width:"100%", marginTop:8, padding:"14px", borderRadius:12, background:theme.accent, color:"#fff", fontWeight:700, fontSize:16, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"'Outfit',sans-serif", transition:"all 0.2s" }}
            onMouseOver={e => e.currentTarget.style.opacity="0.9"} onMouseOut={e => e.currentTarget.style.opacity="1"}>
            Begin Your Journey <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPASS ROSE SVG ────────────────────────────────────────────
function CompassRoseSVG({ color, size = 40, spinning }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={spinning ? "spin-slow" : ""} style={{ display:"block" }}>
      <polygon points="50,5 55,45 50,50 45,45" fill={color} opacity="1"/>
      <polygon points="50,95 55,55 50,50 45,55" fill={color} opacity="0.5"/>
      <polygon points="5,50 45,45 50,50 45,55" fill={color} opacity="0.7"/>
      <polygon points="95,50 55,45 50,50 55,55" fill={color} opacity="0.9"/>
      <circle cx="50" cy="50" r="6" fill={color} />
      <circle cx="50" cy="50" r="3" fill="#fff" />
    </svg>
  );
}

// ─── EXAM SELECT SCREEN ──────────────────────────────────────────
function ExamSelectScreen({ theme, onSelect }) {
  const [selected, setSelected] = useState(null);
  const [customModal, setCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState({ name:"", subjects:"", date:"" });

  const exams = [
    { key:"NEET", icon:"🩺", name:"NEET", desc:"Medical Entrance", subjects:"Physics · Chemistry · Biology", color:"#10b981" },
    { key:"JEE", icon:"⚡", name:"JEE Mains", desc:"Engineering Entrance", subjects:"Physics · Chemistry · Maths", color:"#06b6d4" },
    { key:"JEEAD", icon:"🔬", name:"JEE Advanced", desc:"IIT Entrance", subjects:"Physics · Chemistry · Maths", color:"#7c3aed" },
    { key:"GATE", icon:"💻", name:"GATE (CSE)", desc:"Post-Graduate Engineering", subjects:"CS · Engineering Maths · Aptitude", color:"#f59e0b" },
    { key:"NATA", icon:"🏛️", name:"NATA", desc:"Architecture Aptitude", subjects:"Maths · Drawing · Aptitude", color:"#e879a0" },
    { key:"CUSTOM", icon:"🧭", name:"Custom Exam", desc:"Define your own path", subjects:"Your subjects · Your schedule", color:"#f97316" },
  ];

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", position:"relative", zIndex:1 }}>
      <div className="fade-in" style={{ width:"100%", maxWidth:860 }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <CompassRoseSVG color={theme.accent} size={48} spinning />
          <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:34, fontWeight:800, color:"#fff", margin:"16px 0 8px", letterSpacing:"-1px" }}>Choose Your Destination</h1>
          <p style={{ color:"#94a3b8", fontSize:16 }}>Your interface will calibrate to your exam.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:20 }}>
          {exams.map((exam, i) => (
            <div key={exam.key} className="exam-card glass card-hover" style={{ animationDelay:`${i*0.1}s` }}
              onClick={() => { if(exam.key==="CUSTOM"){ setCustomModal(true); return; } setSelected(exam.key); onSelect(exam.key); }}
            >
              <div style={{ fontSize:36, marginBottom:12 }}>{exam.icon}</div>
              <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18, color:"#fff", margin:"0 0 4px" }}>{exam.name}</h3>
              <p style={{ color:exam.color, fontSize:13, fontWeight:600, margin:"0 0 8px" }}>{exam.desc}</p>
              <p style={{ color:"#64748b", fontSize:12 }}>{exam.subjects}</p>
              <div style={{ position:"absolute", top:16, right:16, width:8, height:8, borderRadius:"50%", backgroundColor:exam.color, boxShadow:`0 0 10px ${exam.color}` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Custom Modal */}
      {customModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
          <div className="glass-strong" style={{ borderRadius:20, padding:32, width:"100%", maxWidth:420 }}>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:22, color:"#fff", marginBottom:20 }}>Define Your Exam</h2>
            {[{key:"name",label:"Exam Name",placeholder:"e.g. UPSC, CAT, GRE..."},{key:"subjects",label:"Subjects (comma separated)",placeholder:"Math, Science, GK..."},{key:"date",label:"Exam Date",placeholder:"DD/MM/YYYY"}].map(f => (
              <div key={f.key} style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, color:"#94a3b8", display:"block", marginBottom:6 }}>{f.label}</label>
                <input type="text" placeholder={f.placeholder} value={customForm[f.key]} onChange={e => setCustomForm(p=>({...p,[f.key]:e.target.value}))}
                  style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:14, outline:"none" }} />
              </div>
            ))}
            <div style={{ display:"flex", gap:12, marginTop:8 }}>
              <button onClick={() => setCustomModal(false)} style={{ flex:1, padding:"11px", borderRadius:10, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", color:"#fff", cursor:"pointer", fontWeight:500 }}>Cancel</button>
              <button onClick={() => { setCustomModal(false); onSelect("CUSTOM", customForm.name || "Custom Exam"); }}
                style={{ flex:1, padding:"11px", borderRadius:10, background:theme.accent, border:"none", color:"#fff", cursor:"pointer", fontWeight:700, fontFamily:"'Outfit',sans-serif" }}>
                Set Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CONNECTING SCREEN ────────────────────────────────────────────
function ConnectingScreen({ theme, step, examName }) {
  const steps = [
    { label:"Initializing COMPASS Protocol...", icon:<Cpu size={18}/> },
    { label:"Detecting COMPASS Robot...", icon:<Wifi size={18}/> },
    { label:"Establishing Secure Link...", icon:<Shield size={18}/> },
    { label:`Calibrating to ${examName}...`, icon:<Layers size={18}/> },
    { label:"Loading Your Study Universe...", icon:<Star size={18}/> },
    { label:"✓ COMPASS Robot Connected!", icon:<Check size={18}/> },
  ];

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", zIndex:1 }}>
      {/* Robot */}
      <div style={{ marginBottom:40, position:"relative" }}>
        <RobotSVG color={theme.accent} step={step} />
      </div>

      {/* Steps */}
      <div style={{ width:"100%", maxWidth:420, padding:"0 20px" }}>
        {steps.map((s, i) => (
          <div key={i} className={i < step ? "fade-in" : ""} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14, opacity: i >= step ? 0.3 : 1, transition:"all 0.5s ease" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background: i < step ? theme.accent : "rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"center", color: i < step ? "#fff" : "#64748b", flexShrink:0, transition:"all 0.5s ease", boxShadow: i === step-1 ? `0 0 16px ${theme.accent}` : "none" }}>
              {i === step-1 ? <Check size={16} /> : s.icon}
            </div>
            <span style={{ fontSize:15, color: i < step ? "#fff" : "#475569", fontWeight: i===step-1 ? 600 : 400 }}>
              {s.label} {i===step-1 && i<5 && <span className="blink">|</span>}
            </span>
          </div>
        ))}

        {/* Progress bar */}
        <div style={{ marginTop:24, height:4, borderRadius:2, background:"rgba(255,255,255,0.08)", overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:2, background:theme.accent, width:`${(step/6)*100}%`, transition:"width 1.2s ease", boxShadow:`0 0 8px ${theme.accent}` }} />
        </div>
      </div>
    </div>
  );
}

function RobotSVG({ color, step }) {
  return (
    <svg width="120" height="140" viewBox="0 0 120 140" fill="none" style={{ filter:`drop-shadow(0 0 20px ${color}40)` }}>
      {/* Antennas */}
      <line x1="45" y1="20" x2="35" y2="5" stroke={color} strokeWidth="3" strokeLinecap="round" className="antenna-wiggle" />
      <circle cx="35" cy="5" r="4" fill={color} style={{ animationDelay:"0.3s" }} className="pulse-ring" />
      <line x1="75" y1="20" x2="85" y2="5" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="85" cy="5" r="4" fill={color} />
      {/* Head */}
      <rect x="25" y="20" width="70" height="55" rx="14" fill={`rgba(255,255,255,0.08)`} stroke={color} strokeWidth="1.5" />
      {/* Eyes */}
      <rect x="38" y="36" width="16" height="10" rx="5" fill={color} className="robot-blink" />
      <rect x="66" y="36" width="16" height="10" rx="5" fill={color} className="robot-blink" />
      {/* Mouth */}
      <rect x="42" y="56" width="36" height="6" rx="3" fill={step >= 6 ? color : "rgba(255,255,255,0.2)"} style={{ transition:"all 0.5s" }} />
      {/* Body */}
      <rect x="30" y="82" width="60" height="45" rx="10" fill="rgba(255,255,255,0.06)" stroke={color} strokeWidth="1.5" />
      {/* Chest display */}
      <rect x="42" y="94" width="36" height="22" rx="6" fill={step >= 3 ? `${color}30` : "rgba(0,0,0,0.3)"} stroke={color} strokeWidth="1" style={{ transition:"all 0.5s" }} />
      {step >= 3 && <text x="60" y="109" textAnchor="middle" fill={color} fontSize="8" fontWeight="bold">ON</text>}
      {/* Arms */}
      <rect x="10" y="86" width="14" height="32" rx="7" fill="rgba(255,255,255,0.06)" stroke={color} strokeWidth="1.5" />
      <rect x="96" y="86" width="14" height="32" rx="7" fill="rgba(255,255,255,0.06)" stroke={color} strokeWidth="1.5" />
      {/* Legs */}
      <rect x="37" y="127" width="18" height="12" rx="6" fill="rgba(255,255,255,0.06)" stroke={color} strokeWidth="1.5" />
      <rect x="65" y="127" width="18" height="12" rx="6" fill="rgba(255,255,255,0.06)" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

// ─── DASHBOARD SCREEN ─────────────────────────────────────────────
function DashboardScreen(props) {
  const { theme, account, accounts, sidebarSection, setSidebarSection, syllabusState, toggleTopic, subjectProgress, overallProgress, tipIndex, quoteIndex, chartData, practiceFilter, setPracticeFilter, currentQuestion, setCurrentQuestion, questionLoading, setQuestionLoading, selectedAnswer, setSelectedAnswer, sessionScore, setSessionScore, studyPlan, setStudyPlan, planLoading, setPlanLoading, manualSessions, setManualSessions, onExamChange, onAddAccount, onSwitchAccount, accentStyle, accentBg, surfaceBg, primaryBg } = props;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const navItems = [
    { key:"dashboard", label:"Dashboard", icon:<BarChart2 size={18}/> },
    { key:"syllabus", label:"Syllabus", icon:<BookOpen size={18}/> },
    { key:"tips", label:"Study Tips", icon:<Lightbulb size={18}/> },
    { key:"plan", label:"Study Plan", icon:<Calendar size={18}/> },
    { key:"tracker", label:"Subject Tracker", icon:<Target size={18}/> },
    { key:"practice", label:"Practice", icon:<Brain size={18}/> },
    { key:"settings", label:"Settings", icon:<Settings size={18}/> },
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh", position:"relative", zIndex:1 }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 240 : 72, flexShrink:0, transition:"width 0.3s ease", ...surfaceBg, borderRight:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", padding:"20px 12px", position:"sticky", top:0, height:"100vh", overflow:"hidden" }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28, padding:"0 4px" }}>
          <CompassRoseSVG color={theme.accent} size={32} />
          {sidebarOpen && <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:18, color:"#fff", whiteSpace:"nowrap" }}>COMPASS</span>}
          <button onClick={() => setSidebarOpen(p=>!p)} style={{ marginLeft:"auto", background:"none", border:"none", color:"#64748b", cursor:"pointer", padding:4 }}>
            <Menu size={16} />
          </button>
        </div>

        {/* Avatar */}
        {sidebarOpen && (
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24, padding:"12px", background:"rgba(255,255,255,0.05)", borderRadius:12 }}>
            <div style={{ width:38, height:38, borderRadius:"50%", ...accentBg, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, color:"#fff", flexShrink:0 }}>
              {getInitials(account?.name)}
            </div>
            <div style={{ overflow:"hidden" }}>
              <div style={{ fontSize:14, fontWeight:600, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{account?.name}</div>
              <div style={{ fontSize:11, color:theme.accent }}>{account?.examName}</div>
            </div>
          </div>
        )}

        {/* Nav */}
        <div style={{ flex:1 }}>
          {navItems.map(item => (
            <div key={item.key} className={`nav-item ${sidebarSection===item.key?"active":""}`}
              style={{ color: sidebarSection===item.key ? theme.accent : "#94a3b8" }}
              onClick={() => setSidebarSection(item.key)}>
              <span style={{ color: sidebarSection===item.key ? theme.accent : "#94a3b8", flexShrink:0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ fontSize:14, whiteSpace:"nowrap" }}>{item.label}</span>}
            </div>
          ))}
        </div>

        {/* Bottom actions */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:12 }}>
          <div style={{ position:"relative" }}>
            <div className="nav-item" style={{ color:"#94a3b8" }} onClick={() => setAccountMenuOpen(p=>!p)}>
              <User size={18} />
              {sidebarOpen && <span style={{ fontSize:14 }}>Switch Account</span>}
            </div>
            {accountMenuOpen && sidebarOpen && (
              <div style={{ position:"absolute", bottom:"100%", left:0, right:0, background:theme.surface, border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:8, zIndex:50 }}>
                {accounts.map(acc => (
                  <div key={acc.id} style={{ padding:"8px 10px", borderRadius:8, cursor:"pointer", fontSize:13, color:"#fff", background: acc.id===account?.id ? "rgba(255,255,255,0.08)":"transparent" }}
                    onClick={() => { onSwitchAccount(acc); setAccountMenuOpen(false); }}>
                    {acc.name}
                  </div>
                ))}
                <div style={{ padding:"8px 10px", borderRadius:8, cursor:"pointer", fontSize:13, color:theme.accent, display:"flex", alignItems:"center", gap:6, borderTop:"1px solid rgba(255,255,255,0.06)", marginTop:4 }}
                  onClick={() => { onAddAccount(); setAccountMenuOpen(false); }}>
                  <PlusCircle size={14} /> Add Account
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Top bar */}
        <div style={{ ...surfaceBg, borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:700, color:"#fff", margin:0 }}>
              {getGreeting()}, {account?.name?.split(" ")[0]} 👋
            </h2>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ padding:"5px 12px", borderRadius:20, background:`${theme.accent}20`, border:`1px solid ${theme.accent}40` }}>
              <span style={{ ...accentStyle, fontSize:12, fontWeight:600 }}>{account?.examName}</span>
            </div>
            <div style={{ padding:"5px 12px", borderRadius:20, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ fontSize:12, color:"#94a3b8" }}>{account?.commLang}</span>
            </div>
            <div style={{ padding:"5px 14px", borderRadius:20, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", gap:8 }}>
              <TrendingUp size={13} style={{ color:theme.accent }} />
              <span style={{ fontSize:12, color:"#fff", fontWeight:600 }}>{overallProgress()}%</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"28px" }}>
          {sidebarSection === "dashboard" && <DashboardOverview {...props} />}
          {sidebarSection === "syllabus" && <SyllabusSection {...props} />}
          {sidebarSection === "tips" && <StudyTipsSection theme={props.theme} tipIndex={tipIndex} quoteIndex={quoteIndex} />}
          {sidebarSection === "plan" && <StudyPlanSection {...props} />}
          {sidebarSection === "tracker" && <SubjectTrackerSection {...props} />}
          {sidebarSection === "practice" && <PracticeSection {...props} />}
          {sidebarSection === "settings" && <SettingsSection {...props} onAddAccount={onAddAccount} />}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD OVERVIEW ───────────────────────────────────────────
function DashboardOverview({ theme, overallProgress, chartData, syllabusState, subjectProgress, accentStyle, accentBg, surfaceBg }) {
  const prog = overallProgress();
  const msg = prog < 20 ? "Just getting started! Every journey begins with a single step. 🚀"
    : prog < 50 ? "Good progress! Keep the momentum going. 💪"
    : prog < 75 ? "You're halfway there! Stay consistent. ⚡"
    : prog < 90 ? "Almost there! The finish line is in sight. 🎯"
    : "Outstanding! You're nearly exam-ready! 🏆";

  const badges = [];
  if (prog >= 50) badges.push({ icon:"🥇", label:"50% Complete" });
  if (prog >= 75) badges.push({ icon:"💎", label:"75% Complete" });
  if (prog >= 90) badges.push({ icon:"🏆", label:"90% Complete" });

  return (
    <div className="fade-in">
      {/* Overall readiness hero */}
      <div className="glass" style={{ borderRadius:20, padding:32, marginBottom:24, textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-20, width:150, height:150, borderRadius:"50%", background:`${theme.accent}10`, filter:"blur(40px)" }} />
        <p style={{ color:"#94a3b8", fontSize:14, marginBottom:8 }}>Overall Readiness</p>
        <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:72, fontWeight:900, color:"#fff", lineHeight:1 }}>{prog}<span style={{ fontSize:32, color:theme.accent }}>%</span></div>
        <div style={{ height:8, borderRadius:4, background:"rgba(255,255,255,0.08)", margin:"20px 0 16px", overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:4, background:theme.accent, width:`${prog}%`, transition:"width 1s ease", boxShadow:`0 0 12px ${theme.accent}` }} />
        </div>
        <p style={{ color:"#94a3b8", fontSize:14 }}>{msg}</p>
      </div>

      {/* Quick stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
        {[
          { icon:<BookOpen size={20}/>, label:"Topics Done", value:`${Object.values(syllabusState).flatMap(s=>Object.values(s)).filter(Boolean).length}/${Object.values(syllabusState).flatMap(s=>Object.values(s)).length}` },
          { icon:<Zap size={20}/>, label:"Streak Days", value:"7 🔥" },
          { icon:<Trophy size={20}/>, label:"Badges Earned", value:badges.length || 0 },
        ].map((s,i) => (
          <div key={i} className="glass card-hover" style={{ borderRadius:16, padding:20, textAlign:"center" }}>
            <div style={{ ...accentStyle, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:22, fontWeight:800, color:"#fff" }}>{s.value}</div>
            <div style={{ fontSize:12, color:"#64748b", marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress chart */}
      <div className="glass" style={{ borderRadius:20, padding:24, marginBottom:24 }}>
        <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, color:"#fff", marginBottom:20 }}>7-Day Progress</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData}>
            <XAxis dataKey="day" stroke="#475569" tick={{ fill:"#64748b", fontSize:12 }} />
            <YAxis stroke="#475569" tick={{ fill:"#64748b", fontSize:12 }} />
            <Tooltip contentStyle={{ background:theme.surface, border:`1px solid ${theme.accent}40`, borderRadius:8, color:"#fff" }} />
            <Line type="monotone" dataKey="progress" stroke={theme.accent} strokeWidth={2} dot={{ fill:theme.accent, r:4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="glass" style={{ borderRadius:20, padding:24 }}>
          <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, color:"#fff", marginBottom:16 }}>Badges Earned</h3>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {badges.map((b,i) => (
              <div key={i} style={{ padding:"8px 16px", borderRadius:20, background:`${theme.accent}15`, border:`1px solid ${theme.accent}40`, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:20 }}>{b.icon}</span>
                <span style={{ fontSize:13, color:theme.accent, fontWeight:600 }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SYLLABUS SECTION ─────────────────────────────────────────────
function SyllabusSection({ theme, syllabusState, toggleTopic, subjectProgress, account, accentStyle, accentBg }) {
  const [expanded, setExpanded] = useState({});
  const subjects = Object.keys(syllabusState);

  return (
    <div className="fade-in">
      <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:24, color:"#fff", marginBottom:24 }}>{account?.examName} Syllabus</h2>
      {subjects.length === 0 ? (
        <div className="glass" style={{ borderRadius:16, padding:32, textAlign:"center", color:"#64748b" }}>Custom exam — no syllabus loaded. Use the Practice section to generate questions.</div>
      ) : subjects.map(sub => {
        const prog = subjectProgress(sub);
        const topics = Object.keys(syllabusState[sub] || {});
        const done = Object.values(syllabusState[sub] || {}).filter(Boolean).length;
        return (
          <div key={sub} className="glass card-hover" style={{ borderRadius:16, marginBottom:16, overflow:"hidden" }}>
            <div onClick={() => setExpanded(p=>({...p,[sub]:!p[sub]}))} style={{ padding:"18px 22px", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, color:"#fff", margin:0 }}>{sub}</h3>
                  <span style={{ fontSize:12, color:"#64748b" }}>{done}/{topics.length} topics</span>
                </div>
                <div style={{ height:6, borderRadius:3, background:"rgba(255,255,255,0.08)", overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:3, background:theme.accent, width:`${prog}%`, transition:"width 0.5s ease" }} />
                </div>
              </div>
              <span style={{ ...accentStyle, fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18, marginRight:8 }}>{prog}%</span>
              {expanded[sub] ? <ChevronUp size={18} style={{ color:"#64748b" }} /> : <ChevronDown size={18} style={{ color:"#64748b" }} />}
            </div>
            {expanded[sub] && (
              <div style={{ padding:"0 22px 18px", display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8 }}>
                {topics.map(topic => {
                  const done = syllabusState[sub]?.[topic];
                  return (
                    <div key={topic} onClick={() => toggleTopic(sub, topic)} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", borderRadius:10, cursor:"pointer", background: done ? `${theme.accent}12` : "rgba(255,255,255,0.03)", border:`1px solid ${done ? theme.accent+"40" : "rgba(255,255,255,0.05)"}`, transition:"all 0.2s" }}>
                      {done ? <CheckCircle size={16} style={{ color:theme.accent, flexShrink:0 }} /> : <Circle size={16} style={{ color:"#475569", flexShrink:0 }} />}
                      <span style={{ fontSize:13, color: done ? "#fff" : "#94a3b8", textDecoration: done ? "line-through" : "none", lineHeight:1.3 }}>{topic}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── STUDY TIPS SECTION ───────────────────────────────────────────
function StudyTipsSection({ theme, tipIndex, quoteIndex }) {
  const [currentTip, setCurrentTip] = useState(tipIndex);
  useEffect(() => setCurrentTip(tipIndex), [tipIndex]);

  return (
    <div className="fade-in">
      <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:24, color:"#fff", marginBottom:24 }}>Study Tips & Strategies</h2>

      {/* Featured tip */}
      <div className="glass" style={{ borderRadius:20, padding:32, marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, fontSize:80, opacity:0.06 }}>{STUDY_TIPS[currentTip]?.icon}</div>
        <div style={{ fontSize:36, marginBottom:12 }}>{STUDY_TIPS[currentTip]?.icon}</div>
        <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:22, color:"#fff", marginBottom:12 }}>{STUDY_TIPS[currentTip]?.title}</h3>
        <p style={{ color:"#94a3b8", lineHeight:1.7, fontSize:15 }}>{STUDY_TIPS[currentTip]?.body}</p>
        <div style={{ display:"flex", gap:8, marginTop:16 }}>
          {STUDY_TIPS.map((_, i) => <div key={i} style={{ width: i===currentTip ? 24 : 8, height:8, borderRadius:4, background: i===currentTip ? theme.accent : "rgba(255,255,255,0.15)", transition:"all 0.3s", cursor:"pointer" }} onClick={() => setCurrentTip(i)} />)}
        </div>
      </div>

      {/* All tips grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, marginBottom:24 }}>
        {STUDY_TIPS.map((tip, i) => (
          <div key={i} className="glass card-hover" style={{ borderRadius:16, padding:20, cursor:"pointer", border:`1px solid ${i===currentTip ? theme.accent+"40" : "rgba(255,255,255,0.05)"}` }} onClick={() => setCurrentTip(i)}>
            <div style={{ fontSize:24, marginBottom:8 }}>{tip.icon}</div>
            <h4 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:14, color:"#fff", marginBottom:6 }}>{tip.title}</h4>
            <p style={{ fontSize:12, color:"#64748b", lineHeight:1.5 }}>{tip.body.slice(0,80)}...</p>
          </div>
        ))}
      </div>

      {/* Motivational quote */}
      <div style={{ borderRadius:20, padding:28, background:`${theme.accent}12`, border:`1px solid ${theme.accent}25`, textAlign:"center" }}>
        <div style={{ fontSize:36, marginBottom:12, color:theme.accent }}>"</div>
        <p style={{ fontSize:18, color:"#fff", lineHeight:1.6, fontStyle:"italic", marginBottom:12 }}>{MOTIVATIONAL_QUOTES[quoteIndex]?.quote}</p>
        <p style={{ color:theme.accent, fontSize:13, fontWeight:600 }}>— {MOTIVATIONAL_QUOTES[quoteIndex]?.author}</p>
      </div>
    </div>
  );
}

// ─── STUDY PLAN SECTION ───────────────────────────────────────────
function StudyPlanSection({ theme, account, studyPlan, setStudyPlan, planLoading, setPlanLoading, manualSessions, setManualSessions, syllabusState, accentStyle, accentBg }) {
  const [addForm, setAddForm] = useState({ subject:"", topic:"", duration:"60", time:"09:00", day:"Monday" });
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const [selectedDay, setSelectedDay] = useState("Monday");

  const generatePlan = async () => {
    setPlanLoading(true);
    setStudyPlan(null);
    const subjects = Object.keys(syllabusState);
    const weakSubjects = subjects.filter(s => {
      const vals = Object.values(syllabusState[s] || {});
      const done = vals.filter(Boolean).length;
      return done/vals.length < 0.4;
    });
    try {
      const resp = await fetch("/api/groq", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          prompt:`Generate a daily 8-hour study plan for ${account?.examName} student named ${account?.name}. Focus especially on these weaker subjects: ${weakSubjects.join(", ") || subjects.join(", ")}. Return ONLY a valid JSON object with key "sessions" being an array of objects with fields: time, subject, topic, duration_mins, type. Include short breaks. No markdown, no explanation, just the JSON.`
        })
      });
      const data = await resp.json();
      const clean = (data.text||"").replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setStudyPlan(parsed.sessions || []);
    } catch {
      setStudyPlan([{time:"09:00",subject:"Error",topic:"Could not generate plan. Please try again.",duration_mins:0,type:"error"}]);
    }
    setPlanLoading(false);
  };

  const addSession = () => {
    if (!addForm.subject || !addForm.topic) return;
    setManualSessions(prev => [...prev, { ...addForm, id: Date.now(), done: false }]);
    setAddForm(p => ({ ...p, subject:"", topic:"" }));
  };

  const daysSessions = manualSessions.filter(s => s.day === selectedDay);

  return (
    <div className="fade-in">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:24, color:"#fff", margin:0 }}>Study Plan</h2>
        <button onClick={generatePlan} disabled={planLoading} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 20px", borderRadius:12, background:theme.accent, border:"none", color:"#fff", cursor:"pointer", fontWeight:600, fontSize:14, opacity:planLoading?0.7:1 }}>
          {planLoading ? <><RefreshCw size={16} style={{ animation:"spin 1s linear infinite" }} /> Generating...</> : <><Sparkles size={16} /> AI Suggest Plan</>}
        </button>
      </div>

      {/* AI Plan */}
      {planLoading && (
        <div className="glass" style={{ borderRadius:16, padding:24, textAlign:"center", marginBottom:24 }}>
          <div style={{ ...accentStyle, marginBottom:8 }}><RefreshCw size={24} style={{ animation:"spin 1s linear infinite" }} /></div>
          <p style={{ color:"#94a3b8" }}>COMPASS AI is crafting your personalized study plan...</p>
        </div>
      )}

      {studyPlan && (
        <div className="glass" style={{ borderRadius:20, padding:24, marginBottom:24 }}>
          <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, color:"#fff", marginBottom:16 }}>🤖 AI-Recommended Today's Plan</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {studyPlan.map((session, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderRadius:12, background:`${theme.accent}${session.type==="break"?"08":"12"}`, border:`1px solid ${theme.accent}${session.type==="break"?"20":"30"}` }}>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:13, color:theme.accent, minWidth:50 }}>{session.time}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, color:"#fff", fontWeight:600 }}>{session.subject}</div>
                  <div style={{ fontSize:12, color:"#94a3b8" }}>{session.topic}</div>
                </div>
                <div style={{ fontSize:12, color:"#64748b" }}>{session.duration_mins} min</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {days.map(d => (
          <button key={d} onClick={() => setSelectedDay(d)} style={{ padding:"7px 14px", borderRadius:20, border:`1px solid ${selectedDay===d ? theme.accent : "rgba(255,255,255,0.1)"}`, background: selectedDay===d ? `${theme.accent}20` : "transparent", color: selectedDay===d ? theme.accent : "#94a3b8", cursor:"pointer", fontSize:13, fontWeight:selectedDay===d?600:400, transition:"all 0.2s" }}>
            {d.slice(0,3)}
          </button>
        ))}
      </div>

      {/* Add session */}
      <div className="glass" style={{ borderRadius:16, padding:20, marginBottom:20 }}>
        <h4 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:14, color:"#fff", marginBottom:14 }}>Add Session for {selectedDay}</h4>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
          {[{key:"subject",placeholder:"Subject"},{key:"topic",placeholder:"Topic"},{key:"time",type:"time"},{key:"duration",placeholder:"Duration (mins)"}].map(f => (
            <input key={f.key} type={f.type||"text"} placeholder={f.placeholder} value={addForm[f.key]}
              onChange={e => setAddForm(p=>({...p,[f.key]:e.target.value,"day":selectedDay}))}
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"10px 14px", color:"#fff", fontSize:14, outline:"none" }} />
          ))}
        </div>
        <button onClick={addSession} style={{ padding:"10px 20px", borderRadius:10, ...accentBg, border:"none", color:"#fff", cursor:"pointer", fontSize:14, fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
          <PlusCircle size={16} /> Add Session
        </button>
      </div>

      {/* Sessions list */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {daysSessions.length === 0 && <div style={{ color:"#475569", textAlign:"center", padding:24 }}>No sessions for {selectedDay}. Add some above!</div>}
        {daysSessions.map(s => (
          <div key={s.id} className="glass" style={{ borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
            <div onClick={() => setManualSessions(prev => prev.map(p => p.id===s.id ? {...p,done:!p.done} : p))} style={{ cursor:"pointer" }}>
              {s.done ? <CheckCircle size={20} style={{ color:theme.accent }} /> : <Circle size={20} style={{ color:"#475569" }} />}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, color: s.done?"#64748b":"#fff", fontWeight:600, textDecoration:s.done?"line-through":"none" }}>{s.subject} — {s.topic}</div>
              <div style={{ fontSize:12, color:"#64748b" }}>{s.time} · {s.duration} min</div>
            </div>
            <button onClick={() => setManualSessions(prev => prev.filter(p=>p.id!==s.id))} style={{ background:"none", border:"none", color:"#475569", cursor:"pointer" }}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SUBJECT TRACKER SECTION ──────────────────────────────────────
function SubjectTrackerSection({ theme, syllabusState, subjectProgress, accentStyle }) {
  const subjects = Object.keys(syllabusState);

  const strengthLabel = (prog) => prog < 35 ? "Weak" : prog < 70 ? "Average" : "Strong";
  const strengthColor = (prog) => prog < 35 ? "#ef4444" : prog < 70 ? "#f59e0b" : "#10b981";

  return (
    <div className="fade-in">
      <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:24, color:"#fff", marginBottom:24 }}>Subject Progress Tracker</h2>
      {subjects.length === 0 ? (
        <div className="glass" style={{ borderRadius:16, padding:32, textAlign:"center", color:"#64748b" }}>Complete the syllabus setup to see tracker.</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:20 }}>
          {subjects.map(sub => {
            const prog = subjectProgress(sub);
            const topics = Object.keys(syllabusState[sub] || {});
            const done = Object.values(syllabusState[sub] || {}).filter(Boolean).length;
            const remaining = topics.length - done;
            const r = 54, circ = 2 * Math.PI * r;
            const offset = circ - (prog / 100) * circ;
            return (
              <div key={sub} className="glass card-hover" style={{ borderRadius:20, padding:28, textAlign:"center" }}>
                <svg width={140} height={140} style={{ margin:"0 auto 16px", display:"block" }}>
                  <circle cx={70} cy={70} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
                  <circle cx={70} cy={70} r={r} fill="none" stroke={theme.accent} strokeWidth={10} strokeLinecap="round"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    style={{ transformOrigin:"center", transform:"rotate(-90deg)", transition:"stroke-dashoffset 1s ease" }} />
                  <text x={70} y={66} textAnchor="middle" fill="#fff" fontSize={22} fontWeight="800" fontFamily="Outfit,sans-serif">{prog}%</text>
                  <text x={70} y={84} textAnchor="middle" fill="#64748b" fontSize={11}>{done}/{topics.length}</text>
                </svg>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18, color:"#fff", marginBottom:8 }}>{sub}</h3>
                <div style={{ display:"flex", justifyContent:"center", gap:16, fontSize:13, color:"#64748b", marginBottom:12 }}>
                  <span>✅ {done} done</span>
                  <span>📚 {remaining} left</span>
                </div>
                <div style={{ display:"inline-block", padding:"4px 14px", borderRadius:20, background:`${strengthColor(prog)}20`, color:strengthColor(prog), fontSize:12, fontWeight:700, border:`1px solid ${strengthColor(prog)}40` }}>
                  {strengthLabel(prog)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PRACTICE SECTION ─────────────────────────────────────────────
function PracticeSection({ theme, account, syllabusState, practiceFilter, setPracticeFilter, currentQuestion, setCurrentQuestion, questionLoading, setQuestionLoading, selectedAnswer, setSelectedAnswer, sessionScore, setSessionScore, accentStyle, accentBg }) {
  const subjects = Object.keys(syllabusState);
  const chapters = practiceFilter.subject ? Object.keys(syllabusState[practiceFilter.subject] || {}) : [];
  const difficulties = ["Easy", "Medium", "Hard"];

  const fetchQuestion = async () => {
    setQuestionLoading(true);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    const sub = practiceFilter.subject || (subjects[0] || "General");
    const chap = practiceFilter.chapter || "any topic";
    try {
      const resp = await fetch("/api/groq", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          prompt:`Generate 1 multiple choice question for ${account?.examName} on ${sub} - ${chap} at ${practiceFilter.difficulty} difficulty level. Return ONLY a valid JSON object with exactly these fields: {"question":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct":"A","explanation":"..."}. The correct field must be one of A, B, C, or D. No markdown, no extra text, just the JSON object.`
        })
      });
      const data = await resp.json();
      const clean = (data.text||"").replace(/```json|```/g,"").trim();
      setCurrentQuestion(JSON.parse(clean));
    } catch {
      setCurrentQuestion({ question:"Could not load question. Please check connection and try again.", options:{A:"Try again",B:"",C:"",D:""}, correct:"A", explanation:"" });
    }
    setQuestionLoading(false);
  };

  const handleAnswer = (opt) => {
    if (selectedAnswer) return;
    setSelectedAnswer(opt);
    setSessionScore(prev => ({ correct: prev.correct + (opt === currentQuestion?.correct ? 1 : 0), total: prev.total + 1 }));
  };

  const optColor = (opt) => {
    if (!selectedAnswer) return "rgba(255,255,255,0.05)";
    if (opt === currentQuestion?.correct) return `${theme.accent}30`;
    if (opt === selectedAnswer && opt !== currentQuestion?.correct) return "rgba(239,68,68,0.2)";
    return "rgba(255,255,255,0.03)";
  };
  const optBorder = (opt) => {
    if (!selectedAnswer) return "rgba(255,255,255,0.08)";
    if (opt === currentQuestion?.correct) return `${theme.accent}60`;
    if (opt === selectedAnswer && opt !== currentQuestion?.correct) return "rgba(239,68,68,0.4)";
    return "rgba(255,255,255,0.05)";
  };

  return (
    <div className="fade-in">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:24, color:"#fff", margin:0 }}>Practice Questions</h2>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ padding:"6px 14px", borderRadius:20, background:`${theme.accent}15`, border:`1px solid ${theme.accent}30` }}>
            <span style={{ ...accentStyle, fontSize:13, fontWeight:600 }}>{sessionScore.correct}/{sessionScore.total} Correct</span>
          </div>
          {sessionScore.total > 0 && <div style={{ fontSize:13, color:"#94a3b8" }}>{Math.round((sessionScore.correct/sessionScore.total)*100)}% Accuracy</div>}
        </div>
      </div>

      {/* Filters */}
      <div className="glass" style={{ borderRadius:16, padding:20, marginBottom:20, display:"flex", gap:14, flexWrap:"wrap", alignItems:"center" }}>
        <select value={practiceFilter.subject} onChange={e=>setPracticeFilter(p=>({...p,subject:e.target.value,chapter:""}))}
          style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"9px 14px", color:"#fff", fontSize:14, outline:"none", cursor:"pointer" }}>
          <option value="">All Subjects</option>
          {subjects.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        {chapters.length > 0 && (
          <select value={practiceFilter.chapter} onChange={e=>setPracticeFilter(p=>({...p,chapter:e.target.value}))}
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"9px 14px", color:"#fff", fontSize:14, outline:"none", cursor:"pointer" }}>
            <option value="">All Chapters</option>
            {chapters.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <div style={{ display:"flex", gap:8 }}>
          {difficulties.map(d=>(
            <button key={d} onClick={()=>setPracticeFilter(p=>({...p,difficulty:d}))} style={{ padding:"8px 16px", borderRadius:10, border:`1px solid ${practiceFilter.difficulty===d?theme.accent:"rgba(255,255,255,0.1)"}`, background:practiceFilter.difficulty===d?`${theme.accent}20`:"transparent", color:practiceFilter.difficulty===d?theme.accent:"#94a3b8", cursor:"pointer", fontSize:13, fontWeight:practiceFilter.difficulty===d?600:400, transition:"all 0.2s" }}>
              {d}
            </button>
          ))}
        </div>
        <button onClick={fetchQuestion} disabled={questionLoading} style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8, padding:"10px 20px", borderRadius:12, ...accentBg, border:"none", color:"#fff", cursor:"pointer", fontWeight:600, fontSize:14, opacity:questionLoading?0.7:1 }}>
          {questionLoading ? <><RefreshCw size={16} style={{ animation:"spin 1s linear infinite" }} /> Loading...</> : <><Play size={16} /> Get Question</>}
        </button>
      </div>

      {/* Question card */}
      {questionLoading && (
        <div className="glass" style={{ borderRadius:20, padding:40, textAlign:"center" }}>
          <div style={{ ...accentStyle, marginBottom:12 }}><Brain size={32} style={{ animation:"pulse 1s ease-in-out infinite" }} /></div>
          <p style={{ color:"#94a3b8" }}>Generating your question...</p>
        </div>
      )}

      {currentQuestion && !questionLoading && (
        <div className="glass slide-up" style={{ borderRadius:20, padding:28 }}>
          <p style={{ fontSize:16, color:"#fff", lineHeight:1.7, marginBottom:24, fontWeight:500 }}>{currentQuestion.question}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
            {Object.entries(currentQuestion.options || {}).map(([opt, text]) => text && (
              <div key={opt} onClick={() => handleAnswer(opt)} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderRadius:12, background:optColor(opt), border:`1px solid ${optBorder(opt)}`, cursor:selectedAnswer?"default":"pointer", transition:"all 0.3s" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background: selectedAnswer && opt===currentQuestion?.correct ? theme.accent : "rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, color:"#fff", flexShrink:0, transition:"all 0.3s" }}>{opt}</div>
                <span style={{ fontSize:14, color: selectedAnswer && opt===currentQuestion?.correct ? "#fff" : "#cbd5e1" }}>{text}</span>
                {selectedAnswer && opt === currentQuestion?.correct && <CheckCircle size={18} style={{ color:theme.accent, marginLeft:"auto" }} />}
                {selectedAnswer && opt === selectedAnswer && opt !== currentQuestion?.correct && <X size={18} style={{ color:"#ef4444", marginLeft:"auto" }} />}
              </div>
            ))}
          </div>

          {selectedAnswer && currentQuestion.explanation && (
            <div style={{ padding:"16px 20px", borderRadius:12, background:`${theme.accent}12`, border:`1px solid ${theme.accent}25`, marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:theme.accent, marginBottom:6 }}>Explanation</div>
              <p style={{ fontSize:14, color:"#94a3b8", lineHeight:1.6, margin:0 }}>{currentQuestion.explanation}</p>
            </div>
          )}

          {selectedAnswer && (
            <button onClick={fetchQuestion} style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 24px", borderRadius:12, ...accentBg, border:"none", color:"#fff", cursor:"pointer", fontWeight:600, fontSize:14 }}>
              Next Question <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}

      {!currentQuestion && !questionLoading && (
        <div className="glass" style={{ borderRadius:20, padding:40, textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🧠</div>
          <p style={{ color:"#94a3b8", marginBottom:20 }}>Select filters and click "Get Question" to start practicing!</p>
          <button onClick={fetchQuestion} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"12px 28px", borderRadius:12, ...accentBg, border:"none", color:"#fff", cursor:"pointer", fontWeight:600, fontSize:15 }}>
            <Play size={18} /> Start Practice
          </button>
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS SECTION ─────────────────────────────────────────────
function SettingsSection({ theme, account, accounts, onAddAccount, onSwitchAccount, accentBg, accentStyle, surfaceBg }) {
  const [form, setForm] = useState({ name: account?.name||"", email: account?.email||"" });
  const [saved, setSaved] = useState(false);
  const langs = ["English","Hindi","Tamil","Telugu","Malayalam","Bengali","Marathi","Kannada","Gujarati"];

  return (
    <div className="fade-in" style={{ maxWidth:560 }}>
      <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:24, color:"#fff", marginBottom:24 }}>Settings</h2>

      <div className="glass" style={{ borderRadius:20, padding:28, marginBottom:20 }}>
        <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, color:"#fff", marginBottom:20 }}>Profile</h3>
        {[{key:"name",label:"Full Name",type:"text"},{key:"email",label:"Email",type:"email"}].map(f=>(
          <div key={f.key} style={{ marginBottom:16 }}>
            <label style={{ fontSize:13, color:"#94a3b8", display:"block", marginBottom:6 }}>{f.label}</label>
            <input type={f.type} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
              style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:14, outline:"none" }} />
          </div>
        ))}
        <button onClick={()=>setSaved(true)} style={{ padding:"10px 22px", borderRadius:10, ...accentBg, border:"none", color:"#fff", cursor:"pointer", fontSize:14, fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
          {saved ? <><Check size={16}/> Saved!</> : "Save Changes"}
        </button>
      </div>

      <div className="glass" style={{ borderRadius:20, padding:28, marginBottom:20 }}>
        <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, color:"#fff", marginBottom:16 }}>Exam & Language</h3>
        <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
          <div style={{ padding:"8px 16px", borderRadius:20, background:`${theme.accent}20`, border:`1px solid ${theme.accent}40` }}>
            <span style={{ ...accentStyle, fontSize:13, fontWeight:700 }}>{account?.examName}</span>
          </div>
          <span style={{ color:"#64748b", fontSize:13 }}>Current exam</span>
        </div>
        <p style={{ color:"#475569", fontSize:13 }}>To change your exam, go back to exam selection. Note: this will reset your progress.</p>
      </div>

      <div className="glass" style={{ borderRadius:20, padding:28 }}>
        <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, color:"#fff", marginBottom:16 }}>Accounts ({accounts.length})</h3>
        {accounts.map(acc => (
          <div key={acc.id} onClick={() => onSwitchAccount(acc)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px", borderRadius:12, marginBottom:8, cursor:"pointer", background: acc.id===account?.id ? `${theme.accent}12` : "rgba(255,255,255,0.03)", border:`1px solid ${acc.id===account?.id ? theme.accent+"40" : "rgba(255,255,255,0.06)"}`, transition:"all 0.2s" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:theme.accent, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, color:"#fff" }}>{getInitials(acc.name)}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, color:"#fff", fontWeight:600 }}>{acc.name}</div>
              <div style={{ fontSize:12, color:"#64748b" }}>{acc.email} · {acc.examName||"No exam"}</div>
            </div>
            {acc.id===account?.id && <div style={{ width:8, height:8, borderRadius:"50%", background:theme.accent }} />}
          </div>
        ))}
        <button onClick={onAddAccount} style={{ marginTop:12, display:"flex", alignItems:"center", gap:8, padding:"10px 20px", borderRadius:10, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#fff", cursor:"pointer", fontSize:14, fontWeight:500 }}>
          <PlusCircle size={16} style={{ ...accentStyle }} /> Add Another Account
        </button>
      </div>
    </div>
  );
}

// ─── CHATBOT WIDGET ───────────────────────────────────────────────
function ChatbotWidget({ theme, account, chatOpen, setChatOpen, accentStyle, accentBg }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = ["Explain a concept 💡","Solve my doubt 🤔","Give formula list 📋","Motivate me! 🔥"];

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([{ role:"assistant", content:`Hello ${account?.name?.split(" ")[0]}! 👋 I'm COMPASS AI, your dedicated study assistant for **${account?.examName}**. I'll respond in **${account?.commLang}**. How can I help you today?` }]);
    }
  }, [chatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role:"user", content:msg }]);
    setLoading(true);

    const history = messages.map(m => ({ role:m.role, content:m.content }));

    try {
      const resp = await fetch("/api/groq", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          systemPrompt:`You are COMPASS AI, an expert study assistant for ${account?.examName}. You explain concepts clearly in ${account?.commLang}. You are encouraging, precise, and use examples relevant to Indian students. Format responses with clear structure and use emojis sparingly to make learning engaging.`,
          prompt:[...history, { role:"user", content:msg }]
        })
      });
      const data = await resp.json();
      const reply = data.text || "I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role:"assistant", content:reply }]);
    } catch {
      setMessages(prev => [...prev, { role:"assistant", content:"Connection error. Please check your network and try again." }]);
    }
    setLoading(false);
  };

  const renderText = (text) => {
    // Simple markdown-ish rendering
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* FAB */}
      <button onClick={() => setChatOpen(p=>!p)} className="pulse-ring" style={{ position:"fixed", bottom:28, right:28, width:60, height:60, borderRadius:"50%", ...accentBg, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 24px ${theme.accent}60`, zIndex:200, transition:"all 0.3s" }}>
        {chatOpen ? <X size={24} color="#fff" /> : <CompassRoseSVG color="#fff" size={28} />}
      </button>

      {/* Chat drawer */}
      <div style={{ position:"fixed", right: chatOpen ? 0 : "-420px", top:0, bottom:0, width:400, zIndex:150, transition:"right 0.4s cubic-bezier(0.25,0.8,0.25,1)", display:"flex", flexDirection:"column", background: theme.surface, borderLeft:`1px solid rgba(255,255,255,0.08)`, boxShadow:"-10px 0 60px rgba(0,0,0,0.5)" }}>
        {/* Header */}
        <div style={{ padding:"18px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <RobotSVG color={theme.accent} step={6} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, color:"#fff" }}>COMPASS AI</div>
            <div style={{ fontSize:11, color:theme.accent }}>{account?.examName} · {account?.commLang}</div>
          </div>
          <button onClick={() => setChatOpen(false)} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer", padding:4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Quick prompts */}
        <div style={{ padding:"12px 16px 0", display:"flex", gap:6, flexWrap:"wrap", flexShrink:0 }}>
          {quickPrompts.map(p => (
            <button key={p} onClick={() => sendMessage(p)} style={{ padding:"5px 10px", borderRadius:16, border:`1px solid ${theme.accent}40`, background:`${theme.accent}10`, color:theme.accent, fontSize:11, cursor:"pointer", fontWeight:500, whiteSpace:"nowrap" }}>
              {p}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px" }}>
          {messages.map((msg, i) => (
            <div key={i} className="message-bubble" style={{ display:"flex", justifyContent: msg.role==="user" ? "flex-end" : "flex-start", marginBottom:12 }}>
              <div style={{ maxWidth:"85%", padding:"12px 16px", borderRadius: msg.role==="user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.role==="user" ? theme.accent : "rgba(255,255,255,0.07)", color:"#fff", fontSize:14, lineHeight:1.6, backdropFilter: msg.role==="assistant" ? "blur(12px)" : "none", border: msg.role==="assistant" ? "1px solid rgba(255,255,255,0.1)" : "none" }}
                dangerouslySetInnerHTML={{ __html: renderText(msg.content) }} />
            </div>
          ))}
          {loading && (
            <div style={{ display:"flex", gap:8, padding:"12px 16px", background:"rgba(255,255,255,0.07)", borderRadius:"18px 18px 18px 4px", width:"fit-content", border:"1px solid rgba(255,255,255,0.1)" }}>
              {[0,1,2].map(i => <div key={i} className="typing-dot" style={{ width:8, height:8, borderRadius:"50%", background:theme.accent, animationDelay:`${i*0.2}s` }} />)}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding:"16px", borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", gap:10, flexShrink:0 }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key==="Enter" && sendMessage()}
            placeholder="Ask anything..."
            style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"11px 16px", color:"#fff", fontSize:14, outline:"none" }}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ width:44, height:44, borderRadius:12, ...accentBg, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", opacity: loading||!input.trim() ? 0.5 : 1, flexShrink:0 }}>
            <Send size={18} color="#fff" />
          </button>
        </div>
      </div>
    </>
  );
}

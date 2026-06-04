import { useState, useEffect } from "react";

// ── THEME ──────────────────────────────────────────────────────────────────
const T = {
  bg: "#F4F1EC",
  surface: "#FFFFFF",
  card: "#FAFAF8",
  border: "#E2DDD5",
  accent: "#B5821E",
  accentDim: "#D4A83A",
  teal: "#1A7A7A",
  tealDim: "#0F5252",
  red: "#C0392B",
  green: "#1E8449",
  blue: "#1A5F8A",
  purple: "#6C3483",
  orange: "#C4622D",
  text: "#1A1A1A",
  muted: "#888078",
  mutedLight: "#5A5248",
};

const TODAY = new Date().toISOString().split("T")[0];
const NOW = new Date();

function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" });
}
function daysLeft(due) {
  if (!due) return null;
  return Math.ceil((new Date(due + "T00:00:00") - NOW) / 86400000);
}
function isOverdue(due, done) { return !done && due && due < TODAY; }
function dueBadge(due, done) {
  if (done) return { label: "Done", color: T.green };
  if (!due) return null;
  const d = daysLeft(due);
  if (d < 0) return { label: `${Math.abs(d)}d overdue`, color: T.red };
  if (d === 0) return { label: "Today", color: T.orange };
  if (d <= 2) return { label: `${d}d left`, color: T.accent };
  return { label: fmtDate(due), color: T.mutedLight };
}

// ── LOCAL STORAGE HOOK ─────────────────────────────────────────────────────
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
}

// ── SEED DATA ───────────────────────────────────────────────────────────────
const SEED_CONTACTS = [
  { id: 1, name: "Prakash Anna", role: "Landowner", category: "Della", city: "Hyderabad", phone: "", email: "", deal: "Kesaram 118 ac", status: "Active", notes: "Three open Qs: sales assurance, land value guarantee, withdrawal timeline. Term sheet in progress.", log: [{ date: "2026-06-03", text: "WhatsApp sent — CDDMO proposal shared. Awaiting formal response." }, { date: "2026-05-28", text: "Meeting with Jimmy sir and Della team. MOM to be drafted." }] },
  { id: 2, name: "Jimmy sir", role: "Della Team", category: "Della", city: "Mumbai", phone: "", email: "", deal: "Kesaram Hyderabad + Raipur", status: "Active", notes: "Key coordinator for Della official response. Needs MOM and updated term sheet.", log: [{ date: "2026-06-02", text: "Call done. MOM drafting assigned to ACC." }] },
  { id: 3, name: "Rishabh", role: "Landowner", category: "Della", city: "Raipur", phone: "", email: "", deal: "Konari Lake Como", status: "Active", notes: "RERA co-promoter structure confirmed in principle. Mumbai meeting date pending.", log: [{ date: "2026-06-01", text: "Email sent — RERA co-promoter confirmation. Response awaited." }] },
  { id: 4, name: "Sandeep Agarwall", role: "Investor", category: "V21", city: "Mumbai", phone: "", email: "", deal: "V21 Group — 5 projects", status: "Warm", notes: "Full meeting playbook presented. Investment appetite and next steps to be confirmed.", log: [{ date: "2026-06-02", text: "Presented 5 V21 projects. Sandeep asked for detailed financial model on Shewalwadi." }] },
  { id: 5, name: "Indore Investor", role: "Investor", category: "V21", city: "Indore", phone: "", email: "", deal: "Bheru Pipliya 14 ac", status: "Warm", notes: "Counter-offer from landowner to be shared. Need to gauge investor comfort with revised land cost.", log: [] },
  { id: 6, name: "C&W Team", role: "Consultant", category: "Della", city: "Mumbai", phone: "", email: "", deal: "MIDC MMR Feasibility", status: "Active", notes: "Feasibility report requested. Follow up on MIDC data and timelines.", log: [{ date: "2026-05-30", text: "Email sent requesting feasibility data. No response yet." }] },
];
const SEED_TASKS = [
  { id: 101, title: "Draft MOM — Kesaram Hyderabad meeting", project: "Kesaram Hyderabad", priority: "High", due: "2026-06-07", done: false, subhead: "Documentation" },
  { id: 102, title: "Send term sheet to Prakash Anna", project: "Kesaram Hyderabad", priority: "High", due: "2026-06-08", done: false, subhead: "Landowner / Legal" },
  { id: 103, title: "Confirm Mumbai meeting date with Rishabh", project: "Raipur Konari", priority: "High", due: "2026-06-07", done: false, subhead: "Landowner / Legal" },
  { id: 104, title: "Send RERA co-promoter structure note", project: "Raipur Konari", priority: "Medium", due: "2026-06-09", done: false, subhead: "Documentation" },
  { id: 105, title: "Counter-offer response — Bheru Pipliya Indore", project: "Indore Bheru Pipliya", priority: "High", due: "2026-06-06", done: false, subhead: "Landowner / Legal" },
  { id: 106, title: "Send financial model to Sandeep Agarwall", project: "Shewalwadi Pune", priority: "High", due: "2026-06-08", done: false, subhead: "Financial Modeling" },
  { id: 107, title: "NCLT status check — Park Marina Dadar", project: "Park Marina Dadar", priority: "Medium", due: "2026-06-10", done: false, subhead: "Deal Structuring" },
  { id: 108, title: "Follow up C&W on MIDC feasibility report", project: "MIDC MMR", priority: "Medium", due: "2026-06-06", done: false, subhead: "Follow-ups" },
  { id: 109, title: "Prepare Shewalwadi MOU gap-note for landowner", project: "Shewalwadi Pune", priority: "Low", due: "2026-06-12", done: false, subhead: "Documentation" },
  { id: 110, title: "Della Pune sourcing pipeline update", project: "Kesaram Hyderabad", priority: "Low", due: "2026-06-15", done: false, subhead: "Internal Tasks" },
];
const SEED_FOLLOWUPS = [
  { id: 201, contact: "Prakash Anna", channel: "WhatsApp", topic: "Term sheet response on Kesaram", due: "2026-06-06", done: false, priority: "High" },
  { id: 202, contact: "Jimmy sir", channel: "WhatsApp", topic: "MOM sign-off and Della official stance", due: "2026-06-07", done: false, priority: "High" },
  { id: 203, contact: "Rishabh", channel: "Call", topic: "Mumbai meeting date confirmation", due: "2026-06-07", done: false, priority: "High" },
  { id: 204, contact: "Sandeep Agarwall", channel: "Email", topic: "Investment appetite + next meeting", due: "2026-06-08", done: false, priority: "Medium" },
  { id: 205, contact: "C&W Team", channel: "Email", topic: "Feasibility report status — MIDC", due: "2026-06-06", done: false, priority: "Medium" },
  { id: 206, contact: "Indore Investor", channel: "WhatsApp", topic: "Counter-offer comfort check — Bheru Pipliya", due: "2026-06-09", done: false, priority: "Medium" },
];
const PIPELINE_STAGES = ["Sourcing", "Initial Meeting", "IM / Proposal Sent", "Negotiation", "Term Sheet", "MOU / LOI", "Closed"];
const SEED_DEALS = [
  { id: 301, name: "Kesaram Hyderabad", landowner: "Prakash Anna", type: "CDDMO", acres: 118, city: "Hyderabad", stage: "Negotiation", value: 420, note: "Della partnership. Term sheet due." },
  { id: 302, name: "Raipur Konari Lake Como", landowner: "Rishabh", type: "CDDMO", acres: 85, city: "Raipur", stage: "Term Sheet", value: 280, note: "RERA co-promoter confirmed. Mumbai meeting pending." },
  { id: 303, name: "Indore Bheru Pipliya", landowner: "Indore Investor", type: "JV", acres: 14, city: "Indore", stage: "Negotiation", value: 90, note: "Counter-offer to be sent. Landowner expectation high." },
  { id: 304, name: "Park Marina Dadar", landowner: "NCLT Trustee", type: "Redevelopment", acres: 2.5, city: "Mumbai", stage: "Initial Meeting", value: 650, note: "NCLT process ongoing. Legal clarity pending." },
  { id: 305, name: "MIDC MMR C&W", landowner: "MIDC Authority", type: "Commercial", acres: 40, city: "Mumbai", stage: "IM / Proposal Sent", value: 380, note: "C&W feasibility awaited." },
  { id: 306, name: "Shewalwadi Pune", landowner: "Local Landowner", type: "Plotted JV", acres: 22, city: "Pune", stage: "MOU / LOI", value: 120, note: "MOU gap-note to be sent. Financial model ready." },
];

const WA_TEMPLATES = {
  "Landowner": [
    { label: "Meeting Reminder", text: "Hi {name},\n\nThis is a quick reminder for our meeting scheduled on {date}. Looking forward to connecting and discussing the next steps on {deal}.\n\nPlease confirm your availability.\n\nRegards\nVijey Agrawwal\nAssets Creators" },
    { label: "Follow-up After Meeting", text: "Hi {name},\n\nThank you for the time today. Really appreciate the conversation.\n\nAs discussed, I will be sending you the proposal / term sheet by {date}. Please feel free to reach out for any queries.\n\nRegards\nVijey" },
    { label: "Term Sheet Nudge", text: "Hi {name},\n\nHope you are doing well. Wanted to check if you had a chance to review the term sheet shared for {deal}.\n\nWould love to hear your thoughts and take this forward. Shall we connect for a quick 15 min call this week?\n\nRegards\nVijey" },
  ],
  "Investor": [
    { label: "Intro Outreach", text: "Hi {name},\n\nThis is Vijey Agrawwal from Assets Creators, Pune. We are a real estate advisory firm working on structured finance and JV mandates across Pune, Mumbai, Hyderabad, and Indore.\n\nWould love to share a brief on an exciting opportunity — {deal}. Open for a quick 15 min call at your convenience?\n\nRegards\nVijey" },
    { label: "Post-meeting Follow-up", text: "Hi {name},\n\nThank you for the time today. It was a great conversation.\n\nAs discussed, I am sharing the project brief and financial summary for {deal}. Please go through it and let me know your thoughts.\n\nHappy to connect again to take this forward.\n\nRegards\nVijey" },
    { label: "Gentle Reminder", text: "Hi {name},\n\nHope all is well. Just following up on the project brief I shared for {deal}.\n\nWould love your feedback when convenient. We are at a stage where early conversations can be very valuable.\n\nRegards\nVijey" },
  ],
  "Developer": [
    { label: "Partnership Proposal", text: "Hi {name},\n\nHope you are doing well. We have an interesting land parcel opportunity that aligns well with your development pipeline — {deal}.\n\nWould love to present the details and explore a JV or DM structure. Are you available this week for a brief call?\n\nRegards\nVijey Agrawwal\nAssets Creators" },
  ],
  "Consultant": [
    { label: "Report Follow-up", text: "Hi {name},\n\nHope all is well. Wanted to follow up on the {deal} report / analysis we had discussed.\n\nCould you share a status update? We are working on a timeline and want to align accordingly.\n\nRegards\nVijey" },
  ],
};
const EMAIL_TEMPLATES = {
  "Landowner": [
    { label: "CDDMO Proposal Cover", subject: "Land Partnership Proposal — {deal} | Assets Creators", body: "Dear {name},\n\nThank you for the discussion on {deal}.\n\nPlease find attached our proposal for a Capital-Driven Development Management and Operations (CDDMO) structure for your land parcel. This model ensures:\n\n- Full capital support from our developer partner\n- Guaranteed minimum land value for you\n- No upfront cost or risk to the landowner\n- Revenue share post project completion\n\nWe are confident this structure will maximize value for you while eliminating execution risk.\n\nLooking forward to your thoughts. Happy to schedule a call to walk you through the details.\n\nWarm regards\nVijey Agrawwal\nCo-Founder, Assets Creators\nPune" },
    { label: "Term Sheet Sharing", subject: "Term Sheet — {deal} | Assets Creators", body: "Dear {name},\n\nAs discussed, please find enclosed the term sheet for our proposed partnership on {deal}.\n\nKey terms at a glance:\n- Structure: JV / CDDMO / DM\n- Land value: As agreed\n- Revenue share: [X]%\n- Milestone-linked payments\n\nPlease review and share your comments. We are keen to move to the next stage at your convenience.\n\nBest regards\nVijey Agrawwal\nAssets Creators" },
  ],
  "Investor": [
    { label: "Project Investment Brief", subject: "Investment Opportunity — {deal} | Assets Creators", body: "Dear {name},\n\nI hope this email finds you well.\n\nWe are presenting a structured investment opportunity in {deal}, a Residential / Mixed Use / Plotted project.\n\nHighlights:\n- Total project value: INR [X] Cr\n- Investment ask: INR [X] Cr\n- Structure: Equity / Debt / Structured\n- Projected IRR: [X]%\n- Timeline: [X] months\n\nI have attached the project brief and financial summary for your review.\n\nWould love to connect for a 30 min walkthrough at your convenience.\n\nWarm regards\nVijey Agrawwal\nCo-Founder, Assets Creators" },
  ],
  "Consultant": [
    { label: "Feasibility Request", subject: "Feasibility Report Request — {deal}", body: "Dear Team,\n\nWe are working on a land parcel / development opportunity at {deal} and would like to commission a feasibility study.\n\nScope required:\n- Market demand analysis\n- Comparable sales / rentals\n- Absorption rates\n- Recommended product mix\n- High-level financial viability\n\nCould you share your timeline and cost estimate for the same?\n\nLooking forward to working with you.\n\nRegards\nVijey Agrawwal\nAssets Creators" },
  ],
};

const uid = () => Math.floor(Math.random() * 900000) + 100000;

// ── SHARED COMPONENTS ───────────────────────────────────────────────────────
function Badge({ label, color, small }) {
  return <span style={{ background: color + "20", color, border: `1px solid ${color}40`, borderRadius: 4, padding: small ? "1px 6px" : "2px 8px", fontSize: small ? 10 : 11, fontWeight: 700, whiteSpace: "nowrap" }}>{label}</span>;
}

function Btn({ children, onClick, variant = "primary", small, style = {} }) {
  const styles = {
    primary: { background: T.accent, color: "#fff", border: "none" },
    ghost: { background: "transparent", color: T.mutedLight, border: `1px solid ${T.border}` },
    danger: { background: T.red + "15", color: T.red, border: `1px solid ${T.red}30` },
    teal: { background: T.teal + "15", color: T.teal, border: `1px solid ${T.teal}30` },
    green: { background: T.green + "15", color: T.green, border: `1px solid ${T.green}30` },
  };
  return <button onClick={onClick} style={{ ...styles[variant], borderRadius: 6, padding: small ? "4px 10px" : "7px 14px", fontSize: small ? 11 : 12, fontWeight: 700, cursor: "pointer", transition: "opacity .15s", ...style }} onMouseEnter={e => e.currentTarget.style.opacity = ".75"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>{children}</button>;
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0006", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, width: "100%", maxWidth: wide ? 680 : 480, maxHeight: "90vh", overflowY: "auto", padding: 24, boxShadow: "0 20px 60px #0003" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ color: T.accent, fontWeight: 800, fontSize: 15 }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.muted, fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, textarea, options }) {
  const base = { background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "8px 10px", color: T.text, fontSize: 13, width: "100%", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ color: T.mutedLight, fontSize: 11, marginBottom: 4, fontWeight: 700 }}>{label}</div>}
      {textarea ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...base, resize: "vertical" }} />
        : options ? <select value={value} onChange={e => onChange(e.target.value)} style={base}>{options.map(o => <option key={o} value={o}>{o}</option>)}</select>
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} />}
    </div>
  );
}

// ── TABS ─────────────────────────────────────────────────────────────────────
const TABS = ["Dashboard", "Contacts", "Tasks", "Follow-ups", "Pipeline", "Planner", "Templates"];
const TAB_ICONS = ["⚡", "👥", "✅", "🔔", "📊", "📅", "💬"];

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function Dashboard({ contacts, tasks, followups, deals }) {
  const overdueTasks = tasks.filter(t => isOverdue(t.due, t.done));
  const overdueFU = followups.filter(f => isOverdue(f.due, f.done));
  const todayTasks = tasks.filter(t => !t.done && t.due === TODAY);
  const todayFU = followups.filter(f => !f.done && f.due === TODAY);

  const alertItems = [
    ...overdueTasks.map(t => ({ label: t.title, sub: t.project, color: T.red, badge: "OVERDUE TASK" })),
    ...overdueFU.map(f => ({ label: f.topic, sub: `${f.contact} · ${f.channel}`, color: T.red, badge: "OVERDUE FOLLOW-UP" })),
    ...todayTasks.map(t => ({ label: t.title, sub: t.project, color: T.orange, badge: "DUE TODAY" })),
    ...todayFU.map(f => ({ label: f.topic, sub: `${f.contact} · ${f.channel}`, color: T.orange, badge: "DUE TODAY" })),
  ];

  const stats = [
    { label: "Active Contacts", value: contacts.filter(c => c.status === "Active").length, color: T.teal },
    { label: "Warm Contacts", value: contacts.filter(c => c.status === "Warm").length, color: T.accent },
    { label: "Open Tasks", value: tasks.filter(t => !t.done).length, color: T.blue },
    { label: "Overdue Tasks", value: overdueTasks.length, color: T.red },
    { label: "Pending Follow-ups", value: followups.filter(f => !f.done).length, color: T.purple },
    { label: "Active Deals", value: deals.length, color: T.green },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px 18px", boxShadow: "0 2px 8px #00000008" }}>
            <div style={{ color: s.color, fontSize: 28, fontWeight: 900 }}>{s.value}</div>
            <div style={{ color: T.muted, fontSize: 11, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {alertItems.length > 0 && (
        <div style={{ background: "#FEF3F2", border: `1px solid ${T.red}30`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <div style={{ color: T.red, fontWeight: 800, fontSize: 13, marginBottom: 12 }}>🚨 Attention Required ({alertItems.length})</div>
          {alertItems.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8, paddingBottom: 8, borderBottom: i < alertItems.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <Badge label={a.badge} color={a.color} small />
              <div>
                <div style={{ color: T.text, fontSize: 12, fontWeight: 600 }}>{a.label}</div>
                <div style={{ color: T.muted, fontSize: 11 }}>{a.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
          <div style={{ color: T.accent, fontWeight: 800, fontSize: 12, marginBottom: 12 }}>UPCOMING TASKS — NEXT 7 DAYS</div>
          {tasks.filter(t => !t.done && t.due >= TODAY).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 6).map(t => {
            const b = dueBadge(t.due, t.done);
            return (
              <div key={t.id} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${T.border}` }}>
                <div style={{ color: T.text, fontSize: 12 }}>{t.title}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 3, alignItems: "center" }}>
                  <span style={{ color: T.muted, fontSize: 10 }}>{t.project}</span>
                  {b && <Badge label={b.label} color={b.color} small />}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
          <div style={{ color: T.teal, fontWeight: 800, fontSize: 12, marginBottom: 12 }}>UPCOMING FOLLOW-UPS</div>
          {followups.filter(f => !f.done).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 6).map(f => {
            const b = dueBadge(f.due, f.done);
            return (
              <div key={f.id} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${T.border}` }}>
                <div style={{ color: T.text, fontSize: 12 }}>{f.topic}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 3, alignItems: "center" }}>
                  <span style={{ color: T.muted, fontSize: 10 }}>{f.contact} · {f.channel}</span>
                  {b && <Badge label={b.label} color={b.color} small />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CONTACTS
// ══════════════════════════════════════════════════════════════════════════════
function Contacts({ contacts, setContacts }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [logText, setLogText] = useState("");
  const blank = { name: "", role: "Landowner", category: "Della", city: "Pune", phone: "", email: "", deal: "", status: "Active", notes: "", log: [] };
  const [form, setForm] = useState(blank);

  const cats = ["All", ...new Set(contacts.map(c => c.category))];
  const filtered = contacts.filter(c =>
    (filterCat === "All" || c.category === filterCat) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.deal.toLowerCase().includes(search.toLowerCase()))
  );

  function save() {
    if (editing) setContacts(cs => cs.map(c => c.id === editing ? { ...form, id: editing } : c));
    else setContacts(cs => [...cs, { ...form, id: uid() }]);
    setShowAdd(false); setEditing(null); setForm(blank);
  }

  function addLog(id) {
    if (!logText.trim()) return;
    const entry = { date: TODAY, text: logText };
    setContacts(cs => cs.map(c => c.id === id ? { ...c, log: [entry, ...(c.log || [])] } : c));
    setLogText("");
  }

  const sel = contacts.find(c => c.id === selected);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts or deals..." style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: "7px 12px", color: T.text, fontSize: 12, flex: 1, minWidth: 160, outline: "none" }} />
        {cats.map(c => <button key={c} onClick={() => setFilterCat(c)} style={{ background: filterCat === c ? T.accent : T.surface, color: filterCat === c ? "#fff" : T.muted, border: `1px solid ${filterCat === c ? T.accent : T.border}`, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{c}</button>)}
        <Btn onClick={() => { setForm(blank); setShowAdd(true); }}>+ Add Contact</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10 }}>
        {filtered.map(c => (
          <div key={c.id} onClick={() => setSelected(c.id)} style={{ background: T.surface, border: `2px solid ${selected === c.id ? T.accent : T.border}`, borderRadius: 10, padding: 14, cursor: "pointer", boxShadow: "0 2px 8px #00000008", transition: "border .15s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: T.text, fontWeight: 700, fontSize: 13 }}>{c.name}</div>
                <div style={{ color: T.muted, fontSize: 11 }}>{c.role} · {c.city}</div>
              </div>
              <Badge label={c.status} color={c.status === "Active" ? T.green : c.status === "Warm" ? T.accent : T.muted} small />
            </div>
            <div style={{ color: T.mutedLight, fontSize: 11, marginTop: 6 }}>{c.deal}</div>
            {c.log?.[0] && <div style={{ color: T.muted, fontSize: 10, marginTop: 4 }}>Last: {c.log[0].text.slice(0, 55)}...</div>}
          </div>
        ))}
      </div>

      {sel && (
        <Modal title={sel.name} onClose={() => setSelected(null)} wide>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[["Role", sel.role], ["Category", sel.category], ["City", sel.city], ["Deal", sel.deal], ["Status", sel.status]].map(([k, v]) => (
              <div key={k} style={{ background: T.bg, borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ color: T.muted, fontSize: 10 }}>{k}</div>
                <div style={{ color: T.text, fontSize: 12, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
          {sel.notes && <div style={{ background: T.bg, borderRadius: 6, padding: "10px 12px", marginBottom: 12, color: T.mutedLight, fontSize: 12, lineHeight: 1.6 }}>{sel.notes}</div>}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {sel.phone && <a href={`https://wa.me/91${sel.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}><Btn variant="green">📱 WhatsApp</Btn></a>}
            {sel.email && <a href={`mailto:${sel.email}`} style={{ textDecoration: "none" }}><Btn variant="teal">✉️ Email</Btn></a>}
            <Btn variant="ghost" small onClick={() => { setForm({ ...sel }); setEditing(sel.id); setShowAdd(true); setSelected(null); }}>Edit</Btn>
            <Btn variant="danger" small onClick={() => { setContacts(cs => cs.filter(c => c.id !== sel.id)); setSelected(null); }}>Delete</Btn>
          </div>
          <div style={{ color: T.accent, fontWeight: 800, fontSize: 12, marginBottom: 8 }}>CALL / ACTIVITY LOG</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input value={logText} onChange={e => setLogText(e.target.value)} placeholder="Add note, call outcome, or update..." style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "7px 10px", color: T.text, fontSize: 12, flex: 1, outline: "none" }} onKeyDown={e => e.key === "Enter" && addLog(sel.id)} />
            <Btn small onClick={() => addLog(sel.id)}>Log</Btn>
          </div>
          <div style={{ maxHeight: 180, overflowY: "auto" }}>
            {(sel.log || []).length === 0 && <div style={{ color: T.muted, fontSize: 12 }}>No activity logged yet.</div>}
            {(sel.log || []).map((l, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 6, marginBottom: 6 }}>
                <div style={{ color: T.muted, fontSize: 10 }}>{fmtDate(l.date)}</div>
                <div style={{ color: T.text, fontSize: 12 }}>{l.text}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {showAdd && (
        <Modal title={editing ? "Edit Contact" : "Add Contact"} onClose={() => { setShowAdd(false); setEditing(null); setForm(blank); }}>
          <Input label="Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
          <Input label="Role" value={form.role} onChange={v => setForm(f => ({ ...f, role: v }))} options={["Landowner", "Investor", "Developer", "Della Team", "Consultant", "Other"]} />
          <Input label="Category" value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} options={["Della", "V21", "Structured Finance", "Other"]} />
          <Input label="City" value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} options={["Pune", "Mumbai", "Hyderabad", "Raipur", "Indore", "Delhi", "Other"]} />
          <Input label="Deal / Project" value={form.deal} onChange={v => setForm(f => ({ ...f, deal: v }))} placeholder="e.g. Kesaram 118 ac" />
          <Input label="Phone (without +91)" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="9876543210" />
          <Input label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" />
          <Input label="Status" value={form.status} onChange={v => setForm(f => ({ ...f, status: v }))} options={["Active", "Warm", "Cold", "Closed"]} />
          <Input label="Notes" value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} textarea placeholder="Key context, deal background..." />
          <Btn onClick={save} style={{ width: "100%" }}>{editing ? "Save Changes" : "Add Contact"}</Btn>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TASKS
// ══════════════════════════════════════════════════════════════════════════════
function Tasks({ tasks, setTasks }) {
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", project: "", priority: "Medium", due: "", subhead: "Documentation" });

  const weekEnd = new Date(); weekEnd.setDate(weekEnd.getDate() + 7);
  const weekEndStr = weekEnd.toISOString().split("T")[0];
  const subheads = ["Documentation", "Landowner / Legal", "Investor Outreach", "Financial Modeling", "Site / Due Diligence", "Deal Structuring", "Follow-ups", "Internal Tasks"];

  const filtered = tasks.filter(t => {
    if (filter === "Today") return !t.done && t.due === TODAY;
    if (filter === "Overdue") return isOverdue(t.due, t.done);
    if (filter === "This Week") return !t.done && t.due >= TODAY && t.due <= weekEndStr;
    if (filter === "Done") return t.done;
    return true;
  }).sort((a, b) => a.done !== b.done ? (a.done ? 1 : -1) : (a.due || "9").localeCompare(b.due || "9"));

  const priorities = { High: T.red, Medium: T.accent, Low: T.green };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        {["All", "Today", "Overdue", "This Week", "Done"].map(f => <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? T.teal : T.surface, color: filter === f ? "#fff" : T.muted, border: `1px solid ${filter === f ? T.teal : T.border}`, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{f}</button>)}
        <div style={{ marginLeft: "auto" }}><Btn onClick={() => setShowAdd(true)}>+ Add Task</Btn></div>
      </div>
      {filtered.length === 0 && <div style={{ color: T.muted, fontSize: 13, padding: 30, textAlign: "center" }}>No tasks in this view.</div>}
      {filtered.map(t => {
        const b = dueBadge(t.due, t.done);
        return (
          <div key={t.id} style={{ background: T.surface, border: `1px solid ${isOverdue(t.due, t.done) ? T.red + "50" : T.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 8, display: "flex", gap: 10, alignItems: "flex-start", boxShadow: "0 1px 4px #00000008" }}>
            <input type="checkbox" checked={t.done} onChange={() => setTasks(ts => ts.map(x => x.id === t.id ? { ...x, done: !x.done } : x))} style={{ marginTop: 3, accentColor: T.accent, width: 14, height: 14, cursor: "pointer" }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: t.done ? T.muted : T.text, fontSize: 13, fontWeight: 600, textDecoration: t.done ? "line-through" : "none" }}>{t.title}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ color: T.muted, fontSize: 10 }}>{t.project} · {t.subhead}</span>
                <Badge label={t.priority} color={priorities[t.priority] || T.muted} small />
                {b && <Badge label={b.label} color={b.color} small />}
              </div>
            </div>
            <Btn variant="danger" small onClick={() => setTasks(ts => ts.filter(x => x.id !== t.id))}>✕</Btn>
          </div>
        );
      })}
      {showAdd && (
        <Modal title="Add Task" onClose={() => setShowAdd(false)}>
          <Input label="Task Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="What needs to be done?" />
          <Input label="Project" value={form.project} onChange={v => setForm(f => ({ ...f, project: v }))} placeholder="e.g. Kesaram Hyderabad" />
          <Input label="Sub-head" value={form.subhead} onChange={v => setForm(f => ({ ...f, subhead: v }))} options={subheads} />
          <Input label="Priority" value={form.priority} onChange={v => setForm(f => ({ ...f, priority: v }))} options={["High", "Medium", "Low"]} />
          <Input label="Due Date" value={form.due} onChange={v => setForm(f => ({ ...f, due: v }))} type="date" />
          <Btn onClick={() => { if (!form.title) return; setTasks(ts => [...ts, { ...form, id: uid(), done: false }]); setShowAdd(false); setForm({ title: "", project: "", priority: "Medium", due: "", subhead: "Documentation" }); }} style={{ width: "100%" }}>Add Task</Btn>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FOLLOW-UPS
// ══════════════════════════════════════════════════════════════════════════════
function Followups({ followups, setFollowups }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("Pending");
  const [form, setForm] = useState({ contact: "", channel: "WhatsApp", topic: "", due: "", priority: "Medium" });
  const filtered = followups.filter(f => filter === "Done" ? f.done : !f.done).sort((a, b) => a.due.localeCompare(b.due));
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
        {["Pending", "Done"].map(s => <button key={s} onClick={() => setFilter(s)} style={{ background: filter === s ? T.purple : T.surface, color: filter === s ? "#fff" : T.muted, border: `1px solid ${filter === s ? T.purple : T.border}`, borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{s}</button>)}
        <div style={{ marginLeft: "auto" }}><Btn onClick={() => setShowAdd(true)}>+ Add Follow-up</Btn></div>
      </div>
      {filtered.map(f => {
        const b = dueBadge(f.due, f.done);
        const chCol = { WhatsApp: T.green, Email: T.blue, Call: T.accent, Meeting: T.purple }[f.channel] || T.muted;
        return (
          <div key={f.id} style={{ background: T.surface, border: `1px solid ${isOverdue(f.due, f.done) ? T.red + "50" : T.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <input type="checkbox" checked={f.done} onChange={() => setFollowups(fs => fs.map(x => x.id === f.id ? { ...x, done: !x.done } : x))} style={{ marginTop: 3, accentColor: T.purple, width: 14, height: 14, cursor: "pointer" }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: f.done ? T.muted : T.text, fontSize: 13, fontWeight: 600, textDecoration: f.done ? "line-through" : "none" }}>{f.topic}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ color: T.muted, fontSize: 11 }}>{f.contact}</span>
                <Badge label={f.channel} color={chCol} small />
                <Badge label={f.priority} color={f.priority === "High" ? T.red : f.priority === "Medium" ? T.accent : T.green} small />
                {b && <Badge label={b.label} color={b.color} small />}
              </div>
            </div>
            <Btn variant="danger" small onClick={() => setFollowups(fs => fs.filter(x => x.id !== f.id))}>✕</Btn>
          </div>
        );
      })}
      {showAdd && (
        <Modal title="Add Follow-up" onClose={() => setShowAdd(false)}>
          <Input label="Contact Name" value={form.contact} onChange={v => setForm(f => ({ ...f, contact: v }))} placeholder="e.g. Prakash Anna" />
          <Input label="Channel" value={form.channel} onChange={v => setForm(f => ({ ...f, channel: v }))} options={["WhatsApp", "Email", "Call", "Meeting"]} />
          <Input label="Topic / Agenda" value={form.topic} onChange={v => setForm(f => ({ ...f, topic: v }))} placeholder="What is this follow-up about?" />
          <Input label="Due Date" value={form.due} onChange={v => setForm(f => ({ ...f, due: v }))} type="date" />
          <Input label="Priority" value={form.priority} onChange={v => setForm(f => ({ ...f, priority: v }))} options={["High", "Medium", "Low"]} />
          <Btn onClick={() => { if (!form.contact || !form.topic) return; setFollowups(fs => [...fs, { ...form, id: uid(), done: false }]); setShowAdd(false); setForm({ contact: "", channel: "WhatsApp", topic: "", due: "", priority: "Medium" }); }} style={{ width: "100%" }}>Add Follow-up</Btn>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PIPELINE
// ══════════════════════════════════════════════════════════════════════════════
function Pipeline({ deals, setDeals }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", landowner: "", type: "JV", acres: "", city: "Pune", stage: "Sourcing", value: "", note: "" });
  const totalValue = deals.reduce((s, d) => s + Number(d.value || 0), 0);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ color: T.muted, fontSize: 12 }}>Pipeline: <span style={{ color: T.accent, fontWeight: 800 }}>₹{totalValue} Cr</span> across {deals.length} deals</div>
        <Btn onClick={() => setShowAdd(true)}>+ Add Deal</Btn>
      </div>
      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        <div style={{ display: "flex", gap: 10, minWidth: 900 }}>
          {PIPELINE_STAGES.map(stage => {
            const sd = deals.filter(d => d.stage === stage);
            return (
              <div key={stage} style={{ flex: 1, minWidth: 120, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 10 }}>
                <div style={{ color: T.accent, fontSize: 10, fontWeight: 800, marginBottom: 4, textTransform: "uppercase" }}>{stage}</div>
                <div style={{ color: T.muted, fontSize: 10, marginBottom: 8 }}>{sd.length} deal{sd.length !== 1 ? "s" : ""}</div>
                {sd.map(d => (
                  <div key={d.id} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "8px 10px", marginBottom: 6 }}>
                    <div style={{ color: T.text, fontSize: 11, fontWeight: 700 }}>{d.name}</div>
                    <div style={{ color: T.muted, fontSize: 10 }}>{d.acres} ac · {d.city}</div>
                    <div style={{ color: T.accent, fontSize: 11, fontWeight: 700 }}>₹{d.value} Cr</div>
                    <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
                      {PIPELINE_STAGES.indexOf(d.stage) < PIPELINE_STAGES.length - 1 && <button onClick={() => setDeals(ds => ds.map(x => x.id === d.id ? { ...x, stage: PIPELINE_STAGES[PIPELINE_STAGES.indexOf(d.stage) + 1] } : x))} style={{ background: T.teal + "20", color: T.teal, border: "none", borderRadius: 4, padding: "2px 7px", fontSize: 10, cursor: "pointer", fontWeight: 700 }}>Advance</button>}
                      <button onClick={() => setDeals(ds => ds.filter(x => x.id !== d.id))} style={{ background: T.red + "15", color: T.red, border: "none", borderRadius: 4, padding: "2px 7px", fontSize: 10, cursor: "pointer" }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {showAdd && (
        <Modal title="Add Deal to Pipeline" onClose={() => setShowAdd(false)}>
          <Input label="Deal / Project Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Wakad 8 ac JV" />
          <Input label="Landowner / Partner" value={form.landowner} onChange={v => setForm(f => ({ ...f, landowner: v }))} />
          <Input label="Type" value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))} options={["JV", "CDDMO", "DM", "Redevelopment", "Plotted", "Commercial"]} />
          <Input label="Acres" value={form.acres} onChange={v => setForm(f => ({ ...f, acres: v }))} placeholder="e.g. 12" />
          <Input label="City" value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} options={["Pune", "Mumbai", "Hyderabad", "Raipur", "Indore", "Other"]} />
          <Input label="Stage" value={form.stage} onChange={v => setForm(f => ({ ...f, stage: v }))} options={PIPELINE_STAGES} />
          <Input label="Estimated Value (₹ Cr)" value={form.value} onChange={v => setForm(f => ({ ...f, value: v }))} placeholder="e.g. 150" />
          <Input label="Notes" value={form.note} onChange={v => setForm(f => ({ ...f, note: v }))} textarea />
          <Btn onClick={() => { if (!form.name) return; setDeals(ds => [...ds, { ...form, id: uid() }]); setShowAdd(false); setForm({ name: "", landowner: "", type: "JV", acres: "", city: "Pune", stage: "Sourcing", value: "", note: "" }); }} style={{ width: "100%" }}>Add Deal</Btn>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PLANNER
// ══════════════════════════════════════════════════════════════════════════════
function Planner({ tasks, followups }) {
  const [view, setView] = useState("week");
  const days = Array.from({ length: view === "week" ? 7 : 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["week", "month"].map(v => <button key={v} onClick={() => setView(v)} style={{ background: v === view ? T.accent : T.surface, color: v === view ? "#fff" : T.muted, border: `1px solid ${v === view ? T.accent : T.border}`, borderRadius: 20, padding: "4px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>{v}</button>)}
      </div>
      {days.map(day => {
        const dt = tasks.filter(t => !t.done && t.due === day);
        const df = followups.filter(f => !f.done && f.due === day);
        if (dt.length === 0 && df.length === 0) return null;
        const label = new Date(day + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" });
        return (
          <div key={day} style={{ marginBottom: 16 }}>
            <div style={{ color: day === TODAY ? T.accent : T.teal, fontWeight: 800, fontSize: 12, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              {label.toUpperCase()} {day === TODAY && <Badge label="TODAY" color={T.accent} small />}
            </div>
            {dt.map(t => (
              <div key={t.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: "7px 12px", marginBottom: 5, display: "flex", gap: 8 }}>
                <span style={{ fontSize: 12 }}>✅</span>
                <div><div style={{ color: T.text, fontSize: 12 }}>{t.title}</div><div style={{ color: T.muted, fontSize: 10 }}>{t.project} · {t.subhead}</div></div>
              </div>
            ))}
            {df.map(f => (
              <div key={f.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: "7px 12px", marginBottom: 5, display: "flex", gap: 8 }}>
                <span style={{ fontSize: 12 }}>🔔</span>
                <div><div style={{ color: T.text, fontSize: 12 }}>{f.topic}</div><div style={{ color: T.muted, fontSize: 10 }}>{f.contact} · {f.channel}</div></div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATES
// ══════════════════════════════════════════════════════════════════════════════
function Templates({ contacts }) {
  const [type, setType] = useState("WhatsApp");
  const [role, setRole] = useState("Landowner");
  const [tplIdx, setTplIdx] = useState(0);
  const [contact, setContact] = useState("");
  const [customName, setCustomName] = useState("");
  const [customDeal, setCustomDeal] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [copied, setCopied] = useState(false);

  const templates = type === "WhatsApp" ? (WA_TEMPLATES[role] || []) : (EMAIL_TEMPLATES[role] || []);
  const tpl = templates[Math.min(tplIdx, templates.length - 1)];
  const sel = contacts.find(c => c.name === contact);
  const name = customName || sel?.name || "{name}";
  const deal = customDeal || sel?.deal || "{deal}";
  const date = customDate || "{date}";
  const filled = tpl ? (tpl.text || tpl.body || "").replace(/{name}/g, name).replace(/{deal}/g, deal).replace(/{date}/g, date) : "";
  const subject = tpl?.subject ? tpl.subject.replace(/{name}/g, name).replace(/{deal}/g, deal) : "";

  function copyText() {
    navigator.clipboard.writeText(type === "Email" ? `Subject: ${subject}\n\n${filled}` : filled);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  const roles = Object.keys(type === "WhatsApp" ? WA_TEMPLATES : EMAIL_TEMPLATES);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 16 }}>
      <div>
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {["WhatsApp", "Email"].map(t => <button key={t} onClick={() => { setType(t); setTplIdx(0); }} style={{ flex: 1, background: type === t ? (t === "WhatsApp" ? T.green : T.blue) : T.surface, color: type === t ? "#fff" : T.muted, border: `1px solid ${type === t ? "transparent" : T.border}`, borderRadius: 6, padding: "6px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{t === "WhatsApp" ? "📱 WA" : "✉️ Email"}</button>)}
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ color: T.muted, fontSize: 10, marginBottom: 6, fontWeight: 700 }}>CONTACT TYPE</div>
          {roles.map(r => <button key={r} onClick={() => { setRole(r); setTplIdx(0); }} style={{ display: "block", width: "100%", textAlign: "left", background: role === r ? T.accent + "15" : "transparent", color: role === r ? T.accent : T.mutedLight, border: "none", padding: "6px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer", marginBottom: 2, fontWeight: role === r ? 700 : 400 }}>{r}</button>)}
        </div>
        <div>
          <div style={{ color: T.muted, fontSize: 10, marginBottom: 6, fontWeight: 700 }}>TEMPLATES</div>
          {templates.map((t, i) => <button key={i} onClick={() => setTplIdx(i)} style={{ display: "block", width: "100%", textAlign: "left", background: tplIdx === i ? T.teal + "15" : "transparent", color: tplIdx === i ? T.teal : T.mutedLight, border: "none", padding: "6px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer", marginBottom: 2, fontWeight: tplIdx === i ? 700 : 400 }}>{t.label}</button>)}
        </div>
      </div>
      <div>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ color: T.accent, fontSize: 11, fontWeight: 800, marginBottom: 10 }}>PERSONALISE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <div style={{ color: T.muted, fontSize: 10, marginBottom: 4 }}>Contact (from CRM)</div>
              <select value={contact} onChange={e => setContact(e.target.value)} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 10px", color: T.text, fontSize: 12, width: "100%", outline: "none" }}>
                <option value="">-- Select --</option>
                {contacts.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <div style={{ color: T.muted, fontSize: 10, marginBottom: 4 }}>Override Name</div>
              <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Type name..." style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 10px", color: T.text, fontSize: 12, width: "100%", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ color: T.muted, fontSize: 10, marginBottom: 4 }}>Deal / Project</div>
              <input value={customDeal} onChange={e => setCustomDeal(e.target.value)} placeholder={sel?.deal || "Type deal..."} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 10px", color: T.text, fontSize: 12, width: "100%", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ color: T.muted, fontSize: 10, marginBottom: 4 }}>Date</div>
              <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 10px", color: T.text, fontSize: 12, width: "100%", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
        </div>
        {tpl && (
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
            {type === "Email" && subject && <div style={{ color: T.mutedLight, fontSize: 11, marginBottom: 10, padding: "6px 10px", background: T.bg, borderRadius: 6 }}><span style={{ color: T.muted }}>Subject: </span>{subject}</div>}
            <pre style={{ color: T.text, fontSize: 12, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0, lineHeight: 1.7 }}>{filled}</pre>
            <div style={{ marginTop: 12 }}><Btn onClick={copyText} variant={copied ? "green" : "primary"}>{copied ? "✓ Copied!" : "Copy Message"}</Btn></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState(0);
  const [contacts, setContacts] = useLocalStorage("ace_contacts", SEED_CONTACTS);
  const [tasks, setTasks] = useLocalStorage("ace_tasks", SEED_TASKS);
  const [followups, setFollowups] = useLocalStorage("ace_followups", SEED_FOLLOWUPS);
  const [deals, setDeals] = useLocalStorage("ace_deals", SEED_DEALS);

  const overdue = tasks.filter(t => isOverdue(t.due, t.done)).length + followups.filter(f => isOverdue(f.due, f.done)).length;
  const todayCount = tasks.filter(t => !t.done && t.due === TODAY).length + followups.filter(f => !f.done && f.due === TODAY).length;

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "'Georgia', 'Times New Roman', serif", color: T.text }}>
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px #00000010" }}>
        <div>
          <div style={{ color: T.accent, fontWeight: 900, fontSize: 17, letterSpacing: 1 }}>ACE CRM</div>
          <div style={{ color: T.muted, fontSize: 10, letterSpacing: 2 }}>ASSETS CREATORS</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {overdue > 0 && <Badge label={`${overdue} OVERDUE`} color={T.red} />}
          {todayCount > 0 && <Badge label={`${todayCount} TODAY`} color={T.orange} />}
          <span style={{ color: T.muted, fontSize: 11 }}>{new Date().toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}</span>
        </div>
      </div>
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 24px", display: "flex", gap: 2, overflowX: "auto" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ background: "none", border: "none", borderBottom: tab === i ? `2px solid ${T.accent}` : "2px solid transparent", color: tab === i ? T.accent : T.muted, padding: "10px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            {TAB_ICONS[i]} {t}
          </button>
        ))}
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
        {tab === 0 && <Dashboard contacts={contacts} tasks={tasks} followups={followups} deals={deals} />}
        {tab === 1 && <Contacts contacts={contacts} setContacts={setContacts} />}
        {tab === 2 && <Tasks tasks={tasks} setTasks={setTasks} />}
        {tab === 3 && <Followups followups={followups} setFollowups={setFollowups} />}
        {tab === 4 && <Pipeline deals={deals} setDeals={setDeals} />}
        {tab === 5 && <Planner tasks={tasks} followups={followups} />}
        {tab === 6 && <Templates contacts={contacts} />}
      </div>
    </div>
  );
}

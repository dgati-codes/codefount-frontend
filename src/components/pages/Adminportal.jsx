import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Bell,
  BarChart2,
  LogOut,
  ChevronRight,
  DollarSign,
  UserCheck,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Send,
  Eye,
  Check,
  X,
  GraduationCap,
  Zap,
  Loader,
  Save,
  RefreshCw,
  MessageSquare,
  Tag,
  Palette,
  List,
  Layers,
} from "lucide-react";
import {
  admin,
  courses as coursesApi,
  workshops as workshopsApi,
  paymentProofs,
  notifications as notifApi,
  enquiries,
  testimonials as testimonialsApi,
} from "../../api/api";
import "./AdminPortal.css";

const GHS = (v) => `GHS ${Number(v || 0).toLocaleString()}`;

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { id: "courses", label: "Courses", icon: <BookOpen size={16} /> },
  { id: "users", label: "Students", icon: <Users size={16} /> },
  { id: "workshops", label: "Workshops", icon: <Zap size={16} /> },
  { id: "payments", label: "Payments", icon: <DollarSign size={16} /> },
  {
    id: "testimonials",
    label: "Testimonials",
    icon: <MessageSquare size={16} />,
  },
  { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { id: "reports", label: "Reports", icon: <BarChart2 size={16} /> },
  { id: "enquiries", label: "Enquiries", icon: <MessageSquare size={16} /> },
];

function Spin() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
      <Loader
        size={28}
        color="var(--teal)"
        style={{ animation: "spin .7s linear infinite" }}
      />
    </div>
  );
}

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div className="adm-stat">
      <div
        className="adm-stat__icon"
        style={{ background: color + "18", color }}
      >
        {icon}
      </div>
      <div className="adm-stat__body">
        <div className="adm-stat__val">{value}</div>
        <div className="adm-stat__label">{label}</div>
        {sub && <div className="adm-stat__sub">{sub}</div>}
      </div>
    </div>
  );
}

function BarChart({ data, valueKey, labelKey, color = "#0f766e" }) {
  if (!data || !data.length)
    return (
      <div
        style={{ padding: "2rem", textAlign: "center", color: "var(--ink-3)" }}
      >
        No data yet
      </div>
    );
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div className="adm-chart">
      {data.map((d) => (
        <div key={d[labelKey]} className="adm-chart-col">
          <div className="adm-chart-bar-wrap">
            <div
              className="adm-chart-bar"
              style={{
                height: `${(d[valueKey] / max) * 100}%`,
                background: color,
              }}
              title={`${d[labelKey]}: ${d[valueKey]}`}
            />
          </div>
          <span className="adm-chart-label">{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

function MiniBar({ pct, color }) {
  return (
    <div className="adm-mini-bar">
      <div
        className="adm-mini-fill"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    admin
      .dashboard()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <Spin />;
  if (!stats)
    return (
      <div className="adm-loading">
        Could not load dashboard. Is the backend running?
      </div>
    );
  const rev = stats.revenue_by_month || [];
  const enr = stats.enrollment_by_course || [];
  return (
    <div>
      <h2 className="adm-page-title">Dashboard Overview</h2>
      <p className="adm-page-sub">
        Welcome back, Admin. Here is what is happening at CodeFount today.
      </p>
      <div className="adm-stats-grid">
        <StatCard
          label="Total Students"
          value={(stats.total_students || 0).toLocaleString()}
          icon={<Users size={20} />}
          color="#0f766e"
        />
        <StatCard
          label="Active Enrollments"
          value={(stats.active_enrollments || 0).toLocaleString()}
          icon={<BookOpen size={20} />}
          color="#0369a1"
        />
        <StatCard
          label="Total Revenue"
          value={GHS(stats.total_revenue)}
          icon={<DollarSign size={20} />}
          color="#f59e0b"
        />
        <StatCard
          label="Pending Payments"
          value={stats.pending_payments || 0}
          icon={<AlertCircle size={20} />}
          color="#e11d48"
        />
        <StatCard
          label="Placement Rate"
          value={`${stats.placement_rate || 0}%`}
          icon={<UserCheck size={20} />}
          color="#059669"
        />
        <StatCard
          label="Active Workshops"
          value={stats.workshops_active || 0}
          icon={<Zap size={20} />}
          color="#7c3aed"
        />
        <StatCard
          label="Active Courses"
          value={stats.courses_active || 0}
          icon={<GraduationCap size={20} />}
          color="#0369a1"
        />
        <StatCard
          label="Unread Alerts"
          value={stats.unread_notifications || 0}
          icon={<Bell size={20} />}
          color="#e11d48"
        />
      </div>
      <div className="adm-charts-row">
        <div className="adm-chart-card">
          <h3 className="adm-chart-title">
            Revenue by Month <span>(GHS)</span>
          </h3>
          <BarChart
            data={rev}
            valueKey="revenue"
            labelKey="month"
            color="#0f766e"
          />
        </div>
        <div className="adm-chart-card">
          <h3 className="adm-chart-title">Enrollments by Course</h3>
          <BarChart
            data={enr}
            valueKey="count"
            labelKey="course"
            color="#0369a1"
          />
        </div>
      </div>
    </div>
  );
}

// ─── COURSES TAB ─────────────────────────────────────────────────────────────
const BLANK_COURSE = {
  title: "",
  category: "",
  trainer: "",
  duration: "",
  level: "Beginner",
  fee: "",
  offer: "",
  desc: "",
  tag: "",
  color: "#0f766e",
  mode: "Online",
  highlights: "",
  outcome: "",
};
const CATS = [
  "Java Fullstack",
  "DevOps",
  "Cloud Computing",
  "AI/ML",
  "Data Science",
  "Cyber Security",
  "MERN Stack",
  "Python",
  "Networking",
  "AWS",
  "Angular",
  ".NET",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const COLORS = [
  "#0f766e",
  "#0369a1",
  "#7c3aed",
  "#e11d48",
  "#f59e0b",
  "#059669",
  "#0b2545",
  "#dc2626",
  "#0891b2",
];

function CoursesTab() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_COURSE);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    coursesApi
      .list({ size: 100 })
      .then((d) => setList(d.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setForm(BLANK_COURSE);
    setEditing(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openEdit = (c) => {
    setForm({
      ...BLANK_COURSE,
      ...c,
      fee: String(c.fee || ""),
      offer: String(c.offer || ""),
      mode: Array.isArray(c.mode) ? c.mode.join(", ") : c.mode || "Online",
      highlights: Array.isArray(c.highlights)
        ? c.highlights.join("\n")
        : c.highlights || "",
    });
    setEditing(c.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.title || !form.category)
      return alert("Title and category are required.");
    setSaving(true);
    const body = {
      ...form,
      fee: Number(form.fee) || 0,
      offer: Number(form.offer) || 0,
      mode: form.mode
        ? form.mode
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : ["Online"],
      highlights: form.highlights
        ? form.highlights
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };
    try {
      if (editing) {
        await coursesApi.update(editing, body);
      } else {
        await coursesApi.create(body);
      }
      load();
      setShowForm(false);
    } catch (e) {
      alert(e.response?.data?.detail || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    try {
      await coursesApi.delete(id);
      load();
    } catch (e) {
      alert(e.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h2 className="adm-page-title">Course Management</h2>
          <p className="adm-page-sub">
            Add, edit and remove courses. Changes appear live on the site.
          </p>
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <button className="btn btn-outline btn-sm" onClick={load}>
            <RefreshCw size={13} />
          </button>
          <button className="btn btn-primary" onClick={openNew}>
            <Plus size={15} /> Add Course
          </button>
        </div>
      </div>

      {showForm && (
        <div className="adm-form-card">
          <h3 className="adm-form-title">
            {editing ? "Edit Course" : "New Course"}
          </h3>
          <div className="adm-form-grid">
            <div className="form-group">
              <label className="form-label">
                <BookOpen size={13} /> Course Title *
              </label>
              <input
                className="form-input"
                placeholder="e.g. Java Full Stack Development"
                value={form.title}
                onChange={set("title")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Tag size={13} /> Category *
              </label>
              <select
                className="form-input"
                value={form.category}
                onChange={set("category")}
              >
                <option value="">Select category…</option>
                {CATS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
                <Users size={13} /> Trainer Name
              </label>
              <input
                className="form-input"
                placeholder="e.g. Mr. Emmanuel Asante"
                value={form.trainer}
                onChange={set("trainer")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Duration</label>
              <input
                className="form-input"
                placeholder="e.g. 3 Months"
                value={form.duration}
                onChange={set("duration")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Layers size={13} /> Level
              </label>
              <select
                className="form-input"
                value={form.level}
                onChange={set("level")}
              >
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Full Fee (GHS)</label>
              <input
                className="form-input"
                type="number"
                placeholder="3000"
                value={form.fee}
                onChange={set("fee")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Offer Price (GHS)</label>
              <input
                className="form-input"
                type="number"
                placeholder="1900"
                value={form.offer}
                onChange={set("offer")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tag / Badge</label>
              <input
                className="form-input"
                placeholder="e.g. Bestseller, Hot, New"
                value={form.tag}
                onChange={set("tag")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Delivery Mode(s)</label>
              <input
                className="form-input"
                placeholder="Online, Classroom, e-Learning (comma-separated)"
                value={form.mode}
                onChange={set("mode")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Palette size={13} /> Brand Colour
              </label>
              <div
                style={{
                  display: "flex",
                  gap: ".4rem",
                  flexWrap: "wrap",
                  paddingTop: ".35rem",
                }}
              >
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: c }))}
                    style={{
                      width: 26,
                      height: 26,
                      background: c,
                      borderRadius: 4,
                      border:
                        form.color === c
                          ? "3px solid #000"
                          : "2px solid transparent",
                      cursor: "pointer",
                    }}
                  />
                ))}
                <input
                  type="color"
                  value={form.color}
                  onChange={set("color")}
                  style={{
                    width: 26,
                    height: 26,
                    padding: 0,
                    border: "none",
                    cursor: "pointer",
                    borderRadius: 4,
                  }}
                  title="Custom colour"
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Brief course description…"
              value={form.desc}
              onChange={set("desc")}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              <List size={13} /> Highlights (one per line — "What You'll Learn")
            </label>
            <textarea
              className="form-input"
              rows={5}
              placeholder={
                "Build RESTful APIs with Spring Boot\nDeploy to AWS EC2 and S3\nWork with PostgreSQL and MongoDB"
              }
              value={form.highlights}
              onChange={set("highlights")}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Course Outcome</label>
            <input
              className="form-input"
              placeholder="e.g. Job-ready full-stack developer"
              value={form.outcome}
              onChange={set("outcome")}
            />
          </div>
          <div className="adm-form-actions">
            <button
              className="btn btn-primary"
              onClick={save}
              disabled={saving}
            >
              <Save size={14} /> {saving ? "Saving…" : "Save Course"}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setShowForm(false)}
            >
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <Spin />
      ) : (
        <div className="adm-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Course</th>
                <th>Trainer</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--ink-3)",
                    }}
                  >
                    No courses yet. Click "Add Course" above.
                  </td>
                </tr>
              ) : (
                list.map((c, i) => (
                  <tr key={c.id}>
                    <td style={{ color: "var(--ink-3)", fontWeight: 700 }}>
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td>
                      <div className="adm-course-cell">
                        <span
                          className="adm-course-dot"
                          style={{ background: c.color || "var(--teal)" }}
                        />
                        <div>
                          <strong>{c.title}</strong>
                          <span
                            style={{
                              display: "block",
                              fontSize: ".72rem",
                              color: "var(--ink-3)",
                            }}
                          >
                            {c.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: ".82rem" }}>{c.trainer}</td>
                    <td style={{ fontSize: ".82rem" }}>{c.duration}</td>
                    <td style={{ fontSize: ".82rem" }}>
                      {GHS(c.offer)}{" "}
                      <del
                        style={{ color: "var(--ink-3)", fontSize: ".72rem" }}
                      >
                        {GHS(c.fee)}
                      </del>
                    </td>
                    <td>
                      <span className="adm-chip adm-chip--enrolled">
                        {c.level}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          className="adm-action-btn adm-action-btn--edit"
                          onClick={() => openEdit(c)}
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          className="adm-action-btn adm-action-btn--del"
                          onClick={() => del(c.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── STUDENTS TAB ─────────────────────────────────────────────────────────────
function StudentsTab() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    admin
      .listUsers()
      .then((users) =>
        setStudents(
          users.map((u) => ({
            id: u.id,
            name: u.full_name || "—",
            email: u.email,
            role: u.role,
            active: u.is_active,
            joined: u.created_at
              ? new Date(u.created_at).toLocaleDateString()
              : "—",
          })),
        ),
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const deactivate = async (id) => {
    if (!window.confirm("Deactivate this user?")) return;
    try {
      await admin.deactivateUser(id);
      setStudents((s) =>
        s.map((x) => (x.id === id ? { ...x, active: false } : x)),
      );
    } catch (e) {
      alert(e.response?.data?.detail || "Failed");
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h2 className="adm-page-title">User Management</h2>
          <p className="adm-page-sub">
            All registered students and trainers ({students.length} total).
          </p>
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <input
            className="form-input"
            style={{ width: 220 }}
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-outline btn-sm" onClick={load}>
            <RefreshCw size={13} />
          </button>
        </div>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <div className="adm-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--ink-3)",
                    }}
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr key={s.id}>
                    <td style={{ color: "var(--ink-3)", fontWeight: 700 }}>
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td>
                      <div className="adm-student-cell">
                        <div className="adm-student-av">
                          {(s.name || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <strong>{s.name}</strong>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: ".82rem", color: "var(--ink-2)" }}>
                      {s.email}
                    </td>
                    <td>
                      <span
                        className={`adm-chip adm-chip--${s.role === "admin" ? "verified" : s.role === "trainer" ? "enrolled" : "completed"}`}
                      >
                        {s.role}
                      </span>
                    </td>
                    <td style={{ fontSize: ".82rem", color: "var(--ink-2)" }}>
                      {s.joined}
                    </td>
                    <td>
                      <span
                        className={`adm-chip adm-chip--${s.active ? "enrolled" : "rejected"}`}
                      >
                        {s.active ? "active" : "inactive"}
                      </span>
                    </td>
                    <td>
                      {s.active && s.role !== "admin" && (
                        <button
                          className="adm-action-btn adm-action-btn--del"
                          onClick={() => deactivate(s.id)}
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── WORKSHOPS TAB ────────────────────────────────────────────────────────────
const BLANK_WS = {
  title: "",
  facilitator: "",
  date: "",
  time: "",
  mode: "Online",
  seats: 30,
  price: "",
  desc: "",
  tag: "",
  icon: "🎓",
  color: "#0f766e",
};

function WorkshopsTab() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_WS);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    workshopsApi
      .list({ size: 50 })
      .then((d) => setList(d.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setForm(BLANK_WS);
    setEditing(null);
    setShowForm(true);
  };
  const openEdit = (w) => {
    setForm({
      ...BLANK_WS,
      ...w,
      price: w.price == null ? "" : String(w.price),
    });
    setEditing(w.id);
    setShowForm(true);
  };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.title) return alert("Title is required.");
    setSaving(true);
    const body = {
      ...form,
      seats: Number(form.seats) || 30,
      price: form.price === "" ? null : Number(form.price),
    };
    try {
      if (editing) {
        await workshopsApi.update(editing, body);
      } else {
        await workshopsApi.create(body);
      }
      load();
      setShowForm(false);
    } catch (e) {
      alert(e.response?.data?.detail || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this workshop?")) return;
    try {
      await workshopsApi.delete(id);
      load();
    } catch (e) {
      alert(e.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h2 className="adm-page-title">Workshop Management</h2>
          <p className="adm-page-sub">
            Manage workshops and seat registrations.
          </p>
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <button className="btn btn-outline btn-sm" onClick={load}>
            <RefreshCw size={13} />
          </button>
          <button className="btn btn-primary" onClick={openNew}>
            <Plus size={15} /> New Workshop
          </button>
        </div>
      </div>

      {showForm && (
        <div className="adm-form-card">
          <h3 className="adm-form-title">
            {editing ? "Edit Workshop" : "New Workshop"}
          </h3>
          <div className="adm-form-grid">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                className="form-input"
                value={form.title}
                onChange={set("title")}
                placeholder="e.g. Python for Beginners"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Facilitator</label>
              <input
                className="form-input"
                value={form.facilitator}
                onChange={set("facilitator")}
                placeholder="Tutor name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={form.date}
                onChange={set("date")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                className="form-input"
                placeholder="e.g. 10AM – 2PM"
                value={form.time}
                onChange={set("time")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mode</label>
              <select
                className="form-input"
                value={form.mode}
                onChange={set("mode")}
              >
                <option>Online</option>
                <option>Classroom</option>
                <option>Hybrid</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Total Seats</label>
              <input
                className="form-input"
                type="number"
                value={form.seats}
                onChange={set("seats")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price (GHS, blank = FREE)</label>
              <input
                className="form-input"
                type="number"
                placeholder="Leave blank for free"
                value={form.price}
                onChange={set("price")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tag</label>
              <input
                className="form-input"
                placeholder="e.g. Free · Hands-on"
                value={form.tag}
                onChange={set("tag")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Icon (emoji)</label>
              <input
                className="form-input"
                placeholder="🎓"
                maxLength={4}
                value={form.icon}
                onChange={set("icon")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Brand Colour</label>
              <input
                type="color"
                value={form.color || "#0f766e"}
                onChange={set("color")}
                style={{
                  width: 36,
                  height: 32,
                  padding: 0,
                  border: "none",
                  cursor: "pointer",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows={3}
              value={form.desc}
              onChange={set("desc")}
              placeholder="Brief workshop description…"
            />
          </div>
          <div className="adm-form-actions">
            <button
              className="btn btn-primary"
              onClick={save}
              disabled={saving}
            >
              <Save size={14} /> {saving ? "Saving…" : "Save Workshop"}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setShowForm(false)}
            >
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <Spin />
      ) : (
        <div className="adm-ws-grid">
          {list.length === 0 ? (
            <div style={{ padding: "2rem", color: "var(--ink-3)" }}>
              No workshops yet. Click "New Workshop" above.
            </div>
          ) : (
            list.map((w) => {
              const filled = w.filled || w.registrations_count || 0;
              const pct = w.seats ? Math.round((filled / w.seats) * 100) : 0;
              return (
                <div key={w.id} className="adm-ws-card">
                  <div
                    className="adm-ws-banner"
                    style={{
                      background: `linear-gradient(135deg,${w.color || "#0f766e"},${w.color || "#0f766e"}99)`,
                    }}
                  >
                    <span className="adm-ws-tag">{w.tag}</span>
                    <span className="adm-ws-icon">{w.icon || "🎓"}</span>
                  </div>
                  <div className="adm-ws-body">
                    <h4>{w.title}</h4>
                    <p
                      style={{
                        fontSize: ".78rem",
                        color: "var(--ink-2)",
                        marginBottom: ".6rem",
                      }}
                    >
                      {w.date} · {w.facilitator}
                    </p>
                    <MiniBar pct={pct} color={w.color || "var(--teal)"} />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: ".72rem",
                        color: "var(--ink-2)",
                        margin: ".25rem 0 .7rem",
                      }}
                    >
                      <span>
                        {filled}/{w.seats || "?"} seats
                      </span>
                      <span>{pct}% full</span>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        className="adm-action-btn adm-action-btn--edit"
                        style={{ flex: 1 }}
                        onClick={() => openEdit(w)}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        className="adm-action-btn adm-action-btn--del"
                        onClick={() => del(w.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ─── PAYMENTS TAB ─────────────────────────────────────────────────────────────
function PaymentsTab() {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(() => {
    setLoading(true);
    paymentProofs
      .listAll()
      .then((d) => setProofs(d?.items || d || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const approve = async (id) => {
    try {
      await paymentProofs.verify(id, { status: "verified" });
      setProofs((s) =>
        s.map((x) => (x.id === id ? { ...x, status: "verified" } : x)),
      );
    } catch (e) {
      alert(e.response?.data?.detail || "Failed");
    }
  };
  const reject = async (id) => {
    try {
      await paymentProofs.verify(id, { status: "rejected" });
      setProofs((s) =>
        s.map((x) => (x.id === id ? { ...x, status: "rejected" } : x)),
      );
    } catch (e) {
      alert(e.response?.data?.detail || "Failed");
    }
  };

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h2 className="adm-page-title">Payment Verification</h2>
          <p className="adm-page-sub">
            Review proof-of-payment uploads from students.
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={load}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <div className="adm-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>For</th>
                <th>Submitted</th>
                <th>File</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {proofs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--ink-3)",
                    }}
                  >
                    No payment proofs submitted yet.
                  </td>
                </tr>
              ) : (
                proofs.map((s, i) => (
                  <tr key={s.id}>
                    <td style={{ color: "var(--ink-3)", fontWeight: 700 }}>
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td>
                      <div className="adm-student-cell">
                        <div className="adm-student-av">
                          {String(s.user_id).slice(-2)}
                        </div>
                        <div>
                          <strong>User #{s.user_id}</strong>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: ".82rem" }}>
                      {s.enrollment_id
                        ? `Enrollment #${s.enrollment_id}`
                        : `Workshop Reg #${s.workshop_registration_id}`}
                    </td>
                    <td style={{ fontSize: ".82rem", color: "var(--ink-2)" }}>
                      {s.created_at
                        ? new Date(s.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <a
                        href={paymentProofs.downloadUrl(s.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="adm-action-btn adm-action-btn--view"
                      >
                        <Eye size={12} /> View
                      </a>
                    </td>
                    <td>
                      <span className={`adm-chip adm-chip--${s.status}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      {s.status === "pending" ? (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="adm-action-btn adm-action-btn--approve"
                            onClick={() => approve(s.id)}
                          >
                            <Check size={12} /> Approve
                          </button>
                          <button
                            className="adm-action-btn adm-action-btn--del"
                            onClick={() => reject(s.id)}
                          >
                            <X size={12} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span
                          style={{ fontSize: ".75rem", color: "var(--ink-3)" }}
                        >
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── TESTIMONIALS TAB ─────────────────────────────────────────────────────────
function TestimonialsTab() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(() => {
    setLoading(true);
    testimonialsApi
      .listAll({ size: 100 })
      .then((d) => setList(d?.items || d || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const approve = async (id, val) => {
    try {
      await testimonialsApi.update(id, { is_approved: val });
      load();
    } catch (e) {
      alert(e.response?.data?.detail || "Failed");
    }
  };
  const feature = async (id, val) => {
    try {
      await testimonialsApi.update(id, { is_featured: val });
      load();
    } catch (e) {
      alert(e.response?.data?.detail || "Failed");
    }
  };
  const del = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await testimonialsApi.delete(id);
      load();
    } catch (e) {
      alert(e.response?.data?.detail || "Failed");
    }
  };

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h2 className="adm-page-title">Testimonials</h2>
          <p className="adm-page-sub">
            Review and approve student testimonials before they appear publicly.
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={load}>
          <RefreshCw size={13} />
        </button>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <div className="adm-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Course</th>
                <th>Preview</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--ink-3)",
                    }}
                  >
                    No testimonials yet.
                  </td>
                </tr>
              ) : (
                list.map((t, i) => (
                  <tr key={t.id}>
                    <td style={{ color: "var(--ink-3)", fontWeight: 700 }}>
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td>
                      <strong>{t.name}</strong>
                    </td>
                    <td style={{ fontSize: ".82rem" }}>{t.course}</td>
                    <td
                      style={{
                        fontSize: ".8rem",
                        color: "var(--ink-2)",
                        maxWidth: 220,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      "{t.text}"
                    </td>
                    <td style={{ fontSize: ".82rem" }}>{t.rating}★</td>
                    <td>
                      <span
                        className={`adm-chip adm-chip--${t.is_approved ? "enrolled" : "pending"}`}
                      >
                        {t.is_approved ? "approved" : "pending"}
                      </span>
                      {t.is_featured && (
                        <span
                          className="adm-chip adm-chip--verified"
                          style={{ marginLeft: 4 }}
                        >
                          featured
                        </span>
                      )}
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          flexWrap: "wrap",
                        }}
                      >
                        {!t.is_approved ? (
                          <button
                            className="adm-action-btn adm-action-btn--approve"
                            onClick={() => approve(t.id, true)}
                          >
                            <Check size={12} /> Approve
                          </button>
                        ) : (
                          <button
                            className="adm-action-btn adm-action-btn--edit"
                            onClick={() => approve(t.id, false)}
                          >
                            <X size={12} /> Revoke
                          </button>
                        )}
                        <button
                          className="adm-action-btn adm-action-btn--view"
                          onClick={() => feature(t.id, !t.is_featured)}
                        >
                          {t.is_featured ? "Unfeature" : "Feature"}
                        </button>
                        <button
                          className="adm-action-btn adm-action-btn--del"
                          onClick={() => del(t.id)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS TAB ────────────────────────────────────────────────────────
function NotificationsTab() {
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("all");
  const [ntype, setNtype] = useState("info");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState([]);
  const [loadingSent, setLoadingSent] = useState(true);

  useEffect(() => {
    notifApi
      .listSent({ size: 20 })
      .then((d) => setSent(d?.items || d || []))
      .catch(() => {})
      .finally(() => setLoadingSent(false));
  }, []);

  const send = async () => {
    if (!title.trim() || !msg.trim())
      return alert("Title and message are required.");
    setSending(true);
    try {
      const r = await notifApi.broadcast({ title, body: msg, ntype, target });
      setSent((s) => [
        {
          id: r.id || Date.now(),
          title,
          body: msg,
          target,
          created_at: new Date().toISOString(),
        },
        ...s,
      ]);
      setTitle("");
      setMsg("");
    } catch (e) {
      alert(e.response?.data?.detail || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h2 className="adm-page-title">Notifications &amp; Broadcasts</h2>
      <p className="adm-page-sub">
        Send announcements to students, tutors, or all users.
      </p>
      <div className="adm-notify-compose">
        <h3 className="adm-section-h">Compose Broadcast</h3>
        <div className="adm-notify-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Recipient</label>
            <select
              className="form-input"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="enrolled">All Enrolled Students</option>
              <option value="tutors">All Tutors</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Type</label>
            <select
              className="form-input"
              value={ntype}
              onChange={(e) => setNtype(e.target.value)}
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            className="form-input"
            placeholder="Notification title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Message *</label>
          <textarea
            className="form-input"
            rows={4}
            placeholder="Type your message here…"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={send} disabled={sending}>
          <Send size={14} /> {sending ? "Sending…" : "Send Broadcast"}
        </button>
      </div>

      {sent.length > 0 && (
        <div className="adm-notify-sent" style={{ marginTop: "1.5rem" }}>
          <h3 className="adm-section-h">Sent Broadcasts</h3>
          {sent.slice(0, 10).map((s) => (
            <div key={s.id} className="adm-notify-sent-item">
              <div className="adm-notify-sent-icon">
                <Send size={14} />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: ".85rem" }}>{s.title}</strong>
                <p style={{ fontSize: ".8rem", color: "var(--ink-2)" }}>
                  {s.body}
                </p>
                <span style={{ fontSize: ".72rem", color: "var(--ink-3)" }}>
                  To: {s.target} ·{" "}
                  {s.created_at
                    ? new Date(s.created_at).toLocaleDateString()
                    : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── REPORTS TAB ─────────────────────────────────────────────────────────────
function ReportsTab({ stats }) {
  if (!stats) return <Spin />;
  const rev = stats.revenue_by_month || [];
  const enr = stats.enrollment_by_course || [];
  const ytd = rev.reduce((s, m) => s + (m.revenue || 0), 0);
  const peak = rev.length
    ? rev.reduce(
        (a, m) => ((m.revenue || 0) > (a?.revenue || 0) ? m : a),
        rev[0],
      )
    : null;
  return (
    <div>
      <h2 className="adm-page-title">Reports &amp; Analytics</h2>
      <p className="adm-page-sub">
        Platform performance, revenue and student outcomes.
      </p>
      <div className="adm-stats-grid" style={{ marginBottom: "1.5rem" }}>
        <StatCard
          label="Total Revenue"
          value={GHS(stats.total_revenue)}
          icon={<DollarSign size={20} />}
          color="#f59e0b"
        />
        <StatCard
          label="Active Enrollments"
          value={(stats.active_enrollments || 0).toLocaleString()}
          icon={<BookOpen size={20} />}
          color="#0f766e"
        />
        <StatCard
          label="Placement Rate"
          value={`${stats.placement_rate || 0}%`}
          icon={<UserCheck size={20} />}
          color="#059669"
        />
        <StatCard
          label="Active Courses"
          value={stats.courses_active || 0}
          icon={<GraduationCap size={20} />}
          color="#7c3aed"
        />
      </div>
      <div className="adm-chart-card adm-chart-card--full">
        <h3 className="adm-chart-title">
          Monthly Revenue Trend <span>(GHS)</span>
        </h3>
        <BarChart
          data={rev}
          valueKey="revenue"
          labelKey="month"
          color="#0f766e"
        />
        <div className="adm-chart-footer">
          <span>
            Peak:{" "}
            <strong>
              {peak ? `${peak.month} — ${GHS(peak.revenue)}` : "—"}
            </strong>
          </span>
          <span>
            YTD: <strong>{GHS(ytd)}</strong>
          </span>
          <span>
            Avg/month:{" "}
            <strong>
              {rev.length ? GHS(Math.round(ytd / rev.length)) : "—"}
            </strong>
          </span>
        </div>
      </div>
      <div
        className="adm-chart-card adm-chart-card--full"
        style={{ marginTop: "1.2rem" }}
      >
        <h3 className="adm-chart-title">Enrollment by Course</h3>
        <div className="adm-enroll-breakdown">
          {enr.length === 0 ? (
            <div
              style={{
                padding: "1.5rem",
                textAlign: "center",
                color: "var(--ink-3)",
              }}
            >
              No enrollment data yet.
            </div>
          ) : (
            enr.map((e) => {
              const max = Math.max(...enr.map((x) => x.count), 1);
              return (
                <div key={e.course} className="adm-breakdown-row">
                  <span className="adm-breakdown-label">{e.course}</span>
                  <div className="adm-breakdown-bar-wrap">
                    <div
                      className="adm-breakdown-bar"
                      style={{ width: `${(e.count / max) * 100}%` }}
                    />
                  </div>
                  <span className="adm-breakdown-count">{e.count}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ENQUIRIES TAB ───────────────────────────────────────────────────────────
function EnquiriesTab() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(() => {
    setLoading(true);
    enquiries
      .list()
      .then((d) => setList(d?.items || d || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h2 className="adm-page-title">Contact Enquiries</h2>
          <p className="adm-page-sub">
            Messages submitted via the Contact page.
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={load}>
          <RefreshCw size={13} />
        </button>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <div className="adm-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--ink-3)",
                    }}
                  >
                    No enquiries yet.
                  </td>
                </tr>
              ) : (
                list.map((e, i) => (
                  <tr key={e.id}>
                    <td style={{ color: "var(--ink-3)", fontWeight: 700 }}>
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td>
                      <strong>{e.name}</strong>
                    </td>
                    <td style={{ fontSize: ".82rem", color: "var(--ink-2)" }}>
                      {e.email}
                    </td>
                    <td style={{ fontSize: ".82rem" }}>{e.subject || "—"}</td>
                    <td>
                      <span
                        className={`adm-chip adm-chip--${e.status === "open" ? "pending" : "completed"}`}
                      >
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ADMIN PORTAL ───────────────────────────────────────────────────────
export default function AdminPortal() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [dashStats, setDashStats] = useState(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    admin
      .dashboard()
      .then((s) => {
        setDashStats(s);
        setUnread(s?.unread_notifications || 0);
      })
      .catch(console.error);
  }, []);

  if (!user) return null;
  if (!isAdmin) {
    navigate("/profile", { replace: true });
    return null;
  }

  const TAB_CONTENT = {
    dashboard: <Dashboard />,
    courses: <CoursesTab />,
    users: <StudentsTab />,
    workshops: <WorkshopsTab />,
    payments: <PaymentsTab />,
    testimonials: <TestimonialsTab />,
    notifications: <NotificationsTab />,
    reports: <ReportsTab stats={dashStats} />,
    enquiries: <EnquiriesTab />,
  };

  return (
    <div className="adm-layout page-enter">
      <aside className="adm-side">
        <div className="adm-side-logo">
          <span className="adm-side-logo-icon">⚡</span>
          <div>
            <strong>Admin Portal</strong>
            <span>CodeFount</span>
          </div>
        </div>
        <nav className="adm-side-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`adm-nav-btn ${tab === t.id ? "adm-nav-btn--on" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
              {t.id === "notifications" && unread > 0 && (
                <span className="adm-nav-badge">{unread}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="adm-side-foot">
          <div className="adm-side-user">
            <div className="adm-side-av">
              {(user?.full_name || "A")[0].toUpperCase()}
            </div>
            <div>
              <div className="adm-side-uname">{user?.full_name || "Admin"}</div>
              <div className="adm-side-urole">Administrator</div>
            </div>
          </div>
          <button className="adm-logout-btn" onClick={logout}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="adm-main">
        <div className="adm-topbar">
          <div className="adm-topbar-breadcrumb">
            <span>Admin</span>
            <ChevronRight size={13} />
            <span>{TABS.find((t) => t.id === tab)?.label}</span>
          </div>
          <div className="adm-topbar-right">
            <button
              className="adm-topbar-icon"
              onClick={() => setTab("notifications")}
            >
              <Bell size={16} />
              {unread > 0 && <span className="adm-topbar-badge">{unread}</span>}
            </button>
          </div>
        </div>
        <div className="adm-content">{TAB_CONTENT[tab]}</div>
      </main>
    </div>
  );
}

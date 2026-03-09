import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Bell,
  BarChart2,
  Wrench,
  LogOut,
  ChevronRight,
  TrendingUp,
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
  Upload,
  MessageSquare,
  GraduationCap,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  admin,
  courses as coursesApi,
  workshops as workshopsApi,
  paymentProofs,
  notifications as notifApi,
} from "../../api/api";

const GHS = (v) => `GHS ${Number(v).toLocaleString()}`;
import "./AdminPortal.css";

// ─── Sidebar ────────────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { id: "courses", label: "Courses", icon: <BookOpen size={16} /> },
  { id: "users", label: "Students", icon: <Users size={16} /> },
  { id: "workshops", label: "Workshops", icon: <Zap size={16} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { id: "reports", label: "Reports", icon: <BarChart2 size={16} /> },
  { id: "payments", label: "Payments", icon: <DollarSign size={16} /> },
];

// ─── Stat card ───────────────────────────────────────────────────────────────
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

// ─── Simple bar chart ────────────────────────────────────────────────────────
function BarChart({ data, valueKey, labelKey, color = "#0f766e" }) {
  const max = Math.max(...data.map((d) => d[valueKey]));
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

// ─── Mini progress ───────────────────────────────────────────────────────────
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

// ─── Mock students data ───────────────────────────────────────────────────────
const STUDENTS = [
  {
    id: 1,
    name: "Kwame Asante",
    email: "kwame@email.com",
    course: "Java Full Stack",
    status: "enrolled",
    payment: "verified",
    date: "Mar 1",
  },
  {
    id: 2,
    name: "Abena Mensah",
    email: "abena@email.com",
    course: "DevOps Multi-Cloud",
    status: "enrolled",
    payment: "pending",
    date: "Mar 3",
  },
  {
    id: 3,
    name: "Chidi Okonkwo",
    email: "chidi@email.com",
    course: "AWS Bootcamp",
    status: "completed",
    payment: "verified",
    date: "Feb 20",
  },
  {
    id: 4,
    name: "Fatima Al-Hassan",
    email: "fatima@email.com",
    course: "Cyber Security",
    status: "enrolled",
    payment: "rejected",
    date: "Mar 5",
  },
  {
    id: 5,
    name: "Emmanuel Darko",
    email: "emm@email.com",
    course: "Generative AI",
    status: "enrolled",
    payment: "verified",
    date: "Mar 6",
  },
  {
    id: 6,
    name: "Ama Boateng",
    email: "ama@email.com",
    course: "MERN Stack",
    status: "enrolled",
    payment: "pending",
    date: "Mar 2",
  },
  {
    id: 7,
    name: "Samuel Tetteh",
    email: "sam@email.com",
    course: "Data Analytics",
    status: "completed",
    payment: "verified",
    date: "Feb 15",
  },
  {
    id: 8,
    name: "Naomi Owusu",
    email: "naomi@email.com",
    course: ".NET Core Fullstack",
    status: "enrolled",
    payment: "verified",
    date: "Mar 4",
  },
];

// ─── DASHBOARD ─────────────────────────────────────────────────────────────
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

  if (loading) return <div className="adm-loading">Loading dashboard…</div>;
  if (!stats)
    return <div className="adm-loading">Failed to load dashboard.</div>;

  const revenueByMonth = stats.revenue_by_month || [];
  const enrollmentByCourse = stats.enrollment_by_course || [];

  return (
    <div>
      <h2 className="adm-page-title">Dashboard Overview</h2>
      <p className="adm-page-sub">
        Welcome back, Admin. Here's what's happening at CodeFount today.
      </p>
      {/* ... Stat cards and charts ... */}
    </div>
  );
}

// ─── COURSES TAB ────────────────────────────────────────────────────────────
const courses = []; // temporary placeholder

function CoursesTab() {
  const [showForm, setShowForm] = useState(false);
  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h2 className="adm-page-title">Course Management</h2>
          <p className="adm-page-sub">
            Add, edit and deactivate training courses.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={15} /> Add Course
        </button>
      </div>

      {showForm && (
        <div className="adm-form-card">
          <h3 className="adm-form-title">New Course</h3>
          <div className="adm-form-grid">
            <div className="form-group">
              <label className="form-label">Course Title</label>
              <input
                className="form-input"
                placeholder="e.g. Java Full Stack"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input">
                <option>Java Fullstack</option>
                <option>DevOps</option>
                <option>Cloud Computing</option>
                <option>AI/ML</option>
                <option>Data Science</option>
                <option>Cyber Security</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Trainer</label>
              <input className="form-input" placeholder="Trainer name" />
            </div>
            <div className="form-group">
              <label className="form-label">Duration</label>
              <input className="form-input" placeholder="e.g. 3 Months" />
            </div>
            <div className="form-group">
              <label className="form-label">Full Fee (GHS)</label>
              <input className="form-input" type="number" placeholder="3000" />
            </div>
            <div className="form-group">
              <label className="form-label">Offer Price (GHS)</label>
              <input className="form-input" type="number" placeholder="1900" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Course description…"
            />
          </div>
          <div className="adm-form-actions">
            <button className="btn btn-primary">
              <Check size={14} /> Save Course
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

      <div className="adm-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Course</th>
              <th>Trainer</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Mode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{c.title || "-"}</td>
                <td>{c.trainer || "-"}</td>
                <td>{c.duration || "-"}</td>
                <td>
                  {c.offer ? GHS(c.offer) : "-"}{" "}
                  <del>{c.fee ? GHS(c.fee) : "-"}</del>
                </td>
                <td>{c.mode?.join(", ") || "-"}</td>
                <td>
                  <button>
                    <Edit2 size={12} />
                  </button>
                  <button>
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS TAB ───────────────────────────────────────────────────────
const mockNotifications = []; // temporary placeholder

function NotificationsTab() {
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("all");
  const [sent, setSent] = useState([]);
  const [notifications, setNotifications] = useState(mockNotifications);

  const [sending, setSending] = useState(false);
  const [title, setTitle] = useState("");

  return (
    <div>
      <h2 className="adm-page-title">Notifications & Broadcasts</h2>
      <p className="adm-page-sub">
        Send messages to students, tutors or all users. View recent system
        notifications.
      </p>
    </div>
  );
}

// ─── MAIN ADMIN PORTAL ───────────────────────────────────────────────────────
export default function AdminPortal() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");

  if (!user) return <Navigate to="/login" replace />;

  const TAB_CONTENT = {
    dashboard: <Dashboard />,
    courses: <CoursesTab />,
    users: <div>Users Tab</div>,
    workshops: <div>Workshops Tab</div>,
    notifications: <NotificationsTab />,
    reports: <div>Reports Tab</div>,
    payments: <div>Payments Tab</div>,
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
              className={tab === t.id ? "adm-nav-btn--on" : ""}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <div className="adm-side-foot">
          <div className="adm-side-user">{user?.name?.[0] || "A"}</div>
          <button onClick={logout}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="adm-main">{TAB_CONTENT[tab]}</main>
    </div>
  );
}

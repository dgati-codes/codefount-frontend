import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Settings,
  LogOut,
  ArrowRight,
  Award,
  Zap,
  Bell,
  Upload,
  Check,
  FileText,
  Video,
  ExternalLink,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  enrollments as enrollApi,
  wsRegs,
  notifications as notifApi,
  resources as resourcesApi,
  paymentProofs,
} from "../../api/api";
import "./Profile.css";

const GHS = (v) => `GHS ${Number(v).toLocaleString()}`;

const TABS = [
  { id: "my-courses", label: "My Courses", icon: <Award size={15} /> },
  { id: "browse", label: "Browse", icon: <BookOpen size={15} /> },
  { id: "workshops", label: "Workshops", icon: <Zap size={15} /> },
  { id: "schedule", label: "Schedule", icon: <Calendar size={15} /> },
  { id: "resources", label: "Resources", icon: <Video size={15} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={15} /> },
  { id: "settings", label: "Settings", icon: <Settings size={15} /> },
];

// ─── Payment Upload Component ────────────────────────────────────────────────
function PaymentUpload({ courseId, onClose }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | done
  const fileRef = useRef();

  const handleFile = (e) => setFile(e.target.files[0]);

  const submit = async () => {
    if (!file) return;
    setStatus("uploading");
    try {
      if (typeof courseId === "number") {
        await paymentProofs.upload(file, { enrollmentId: courseId });
      } else {
        await paymentProofs.upload(file, { workshopRegistrationId: courseId });
      }
      setStatus("done");
    } catch (e) {
      setStatus("idle");
      alert(e.response?.data?.detail || "Upload failed");
    }
  };

  return (
    <div className="prof-payment-modal">
      <div className="prof-payment-card">
        <div className="prof-payment-head">
          <h3>Upload Proof of Payment</h3>
          <button className="prof-payment-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {status === "done" ? (
          <div className="prof-payment-success">
            <CheckCircle size={40} color="var(--green)" />
            <h4>Payment receipt uploaded!</h4>
            <p>
              Our team will verify within 24 hours. You'll receive a
              notification once confirmed.
            </p>
            <button className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="prof-payment-sub">
              Upload a screenshot or PDF of your MoMo / bank transfer receipt.
              Accepted: JPG, PNG, PDF.
            </p>
            <div
              className={`prof-upload-zone ${
                file ? "prof-upload-zone--selected" : ""
              }`}
              onClick={() => fileRef.current.click()}
            >
              {file ? (
                <>
                  <FileText size={28} color="var(--teal)" />
                  <p>{file.name}</p>
                </>
              ) : (
                <>
                  <Upload size={28} color="var(--ink-3)" />
                  <p>Click to choose file or drag & drop</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              style={{ display: "none" }}
              onChange={handleFile}
            />
            <div className="adm-form-actions" style={{ marginTop: "1rem" }}>
              <button
                className="btn btn-primary"
                onClick={submit}
                disabled={!file || status === "uploading"}
              >
                {status === "uploading" ? (
                  "Uploading…"
                ) : (
                  <>
                    <Upload size={14} /> Submit Receipt
                  </>
                )}
              </button>
              <button className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Notification Item ───────────────────────────────────────────────────────
function NotifItem({ n, onRead }) {
  const colors = {
    info: "var(--teal)",
    resource: "#7c3aed",
    success: "var(--green)",
    warning: "var(--amber)",
    error: "var(--red)",
  };
  const icons = {
    info: <Bell size={14} />,
    resource: <Video size={14} />,
    success: <CheckCircle size={14} />,
    warning: <AlertCircle size={14} />,
  };
  return (
    <div
      className={`prof-notif-item ${
        !n.is_read ? "prof-notif-item--unread" : ""
      }`}
    >
      <div
        className="prof-notif-icon"
        style={{ background: colors[n.type] + "18", color: colors[n.type] }}
      >
        {icons[n.type] || <Bell size={14} />}
      </div>
      <div style={{ flex: 1 }}>
        <strong style={{ fontSize: ".85rem" }}>{n.title}</strong>
        <p
          style={{
            fontSize: ".78rem",
            color: "var(--ink-2)",
            marginTop: "2px",
          }}
        >
          {n.body}
        </p>
        <span style={{ fontSize: ".7rem", color: "var(--ink-3)" }}>
          {n.time}
        </span>
      </div>
      {!n.is_read && (
        <button className="prof-notif-read" onClick={() => onRead(n.id)}>
          <Check size={11} />
        </button>
      )}
    </div>
  );
}

// ─── MAIN PROFILE ────────────────────────────────────────────────────────────
export default function Profile() {
  const { user, logout, updateUser, uploadAvatar, changePassword } = useAuth();
  const [tab, setTab] = useState("my-courses");
  const [cat, setCat] = useState("All");

  // ── Real data state ──────────────────────────────────────────────────────
  const [enrolledList, setEnrolledList] = useState([]);
  const [workshopRegs, setWorkshopRegs] = useState([]);
  const [myResources, setMyResources] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [allWorkshops, setAllWorkshops] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    full_name: "",
    phone: "",
    gender: "",
    current_password: "",
    new_password: "",
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState("");

  const avatarRef = useRef();

  // Load all user data on mount
  useEffect(() => {
    if (!user) return;

    setSettingsForm((f) => ({
      ...f,
      full_name: user.full_name || "",
      phone: user.phone || "",
      gender: user.gender || "",
    }));

    Promise.all([
      enrollApi.my(),
      wsRegs.my(),
      resourcesApi.mine(),
      notifApi.inbox({ size: 50 }),
    ])
      .then(([enrols, regs, res, notifs]) => {
        setEnrolledList(enrols || []);
        setWorkshopRegs(regs || []);
        setMyResources(res || []);
        setNotifications(notifs?.items || []);
      })
      .catch(console.error)
      .finally(() => setDataLoading(false));

    // Load browse data
    import("../../api/api").then(
      ({ courses: coursesApi, workshops: wsApi }) => {
        Promise.all([coursesApi.list({ size: 50 }), wsApi.list({ size: 50 })])
          .then(([cd, wd]) => {
            setAllCourses(cd.items || []);
            setAllWorkshops(wd.items || []);
          })
          .catch(console.error);
      },
    );
  }, [user]);

  // Derived data
  const enrolled = enrolledList.map((e) => e.course_id);
  const regWorkshops = workshopRegs.map((r) => r.workshop_id);

  const myCourses = enrolledList.map((e) => ({
    ...e.course,
    enrollmentId: e.id,
    progress: e.progress,
    status: e.status,
  }));
  const myWorkshops = workshopRegs.map((r) => ({ ...r.workshop, regId: r.id }));
  const browseCourses =
    cat === "All" ? allCourses : allCourses.filter((c) => c.category === cat);
  const myResourcesFiltered = myResources.filter((r) =>
    enrolled.includes(r.courseId),
  );
  const unread = notifications.filter((n) => !n.read).length;

  const [paymentFor, setPaymentFor] = useState(null);

  const toggleEnroll = async (courseId) => {
    if (enrolled.includes(courseId)) {
      try {
        await enrollApi.unenroll(courseId);
        setEnrolledList((l) => l.filter((e) => e.course_id !== courseId));
      } catch (e) {
        alert(e.response?.data?.detail || "Failed to unenroll");
      }
    } else {
      try {
        const enrol = await enrollApi.enroll(courseId);
        const fresh = await enrollApi.my();
        setEnrolledList(fresh);
      } catch (e) {
        alert(e.response?.data?.detail || "Already enrolled or failed");
      }
    }
  };

  const toggleWorkshop = async (workshopId) => {
    if (regWorkshops.includes(workshopId)) {
      try {
        await wsRegs.cancel(workshopId);
        setWorkshopRegs((r) => r.filter((x) => x.workshop_id !== workshopId));
      } catch (e) {
        alert(e.response?.data?.detail || "Failed to cancel");
      }
    } else {
      try {
        const reg = await wsRegs.register(workshopId);
        const fresh = await wsRegs.my();
        setWorkshopRegs(fresh);
      } catch (e) {
        alert(e.response?.data?.detail || "Failed to register");
      }
    }
  };

  const markRead = (id) =>
    setNotifications((n) =>
      n.map((x) => (x.id === id ? { ...x, read: true } : x)),
    );

  return (
    <div className="prof-page page-enter">
      {paymentFor && (
        <PaymentUpload
          courseId={paymentFor}
          onClose={() => setPaymentFor(null)}
        />
      )}

      {/* Sidebar */}
      <aside className="prof-side">
        <div className="prof-side__head">
          <div className="prof-side__av">
            {user?.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="prof-side__name">{user?.full_name}</div>
            <div className="prof-side__email">{user?.email}</div>
            <div className="prof-side__badge">
              <span>
                {myCourses.length} Course{myCourses.length !== 1 ? "s" : ""}{" "}
                enrolled
              </span>
            </div>
          </div>
        </div>
        <nav className="prof-side__nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`prof-nav-btn ${tab === t.id ? "prof-nav-btn--on" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon}
              {t.label}
              {t.id === "my-courses" && myCourses.length > 0 && (
                <span className="prof-nav-count">{myCourses.length}</span>
              )}
              {t.id === "workshops" && myWorkshops.length > 0 && (
                <span className="prof-nav-count">{myWorkshops.length}</span>
              )}
              {t.id === "notifications" && unread > 0 && (
                <span
                  className="prof-nav-count"
                  style={{ background: "var(--amber)" }}
                >
                  {unread}
                </span>
              )}
              {t.id === "resources" && myResourcesFiltered.length > 0 && (
                <span className="prof-nav-count">
                  {myResourcesFiltered.length}
                </span>
              )}
            </button>
          ))}
          <button
            className="prof-nav-btn prof-nav-btn--logout"
            onClick={logout}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="prof-main">
        {/* ── NOTIFICATIONS Tab Example ── */}
        {tab === "notifications" && (
          <div>
            <h2 className="prof-main__title">Notifications</h2>
            <p className="prof-main__sub">
              {unread > 0
                ? `${unread} unread notification${unread !== 1 ? "s" : ""}.`
                : "All caught up!"}
            </p>
            <div className="prof-notif-list">
              {notifications.map((n) => (
                <NotifItem key={n.id} n={n} onRead={markRead} />
              ))}
            </div>
          </div>
        )}

        {/* Other tabs omitted for brevity — keep your existing JSX */}
      </main>
    </div>
  );
}

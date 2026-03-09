import { useState, useRef } from "react";
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
  Clock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  courses,
  categories,
  workshops,
  GHS,
  tutorResources,
  mockNotifications,
} from "../../data/mockData";
import "./Profile.css";

const TABS = [
  { id: "my-courses", label: "My Courses", icon: <Award size={15} /> },
  { id: "browse", label: "Browse", icon: <BookOpen size={15} /> },
  { id: "workshops", label: "Workshops", icon: <Zap size={15} /> },
  { id: "schedule", label: "Schedule", icon: <Calendar size={15} /> },
  { id: "resources", label: "Resources", icon: <Video size={15} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={15} /> },
  { id: "settings", label: "Settings", icon: <Settings size={15} /> },
];

// ─── Payment upload component ────────────────────────────────────────────────
function PaymentUpload({ courseId, onClose }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | done
  const fileRef = useRef();

  const handleFile = (e) => setFile(e.target.files[0]);
  const submit = () => {
    if (!file) return;
    setStatus("uploading");
    setTimeout(() => setStatus("done"), 1500);
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
              className={`prof-upload-zone ${file ? "prof-upload-zone--selected" : ""}`}
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

// ─── Notification item ───────────────────────────────────────────────────────
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
      className={`prof-notif-item ${!n.read ? "prof-notif-item--unread" : ""}`}
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
      {!n.read && (
        <button className="prof-notif-read" onClick={() => onRead(n.id)}>
          <Check size={11} />
        </button>
      )}
    </div>
  );
}

// ─── MAIN PROFILE ────────────────────────────────────────────────────────────
export default function Profile() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("my-courses");
  const [cat, setCat] = useState("All");
  const [enrolled, setEnrolled] = useState([]);
  const [regWorkshops, setRegWorkshops] = useState([]);
  const [paymentFor, setPaymentFor] = useState(null);
  const [notifications, setNotifs] = useState(mockNotifications);

  const browseCourses =
    cat === "All" ? courses : courses.filter((c) => c.category === cat);
  const myCourses = courses.filter((c) => enrolled.includes(c.id));
  const myWorkshops = workshops.filter((w) => regWorkshops.includes(w.id));
  const myResources = tutorResources.filter((r) =>
    enrolled.includes(r.courseId),
  );
  const unread = notifications.filter((n) => !n.read).length;

  const toggleEnroll = (id) =>
    setEnrolled((e) =>
      e.includes(id) ? e.filter((i) => i !== id) : [...e, id],
    );
  const toggleWorkshop = (id) =>
    setRegWorkshops((r) =>
      r.includes(id) ? r.filter((i) => i !== id) : [...r, id],
    );
  const markRead = (id) =>
    setNotifs((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));

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
          <div className="prof-side__av">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="prof-side__name">{user?.name}</div>
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
              {t.id === "resources" && myResources.length > 0 && (
                <span className="prof-nav-count">{myResources.length}</span>
              )}
            </button>
          ))}
          <button
            className="prof-nav-btn prof-nav-btn--logout"
            onClick={logout}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="prof-main">
        {/* ── MY COURSES ── */}
        {tab === "my-courses" && (
          <div>
            <h2 className="prof-main__title">My Enrolled Courses</h2>
            <p className="prof-main__sub">
              {myCourses.length > 0
                ? `Enrolled in ${myCourses.length} course${myCourses.length !== 1 ? "s" : ""}.`
                : "No courses yet."}
            </p>
            {myCourses.length === 0 ? (
              <div className="prof-empty">
                <span style={{ fontSize: "3rem" }}>🎓</span>
                <p>Browse our courses below and click Enroll to get started.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setTab("browse")}
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="prof-enrolled-list">
                {myCourses.map((c) => (
                  <div key={c.id} className="prof-enrolled-card">
                    <div
                      className="prof-enrolled-banner"
                      style={{ background: c.color }}
                    >
                      <span className="prof-enrolled-cat">{c.category}</span>
                      <h3 className="prof-enrolled-title">{c.title}</h3>
                    </div>
                    <div className="prof-enrolled-body">
                      <div className="prof-enrolled-meta">
                        <span>📅 Next batch: Mar 11</span>
                        <span>⏱️ {c.duration}</span>
                        <span>👤 {c.trainer}</span>
                      </div>
                      <div className="prof-enrolled-progress">
                        <div className="prof-progress-head">
                          <span>Course Progress</span>
                          <span>0%</span>
                        </div>
                        <div className="prof-progress-bar">
                          <div
                            className="prof-progress-fill"
                            style={{ width: "0%", background: c.color }}
                          />
                        </div>
                      </div>
                      {/* Payment status */}
                      <div className="prof-payment-status">
                        <AlertCircle size={13} color="var(--amber)" />
                        <span>Payment pending verification</span>
                        <button
                          className="prof-upload-btn"
                          onClick={() => setPaymentFor(c.id)}
                        >
                          <Upload size={12} /> Upload Proof
                        </button>
                      </div>
                      <div className="prof-enrolled-actions">
                        <Link
                          to={`/courses/${c.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View Course <ArrowRight size={12} />
                        </Link>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => toggleEnroll(c.id)}
                        >
                          Unenroll
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BROWSE ── */}
        {tab === "browse" && (
          <div>
            <h2 className="prof-main__title">Browse & Enroll</h2>
            <p className="prof-main__sub">
              Click Enroll on any course to add it to your profile.
            </p>
            <div className="prof-filter">
              {categories.map((c) => (
                <button
                  key={c}
                  className={`prof-filter-btn ${cat === c ? "prof-filter-btn--on" : ""}`}
                  onClick={() => setCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="prof-courses">
              {browseCourses.map((c) => {
                const isIn = enrolled.includes(c.id);
                return (
                  <div
                    key={c.id}
                    className={`prof-course-card ${isIn ? "prof-course-card--enrolled" : ""}`}
                  >
                    <div
                      className="prof-course-banner"
                      style={{ background: c.color }}
                    >
                      {isIn && (
                        <span className="prof-enrolled-tick">✓ Enrolled</span>
                      )}
                      {c.title}
                    </div>
                    <div className="prof-course-body">
                      <p className="prof-course-trainer">
                        {c.trainer} · {c.duration}
                      </p>
                      <p className="prof-course-price">{GHS(c.offer)}</p>
                      <button
                        className={`btn btn-sm ${isIn ? "btn-outline" : "btn-primary"}`}
                        style={{ width: "100%", justifyContent: "center" }}
                        onClick={() => toggleEnroll(c.id)}
                      >
                        {isIn ? "✓ Enrolled" : "Enroll"}{" "}
                        <ArrowRight size={12} />
                      </button>
                      {isIn && (
                        <button
                          className="prof-upload-btn"
                          style={{ width: "100%", marginTop: ".4rem" }}
                          onClick={() => {
                            setPaymentFor(c.id);
                          }}
                        >
                          <Upload size={12} /> Upload Proof of Payment
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── WORKSHOPS ── */}
        {tab === "workshops" && (
          <div>
            <h2 className="prof-main__title">Workshops & Short Sessions</h2>
            <p className="prof-main__sub">
              Register for upcoming live workshops. Free and paid options
              available.
            </p>
            <div className="prof-ws-list">
              {workshops.map((w) => {
                const isReg = regWorkshops.includes(w.id);
                const pct = Math.round((w.filled / w.seats) * 100);
                return (
                  <div
                    key={w.id}
                    className={`prof-ws-card ${isReg ? "prof-ws-card--reg" : ""}`}
                  >
                    <div
                      className="prof-ws-banner"
                      style={{
                        background: `linear-gradient(140deg,${w.color}cc,${w.color}88)`,
                      }}
                    >
                      <span
                        className={`prof-ws-tag ${w.price === "FREE" ? "free" : "paid"}`}
                      >
                        {w.price === "FREE" ? "FREE" : w.price}
                      </span>
                      <span className="prof-ws-icon">{w.icon}</span>
                    </div>
                    <div className="prof-ws-body">
                      <h3 className="prof-ws-title">{w.title}</h3>
                      <div className="prof-ws-meta">
                        <span>📅 {w.date}</span>
                        <span>⏱️ {w.time}</span>
                        <span>📍 {w.mode}</span>
                      </div>
                      <div className="prof-ws-seats">
                        <span>{w.seats - w.filled} seats left</span>
                        <div className="prof-ws-bar">
                          <div
                            className="prof-ws-fill"
                            style={{ width: `${pct}%`, background: w.color }}
                          />
                        </div>
                      </div>
                      <button
                        className={`btn btn-sm ${isReg ? "btn-outline" : "btn-primary"}`}
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          marginTop: ".5rem",
                        }}
                        onClick={() => toggleWorkshop(w.id)}
                      >
                        {isReg ? "✓ Registered" : "Register"}{" "}
                        {!isReg && <ArrowRight size={12} />}
                      </button>
                      {isReg && typeof w.price !== "string" && (
                        <button
                          className="prof-upload-btn"
                          style={{ width: "100%", marginTop: ".4rem" }}
                          onClick={() => setPaymentFor(w.id)}
                        >
                          <Upload size={12} /> Upload Payment Proof
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SCHEDULE ── */}
        {tab === "schedule" && (
          <div>
            <h2 className="prof-main__title">My Schedule</h2>
            <p className="prof-main__sub">
              Your upcoming sessions from enrolled courses and registered
              workshops.
            </p>
            {myCourses.length === 0 && myWorkshops.length === 0 ? (
              <div className="prof-empty">
                <span style={{ fontSize: "3rem" }}>📅</span>
                <p>
                  Nothing scheduled yet. Enroll in a course or register for a
                  workshop.
                </p>
                <div style={{ display: "flex", gap: ".75rem" }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => setTab("browse")}
                  >
                    Browse Courses
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => setTab("workshops")}
                  >
                    View Workshops
                  </button>
                </div>
              </div>
            ) : (
              <div className="prof-schedule">
                {myCourses.map((c) => (
                  <div key={c.id} className="prof-sched-item">
                    <div
                      className="prof-sched-dot"
                      style={{ background: c.color }}
                    />
                    <div>
                      <p className="prof-sched-name">{c.title}</p>
                      <p className="prof-sched-meta">
                        📅 Batch starts Mar 11 · {c.duration} · {c.trainer}
                      </p>
                    </div>
                    <span className="chip chip-teal">Course</span>
                  </div>
                ))}
                {myWorkshops.map((w) => (
                  <div key={w.id} className="prof-sched-item">
                    <div
                      className="prof-sched-dot"
                      style={{ background: w.color }}
                    />
                    <div>
                      <p className="prof-sched-name">{w.title}</p>
                      <p className="prof-sched-meta">
                        📅 {w.date} · {w.time} · {w.mode}
                      </p>
                    </div>
                    <span className="chip chip-amber">Workshop</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── RESOURCES (Tutor shared) ── */}
        {tab === "resources" && (
          <div>
            <h2 className="prof-main__title">Tutor Resources</h2>
            <p className="prof-main__sub">
              Videos and links shared by your tutors. Only visible to enrolled
              students.
            </p>
            {myResources.length === 0 ? (
              <div className="prof-empty">
                <span style={{ fontSize: "3rem" }}>📚</span>
                <p>
                  No resources yet. Enroll in a course to see tutor-shared
                  materials.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setTab("browse")}
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="prof-resources-list">
                {myResources.map((r) => (
                  <div key={r.id} className="prof-resource-card">
                    <div className="prof-resource-icon">
                      {r.type === "video" ? (
                        <Video size={20} color="var(--teal)" />
                      ) : (
                        <FileText size={20} color="#7c3aed" />
                      )}
                    </div>
                    <div className="prof-resource-body">
                      <h4>{r.title}</h4>
                      <p className="prof-resource-meta">
                        {r.tutor} · {r.week} · {r.sharedAt}
                      </p>
                      <div className="prof-resource-links">
                        {r.videoUrl && (
                          <a
                            href={r.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="prof-resource-link prof-resource-link--video"
                          >
                            <Video size={12} /> Watch Video{" "}
                            <ExternalLink size={11} />
                          </a>
                        )}
                        {r.resourceUrl && (
                          <a
                            href={r.resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="prof-resource-link prof-resource-link--doc"
                          >
                            <FileText size={12} /> Open Resource{" "}
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                    <span className={`prof-resource-badge ${r.type}`}>
                      {r.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── NOTIFICATIONS ── */}
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

        {/* ── SETTINGS ── */}
        {tab === "settings" && (
          <div>
            <h2 className="prof-main__title">Account Settings</h2>
            <p className="prof-main__sub">Update your profile information.</p>
            <div className="prof-settings">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" defaultValue={user?.name} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  defaultValue={user?.email}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="Your phone number" />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-input">
                  <option>Prefer not to say</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Min 6 characters"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Profile Photo</label>
                <div className="prof-photo-upload">
                  <div className="prof-photo-av">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <button className="prof-upload-btn">
                    <Upload size={12} /> Upload Photo
                  </button>
                </div>
              </div>
              <button className="btn btn-primary">
                <Check size={14} /> Save Changes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
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
  Loader,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  enrollments as enrollApi,
  wsRegs,
  notifications as notifApi,
  resources as resourcesApi,
  paymentProofs,
  courses as coursesApi,
  workshops as workshopsApi,
} from "../../api/api";
import "./Profile.css";

const GHS = (v) => `GHS ${Number(v || 0).toLocaleString()}`;

const TABS = [
  { id: "my-courses", label: "My Courses", icon: <Award size={15} /> },
  { id: "browse", label: "Browse", icon: <BookOpen size={15} /> },
  { id: "workshops", label: "Workshops", icon: <Zap size={15} /> },
  { id: "schedule", label: "Schedule", icon: <Calendar size={15} /> },
  { id: "resources", label: "Resources", icon: <Video size={15} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={15} /> },
  { id: "settings", label: "Settings", icon: <Settings size={15} /> },
];

function Spin() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
      <Loader
        size={28}
        color="var(--teal)"
        style={{ animation: "spin 0.7s linear infinite" }}
      />
    </div>
  );
}

function PaymentUpload({ enrollmentId, onClose, onDone }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const fileRef = useRef();
  const submit = async () => {
    if (!file) return;
    setStatus("uploading");
    try {
      await paymentProofs.upload(file, { enrollmentId });
      setStatus("done");
      onDone && onDone();
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
            <h4>Receipt uploaded!</h4>
            <p>
              Our team will verify within 24 hours. You will be notified once
              confirmed.
            </p>
            <button className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="prof-payment-sub">
              Upload MoMo / bank transfer receipt. Accepted: JPG, PNG, PDF.
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
                  <p>Click to choose file</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
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
  const key = n.ntype || n.type || "info";
  const isUnread = !(n.is_read ?? n.read);
  return (
    <div
      className={`prof-notif-item ${isUnread ? "prof-notif-item--unread" : ""}`}
    >
      <div
        className="prof-notif-icon"
        style={{
          background: (colors[key] || "var(--teal)") + "18",
          color: colors[key] || "var(--teal)",
        }}
      >
        {icons[key] || <Bell size={14} />}
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
          {n.created_at ? new Date(n.created_at).toLocaleString() : n.time}
        </span>
      </div>
      {isUnread && (
        <button className="prof-notif-read" onClick={() => onRead(n.id)}>
          <Check size={11} /> Mark read
        </button>
      )}
    </div>
  );
}

export default function Profile() {
  const { user, logout, updateUser, uploadAvatar, changePassword } = useAuth();
  const [tab, setTab] = useState("my-courses");
  const [cat, setCat] = useState("All");
  const [dataLoading, setDataLoading] = useState(true);
  const [paymentFor, setPaymentFor] = useState(null);
  const [enrolledList, setEnrolledList] = useState([]);
  const [workshopRegs, setWorkshopRegs] = useState([]);
  const [myResources, setMyResources] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [allWorkshops, setAllWorkshops] = useState([]);
  const [sf, setSf] = useState({ full_name: "", phone: "", gender: "" });
  const [pwForm, setPwForm] = useState({ current: "", next: "" });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const avatarRef = useRef();

  const loadData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    try {
      const [enrols, regs, res, notifs, cData, wData] = await Promise.all([
        enrollApi.my(),
        wsRegs.my(),
        resourcesApi.mine(),
        notifApi.inbox({ size: 50 }),
        coursesApi.list({ size: 100 }),
        workshopsApi.list({ size: 50 }),
      ]);
      setEnrolledList(enrols || []);
      setWorkshopRegs(regs || []);
      setMyResources(res || []);
      setNotifications(notifs?.items || notifs || []);
      setAllCourses(cData?.items || []);
      setAllWorkshops(wData?.items || []);
    } catch (e) {
      console.error("Profile load error:", e);
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  useEffect(() => {
    if (user)
      setSf({
        full_name: user.full_name || "",
        phone: user.phone || "",
        gender: user.gender || "",
      });
  }, [user]);

  const enrolledCourseIds = enrolledList.map((e) => Number(e.course_id));
  const regWorkshopIds = workshopRegs.map((r) => Number(r.workshop_id));

  const myCourses = enrolledList.map((e) => {
    // EnrollmentResponse includes a .course CourseSummary — use it, fall back to allCourses
    const course =
      e.course ||
      (e.course_id
        ? allCourses.find((c) => c.id === Number(e.course_id))
        : null) ||
      {};
    return {
      ...course,
      id: course.id || e.course_id,
      title: course.title || `Course #${e.course_id}`,
      enrollmentId: e.id,
      progress: e.progress || 0,
      enrollStatus: e.status,
    };
  });
  const myWorkshopsList = workshopRegs.map((r) => {
    const ws =
      r.workshop ||
      (r.workshop_id
        ? allWorkshops.find((w) => w.id === Number(r.workshop_id))
        : null) ||
      {};
    return {
      ...ws,
      id: ws.id || r.workshop_id,
      title: ws.title || `Workshop #${r.workshop_id}`,
      regId: r.id,
    };
  });
  const categories = [
    "All",
    ...new Set(allCourses.map((c) => c.category).filter(Boolean)),
  ];
  const browseCourses =
    cat === "All" ? allCourses : allCourses.filter((c) => c.category === cat);
  const unread = notifications.filter((n) => !(n.is_read ?? n.read)).length;

  const toggleEnroll = async (courseId) => {
    if (enrolledCourseIds.includes(Number(courseId))) {
      try {
        await enrollApi.unenroll(courseId);
        const f = await enrollApi.my();
        setEnrolledList(f);
      } catch (e) {
        alert(e.response?.data?.detail || "Failed to unenroll");
      }
    } else {
      try {
        await enrollApi.enroll(Number(courseId));
        const f = await enrollApi.my();
        setEnrolledList(f);
      } catch (e) {
        alert(e.response?.data?.detail || "Enrollment failed");
      }
    }
  };
  const toggleWorkshop = async (workshopId) => {
    if (regWorkshopIds.includes(Number(workshopId))) {
      try {
        await wsRegs.cancel(workshopId);
        const f = await wsRegs.my();
        setWorkshopRegs(f);
      } catch (e) {
        alert(e.response?.data?.detail || "Failed to cancel");
      }
    } else {
      try {
        await wsRegs.register(workshopId);
        const f = await wsRegs.my();
        setWorkshopRegs(f);
      } catch (e) {
        alert(e.response?.data?.detail || "Failed to register");
      }
    }
  };
  const markRead = async (id) => {
    try {
      await notifApi.markRead(id);
      setNotifications((ns) =>
        ns.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch (e) {}
  };
  const markAllRead = async () => {
    try {
      await notifApi.markAllRead();
      setNotifications((ns) => ns.map((n) => ({ ...n, is_read: true })));
    } catch (e) {}
  };
  const saveSettings = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      if (pwForm.current && pwForm.next) {
        const r = await changePassword(pwForm.current, pwForm.next);
        if (!r.ok) {
          setSaveMsg(r.error);
          setSaving(false);
          return;
        }
        setPwForm({ current: "", next: "" });
      }
      const r = await updateUser({
        full_name: sf.full_name,
        phone: sf.phone,
        gender: sf.gender,
      });
      setSaveMsg(r.ok ? "Saved!" : r.error);
    } finally {
      setSaving(false);
    }
  };

  if (dataLoading) return <Spin />;

  return (
    <div className="prof-page page-enter">
      {paymentFor && (
        <PaymentUpload
          enrollmentId={paymentFor}
          onClose={() => setPaymentFor(null)}
          onDone={loadData}
        />
      )}

      <aside className="prof-side">
        <div className="prof-side__head">
          <div className="prof-side__av">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="av"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              (user?.full_name?.[0] || "U").toUpperCase()
            )}
          </div>
          <div>
            <div className="prof-side__name">{user?.full_name}</div>
            <div className="prof-side__email">{user?.email}</div>
            <div className="prof-side__badge">
              <span>
                {myCourses.length} course{myCourses.length !== 1 ? "s" : ""}{" "}
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
              {t.id === "workshops" && myWorkshopsList.length > 0 && (
                <span className="prof-nav-count">{myWorkshopsList.length}</span>
              )}
              {t.id === "resources" && myResources.length > 0 && (
                <span className="prof-nav-count">{myResources.length}</span>
              )}
              {t.id === "notifications" && unread > 0 && (
                <span
                  className="prof-nav-count"
                  style={{ background: "var(--amber)" }}
                >
                  {unread}
                </span>
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

      <main className="prof-main">
        {tab === "my-courses" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <h2 className="prof-main__title">My Enrolled Courses</h2>
                <p className="prof-main__sub">
                  {myCourses.length > 0
                    ? `Enrolled in ${myCourses.length} course${myCourses.length !== 1 ? "s" : ""}.`
                    : "No courses enrolled yet."}
                </p>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={loadData}
                title="Refresh"
              >
                <RefreshCw size={13} />
              </button>
            </div>
            {myCourses.length === 0 ? (
              <div className="prof-empty">
                <span style={{ fontSize: "3rem" }}>🎓</span>
                <p>Browse our courses and click Enroll to get started.</p>
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
                  <div key={c.enrollmentId} className="prof-enrolled-card">
                    <div
                      className="prof-enrolled-banner"
                      style={{ background: c.color || "var(--teal)" }}
                    >
                      <span className="prof-enrolled-cat">{c.category}</span>
                      <h3 className="prof-enrolled-title">{c.title}</h3>
                    </div>
                    <div className="prof-enrolled-body">
                      <div className="prof-enrolled-meta">
                        <span>⏱️ {c.duration}</span>
                        <span>👤 {c.trainer}</span>
                        <span
                          className={`adm-chip adm-chip--${c.enrollStatus === "active" ? "enrolled" : "pending"}`}
                        >
                          {c.enrollStatus || "pending"}
                        </span>
                      </div>
                      <div className="prof-enrolled-progress">
                        <div className="prof-progress-head">
                          <span>Progress</span>
                          <span>{c.progress || 0}%</span>
                        </div>
                        <div className="prof-progress-bar">
                          <div
                            className="prof-progress-fill"
                            style={{
                              width: `${c.progress || 0}%`,
                              background: c.color || "var(--teal)",
                            }}
                          />
                        </div>
                      </div>
                      {c.enrollStatus !== "active" && (
                        <div className="prof-payment-status">
                          <AlertCircle size={13} color="var(--amber)" />
                          <span>Payment pending</span>
                          <button
                            className="prof-upload-btn"
                            onClick={() => setPaymentFor(c.enrollmentId)}
                          >
                            <Upload size={12} /> Upload Proof
                          </button>
                        </div>
                      )}
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

        {tab === "browse" && (
          <div>
            <h2 className="prof-main__title">Browse &amp; Enroll</h2>
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
            {browseCourses.length === 0 ? (
              <div className="prof-empty">
                <p>No courses found.</p>
              </div>
            ) : (
              <div className="prof-courses">
                {browseCourses.map((c) => {
                  const isIn = enrolledCourseIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      className={`prof-course-card ${isIn ? "prof-course-card--enrolled" : ""}`}
                    >
                      <div
                        className="prof-course-banner"
                        style={{ background: c.color || "var(--teal)" }}
                      >
                        {isIn && (
                          <span className="prof-enrolled-tick">✓ Enrolled</span>
                        )}
                        <span>{c.title}</span>
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
                              const e = enrolledList.find(
                                (x) => x.course_id === c.id,
                              );
                              if (e) setPaymentFor(e.id);
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
            )}
          </div>
        )}

        {tab === "workshops" && (
          <div>
            <h2 className="prof-main__title">Workshops &amp; Short Sessions</h2>
            <p className="prof-main__sub">
              Register for upcoming live workshops.
            </p>
            {allWorkshops.length === 0 ? (
              <div className="prof-empty">
                <p>No workshops available right now.</p>
              </div>
            ) : (
              <div className="prof-ws-list">
                {allWorkshops.map((w) => {
                  const isReg = regWorkshopIds.includes(w.id);
                  const filled = w.filled || w.registrations_count || 0;
                  const pct = w.seats
                    ? Math.round((filled / w.seats) * 100)
                    : 0;
                  const price =
                    w.price == null || w.price === 0 ? "FREE" : GHS(w.price);
                  return (
                    <div
                      key={w.id}
                      className={`prof-ws-card ${isReg ? "prof-ws-card--reg" : ""}`}
                    >
                      <div
                        className="prof-ws-banner"
                        style={{
                          background: `linear-gradient(140deg,${w.color || "#0f766e"}cc,${w.color || "#0f766e"}88)`,
                        }}
                      >
                        <span
                          className={`prof-ws-tag ${price === "FREE" ? "free" : "paid"}`}
                        >
                          {price}
                        </span>
                        <span className="prof-ws-icon">{w.icon || "🎓"}</span>
                      </div>
                      <div className="prof-ws-body">
                        <h3 className="prof-ws-title">{w.title}</h3>
                        <div className="prof-ws-meta">
                          <span>📅 {w.date}</span>
                          <span>⏱️ {w.time}</span>
                          <span>📍 {w.mode}</span>
                        </div>
                        {w.seats && (
                          <div className="prof-ws-seats">
                            <span>{w.seats - filled} seats left</span>
                            <div className="prof-ws-bar">
                              <div
                                className="prof-ws-fill"
                                style={{
                                  width: `${pct}%`,
                                  background: w.color || "var(--teal)",
                                }}
                              />
                            </div>
                          </div>
                        )}
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
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "schedule" && (
          <div>
            <h2 className="prof-main__title">My Schedule</h2>
            <p className="prof-main__sub">
              Your sessions from enrolled courses and registered workshops.
            </p>
            {myCourses.length === 0 && myWorkshopsList.length === 0 ? (
              <div className="prof-empty">
                <span style={{ fontSize: "3rem" }}>📅</span>
                <p>Nothing scheduled yet.</p>
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
                  <div key={c.enrollmentId} className="prof-sched-item">
                    <div
                      className="prof-sched-dot"
                      style={{ background: c.color || "var(--teal)" }}
                    />
                    <div>
                      <p className="prof-sched-name">{c.title}</p>
                      <p className="prof-sched-meta">
                        ⏱️ {c.duration} · 👤 {c.trainer}
                      </p>
                    </div>
                    <span className="chip chip-teal">Course</span>
                  </div>
                ))}
                {myWorkshopsList.map((w) => (
                  <div key={w.regId} className="prof-sched-item">
                    <div
                      className="prof-sched-dot"
                      style={{ background: w.color || "var(--amber)" }}
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

        {tab === "resources" && (
          <div>
            <h2 className="prof-main__title">Tutor Resources</h2>
            <p className="prof-main__sub">
              Videos and links shared by your tutors.
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
                      {(r.rtype || r.type) === "video" ? (
                        <Video size={20} color="var(--teal)" />
                      ) : (
                        <FileText size={20} color="#7c3aed" />
                      )}
                    </div>
                    <div className="prof-resource-body">
                      <h4>{r.title}</h4>
                      <p className="prof-resource-meta">
                        {r.tutor_name} · {r.week} ·{" "}
                        {r.created_at
                          ? new Date(r.created_at).toLocaleDateString()
                          : ""}
                      </p>
                      <div className="prof-resource-links">
                        {r.video_url && (
                          <a
                            href={r.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="prof-resource-link prof-resource-link--video"
                          >
                            <Video size={12} /> Watch Video{" "}
                            <ExternalLink size={11} />
                          </a>
                        )}
                        {r.resource_url && (
                          <a
                            href={r.resource_url}
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
                    <span
                      className={`prof-resource-badge ${r.rtype || r.type}`}
                    >
                      {r.rtype || r.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "notifications" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div>
                <h2 className="prof-main__title" style={{ margin: 0 }}>
                  Notifications
                </h2>
                <p className="prof-main__sub" style={{ margin: 0 }}>
                  {unread > 0 ? `${unread} unread` : "All caught up!"}
                </p>
              </div>
              {unread > 0 && (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={markAllRead}
                >
                  <Check size={12} /> Mark all read
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="prof-empty">
                <Bell size={32} color="var(--ink-3)" />
                <p>No notifications yet.</p>
              </div>
            ) : (
              <div className="prof-notif-list">
                {notifications.map((n) => (
                  <NotifItem key={n.id} n={n} onRead={markRead} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "settings" && (
          <div>
            <h2 className="prof-main__title">Account Settings</h2>
            <p className="prof-main__sub">Update your profile information.</p>
            <div className="prof-settings">
              <div className="form-group">
                <label className="form-label">Profile Photo</label>
                <div className="prof-photo-upload">
                  <div className="prof-photo-av">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt="av"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      (user?.full_name?.[0] || "U").toUpperCase()
                    )}
                  </div>
                  <input
                    ref={avatarRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const r = await uploadAvatar(e.target.files[0]);
                      if (!r.ok) alert(r.error);
                    }}
                  />
                  <button
                    className="prof-upload-btn"
                    onClick={() => avatarRef.current.click()}
                  >
                    <Upload size={12} /> Upload Photo
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  value={sf.full_name}
                  onChange={(e) =>
                    setSf((f) => ({ ...f, full_name: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Email{" "}
                  <span style={{ fontSize: ".72rem", color: "var(--ink-3)" }}>
                    (cannot change)
                  </span>
                </label>
                <input
                  className="form-input"
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  style={{ opacity: 0.65 }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  className="form-input"
                  placeholder="Phone number"
                  value={sf.phone}
                  onChange={(e) =>
                    setSf((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-input"
                  value={sf.gender}
                  onChange={(e) =>
                    setSf((f) => ({ ...f, gender: e.target.value }))
                  }
                >
                  <option value="">Prefer not to say</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div
                style={{
                  borderTop: "1px solid var(--line)",
                  paddingTop: "1.25rem",
                  marginTop: ".5rem",
                }}
              >
                <p
                  className="form-label"
                  style={{ marginBottom: ".75rem", fontWeight: 600 }}
                >
                  Change Password
                </p>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="••••••••"
                    value={pwForm.current}
                    onChange={(e) =>
                      setPwForm((f) => ({ ...f, current: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Min 8 characters"
                    value={pwForm.next}
                    onChange={(e) =>
                      setPwForm((f) => ({ ...f, next: e.target.value }))
                    }
                  />
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={saveSettings}
                disabled={saving}
              >
                <Check size={14} /> {saving ? "Saving…" : "Save Changes"}
              </button>
              {saveMsg && (
                <p
                  style={{
                    marginTop: ".5rem",
                    fontSize: ".82rem",
                    color: saveMsg.startsWith("Saved")
                      ? "var(--teal)"
                      : "var(--red)",
                  }}
                >
                  {saveMsg}
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

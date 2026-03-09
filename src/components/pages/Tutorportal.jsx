import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Video,
  FileText,
  Users,
  BookOpen,
  Bell,
  LogOut,
  Check,
  X,
  Send,
  Plus,
  Edit2,
  Trash2,
  Loader,
  RefreshCw,
  Save,
  ExternalLink,
  Award,
  TrendingUp,
} from "lucide-react";
import {
  resources as resourcesApi,
  courses as coursesApi,
  notifications as notifApi,
} from "../../api/api";
import "./TutorPortal.css";

const TABS = [
  { id: "overview", label: "Overview", icon: <Award size={15} /> },
  { id: "resources", label: "Share Resources", icon: <Video size={15} /> },
  { id: "notify", label: "Notify Students", icon: <Bell size={15} /> },
];

function Spin() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", padding: "2.5rem" }}
    >
      <Loader
        size={26}
        color="var(--teal)"
        style={{ animation: "spin .7s linear infinite" }}
      />
    </div>
  );
}

// ─── Resource Form ────────────────────────────────────────────────────────────
function ResourceForm({ courses, onSave, editing, onCancel }) {
  const blank = {
    courseId: "",
    week: "",
    title: "",
    videoUrl: "",
    resourceUrl: "",
    rtype: "video",
  };
  const [form, setForm] = useState(
    editing
      ? {
          courseId: String(editing.course_id || ""),
          week: editing.week || "",
          title: editing.title || "",
          videoUrl: editing.video_url || "",
          resourceUrl: editing.resource_url || "",
          rtype: editing.rtype || "video",
        }
      : blank,
  );
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.courseId || !form.title)
      return alert("Please select a course and enter a title.");
    setSaving(true);
    try {
      const body = {
        course_id: Number(form.courseId),
        week: form.week,
        title: form.title,
        rtype: form.rtype,
        video_url: form.videoUrl || null,
        resource_url: form.resourceUrl || null,
      };
      const r = editing
        ? await resourcesApi.update(editing.id, body)
        : await resourcesApi.create(body);
      onSave(r, !!editing);
      if (!editing) setForm(blank);
    } catch (e) {
      alert(e.response?.data?.detail || "Failed to save resource");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tutor-form">
      <h3 className="tutor-form__title">
        {editing ? "Edit Resource" : "Share a New Resource"}
      </h3>
      <div className="tutor-form__grid">
        <div className="form-group">
          <label className="form-label">Course *</label>
          <select
            className="form-input"
            value={form.courseId}
            onChange={set("courseId")}
          >
            <option value="">Select course…</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Week / Topic</label>
          <input
            className="form-input"
            placeholder="e.g. Wk 3–4: Streams API"
            value={form.week}
            onChange={set("week")}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Type</label>
          <select
            className="form-input"
            value={form.rtype}
            onChange={set("rtype")}
          >
            <option value="video">Video</option>
            <option value="document">Document / Link</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Resource Title *</label>
        <input
          className="form-input"
          placeholder="e.g. Advanced Collections Deep Dive"
          value={form.title}
          onChange={set("title")}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Video URL (YouTube, Loom, Vimeo…)</label>
        <input
          className="form-input"
          type="url"
          placeholder="https://youtube.com/watch?v=…"
          value={form.videoUrl}
          onChange={set("videoUrl")}
        />
      </div>
      <div className="form-group">
        <label className="form-label">
          Reference / Resource URL (Docs, GitHub, Drive…)
        </label>
        <input
          className="form-input"
          type="url"
          placeholder="https://docs.example.com"
          value={form.resourceUrl}
          onChange={set("resourceUrl")}
        />
      </div>
      <div style={{ display: "flex", gap: ".75rem" }}>
        <button className="btn btn-primary" onClick={submit} disabled={saving}>
          <Send size={14} />{" "}
          {saving
            ? "Saving…"
            : editing
              ? "Update Resource"
              : "Share with Students"}
        </button>
        {editing && (
          <button className="btn btn-outline" onClick={onCancel}>
            <X size={14} /> Cancel
          </button>
        )}
      </div>
    </div>
  );
}

// ─── MAIN TUTOR PORTAL ────────────────────────────────────────────────────────
export default function TutorPortal() {
  const { user, logout, isTrainer, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [courses, setCourses] = useState([]);
  const [sharedResources, setSharedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRes, setEditingRes] = useState(null);

  // Notify state
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMsg, setNotifMsg] = useState("");
  const [notifTarget, setNotifTarget] = useState("enrolled");
  const [notifSending, setNotifSending] = useState(false);
  const [notifSent, setNotifSent] = useState(false);

  if (!user) return null;
  if (!isTrainer && !isAdmin) {
    navigate("/profile", { replace: true });
    return null;
  }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cData, res] = await Promise.all([
        coursesApi.list({ size: 100 }),
        resourcesApi.mine(),
      ]);
      setCourses(cData?.items || []);
      setSharedResources(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveRes = (r, isEdit) => {
    if (isEdit) {
      setSharedResources((rs) => rs.map((x) => (x.id === r.id ? r : x)));
    } else {
      setSharedResources((rs) => [r, ...rs]);
    }
    setEditingRes(null);
  };

  const deleteRes = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await resourcesApi.delete(id);
      setSharedResources((rs) => rs.filter((r) => r.id !== id));
    } catch (e) {
      alert(e.response?.data?.detail || "Delete failed");
    }
  };

  const sendNotif = async () => {
    if (!notifTitle.trim() || !notifMsg.trim())
      return alert("Title and message are required.");
    setNotifSending(true);
    try {
      await notifApi.broadcast({
        title: notifTitle,
        body: notifMsg,
        ntype: "info",
        target: notifTarget,
      });
      setNotifSent(true);
      setNotifTitle("");
      setNotifMsg("");
      setTimeout(() => setNotifSent(false), 5000);
    } catch (e) {
      alert(e.response?.data?.detail || "Failed to send");
    } finally {
      setNotifSending(false);
    }
  };

  // Group resources by course
  const resourcesByCourse = sharedResources.reduce((acc, r) => {
    const key = r.course_title || `Course #${r.course_id}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <div className="tutor-layout page-enter">
      <aside className="tutor-side">
        <div className="tutor-side-logo">
          <span className="tutor-side-logo-icon">🎓</span>
          <div>
            <strong>Tutor Portal</strong>
            <span>CodeFount</span>
          </div>
        </div>
        <nav className="tutor-side-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tutor-nav-btn ${tab === t.id ? "tutor-nav-btn--on" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <div className="tutor-side-foot">
          <div className="tutor-side-user">
            <div className="tutor-side-av">
              {(user?.full_name || "T")[0].toUpperCase()}
            </div>
            <div>
              <div className="tutor-side-uname">
                {user?.full_name || "Tutor"}
              </div>
              <div className="tutor-side-urole">Instructor</div>
            </div>
          </div>
          <button className="tutor-logout-btn" onClick={logout}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="tutor-main">
        <div className="tutor-content">
          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div>
              <h2 className="adm-page-title">
                Welcome, {user?.full_name?.split(" ")[0] || "Tutor"}!
              </h2>
              <p className="adm-page-sub">
                Here is a summary of your activity on the CodeFount platform.
              </p>
              <div
                className="adm-stats-grid"
                style={{ marginBottom: "1.5rem" }}
              >
                <div className="adm-stat">
                  <div
                    className="adm-stat__icon"
                    style={{ background: "#0f766e18", color: "#0f766e" }}
                  >
                    <Video size={20} />
                  </div>
                  <div className="adm-stat__body">
                    <div className="adm-stat__val">
                      {sharedResources.length}
                    </div>
                    <div className="adm-stat__label">Resources Shared</div>
                  </div>
                </div>
                <div className="adm-stat">
                  <div
                    className="adm-stat__icon"
                    style={{ background: "#0369a118", color: "#0369a1" }}
                  >
                    <BookOpen size={20} />
                  </div>
                  <div className="adm-stat__body">
                    <div className="adm-stat__val">{courses.length}</div>
                    <div className="adm-stat__label">Available Courses</div>
                  </div>
                </div>
                <div className="adm-stat">
                  <div
                    className="adm-stat__icon"
                    style={{ background: "#7c3aed18", color: "#7c3aed" }}
                  >
                    <TrendingUp size={20} />
                  </div>
                  <div className="adm-stat__body">
                    <div className="adm-stat__val">
                      {Object.keys(resourcesByCourse).length}
                    </div>
                    <div className="adm-stat__label">
                      Courses with Resources
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setTab("resources")}
                >
                  <Video size={14} /> Share a Resource
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => setTab("notify")}
                >
                  <Bell size={14} /> Notify Students
                </button>
              </div>

              {sharedResources.length > 0 && (
                <div style={{ marginTop: "2rem" }}>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      marginBottom: ".75rem",
                      color: "var(--navy)",
                    }}
                  >
                    Recent Resources
                  </h3>
                  <div className="tutor-resource-list">
                    {sharedResources.slice(0, 5).map((r) => (
                      <div key={r.id} className="tutor-resource-item">
                        <div className="tutor-resource-type-icon">
                          {(r.rtype || r.type) === "video" ? (
                            <Video size={16} color="var(--teal)" />
                          ) : (
                            <FileText size={16} color="#7c3aed" />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <strong style={{ fontSize: ".88rem" }}>
                            {r.title}
                          </strong>
                          <p
                            style={{
                              fontSize: ".75rem",
                              color: "var(--ink-3)",
                              margin: "2px 0",
                            }}
                          >
                            {r.course_title && <span>{r.course_title} · </span>}
                            {r.week && <span>{r.week} · </span>}
                            {r.created_at &&
                              new Date(r.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── RESOURCES ── */}
          {tab === "resources" && (
            <div>
              <div className="adm-page-head">
                <div>
                  <h2 className="adm-page-title">Share Resources</h2>
                  <p className="adm-page-sub">
                    Upload video links and documents for enrolled students.
                  </p>
                </div>
                <button className="btn btn-outline btn-sm" onClick={load}>
                  <RefreshCw size={13} />
                </button>
              </div>

              {editingRes ? (
                <ResourceForm
                  courses={courses}
                  onSave={handleSaveRes}
                  editing={editingRes}
                  onCancel={() => setEditingRes(null)}
                />
              ) : (
                <ResourceForm courses={courses} onSave={handleSaveRes} />
              )}

              <h3 className="adm-section-h" style={{ marginTop: "2rem" }}>
                All Shared Resources ({sharedResources.length})
              </h3>

              {loading ? (
                <Spin />
              ) : sharedResources.length === 0 ? (
                <div
                  style={{
                    padding: "2rem",
                    color: "var(--ink-3)",
                    textAlign: "center",
                  }}
                >
                  <Video
                    size={36}
                    style={{ marginBottom: ".5rem", opacity: 0.4 }}
                  />
                  <p>No resources shared yet. Use the form above.</p>
                </div>
              ) : (
                <>
                  {Object.entries(resourcesByCourse).map(
                    ([courseName, res]) => (
                      <div key={courseName} style={{ marginBottom: "1.25rem" }}>
                        <div
                          style={{
                            fontSize: ".78rem",
                            fontWeight: 700,
                            color: "var(--ink-3)",
                            textTransform: "uppercase",
                            letterSpacing: ".05em",
                            marginBottom: ".5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: ".4rem",
                          }}
                        >
                          <BookOpen size={12} /> {courseName} ({res.length})
                        </div>
                        <div className="tutor-resource-list">
                          {res.map((r) => (
                            <div key={r.id} className="tutor-resource-item">
                              <div className="tutor-resource-type-icon">
                                {(r.rtype || r.type) === "video" ? (
                                  <Video size={16} color="var(--teal)" />
                                ) : (
                                  <FileText size={16} color="#7c3aed" />
                                )}
                              </div>
                              <div style={{ flex: 1 }}>
                                <strong style={{ fontSize: ".88rem" }}>
                                  {r.title}
                                </strong>
                                <p
                                  style={{
                                    fontSize: ".75rem",
                                    color: "var(--ink-3)",
                                    margin: "2px 0 4px",
                                  }}
                                >
                                  {r.week && <span>{r.week} · </span>}
                                  {r.created_at &&
                                    new Date(r.created_at).toLocaleDateString()}
                                </p>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: ".5rem",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {r.video_url && (
                                    <a
                                      href={r.video_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="prof-resource-link prof-resource-link--video"
                                    >
                                      <Video size={11} /> Video{" "}
                                      <ExternalLink size={10} />
                                    </a>
                                  )}
                                  {r.resource_url && (
                                    <a
                                      href={r.resource_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="prof-resource-link prof-resource-link--doc"
                                    >
                                      <FileText size={11} /> Resource{" "}
                                      <ExternalLink size={10} />
                                    </a>
                                  )}
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "6px",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  className={`adm-chip adm-chip--${(r.rtype || r.type) === "video" ? "enrolled" : "completed"}`}
                                >
                                  {r.rtype || r.type}
                                </span>
                                <button
                                  className="adm-action-btn adm-action-btn--edit"
                                  onClick={() => setEditingRes(r)}
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  className="adm-action-btn adm-action-btn--del"
                                  onClick={() => deleteRes(r.id)}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </>
              )}
            </div>
          )}

          {/* ── NOTIFY ── */}
          {tab === "notify" && (
            <div>
              <h2 className="adm-page-title">Notify Students</h2>
              <p className="adm-page-sub">
                Send a class update, reminder, or important announcement.
              </p>
              <div className="adm-notify-compose">
                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <select
                    className="form-input"
                    value={notifTarget}
                    onChange={(e) => setNotifTarget(e.target.value)}
                  >
                    <option value="enrolled">All Enrolled Students</option>
                    <option value="all">All Users</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Class Reschedule — Tonight 8 PM"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-input"
                    rows={5}
                    placeholder="e.g. Tonight's class is postponed to 8 PM. The Zoom link has been updated in the WhatsApp group."
                    value={notifMsg}
                    onChange={(e) => setNotifMsg(e.target.value)}
                  />
                </div>
                {notifSent ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".5rem",
                      color: "var(--teal)",
                      fontWeight: 700,
                      padding: ".75rem",
                      background: "var(--teal)10",
                      borderRadius: 8,
                    }}
                  >
                    <Check size={16} /> Notification sent successfully!
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={sendNotif}
                    disabled={notifSending}
                  >
                    <Send size={14} />{" "}
                    {notifSending ? "Sending…" : "Send Notification"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

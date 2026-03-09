import { useState } from "react";
import {
  Search,
  Video,
  MessageCircle,
  BookOpen,
  Monitor,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { schedules, courses } from "../../data/mockData";
import "./Schedules.css";

const MODES = ["All", "e-Learning", "Classroom", "Online"];

const MODE_META = {
  "e-Learning": {
    icon: <Monitor size={14} />,
    color: "#0f766e",
    desc: "Self-paced recorded access",
  },
  Classroom: {
    icon: <Users size={14} />,
    color: "#0369a1",
    desc: "In-person at Accra centre",
  },
  Online: {
    icon: <Video size={14} />,
    color: "#7c3aed",
    desc: "Live Zoom sessions",
  },
};

// Map schedule course names to course ids for registration links
const courseMap = {
  "Cyber Security": 3,
  "DevOps With Multi Cloud": 2,
  "DevOps with Multi Cloud": 2,
  "Java Full Stack": 1,
  "Java Full Stack – Placement Program": 1,
  Angular: 4,
  "AWS Bootcamp": 5,
  "Generative AI": 6,
  "MERN Stack": 7,
  "Data Analytics": 8,
  ".NET Core Fullstack": 9,
  "Python Fullstack Developer": 10,
  "JAVA Frameworks": 1,
  "Spring Boot with Microservices": 11,
};

const SCHEDULE_WITH_MODE = schedules.map((s, i) => ({
  ...s,
  mode: ["e-Learning", "Classroom", "Online"][i % 3],
}));

export default function Schedules() {
  const [mode, setMode] = useState("All");
  const [search, setSearch] = useState("");

  const list = SCHEDULE_WITH_MODE.filter((s) => {
    const matchMode = mode === "All" || s.mode === mode;
    const matchSearch = s.course.toLowerCase().includes(search.toLowerCase());
    return matchMode && matchSearch;
  });

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="sch-hero">
        <div className="container">
          <span className="badge badge-dark">Training Schedule</span>
          <h1 className="sch-hero__h1">
            Upcoming <span>Batch Schedule</span>
          </h1>
          <p className="sch-hero__sub">
            Browse live classes, e-learning tracks and classroom batches. Click{" "}
            <strong>Register</strong> to claim your seat.
          </p>

          {/* Mode legend */}
          <div className="sch-legend">
            {Object.entries(MODE_META).map(([k, v]) => (
              <div key={k} className="sch-legend-item">
                <span
                  className="sch-legend-dot"
                  style={{ background: v.color }}
                />
                <span className="sch-legend-icon" style={{ color: v.color }}>
                  {v.icon}
                </span>
                <strong>{k}</strong>
                <span className="sch-legend-desc">{v.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Toolbar */}
          <div className="sch-toolbar">
            <div className="sch-modes">
              {MODES.map((m) => (
                <button
                  key={m}
                  className={`sch-mode-btn ${mode === m ? "sch-mode-btn--on" : ""}`}
                  onClick={() => setMode(m)}
                >
                  {m !== "All" && (
                    <span
                      style={{
                        color: MODE_META[m]?.color,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {MODE_META[m]?.icon}
                    </span>
                  )}
                  {m}
                </button>
              ))}
            </div>
            <div className="sch-search-wrap">
              <Search size={15} />
              <input
                className="sch-search"
                placeholder="Search course…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="sch-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course Name</th>
                  <th>Mode</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Join / Watch</th>
                  <th>Community</th>
                  <th>Register</th>
                </tr>
              </thead>
              <tbody>
                {list.length ? (
                  list.map((s, i) => {
                    const courseId = courseMap[s.course];
                    const meta = MODE_META[s.mode];
                    return (
                      <tr key={s.id}>
                        <td style={{ color: "var(--ink-3)", fontWeight: 700 }}>
                          {String(i + 1).padStart(2, "0")}
                        </td>
                        <td>
                          <strong>{s.course}</strong>
                        </td>
                        <td>
                          <span
                            className="sch-mode-chip"
                            style={{ "--mc": meta?.color }}
                          >
                            {meta?.icon} {s.mode}
                          </span>
                        </td>
                        <td>{s.date}</td>
                        <td>{s.time}</td>
                        <td>
                          {s.mode === "Online" || s.mode === "e-Learning" ? (
                            <a
                              href="#"
                              className="sch-zoom-btn"
                              style={{ "--zc": meta?.color }}
                            >
                              <Video size={12} />
                              {s.mode === "e-Learning" ? "Access" : "Zoom"}
                            </a>
                          ) : (
                            <span className="sch-in-person">📍 In-Person</span>
                          )}
                        </td>
                        <td>
                          <a href="#" className="sch-wa-btn">
                            <MessageCircle size={12} /> WhatsApp
                          </a>
                        </td>
                        <td>
                          {courseId ? (
                            <Link
                              to={`/courses/${courseId}`}
                              className="sch-reg-btn"
                            >
                              <BookOpen size={12} /> Register
                            </Link>
                          ) : (
                            <Link
                              to="/courses"
                              className="sch-reg-btn sch-reg-btn--ghost"
                            >
                              <BookOpen size={12} /> Register
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "2.5rem",
                        color: "var(--ink-3)",
                      }}
                    >
                      No courses match your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Note */}
          <div className="sch-note">
            <strong>📅 Note:</strong> New batches start every week. Click{" "}
            <em>Register</em> to see full course details and enroll. For
            e-Learning tracks, access starts immediately after payment
            confirmation.
            <a href="/contact" className="sch-note-link">
              Contact us
            </a>{" "}
            for group bookings.
          </div>

          {/* Mode cards */}
          <div className="sch-mode-cards">
            {Object.entries(MODE_META).map(([k, v]) => (
              <div
                key={k}
                className="sch-mode-card"
                style={{ "--mc": v.color }}
                onClick={() => setMode(k)}
              >
                <div className="sch-mode-card__icon">{v.icon}</div>
                <div>
                  <strong>{k}</strong>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Phone, BookOpen, X } from "lucide-react";
import { services, courses, courseOutcomes, GHS } from "../../data/mockData";
import "./Services.css";

/* ── Expanded course outcome drawer ── */
function CourseOutcomeDrawer({ course, onClose }) {
  const key =
    Object.keys(courseOutcomes).find((k) =>
      course.title.startsWith(k.split(" ")[0]),
    ) || course.title;
  const data = courseOutcomes[key] || {
    outcome: `Graduate from ${course.title} job-ready and portfolio-equipped. You'll be able to apply for specialist roles immediately, with real projects, a certificate and placement support from CodeFount's dedicated team.`,
    topics: course.highlights,
  };

  return (
    <div className="svc-drawer-bg" onClick={onClose}>
      <div className="svc-drawer" onClick={(e) => e.stopPropagation()}>
        <button className="svc-drawer__close" onClick={onClose}>
          <X size={16} />
        </button>

        {/* Banner */}
        <div
          className="svc-drawer__banner"
          style={{
            background: `linear-gradient(140deg,${course.color}dd,${course.color}88)`,
          }}
        >
          <span className="svc-drawer__banner-tag">
            {course.tag || course.category}
          </span>
          <h2 className="svc-drawer__title">{course.title}</h2>
          <p className="svc-drawer__trainer">
            with {course.trainer} · {course.duration}
          </p>
        </div>

        <div className="svc-drawer__body">
          {/* Outcome */}
          <div className="svc-drawer__section">
            <h3 className="svc-drawer__sec-title">🎯 Course Outcome</h3>
            <p className="svc-drawer__outcome">{data.outcome}</p>
          </div>

          {/* Topics */}
          <div className="svc-drawer__section">
            <h3 className="svc-drawer__sec-title">📚 What You'll Study</h3>
            <div className="svc-drawer__topics">
              {data.topics.map((t, i) => (
                <div key={i} className="svc-drawer__topic">
                  <span className="svc-drawer__topic-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="svc-drawer__price-row">
            <div>
              <div className="svc-drawer__price">{GHS(course.offer)}</div>
              <div className="svc-drawer__orig">
                {GHS(course.fee)}{" "}
                <span>
                  — Save{" "}
                  {Math.round(((course.fee - course.offer) / course.fee) * 100)}
                  %
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: ".75rem" }}>
              <Link to={`/courses/${course.id}`} className="btn btn-primary">
                Enroll Now <ArrowRight size={13} />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Enquire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const [activeCourse, setActiveCourse] = useState(null);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="svc-hero">
        <div className="svc-hero__glow" />
        <div className="container svc-hero__inner">
          <span className="badge badge-dark">What We Offer</span>
          <h1 className="svc-hero__h1">
            Everything You Need to <span>Succeed in Tech</span>
          </h1>
          <p className="svc-hero__sub">
            From live online classes to corporate upskilling — CodeFount
            provides flexible, career-focused programs designed and delivered by
            industry professionals.
          </p>
        </div>
      </section>

      {/* Services Cards */}
      <section className="section">
        <div className="container">
          <div className="svc-list">
            {services.map((s) => {
              /* find related courses for this service */
              const related = s.title.includes("Real-Time Project")
                ? courses.slice(0, 6)
                : s.title.includes("Online")
                  ? courses.filter((c) => c.mode.includes("Online")).slice(0, 4)
                  : s.title.includes("Classroom")
                    ? courses
                        .filter((c) => c.mode.includes("Classroom"))
                        .slice(0, 4)
                    : courses.slice(0, 4);

              return (
                <div key={s.id} className="svc-card">
                  <div
                    className="svc-card__left"
                    style={{ background: s.color + "12" }}
                  >
                    <div
                      className="svc-card__icon-box"
                      style={{ background: s.color + "22", color: s.color }}
                    >
                      {s.icon}
                    </div>
                    <div
                      className="svc-card__line"
                      style={{ background: s.color + "40" }}
                    />
                  </div>
                  <div className="svc-card__body">
                    <div className="svc-card__head">
                      <div>
                        <h2 className="svc-card__title">{s.title}</h2>
                        <span
                          className="svc-card__tag"
                          style={{ color: s.color, background: s.color + "14" }}
                        >
                          {s.tag}
                        </span>
                      </div>
                      <span className="svc-card__num">0{s.id}</span>
                    </div>
                    <p className="svc-card__desc">{s.desc}</p>
                    <div className="svc-card__feats">
                      {s.features.map((f) => (
                        <div key={f} className="svc-card__feat">
                          <CheckCircle size={14} color={s.color} />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Course outcomes links */}
                    <div className="svc-card__courses">
                      <p className="svc-card__courses-label">
                        <BookOpen size={13} /> Explore course outcomes:
                      </p>
                      <div className="svc-card__courses-row">
                        {related.map((c) => (
                          <button
                            key={c.id}
                            className="svc-card__course-chip"
                            style={{ borderColor: c.color, color: c.color }}
                            onClick={() => setActiveCourse(c)}
                          >
                            {c.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="svc-card__actions">
                      <Link to="/contact" className="btn btn-primary btn-sm">
                        Enquire Now <ArrowRight size={12} />
                      </Link>
                      <Link to="/courses" className="btn btn-outline btn-sm">
                        All Courses
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="svc-cta">
        <div className="container svc-cta__row">
          <div>
            <h2 className="h2" style={{ color: "#fff", marginBottom: ".4rem" }}>
              Not sure which service is right for you?
            </h2>
            <p style={{ color: "rgba(255,255,255,.65)", fontSize: ".95rem" }}>
              Our counselors are available 7 days a week to help you choose the
              best path.
            </p>
          </div>
          <div className="svc-cta__btns">
            <Link to="/contact" className="btn btn-amber btn-lg">
              Talk to a Counselor <ArrowRight size={15} />
            </Link>
            <a href="tel:+233998539677" className="svc-cta__tel">
              <Phone size={16} /> +233 998 539 677
            </a>
          </div>
        </div>
      </section>

      {/* Course outcome drawer */}
      {activeCourse && (
        <CourseOutcomeDrawer
          course={activeCourse}
          onClose={() => setActiveCourse(null)}
        />
      )}
    </div>
  );
}

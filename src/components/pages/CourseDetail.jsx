import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Users,
  BarChart2,
  Monitor,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Star,
  BookOpen,
  Loader,
} from "lucide-react";
import { courses as coursesApi, enrollments } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import "./CourseDetail.css";

const GHS = (v) => `GHS ${Number(v).toLocaleString()}`;

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // Load course
  useEffect(() => {
    setLoading(true);
    coursesApi
      .get(id)
      .then((data) => {
        setCourse(data);
        // Load related: same category
        return coursesApi.list({ category: data.category, size: 4 });
      })
      .then((rel) =>
        setRelated(
          (rel.items || []).filter((c) => c.id !== Number(id)).slice(0, 3),
        ),
      )
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Check if already enrolled
  useEffect(() => {
    if (!user) return;
    enrollments
      .my()
      .then((list) => setEnrolled(list.some((e) => e.course_id === Number(id))))
      .catch(() => {});
  }, [user, id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (enrolled) {
      navigate("/profile");
      return;
    }
    setEnrolling(true);
    setErrMsg("");
    try {
      await enrollments.enroll(Number(id));
      setEnrolled(true);
    } catch (err) {
      setErrMsg(
        err.response?.data?.detail || "Enrollment failed. Please try again.",
      );
    } finally {
      setEnrolling(false);
    }
  };

  if (loading)
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "6rem 0" }}
      >
        <Loader size={32} className="cf-spin" color="var(--teal)" />
      </div>
    );

  if (!course)
    return (
      <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
        <h2>Course not found</h2>
        <button
          className="btn btn-primary"
          style={{ marginTop: "1rem" }}
          onClick={() => navigate("/courses")}
        >
          Back to Courses
        </button>
      </div>
    );

  const pct = Math.round(((course.fee - course.offer) / course.fee) * 100);

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <div className="cd-bread">
        <div className="container cd-bread__row">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/courses">Courses</Link>
          <span>/</span>
          <span>{course.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="cd-hero" style={{ "--cc": course.color }}>
        <div className="cd-hero__glow" />
        <div className="container cd-hero__inner">
          <div className="cd-hero__left">
            <button className="cd-back" onClick={() => navigate("/courses")}>
              <ArrowLeft size={15} /> Back
            </button>
            {course.tag && <span className="cd-tag">{course.tag}</span>}
            <h1 className="cd-hero__h1">{course.title}</h1>
            <p className="cd-hero__desc">{course.desc}</p>
            <div className="cd-meta">
              <span>
                <Clock size={13} />
                {course.duration}
              </span>
              <span>
                <BarChart2 size={13} />
                {course.level}
              </span>
              <span>
                <Users size={13} />
                {course.trainer}
              </span>
              <span>
                <Star size={13} fill="#f59e0b" color="#f59e0b" /> 4.9 (2,400+)
              </span>
            </div>
            <div className="cd-modes">
              {(course.mode || []).map((m) => (
                <span key={m} className="cd-mode">
                  <Monitor size={11} />
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Enroll card */}
          <div className="cd-enroll">
            <div
              className="cd-enroll__top"
              style={{ background: course.color }}
            >
              <span style={{ fontSize: "2rem" }}>📚</span>
              <h3>{course.title}</h3>
            </div>
            <div className="cd-enroll__body">
              <div className="cd-pricing">
                <span className="cd-price">{GHS(course.offer)}</span>
                <span className="cd-orig">{GHS(course.fee)}</span>
                <span className="cd-save">Save {pct}%</span>
              </div>
              <div className="cd-enroll__rows">
                <div className="cd-erow">
                  <Clock size={13} />
                  <span>
                    Duration: <strong>{course.duration}</strong>
                  </span>
                </div>
                <div className="cd-erow">
                  <BarChart2 size={13} />
                  <span>
                    Level: <strong>{course.level}</strong>
                  </span>
                </div>
                <div className="cd-erow">
                  <Calendar size={13} />
                  <span>
                    Next batch: <strong>Contact us</strong>
                  </span>
                </div>
                <div className="cd-erow">
                  <BookOpen size={13} />
                  <span>
                    Mode: <strong>{(course.mode || []).join(", ")}</strong>
                  </span>
                </div>
              </div>
              {errMsg && (
                <p
                  style={{
                    color: "var(--red)",
                    fontSize: ".78rem",
                    marginBottom: ".5rem",
                  }}
                >
                  {errMsg}
                </p>
              )}
              <button
                className={`btn ${enrolled ? "btn-outline" : "btn-primary"}`}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginBottom: ".65rem",
                }}
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? (
                  "Enrolling…"
                ) : enrolled ? (
                  "✓ Enrolled — Go to Profile"
                ) : (
                  <>
                    Enroll Now <ArrowRight size={13} />
                  </>
                )}
              </button>
              <Link
                to="/contact"
                className="btn btn-outline"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Talk to Counselor
              </Link>
              <p
                style={{
                  textAlign: "center",
                  fontSize: ".72rem",
                  color: "var(--ink-3)",
                  marginTop: ".65rem",
                }}
              >
                ✅ 30-day money-back guarantee · Free demo class
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="container cd-body">
        {course.highlights?.length > 0 && (
          <div className="cd-sec">
            <h2 className="cd-sec__title">What You'll Learn</h2>
            <div className="cd-highlights">
              {course.highlights.map((h) => (
                <div key={h} className="cd-hl">
                  <CheckCircle size={15} color="var(--teal)" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {course.curriculum?.length > 0 && (
          <div className="cd-sec">
            <h2 className="cd-sec__title">Course Curriculum</h2>
            <div className="cd-curric">
              {course.curriculum.map((item, i) => (
                <div key={item.id || i} className="cd-week">
                  <span className="cd-week__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="cd-week__label">{item.week}</span>
                  <span className="cd-week__topic">{item.topic}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="cd-sec">
          <h2 className="cd-sec__title">Your Instructor</h2>
          <div className="cd-trainer">
            <div className="cd-trainer__av">
              {course.trainer?.split(" ").pop()?.[0] || "T"}
            </div>
            <div>
              <h3 className="cd-trainer__name">{course.trainer}</h3>
              <p className="cd-trainer__role">
                {course.category} Expert · 10+ Years Experience
              </p>
              <p className="cd-trainer__bio">
                {course.trainer} is a working professional with 1,000+ students
                trained. All CodeFount trainers bring real project experience
                from top companies.
              </p>
              <div className="cd-trainer__stats">
                <span>
                  <Star size={12} fill="#f59e0b" color="#f59e0b" /> 4.9 Rating
                </span>
                <span>
                  <Users size={12} /> 1,200+ Students
                </span>
                <span>
                  <BookOpen size={12} /> 3 Courses
                </span>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="cd-sec">
            <h2 className="cd-sec__title">Related Courses</h2>
            <div className="cd-related">
              {related.map((c) => (
                <Link
                  key={c.id}
                  to={`/courses/${c.id}`}
                  className="cd-rel-card"
                >
                  <div
                    className="cd-rel-banner"
                    style={{ background: c.color }}
                  >
                    {c.title}
                  </div>
                  <div className="cd-rel-body">
                    <p className="cd-rel-trainer">{c.trainer}</p>
                    <p className="cd-rel-price">{GHS(c.offer)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

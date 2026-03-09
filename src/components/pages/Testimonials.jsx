import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { testimonials as testimonialsApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import "./Testimonials.css";

function Stars({ n }) {
  return (
    <div className="test-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < n ? "#f59e0b" : "none"}
          color={i < n ? "#f59e0b" : "#cbd5e1"}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    course: "",
    text: "",
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    testimonialsApi
      .list({ size: 50 })
      .then((data) => setItems(data.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = items.length;
  const prev = () => setCurrent((current - 1 + total) % total);
  const next = () => setCurrent((current + 1) % total);
  const featured = items[current] || null;

  const handleSubmit = async () => {
    if (!formData.name || !formData.text || !formData.course) return;
    setSubmitting(true);
    try {
      await testimonialsApi.submit(formData);
      setSubmitted(true);
      setShowForm(false);
    } catch (e) {
      alert(e.response?.data?.detail || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="test-hero">
        <div className="container">
          <span className="badge badge-dark">Alumni Voices</span>
          <h1 className="test-hero__h1">
            Stories from Our <span>Alumni</span>
          </h1>
          <p className="test-hero__sub">
            Over 10,000 graduates across Ghana, Nigeria, UK and beyond. Here's
            what some of them say.
          </p>
        </div>
      </section>

      {/* Featured carousel */}
      <section className="section-sm">
        <div className="container">
          <div className="test-featured">
            <button className="test-arrow test-arrow--l" onClick={prev}>
              <ChevronLeft size={20} />
            </button>

            <div className="test-featured-card">
              <Quote size={40} className="test-quote-icon" />
              <p className="test-featured-text">"{featured.text}"</p>
              <div className="test-featured-footer">
                <div className="test-avatar">{featured.avatar}</div>
                <div>
                  <div className="test-name">
                    {featured.name} {featured.country}
                  </div>
                  <div className="test-role">{featured.role}</div>
                  <div className="test-course-tag">{featured.course}</div>
                </div>
                <Stars n={featured.rating} />
              </div>
              {/* Dots */}
              <div className="test-dots">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`test-dot ${i === current ? "test-dot--on" : ""}`}
                    onClick={() => setCurrent(i)}
                  />
                ))}
              </div>
            </div>

            <button className="test-arrow test-arrow--r" onClick={next}>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Stats bar */}
          <div className="test-stats">
            {[
              { val: "10k+", label: "Graduates" },
              { val: "95%", label: "Placement Rate" },
              { val: "200+", label: "Hiring Partners" },
              { val: "4.9★", label: "Avg. Rating" },
            ].map((s) => (
              <div key={s.label} className="test-stat">
                <strong>{s.val}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid — all testimonials */}
      <section
        className="section"
        style={{ background: "var(--bg-soft)", paddingTop: "2rem" }}
      >
        <div className="container">
          <h2
            className="h2"
            style={{ textAlign: "center", marginBottom: "2rem" }}
          >
            What Our Students <span>Say</span>
          </h2>
          <div className="test-grid">
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className={`test-card ${i === current ? "test-card--active" : ""}`}
                onClick={() => setCurrent(i)}
              >
                <Stars n={t.rating} />
                <p className="test-card-text">
                  "{t.text.slice(0, 140)}
                  {t.text.length > 140 ? "…" : ""}"
                </p>
                <div className="test-card-footer">
                  <div className="test-avatar test-avatar--sm">{t.avatar}</div>
                  <div>
                    <div className="test-name test-name--sm">
                      {t.name} {t.country}
                    </div>
                    <div className="test-role">{t.role}</div>
                  </div>
                </div>
                <span className="test-course-chip">{t.course}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="test-cta">
            <h3>Ready to write your own success story?</h3>
            <p>Join our next cohort and get job-ready in months, not years.</p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a href="/courses" className="btn btn-primary btn-lg">
                Explore Courses
              </a>
              <a href="/contact" className="btn btn-outline btn-lg">
                Talk to an Advisor
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

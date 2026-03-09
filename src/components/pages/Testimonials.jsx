import { useState, useEffect } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  Plus,
  X,
  Send,
} from "lucide-react";
import { testimonials as testimonialsApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import "./Testimonials.css";

function Stars({ n = 5 }) {
  return (
    <div className="test-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          fill={i <= n ? "#f59e0b" : "none"}
          color={i <= n ? "#f59e0b" : "#cbd5e1"}
        />
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <div
      className="test-featured-card"
      style={{
        minHeight: 320,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--ink-3)",
      }}
    >
      Loading testimonials…
    </div>
  );
}

export default function Testimonials() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: user?.full_name || "",
    role: "",
    course: "",
    text: "",
    rating: 5,
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    testimonialsApi
      .list({ size: 50 })
      .then((data) => setItems(data.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = items.length;
  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);
  const featured = total > 0 ? items[current] : null;

  const handleSubmit = async () => {
    if (!form.text || !form.course) {
      alert("Course and testimonial text are required.");
      return;
    }
    setSubmitting(true);
    try {
      await testimonialsApi.submit({
        ...form,
        name: form.name || user?.full_name || "Anonymous",
      });
      setSubmitted(true);
      setShowForm(false);
    } catch (e) {
      alert(e.response?.data?.detail || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-enter">
      <section className="test-hero">
        <div className="container">
          <span className="badge badge-dark">Alumni Voices</span>
          <h1 className="test-hero__h1">
            Stories from Our <span>Alumni</span>
          </h1>
          <p className="test-hero__sub">
            Over 10,000 graduates across Ghana, Nigeria, UK and beyond.
          </p>
        </div>
      </section>

      {/* Carousel */}
      <section className="section-sm">
        <div className="container">
          <div className="test-featured">
            <button
              className="test-arrow test-arrow--l"
              onClick={prev}
              disabled={!featured}
            >
              <ChevronLeft size={20} />
            </button>

            {loading ? (
              <Skeleton />
            ) : !featured ? (
              <div
                className="test-featured-card"
                style={{
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  color: "var(--ink-3)",
                }}
              >
                <Quote size={36} />
                <p>No testimonials yet. Be the first!</p>
              </div>
            ) : (
              <div className="test-featured-card">
                <Quote size={40} className="test-quote-icon" />
                <p className="test-featured-text">"{featured.text}"</p>
                <div className="test-featured-footer">
                  <div className="test-avatar">
                    {featured.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <div className="test-name">{featured.name}</div>
                    <div className="test-role">{featured.role}</div>
                    <div className="test-course-tag">{featured.course}</div>
                  </div>
                  <Stars n={featured.rating || 5} />
                </div>
                <div className="test-dots">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      className={`test-dot ${i === current ? "test-dot--on" : ""}`}
                      onClick={() => setCurrent(i)}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              className="test-arrow test-arrow--r"
              onClick={next}
              disabled={!featured}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className="test-stats">
            {[
              { val: "10k+", label: "Graduates" },
              { val: "95%", label: "Placement Rate" },
              { val: "200+", label: "Hiring Partners" },
              { val: "4.9★", label: "Average Rating" },
            ].map((s) => (
              <div key={s.label} className="test-stat">
                <div className="test-stat__val">{s.val}</div>
                <div className="test-stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      {items.length > 0 && (
        <section className="section-sm" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="test-grid-title">All Reviews</h2>
            <div className="test-grid">
              {items.map((t) => (
                <div key={t.id} className="test-card">
                  <Stars n={t.rating || 5} />
                  <p className="test-card__text">"{t.text}"</p>
                  <div className="test-card__footer">
                    <div className="test-card__av">
                      {t.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="test-card__name">{t.name}</div>
                      <div className="test-card__course">{t.course}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Submit CTA */}
      <section className="test-cta">
        <div className="container">
          {submitted ? (
            <div className="test-cta__submitted">
              <h3>🎉 Thank You!</h3>
              <p>
                Your testimonial has been submitted and is pending review. It
                will appear here once approved.
              </p>
            </div>
          ) : (
            <>
              <h2>Share Your Story</h2>
              <p>
                Graduated from CodeFount? We'd love to hear about your journey.
              </p>
              {!showForm ? (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={15} /> Write a Testimonial
                </button>
              ) : (
                <div className="test-form-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <h3>Your Testimonial</h3>
                    <button
                      className="adm-action-btn adm-action-btn--del"
                      onClick={() => setShowForm(false)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="test-form-grid">
                    <div className="form-group">
                      <label className="form-label">Your Name *</label>
                      <input
                        className="form-input"
                        value={form.name}
                        onChange={set("name")}
                        placeholder="John Mensah"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role / Title</label>
                      <input
                        className="form-input"
                        value={form.role}
                        onChange={set("role")}
                        placeholder="Software Engineer at Vodafone"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Course Taken *</label>
                      <input
                        className="form-input"
                        value={form.course}
                        onChange={set("course")}
                        placeholder="Java Full Stack"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Rating</label>
                      <div
                        style={{
                          display: "flex",
                          gap: ".5rem",
                          paddingTop: ".35rem",
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() =>
                              setForm((f) => ({ ...f, rating: n }))
                            }
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "2px",
                            }}
                          >
                            <Star
                              size={22}
                              fill={n <= form.rating ? "#f59e0b" : "none"}
                              color={n <= form.rating ? "#f59e0b" : "#cbd5e1"}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Story *</label>
                    <textarea
                      className="form-input"
                      rows={5}
                      placeholder="How has CodeFount changed your career?…"
                      value={form.text}
                      onChange={set("text")}
                    />
                  </div>
                  <div style={{ display: "flex", gap: ".75rem" }}>
                    <button
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      <Send size={14} /> {submitting ? "Submitting…" : "Submit"}
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

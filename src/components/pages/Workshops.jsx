import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { workshops as workshopsApi, wsRegs } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Workshops.css";

export default function Workshops() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [workshopList, setWorkshopList] = useState([]);
  const [myRegs, setMyRegs] = useState([]); // workshop ids I've registered for
  const [loading, setLoading] = useState(true);
  const [regLoading, setRegLoading] = useState(null);

  // Load workshops from backend
  useEffect(() => {
    workshopsApi
      .list({ size: 50 })
      .then((data) => setWorkshopList(data.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Load my registrations if logged in
  useEffect(() => {
    if (!user) return;
    wsRegs
      .my()
      .then((regs) => setMyRegs(regs.map((r) => r.workshop_id)))
      .catch(() => {});
  }, [user]);

  const handleRegister = async (workshopId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    const isReg = myRegs.includes(workshopId);
    setRegLoading(workshopId);
    try {
      if (isReg) {
        await wsRegs.cancel(workshopId);
        setMyRegs((r) => r.filter((id) => id !== workshopId));
      } else {
        await wsRegs.register(workshopId);
        setMyRegs((r) => [...r, workshopId]);
      }
    } catch (e) {
      alert(e.response?.data?.detail || "Action failed");
    } finally {
      setRegLoading(null);
    }
  };

  const freeOnly = filter === "Free" ? true : filter === "Paid" ? false : null;
  const list = workshopList.filter((w) => {
    if (filter === "Free") return w.price === null || w.price === 0;
    if (filter === "Paid") return w.price !== null && w.price > 0;
    return true;
  });

  const ws = selected ? workshopList.find((w) => w.id === selected) : null;

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="ws-hero">
        <div className="ws-hero__glow" />
        <div className="container ws-hero__inner">
          <span className="badge badge-dark">🎓 Live Sessions</span>
          <h1 className="ws-hero__h1">
            Workshops & <span>Short Courses</span>
          </h1>
          <p className="ws-hero__sub">
            Free and paid half-day workshops led by working tech professionals.
            Learn a new skill, get hands-on, and decide if you want to go
            deeper.
          </p>
          <div className="ws-filters">
            {["All", "Free", "Paid"].map((f) => (
              <button
                key={f}
                className={`ws-filter-btn ${filter === f ? "ws-filter-btn--on" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cards grid */}
      <section className="section">
        <div className="container">
          <div className="ws-grid">
            {list.map((w) => {
              const pct = Math.round((w.filled / w.seats) * 100);
              const left = w.seats - w.filled;
              return (
                <div key={w.id} className="ws-card">
                  <div
                    className="ws-card__top"
                    style={{
                      background: `linear-gradient(140deg,${w.color}dd,${w.color}88)`,
                    }}
                  >
                    <div className="ws-card__top-row">
                      <span
                        className={`ws-card__tag ${w.price === "FREE" ? "ws-card__tag--free" : "ws-card__tag--paid"}`}
                      >
                        {w.tag}
                      </span>
                      <span className="ws-card__icon">{w.icon}</span>
                    </div>
                    <h2 className="ws-card__title">{w.title}</h2>
                    <p className="ws-card__facilitator">with {w.facilitator}</p>
                  </div>
                  <div className="ws-card__body">
                    <div className="ws-card__meta">
                      <span>
                        <Calendar size={12} />
                        {w.date}
                      </span>
                      <span>
                        <Clock size={12} />
                        {w.time}
                      </span>
                      <span>
                        <MapPin size={12} />
                        {w.mode}
                      </span>
                    </div>
                    <p className="ws-card__desc">{w.desc}</p>
                    {/* Seat progress */}
                    <div className="ws-seats">
                      <div className="ws-seats__row">
                        <span>
                          <Users size={12} />
                          {left} seats left of {w.seats}
                        </span>
                        <span>{pct}% full</span>
                      </div>
                      <div className="ws-seats__bar">
                        <div
                          className="ws-seats__fill"
                          style={{ width: `${pct}%`, background: w.color }}
                        />
                      </div>
                    </div>
                    <div className="ws-card__foot">
                      <span
                        className="ws-card__price"
                        style={{
                          color: w.price === "FREE" ? "var(--green)" : w.color,
                        }}
                      >
                        {w.price}
                      </span>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setSelected(w.id)}
                      >
                        View Details <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {list.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "var(--ink-3)",
              }}
            >
              No workshops found.
            </div>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section className="ws-cta">
        <div className="container ws-cta__row">
          <div>
            <h2 className="h2" style={{ color: "#fff", marginBottom: ".3rem" }}>
              Want a private workshop for your team?
            </h2>
            <p style={{ color: "rgba(255,255,255,.65)", fontSize: ".92rem" }}>
              We run bespoke half-day and full-day workshops for corporate
              teams. Minimum 10 participants.
            </p>
          </div>
          <Link to="/contact" className="btn btn-amber btn-lg">
            Get a Quote <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Detail modal */}
      {ws && (
        <div className="ws-modal-bg" onClick={() => setSelected(null)}>
          <div className="ws-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="ws-modal__close"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
            <div
              className="ws-modal__banner"
              style={{
                background: `linear-gradient(140deg,${ws.color}dd,${ws.color}88)`,
              }}
            >
              <span className="ws-modal__icon">{ws.icon}</span>
              <h2 className="ws-modal__title">{ws.title}</h2>
              <p className="ws-modal__facilitator">
                Facilitated by {ws.facilitator}
              </p>
            </div>
            <div className="ws-modal__body">
              <div className="ws-modal__meta">
                <span>
                  <Calendar size={13} />
                  {ws.date}
                </span>
                <span>
                  <Clock size={13} />
                  {ws.time}
                </span>
                <span>
                  <MapPin size={13} />
                  {ws.mode}
                </span>
                <span>
                  <Users size={13} />
                  {ws.seats - ws.filled} seats remaining
                </span>
              </div>
              <p className="ws-modal__desc">{ws.desc}</p>
              <h3 className="ws-modal__agenda-title">Workshop Agenda</h3>
              <div className="ws-modal__agenda">
                {ws.agenda.map((a, i) => (
                  <div key={i} className="ws-modal__agenda-item">
                    <span className="ws-modal__agenda-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{a}</span>
                  </div>
                ))}
              </div>
              <div className="ws-modal__foot">
                <div>
                  <div className="ws-modal__price-label">Workshop Fee</div>
                  <div
                    className="ws-modal__price"
                    style={{
                      color: ws.price === "FREE" ? "var(--green)" : ws.color,
                    }}
                  >
                    {ws.price}
                  </div>
                </div>
                <div style={{ display: "flex", gap: ".75rem" }}>
                  <Link to="/register" className="btn btn-primary">
                    Register Now <ArrowRight size={13} />
                  </Link>
                  <a
                    href="https://wa.me/233998539677"
                    className="btn btn-outline"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

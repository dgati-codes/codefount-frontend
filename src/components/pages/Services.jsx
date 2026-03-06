import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Phone } from 'lucide-react';
import { services } from '../../data/mockData';
import './Services.css';

export default function Services() {
  return (
    <div className="page-enter">

      {/* Hero */}
      <section className="svc-hero">
        <div className="svc-hero__glow"/>
        <div className="container svc-hero__inner">
          <span className="badge badge-dark">What We Offer</span>
          <h1 className="svc-hero__h1">Everything You Need to <span>Succeed in Tech</span></h1>
          <p className="svc-hero__sub">
            From live online classes to corporate upskilling — CodeFount provides flexible,
            career-focused programs designed and delivered by industry professionals.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="section">
        <div className="container">
          <div className="svc-list">
            {services.map((s, i) => (
              <div key={s.id} className="svc-card">
                <div className="svc-card__left" style={{ background: s.color+'12' }}>
                  <div className="svc-card__icon-box" style={{ background: s.color+'22', color: s.color }}>{s.icon}</div>
                  <div className="svc-card__line" style={{ background: s.color+'40' }}/>
                </div>
                <div className="svc-card__body">
                  <div className="svc-card__head">
                    <div>
                      <h2 className="svc-card__title">{s.title}</h2>
                      <span className="svc-card__tag" style={{ color: s.color, background: s.color+'14' }}>{s.tag}</span>
                    </div>
                    <span className="svc-card__num">0{s.id}</span>
                  </div>
                  <p className="svc-card__desc">{s.desc}</p>
                  <div className="svc-card__feats">
                    {s.features.map(f => (
                      <div key={f} className="svc-card__feat">
                        <CheckCircle size={14} color={s.color}/><span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="svc-card__actions">
                    <Link to="/contact" className="btn btn-primary btn-sm">Enquire Now <ArrowRight size={12}/></Link>
                    <Link to="/courses" className="btn btn-outline btn-sm">View Courses</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="svc-cta">
        <div className="container svc-cta__row">
          <div>
            <h2 className="h2" style={{ color:'#fff', marginBottom:'.4rem' }}>Not sure which service is right for you?</h2>
            <p style={{ color:'rgba(255,255,255,.65)', fontSize:'.95rem' }}>Our counselors are available 7 days a week to help you choose the best path.</p>
          </div>
          <div className="svc-cta__btns">
            <Link to="/contact" className="btn btn-amber btn-lg">Talk to a Counselor <ArrowRight size={15}/></Link>
            <a href="tel:+233998539677" className="svc-cta__tel"><Phone size={16}/> +233 542 878 621</a>
          </div>
        </div>
      </section>
    </div>
  );
}
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stats } from '../../data/mockData';
import './About.css';

export default function About() {
  return (
    <div className="page-enter">

      {/* Hero */}
      <section className="ab-hero">
        <div className="ab-hero__glow"/>
        <div className="container ab-hero__inner">
          <span className="badge badge-dark">About Us</span>
          <h1 className="ab-hero__h1">Ghana's Leading <span>IT Training Institute</span></h1>
          <p className="ab-hero__sub">Transforming learners into industry professionals through hands-on, expert-led training since 2020.</p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section">
        <div className="container ab-who">
          <div>
            <span className="badge">Who We Are</span>
            <h2 className="h2">Passionate About <span>Tech Education</span></h2>
            <p className="sub" style={{ marginBottom:'1rem' }}>
              CodeFount is Ghana's premier IT training institute, founded with a single mission: to bridge the gap between
              education and industry. Our expert trainers are working professionals who bring real-world experience into every class.
            </p>
            <p className="sub">
              We combine rigorous curriculum with hands-on project work, mentorship and dedicated placement support to ensure
              our graduates are not just trained — they're hired.
            </p>
          </div>
          <div className="ab-who__stats">
            {stats.map(s => (
              <div key={s.label} className="ab-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section" style={{ background:'var(--bg-soft)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom:'2rem' }}>
            <span className="badge">Our Foundation</span>
            <h2 className="h2">Mission, <span>Vision & Goals</span></h2>
          </div>
          <div className="mvg-grid">
            {[
              { label:'Mission', color:'var(--teal)', icon:'🎯', text:'To provide world-class, hands-on IT training that bridges the gap between academia and industry, empowering learners to build sustainable tech careers.' },
              { label:'Vision',  color:'var(--navy)', icon:'🔭', text:'To become Africa\'s most impactful tech training institution, producing 100,000 job-ready professionals by 2030.' },
              { label:'Goal',    color:'#7c3aed',     icon:'🏆', text:'To ensure 95% of our graduates are employed in tech roles within 6 months of completing their training.' },
            ].map(m => (
              <div key={m.label} className="mvg-card" style={{ '--mc': m.color }}>
                <div className="mvg-icon">{m.icon}</div>
                <h3 className="mvg-label">{m.label}</h3>
                <p className="mvg-text">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom:'2rem' }}>
            <span className="badge">Why CodeFount</span>
            <h2 className="h2">Why Students <span>Choose Us</span></h2>
          </div>
          <div className="ab-why">
            {[
              { q:'Industry-Expert Trainers',       a:'All our instructors are active tech professionals with 10+ years experience, not just academics.' },
              { q:'Real Projects & Portfolio',       a:'Graduate with a portfolio of 3–5 production-quality projects that impress employers.' },
              { q:'Dedicated Placement Support',    a:'Our team actively connects graduates to 200+ hiring partners across Ghana and internationally.' },
              { q:'Flexible Learning Modes',        a:'Learn online, in-classroom or hybrid — full sessions recorded for missed classes.' },
              { q:'Industry-Recognised Certificate',a:'CodeFount certificates are acknowledged by leading tech companies in Ghana, Nigeria, UK and USA.' },
              { q:'Small Batch Sizes',              a:'Classroom batches capped at 15 students, ensuring personalised attention for every learner.' },
            ].map(w => (
              <div key={w.q} className="ab-why-item">
                <div className="ab-why-check"><CheckCircle size={16}/></div>
                <div>
                  <h4 className="ab-why-q">{w.q}</h4>
                  <p className="ab-why-a">{w.a}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop:'2.5rem' }}>
            <Link to="/courses" className="btn btn-primary btn-lg">Start Learning Today</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
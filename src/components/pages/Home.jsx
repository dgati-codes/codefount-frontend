import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle, ArrowRight, Star, Clock } from 'lucide-react';
import CourseCard from '../ui/CourseCard';
import { courses, stats, domains, categories, GHS } from '../../data/mockData';
import './Home.css';

/* ── Hero Slider ── */
const SLIDES = [
  { id:1, badge:"🎓 Ghana's #1 IT Training Institute", title:'Launch Your', hl:'Tech Career', tail:'with Expert-Led Training',
    sub:'Industry-aligned courses by working professionals. Real projects, real placements. Join 10,000+ alumni.',
    cta:'/courses', ctaLabel:'Explore Courses', cta2:'/schedules', cta2Label:'View Schedule',
    course:'Java Full Stack', courseTag:'MOST POPULAR', courseSub:'Job-Ready in 4 Months', icon:'☕', accent:'#14b8a6' },
  { id:2, badge:'🔥 Now Enrolling — Limited Seats', title:'Master', hl:'DevOps & Cloud', tail:'and Lead Modern Engineering Teams',
    sub:'Docker, Kubernetes, AWS, Azure, GCP — all in one 3-month program with certified experts.',
    cta:'/courses/2', ctaLabel:'Enroll Now', cta2:'/about', cta2Label:'Learn More',
    course:'DevOps Multi-Cloud', courseTag:'HOT COURSE', courseSub:'CI/CD · Kubernetes · Terraform', icon:'🐳', accent:'#a78bfa' },
  { id:3, badge:'🤖 New Batch — March 2025', title:'Build with', hl:'Generative AI', tail:'and LLM-Powered Applications',
    sub:'LangChain, OpenAI, RAG systems and AI deployment. The most in-demand skill of 2025.',
    cta:'/courses/6', ctaLabel:'Join AI Batch', cta2:'/courses', cta2Label:'Browse All',
    course:'Generative AI', courseTag:'TRENDING', courseSub:'LLMs · Prompt Eng · RAG · LangChain', icon:'🤖', accent:'#f59e0b' },
  { id:4, badge:'🛡️ Cybersecurity Track', title:'Defend Systems,', hl:'Protect Data', tail:'and Become a Security Expert',
    sub:'Ethical hacking, pen testing, SOC operations. Hands-on labs with real attack/defence scenarios.',
    cta:'/courses/3', ctaLabel:'Start Learning', cta2:'/schedules', cta2Label:'View Schedule',
    course:'Cyber Security', courseTag:'HIGH DEMAND', courseSub:'Ethical Hacking · SOC · CompTIA', icon:'🛡️', accent:'#10b981' },
];

function HeroSlider() {
  const [cur, setCur] = useState(0);
  const [fade, setFade] = useState(true);

  const goTo = useCallback((idx) => {
    setFade(false);
    setTimeout(() => { setCur(idx); setFade(true); }, 250);
  }, []);

  const next = useCallback(() => goTo((cur + 1) % SLIDES.length), [cur, goTo]);
  const prev = () => goTo((cur - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => { const t = setInterval(next, 5500); return () => clearInterval(t); }, [next]);

  const s = SLIDES[cur];

  return (
    <section className="hero" style={{ '--acc': s.accent }}>
      <div className="hero__glow" />
      <div className={`container hero__inner ${fade ? 'hero--in' : 'hero--out'}`}>

        {/* Text */}
        <div className="hero__text">
          <span className="hero__badge">{s.badge}</span>
          <h1 className="hero__h1">
            {s.title} <span style={{ color: s.accent }}>{s.hl}</span><br />{s.tail}
          </h1>
          <p className="hero__sub">{s.sub}</p>
          <div className="hero__btns">
            <Link to={s.cta} className="btn btn-amber btn-lg">{s.ctaLabel} <ChevronRight size={17}/></Link>
            <Link to={s.cta2} className="btn btn-ghost">{s.cta2Label}</Link>
          </div>
          <div className="hero__stats">
            {stats.map(st => (
              <div key={st.label} className="hero__stat">
                <strong style={{ color: s.accent }}>{st.value}</strong>
                <span>{st.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="hero__card-wrap hide-mob">
          <div className="hero__card" style={{ '--acc': s.accent }}>
            <div className="hero__card-top">
              <span className="hero__card-tag" style={{ background: s.accent }}>{s.courseTag}</span>
              <span className="hero__card-icon">{s.icon}</span>
            </div>
            <h2 className="hero__card-name">{s.course}</h2>
            <p className="hero__card-sub">{s.courseSub}</p>
            <div className="hero__card-feats">
              {['Hands-On Projects','Live Sessions','Certificate','Job Support'].map(f => (
                <span key={f} className="hero__card-feat"><CheckCircle size={11}/>{f}</span>
              ))}
            </div>
            <Link to={s.cta} className="hero__card-enroll" style={{ background: s.accent }}>
              Enroll Now — {GHS(1100)}+ <ArrowRight size={13}/>
            </Link>
            <div className="hero__card-rating">
              {[1,2,3,4,5].map(i => <Star key={i} size={11} fill="#f59e0b" color="#f59e0b"/>)}
              <span>4.9 · 2,400+ enrolled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button className="hero__arr hero__arr-l" onClick={prev}><ChevronLeft size={18}/></button>
      <button className="hero__arr hero__arr-r" onClick={next}><ChevronRight size={18}/></button>
      <div className="hero__dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`hero__dot ${i===cur?'hero__dot--on':''}`}
            style={i===cur?{background:s.accent,width:'28px'}:{}} onClick={() => goTo(i)}/>
        ))}
      </div>
    </section>
  );
}

/* ── Stats Bar ── */
function StatsBar() {
  return (
    <div className="sbar" style={{ background:'var(--teal)' }}>
      <div className="container sbar__row">
        {[['4 Programs','Flagship Programs'],['40,000+','Students Trained'],['4.9 ⭐','Google Rating'],['10+','Master Trainers']].map(([v,l]) => (
          <div key={l} className="sbar__item">
            <strong>{v}</strong><span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Courses Section ── */
function CoursesSection() {
  const [active, setActive] = useState('All');
  const list = active === 'All' ? courses.slice(0,8) : courses.filter(c => c.category===active).slice(0,8);
  return (
    <section className="section" style={{ background:'var(--bg-soft)' }}>
      <div className="container">
        <div className="home-sec-head text-center">
          <span className="badge">Our Curriculum</span>
          <h2 className="h2">Our <span>Courses</span></h2>
          <p className="sub">Practical, job-ready training in the most in-demand tech skills.</p>
        </div>
        <div className="cat-filter">
          {categories.map(c => (
            <button key={c} className={`cat-btn ${active===c?'cat-btn--on':''}`} onClick={() => setActive(c)}>{c}</button>
          ))}
        </div>
        <div className="courses-grid">
          {list.length ? list.map(c => <CourseCard key={c.id} course={c}/>) :
            <p style={{gridColumn:'1/-1',textAlign:'center',color:'var(--ink-3)',padding:'2rem'}}>No courses in this category yet.</p>}
        </div>
        <div className="text-center" style={{marginTop:'2.5rem'}}>
          <Link to="/courses" className="btn btn-primary btn-lg">All Courses <ArrowRight size={15}/></Link>
        </div>
      </div>
    </section>
  );
}

/* ── Services Preview ── */
function ServicesPreview() {
  const items = [
    {
      icon: "🖥️",
      title: "Online Live Training",
      color: "#0f766e",
      desc: "Interactive live sessions from anywhere with full recorded access and real-time Q&A.",
    },
    {
      icon: "🎯",
      title: "Placement Assistance",
      color: "#5b21b6",
      desc: "Dedicated team, 10+ partners, resume review and mock interviews to land your next role.",
    },
    {
      icon: "🔧",
      title: "Real-Time Projects",
      color: "#0d9488",
      desc: "Graduate with 3–5 production-quality apps built alongside industry mentors.",
    },
    {
      icon: "🏢",
      title: "Corporate Training",
      color: "#b45309",
      desc: "Bespoke programs for teams delivered on-site, remote or hybrid with ROI tracking.",
    },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="home-sec-head text-center">
          <span className="badge">What We Offer</span>
          <h2 className="h2">Our <span>Training Services</span></h2>
          <p className="sub">Flexible, career-focused programs designed by IT professionals for IT professionals.</p>
        </div>
        <div className="srv-preview">
          {items.map(s => (
            <div key={s.title} className="srv-prev-card">
              <div className="srv-prev-icon" style={{ background: s.color+'18', color: s.color }}>{s.icon}</div>
              <h3 className="srv-prev-title">{s.title}</h3>
              <p className="srv-prev-desc">{s.desc}</p>
              <Link to="/services" className="srv-prev-link">Learn more <ChevronRight size={13}/></Link>
            </div>
          ))}
        </div>
        <div className="text-center" style={{marginTop:'2rem'}}>
          <Link to="/services" className="btn btn-primary">All Services <ArrowRight size={15}/></Link>
        </div>
      </div>
    </section>
  );
}

/* ── Values ── */
function Values() {
  return (
    <section className="section vals" style={{ background: 'var(--navy)' }}>
      <div className="container vals__row">
        <div className="vals__left">
          <span className="badge badge-dark">Our Ethos</span>
          <h2 className="h2" style={{ color:'#fff' }}>Empowering Futures:<br/>CodeFount's Legacy of<br/>Hands-On Excellence</h2>
          <div className="vals__stats">
            {stats.map(s => (
              <div key={s.label} className="vals__stat">
                <strong>{s.value}</strong><span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="vals__right">
          {[
            { title:'We Believe in Empowering Tech Talent', desc:'Our community shares skills and knowledge that transforms learners into industry-ready professionals.' },
            { title:'We Believe in Practical Learning',     desc:'Real-world training that equips students with tools to solve actual industry challenges from day one.' },
            { title:'We Believe in Building Careers',       desc:'Learning opportunities that prepare students for long-term, fulfilling and high-paying careers in tech.' },
          ].map(v => (
            <div key={v.title} className="val-item">
              <div className="val-check"><CheckCircle size={17}/></div>
              <div>
                <h4 className="val-title">{v.title}</h4>
                <p className="val-desc">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Domains ── */
function Domains() {
  return (
    <section className="section" style={{ background:'var(--bg-soft)' }}>
      <div className="container">
        <div className="home-sec-head text-center">
          <span className="badge">Browse by Domain</span>
          <h2 className="h2">Explore and Find <span>Your Domain</span></h2>
        </div>
        <div className="domains-grid">
          {domains.map(d => (
            <Link to="/courses" key={d.label} className="domain-card">
              <div className="domain-icon" style={{ background: d.color+'18', color: d.color }}>{d.icon}</div>
              <span className="domain-label">{d.label}</span>
            </Link>
          ))}
        </div>
        <div className="text-center" style={{marginTop:'1.75rem'}}>
          <Link to="/courses" className="btn btn-outline">View All Domains</Link>
        </div>
      </div>
    </section>
  );
}

/* ── Corporate ── */
function Corporate() {
  return (
    <section className="section">
      <div className="container corp__row">
        <div className="corp__text">
          <span className="badge">Enterprise Solutions</span>
          <h2 className="h2">Corporate Software <span>Training</span></h2>
          <p className="sub" style={{marginBottom:'1.5rem'}}>
            Elevate your team with CodeFount's bespoke corporate programs. Hands-on, practical training
            that sharpens technical knowledge and drives competitive advantage.
          </p>
          {['Customised curriculum for your tech stack',
            'Flexible — on-site, remote or hybrid delivery',
            'Certified instructors with 10+ years of experience',
            'Real-time progress dashboards for HR teams'].map(i => (
            <div key={i} className="corp__item"><CheckCircle size={15} color="var(--teal)"/>{i}</div>
          ))}
          <Link to="/contact" className="btn btn-primary" style={{marginTop:'1.5rem'}}>Talk to Us <ArrowRight size={14}/></Link>
        </div>
        <div className="corp__card hide-mob">
          <div className="corp__stat"><strong>10+</strong><span>Company Partners</span></div>
          <div className="corp__stat"><strong>32+</strong><span>Teams Trained</span></div>
          <div className="corp__stat"><strong>98%</strong><span>Satisfaction Rate</span></div>
          <div className="corp__logos">
            {['G','A','M','O','S'].map(l => <span key={l} className="corp__logo">{l}</span>)}
          </div>
          <p style={{fontSize:'.72rem',color:'rgba(255,255,255,.4)',textAlign:'center'}}>Graduates hired at leading companies</p>
        </div>
      </div>
    </section>
  );
}

/* ── Enroll CTA ── */
function EnrollCTA() {
  return (
    <section className="section" style={{ background:'var(--bg-soft)' }}>
      <div className="container enroll__row">
        <div className="enroll__left hide-mob">
          <div className="enroll__faces">
            {['K','A','M','E'].map(l => <div key={l} className="enroll__face">{l}</div>)}
            <div className="enroll__face" style={{background:'var(--amber)',fontSize:'.7rem'}}>+9K</div>
          </div>
          <p className="enroll__social">Join <strong>10,000+</strong> learners already building their careers</p>
          {['✅ Free career counseling','✅ No hidden fees','✅ Flexible payment plans'].map(t => (
            <p key={t} style={{fontSize:'.83rem',color:'var(--ink-2)',marginTop:'.3rem'}}>{t}</p>
          ))}
        </div>
        <div className="enroll__form">
          <h2 className="h2" style={{marginBottom:'.3rem'}}>Enroll for a <span>Bright Career</span></h2>
          <p className="sub" style={{marginBottom:'1.5rem',fontSize:'.875rem'}}>Fill in your details and our team will contact you within 24 hours.</p>
          <div className="enroll__fields">
            <input className="form-input" placeholder="Full Name"/>
            <input className="form-input" placeholder="Email Address"/>
            <input className="form-input" placeholder="Mobile Number"/>
            <select className="form-select">
              <option>Select Course</option>
              {courses.map(c => <option key={c.id}>{c.title}</option>)}
            </select>
            <select className="form-select">
              <option>Mode of Training</option>
              <option>Online</option><option>Classroom</option><option>Hybrid</option>
            </select>
            <textarea className="form-textarea" rows={3} style={{gridColumn:'1/-1'}} placeholder="Any message or questions…"/>
          </div>
          <button className="btn btn-primary btn-lg" style={{width:'100%',marginTop:'1rem'}}>Submit Enquiry</button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="page-enter">
      <HeroSlider/>
      <StatsBar/>
      <CoursesSection/>
      <ServicesPreview/>
      <Values/>
      <Domains/>
      <Corporate/>
      <EnrollCTA/>
    </div>
  );
}
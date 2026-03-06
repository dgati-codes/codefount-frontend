import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Users, BarChart2, Monitor, ArrowLeft, ArrowRight, Calendar, Star, BookOpen } from 'lucide-react';
import { courses, GHS } from '../../data/mockData';
import './CourseDetail.css';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find(c => c.id === Number(id));

  if (!course) return (
    <div style={{ textAlign:'center', padding:'6rem 2rem' }}>
      <h2>Course not found</h2>
      <button className="btn btn-primary" style={{ marginTop:'1rem' }} onClick={() => navigate('/courses')}>Back to Courses</button>
    </div>
  );

  const related = courses.filter(c => c.category === course.category && c.id !== course.id).slice(0, 3);
  const pct = Math.round(((course.fee - course.offer) / course.fee) * 100);

  return (
    <div className="page-enter">

      {/* Breadcrumb */}
      <div className="cd-bread">
        <div className="container cd-bread__row">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/courses">Courses</Link><span>/</span>
          <span>{course.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="cd-hero" style={{ '--cc': course.color }}>
        <div className="cd-hero__glow"/>
        <div className="container cd-hero__inner">

          {/* Left */}
          <div className="cd-hero__left">
            <button className="cd-back" onClick={() => navigate('/courses')}><ArrowLeft size={15}/> Back</button>
            {course.tag && <span className="cd-tag">{course.tag}</span>}
            <h1 className="cd-hero__h1">{course.title}</h1>
            <p className="cd-hero__desc">{course.desc}</p>
            <div className="cd-meta">
              <span><Clock size={13}/>{course.duration}</span>
              <span><BarChart2 size={13}/>{course.level}</span>
              <span><Users size={13}/>{course.trainer}</span>
              <span><Star size={13} fill="#f59e0b" color="#f59e0b"/> 4.9 (2,400+)</span>
            </div>
            <div className="cd-modes">
              {course.mode.map(m => <span key={m} className="cd-mode"><Monitor size={11}/>{m}</span>)}
            </div>
          </div>

          {/* Enroll card */}
          <div className="cd-enroll">
            <div className="cd-enroll__top" style={{ background: course.color }}>
              <span style={{ fontSize:'2rem' }}>📚</span>
              <h3>{course.title}</h3>
            </div>
            <div className="cd-enroll__body">
              <div className="cd-pricing">
                <span className="cd-price">{GHS(course.offer)}</span>
                <span className="cd-orig">{GHS(course.fee)}</span>
                <span className="cd-save">Save {pct}%</span>
              </div>
              <div className="cd-enroll__rows">
                <div className="cd-erow"><Clock size={13}/><span>Duration: <strong>{course.duration}</strong></span></div>
                <div className="cd-erow"><BarChart2 size={13}/><span>Level: <strong>{course.level}</strong></span></div>
                <div className="cd-erow"><Calendar size={13}/><span>Next batch: <strong>Mar 11</strong></span></div>
                <div className="cd-erow"><BookOpen size={13}/><span>Mode: <strong>{course.mode.join(', ')}</strong></span></div>
              </div>
              <Link to="/register" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', marginBottom:'.65rem' }}>
                Enroll Now <ArrowRight size={13}/>
              </Link>
              <Link to="/contact" className="btn btn-outline" style={{ width:'100%', justifyContent:'center' }}>Talk to Counselor</Link>
              <p style={{ textAlign:'center', fontSize:'.72rem', color:'var(--ink-3)', marginTop:'.65rem' }}>
                ✅ 10-day money-back guarantee · Free demo class
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="container cd-body">

        {/* Highlights */}
        <div className="cd-sec">
          <h2 className="cd-sec__title">What You'll Learn</h2>
          <div className="cd-highlights">
            {course.highlights.map(h => (
              <div key={h} className="cd-hl"><CheckCircle size={15} color="var(--teal)"/><span>{h}</span></div>
            ))}
          </div>
        </div>

        {/* Curriculum */}
        <div className="cd-sec">
          <h2 className="cd-sec__title">Course Curriculum</h2>
          <div className="cd-curric">
            {course.curriculum.map((item, i) => (
              <div key={i} className="cd-week">
                <span className="cd-week__num">{String(i+1).padStart(2,'0')}</span>
                <span className="cd-week__label">{item.w}</span>
                <span className="cd-week__topic">{item.t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trainer */}
        <div className="cd-sec">
          <h2 className="cd-sec__title">Your Instructor</h2>
          <div className="cd-trainer">
            <div className="cd-trainer__av">{course.trainer.split(' ').pop()?.[0] || 'T'}</div>
            <div>
              <h3 className="cd-trainer__name">{course.trainer}</h3>
              <p className="cd-trainer__role">{course.category} Expert · 10+ Years Experience</p>
              <p className="cd-trainer__bio">{course.trainer} is a working professional with 1,000+ students trained. All CodeFount trainers bring real project experience from top companies.</p>
              <div className="cd-trainer__stats">
                <span><Star size={12} fill="#f59e0b" color="#f59e0b"/> 4.9 Rating</span>
                <span><Users size={12}/> 1,200+ Students</span>
                <span><BookOpen size={12}/> 3 Courses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="cd-sec">
            <h2 className="cd-sec__title">Related Courses</h2>
            <div className="cd-related">
              {related.map(c => (
                <Link key={c.id} to={`/courses/${c.id}`} className="cd-rel-card">
                  <div className="cd-rel-banner" style={{ background: c.color }}>{c.title}</div>
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
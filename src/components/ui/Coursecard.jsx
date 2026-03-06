import { Link } from 'react-router-dom';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';
import { GHS } from '../../data/mockData';
import './CourseCard.css';

export default function CourseCard({ course }) {
  const { id, title, category, trainer, fee, offer, color, tag, duration, level } = course;
  const pct = Math.round(((fee - offer) / fee) * 100);

  return (
    <div className="cc">
      <div className="cc__banner" style={{ background: `linear-gradient(140deg,${color}dd,${color}99)` }}>
        {tag && <span className="cc__tag">{tag}</span>}
        <div className="cc__title">{title}</div>
        {duration && <div className="cc__dur"><Clock size={11}/>{duration}</div>}
      </div>
      <div className="cc__body">
        <p className="cc__cat">{category}</p>
        <div className="cc__meta">
          <span><Users size={12}/>{trainer}</span>
          <span><Star size={12}/> 4.9</span>
        </div>
        {level && <p className="cc__level">{level}</p>}
        <div className="cc__price">
          <span className="cc__offer">{GHS(offer)}</span>
          <span className="cc__original">{GHS(fee)}</span>
          <span className="cc__save">-{pct}%</span>
        </div>
        <Link to={`/courses/${id}`} className="cc__cta">
          Enroll Now <ArrowRight size={13}/>
        </Link>
      </div>
    </div>
  );
}
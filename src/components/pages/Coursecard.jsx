import { Link } from 'react-router-dom';
import { Users, Star, ArrowRight, Clock } from 'lucide-react';
import { GHS } from '../../data/mockData';
import './CourseCard.css';

export default function CourseCard({ course }) {
  const { id, title, category, trainer, fee, offer, color, tag, duration, level } = course;

  return (
    <div className="course-card">
      <div className="course-card__banner" style={{ background: `linear-gradient(145deg, ${color}, ${color}cc)` }}>
        {tag && <span className="course-card__tag">{tag}</span>}
        <div className="course-card__banner-title">{title}</div>
        {duration && <div className="course-card__duration"><Clock size={11}/> {duration}</div>}
      </div>
      <div className="course-card__body">
        <p className="course-card__category">{category}</p>
        <h3 className="course-card__title">{title}</h3>
        <div className="course-card__meta">
          <span className="course-card__trainer"><Users size={12}/> {trainer}</span>
          <span className="course-card__rating"><Star size={12}/> 4.9</span>
        </div>
        {level && <p className="course-card__level">{level}</p>}
        <div className="course-card__pricing">
          <span className="course-card__fee">{GHS(fee)}</span>
          <span className="course-card__offer">{GHS(offer)}</span>
        </div>
        <Link to={`/courses/${id}`} className="course-card__cta">
          Enroll Now <ArrowRight size={13}/>
        </Link>
      </div>
    </div>
  );
}
import { useState } from 'react';
import CourseCard from '../ui/CourseCard';
import { courses, categories } from '../../data/mockData';
import './Courses.css';

export default function Courses() {
  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');

  const list = courses.filter(c => {
    const inCat = active === 'All' || c.category === active;
    const inSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return inCat && inSearch;
  });

  return (
    <div className="page-enter">
      <section className="crs-hero">
        <div className="container">
          <span className="badge badge-dark">All Courses</span>
          <h1 className="crs-hero__h1">Explore <span>Our Courses</span></h1>
          <p className="crs-hero__sub">Industry-aligned courses taught by working professionals. Find your perfect learning path.</p>
          <input className="crs-search" placeholder="🔍  Search courses…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="crs-filter">
            {categories.map(c => (
              <button key={c} className={`crs-btn ${active===c?'crs-btn--on':''}`} onClick={() => setActive(c)}>{c}</button>
            ))}
          </div>
          {list.length ? (
            <div className="crs-grid">
              {list.map(c => <CourseCard key={c.id} course={c}/>)}
            </div>
          ) : (
            <div className="crs-empty">
              <p>No courses match your search. Try a different keyword or category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
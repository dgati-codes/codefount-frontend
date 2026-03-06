import { useState } from 'react';
import { Search, Video, MessageCircle } from 'lucide-react';
import { schedules } from '../../data/mockData';
import './Schedules.css';

export default function Schedules() {
  const [mode, setMode] = useState('All');
  const [search, setSearch] = useState('');

  const list = schedules.filter(s => s.course.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-enter">
      <section className="sch-hero">
        <div className="container">
          <span className="badge badge-dark">Training Schedule</span>
          <h1 className="sch-hero__h1">Upcoming <span>Batch Schedule</span></h1>
          <p className="sch-hero__sub">Browse live demo sessions and upcoming batch start dates. Click Zoom to join a free demo.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sch-toolbar">
            <div className="sch-modes">
              {['All','e-Learning','Classroom','Online'].map(m => (
                <button key={m} className={`sch-mode-btn ${mode===m?'sch-mode-btn--on':''}`} onClick={() => setMode(m)}>{m}</button>
              ))}
            </div>
            <div className="sch-search-wrap">
              <Search size={15}/>
              <input className="sch-search" placeholder="Search course…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
          </div>

          <div className="sch-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Demo</th>
                  <th>Group</th>
                </tr>
              </thead>
              <tbody>
                {list.length ? list.map((s, i) => (
                  <tr key={s.id}>
                    <td>{String(i+1).padStart(2,'0')}</td>
                    <td><strong>{s.course}</strong></td>
                    <td>{s.date}</td>
                    <td>{s.time}</td>
                    <td><a href="#" className="sch-zoom-btn"><Video size={13}/> Zoom</a></td>
                    <td><a href="#" className="sch-wa-btn"><MessageCircle size={13}/> WhatsApp</a></td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} style={{textAlign:'center',padding:'2rem',color:'var(--ink-3)'}}>No courses found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="sch-note">
            <strong>📅 Note:</strong> All demo sessions are free. Click Zoom link to join. New batches start every week.
            Contact us on WhatsApp to reserve your seat.
          </div>
        </div>
      </section>
    </div>
  );
}
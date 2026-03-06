import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, BookOpen, Calendar, Settings, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { courses, categories } from '../../data/mockData';
import { GHS } from '../../data/mockData';
import './Profile.css';

const TABS = [
  { id:'enroll',   label:'Enroll',    icon:<BookOpen size={16}/> },
  { id:'schedule', label:'Schedule',  icon:<Calendar size={16}/> },
  { id:'settings', label:'Settings',  icon:<Settings size={16}/> },
];

export default function Profile() {
  const { user, logout } = useAuth();
  const [tab, setTab]    = useState('enroll');
  const [cat, setCat]    = useState('All');

  const list = cat === 'All' ? courses : courses.filter(c => c.category === cat);

  return (
    <div className="prof-page page-enter">

      {/* Sidebar */}
      <aside className="prof-side">
        <div className="prof-side__head">
          <div className="prof-side__av">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="prof-side__name">{user?.name}</div>
            <div className="prof-side__email">{user?.email}</div>
          </div>
        </div>
        <nav className="prof-side__nav">
          {TABS.map(t => (
            <button key={t.id} className={`prof-nav-btn ${tab===t.id?'prof-nav-btn--on':''}`} onClick={() => setTab(t.id)}>
              {t.icon}{t.label}
            </button>
          ))}
          <button className="prof-nav-btn prof-nav-btn--logout" onClick={logout}>
            <LogOut size={16}/>Sign Out
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="prof-main">
        {tab === 'enroll' && (
          <div>
            <h2 className="prof-main__title">Course Enrolment</h2>
            <p className="prof-main__sub">Browse and enroll in any of our courses below.</p>
            <div className="prof-filter">
              {categories.map(c => (
                <button key={c} className={`prof-filter-btn ${cat===c?'prof-filter-btn--on':''}`} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
            <div className="prof-courses">
              {list.map(c => (
                <div key={c.id} className="prof-course-card">
                  <div className="prof-course-banner" style={{ background: c.color }}>{c.title}</div>
                  <div className="prof-course-body">
                    <p className="prof-course-trainer">{c.trainer}</p>
                    <p className="prof-course-price">{GHS(c.offer)}</p>
                    <Link to={`/courses/${c.id}`} className="btn btn-primary btn-sm" style={{ width:'100%', justifyContent:'center' }}>
                      View & Enroll <ArrowRight size={12}/>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'schedule' && (
          <div>
            <h2 className="prof-main__title">My Schedule</h2>
            <p className="prof-main__sub">You have no active enrollments yet.</p>
            <div className="prof-empty">
              <span style={{ fontSize:'3rem' }}>📅</span>
              <p>Enroll in a course to see your schedule here.</p>
              <button className="btn btn-primary" onClick={() => setTab('enroll')}>Browse Courses</button>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div>
            <h2 className="prof-main__title">Account Settings</h2>
            <p className="prof-main__sub">Update your profile information.</p>
            <div className="prof-settings">
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" defaultValue={user?.name}/></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" defaultValue={user?.email}/></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="Your phone number"/></div>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
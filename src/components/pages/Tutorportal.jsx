import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Video, FileText, Plus, Send, Users, BookOpen, Bell, LogOut, Check, X } from 'lucide-react';
import { courses, tutorResources } from '../../data/mockData';
import './TutorPortal.css';

const TABS = [
  { id:'resources',    label:'Share Resources', icon:<Video size={15}/>    },
  { id:'students',     label:'My Students',     icon:<Users size={15}/>    },
  { id:'notify',       label:'Notify Students', icon:<Bell size={15}/>     },
];

function ResourceForm({ onSave }) {
  const [form, setForm] = useState({ courseId:'', week:'', title:'', videoUrl:'', resourceUrl:'', type:'video' });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.courseId || !form.title) return;
    onSave({ ...form, id: Date.now(), sharedAt: 'Just now', tutor: 'You' });
    setForm({ courseId:'', week:'', title:'', videoUrl:'', resourceUrl:'', type:'video' });
  };

  return (
    <div className="tutor-form">
      <h3 className="tutor-form__title">Share a New Resource</h3>
      <div className="tutor-form__grid">
        <div className="form-group">
          <label className="form-label">Course</label>
          <select className="form-input" value={form.courseId} onChange={set('courseId')}>
            <option value="">Select course…</option>
            {courses.slice(0,6).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Week / Topic</label>
          <input className="form-input" placeholder="e.g. Wk 3–4" value={form.week} onChange={set('week')}/>
        </div>
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-input" value={form.type} onChange={set('type')}>
            <option value="video">Video</option>
            <option value="document">Document / Link</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Resource Title</label>
        <input className="form-input" placeholder="e.g. Advanced Collections Deep Dive" value={form.title} onChange={set('title')}/>
      </div>
      <div className="form-group">
        <label className="form-label">Backup Video URL (YouTube, Loom…)</label>
        <input className="form-input" type="url" placeholder="https://youtube.com/watch?v=…" value={form.videoUrl} onChange={set('videoUrl')}/>
      </div>
      <div className="form-group">
        <label className="form-label">Reference / Resource URL (Docs, GitHub, Drive…)</label>
        <input className="form-input" type="url" placeholder="https://docs.example.com" value={form.resourceUrl} onChange={set('resourceUrl')}/>
      </div>
      <button className="btn btn-primary" onClick={submit}><Send size={14}/> Share with Students</button>
    </div>
  );
}

export default function TutorPortal() {
  const { user, logout } = useAuth();
  const [tab, setTab]    = useState('resources');
  const [shared, setShared] = useState(tutorResources);
  const [notifMsg, setNotifMsg] = useState('');
  const [notifSent, setNotifSent] = useState(false);

  if (!user) return <Navigate to="/login" replace/>;

  const addResource = res => setShared(s => [res, ...s]);

  const sendNotif = () => {
    if (!notifMsg.trim()) return;
    setNotifSent(true);
    setTimeout(() => { setNotifSent(false); setNotifMsg(''); }, 3000);
  };

  return (
    <div className="tutor-layout page-enter">
      {/* Sidebar */}
      <aside className="tutor-side">
        <div className="tutor-side-logo">
          <span className="tutor-side-logo-icon">🎓</span>
          <div><strong>Tutor Portal</strong><span>CodeFount</span></div>
        </div>
        <nav className="tutor-side-nav">
          {TABS.map(t => (
            <button key={t.id} className={`tutor-nav-btn ${tab===t.id?'tutor-nav-btn--on':''}`} onClick={() => setTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <div className="tutor-side-foot">
          <div className="tutor-side-user">
            <div className="tutor-side-av">{user?.name?.[0]?.toUpperCase() || 'T'}</div>
            <div><div className="tutor-side-uname">{user?.name || 'Tutor'}</div><div className="tutor-side-urole">Instructor</div></div>
          </div>
          <button className="tutor-logout-btn" onClick={logout}><LogOut size={14}/> Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <main className="tutor-main">
        <div className="tutor-content">

          {/* RESOURCES */}
          {tab === 'resources' && (
            <div>
              <h2 className="adm-page-title">Share Resources</h2>
              <p className="adm-page-sub">Share backup videos and reference links with enrolled students.</p>
              <ResourceForm onSave={addResource}/>

              <h3 className="adm-section-h" style={{marginTop:'2rem'}}>Shared Resources ({shared.length})</h3>
              <div className="tutor-resource-list">
                {shared.map(r => (
                  <div key={r.id} className="tutor-resource-item">
                    <div className="tutor-resource-type-icon">
                      {r.type==='video' ? <Video size={16} color="var(--teal)"/> : <FileText size={16} color="#7c3aed"/>}
                    </div>
                    <div style={{flex:1}}>
                      <strong style={{fontSize:'.88rem'}}>{r.title}</strong>
                      <p style={{fontSize:'.75rem',color:'var(--ink-3)',margin:'2px 0 4px'}}>{r.week} · {r.sharedAt}</p>
                      <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap'}}>
                        {r.videoUrl    && <a href={r.videoUrl}    target="_blank" rel="noopener noreferrer" className="prof-resource-link prof-resource-link--video"><Video size={11}/> Video</a>}
                        {r.resourceUrl && <a href={r.resourceUrl} target="_blank" rel="noopener noreferrer" className="prof-resource-link prof-resource-link--doc"><FileText size={11}/> Resource</a>}
                      </div>
                    </div>
                    <span className={`adm-chip ${r.type==='video'?'adm-chip--enrolled':'adm-chip--completed'}`}>{r.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STUDENTS */}
          {tab === 'students' && (
            <div>
              <h2 className="adm-page-title">My Students</h2>
              <p className="adm-page-sub">Students enrolled in courses you teach.</p>
              <div className="adm-table-wrap">
                <table className="data-table">
                  <thead><tr><th>#</th><th>Name</th><th>Course</th><th>Progress</th><th>Status</th></tr></thead>
                  <tbody>
                    {[
                      { id:1, name:'Kwame A.',    course:'Java Full Stack', progress:45, status:'active'    },
                      { id:2, name:'Abena M.',    course:'Java Full Stack', progress:30, status:'active'    },
                      { id:3, name:'Samuel T.',   course:'Java Full Stack', progress:80, status:'active'    },
                      { id:4, name:'Naomi O.',    course:'Java Full Stack', progress:10, status:'new'       },
                      { id:5, name:'Emmanuel D.', course:'Java Full Stack', progress:65, status:'active'    },
                    ].map((s,i) => (
                      <tr key={s.id}>
                        <td style={{color:'var(--ink-3)',fontWeight:700}}>{String(i+1).padStart(2,'0')}</td>
                        <td><strong>{s.name}</strong></td>
                        <td style={{fontSize:'.82rem'}}>{s.course}</td>
                        <td>
                          <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
                            <div style={{width:80,height:6,background:'var(--line)',borderRadius:100,overflow:'hidden'}}>
                              <div style={{width:`${s.progress}%`,height:'100%',background:'var(--teal)',borderRadius:100}}/>
                            </div>
                            <span style={{fontSize:'.72rem',color:'var(--ink-2)'}}>{s.progress}%</span>
                          </div>
                        </td>
                        <td><span className={`adm-chip adm-chip--${s.status==='active'?'enrolled':'verified'}`}>{s.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* NOTIFY */}
          {tab === 'notify' && (
            <div>
              <h2 className="adm-page-title">Notify Students</h2>
              <p className="adm-page-sub">Send a class update, reminder, or announcement to your students.</p>
              <div className="adm-notify-compose">
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-input" rows={5}
                    placeholder="e.g. Class postponed to 8PM tonight. Zoom link in WhatsApp group."
                    value={notifMsg} onChange={e => setNotifMsg(e.target.value)}/>
                </div>
                {notifSent ? (
                  <div style={{display:'flex',alignItems:'center',gap:'.5rem',color:'var(--green)',fontWeight:700}}>
                    <Check size={16}/> Message sent to all students!
                  </div>
                ) : (
                  <button className="btn btn-primary" onClick={sendNotif}><Send size={14}/> Send Notification</button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
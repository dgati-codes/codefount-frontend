import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, Calendar, Bell, BarChart2,
  Wrench, LogOut, ChevronRight, TrendingUp, DollarSign, UserCheck,
  AlertCircle, Plus, Edit2, Trash2, Send, Eye, Check, X, Upload,
  MessageSquare, GraduationCap, Zap
} from 'lucide-react';
import {
  courses, workshops, schedules, services, adminStats,
  revenueByMonth, enrollmentByCourse, mockNotifications, GHS
} from '../../data/mockData';
import './AdminPortal.css';

// ─── Sidebar ────────────────────────────────────────────────────────────────
const TABS = [
  { id:'dashboard',     label:'Dashboard',     icon:<LayoutDashboard size={16}/> },
  { id:'courses',       label:'Courses',       icon:<BookOpen size={16}/>        },
  { id:'users',         label:'Students',      icon:<Users size={16}/>           },
  { id:'workshops',     label:'Workshops',     icon:<Zap size={16}/>             },
  { id:'notifications', label:'Notifications', icon:<Bell size={16}/>            },
  { id:'reports',       label:'Reports',       icon:<BarChart2 size={16}/>       },
  { id:'payments',      label:'Payments',      icon:<DollarSign size={16}/>      },
];

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, sub }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat__icon" style={{ background: color + '18', color }}>
        {icon}
      </div>
      <div className="adm-stat__body">
        <div className="adm-stat__val">{value}</div>
        <div className="adm-stat__label">{label}</div>
        {sub && <div className="adm-stat__sub">{sub}</div>}
      </div>
    </div>
  );
}

// ─── Simple bar chart ────────────────────────────────────────────────────────
function BarChart({ data, valueKey, labelKey, color='#0f766e' }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="adm-chart">
      {data.map(d => (
        <div key={d[labelKey]} className="adm-chart-col">
          <div className="adm-chart-bar-wrap">
            <div
              className="adm-chart-bar"
              style={{ height:`${(d[valueKey]/max)*100}%`, background: color }}
              title={`${d[labelKey]}: ${d[valueKey]}`}
            />
          </div>
          <span className="adm-chart-label">{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Mini progress ───────────────────────────────────────────────────────────
function MiniBar({ pct, color }) {
  return (
    <div className="adm-mini-bar">
      <div className="adm-mini-fill" style={{ width:`${pct}%`, background: color }}/>
    </div>
  );
}

// ─── Mock students data ───────────────────────────────────────────────────────
const STUDENTS = [
  { id:1, name:'Kwame Asante',     email:'kwame@email.com',    course:'Java Full Stack',   status:'enrolled',  payment:'verified',  date:'Mar 1' },
  { id:2, name:'Abena Mensah',     email:'abena@email.com',    course:'DevOps Multi-Cloud',status:'enrolled',  payment:'pending',   date:'Mar 3' },
  { id:3, name:'Chidi Okonkwo',    email:'chidi@email.com',    course:'AWS Bootcamp',      status:'completed', payment:'verified',  date:'Feb 20' },
  { id:4, name:'Fatima Al-Hassan', email:'fatima@email.com',   course:'Cyber Security',    status:'enrolled',  payment:'rejected',  date:'Mar 5' },
  { id:5, name:'Emmanuel Darko',   email:'emm@email.com',      course:'Generative AI',     status:'enrolled',  payment:'verified',  date:'Mar 6' },
  { id:6, name:'Ama Boateng',      email:'ama@email.com',      course:'MERN Stack',        status:'enrolled',  payment:'pending',   date:'Mar 2' },
  { id:7, name:'Samuel Tetteh',    email:'sam@email.com',      course:'Data Analytics',    status:'completed', payment:'verified',  date:'Feb 15' },
  { id:8, name:'Naomi Owusu',      email:'naomi@email.com',    course:'.NET Core Fullstack',status:'enrolled', payment:'verified',  date:'Mar 4' },
];

// ─── DASHBOARD TAB ───────────────────────────────────────────────────────────
function Dashboard() {
  return (
    <div>
      <h2 className="adm-page-title">Dashboard Overview</h2>
      <p className="adm-page-sub">Welcome back, Admin. Here's what's happening at CodeFount today.</p>

      {/* Stat cards */}
      <div className="adm-stats-grid">
        <StatCard label="Total Students"      value={adminStats.totalStudents.toLocaleString()} icon={<Users size={20}/>}       color="#0f766e" sub="+42 this week"/>
        <StatCard label="Active Enrollments"  value={adminStats.activeEnrollments}              icon={<BookOpen size={20}/>}    color="#0369a1" sub="Across 12 courses"/>
        <StatCard label="Total Revenue"       value={GHS(adminStats.totalRevenue)}              icon={<DollarSign size={20}/>}  color="#f59e0b" sub="This academic year"/>
        <StatCard label="Pending Payments"    value={adminStats.pendingPayments}                icon={<AlertCircle size={20}/>} color="#e11d48" sub="Need verification"/>
        <StatCard label="Placement Rate"      value={`${adminStats.placementRate}%`}            icon={<UserCheck size={20}/>}   color="#059669" sub="Industry-leading"/>
        <StatCard label="Workshops This Month"value={adminStats.workshopsThisMonth}             icon={<Zap size={20}/>}         color="#7c3aed" sub="3 free, 3 paid"/>
      </div>

      {/* Charts row */}
      <div className="adm-charts-row">
        <div className="adm-chart-card">
          <h3 className="adm-chart-title">Revenue by Month <span>(GHS)</span></h3>
          <BarChart data={revenueByMonth} valueKey="revenue" labelKey="month" color="#0f766e"/>
        </div>
        <div className="adm-chart-card">
          <h3 className="adm-chart-title">Enrollments by Course</h3>
          <BarChart data={enrollmentByCourse} valueKey="count" labelKey="course" color="#0369a1"/>
        </div>
      </div>

      {/* Recent activity */}
      <div className="adm-activity">
        <h3 className="adm-section-h">Recent Activity</h3>
        <div className="adm-activity-list">
          {STUDENTS.slice(0,5).map(s => (
            <div key={s.id} className="adm-activity-item">
              <div className="adm-activity-av">{s.name[0]}</div>
              <div className="adm-activity-body">
                <strong>{s.name}</strong> enrolled in <em>{s.course}</em>
                <span className="adm-activity-time">{s.date}</span>
              </div>
              <span className={`adm-chip adm-chip--${s.payment}`}>{s.payment}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COURSES TAB ────────────────────────────────────────────────────────────
function CoursesTab() {
  const [showForm, setShowForm] = useState(false);
  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h2 className="adm-page-title">Course Management</h2>
          <p className="adm-page-sub">Add, edit and deactivate training courses.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={15}/> Add Course
        </button>
      </div>

      {showForm && (
        <div className="adm-form-card">
          <h3 className="adm-form-title">New Course</h3>
          <div className="adm-form-grid">
            <div className="form-group"><label className="form-label">Course Title</label><input className="form-input" placeholder="e.g. Java Full Stack"/></div>
            <div className="form-group"><label className="form-label">Category</label>
              <select className="form-input">
                <option>Java Fullstack</option><option>DevOps</option><option>Cloud Computing</option>
                <option>AI/ML</option><option>Data Science</option><option>Cyber Security</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Trainer</label><input className="form-input" placeholder="Trainer name"/></div>
            <div className="form-group"><label className="form-label">Duration</label><input className="form-input" placeholder="e.g. 3 Months"/></div>
            <div className="form-group"><label className="form-label">Full Fee (GHS)</label><input className="form-input" type="number" placeholder="3000"/></div>
            <div className="form-group"><label className="form-label">Offer Price (GHS)</label><input className="form-input" type="number" placeholder="1900"/></div>
          </div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={3} placeholder="Course description…"/></div>
          <div className="adm-form-actions">
            <button className="btn btn-primary"><Check size={14}/> Save Course</button>
            <button className="btn btn-outline" onClick={() => setShowForm(false)}><X size={14}/> Cancel</button>
          </div>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Course</th><th>Trainer</th><th>Duration</th><th>Price</th><th>Mode</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={c.id}>
                <td style={{color:'var(--ink-3)', fontWeight:700}}>{String(i+1).padStart(2,'0')}</td>
                <td>
                  <div className="adm-course-cell">
                    <span className="adm-course-dot" style={{ background: c.color }}/>
                    <div>
                      <strong>{c.title}</strong>
                      <span style={{display:'block',fontSize:'.72rem',color:'var(--ink-3)'}}>{c.category}</span>
                    </div>
                  </div>
                </td>
                <td>{c.trainer}</td>
                <td>{c.duration}</td>
                <td>{GHS(c.offer)} <del style={{color:'var(--ink-3)',fontSize:'.72rem'}}>{GHS(c.fee)}</del></td>
                <td>{c.mode.join(', ')}</td>
                <td>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button className="adm-action-btn adm-action-btn--edit"><Edit2 size={13}/></button>
                    <button className="adm-action-btn adm-action-btn--del"><Trash2 size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── STUDENTS TAB ────────────────────────────────────────────────────────────
function StudentsTab() {
  const [search, setSearch] = useState('');
  const filtered = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h2 className="adm-page-title">Student Management</h2>
          <p className="adm-page-sub">View all registered students, enrollment status and payment verification.</p>
        </div>
        <input className="form-input" style={{width:220}} placeholder="Search students…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <div className="adm-table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Student</th><th>Course</th><th>Enrolled</th><th>Status</th><th>Payment</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((s,i)=>(
              <tr key={s.id}>
                <td style={{color:'var(--ink-3)',fontWeight:700}}>{String(i+1).padStart(2,'0')}</td>
                <td>
                  <div className="adm-student-cell">
                    <div className="adm-student-av">{s.name[0]}</div>
                    <div><strong>{s.name}</strong><span style={{display:'block',fontSize:'.72rem',color:'var(--ink-3)'}}>{s.email}</span></div>
                  </div>
                </td>
                <td style={{fontSize:'.82rem'}}>{s.course}</td>
                <td style={{fontSize:'.82rem',color:'var(--ink-2)'}}>{s.date}</td>
                <td><span className={`adm-chip adm-chip--${s.status}`}>{s.status}</span></td>
                <td>
                  <span className={`adm-chip adm-chip--${s.payment}`}>
                    {s.payment==='verified' && <Check size={11}/>}
                    {s.payment==='pending'  && <AlertCircle size={11}/>}
                    {s.payment==='rejected' && <X size={11}/>}
                    {s.payment}
                  </span>
                </td>
                <td>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button className="adm-action-btn adm-action-btn--view"><Eye size={13}/></button>
                    <button className="adm-action-btn adm-action-btn--edit"><Edit2 size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── WORKSHOPS TAB ───────────────────────────────────────────────────────────
function WorkshopsTab() {
  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h2 className="adm-page-title">Workshop Management</h2>
          <p className="adm-page-sub">Manage workshops and track seat registrations.</p>
        </div>
        <button className="btn btn-primary"><Plus size={15}/> New Workshop</button>
      </div>
      <div className="adm-ws-grid">
        {workshops.map(w => {
          const pct = Math.round((w.filled/w.seats)*100);
          return (
            <div key={w.id} className="adm-ws-card">
              <div className="adm-ws-banner" style={{ background:`linear-gradient(135deg,${w.color},${w.color}99)` }}>
                <span className="adm-ws-tag">{w.tag}</span>
                <span className="adm-ws-icon">{w.icon}</span>
              </div>
              <div className="adm-ws-body">
                <h4>{w.title}</h4>
                <p style={{fontSize:'.78rem',color:'var(--ink-2)',marginBottom:'.6rem'}}>
                  {w.date} · {w.facilitator}
                </p>
                <MiniBar pct={pct} color={w.color}/>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'.72rem',color:'var(--ink-2)',margin:'.25rem 0 .7rem'}}>
                  <span>{w.filled} / {w.seats} seats</span>
                  <span>{pct}% full</span>
                </div>
                <div style={{display:'flex',gap:'6px'}}>
                  <button className="adm-action-btn adm-action-btn--edit" style={{flex:1}}><Edit2 size={13}/> Edit</button>
                  <button className="adm-action-btn adm-action-btn--del"><Trash2 size={13}/></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS TAB ───────────────────────────────────────────────────────
function NotificationsTab() {
  const [msg, setMsg]         = useState('');
  const [target, setTarget]   = useState('all');
  const [sent, setSent]       = useState([]);
  const [notifications, setNotifications] = useState(mockNotifications);

  const send = () => {
    if (!msg.trim()) return;
    setSent(s => [{ id: Date.now(), msg, target, time: 'just now' }, ...s]);
    setMsg('');
  };

  const markRead = id => setNotifications(n => n.map(x => x.id===id ? {...x, read:true} : x));

  return (
    <div>
      <h2 className="adm-page-title">Notifications & Broadcasts</h2>
      <p className="adm-page-sub">Send messages to students, tutors or all users. View recent system notifications.</p>

      {/* Compose */}
      <div className="adm-notify-compose">
        <h3 className="adm-section-h">Compose Broadcast</h3>
        <div className="adm-notify-row">
          <div className="form-group" style={{flex:1}}>
            <label className="form-label">Recipient</label>
            <select className="form-input" value={target} onChange={e=>setTarget(e.target.value)}>
              <option value="all">All Students</option>
              <option value="java">Java Full Stack Students</option>
              <option value="devops">DevOps Students</option>
              <option value="enrolled">All Enrolled</option>
              <option value="tutors">All Tutors</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea className="form-input" rows={4} placeholder="Type your broadcast message here…" value={msg} onChange={e=>setMsg(e.target.value)}/>
        </div>
        <button className="btn btn-primary" onClick={send}><Send size={14}/> Send Broadcast</button>
      </div>

      {/* Sent history */}
      {sent.length > 0 && (
        <div className="adm-notify-sent">
          <h3 className="adm-section-h">Sent Messages</h3>
          {sent.map(s => (
            <div key={s.id} className="adm-notify-sent-item">
              <div className="adm-notify-sent-icon"><Send size={14}/></div>
              <div style={{flex:1}}>
                <p style={{fontSize:'.85rem'}}>{s.msg}</p>
                <span style={{fontSize:'.72rem',color:'var(--ink-3)'}}>To: {s.target} · {s.time}</span>
              </div>
              <button className="adm-action-btn adm-action-btn--edit"><Send size={12}/> Resend</button>
            </div>
          ))}
        </div>
      )}

      {/* Inbox */}
      <div className="adm-notify-inbox">
        <h3 className="adm-section-h">System Notifications</h3>
        {notifications.map(n => (
          <div key={n.id} className={`adm-notify-item adm-notify-item--${n.type} ${!n.read?'adm-notify-item--unread':''}`}>
            <div className="adm-notify-dot"/>
            <div style={{flex:1}}>
              <strong style={{fontSize:'.88rem'}}>{n.title}</strong>
              <p style={{fontSize:'.8rem',color:'var(--ink-2)',margin:'.15rem 0 .1rem'}}>{n.body}</p>
              <span style={{fontSize:'.72rem',color:'var(--ink-3)'}}>{n.time}</span>
            </div>
            {!n.read && (
              <button className="adm-action-btn adm-action-btn--view" onClick={() => markRead(n.id)}>
                <Check size={12}/> Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── REPORTS TAB ────────────────────────────────────────────────────────────
function ReportsTab() {
  return (
    <div>
      <h2 className="adm-page-title">Reports & Analytics</h2>
      <p className="adm-page-sub">High-level view of platform performance, revenue and student outcomes.</p>

      <div className="adm-stats-grid" style={{marginBottom:'1.5rem'}}>
        <StatCard label="Total Revenue"          value={GHS(adminStats.totalRevenue)}       icon={<DollarSign size={20}/>}  color="#f59e0b"/>
        <StatCard label="Active Enrollments"     value={adminStats.activeEnrollments}       icon={<BookOpen size={20}/>}    color="#0f766e"/>
        <StatCard label="Placement Rate"         value={`${adminStats.placementRate}%`}     icon={<UserCheck size={20}/>}   color="#059669"/>
        <StatCard label="Courses Active"         value={adminStats.coursesActive}           icon={<GraduationCap size={20}/>} color="#7c3aed"/>
      </div>

      {/* Revenue chart */}
      <div className="adm-chart-card adm-chart-card--full">
        <h3 className="adm-chart-title">Monthly Revenue Trend <span>(GHS)</span></h3>
        <BarChart data={revenueByMonth} valueKey="revenue" labelKey="month" color="#0f766e"/>
        <div className="adm-chart-footer">
          <span>Peak: <strong>Feb — {GHS(248000)}</strong></span>
          <span>YTD total: <strong>{GHS(1438000)}</strong></span>
          <span>Avg/month: <strong>{GHS(205428)}</strong></span>
        </div>
      </div>

      {/* Enrollment breakdown */}
      <div className="adm-chart-card adm-chart-card--full" style={{marginTop:'1.2rem'}}>
        <h3 className="adm-chart-title">Enrollment by Course</h3>
        <div className="adm-enroll-breakdown">
          {enrollmentByCourse.map(e => {
            const max = Math.max(...enrollmentByCourse.map(x=>x.count));
            return (
              <div key={e.course} className="adm-breakdown-row">
                <span className="adm-breakdown-label">{e.course}</span>
                <div className="adm-breakdown-bar-wrap">
                  <div className="adm-breakdown-bar" style={{ width:`${(e.count/max)*100}%` }}/>
                </div>
                <span className="adm-breakdown-count">{e.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENTS TAB ────────────────────────────────────────────────────────────
function PaymentsTab() {
  const [students, setStudents] = useState(STUDENTS);
  const approve = id => setStudents(s => s.map(x => x.id===id ? {...x, payment:'verified'} : x));
  const reject  = id => setStudents(s => s.map(x => x.id===id ? {...x, payment:'rejected'} : x));

  return (
    <div>
      <h2 className="adm-page-title">Payment Verification</h2>
      <p className="adm-page-sub">Review proof-of-payment uploads from students and approve or reject enrollments.</p>

      <div className="adm-table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Student</th><th>Course</th><th>Date</th><th>Proof</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {students.map((s,i) => (
              <tr key={s.id}>
                <td style={{color:'var(--ink-3)',fontWeight:700}}>{String(i+1).padStart(2,'0')}</td>
                <td>
                  <div className="adm-student-cell">
                    <div className="adm-student-av">{s.name[0]}</div>
                    <div><strong>{s.name}</strong></div>
                  </div>
                </td>
                <td style={{fontSize:'.82rem'}}>{s.course}</td>
                <td style={{fontSize:'.82rem',color:'var(--ink-2)'}}>{s.date}</td>
                <td>
                  <button className="adm-action-btn adm-action-btn--view">
                    <Eye size={12}/> View Proof
                  </button>
                </td>
                <td><span className={`adm-chip adm-chip--${s.payment}`}>{s.payment}</span></td>
                <td>
                  {s.payment === 'pending' ? (
                    <div style={{display:'flex',gap:'6px'}}>
                      <button className="adm-action-btn adm-action-btn--approve" onClick={()=>approve(s.id)}><Check size={12}/> Approve</button>
                      <button className="adm-action-btn adm-action-btn--del" onClick={()=>reject(s.id)}><X size={12}/> Reject</button>
                    </div>
                  ) : (
                    <span style={{fontSize:'.75rem',color:'var(--ink-3)'}}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MAIN ADMIN PORTAL ───────────────────────────────────────────────────────
export default function AdminPortal() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('dashboard');

  // In real app: check user.role === 'admin'
  // For demo: allow any logged-in user, or redirect
  if (!user) return <Navigate to="/login" replace/>;

  const TAB_CONTENT = {
    dashboard:     <Dashboard/>,
    courses:       <CoursesTab/>,
    users:         <StudentsTab/>,
    workshops:     <WorkshopsTab/>,
    notifications: <NotificationsTab/>,
    reports:       <ReportsTab/>,
    payments:      <PaymentsTab/>,
  };

  const unread = mockNotifications.filter(n=>!n.read).length;

  return (
    <div className="adm-layout page-enter">
      {/* Sidebar */}
      <aside className="adm-side">
        <div className="adm-side-logo">
          <span className="adm-side-logo-icon">⚡</span>
          <div>
            <strong>Admin Portal</strong>
            <span>CodeFount</span>
          </div>
        </div>

        <nav className="adm-side-nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`adm-nav-btn ${tab===t.id ? 'adm-nav-btn--on' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
              {t.id==='notifications' && unread>0 && (
                <span className="adm-nav-badge">{unread}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="adm-side-foot">
          <div className="adm-side-user">
            <div className="adm-side-av">{user?.name?.[0]?.toUpperCase() || 'A'}</div>
            <div>
              <div className="adm-side-uname">{user?.name || 'Admin'}</div>
              <div className="adm-side-urole">Administrator</div>
            </div>
          </div>
          <button className="adm-logout-btn" onClick={logout}><LogOut size={15}/> Sign Out</button>
        </div>
      </aside>

      {/* Content */}
      <main className="adm-main">
        <div className="adm-topbar">
          <div className="adm-topbar-breadcrumb">
            <span>Admin</span>
            <ChevronRight size={13}/>
            <span>{TABS.find(t=>t.id===tab)?.label}</span>
          </div>
          <div className="adm-topbar-right">
            <button className="adm-topbar-icon" onClick={()=>setTab('notifications')}>
              <Bell size={16}/>
              {unread>0 && <span className="adm-topbar-badge">{unread}</span>}
            </button>
          </div>
        </div>
        <div className="adm-content">
          {TAB_CONTENT[tab]}
        </div>
      </main>
    </div>
  );
}
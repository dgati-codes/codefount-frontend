import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { countryCodes } from '../../data/mockData';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', code:'+233', phone:'', gender:'', password:'' });
  const [show, setShow] = useState(false);
  const [err, setErr]   = useState('');
  const { register }    = useAuth();
  const navigate        = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handle = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setErr('Please fill all required fields.'); return; }
    const res = register(form);
    if (res.ok) navigate('/profile');
    else setErr('Registration failed');
  };

  return (
    <div className="auth-page">
      {/* Promo */}
      <div className="auth-promo">
        <div className="auth-promo__inner">
          <div className="auth-promo__logo">
            <div className="auth-promo__logo-icon">CF</div>
            <div>
              <div className="auth-promo__logo-name">CodeFount</div>
              <div className="auth-promo__tag">IT Training</div>
            </div>
          </div>
          <span className="auth-promo__badge">🎓 Join 10,000+ Learners</span>
          <h2 className="auth-promo__h1">Start Your <span>Tech Career</span> Today</h2>
          <p className="auth-promo__sub">Create your free account and get access to course demos, schedules and expert counseling.</p>
          <div className="auth-promo__items">
            {['Free course demos & trial classes','Expert career counseling','Access to batch schedules','Community of 10,000+ students'].map(i => (
              <div key={i} className="auth-promo__item">{i}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="auth-form-side">
        <div className="auth-form-box">
          <h2>Create Account</h2>
          <p>Already registered? <Link to="/login">Sign in</Link></p>
          {err && <div className="auth-error">{err}</div>}
          <form onSubmit={handle}>
            <div className="auth-fields">
              <div className="auth-row">
                <div className="form-group">
                  <label className="form-label">Full Name <span>*</span></label>
                  <input className="form-input" placeholder="John Mensah" value={form.name} onChange={e => set('name', e.target.value)} required/>
                </div>
                <div className="form-group">
                  <label className="form-label">Email <span>*</span></label>
                  <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} required/>
                </div>
              </div>
              <div className="auth-row">
                <div className="form-group">
                  <label className="form-label">Country Code</label>
                  <select className="form-select" value={form.code} onChange={e => set('code', e.target.value)}>
                    {countryCodes.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp Number</label>
                  <input className="form-input" placeholder="020 000 0000" value={form.phone} onChange={e => set('phone', e.target.value)}/>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <div style={{ display:'flex', gap:'1.5rem', paddingTop:'.35rem' }}>
                  {['Male','Female','Other'].map(g => (
                    <label key={g} style={{ display:'flex', alignItems:'center', gap:'.4rem', fontSize:'.875rem', cursor:'pointer' }}>
                      <input type="radio" name="gender" value={g} checked={form.gender===g} onChange={() => set('gender', g)} style={{ accentColor:'var(--teal)' }}/>
                      {g}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password <span>*</span></label>
                <div className="auth-pw">
                  <input className="form-input" type={show?'text':'password'} placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} required/>
                  <button type="button" className="auth-pw-toggle" onClick={() => setShow(s => !s)}>
                    {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit">Create Account</button>
          </form>
          <div className="auth-divider">or</div>
          <Link to="/login" className="btn btn-outline btn-lg auth-submit">Sign In Instead</Link>
        </div>
      </div>
    </div>
  );
}
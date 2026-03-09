import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail]   = useState('');
  const [stage, setStage]   = useState('form'); // form | sent
  const [err,   setErr]     = useState('');

  const handle = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) { setErr('Please enter a valid email.'); return; }
    setStage('sent');
  };

  return (
    <div className="auth-page">
      {/* Promo side */}
      <div className="auth-promo">
        <div className="auth-promo__inner">
          <div className="auth-promo__logo">
            <div className="auth-promo__logo-icon">CF</div>
            <div>
              <div className="auth-promo__logo-name">CodeFount</div>
              <div className="auth-promo__tag">IT Training</div>
            </div>
          </div>
          <span className="auth-promo__badge">🔐 Account Recovery</span>
          <h2 className="auth-promo__h1">Reset Your <span>Password</span> Securely</h2>
          <p className="auth-promo__sub">
            Enter the email linked to your CodeFount account. We'll send you a secure link to reset your password — valid for 30 minutes.
          </p>
          <div className="auth-promo__items">
            {[
              'Secure one-time reset link',
              'Link expires in 30 minutes',
              'Check your spam folder too',
              'Contact support if no email arrives',
            ].map(i => <div key={i} className="auth-promo__item">{i}</div>)}
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="auth-form-side">
        <div className="auth-form-box">
          <Link to="/login" className="fp-back"><ArrowLeft size={14}/> Back to Sign In</Link>

          {stage === 'sent' ? (
            <div className="fp-sent">
              <div className="fp-sent__icon"><CheckCircle size={36}/></div>
              <h2>Check Your Email</h2>
              <p>
                We've sent a password reset link to <strong>{email}</strong>.
                It will expire in 30 minutes. Check your spam folder if you don't see it.
              </p>
              <Link to="/login" className="btn btn-primary btn-lg" style={{ width:'100%', justifyContent:'center', marginTop:'1rem' }}>
                Back to Sign In
              </Link>
              <button className="fp-resend" onClick={() => setStage('form')}>
                Didn't receive it? Try again
              </button>
            </div>
          ) : (
            <>
              <h2>Forgot Password?</h2>
              <p>No worries — enter your email and we'll send a reset link. <Link to="/login">Back to sign in</Link></p>
              {err && <div className="auth-error">{err}</div>}
              <form onSubmit={handle}>
                <div className="auth-fields">
                  <div className="form-group">
                    <label className="form-label">Email Address <span>*</span></label>
                    <div className="fp-input-wrap">
                      <Mail size={15} className="fp-input-icon"/>
                      <input
                        className="form-input fp-input"
                        type="email"
                        placeholder="you@email.com"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setErr(''); }}
                        required
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg auth-submit">
                  Send Reset Link
                </button>
              </form>
              <div className="auth-divider">remembered your password?</div>
              <Link to="/login" className="btn btn-outline btn-lg auth-submit">Sign In</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
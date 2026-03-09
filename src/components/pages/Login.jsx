import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setErr("");

    const res = await login(email, pass);

    if (res.ok) {
      navigate("/profile");
    } else {
      setErr(res.error || "Login failed");
    }
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

          <span className="auth-promo__badge">🚀 Now Enrolling</span>

          <h2 className="auth-promo__h1">
            Welcome Back to <span>CodeFount</span>
          </h2>

          <p className="auth-promo__sub">
            Sign in to access your courses, track progress and connect with your
            cohort.
          </p>

          <div className="auth-promo__items">
            {[
              "Access your enrolled courses",
              "View training schedules",
              "Download certificates",
              "Chat with your instructor",
            ].map((i) => (
              <div key={i} className="auth-promo__item">
                {i}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="auth-form-side">
        <div className="auth-form-box">
          <h2>Sign In</h2>

          <p>
            Don't have an account? <Link to="/register">Register free</Link>
          </p>

          {err && <div className="auth-error">{err}</div>}

          <form onSubmit={handle}>
            <div className="auth-fields">
              {/* Email */}
              <div className="form-group">
                <label className="form-label">
                  Email <span>*</span>
                </label>

                <input
                  className="form-input"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <label className="form-label">
                    Password <span>*</span>
                  </label>

                  <Link to="/forgot-password" className="auth-fp-link">
                    Forgot password?
                  </Link>
                </div>

                <div className="auth-pw">
                  <input
                    className="form-input"
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="auth-pw-toggle"
                    onClick={() => setShow((s) => !s)}
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
            >
              Sign In
            </button>
          </form>

          <div className="auth-divider">or</div>

          <Link to="/register" className="btn btn-outline btn-lg auth-submit">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
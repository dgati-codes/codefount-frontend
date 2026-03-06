import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User, Home } from 'lucide-react';
import { navLinks } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const close = () => setOpen(false);
  const handleLogout = () => { logout(); navigate('/'); close(); };

  return (
    <header className="nav">
      <div className="container nav__row">

        {/* Logo */}
        <Link to="/" className="nav__logo" onClick={close}>
          <div className="nav__logo-icon"><span>CF</span></div>
          <div>
            <div className="nav__logo-name">CodeFount</div>
            <div className="nav__logo-tag">IT Training</div>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className="nav__links hide-mob">
          <Link to="/" className={`nav__link ${pathname === '/' ? 'active' : ''}`}>
            <Home size={13} /> Home
          </Link>
          {navLinks.map(l => (
            <Link key={l.path} to={l.path}
              className={`nav__link ${pathname === l.path ? 'active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Auth actions */}
        <div className="nav__actions hide-mob">
          {user ? (
            <>
              <Link to="/profile" className="nav__user">
                <div className="nav__avatar">{user.name[0].toUpperCase()}</div>
                <span>{user.name}</span>
              </Link>
              <button className="nav__logout" onClick={handleLogout} title="Sign out">
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav__signin">Sign In</Link>
              <Link to="/register" className="btn btn-amber btn-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="nav__toggle" onClick={() => setOpen(o => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="nav__drawer">
          <Link to="/" className={`nav__drawer-link ${pathname==='/'?'active':''}`} onClick={close}>
            <Home size={14}/> Home
          </Link>
          {navLinks.map(l => (
            <Link key={l.path} to={l.path}
              className={`nav__drawer-link ${pathname===l.path?'active':''}`}
              onClick={close}>{l.label}</Link>
          ))}
          <div className="nav__drawer-foot">
            {user ? (
              <>
                <Link to="/profile" className="btn btn-outline btn-sm" onClick={close}>My Profile</Link>
                <button className="btn btn-primary btn-sm" onClick={handleLogout}>Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn btn-outline btn-sm" onClick={close}>Sign In</Link>
                <Link to="/register" className="btn btn-amber btn-sm"   onClick={close}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, User, Home } from "lucide-react";
import { navLinks } from "../../data/mockData";
import { useState, useEffect } from "react";
import { notifications as notifApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [unreadBadge, setUnreadBadge] = useState(0);
  const { user, logout, isAdmin, isTrainer } = useAuth();

  useEffect(() => {
    if (!user) {
      setUnreadBadge(0);
      return;
    }
    notifApi
      .unreadCount()
      .then((d) => setUnreadBadge(d?.unread || 0))
      .catch(() => {});
    const interval = setInterval(() => {
      notifApi
        .unreadCount()
        .then((d) => setUnreadBadge(d?.unread || 0))
        .catch(() => {});
    }, 60000); // poll every 60s
    return () => clearInterval(interval);
  }, [user]);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const close = () => setOpen(false);
  const handleLogout = () => {
    logout();
    navigate("/");
    close();
  };

  return (
    <header className="nav">
      <div className="container nav__row">
        {/* Logo */}
        <Link to="/" className="nav__logo" onClick={close}>
          <div className="nav__logo-icon">
            <span>CF</span>
          </div>
          <div>
            <div className="nav__logo-name">CodeFount</div>
            <div className="nav__logo-tag">IT Training</div>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className="nav__links hide-mob">
          <Link
            to="/"
            className={`nav__link ${pathname === "/" ? "active" : ""}`}
          >
            <Home size={13} /> Home
          </Link>
          {navLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`nav__link ${pathname === l.path ? "active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Auth actions */}
        <div className="nav__actions hide-mob">
          {user ? (
            <>
              <Link
                to="/profile"
                className="nav__user"
                style={{ position: "relative" }}
              >
                <div className="nav__avatar" style={{ position: "relative" }}>
                  {(user.full_name || user.email || "U")[0].toUpperCase()}
                  {unreadBadge > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: -4,
                        right: -4,
                        width: 14,
                        height: 14,
                        background: "var(--amber)",
                        borderRadius: "50%",
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {unreadBadge > 9 ? "9+" : unreadBadge}
                    </span>
                  )}
                </div>
                <span>{user.full_name || user.email}</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav__portal-btn">
                  ⚡ Admin
                </Link>
              )}
              {isTrainer && !isAdmin && (
                <Link to="/tutor" className="nav__portal-btn">
                  🎓 Tutor
                </Link>
              )}
              <button
                className="nav__logout"
                onClick={handleLogout}
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav__signin">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-amber btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="nav__toggle" onClick={() => setOpen((o) => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="nav__drawer">
          <Link
            to="/"
            className={`nav__drawer-link ${pathname === "/" ? "active" : ""}`}
            onClick={close}
          >
            <Home size={14} /> Home
          </Link>
          {navLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`nav__drawer-link ${pathname === l.path ? "active" : ""}`}
              onClick={close}
            >
              {l.label}
            </Link>
          ))}
          <div className="nav__drawer-foot">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="btn btn-outline btn-sm"
                  onClick={close}
                >
                  My Profile
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="btn btn-sm"
                    style={{
                      background: "var(--navy)",
                      color: "#fff",
                      border: "none",
                    }}
                    onClick={close}
                  >
                    ⚡ Admin
                  </Link>
                )}
                {(user.role === "trainer" || user.role === "admin") && (
                  <Link
                    to="/tutor"
                    className="btn btn-sm"
                    style={{
                      background: "var(--teal)",
                      color: "#fff",
                      border: "none",
                    }}
                    onClick={close}
                  >
                    🎓 Tutor
                  </Link>
                )}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline btn-sm"
                  onClick={close}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-amber btn-sm"
                  onClick={close}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

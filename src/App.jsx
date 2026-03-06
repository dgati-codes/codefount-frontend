import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar       from './components/layout/Navbar';
import Footer       from './components/layout/Footer';
import Home         from './components/pages/Home';
import About        from './components/pages/About';
import Courses      from './components/pages/Courses';
import CourseDetail from  './components/pages/CourseDetail';
import Services     from './components/pages/Services';
import Schedules    from './components/pages/Schedules';
import Contact      from './components/pages/Contact';
import Login        from './components/pages/Login';
import Register     from './components/pages/Register';
import Profile      from './components/pages/Profile';

function Shell({ children, noFooter }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Navbar />
      <main style={{ flex:1 }}>{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
}

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"            element={<Shell><Home /></Shell>} />
          <Route path="/about"       element={<Shell><About /></Shell>} />
          <Route path="/courses"     element={<Shell><Courses /></Shell>} />
          <Route path="/courses/:id" element={<Shell><CourseDetail /></Shell>} />
          <Route path="/services"    element={<Shell><Services /></Shell>} />
          <Route path="/schedules"   element={<Shell><Schedules /></Shell>} />
          <Route path="/contact"     element={<Shell><Contact /></Shell>} />
          <Route path="/login"       element={<Shell noFooter><Login /></Shell>} />
          <Route path="/register"    element={<Shell noFooter><Register /></Shell>} />
          <Route path="/profile"     element={<Shell noFooter><Protected><Profile /></Protected></Shell>} />
          <Route path="*"            element={<Shell><NotFound /></Shell>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign:'center', padding:'6rem 2rem' }}>
      <div style={{ fontFamily:'var(--display)', fontSize:'6rem', fontWeight:800, color:'var(--teal)', lineHeight:1 }}>404</div>
      <p style={{ color:'var(--ink-2)', margin:'1rem 0 2rem', fontSize:'1.1rem' }}>Page not found.</p>
      <a href="/" className="btn btn-primary">Back to Home</a>
    </div>
  );
}
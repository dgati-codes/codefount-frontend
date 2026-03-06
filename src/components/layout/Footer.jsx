
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__grid">

        {/* Brand */}
        <div className="footer__brand">
          <div className="footer__logo">
            <div className="footer__logo-icon"><span>CF</span></div>
            <span className="footer__logo-name">CodeFount</span>
          </div>
          <p className="footer__desc">
            Ghana's leading IT training institute. Empowering careers through hands-on,
            industry-aligned education since 2020.
          </p>
          <div className="footer__socials">
            {['Fb','Tw','Li','Yt','Ig'].map(s => <a key={s} href="#" className="footer__social">{s}</a>)}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <div className="footer__heading">Quick Links</div>
          {[['/','/about','/courses','/services'],['/schedules','/contact','/login','/register']].flat().map((p,i) => {
            const labels = ['Home','About Us','Courses','Services','Training Schedule','Contact','Sign In','Register'];
            return <Link key={p} to={p} className="footer__link">{labels[i]}</Link>;
          })}
        </div>

        {/* Courses */}
        <div>
          <div className="footer__heading">Top Courses</div>
          {['Python Full Stack','Business Analyst','Java Full Stack','DevOps Multi-Cloud','Generative AI','Cyber Security','AWS Bootcamp','MERN Stack'].map(c => (
            <Link key={c} to="/courses" className="footer__link">{c}</Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <div className="footer__heading">Contact Us</div>
          <div className="footer__contact-list">
            <div className="footer__contact-item">
              <MapPin size={14}/><span>Michel Camp Afienya Road, Accra, Ghana</span>
            </div>
            <div className="footer__contact-item">
              <Phone size={14}/><span>+233 542 878 621</span>
            </div>
            <div className="footer__contact-item">
              <Mail size={14}/><span>codefount.techtraining@gmail.com</span>
            </div>
          </div>
          <a href="https://wa.me/233542878621" className="footer__wa">💬 Chat on WhatsApp</a>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {year} CodeFount. All rights reserved.</span>
          <span>Powered by Passion in Ghana</span>
        </div>
      </div>
    </footer>
  );
}
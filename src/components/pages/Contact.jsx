import { useState } from "react";
import { enquiries } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import "./Contact.css";

export default function Contact() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      if (user) await enquiries.submitAuth(form);
      else await enquiries.submit(form);
      setSent(true);
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page-enter">
      <section className="ct-hero">
        <div className="container ct-hero__inner">
          <span className="badge badge-dark">Get In Touch</span>
          <h1 className="ct-hero__h1">
            We'd Love to <span>Hear From You</span>
          </h1>
          <p className="ct-hero__sub">
            Have questions about our courses? Our team is ready to help you
            choose the right learning path.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container ct-body">
          {/* Info */}
          <div className="ct-info">
            <h2 className="ct-info__title">Contact Information</h2>
            <div className="ct-info__list">
              <div className="ct-info__item">
                <div className="ct-info__icon">
                  <MapPin size={17} />
                </div>
                <div>
                  <strong>Address</strong>
                  <p>Ring Road Central, Accra, Ghana</p>
                </div>
              </div>
              <div className="ct-info__item">
                <div className="ct-info__icon">
                  <Phone size={17} />
                </div>
                <div>
                  <strong>Phone</strong>
                  <p>+233 998 539 677</p>
                </div>
              </div>
              <div className="ct-info__item">
                <div className="ct-info__icon">
                  <Mail size={17} />
                </div>
                <div>
                  <strong>Email</strong>
                  <p>info@codefount.com</p>
                </div>
              </div>
              <div className="ct-info__item">
                <div className="ct-info__icon">
                  <Clock size={17} />
                </div>
                <div>
                  <strong>Hours</strong>
                  <p>Mon–Sat, 8am – 7pm</p>
                </div>
              </div>
            </div>
            <div className="ct-map">📍 Accra, Ghana</div>
          </div>

          {/* Form */}
          <div className="ct-form">
            <h2 className="ct-form__title">Send a Message</h2>
            {sent ? (
              <div className="ct-success">
                ✅ Message sent! We'll get back to you within 24 hours.
              </div>
            ) : (
              <div className="ct-form__fields">
                <div className="ct-row">
                  <div className="form-group">
                    <label className="form-label">
                      Name <span>*</span>
                    </label>
                    <input
                      className="form-input"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Email <span>*</span>
                    </label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <div className="ct-row">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" placeholder="+233 …" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      className="form-input"
                      placeholder="Course enquiry…"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Message <span>*</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={5}
                    placeholder="Tell us how we can help…"
                  />
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: "100%" }}
                  onClick={() => setSent(true)}
                >
                  Send Message <Send size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

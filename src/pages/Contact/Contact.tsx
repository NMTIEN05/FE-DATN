import React from 'react';
import './Contact.css';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Liên hệ với chúng tôi</h1>
            <p>
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh
              bên dưới
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="contact-layout">
          {/* Contact Information */}
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">
                <FaMapMarkerAlt />
              </div>
              <h3>Địa chỉ</h3>
              <p>123 Đường ABC, Quận XYZ</p>
              <p>Thành phố Hồ Chí Minh</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaPhone />
              </div>
              <h3>Điện thoại</h3>
              <p>Hotline: 1900 1234</p>
              <p>Hỗ trợ: 0123 456 789</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <h3>Email</h3>
              <p>info@example.com</p>
              <p>support@example.com</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaClock />
              </div>
              <h3>Giờ làm việc</h3>
              <p>Thứ 2 - Thứ 6: 8:00 - 18:00</p>
              <p>Thứ 7: 8:00 - 12:00</p>
            </div>

            {/* Social Media */}
            <div className="social-media">
              <h3>Kết nối với chúng tôi</h3>
              <div className="social-links">
                <a href="#" className="social-link">
                  <FaFacebookF />
                </a>
                <a href="#" className="social-link">
                  <FaTwitter />
                </a>
                <a href="#" className="social-link">
                  <FaInstagram />
                </a>
                <a href="#" className="social-link">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form">
            <div className="form-header">
              <h2>Gửi tin nhắn cho chúng tôi</h2>
              <p>Điền thông tin của bạn vào form bên dưới, chúng tôi sẽ liên hệ lại sớm nhất</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Họ và tên</label>
                <input type="text" id="name" placeholder="Nhập họ và tên của bạn" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Nhập email của bạn" required />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input type="tel" id="phone" placeholder="Nhập số điện thoại của bạn" required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Tiêu đề</label>
                <input type="text" id="subject" placeholder="Nhập tiêu đề" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Nội dung</label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Nhập nội dung tin nhắn của bạn"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary">
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="map-section">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197956!2d106.69141431533417!3d10.777167162163188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a9d8d1bb3%3A0xc4eca1b1726b7e87!2sNguyen%20Hue%20Walking%20Street!5e0!3m2!1sen!2s!4v1647007193923!5m2!1sen!2s"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
};

export default Contact; 
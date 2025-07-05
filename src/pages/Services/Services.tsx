import React, { useEffect, useState } from 'react';
import './Services.css';
import {
  FaShieldAlt,
  FaTools,
  FaExchangeAlt,
  FaHeadset,
  FaTruck,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
} from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

const iconMap = {
  FaShieldAlt: <FaShieldAlt />,
  FaTools: <FaTools />,
  FaExchangeAlt: <FaExchangeAlt />,
  FaHeadset: <FaHeadset />,
  FaTruck: <FaTruck />,
  FaClock: <FaClock />,
  FaCheckCircle: <FaCheckCircle />,
};

const Services = () => {
  const [mainServices, setMainServices] = useState([]);
  const [additionalServices, setAdditionalServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:8888/api/services');
        const services = res.data;
        setMainServices(services.filter(s => s.type === 'main'));
        setAdditionalServices(services.filter(s => s.type === 'additional'));
      } catch (error) {
        console.error('Lỗi khi tải dịch vụ:', error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Dịch vụ của chúng tôi</h1>
          
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="main-services">
        <div className="container">
          <div className="section-header">
      
          </div>
          <div className="services-grid">
            {mainServices.map((service) => (
              <Link
                to={`/services/${service._id}`}
                key={service._id}
                className="service-card"
              >
                <div className="service-icon">
                  {iconMap[service.icon] || <FaCheckCircle />}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="additional-services">
        <div className="container">
          <div className="section-header">
            <h2>Dịch vụ bổ sung</h2>
          </div>
          <div className="services-grid">
            {additionalServices.map((service) => (
              <Link
                to={`/services/${service._id}`}
                key={service._id}
                className="service-card feature-card"
              >
                <div className="service-icon">
                  {iconMap[service.icon] || <FaCheckCircle />}
                </div>
                <h3>{service.title}</h3>
                <ul>
                  {service.features?.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="service-process">
        <div className="container">
          <div className="section-header">
            <h2>Quy trình dịch vụ</h2>
            
          </div>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Tiếp nhận yêu cầu</h3>
              <p>Ghi nhận thông tin và tình trạng thiết bị của khách hàng</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Kiểm tra & báo giá</h3>
              <p>Kiểm tra kỹ thuật và đưa ra báo giá chi tiết</p>
            </div>
            <div className="step-arrow">
              <FaArrowRight />
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Thực hiện dịch vụ</h3>
              <p>Tiến hành sửa chữa hoặc bảo hành theo quy trình</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h3>Bàn giao & bảo hành</h3>
              <p>Kiểm tra lại và bàn giao thiết bị cho khách hàng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta-enhanced">
  <div className="container">
    <div className="cta-heading">
      <h2>Liên hệ ngay với chúng tôi</h2>
      <p>Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc của bạn 24/7</p>
    </div>
    <div className="contact-info-grid">
      <div className="contact-card">
        <h4>📞 Hotline hỗ trợ</h4>
        <p><strong>1800 1234</strong> (miễn phí)</p>
        <p><strong>1900 5678</strong> (1000đ/phút)</p>
      </div>
      <div className="contact-card">
        <h4>✉️ Email</h4>
        <p><a href="mailto:hotro@yourshop.vn">hotro@yourshop.vn</a></p>
        <p><a href="mailto:contact@yourshop.vn">contact@yourshop.vn</a></p>
      </div>
      <div className="contact-card">
        <h4>📍 Cửa hàng</h4>
        <p>123 Nguyễn Trãi, Q.1, TP.HCM</p>
        <p>45 Lê Duẩn, Q.Đống Đa, Hà Nội</p>
        <a href="/store-locator" className="link-more">→ Xem tất cả</a>
      </div>
      <div className="contact-card">
        <h4>⏰ Giờ làm việc</h4>
        <p>Thứ 2 - CN: <strong>8:00 – 21:00</strong></p>
        <p>Online hỗ trợ: <strong>24/7</strong></p>
      </div>
    </div>
    <div className="cta-buttons">
      <a href="/contact" className="btn-primary">Liên hệ ngay</a>
      <a href="/faq" className="btn-outline">Câu hỏi thường gặp</a>
    </div>
  </div>
</section>

    </div>
  );
};

export default Services;
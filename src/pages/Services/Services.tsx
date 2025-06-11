import React from 'react';
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

const Services = () => {
  const mainServices = [
    {
      icon: <FaShieldAlt />,
      title: 'Bảo hành chính hãng',
      description:
        'Tất cả sản phẩm đều được bảo hành chính hãng theo chính sách của nhà sản xuất',
    },
    {
      icon: <FaTools />,
      title: 'Sửa chữa chuyên nghiệp',
      description: 'Đội ngũ kỹ thuật viên có tay nghề cao, được đào tạo chuyên sâu',
    },
    {
      icon: <FaExchangeAlt />,
      title: 'Đổi trả miễn phí',
      description: 'Hỗ trợ đổi trả sản phẩm trong vòng 15 ngày nếu có lỗi từ nhà sản xuất',
    },
    {
      icon: <FaHeadset />,
      title: 'Tư vấn 24/7',
      description: 'Đội ngũ tư vấn viên nhiệt tình, sẵn sàng hỗ trợ mọi lúc mọi nơi',
    },
  ];

  const additionalServices = [
    {
      icon: <FaTruck />,
      title: 'Giao hàng tận nơi',
      features: ['Miễn phí giao hàng trong nội thành', 'Đóng gói cẩn thận, an toàn', 'Theo dõi đơn hàng trực tuyến'],
    },
    {
      icon: <FaClock />,
      title: 'Sửa chữa nhanh chóng',
      features: ['Tiếp nhận máy trong 15 phút', 'Sửa chữa trong 24h', 'Cập nhật tiến độ qua SMS'],
    },
    {
      icon: <FaCheckCircle />,
      title: 'Dịch vụ cao cấp',
      features: ['Bảo hành tận nơi', 'Vệ sinh máy miễn phí', 'Tư vấn sử dụng sau bán hàng'],
    },
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Dịch vụ của chúng tôi</h1>
            <p>
              Cam kết mang đến trải nghiệm dịch vụ tốt nhất cho khách hàng với đội ngũ nhân viên chuyên
              nghiệp và tận tâm
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="main-services">
        <div className="container">
          <div className="section-header">
            <h2>Dịch vụ chính</h2>
            <p>Những dịch vụ nổi bật mà chúng tôi cung cấp cho khách hàng</p>
          </div>
          <div className="services-grid">
            {mainServices.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="additional-services">
        <div className="container">
          <div className="section-header">
            <h2>Dịch vụ bổ sung</h2>
            <p>Các dịch vụ đi kèm giúp nâng cao trải nghiệm khách hàng</p>
          </div>
          <div className="services-grid">
            {additionalServices.map((service, index) => (
              <div key={index} className="service-card feature-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <ul>
                  {service.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="service-process">
        <div className="container">
          <div className="section-header">
            <h2>Quy trình dịch vụ</h2>
            <p>Các bước thực hiện dịch vụ chuyên nghiệp, nhanh chóng</p>
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
      <section className="contact-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Bạn cần hỗ trợ?</h2>
            <p>Đội ngũ chuyên viên của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
            <div className="cta-buttons">
              <button className="btn btn-primary">
                Liên hệ ngay <FaArrowRight />
              </button>
              <button className="btn btn-outline">Tìm hiểu thêm</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services; 
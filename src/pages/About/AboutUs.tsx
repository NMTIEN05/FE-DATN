import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => (
  <div className="aboutus-page">
    <div className="container">
      <h1>Về chúng tôi</h1>
      <p>
        <b>ESHOP</b> là hệ thống bán lẻ điện thoại, phụ kiện và thiết bị công nghệ uy tín hàng đầu Việt Nam.
        Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chính hãng, giá cả cạnh tranh cùng dịch vụ hậu mãi tận tâm.
      </p>
      <h2>Sứ mệnh</h2>
      <p>
        Đặt khách hàng làm trung tâm, ESHOP không ngừng đổi mới để mang lại trải nghiệm mua sắm tiện lợi, an toàn và hài lòng nhất.
      </p>
      <h2>Giá trị cốt lõi</h2>
      <ul>
        <li>Chất lượng sản phẩm là ưu tiên số 1</li>
        <li>Phục vụ tận tâm, tư vấn chuyên nghiệp</li>
        <li>Chính sách bảo hành, đổi trả minh bạch</li>
        <li>Luôn cập nhật công nghệ mới nhất</li>
      </ul>
      <h2>Thông tin liên hệ</h2>
      <ul>
        <li>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</li>
        <li>Hotline: 0123 456 789</li>
        <li>Email: support@eshop.vn</li>
      </ul>
      <h2>Lời cảm ơn</h2>
      <p>
        Cảm ơn quý khách đã tin tưởng và lựa chọn ESHOP. Sự hài lòng của bạn là thành công lớn nhất của chúng tôi!
      </p>
      <div className="aboutus-services-cta">
        <span>Bạn muốn biết thêm về các dịch vụ của chúng tôi?</span>
        <Link to="/services" className="aboutus-services-link">
          <button className="btn btn-primary">Khám phá dịch vụ</button>
        </Link>
      </div>
    </div>
  </div>
);

export default AboutUs; 
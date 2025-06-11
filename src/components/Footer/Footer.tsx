import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-row">
        <h5>KẾT NỐI</h5>
        <h4>
          Liên hệ trực tiếp :
          <br />
          (Thời gian làm việc: 09h00 - 21h00)
        </h4>
        <div className="phone-number">037.222.9304</div>
        <ul>
          <li>
            <a href="#">
              <i className="fab fa-facebook"></i> Facebook
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fab fa-youtube"></i> YouTube
            </a>
          </li>
          <li>
            <a href="#">
              <img src="path/to/zalo-icon.png" style={{ width: '20px', marginRight: '10px' }} /> Zalo
            </a>
          </li>
        </ul>
      </div>

      <div className="footer-row">
        <h5>CHÍNH SÁCH</h5>
        <ul>
          <li><a href="#">Hướng dẫn thanh toán</a></li>
          <li><a href="#">Hướng dẫn đặt hàng</a></li>
          <li><a href="#">Hướng dẫn mua trả góp</a></li>
          <li><a href="#">Qui định đổi mới sản phẩm</a></li>
          <li><a href="#">Quy định bảo hành - đổi trả</a></li>
          <li><a href="#">Quy định giao hàng tận nơi</a></li>
        </ul>
      </div>

      <div className="footer-row">
        <h5>VỀ CHÚNG TÔI</h5>
        <ul>
          <li><a href="#">Giới thiệu DHM</a></li>
          <li><a href="#">Tuyển dụng</a></li>
          <li><a href="#">Điều khoản sử dụng</a></li>
          <li><a href="#">Chính sách chất lượng</a></li>
          <li><a href="#">Bảo mật thông tin</a></li>
          <li><a href="#">Hỗ trợ thanh toán</a></li>
        </ul>
      </div>

      <div className="footer-row">
        <h5>Hỗ Trợ Thanh Toán</h5>
        <ul className="payment-methods">
          <li><i className="fab fa-cc-visa"></i> Visa</li>
          <li><i className="fab fa-cc-mastercard"></i> MasterCard</li>
          <li><i className="fab fa-paypal"></i> PayPal</li>
          <li><i className="fab fa-apple-pay"></i> Apple Pay</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer; 
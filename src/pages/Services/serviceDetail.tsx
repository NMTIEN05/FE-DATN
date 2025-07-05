import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as Icons from 'react-icons/fa';
import './ServiceDetail.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState<any>(null); // sửa nếu cần kiểu rõ hơn

  useEffect(() => {
    axios
      .get(`http://localhost:8888/api/services/${id}`)
      .then((res) => setService(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!service) return <div>Đang tải...</div>;

  const IconComponent = Icons[service.icon as keyof typeof Icons] || Icons.FaCheckCircle;

  return (
    <div className="service-detail">

      <div className="service-detail__card">
         <a href="/services" className="service-detail__back">← Quay lại</a>

        <h1 className="service-detail__title">
          <span className="service-detail__icon"><IconComponent /></span>
          {service.title}
        </h1>

        <span className="service-detail__type">
          {service.type === 'main' ? 'Dịch vụ chính' : 'Dịch vụ bổ sung'}
        </span>

        <p className="service-detail__desc">{service.description}</p>

        {service.features?.length > 0 && (
          <>
            <ul className="service-detail__features">
              {service.features.map((f: string, idx: number) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          </>
        )}

      </div>
    </div>
  );
};

export default ServiceDetail;

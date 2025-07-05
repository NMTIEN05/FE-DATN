import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios.config';
import './BlogDetail.css';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog_post', slug],
    queryFn: async () => {
      const res = await axios.get(`/blog_posts?slug=${slug}`);
      return res.data[0];
    },
    enabled: !!slug
  });

  if (isLoading) return <div>Đang tải...</div>;
  if (error || !blog) return <div>Không tìm thấy bài viết</div>;

  return (
    <div className="blog-detail-page">
      <button className="back-btn" onClick={() => navigate('/')}>← Quay lại danh sách</button>
      <div className="blog-detail-container">
        <img className="blog-detail-thumb" src={blog.thumbnail_url} alt={blog.title} />
        <h1 className="blog-detail-title">{blog.title}</h1>
        <div className="blog-detail-date">
          {blog.published_at ? new Date(blog.published_at).toLocaleDateString('vi-VN') : ''}
        </div>
        <div className="blog-detail-content">
          {blog.content}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail; 
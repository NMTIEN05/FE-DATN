import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios.config';
import './BlogList.css';

type Blog = {
  _id: string;
  largeTitle: string;
  smallTitle: string;
  description: string;
  content: string;
  imageUrl?: string;
  author?: string;
  slug?: string;
  createdAt?: string;
};

const toFullImageUrl = (url?: string) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `http://localhost:8888${url}`;
};

const BlogList: React.FC = () => {
  const navigate = useNavigate();

  const { data: blogPosts, isLoading, error } = useQuery<Blog[]>({
    queryKey: ['blogs_published'],
    queryFn: async () => {
      const response = await axios.get('/blog', { params: { status: 'published' } });
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Có lỗi xảy ra khi tải dữ liệu</div>
      </div>
    );
  }

  return (
    <div className="blog-list-page">
      <div className="blog-list-container">
        <div className="blog-list-header">
          <h1 className="blog-list-title">Tin tức công nghệ</h1>
          <p className="blog-list-subtitle">
            Cập nhật những tin tức mới nhất về công nghệ và smartphone
          </p>
        </div>

        <div className="blog-list-grid">
          {blogPosts?.map((post) => (
            <div
              key={post._id}
              className="blog-list-card"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <div className="blog-list-image">
                <img src={toFullImageUrl(post.imageUrl)} alt={post.largeTitle} />
                <div className="blog-list-overlay">
                  <span className="blog-list-date">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : ''}
                  </span>
                </div>
              </div>
              <div className="blog-list-content">
                <h3 className="blog-list-card-title">{post.largeTitle}</h3>
                <p className="blog-list-excerpt">
                  {post.description || (post.content?.substring(0, 150) + '...')}
                </p>
                <div className="blog-list-meta">
                  <span className="blog-list-author">HOla Phone</span>
                  <span className="blog-list-read-time">5 phút đọc</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {blogPosts?.length === 0 && (
          <div className="blog-list-empty">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Chưa có bài viết nào
            </h3>
            <p className="text-gray-500">
              Hãy quay lại sau để xem những bài viết mới nhất
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList; 
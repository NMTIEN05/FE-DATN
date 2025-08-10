// src/components/Home/BlogSection.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios.config';

type Blog = {
  _id: string;
  largeTitle: string;
  imageUrl?: string;
  slug?: string;
  createdAt?: string;
};

const toFullImageUrl = (url?: string) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `http://localhost:8888${url}`;
};

const BlogSection: React.FC = () => {
  const navigate = useNavigate();
  const { data: blogs } = useQuery<Blog[]>({
    queryKey: ['home_blogs'],
    queryFn: async () => {
      const res = await axios.get('/blog', { params: { status: 'published' } });
      return res.data;
    }
  });

  const blogPosts = (blogs || []).slice(0, 3);

  return (
    <section style={{ marginTop: 40 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h2 style={{ fontSize: 24 }}>📰 Tin tức công nghệ</h2>
        <a href="/blog" style={{ color: '#1890ff' }}>Xem tất cả</a>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        {blogPosts.map((post) => (
          <div
            key={post._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
            onClick={() => navigate(`/blog/${post.slug}`)}
          >
            <img
              src={toFullImageUrl(post.imageUrl)}
              alt={post.largeTitle}
              style={{ width: '100%', height: 160, objectFit: 'cover' }}
            />
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 14, color: '#888', marginBottom: 6 }}>
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : ''}
              </div>
              <h3 style={{ fontSize: 16 }}>{post.largeTitle}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
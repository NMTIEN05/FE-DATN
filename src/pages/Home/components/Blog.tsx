// src/components/Home/BlogSection.tsx
import React from 'react';

const blogPosts = [
  {
    id: 1,
    title: 'iPhone 16 Pro ra mắt với chip A18 Bionic',
    thumbnail: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/news/di-dong/1-kich-thuoc-iphone-16-pro-max-se-tang-dang-ke.jpg',
    date: '12/07/2025',
    slug: 'iphone-16-pro-a18',
  },
  {
    id: 2,
    title: 'Samsung S24 Ultra - Đối thủ lớn nhất của iPhone',
    thumbnail: 'https://didongviet.vn/dchannel/wp-content/uploads/2021/11/so-sanh-iphone-va-samsung-didongviet-1.jpg',
    date: '11/07/2025',
    slug: 'samsung-s24-vs-iphone',
  },
  {
    id: 3,
    title: 'Top 5 smartphone đáng mua nhất tháng 7',
    thumbnail: 'https://tiki.vn/blog/wp-content/uploads/2023/02/cac-dong-iphone.jpg',
    date: '10/07/2025',
    slug: 'top-5-smartphone-t7',
  },
];

const BlogSection: React.FC = () => {
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
            key={post.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
            onClick={() => (window.location.href = `/blog/${post.slug}`)}
          >
            <img
              src={post.thumbnail}
              alt={post.title}
              style={{ width: '100%', height: 160, objectFit: 'cover' }}
            />
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 14, color: '#888', marginBottom: 6 }}>{post.date}</div>
              <h3 style={{ fontSize: 16 }}>{post.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
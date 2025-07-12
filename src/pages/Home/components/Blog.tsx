// src/components/Home/BlogSection.tsx
import React from 'react';

const blogPosts = [
  {
    id: 1,
    title: 'iPhone 16 Pro ra mắt với chip A18 Bionic',
    thumbnail: 'https://i.pinimg.com/736x/ea/3c/79/ea3c79ac340f9d460655f1069a5ec768.jpg',
    date: '12/07/2025',
    slug: 'iphone-16-pro-a18',
  },
  {
    id: 2,
    title: 'Samsung S24 Ultra - Đối thủ lớn nhất của iPhone',
    thumbnail: 'https://i.pinimg.com/736x/59/ae/58/59ae58fdaec23d78a962889bb77599a7.jpg',
    date: '11/07/2025',
    slug: 'samsung-s24-vs-iphone',
  },
  {
    id: 3,
    title: 'Top 5 smartphone đáng mua nhất tháng 7',
    thumbnail: 'https://i.pinimg.com/736x/f4/94/9e/f4949e9df3db5c7f0e33c1a5e04652b0.jpg',
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
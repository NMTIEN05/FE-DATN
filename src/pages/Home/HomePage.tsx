import React from 'react';
import ProductGroupSection from './components/ProductGroupSection';
import FlashSaleSection from './components/PlashSale';
import BannerSection from './components/Banner';
import BlogSection from './components/Blog';
import ChatIcons from './components/Chat';
import CategoryWithProductGroups from './components/ProductGroupSection';

const HomePage: React.FC = () => {
  return (
    <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Banner */}
      <BannerSection />

      {/* Flash Sale */}
      <FlashSaleSection />

      {/* Dòng sản phẩm */}
      <CategoryWithProductGroups />

      {/* Blog */}
      <div className="pb-10">
        <BlogSection />
      </div>
      <ChatIcons/>
    </main>
  );
};

export default HomePage;

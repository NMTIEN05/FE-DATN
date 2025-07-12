import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatIcons: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3 z-50">
      {/* WhatsApp */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full shadow-md bg-white flex items-center justify-center hover:scale-110 transition"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2560px-WhatsApp.svg.png"
          alt="WhatsApp"
          className="w-7 h-7"
        />
      </a>

      {/* Messenger */}
      <a
        href="https://m.me/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full shadow-md bg-white flex items-center justify-center hover:scale-110 transition"
      >
        <img
          src="https://giaiphapzalo.com/wp-content/uploads/2021/10/logo-transperant.png"
          alt="Messenger"
          className="w-7 h-7"
        />
      </a>

      {/* Internal Chat / Contact */}
      <button
        onClick={() => navigate('/contact')}
        className="w-12 h-12 rounded-full shadow-md bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition"
      >
        <i className="bi bi-chat-dots text-xl"></i>
      </button>
    </div>
  );
};

export default ChatIcons;

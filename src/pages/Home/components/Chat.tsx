import React, { useState } from "react";
import { MessageCircle, X, Send, Phone, Mail, Clock } from "lucide-react";
import useChatLogic from "../../../hooks/useChatLogic";

const ChatIcons: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const {
    message,
    setMessage,
    conversation,
    loading,
    handleSend,
    handleKeyPress,
    messagesEndRef,
    marked,
    renderer,
  } = useChatLogic();

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setShowChat(!showChat)}
          className="w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white flex items-center justify-center hover:scale-105 transition-all duration-300 border-2 border-blue-500"
        >
          <MessageCircle size={24} className="drop-shadow-sm" />
        </button>

        {/* Status Indicator */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse">
          <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Chat Window */}
      {showChat && (
        <div className="fixed bottom-20 right-[6.5rem] w-[350px] h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                📱
              </div>
              <div>
                <span className="font-semibold text-lg">Tư vấn điện thoại</span>
                <div className="flex items-center text-xs text-blue-100 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Trực tuyến 24/7
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowChat(false)} 
              className="hover:bg-blue-500 p-2 rounded-lg transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-blue-50 border-b border-blue-100 p-3">
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs text-blue-600 hover:bg-blue-100 transition-colors">
                <Phone size={12} className="mr-1" />
                Gọi ngay
              </button>
              <button className="flex items-center px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs text-blue-600 hover:bg-blue-100 transition-colors">
                <Mail size={12} className="mr-1" />
                Email
              </button>
              <button className="flex items-center px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs text-blue-600 hover:bg-blue-100 transition-colors">
                <Clock size={12} className="mr-1" />
                Đặt lịch
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-4">
              {conversation.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-start ${msg.sender === "user" ? "max-w-[85%]" : "max-w-[90%]"}`}>
                    {msg.sender === "ai" && (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-3 mt-1 shadow-md">
                        AI
                      </div>
                    )}

                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-md shadow-lg"
                          : "bg-white text-gray-800 rounded-bl-md shadow-md border border-gray-200"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(msg.text || "", { renderer }),
                      }}
                    />

                    {msg.sender === "user" && (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs ml-3 mt-1 shadow-md">
                        U
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start max-w-[90%]">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-3 mt-1 shadow-md">
                      AI
                    </div>
                    <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-md border border-gray-200 px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-end space-x-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] max-h-24 bg-gray-50"
                disabled={loading}
                rows={1}
              />

              <button
                onClick={handleSend}
                disabled={!message.trim() || loading}
                className="w-11 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>

            <div className="text-xs text-gray-400 mt-2 text-center">
              Hỗ trợ kỹ thuật chuyên nghiệp • Bảo mật thông tin
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatIcons;

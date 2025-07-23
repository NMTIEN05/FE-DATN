// components/useChatLogic.ts
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { marked } from "marked";

export interface Message {
  sender: "user" | "ai";
  text: string;
}

const renderer = new marked.Renderer();
renderer.link = function ({ href, title = '', text }) {
  return `<a 
    href="${href}" 
    title="${title}" 
    target="_blank" 
    rel="noopener noreferrer"
    class="text-blue-600 underline hover:text-blue-800 transition"
  >${text}</a>`;
};

const useChatLogic = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Message[]>([
    {
      sender: "ai",
      text:
        "Xin chào! Tôi có thể giúp bạn tư vấn chọn điện thoại phù hợp. Bạn đang tìm kiếm loại điện thoại nào?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage: Message = { sender: "user", text: message };
    setConversation((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    const thinkingMessage: Message = { sender: "ai", text: "Đang tư vấn..." };
    setConversation((prev) => [...prev, thinkingMessage]);

    try {
      const res = await axios.post("http://localhost:8888/api/chat/tuvan", { message });
      const aiText = res.data.reply || "❌ Không có phản hồi từ GPT";
      console.log("✅ GPT reply:", aiText);

      const aiReply: Message = { sender: "ai", text: aiText };
      setConversation((prev) => {
        const conv = [...prev];
        conv[conv.length - 1] = aiReply;
        return conv;
      });
    } catch (err) {
      console.error("❌ GPT error:", err);
      setConversation((prev) => {
        const conv = [...prev];
        conv[conv.length - 1] = { sender: "ai", text: "❌ Có lỗi xảy ra. Vui lòng thử lại." };
        return conv;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return {
    message,
    setMessage,
    conversation,
    loading,
    handleSend,
    handleKeyPress,
    messagesEndRef,
    marked,
    renderer,
  };
};

export default useChatLogic;

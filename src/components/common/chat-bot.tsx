"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";

import {
  Send,
  X,
  User,
  MessageCircle,
  Heart,
  Activity,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { chatbotService } from "@/services/chatbot.service";

// Track component mounted state to avoid state updates after unmount
const useIsMounted = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  showOptions?: boolean;
  showDiagnosisConfirm?: boolean;
  showAppointmentConfirm?: boolean;
  showConsultationConfirm?: boolean;
}

interface ServiceOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}


export default function HealthChatBot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Xin chào! 🏥 Tôi là trợ lý sức khỏe thông minh của HealthSmart. Tôi có thể hỗ trợ bạn điều gì hôm nay?",
      isBot: true,
      timestamp: new Date(),
      showOptions: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isMounted = useIsMounted();

  const serviceOptions: ServiceOption[] = [
    {
      id: "diagnosis",
      label: "🔬 Chuẩn đoán qua chỉ số sức khỏe",
      icon: <Activity size={16} />,
      color: "bg-emerald-500",
    },
    {
      id: "appointment",
      label: "📅 Đặt lịch khám bệnh",
      icon: <Stethoscope size={16} />,
      color: "bg-blue-500",
    },
    {
      id: "consultation",
      label: "💬 Tư vấn sức khỏe",
      icon: <Heart size={16} />,
      color: "bg-pink-500",
    },
    {
      id: "general",
      label: "❓ Câu hỏi chung",
      icon: <MessageCircle size={16} />,
      color: "bg-orange-500",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const data = await chatbotService.sendMessage(inputMessage);
      const botResponse: Message = {
        id: messages.length + 2,
        text:
          data.response ||
          "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev: Message[]) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message to chatbot API:", error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Có lỗi xảy ra khi kết nối với máy chủ. Vui lòng thử lại sau.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDiagnosisConfirm = () => {
    router.push("/diagnosis");
  };

  const handleAppointmentConfirm = () => {
    router.push("/booking");
  };

  const handleConsultationConfirm = () => {
    router.push("/doctors");
  };

  const handleServiceOption = async (optionId: string) => {
    const option = serviceOptions.find((opt) => opt.id === optionId);
    if (!option) return;

    // Hide options and add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: option.label,
      isBot: false,
      timestamp: new Date(),
    };

    const updatedMessages = messages.map((msg) =>
      msg.showOptions ? { ...msg, showOptions: false } : msg,
    );

    setMessages([...updatedMessages, userMessage]);
    setIsTyping(true);

    // Bot responds with a confirmation/prompt after a short delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isMounted.current) {
      let botResponse: Message | null = null;
      const botMessageId = messages.length + 2;

      switch (optionId) {
        case "diagnosis":
          botResponse = {
            id: botMessageId,
            text: "Để chẩn đoán bệnh, chúng tôi cần bạn cung cấp một số chỉ số sức khỏe. Bạn có muốn chuyển đến trang chẩn đoán không?",
            isBot: true,
            timestamp: new Date(),
            showDiagnosisConfirm: true,
          };
          break;
        case "appointment":
          botResponse = {
            id: botMessageId,
            text: "Để đặt lịch khám, bạn sẽ được chuyển đến trang đặt lịch. Bạn có đồng ý không?",
            isBot: true,
            timestamp: new Date(),
            showAppointmentConfirm: true,
          };
          break;
        case "consultation":
          botResponse = {
            id: botMessageId,
            text: "Để được tư vấn sức khỏe, bạn có thể tìm và chọn một bác sĩ phù hợp. Bạn có muốn xem danh sách bác sĩ không?",
            isBot: true,
            timestamp: new Date(),
            showConsultationConfirm: true,
          };
          break;
        case "general":
          botResponse = {
            id: botMessageId,
            text: "Vui lòng nhập câu hỏi chung của bạn vào ô bên dưới. Tôi sẽ cố gắng trả lời.",
            isBot: true,
            timestamp: new Date(),
          };
          break;
      }

      if (botResponse && isMounted.current) {
        setMessages((prev) => [...prev, botResponse!]);
      }
      if (isMounted.current) {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) =>
    timestamp.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(true)}
            className="group bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <MessageCircle size={28} />
          </button>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">1</span>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-96 h-[32rem] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Heart size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Trợ lý sức khỏe</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-xs text-emerald-100">
                    Sẵn sàng hỗ trợ
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-green-50/30 to-white">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex ${
                      message.isBot ? "justify-start" : "justify-end"
                    } mb-2`}
                  >
                    <div
                      className={`flex items-end space-x-2 max-w-xs ${
                        message.isBot
                          ? "flex-row"
                          : "flex-row-reverse space-x-reverse"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.isBot
                            ? "bg-gradient-to-r from-emerald-500 to-green-600"
                            : "bg-gradient-to-r from-gray-400 to-gray-600"
                        }`}
                      >
                        {message.isBot ? (
                          <Heart size={16} className="text-white" />
                        ) : (
                          <User size={16} className="text-white" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-sm ${
                          message.isBot
                            ? "bg-white border border-green-100 text-gray-800 rounded-tl-md"
                            : "bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-tr-md"
                        }`}
                      >
                        <ReactMarkdown className="text-sm leading-relaxed prose prose-sm max-w-none">
                          {message.text}
                        </ReactMarkdown>
                        <div
                          className={`text-xs mt-1 ${
                            message.isBot ? "text-gray-400" : "text-green-100"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Options */}
                  {message.showOptions && (
                    <div className="ml-10 mt-3 space-y-2">
                      <p className="text-xs text-gray-500 font-medium">
                        Chọn dịch vụ bạn cần hỗ trợ:
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {serviceOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleServiceOption(option.id)}
                            className="text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-md hover:bg-emerald-50 transition-all duration-200 group flex items-center space-x-2"
                          >
                            <span className="text-emerald-600">
                              {option.icon}
                            </span>
                            <span className="text-sm text-gray-700 group-hover:text-emerald-600 transition-colors">
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {message.showDiagnosisConfirm && (
                    <div className="ml-10 mt-3">
                      <button
                        onClick={handleDiagnosisConfirm}
                        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-md"
                      >
                        <span>Đồng ý, đi đến trang chuẩn đoán</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  )}

                  {message.showAppointmentConfirm && (
                    <div className="ml-10 mt-3">
                      <button
                        onClick={handleAppointmentConfirm}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-md"
                      >
                        <span>Đồng ý, đến trang đặt lịch</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  )}

                  {message.showConsultationConfirm && (
                    <div className="ml-10 mt-3">
                      <button
                        onClick={handleConsultationConfirm}
                        className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-md"
                      >
                        <span>Xem danh sách bác sĩ</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start mb-2">
                  <div className="flex items-end space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
                      <Heart size={16} className="text-white" />
                    </div>
                    <div className="bg-white border border-green-100 px-4 py-3 rounded-2xl rounded-tl-md shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập câu hỏi về sức khỏe..."
                  className="w-full bg-green-50 border-0 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all duration-200"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white p-3 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-center">
              Nhấn Enter để gửi tin nhắn
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



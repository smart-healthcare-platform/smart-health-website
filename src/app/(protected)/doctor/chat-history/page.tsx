'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from '@/hooks/useSocket';
import { RootState, AppDispatch } from '@/redux';
import {
  fetchConversations,
  fetchMessages,
  addMessage, // Changed from sendMessage
  setSelectedConversationId // Changed from selectConversation
} from '@/redux/slices/chatSlice';
import { GetMessagesParams } from '@/services/chat.service';
import { Message } from '@/types/socket'; // Import Message type from '@/types/socket'

// Define types locally to match chatSlice and chat.service
interface Participant {
  id: string;
  userId: string; // Thêm trường userId
  fullName: string; // Trường được trả về từ API của chat service
  role: string; // Changed to string to match chatSlice and chat.service
}

interface LastMessage {
  content: string;
  createdAt: string;
  senderId: string;
}

interface Conversation {
  id: string;
  participants: Participant[]; // Sử dụng Participant đã cập nhật
 lastMessage?: LastMessage;
  unreadCount: number; // Added unreadCount to match chatSlice
}

const DoctorChatHistoryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, selectedConversationId, messages, loading, error } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth); // Get user from auth slice
  const [messageInput, setMessageInput] = useState('');
 const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations when component mounts
  useEffect(() => {
    if (user?.id) { // Use the actual doctor's ID
      dispatch(fetchConversations()); // Called without userId
    }
  }, [dispatch, user?.id]); // Add user.id to dependency array


  // Handle receiving messages
  useEffect(() => {
    if (socket && selectedConversationId) {
      const handleReceiveMessage = (message: Message) => {
        // Update Redux state with the new message
        dispatch(addMessage({ conversationId: selectedConversationId, message })); // Changed to addMessage
      };

      if (socket.socket) {
        socket.onMessage('receiveMessage', handleReceiveMessage);
      }

      // Scroll to bottom when new message is received
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }

      return () => {
        if (socket.socket) {
          socket.offMessage('receiveMessage', handleReceiveMessage);
        }
      };
    }
  }, [socket, selectedConversationId, dispatch, messages]);

  // Debug: Log conversations when they change
  useEffect(() => {
    console.log("[Doctor Chat History] Fetched conversations:", conversations);
    if (conversations && user?.id) {
      conversations.forEach(conv => {
        const otherParticipant = conv.participants?.find((p: Participant) => p.userId !== user?.id);
        console.log(`[Doctor Chat History] Conversation ${conv.id} - Other participant:`, otherParticipant);
      });
    }
  }, [conversations, user?.id]);

  // Handle selecting a conversation
  const handleSelectConversation = (conversationId: string) => {
    dispatch(setSelectedConversationId(conversationId)); // Changed to setSelectedConversationId
    // Fetch messages for the selected conversation
    dispatch(fetchMessages({ conversationId } as GetMessagesParams));
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (messageInput.trim() === '' || !selectedConversationId || !socket || !user?.id) return; // Add user?.id check

    const newMessage: Message = { // Explicitly type newMessage as Message
      id: `temp-${Date.now().toString()}`, // Temporary ID with prefix
      conversationId: selectedConversationId,
      senderId: user.id, // Get from auth context
      content: messageInput,
      contentType: 'text', // Ensure contentType is 'text'
      createdAt: new Date().toISOString(),
      isRead: false
    };

    // Optimistically update UI
    dispatch(addMessage({ conversationId: selectedConversationId, message: newMessage })); // Changed to addMessage
    setMessageInput('');

    // Find the other participant in the conversation to determine recipient
    const currentConversation = conversations.find((c: Conversation) => c.id === selectedConversationId);
    const recipient = currentConversation?.participants.find((p: Participant) => p.userId !== user.id); // Compare with user.id
    const recipientId = recipient ? recipient.id : '';

    // Send via Socket.IO
    if (socket.socket) {
      socket.sendMessage('sendMessage', {
        conversationId: selectedConversationId,
        content: messageInput,
        contentType: 'text',
        recipientId: recipientId
      });
    }
  };

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversations List - Left Column */}
      <div className="w-1/3 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-xl font-semibold">Danh sách trò chuyện</h2>
        </div>
        
        {loading && <div className="p-4 text-center text-gray-500">Đang tải...</div>}
        {error && <div className="p-4 text-center text-red-50">Lỗi: {error}</div>}
        
        <div className="flex-1 overflow-y-auto">
          {conversations && conversations.map((conversation: Conversation) => {
            const isActive = conversation.id === selectedConversationId;
            const otherParticipant = conversation.participants?.find((p: Participant) => p.userId !== user?.id);
            const displayName = otherParticipant ? otherParticipant.fullName : 'Unknown';
            const lastMessageContent = conversation.lastMessage?.content || 'Không có tin nhắn';

            return (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  isActive ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <div className="font-medium">{displayName}</div>
                <div className="text-sm text-gray-600 truncate">{lastMessageContent}</div>
                {conversation.unreadCount > 0 && (
                  <div className="inline-block mt-1 text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Window - Right Column */}
      <div className="w-2/3 flex flex-col">
        {selectedConversationId ? (
          <>
            <div className="p-4 bg-white border-b border-gray-300">
              <h2 className="text-xl font-semibold">{conversations.find((c: Conversation) => c.id === selectedConversationId)?.participants?.find((p: Participant) => p.userId !== user?.id)?.fullName || 'Unknown'}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {loading && selectedConversationId ? <div>Đang tải tin nhắn...</div> : (
                <div className="space-y-2">
                  {messages[selectedConversationId]?.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg: Message) => {
                    const sender = conversations.find((c: Conversation) => c.id === selectedConversationId)
                                    ?.participants?.find((p: Participant) => p.userId === msg.senderId);
                    const isCurrentUser = msg.senderId === user?.id;
                    // Use the logged-in user's name from auth store if it's the current user, otherwise use name from conversation
                    const senderName = isCurrentUser ? user?.username || 'Bạn' : (sender ? sender.fullName : 'Unknown');

                    return (
                      <div
                        key={msg.id}
                        className={`mb-4 p-3 rounded-lg ${
                          isCurrentUser
                            ? 'bg-blue-500 text-white ml-auto max-w-[70%]'
                            : 'bg-gray-200 text-gray-800 mr-auto max-w-[70%]'
                        }`}
                      >
                        <div className={`text-xs font-semibold mb-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-600'}`}>
                          {isCurrentUser ? 'Bạn' : senderName}
                        </div>
                        <div>{msg.content}</div>
                        <div className="text-xs mt-1 opacity-70">
                          {new Date(msg.createdAt).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white border-t border-gray-300">
              <div className="flex">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Gửi
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChatHistoryPage;
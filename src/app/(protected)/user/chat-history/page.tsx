'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux'; // Import AppDispatch
import {
  fetchConversations,
  fetchMessages,
  addMessage,
  setSelectedConversationId,
} from '@/redux/slices/chatSlice';
import { Message } from '@/types/socket';
import { useSocket } from '@/hooks/useSocket';
 
// Define types to match chatSlice and chat.service
interface Participant {
  id: string;
  name: string;
  role: string;
}
 
interface LastMessage {
  content: string;
  createdAt: string;
  senderId: string;
}
 
interface Conversation {
  id: string;
  participants: Participant[];
  lastMessage?: LastMessage;
  unreadCount: number;
}
 
const ChatHistoryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch
  const { user } = useSelector((state: RootState) => state.auth);
  const { conversations, selectedConversationId, messages, loading, error } = useSelector((state: RootState) => state.chat); // Access loading and error
  const { isConnected, onMessage, sendMessage } = useSocket();
 
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
 
  // Fetch conversations on component mount or when user changes
  useEffect(() => {
    if (user?.referenceId) {
      dispatch(fetchConversations()); // Call without userId
    }
  }, [dispatch, user?.referenceId]);
 
  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      dispatch(fetchMessages({ conversationId: selectedConversationId })); // Use async thunk
    }
  }, [dispatch, selectedConversationId]);
 
  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedConversationId]);
 
  // Listen for incoming messages via Socket.IO
  useEffect(() => {
    if (isConnected) {
      onMessage('receiveMessage', (message: Message) => {
        dispatch(addMessage({ conversationId: message.conversationId, message }));
      });
    }
  }, [isConnected, onMessage, dispatch]);
 
  const handleConversationSelect = (conversationId: string) => {
    dispatch(setSelectedConversationId(conversationId));
  };
 
  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !selectedConversationId || !user?.referenceId) return;
 
    const messageData: Message = { // Explicitly type messageData as Message
      id: Date.now().toString(), // Temporary ID
      conversationId: selectedConversationId,
      senderId: user.referenceId,
      content: newMessage,
      contentType: 'text',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
 
    // Optimistically update UI
    dispatch(addMessage({ conversationId: selectedConversationId, message: messageData }));
    setNewMessage('');
 
    // Find the other participant's ID
    const currentConversation = conversations.find((c: Conversation) => c.id === selectedConversationId);
    let recipientId = '';
    if (currentConversation) {
      const otherParticipant = currentConversation.participants?.find((p: Participant) => p.id !== user?.referenceId);
      if (otherParticipant) {
        recipientId = otherParticipant.id;
      }
    }
 
    sendMessage('sendMessage', {
      conversationId: selectedConversationId,
      content: newMessage,
      contentType: 'text',
      recipientId: recipientId,
    });
  };
 
  // Find the name of the other participant in the selected conversation
  const getOtherParticipantName = () => {
    if (!selectedConversationId) return '';
    const conversation = conversations.find((c: Conversation) => c.id === selectedConversationId);
    if (conversation) {
      const otherParticipant = conversation.participants?.find((p: Participant) => p.id !== user?.referenceId);
      return otherParticipant ? otherParticipant.name : '';
    }
    return '';
  };
 
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversation List (Left Column) */}
      <div className="w-1/3 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-xl font-semibold">Danh sách trò chuyện</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading && <div className="p-4 text-center text-gray-500">Đang tải...</div>}
          {error && <div className="p-4 text-center text-red-500">Lỗi: {error}</div>}
          {conversations && conversations.map((conversation: Conversation) => {
            const isActive = conversation.id === selectedConversationId;
            const otherParticipant = conversation.participants?.find((p: Participant) => p.id !== user?.referenceId);
            const displayName = otherParticipant ? otherParticipant.name : 'Unknown';
            const lastMessageContent = conversation.lastMessage?.content || 'Không có tin nhắn';
 
            return (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  isActive ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleConversationSelect(conversation.id)}
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
 
      {/* Chat Window (Right Column) */}
      <div className="w-2/3 flex flex-col">
        {selectedConversationId ? (
          <>
            <div className="p-4 bg-white border-b border-gray-300">
              <h2 className="text-xl font-semibold">{getOtherParticipantName()}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {loading && selectedConversationId ? <div>Đang tải tin nhắn...</div> : (
                <div className="space-y-2">
                  {messages[selectedConversationId]?.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg: Message) => {
                    const sender = conversations.find((c: Conversation) => c.id === selectedConversationId)
                                    ?.participants?.find((p: Participant) => p.id === msg.senderId);
                    const senderName = sender ? sender.name : 'Unknown';
                    const isCurrentUser = msg.senderId === user?.referenceId;

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
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
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
 
export default ChatHistoryPage;
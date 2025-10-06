'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from '@/hooks/useSocket';
import { RootState, AppDispatch } from '@/redux';
import { 
  fetchConversations, 
  fetchMessages, 
  addMessage, // Changed from sendMessage
  setSelectedConversationId, // Changed from selectConversation
  clearError 
} from '@/redux/slices/chatSlice';
import { GetMessagesParams } from '@/services/chat.service';
import { Message } from '@/types/socket'; // Import Message type from '@/types/socket'

// Define types locally to match chatSlice and chat.service
interface Participant {
  id: string;
  name: string;
  role: string; // Changed to string to match chatSlice and chat.service
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
  unreadCount: number; // Added unreadCount to match chatSlice
}

const DoctorChatHistoryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, selectedConversationId, messages, loading, error } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth); // Get user from auth slice
  const [messageInput, setMessageInput] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations when component mounts
  useEffect(() => {
    if (user?.referenceId) { // Use the actual doctor's ID
      dispatch(fetchConversations()); // Called without userId
    }
  }, [dispatch, user?.referenceId]); // Add user.referenceId to dependency array

  // Handle Socket.IO connection status
  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        setConnectionStatus('connected');
        // Clear any previous connection errors
        if (error && error.includes('Socket')) {
          dispatch(clearError());
        }
      };
      const handleDisconnect = () => setConnectionStatus('disconnected');
      const handleConnectError = (err: Error) => {
        setConnectionStatus('disconnected');
        console.error('Socket connection error:', err);
        // Dispatch a specific error to Redux store
        // dispatch(setError('Socket connection error: ' + err.message));
      };

      if (socket.socket) {
        socket.socket.on('connect', handleConnect);
        socket.socket.on('disconnect', handleDisconnect);
        socket.socket.on('connect_error', handleConnectError);
      }

      return () => {
        if (socket.socket) {
          socket.socket.off('connect', handleConnect);
          socket.socket.off('disconnect', handleDisconnect);
          socket.socket.off('connect_error', handleConnectError);
        }
      };
    }
  }, [socket, error, dispatch]);

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

  // Handle selecting a conversation
  const handleSelectConversation = (conversationId: string) => {
    dispatch(setSelectedConversationId(conversationId)); // Changed to setSelectedConversationId
    // Fetch messages for the selected conversation
    dispatch(fetchMessages({ conversationId } as GetMessagesParams));
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (messageInput.trim() === '' || !selectedConversationId || !socket || !user?.referenceId) return; // Add user?.referenceId check

    const newMessage: Message = { // Explicitly type newMessage as Message
      id: Date.now().toString(), // Temporary ID
      conversationId: selectedConversationId,
      senderId: user.referenceId, // Get from auth context
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
    const recipient = currentConversation?.participants.find((p: Participant) => p.id !== user.referenceId); // Compare with user.referenceId
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
    <div className="flex h-screen bg-gray-50">
      {/* Conversations List - Left Column */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Lịch sử Chat</h2>
          <div className="mt-2 text-sm text-gray-600">
            Trạng thái kết nối: <span className={connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}>
              {connectionStatus}
            </span>
          </div>
        </div>
        
        {loading && <div className="p-4 text-center text-gray-500">Đang tải...</div>}
        {error && <div className="p-4 text-center text-red-50">Lỗi: {error}</div>}
        
        <div className="overflow-y-auto flex-grow">
          {conversations && conversations.map((conv: Conversation) => (
            <div
              key={conv.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversationId === conv.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelectConversation(conv.id)}
            >
              <div className="font-medium text-gray-900">
                {conv.participants?.find((p: Participant) => p.role === 'patient')?.name || 'Bệnh nhân'}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {conv.lastMessage?.content || 'Chưa có tin nhắn'}
              </div>
              {conv.unreadCount > 0 && (
                <div className="inline-block mt-1 text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                  {conv.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window - Right Column */}
      <div className="w-2/3 flex flex-col">
        {selectedConversationId ? (
          <>
            <div className="p-4 bg-white border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {conversations.find((c: Conversation) => c.id === selectedConversationId)?.participants?.find((p: Participant) => p.role === 'patient')?.name || 'Bệnh nhân'}
              </h3>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
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
                        className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
                          isCurrentUser
                            ? 'bg-blue-500 text-white ml-auto'
                            : 'bg-white border-gray-200 mr-auto'
                        }`}
                      >
                        <div className={`text-xs font-semibold mb-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-600'}`}>
                          {isCurrentUser ? 'Bạn' : senderName}
                        </div>
                        {msg.content}
                        <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-grow border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Gửi
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center bg-gray-10">
            <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChatHistoryPage;
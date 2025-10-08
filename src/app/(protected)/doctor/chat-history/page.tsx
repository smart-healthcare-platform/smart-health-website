'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from '@/hooks/useSocket';
import { RootState, AppDispatch } from '@/redux';
import {
  fetchConversations,
  fetchMessages,
  addMessage,
  setSelectedConversationId
} from '@/redux/slices/chatSlice';
import { GetMessagesParams } from '@/services/chat.service';
import { Message } from '@/types/socket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MessageCircle,
  Search,
  Send,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react';

// Define types locally to match chatSlice and chat.service
interface Participant {
  id: string;
  userId?: string;
  fullName: string;
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

const DoctorChatHistoryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, selectedConversationId, messages, loading, error } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const [messageInput, setMessageInput] = useState('');
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchConversations());
    }
  }, [dispatch, user?.id]);

  // Handle receiving messages
  useEffect(() => {
    if (socket && selectedConversationId) {
      const handleReceiveMessage = (message: Message) => {
        dispatch(addMessage({ conversationId: selectedConversationId, message }));
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
        const otherParticipant = conv.participants?.find((p: Participant) => p.userId && p.userId !== user?.id);
        console.log(`[Doctor Chat History] Conversation ${conv.id} - Other participant:`, otherParticipant);
      });
    }
  }, [conversations, user?.id]);

  // Handle selecting a conversation
  const handleSelectConversation = (conversationId: string) => {
    dispatch(setSelectedConversationId(conversationId));
    dispatch(fetchMessages({ conversationId } as GetMessagesParams));
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (messageInput.trim() === '' || !selectedConversationId || !socket || !user?.id) return;

    const newMessage: Message = {
      id: `temp-${Date.now().toString()}`,
      conversationId: selectedConversationId,
      senderId: user.id,
      content: messageInput,
      contentType: 'text',
      createdAt: new Date().toISOString(),
      isRead: false
    };

    // Optimistically update UI
    dispatch(addMessage({ conversationId: selectedConversationId, message: newMessage }));
    setMessageInput('');

    // Find the other participant in the conversation to determine recipient
    const currentConversation = conversations.find((c: Conversation) => c.id === selectedConversationId);
    const recipient = currentConversation?.participants.find((p: Participant) => p.userId && p.userId !== user.id);
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Conversations List - Left Column */}
      <div className="w-1/3 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Danh sách trò chuyện
          </h2>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm cuộc trò chuyện..."
              className="pl-10 bg-muted border-0"
            />
          </div>
        </div>
        
        {loading && (
          <div className="p-4 text-center text-muted-foreground">Đang tải...</div>
        )}
        {error && (
          <div className="p-4 text-center text-destructive">Lỗi: {error}</div>
        )}
        
        <div className="flex-1 overflow-y-auto">
          {conversations && conversations.map((conversation: Conversation) => {
            const isActive = conversation.id === selectedConversationId;
            const otherParticipant = conversation.participants?.find((p: Participant) => p.userId && p.userId !== user?.id);
            const displayName = otherParticipant ? otherParticipant.fullName : 'Unknown';
            const lastMessageContent = conversation.lastMessage?.content || 'Không có tin nhắn';

            return (
              <div
                key={conversation.id}
                className={`p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors ${
                  isActive ? 'bg-accent' : ''
                }`}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/avatars/user.png" alt={displayName} />
                    <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{displayName}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {lastMessageContent}
                    </div>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <Badge className="ml-2">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Window - Right Column */}
      <div className="w-2/3 flex flex-col">
        {selectedConversationId ? (
          <>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="/avatars/user.png"
                    alt={conversations.find((c: Conversation) => c.id === selectedConversationId)?.participants?.find((p: Participant) => p.userId && p.userId !== user?.id)?.fullName || 'User'}
                  />
                  <AvatarFallback>
                    {conversations.find((c: Conversation) => c.id === selectedConversationId)?.participants?.find((p: Participant) => p.userId && p.userId !== user?.id)?.fullName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">
                    {conversations.find((c: Conversation) => c.id === selectedConversationId)?.participants?.find((p: Participant) => p.userId && p.userId !== user?.id)?.fullName || 'Unknown'}
                  </h2>
                  <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-4 bg-muted/10">
              <div className="space-y-4">
                {messages[selectedConversationId]?.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg: Message) => {
                  const sender = conversations.find((c: Conversation) => c.id === selectedConversationId)
                                  ?.participants?.find((p: Participant) => p.userId && p.userId === msg.senderId);
                  const isCurrentUser = msg.senderId === user?.id;
                  const senderName = isCurrentUser ? user?.profile?.fullName || 'Bạn' : (sender ? sender.fullName : 'Unknown');

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isCurrentUser && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src="/avatars/user.png" alt={senderName} />
                          <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`max-w-[70%] ${isCurrentUser ? 'order-1' : ''}`}>
                        <div className={`p-3 rounded-2xl ${
                          isCurrentUser
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-card text-foreground rounded-bl-md'
                        }`}>
                          <div className="text-sm">{msg.content}</div>
                        </div>
                        <div className={`text-xs mt-1 text-muted-foreground ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {isCurrentUser && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src="/avatars/doctor.png" alt={senderName} />
                          <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-border bg-background">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/10">
            <div className="text-center max-w-md">
              <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chọn một cuộc trò chuyện</h3>
              <p className="text-muted-foreground">
                Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu trao đổi với bệnh nhân.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChatHistoryPage;
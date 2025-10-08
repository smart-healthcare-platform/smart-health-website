'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux';
import {
  fetchConversations,
  fetchMessages,
  addMessage,
  setSelectedConversationId,
} from '@/redux/slices/chatSlice';
import { Message } from '@/types/socket';
import { useSocket } from '@/hooks/useSocket';
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

// Define types to match chatSlice and chat.service
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

const ChatHistoryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { conversations, selectedConversationId, messages, loading, error } = useSelector((state: RootState) => state.chat);
  const { isConnected, onMessage, sendMessage } = useSocket();

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations on component mount or when user changes
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchConversations());
    }
  }, [dispatch, user?.id]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      dispatch(fetchMessages({ conversationId: selectedConversationId }));
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

  // Debug: Log conversations when they change
  useEffect(() => {
    console.log("[User Chat History] Fetched conversations:", conversations);
    if (conversations && user?.id) {
      conversations.forEach(conv => {
        const otherParticipant = conv.participants?.find((p: Participant) => p.userId && p.userId !== user?.id);
        console.log(`[User Chat History] Conversation ${conv.id} - Other participant:`, otherParticipant);
      });
    }
 }, [conversations, user?.id]);

  const handleConversationSelect = (conversationId: string) => {
    dispatch(setSelectedConversationId(conversationId));
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !selectedConversationId || !user?.id) return;

    const messageData: Message = {
      id: `temp-${Date.now().toString()}`,
      conversationId: selectedConversationId,
      senderId: user.id,
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
      const otherParticipant = currentConversation.participants?.find((p: Participant) => p.userId && p.userId !== user?.id);
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
      const otherParticipant = conversation.participants?.find((p: Participant) => p.userId && p.userId !== user?.id);
      return otherParticipant ? otherParticipant.fullName : '';
    }
    return '';
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Conversation List (Left Column) */}
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
        <div className="flex-1 overflow-y-auto">
          {loading && <div className="p-4 text-center text-muted-foreground">Đang tải...</div>}
          {error && <div className="p-4 text-center text-destructive">Lỗi: {error}</div>}
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
                onClick={() => handleConversationSelect(conversation.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/avatars/doctor.png" alt={displayName} />
                    <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{displayName}</div>
                    <div className="text-sm text-muted-foreground truncate">{lastMessageContent}</div>
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

      {/* Chat Window (Right Column) */}
      <div className="w-2/3 flex flex-col">
        {selectedConversationId ? (
          <>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src="/avatars/doctor.png" 
                    alt={getOtherParticipantName()} 
                  />
                  <AvatarFallback>
                    {getOtherParticipantName()?.charAt(0) || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{getOtherParticipantName()}</h2>
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

                  return isCurrentUser ? (
                    <div key={msg.id} className="flex gap-3 justify-end">
                      <div className="max-w-[70%] order-1">
                        <div className="p-3 rounded-2xl bg-primary text-primary-foreground rounded-br-md">
                          <div className="text-sm">{msg.content}</div>
                        </div>
                        <div className="text-xs mt-1 text-muted-foreground text-right">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src="/avatars/user.png" alt={senderName} />
                        <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex gap-3 justify-start">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src="/avatars/doctor.png" alt={senderName} />
                        <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="max-w-[70%]">
                        <div className="p-3 rounded-2xl bg-card text-foreground rounded-bl-md">
                          <div className="text-sm">{msg.content}</div>
                        </div>
                        <div className="text-xs mt-1 text-muted-foreground text-left">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
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
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
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
                Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu trao đổi với bác sĩ.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryPage;
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from '@/hooks/useSocket';
import { RootState, AppDispatch } from '@/redux';
import {
  fetchConversations,
  fetchMessages,
  addMessage,
  setSelectedConversationId,
  fetchMoreMessages
} from '@/redux/slices/chatSlice';
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
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

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

interface ChatInterfaceProps {
    currentUserRole: 'doctor' | 'user';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUserRole }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, selectedConversationId, messages, loading, error } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const [messageInput, setMessageInput] = useState('');
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

      return () => {
        if (socket.socket) {
          socket.offMessage('receiveMessage', handleReceiveMessage);
        }
      };
    }
  }, [socket, selectedConversationId, dispatch]);

  // Handle selecting a conversation
  const handleSelectConversation = (conversationId: string) => {
    dispatch(setSelectedConversationId(conversationId));
    dispatch(fetchMessages({ conversationId }));
  };


  // Smart scroll to bottom
  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    const scrollViewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollViewport) {
      // Fallback for initial render or if viewport not found
      setTimeout(() => scrollToBottom('auto'), 0);
      return;
    }

    // Check if user is near the bottom. Increased buffer to 100 for reliability.
    const isNearBottom = scrollViewport.scrollHeight - scrollViewport.scrollTop <= scrollViewport.clientHeight + 100;

    if (isNearBottom) {
      // Use a timeout to ensure the DOM has updated with the new message before scrolling
      setTimeout(() => scrollToBottom('smooth'), 0);
    }
  }, [messages, selectedConversationId]);

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
    // Scroll to bottom after sending a message to ensure it's visible
    setTimeout(() => scrollToBottom('smooth'), 0);

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAvatarForParticipant = (participant: Participant | undefined) => {
    if (!participant) return "/avatars/user.png";
    return participant.role === 'doctor' ? "/avatars/doctor.png" : "/avatars/user.png";
  };

  const getMyAvatar = () => {
    return currentUserRole === 'doctor' ? "/avatars/doctor.png" : "/avatars/user.png";
  }

  const otherParticipant = conversations.find((c: Conversation) => c.id === selectedConversationId)?.participants?.find((p: Participant) => p.userId && p.userId !== user?.id);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden">
      {/* Conversations List - Left Column */}
      <div className="w-1/3 border-r border-border flex flex-col overflow-hidden">
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
        
        {error && (
          <div className="p-4 text-center text-destructive">Lỗi: {error}</div>
        )}
        
        <ScrollArea className="flex-1">
          {loading && !conversations.length ? (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </div>
          ) : (
            conversations.map((conversation: Conversation) => {
              const isActive = conversation.id === selectedConversationId;
              const otherUser = conversation.participants?.find((p: Participant) => p.userId && p.userId !== user?.id);
              const displayName = otherUser ? otherUser.fullName : 'Unknown';
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
                      <AvatarImage src={getAvatarForParticipant(otherUser)} alt={displayName} />
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
            })
          )}
        </ScrollArea>
      </div>

      {/* Chat Window - Right Column */}
      <div className="w-2/3 flex flex-col overflow-hidden">
        {selectedConversationId ? (
          <>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={getAvatarForParticipant(otherParticipant)}
                    alt={otherParticipant?.fullName || 'User'}
                  />
                  <AvatarFallback>
                    {otherParticipant?.fullName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">
                    {otherParticipant?.fullName || 'Unknown'}
                  </h2>
                  <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 bg-muted/10 min-h-0" onScroll={(e) => {
                const target = e.target as HTMLDivElement;
                if (target.scrollTop === 0 && selectedConversationId && messages[selectedConversationId]?.hasMore && !messages[selectedConversationId]?.isLoadingMore) {
                    dispatch(fetchMoreMessages({ conversationId: selectedConversationId, page: messages[selectedConversationId].page + 1 }));
                }
            }}>
              <div className="space-y-4">
                {selectedConversationId && messages[selectedConversationId]?.isLoadingMore && (
                    <div className="flex justify-center items-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {loading && !messages[selectedConversationId] ? (
                  <div className="space-y-4">
                     <div className="flex gap-3 justify-start">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-10 w-48" />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                ) : (
                    messages[selectedConversationId]?.data.map((msg: Message) => {
                    const isCurrentUser = msg.senderId === user?.id;
                    const senderName = isCurrentUser ? (user?.profile?.fullName || 'Bạn') : (otherParticipant?.fullName || 'Unknown');

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isCurrentUser && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={getAvatarForParticipant(otherParticipant)} alt={senderName} />
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
                            <AvatarImage src={getMyAvatar()} alt={senderName} />
                            <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })
                )}
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
                Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu trao đổi.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;



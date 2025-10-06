import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Message } from '@/types/socket';
import { getConversations, getMessages, GetMessagesParams } from '@/services/chat.service';
 
interface ChatState {
  conversations: {
    id: string;
    participants: { id: string; name: string; role: string }[]; // Simplified participant structure
    lastMessage?: {
      content: string;
      createdAt: string;
      senderId: string;
    };
    unreadCount: number; // Add unreadCount to Conversation type
  }[];
  selectedConversationId: string | null;
  messages: Record<string, Message[]>; // Keyed by conversationId
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  unreadCounts: Record<string, number>; // Keyed by conversationId
  loading: boolean; // Add loading state
  error: string | null; // Add error state
}
 
const initialState: ChatState = {
  conversations: [],
  selectedConversationId: null,
  messages: {},
  connectionStatus: 'disconnected',
  unreadCounts: {},
  loading: false,
  error: null,
};
 
// Async Thunk for fetching conversations
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => { // Removed params: GetConversationsParams
    try {
      const response = await getConversations(); // Called without params
      // Ensure response is an array before mapping, default to empty array if null/undefined
      const conversationsData = response || [];
      return conversationsData.map(conv => ({ ...conv, unreadCount: 0, participants: conv.participants || [] })); // Initialize unreadCount and participants
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);
 
// Async Thunk for fetching messages
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (params: GetMessagesParams, { rejectWithValue }) => {
    try {
      const response = await getMessages(params);
      return { conversationId: params.conversationId, messages: response };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);
 
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<ChatState['conversations']>) => {
      state.conversations = action.payload;
    },
    setSelectedConversationId: (state, action: PayloadAction<string | null>) => {
      state.selectedConversationId = action.payload;
      if (action.payload) {
        state.unreadCounts[action.payload] = 0;
      }
    },
    setMessages: (state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) => {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Message }>) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }

      // Check if the message is an optimistic update (has a temp ID) by looking for a temp message with the same ID
      const existingMessageIndex = state.messages[conversationId].findIndex(
        (msg) => msg.id === message.id
      );

      if (existingMessageIndex !== -1) {
        // If a message with the exact same ID exists, update it (e.g., server confirms with same ID or updates it)
        state.messages[conversationId][existingMessageIndex] = message;
      } else {
        // Check if this new message (not a temp message itself) might be a server confirmation/update for a *previously sent* temp message
        // We look for a temp message in the same conversation with the same senderId and content (and roughly the same time)
        if (!message.id.startsWith('temp-')) { // Only try to match non-temp incoming messages against temp outgoing ones
          const matchingTempMessageIndex = state.messages[conversationId].findIndex(msg =>
            msg.id.startsWith('temp-') &&
            msg.senderId === message.senderId &&
            msg.content === message.content &&
            // Optionally check timestamp proximity, e.g., within 10 seconds
            Math.abs(new Date(msg.createdAt).getTime() - new Date(message.createdAt).getTime()) < 10000
          );

          if (matchingTempMessageIndex !== -1) {
            // Replace the optimistic temp message with the confirmed server message
            state.messages[conversationId][matchingTempMessageIndex] = message;
          } else {
            // Add the new message (it's not a duplicate of a temp message)
            state.messages[conversationId].push(message);
          }
        } else {
          // Add the new temp message (e.g., from optimistic update in this client)
          state.messages[conversationId].push(message);
        }
      }

      if (state.selectedConversationId !== conversationId) {
        state.unreadCounts[conversationId] = (state.unreadCounts[conversationId] || 0) + 1;
      }
    },
    setConnectionStatus: (state, action: PayloadAction<ChatState['connectionStatus']>) => {
      state.connectionStatus = action.payload;
    },
    incrementUnreadCount: (state, action: PayloadAction<{ conversationId: string }>) => {
      const { conversationId } = action.payload;
      state.unreadCounts[conversationId] = (state.unreadCounts[conversationId] || 0) + 1;
    },
    resetUnreadCount: (state, action: PayloadAction<{ conversationId: string }>) => {
      const { conversationId } = action.payload;
      state.unreadCounts[conversationId] = 0;
    },
    clearError: (state) => { // Add clearError reducer
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages[action.payload.conversationId] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
 
export const {
  setConversations,
  setSelectedConversationId,
  setMessages,
  addMessage,
  setConnectionStatus,
  incrementUnreadCount,
  resetUnreadCount,
  clearError, // Export clearError
} = chatSlice.actions;
 
export default chatSlice.reducer;
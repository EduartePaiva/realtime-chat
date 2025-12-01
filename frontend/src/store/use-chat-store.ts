import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

type User = {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
};

type MessageData = {
  _id: string;
  text?: string | null;
  image?: string | null;
  senderId: string;
  receiverId: string;
  createdAt: string;
};

type ChatStore = {
  messages: MessageData[];
  users: User[];
  selectedUser: null | User;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  sendMessage: (messageData: { image?: string | null; text?: string | null }) => Promise<void>;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        console.error(error);
        toast.error("Failed to load users");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        console.error(error);
        toast.error("Failed to load messages");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setSelectedUser: (user) => set({ selectedUser: user }),
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        console.error(error);
        toast.error("Failed to send messages");
      }
    }
  },
}));

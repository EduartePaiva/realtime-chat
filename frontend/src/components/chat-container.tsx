import { useEffect } from "react";
import { useChatStore } from "../store/use-chat-store";
import ChatHeader from "./chat-header";
import MessageInput from "./message-input";
import MessageSkeleton from "./skeletons/message-skeleton";

export default function ChatContainer() {
  const { getMessages, isMessagesLoading, selectedUser } = useChatStore();

  useEffect(() => {
    if (!selectedUser) return;

    getMessages(selectedUser._id);
  }, [getMessages, selectedUser]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  if (isMessagesLoading) return <div>Loading ...</div>;
  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />
      <p>messages...</p>

      <MessageInput />
    </div>
  );
}

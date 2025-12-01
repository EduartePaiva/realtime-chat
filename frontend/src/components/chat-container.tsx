import { useEffect } from "react";
import { useChatStore } from "../store/use-chat-store";
import ChatHeader from "./chat-header";
import MessageInput from "./message-input";
import MessageSkeleton from "./skeletons/message-skeleton";
import { useAuthStore } from "../store/use-auth-store";
import { formatMessageTime } from "../lib/utils";

export default function ChatContainer() {
  const { getMessages, messages, isMessagesLoading, selectedUser } = useChatStore();
  const { authUser, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    if (!selectedUser) return;

    getMessages(selectedUser._id);
  }, [getMessages, selectedUser]);

  if (isMessagesLoading || isCheckingAuth) {
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser?.userID ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId == authUser?.userID
                      ? authUser.profilePic || "./avatar.png"
                      : selectedUser?.profilePic || "./avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}

              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
}

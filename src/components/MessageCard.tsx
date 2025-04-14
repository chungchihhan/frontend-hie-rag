// src/components/MessageCard.tsx

import { ChatMessage } from "@/types";
import ReactMarkdown from "react-markdown";

interface MessageCardProps {
  message: ChatMessage;
}

export default function MessageCard({ message }: MessageCardProps) {
  const { content, isUser, timestamp } = message;

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3xl rounded-lg p-4 ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-white border border-gray-200 rounded-bl-none"
        }`}
      >
        <div className="text-sm mb-1">
          {isUser ? "You" : "Assistant"}
          <span className="text-xs ml-2 opacity-70">
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className={isUser ? "text-white" : "text-gray-800"}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

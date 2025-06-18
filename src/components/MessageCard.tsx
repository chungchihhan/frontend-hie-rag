// src/components/MessageCard.tsx

import { ChatMessage } from "@/types";
import ReactMarkdown from "react-markdown";
import { Copy } from "lucide-react";

interface MessageCardProps {
  message: ChatMessage;
}

export default function MessageCard({ message }: MessageCardProps) {
  const { content, isUser, timestamp } = message;

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="flex gap-2">
        {isUser && (
          <div className="flex flex-col justify-end text-xs opacity-70 items-end">
            <div>You</div>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(content)}
                className="hover:cursor-pointer"
              >
                <Copy size={14} className="text-gray-500 hover:text-gray-700" />
              </button>
              {timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        )}
        <div
          className={`rounded-lg px-4 py-3 flex flex-col gap-2 ${
            isUser ? "bg-neutral-200 rounded" : "flex justify-start"
          }`}
        >
          <div className={isUser ? "text-black" : "text-gray-800"}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          {!isUser && (
            <div className="flex justify-start text-xs opacity-70 gap-2">
              <>Hie-RAG</>
              <div>
                {timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(content)}
                className="hover:cursor-pointer"
              >
                <Copy size={14} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

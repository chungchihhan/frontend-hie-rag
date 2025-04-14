// src/types/index.ts

export interface QueryRequest {
  query_text: string;
  n_results: number;
}

export interface QueryChatRequest {
  human_message: string;
  n_results: number;
}

export interface QueryRecord {
  id: string;
  distance: number;
  metadata: {
    file_id: string;
    keywords: string;
    summary: string;
    type: string;
  };
}

export interface QuerySummariesResponse {
  message: string;
  summaries: QueryRecord[];
}

export interface QueryChunksResponse {
  message: string;
  file_id: string;
  summary: QueryRecord[];
  chunks: QueryRecord[];
}

export interface QueryChunksChatResponse {
  message: string;
  response: {
    content: string;
    [key: string]: any;
  };
}
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ConversationEntry {
  type: "message" | "result" | "chatResult";
  id: string;
  content: ChatMessage | QueryRecord[] | string;
  timestamp: Date;
}

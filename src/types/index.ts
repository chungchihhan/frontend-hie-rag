// src/types/index.ts

export interface QueryRequest {
  query_text: string;
  n_results: number;
}

export interface QueryResultRecord {
  id: string;
  distance: number;
  metadata: {
    file_id: string;
    keywords: string;
    summary: string;
    type: string;
  };
}

export interface QueryResponse {
  message: string;
  results: QueryResultRecord[];
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

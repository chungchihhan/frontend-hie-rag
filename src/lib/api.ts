// src/lib/api.ts

import {
  QueryRequest,
  QueryChatRequest,
  QuerySummariesResponse,
  QueryChunksResponse,
  QueryChunksChatResponse,
} from "@/types";

const API_BASE_URL = "http://localhost:8000";

export async function querySummaries(
  request: QueryRequest
): Promise<QuerySummariesResponse> {
  const response = await fetch(`${API_BASE_URL}/query_summaries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to query summaries");
  }

  return response.json();
}

export async function queryChunks(
  fileId: string,
  request: QueryRequest
): Promise<QueryChunksResponse> {
  const response = await fetch(`${API_BASE_URL}/query_chunks/${fileId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to query chunks");
  }

  return response.json();
}

export async function queryChunksChat(
  fileId: string,
  request: QueryChatRequest
): Promise<QueryChunksChatResponse> {
  const response = await fetch(`${API_BASE_URL}/query_chunks/${fileId}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to query chunks");
  }

  const data = await response.json();

  return data;
}

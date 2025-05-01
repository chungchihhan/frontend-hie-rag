// src/lib/api.ts

import {
  QueryRequest,
  QueryChatRequest,
  QuerySummariesResponse,
  QueryChunksResponse,
  QueryChunksChatResponse,
} from "@/types";

const API_BASE_URL = "http://localhost:8000";

export function streamProcessFile(
  file: File,
  minChunkSize = 500,
  maxChunkSize = 1500,
  onMessage: (data: any) => void
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "params",
    JSON.stringify({
      min_chunk_size: minChunkSize,
      max_chunk_size: maxChunkSize,
    })
  );

  const url = `${API_BASE_URL}/process/stream`;

  return fetch(url, {
    method: "POST",
    body: formData,
  }).then(async (res) => {
    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      chunk
        .split("progress: ")
        .filter(Boolean)
        .forEach((line) => {
          try {
            onMessage(JSON.parse(line.trim()));
          } catch (err) {
            console.error("Failed to parse stream chunk:", line);
          }
        });
    }
  });
}

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

export async function listSummaries() {
  const res = await fetch(`${API_BASE_URL}/list_summaries`);
  if (!res.ok) throw new Error("Failed to fetch summaries");
  return await res.json();
}

export async function deleteIndex(fileId: string) {
  const res = await fetch(`${API_BASE_URL}/delete_index/${fileId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete index");
  return await res.json();
}

export async function rag(request: QueryRequest): Promise<QueryChunksResponse> {
  const response = await fetch(`${API_BASE_URL}/rag`, {
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

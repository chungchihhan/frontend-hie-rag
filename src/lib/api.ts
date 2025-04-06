// src/lib/api.ts

import { QueryRequest, QueryResponse } from "@/types";

const API_BASE_URL = "http://localhost:8000";

export async function querySummary(
  request: QueryRequest
): Promise<QueryResponse> {
  const response = await fetch(`${API_BASE_URL}/query_summary`, {
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
): Promise<QueryResponse> {
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

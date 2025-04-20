"use client";

import { useState } from "react";
import { streamProcessFile } from "@/lib/api";

export default function FileUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [minSize, setMinSize] = useState(500);
  const [maxSize, setMaxSize] = useState(1500);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMessages, setProgressMessages] = useState<string[]>([]);

  const handleUpload = async () => {
    if (!file) return;

    setProgressMessages([]);
    setResponse(null);
    setError(null);
    setLoading(true);

    try {
      await streamProcessFile(file, minSize, maxSize, (data) => {
        if (data.status) {
          setProgressMessages((prev) => [...prev, data.status]);

          // Final response
          if (data.status === "✅ Done") {
            setResponse(data);
            setLoading(false);
          }
        }
      });
    } catch (err: any) {
      setError(err.message || "上傳時發生錯誤");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">📁 上傳檔案進行處理</h1>

      <div className="space-y-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500"
        />

        <div className="flex gap-4">
          <label className="flex flex-col">
            最小 Chunk 大小
            <input
              type="number"
              value={isNaN(minSize) ? "" : minSize}
              onChange={(e) => setMinSize(parseInt(e.target.value) || 0)}
              className="border rounded px-2 py-1"
            />
          </label>

          <label className="flex flex-col">
            最大 Chunk 大小
            <input
              type="number"
              value={isNaN(maxSize) ? "" : maxSize}
              onChange={(e) => setMaxSize(parseInt(e.target.value) || 0)}
              className="border rounded px-2 py-1"
            />
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "處理中..." : "開始上傳"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {response && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded">
            <h2 className="font-bold text-green-800 mb-2">✅ 處理成功</h2>
            <p>
              <strong>File ID:</strong> {response.file_id}
            </p>
            <p>
              <strong>摘要數:</strong> {response.summary_count}
            </p>
            <p>
              <strong>Chunk 數:</strong> {response.chunk_count}
            </p>
          </div>
        )}
        <ul className="mt-4 space-y-1 text-sm text-gray-700">
          {progressMessages.map((msg, idx) => (
            <li key={idx}>👉 {msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

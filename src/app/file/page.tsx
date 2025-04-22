"use client";

import { useState, useRef } from "react";
import { streamProcessFile } from "@/lib/api";
import { CheckCircle, XCircle, Upload } from "lucide-react";
import Link from "next/link";
import RangeSlider from "@/components/RangeSlider"; // Adjust import path as needed

export default function FileUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [minSize, setMinSize] = useState(6000);
  const [maxSize, setMaxSize] = useState(7500);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMessages, setProgressMessages] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

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
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-neutral-800">
        📁 上傳檔案進行處理
      </h1>

      {/* Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`min-h-80 flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-neutral-400 rounded-lg cursor-pointer hover:border-neutral-500 ${
          file ? "bg-neutral-100" : "bg-neutral-50"
        } transition`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={40} className="text-neutral-400 mb-2" />
        {file ? (
          <p className="text-neutral-700 text-sm">已選擇：{file.name}</p>
        ) : (
          <p className="text-neutral-500 text-sm">
            拖曳檔案到此處，或點擊選擇檔案
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      {/* Range Slider for Chunk Size */}
      <div className="border border-neutral-200 rounded-lg p-4 bg-white shadow-sm">
        <h2 className="text-lg font-medium text-neutral-800 mb-2">
          Chunk 大小設定
        </h2>
        <RangeSlider
          min={1000}
          max={10000}
          step={100}
          minValue={minSize}
          maxValue={maxSize}
          defaultMinValue={6000}
          defaultMaxValue={7500}
          onMinChange={setMinSize}
          onMaxChange={setMaxSize}
        />
      </div>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium px-6 py-2 rounded transition disabled:opacity-50"
      >
        {loading ? "處理中..." : "🚀 開始上傳"}
      </button>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 border border-red-200 bg-red-50 p-4 rounded">
          <XCircle size={20} />
          {error}
        </div>
      )}

      {/* Progress messages */}
      <ul className="space-y-1 text-sm">
        {progressMessages.map((msg, idx) => {
          const isLatest = idx === progressMessages.length - 1; // 最後一筆 = 最新
          return (
            <li
              key={idx}
              className={`flex items-center gap-2 rounded py-1 text-lg
          ${
            isLatest
              ? "text-neutral-700 font-semibold animate-pulse" // 最新：跳動＋正常色
              : "text-neutral-400"
          }                                   // 已完成：變淡
        `}
            >
              <span className="truncate">{msg}</span>
            </li>
          );
        })}
      </ul>

      {/* Response */}
      {response && (
        <div className="p-4 bg-green-50 border border-green-200 rounded space-y-1 text-sm text-green-800">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle size={20} /> 處理成功
          </div>
          <Link href={`/chat/${response.file_id}`}>
            <strong>File ID:</strong> {response.file_id}
          </Link>
          <p>
            <strong>Chunk 數:</strong> {response.chunk_count}
          </p>
        </div>
      )}
    </div>
  );
}

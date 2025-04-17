"use client";

import { useEffect, useState } from "react";
import { deleteIndex, listSummaries } from "@/lib/api";
import { QueryRecord } from "@/types";
import { Trash2 } from "lucide-react";

export default function SummaryPage() {
  const [summaries, setSummaries] = useState<QueryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      const res = await listSummaries();
      setSummaries(res.summaries);
    } catch (err: any) {
      setError(err.message || "Failed to load summaries.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    const ok = confirm("確定要刪除這份摘要嗎？此動作無法復原。");
    if (!ok) return;

    try {
      await deleteIndex(fileId);
      await fetchSummaries(); // Refresh after delete
    } catch (err: any) {
      alert(err.message || "刪除失敗");
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">📄 文件摘要清單</h1>

      {loading && <p className="text-blue-500">資料載入中...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {summaries.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-200 flex flex-col justify-between"
          >
            <div>
              <h2 className="font-semibold text-gray-800 mb-2 truncate">
                檔案 ID：{item.metadata?.file_id}
              </h2>
              <p className="text-gray-600 text-sm mb-3 line-clamp-5 whitespace-pre-wrap">
                {item.metadata?.summary}
              </p>
              <div className="text-xs text-gray-400 mt-2">
                關鍵字：
                {item.metadata?.keywords
                  ?.split(/\n|[,，、;]/)
                  .map((kw, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-1 mb-1"
                    >
                      {kw.trim()}
                    </span>
                  ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleDelete(item.metadata.file_id)}
                className="flex items-center gap-2 text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                <Trash2 size={16} />
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

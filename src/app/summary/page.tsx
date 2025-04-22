"use client";

import { useEffect, useState } from "react";
import { deleteIndex, listSummaries } from "@/lib/api";
import { QueryRecord } from "@/types";
import { Trash2 } from "lucide-react";
import Link from "next/link";

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
    if (!confirm("確定要刪除這份摘要嗎？此動作無法復原。")) return;
    try {
      await deleteIndex(fileId);
      await fetchSummaries();
    } catch (err: any) {
      alert(err.message || "刪除失敗");
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  const Skeleton = () => (
    <div className="animate-pulse h-32 bg-white/60 rounded-lg shadow-sm" />
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-neutral-800 mb-10">
          📄 文件摘要清單
        </h1>

        {error && (
          <p className="text-red-600 mb-6 bg-red-50 border border-red-200 p-4 rounded">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)
            : summaries.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-white border border-neutral-200 rounded-xl shadow-md p-6 transition hover:shadow-lg hover:bg-neutral-50"
                >
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item.metadata.file_id)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-600 hover:bg-neutral-200 hover:cursor-pointer rounded-full p-2 transition"
                    title="刪除"
                  >
                    <Trash2 size={18} />
                  </button>

                  <Link href={`/chat/${item.metadata?.file_id}`}>
                    <h2 className="text-lg font-semibold text-neutral-800 mb-3">
                      檔案 ID：{item.metadata?.file_id}
                    </h2>

                    <p className="text-sm text-neutral-700 whitespace-pre-wrap mb-4">
                      {item.metadata?.summary}
                    </p>

                    {item.metadata?.keywords && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.metadata.keywords
                          .split(/\n|[,，、;]/)
                          .filter(Boolean)
                          .map((kw, idx) => (
                            <span
                              key={idx}
                              className="bg-neutral-200 text-neutral-600 text-xs font-medium px-3 py-1 rounded-full"
                            >
                              {kw.trim()}
                            </span>
                          ))}
                      </div>
                    )}
                  </Link>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

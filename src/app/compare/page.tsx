"use client";

import { useEffect, useState } from "react";
import { listSummaries, queryChunks, rag } from "@/lib/api";
import { Loader, Search } from "lucide-react";
import CompareCard from "@/components/CompareCard";

export default function CompareChunksRag() {
  const [summaries, setSummaries] = useState<{ id: string; metadata: any }[]>(
    []
  );
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [queryText, setQueryText] = useState<string>("");
  const [nResults, setNResults] = useState<number>(5);
  const [hieragResults, setHieragResults] = useState<any[]>([]);
  const [ragResults, setRagResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSummaries = async () => {
    try {
      const data = await listSummaries();
      setSummaries(data.summaries || []);
    } catch (err) {
      console.error("Failed to load summaries", err);
    }
  };

  const runQueries = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault(); // ✅ prevent page reload

    if (!queryText || !selectedFileId) {
      alert("請選擇文件和輸入查詢內容");
      return;
    }

    setIsLoading(true);
    if (!queryText || !selectedFileId) return;

    const queryBody = { query_text: queryText, n_results: nResults };

    try {
      const [chunkRes, ragRes] = await Promise.all([
        queryChunks(selectedFileId, queryBody),
        rag(queryBody),
      ]);

      setHieragResults(chunkRes.chunks || []);
      setRagResults(ragRes.chunks || []);
    } catch (err) {
      console.error("Query error", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  return (
    <div className="w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-neutral-800 mb-6">
        🔍 Compare Chunk vs RAG Results
      </h1>

      <form onSubmit={runQueries} className="w-full">
        <div className="grid gap-4 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="輸入查詢內容"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
            />

            <select
              id="n-results"
              value={nResults}
              onChange={(e) => setNResults(Number(e.target.value))}
              className="px-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
            >
              {[3, 5, 10, 15, 20].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-neutral-400 text-white rounded-lg hover:bg-neutral-600 hover: cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-opacity-50 disabled:bg-neutral-300"
              // disabled={isLoading || !query.trim()}
            >
              {isLoading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <Search size={20} className="text-white" />
              )}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4">
            <div className="w-full">
              <h2 className="text-2xl font-semibold">📦 HieRAG </h2>
              <select
                className="w-full px-2 py-2 my-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                value={selectedFileId}
                onChange={(e) => setSelectedFileId(e.target.value)}
              >
                <option value="">-- 選擇文件 --</option>
                {summaries.map((s) => (
                  <option key={s.id} value={s.metadata.file_id}>
                    {s.metadata.file_name}
                  </option>
                ))}
              </select>
              <div>
                <div className="space-y-4">
                  {hieragResults.length === 0 ? (
                    <p className="text-gray-400">尚無結果</p>
                  ) : (
                    hieragResults.map((chunk, i) => (
                      <CompareCard key={i} chunk={chunk} />
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="w-full">
              <h2 className="text-2xl font-semibold">🧠 RAG</h2>
              <div className="w-full h-0 md:h-10 my-4"></div>
              <div className="space-y-4">
                {ragResults.length === 0 ? (
                  <p className="text-gray-400">尚無結果</p>
                ) : (
                  ragResults.map((chunk, i) => (
                    <CompareCard key={i} chunk={chunk} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

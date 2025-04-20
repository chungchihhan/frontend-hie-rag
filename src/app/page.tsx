// src/app/page.tsx

"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import ResultCard from "@/components/ResultCard";
import { QueryRecord } from "@/types";
import { querySummaries } from "@/lib/api";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [summaries, setSummaries] = useState<QueryRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string, nResults: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await querySummaries({
        query_text: query,
        n_results: nResults,
      });

      setSummaries(response.summaries);
      setHasSearched(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setSummaries([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex w-full min-h-screen flex-col items-center p-4 md:p-12 gap-4 bg-gray-50">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hi-RAG</h1>
        <p className="text-gray-600">Search the relative file.</p>
      </div>

      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="w-full max-w-2xl p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {hasSearched && !isLoading && summaries.length === 0 && !error && (
        <div className="w-full max-w-2xl p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800">
          No summaries found. Try a different query.
        </div>
      )}

      {summaries.length > 0 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-md text-neutral-400 text-end pr-4">
            <strong className="text-neutral-600">{summaries.length}</strong>{" "}
            results are shown below...
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {summaries.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

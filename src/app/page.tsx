// src/app/page.tsx

"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import ResultCard from "@/components/ResultCard";
import { QueryResponse, QueryResultRecord } from "@/types";
import { querySummary } from "@/lib/api";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<QueryResultRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string, nResults: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await querySummary({
        query_text: query,
        n_results: nResults,
      });

      setResults(response.results);
      setHasSearched(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 gap-8 bg-gray-50">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Document Search
        </h1>
        <p className="text-gray-600">
          Enter your query to search through document summaries
        </p>
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

      {hasSearched && !isLoading && results.length === 0 && !error && (
        <div className="w-full max-w-2xl p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800">
          No results found. Try a different query.
        </div>
      )}

      {results.length > 0 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Results ({results.length})
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {results.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

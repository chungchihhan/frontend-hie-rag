// src/components/SearchForm.tsx

"use client";

import { useState } from "react";
import { Search, Loader } from "lucide-react";

interface SearchFormProps {
  onSearch: (query: string, nResults: number) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [nResults, setNResults] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, nResults);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* <label
            htmlFor="n-results"
            className="text-sm text-gray-600 whitespace-nowrap"
          >
            Results:
          </label> */}
          <select
            id="n-results"
            value={nResults}
            onChange={(e) => setNResults(Number(e.target.value))}
            className="px-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
            disabled={isLoading}
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
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <Search size={20} className="text-white" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

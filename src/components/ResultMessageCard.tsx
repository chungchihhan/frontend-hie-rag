// src/components/ResultMessageCard.tsx

import { QueryResultRecord } from "@/types";

interface ResultMessageCardProps {
  results: QueryResultRecord[];
}

export default function ResultMessageCard({ results }: ResultMessageCardProps) {
  if (!results.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-3xl rounded-bl-none">
        <div className="text-sm mb-1">Assistant</div>
        <div className="text-orange-500">No results found for your query.</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-3xl rounded-bl-none">
      <div className="text-sm mb-1">Assistant</div>
      <div className="text-gray-800 mb-4">
        Here are the results for your query:
      </div>

      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-gray-50 rounded-lg p-3 border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900">
                {result.id || "Result"}
              </h3>
              <span className="text-xs text-gray-500">
                Score: {(1 - result.distance).toFixed(2)}
              </span>
            </div>

            {result.metadata.summary && (
              <div className="mt-2 text-sm text-gray-700">
                {result.metadata.summary}
              </div>
            )}

            {/* {result.metadata.text && !result.metadata.content && (
              <div className="mt-2 text-sm text-gray-700">
                {result.metadata.text}
              </div>
            )}

            {!result.metadata.content &&
              !result.metadata.text &&
              result.metadata.summary && (
                <div className="mt-2 text-sm text-gray-700">
                  {result.metadata.summary}
                </div>
              )}

            <div className="mt-2 flex flex-wrap gap-1">
              {result.metadata.tags &&
                result.metadata.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}

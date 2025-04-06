// src/components/ResultCard.tsx

import Link from "next/link";
import { QueryResultRecord } from "@/types";

interface ResultCardProps {
  result: QueryResultRecord;
}

export default function ResultCard({ result }: ResultCardProps) {
  const { id, distance, metadata } = result;

  return (
    <Link href={`/chat/${metadata.file_id}`}>
      <div className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 truncate max-w-xs">
            {id}
          </h3>
          <span className="text-sm text-gray-500">
            Score: {(1 - distance).toFixed(2)}
          </span>
        </div>

        {metadata.summary && (
          <p className="mt-2 text-gray-600 text-sm line-clamp-3">
            {metadata.summary}
          </p>
        )}

        {/* <div className="mt-3 flex flex-wrap gap-2">
          {metadata.keywords &&
            metadata.keywords.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
              >
                {tag}
              </span>
            ))}
        </div> */}
      </div>
    </Link>
  );
}

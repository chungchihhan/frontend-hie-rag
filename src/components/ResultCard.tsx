import Link from "next/link";
import { QueryRecord } from "@/types";

interface ResultCardProps {
  result: QueryRecord;
}

// Helper to get similarity level label
function getSimilarityLabel(similarity: number): {
  label: string;
  color: string;
} {
  if (similarity > 0.75)
    return { label: "High", color: "bg-green-100 text-green-800" };
  if (similarity > 0.4)
    return { label: "Medium", color: "bg-yellow-100 text-yellow-800" };
  return { label: "Low", color: "bg-red-100 text-red-800" };
}

export default function ResultCard({ result }: ResultCardProps) {
  const { metadata, distance } = result;
  const similarity = Math.max(0, Math.min(1, 1 - distance / 2));
  const fillPercent = `${(similarity * 100).toFixed(0)}%`;
  const similarityInfo = getSimilarityLabel(similarity);

  return (
    <Link href={`/chat/${metadata.file_id}`}>
      <div className="p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white space-y-3 rounded-lg">
        {/* Similarity Bar with Label */}
        <div className="flex items-center justify-between gap-2">
          <span className="mr-2 px-2 py-0.5 text-xs font-semibold rounded bg-gray-200">
            SIMILARITY
          </span>
          <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 transition-all duration-500"
              style={{ width: fillPercent }}
            ></div>
          </div>
          <span
            className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded ${similarityInfo.color}`}
          >
            {similarityInfo.label}
          </span>
        </div>

        {/* Metadata Summary */}
        {metadata.summary && (
          <p className="text-gray-700 text-lg pt-4 pb-8">{metadata.summary}</p>
        )}

        {/* Metadata Keywords as tags */}
        {metadata.keywords && typeof metadata.keywords === "string" && (
          <div className="flex flex-wrap gap-2 mt-1">
            {metadata.keywords.split(/[;,、，\s]+/).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-neutral-200 text-neutral-600 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

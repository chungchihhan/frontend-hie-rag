import { useState } from "react";

type ResultItemProps = {
  chunk: any;
};

const colorPalette = [
  "bg-red-100",
  "bg-green-300",
  "bg-blue-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-orange-100",
  "bg-gray-200",
];

function getColorClassByFileId(fileId: string) {
  let hash = 0;
  for (let i = 0; i < fileId.length; i++) {
    hash = fileId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
}

export default function CompareCard({ chunk }: ResultItemProps) {
  const [expanded, setExpanded] = useState(false);
  const fileId = chunk.metadata?.file_id || "unknown";
  const colorClass = getColorClassByFileId(fileId);
  const content = chunk.metadata?.original_chunk || "無內容";

  const contentClass = expanded
    ? "h-63 overflow-y-scroll"
    : "h-20 overflow-hidden";

  return (
    <div
      className={`rounded-md p-3 ${colorClass} shadow-md text-sm text-gray-700`}
    >
      <p className="bg-white text-black mb-2 p-1 px-2 shadow-lg rounded font-mono">
        ID: {fileId}
      </p>
      <div
        className={`${contentClass} transition-all duration-300 whitespace-pre-wrap`}
      >
        {content}
      </div>
      <div className="flex justify-end">
        {content.length > 100 && (
          <button
            className="mt-2 bg-white text-black  p-1 px-2 shadow-lg rounded  hover:underline focus:outline-none"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
}

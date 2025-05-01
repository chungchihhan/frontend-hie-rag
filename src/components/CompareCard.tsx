// components/CompareCard.tsx

type ResultItemProps = {
  chunk: any;
};

export default function CompareCard({ chunk }: ResultItemProps) {
  return (
    <div className="border rounded-md p-3 bg-white shadow-sm text-sm text-gray-700">
      <p className="mb-1 font-mono text-gray-500">
        ID: {chunk.metadata?.file_id || "無內容"}
      </p>
      <p className="h-20 overflow-hidden">
        {chunk.metadata?.original_chunk || "無內容"}
      </p>
    </div>
  );
}

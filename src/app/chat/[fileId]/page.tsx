"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";

import { ChevronLeft } from "lucide-react";

export default function ChatPage() {
  // Use the useParams hook instead of receiving params as a prop
  const params = useParams();
  const fileId = params.fileId as string;

  const [fileName, setFileName] = useState<string>(
    fileId || "Unknown Document"
  );
  const router = useRouter();

  // Validate file ID
  useEffect(() => {
    if (!fileId || fileId === "undefined") {
      console.error("Invalid file ID:", fileId);
      // Optionally redirect to home page if file ID is invalid
      // router.push('/');
    }
  }, [fileId, router]);

  // In a real application, you might want to fetch file details here
  // to display a more user-friendly title

  return (
    <main className="flex flex-col h-screen w-full">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center w-full justify-between gap-4">
            <Link href="/" className="text-neutral-700 hover:text-neutral-400">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">
              Chat with: {fileName}
            </h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden bg-gray-50">
        {!fileId || fileId === "undefined" ? (
          <div className="flex items-center justify-center h-full">
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg max-w-lg text-center">
              <h2 className="text-xl font-semibold text-red-700 mb-2">
                Invalid Document ID
              </h2>
              <p className="text-red-600 mb-4">
                The document ID is missing or invalid. Please return to the
                search page and select a valid document.
              </p>
              <Link
                href="/"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Return to Search
              </Link>
            </div>
          </div>
        ) : (
          <ChatInterface fileId={fileId} />
        )}
      </div>
    </main>
  );
}

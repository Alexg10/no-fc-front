"use client";

import { useEffect } from "react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Error caught by boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
          Something went wrong
        </h2>

        <p className="text-gray-600 dark:text-zinc-400 mb-2">
          We encountered an unexpected error. Please try again.
        </p>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-400">
              Error details
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 dark:bg-zinc-900 rounded text-xs text-red-600 dark:text-red-400 overflow-auto max-h-40">
              {error.message}
            </pre>
          </details>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => reset()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 font-medium transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-zinc-800 text-black dark:text-zinc-50 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-700 font-medium transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-center text-red-600">
          <p className="font-medium">Something went wrong</p>
          <p className="mt-1 text-sm">{error.message}</p>
        </div>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="self-center rounded-lg border border-foreground/20 px-4 py-2 text-sm hover:bg-foreground/5"
        >
          Try again
        </button>
      </div>
    </main>
  );
}

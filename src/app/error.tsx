"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Large 500 */}
        <p className="text-[120px] leading-none font-extrabold tracking-tighter text-zinc-200 select-none dark:text-zinc-800">
          500
        </p>

        <div className="-mt-8 flex flex-col items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Something went wrong
          </h1>
          <p className="max-w-sm text-zinc-500 dark:text-zinc-400">
            An unexpected error occurred. Our team has been notified and we&apos;re working to fix
            it.
          </p>
          {error.digest && (
            <p className="rounded-md bg-zinc-100 px-3 py-1 font-mono text-xs text-zinc-400 dark:bg-zinc-800">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

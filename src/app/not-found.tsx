import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Large 404 */}
        <p className="text-[120px] leading-none font-extrabold tracking-tighter text-zinc-200 select-none dark:text-zinc-800">
          404
        </p>

        <div className="-mt-8 flex flex-col items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Page not found
          </h1>
          <p className="max-w-sm text-zinc-500 dark:text-zinc-400">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or
            deleted.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Go home
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

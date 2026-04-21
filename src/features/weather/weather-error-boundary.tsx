"use client";

import { unstable_catchError as catchError, type ErrorInfo } from "next/error";

function WeatherErrorFallback(_: object, { unstable_retry }: ErrorInfo) {
  return (
    <div className="rounded-2xl border border-danger/30 bg-danger/5 p-6 text-center text-sm text-danger">
      <p className="font-medium">Couldn&rsquo;t load weather</p>
      <p className="mt-1 text-foreground/60">
        Check your connection and try again.
      </p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="mt-3 rounded-lg border border-foreground/20 px-3 py-1.5 text-sm text-foreground hover:bg-foreground/5"
      >
        Try again
      </button>
    </div>
  );
}

export const WeatherErrorBoundary = catchError(WeatherErrorFallback);

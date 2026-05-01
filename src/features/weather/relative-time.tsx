"use client";

import { useEffect, useState } from "react";
import { formatRelativeTime } from "@/lib/format-relative-time";

interface RelativeTimeProps {
  epochMs: number;
  className?: string;
}

export function RelativeTime({ epochMs, className }: RelativeTimeProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 60_000); // 1 minute
    return () => clearInterval(id);
  }, []);

  return (
    <time
      dateTime={new Date(epochMs).toISOString()}
      className={className}
      suppressHydrationWarning
    >
      {formatRelativeTime(epochMs, now)}
    </time>
  );
}

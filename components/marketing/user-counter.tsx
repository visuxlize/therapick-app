"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc/client";

export function UserCounter() {
  const [displayCount, setDisplayCount] = useState<number | null>(null);
  const { data } = trpc.waitlist.getCount.useQuery(undefined, {
    refetchInterval: 60_000,
  });

  const count = data?.count ?? 0;
  const baseCount = Math.max(count, 242);

  useEffect(() => {
    setDisplayCount(baseCount);
  }, [baseCount]);

  useEffect(() => {
    if (displayCount === null) return;
    const interval = setInterval(() => {
      setDisplayCount((prev) => (prev ?? baseCount) + Math.floor(Math.random() * 3) + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, [displayCount, baseCount]);

  return (
    <div className="flex items-center justify-center gap-3 text-sm text-white/40">
      <div className="flex -space-x-2">
        {[
          "linear-gradient(135deg, var(--green-primary), var(--green-light))",
          "linear-gradient(135deg, var(--green-light), var(--tan-light))",
          "linear-gradient(135deg, var(--tan-light), #A5D6A7)",
          "linear-gradient(135deg, #66BB6A, var(--green-primary))",
        ].map((gradient, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full border-2 border-[var(--bg-dark)]"
            style={{ background: gradient }}
          />
        ))}
      </div>
      <span className="font-semibold text-[var(--tan-light)]">
        +{displayCount ?? baseCount}
      </span>
      <span>people joined</span>
    </div>
  );
}

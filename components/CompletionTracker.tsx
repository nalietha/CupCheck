// components/CompletionTracker.tsx
import React from 'react';

interface CompletionTrackerProps {
  label: string;
  owned: number;
  total: number;
  percentage: number;
}

export default function CompletionTracker({ label, owned, total, percentage }: CompletionTrackerProps) {
  // Cap percentage at 100% just in case of data anomalies
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="flex flex-col gap-2 w-full group">
      {/* Label and Numbers */}
      <div className="flex justify-between items-end">
        <span className="text-sm font-bold text-vaporText uppercase tracking-wider group-hover:text-vaporCyan transition-colors">
          {label}
        </span>
        <span className="text-xs font-mono text-vaporMuted">
          {owned} / {total} <span className="text-vaporPink font-bold ml-1">({safePercentage}%)</span>
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-3 bg-[#0A0710] rounded-full border border-vaporBorder overflow-hidden shadow-inner">
        {/* The Fill */}
        <div
          className="h-full bg-gradient-to-r from-vaporCyan to-vaporPink transition-all duration-700 ease-out relative"
          style={{ width: `${safePercentage}%` }}
        >
          {/* Optional: Add a subtle shine effect to the filled bar */}
          <div className="absolute top-0 left-0 w-full h-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}
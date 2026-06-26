// features/vault/VaultCompletionDisplay.tsx
'use client';

import { useEffect, useState } from 'react';
import { ProgressService } from '@/lib/services/ProgressService';
import ThemeableCard from '@/components/ThemeableCard';
import CompletionTracker from '@/components/CompletionTracker';

export default function VaultCompletionDisplay({ userId }: { userId: string }) {
  const [trackers, setTrackers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrackers() {
      try {
        const data = await ProgressService.getUserTrackers(userId);
        setTrackers(data);
      } catch (error) {
        console.error('Failed to load vault trackers:', error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchTrackers();
    }
  }, [userId]);

  if (loading || trackers.length === 0) return null;

  // Sanitizes database column names for front-end presentation
  const formatLabel = (type: string, label: string) => {
    const cleanType = type.replace('_id', '').replace('_', ' ').toUpperCase();
    return `${cleanType}: ${label}`;
  };

  return (
    <ThemeableCard title="Collection Progress" customClasses="mb-12">
      {/* Removed `flex-1` to prevent stretching.
        On mobile, they are full width (`w-full`).
        On larger screens, they lock to a compact size (`sm:w-72 md:w-80`) 
        and sit neatly next to each other.
      */}
      <div className="flex flex-wrap gap-6 md:gap-8">
        {trackers.map((tracker, idx) => (
          <div key={idx} className="w-full sm:w-72 md:w-80">
            <CompletionTracker 
              label={formatLabel(tracker.filter_type, tracker.filter_label || tracker.filter_value)} 
              owned={tracker.owned} 
              total={tracker.total} 
              percentage={tracker.percentage} 
            />
          </div>
        ))}
      </div>
    </ThemeableCard>
  );
}
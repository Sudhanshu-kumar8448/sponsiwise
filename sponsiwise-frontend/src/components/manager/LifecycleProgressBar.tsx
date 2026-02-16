import type { LifecycleProgress } from "@/lib/types/manager";

/**
 * LifecycleProgressBar — visual progress indicator for event lifecycle.
 *
 * Design:
 *  - Gray background track
 *  - Green fill for completed percentage
 *  - Red accent indicator if any emails failed (hasFailed prop)
 *  - Percentage number displayed at right
 */
export default function LifecycleProgressBar({
  progress,
  hasFailed,
}: {
  progress: LifecycleProgress;
  hasFailed: boolean;
}) {
  const pct = Math.min(Math.max(progress.percentage, 0), 100);

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">
          Lifecycle Progress
        </h3>
        <span className="text-sm font-bold text-gray-900">{pct}%</span>
      </div>

      {/* Track */}
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
        {/* Green fill */}
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
        {/* Red overlay if any failure */}
        {hasFailed && (
          <div className="absolute right-0 top-0 h-full w-1 bg-red-500 rounded-r-full" />
        )}
      </div>

      {/* Labels */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>
          {progress.completedSteps} of {progress.totalSteps} steps complete
        </span>
        {hasFailed && (
          <span className="flex items-center gap-1 text-red-600 font-medium">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
            Email failure detected
          </span>
        )}
      </div>
    </div>
  );
}

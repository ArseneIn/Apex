export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-14 h-6 rounded-full" />
      </div>
      <Skeleton className="w-24 h-4 mb-2" />
      <Skeleton className="w-16 h-8" />
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-3">
      <div className="flex justify-between mb-2">
        <Skeleton className="w-12 h-5 rounded-full" />
      </div>
      <Skeleton className="w-full h-4 mb-1" />
      <Skeleton className="w-3/4 h-4 mb-3" />
      <Skeleton className="w-full h-3 mb-2" />
      <div className="flex justify-between items-center pt-2 border-t border-[#f2f3ff]">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-6 h-6 rounded-full" />
      </div>
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="w-3 h-3 rounded-full mt-1 shrink-0" />
          <div className="flex-1">
            <Skeleton className="w-3/4 h-4 mb-1" />
            <Skeleton className="w-1/2 h-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

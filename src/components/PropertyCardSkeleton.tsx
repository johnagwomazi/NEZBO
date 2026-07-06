export default function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-56 animate-pulse bg-slate-200" />
      <div className="space-y-4 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="flex items-center justify-between">
          <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

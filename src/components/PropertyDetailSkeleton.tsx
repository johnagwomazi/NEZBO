export default function PropertyDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-80 animate-pulse rounded-3xl bg-slate-200" />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
          <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-1/4 animate-pulse rounded bg-slate-200" />
          <div className="space-y-3 pt-4">
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
          <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200" />
          <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

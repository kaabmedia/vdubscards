export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-card">
      <div className="relative aspect-[3/4] bg-gray-100 animate-pulse" />
      <div className="flex flex-1 flex-col p-3">
        <div className="space-y-1.5">
          <div className="h-3.5 w-full rounded bg-gray-100 animate-pulse" />
          <div className="h-3.5 w-2/3 rounded bg-gray-100 animate-pulse" />
        </div>
        <div className="mt-2 h-4 w-16 rounded bg-gray-100 animate-pulse" />
        <div className="mt-3 h-9 w-full rounded-lg bg-gray-100 animate-pulse" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 24 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

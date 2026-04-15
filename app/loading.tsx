import { Skeleton } from '@/components/ui/skeleton'

export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar skeleton */}
      <div className="fixed left-3 top-3 bottom-3 w-[272px] bg-white/90 rounded-[32px] border border-border/20 p-6 space-y-6 flex flex-col">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-2xl" />
          <Skeleton className="w-24 h-5 rounded" />
        </div>
        <Skeleton className="w-full h-16 rounded-2xl" />
        <div className="space-y-2 flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-12 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="w-full h-24 rounded-2xl" />
      </div>

      {/* Main content skeleton */}
      <div className="ml-[290px] flex-1 flex flex-col">
        <Skeleton className="h-16 w-full" />
        <div className="flex flex-1 gap-0">
          <div className="flex-[3] p-0">
            <Skeleton className="w-full h-full min-h-[calc(100vh-64px)]" />
          </div>
          <div className="flex-[2] p-6 space-y-4 bg-white">
            <Skeleton className="w-40 h-6 rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-16 rounded-2xl" />
            ))}
            <Skeleton className="w-full h-32 rounded-2xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

import { Skeleton } from '@/components/ui/skeleton'

export default function DriverDashboardLoading() {
  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      <div className="w-[70%] h-full relative border-r border-border">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-6 left-6 right-6 grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </div>
      <aside className="w-[30%] h-full bg-white p-8 space-y-8">
        <div className="space-y-4">
          <Skeleton className="w-36 h-4 rounded" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-16 rounded-2xl" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="w-40 h-4 rounded" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-20 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="w-full h-12 rounded-xl" />
      </aside>
    </div>
  )
}

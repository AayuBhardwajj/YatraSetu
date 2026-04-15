import { Skeleton } from '@/components/ui/skeleton'

export default function HomeLoading() {
  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
      <div className="flex-[3] h-full relative border-r border-border/50">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-5 left-5">
          <Skeleton className="w-44 h-9 rounded-full" />
        </div>
        <div className="absolute top-5 right-5">
          <Skeleton className="w-36 h-9 rounded-full" />
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <Skeleton className="w-full h-16 rounded-2xl" />
        </div>
      </div>
      <div className="flex-[2] h-full bg-white p-6 space-y-8 min-w-[320px] max-w-[420px]">
        <div className="space-y-3">
          <Skeleton className="w-40 h-6 rounded" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-16 rounded-2xl" />
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="w-32 h-5 rounded" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-12 rounded-xl" />
          ))}
        </div>
        <Skeleton className="w-full h-28 rounded-2xl" />
      </div>
    </div>
  )
}

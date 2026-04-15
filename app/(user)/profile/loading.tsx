import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileLoading() {
  return (
    <div className="max-w-[1100px] mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="w-56 h-8 rounded-xl" />
          <Skeleton className="w-80 h-4 rounded" />
        </div>
        <Skeleton className="w-24 h-10 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <Skeleton className="h-[460px] rounded-3xl" />
        </div>
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="h-[280px] rounded-3xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-[120px] rounded-2xl" />
            <Skeleton className="h-[120px] rounded-2xl" />
          </div>
          <Skeleton className="h-[100px] rounded-3xl" />
        </div>
      </div>
    </div>
  )
}

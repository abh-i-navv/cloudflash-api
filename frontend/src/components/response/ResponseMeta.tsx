import { useRequestStore } from "@/store/requestStore"

export default function ResponseMeta() {
  const responseStatus = useRequestStore((state) => state.responseStatus)
  const responseTime = useRequestStore((state) => state.responseTime)
  const responseSize = useRequestStore((state) => state.responseSize)


  return (
      <div className="flex gap-3 text-sm mb-4">
    
    <div className="px-3 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">
      {responseStatus} OK
    </div>

    <div className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
      {responseTime}ms
    </div>

    <div className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
      {responseSize}
    </div>
  </div>
  )
}
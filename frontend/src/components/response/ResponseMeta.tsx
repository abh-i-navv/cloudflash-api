import { useRequestStore } from "@/store/requestStore"

function getStatusText(status: number, error: string) {
  if (error || status ===0) {
    return "Request Failed"
  }

  switch(status) {
    case 200:
      return "200 OK"

    case 201:
      return "201 Created"

    case 204:
      return "204 No Content"

    case 400:
      return "400 Bad Request"

    case 401:
      return "401 Unauthorized"

    case 403:
      return "403 Forbidden"

    case 404:
      return "404 Not Found"

    case 500:
      return "500 Server Error"

    default:
      return `${status}`

  }
}

export default function ResponseMeta() {
  //response state
  const responseStatus = useRequestStore((state) => state.responseStatus)
  const responseTime = useRequestStore((state) => state.responseTime)
  const responseSize = useRequestStore((state) => state.responseSize)

  //error state
  const error = useRequestStore((state) => state.error)
  const isError = error || responseStatus >= 400 || responseStatus === 0
  return (
      <div className="flex gap-3 text-sm mb-4">
    
    <div className={`"px-3 py-1 rounded-md border" ${isError ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20" }`}>
      {getStatusText(responseStatus, error)}
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